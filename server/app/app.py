import io
import os
import wave
from flask import Flask, jsonify, request, make_response, g
from flask_cors import CORS, cross_origin
from db import create_session
from models import Music, User, Comment, Folder, Music_Folders
import numpy as np
import scipy.io.wavfile
import wave
from pylab import frombuffer
import requests
import io
from scipy import signal
import matplotlib
from collections import OrderedDict
import json
import pyworld as pw
import datetime
from sqlalchemy.sql import func
import librosa
import matplotlib.pyplot as plt
from dtw import *
from jose import jwt
import urllib
from functools import wraps
import sys
import sqlalchemy.exc
app = Flask(__name__)
cors = CORS(app)


###認証#########################
class AuthError(Exception):
    def __init__(self, error, status_code):
        self.error = error
        self.status_code = status_code


def get_token_auth_header():
    """Obtains the access token from the Authorization Header
    """
    auth = request.headers.get("Authorization", None)
    if not auth:
        raise AuthError({"code": "authorization_header_missing",
                         "description":
                         "Authorization header is expected"}, 401)

    parts = auth.split()

    if parts[0].lower() != "bearer":
        raise AuthError({"code": "invalid_header",
                         "description":
                         "Authorization header must start with"
                         " Bearer"}, 401)
    elif len(parts) == 1:
        raise AuthError({"code": "invalid_header",
                         "description": "Token not found"}, 401)
    elif len(parts) > 2:
        raise AuthError({"code": "invalid_header",
                         "description":
                         "Authorization header must be"
                         " Bearer token"}, 401)

    token = parts[1]
    return token


def requires_auth(f):
    """Determines if the access token is valid
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        token = get_token_auth_header()
        jsonurl = urllib.request.urlopen(
            "https://auth.vdslab.jp/.well-known/jwks.json")
        jwks = json.loads(jsonurl.read())
        unverified_header = jwt.get_unverified_header(token)
        rsa_key = {}
        for key in jwks["keys"]:
            if key["kid"] == unverified_header["kid"]:
                rsa_key = key
        if rsa_key:
            try:
                payload = jwt.decode(
                    token,
                    rsa_key,
                    algorithms=['RS256'],
                    audience="https://musicvis-3wi5srugvq-an.a.run.app",
                    issuer="https://auth.vdslab.jp/"
                )
            except jwt.ExpiredSignatureError:
                raise AuthError({"code": "token_expired",
                                 "description": "token is expired"}, 401)
            except jwt.MissingRequiredClaimError:
                raise AuthError({"code": "invalid_claims",
                                 "description":
                                 "incorrect claims,"
                                 "please check the audience and issuer"}, 401)
            except Exception:
                raise AuthError({"code": "invalid_header",
                                 "description":
                                 "Unable to parse authentication"
                                 " token."}, 400)

            g.current_user = payload
            # print("-----------")
            # print(payload)
            return f(*args, **kwargs)
        raise AuthError({"code": "invalid_header",
                         "description": "Unable to find appropriate key"}, 400)
    return decorated


################################

@app.route('/musics', methods=['GET'])
@requires_auth
def get_musics():
    session = create_session()
    user_id = g.current_user['sub']
    print(user_id)
    # get user list
    user_t = session.query(User).all()
    user_list = list(user_t[i].id for i in range(len(user_t)))
    registered = False
    # check registerd
    for _id in user_list:
        if _id == user_id:
            registered = True
            break
    # register
    if registered == False:
        u = User(id=user_id)
        session.add(u)
        session.commit()

    musics = session.query(Music).filter_by(user_id=user_id).all()
    musics = [m.to_json() for m in musics]
    musics.reverse()
    print(musics)
    session.close()
    return jsonify(musics)


# 該当フォルダの曲のリストを返す
@app.route('/musics/folder/<folder_id>', methods=['GET'])
@requires_auth
def get_folder_musics(folder_id):
    session = create_session()
    user_id = g.current_user['sub']
    musics = session.query(Music_Folders).filter_by(
        user_id=user_id, folder_id=folder_id).all()
    musics = [m.to_json() for m in musics]
    music_ids = []
    for i in range(len(musics)):
        music_ids.append(musics[i]["music_id"])

    all_music = session.query(Music).filter_by(user_id=user_id)
    all_music = [m.to_json() for m in all_music]
    fol_music = []
    for i in range(len(all_music)):
        if all_music[i]["id"] in music_ids:
            fol_music.append(all_music[i])
    print(fol_music)

    session.close()
    return jsonify(fol_music)


@ app.route('/<user_id>/musics', methods=['PUT'])
@ requires_auth
def put_music(user_id):
    session = create_session()
    user_id = g.current_user['sub']
    music = Music(user_id=user_id, content=request.data, name="music")
    session.add(music)
    session.commit()
    session.close()
    print("ok")
    return 'received'

# 曲ごとのコメントのリストを返す


@ app.route('/<user_id>/musics/<music_id>/comments', methods=['GET'])
@ requires_auth
def get_comment(user_id, music_id):
    session = create_session()
    user_id = g.current_user['sub']
    comment = session.query(Comment).filter_by(
        music_id=music_id, user_id=user_id).all()
    comment = [m.to_json() for m in comment]
    session.close()
    return jsonify(comment)


@ app.route('/<user_id>/musics/<music_id>/comments', methods=['PUT'])
@ requires_auth
def put_comment(user_id, music_id):
    session = create_session()
    user_id = g.current_user['sub']
    comment = Comment(music_id=music_id,
                      text=request.data.decode(), user_id=user_id)
    session.add(comment)
    session.commit()
    return 'message reseived'


"""
# 使ってる？
@app.route('/<user_id>/musics/<music_id>/<folder_id>', methods=['PUT'])
def put_music_folders2(user_id, music_id, folder_id):
    session = create_session()
    user_id = "auth0|5f6381061d80b10078e6515a"
    data = Music_Folders(
        user_id=user_id, music_id=music_id, folder_id=folder_id)
    session.add(data)
    session.commit()
    return 'reseived'
"""


@ app.route('/<user_id>/musics/put_folders/<music_id>', methods=['PUT'])
@ requires_auth
def put_music_folder(user_id, music_id):
    user_id = g.current_user['sub']
    folder_ids = request.data.decode()
    folder_ids = list(map(str, folder_ids[:-1].split(',')))
    ids = []
    for i in folder_ids:
        ids.append(int(i))
    print(ids)
    session = create_session()
    for folder_id in ids:
        data = Music_Folders(
            user_id=user_id, music_id=music_id, folder_id=folder_id)
    session.add(data)
    session.commit()
    return 'reseived'


# フォルダの変更
@app.route('/1/musics/<music_id>/change_folder/<folder_id>', methods={"PUT"})
@requires_auth
def change_folder(music_id, folder_id):
    session = create_session()
    # user_id = res_user_id()
    user_id = g.current_user['sub']
    data = session.query(Music_Folders).filter_by(
        user_id=user_id, music_id=music_id).first()
    print("fol", folder_id)
    print("data= ", data.to_json())
    if data != None:
        data.folder_id = folder_id
    else:
        print("hahahaha")
        data = Music_Folders(
            user_id=user_id, music_id=music_id, folder_id=folder_id)

    print("data= ", data.to_json())
    session.add(data)
    session.commit()
    session.close()
    return "fin"

# フォルダの追加


@app.route('/<user_id>/musics/folder_name', methods=['PUT'])
@requires_auth
def put_folder_name(user_id):
    session = create_session()
    user_id = g.current_user['sub']
    print(request.data.decode())
    folderName = Folder(name=request.data.decode(), user_id=user_id)
    session.add(folderName)
    session.commit()

    folder = session.query(Folder).filter_by(user_id=user_id).all()
    folder = [f.to_json() for f in folder]
    session.close()
    return jsonify(folder)


# フォルダのリストを返す
@app.route('/<user_id>/musics/folders2', methods=['GET'])
@requires_auth
def put_folder2(user_id):
    session = create_session()
    user_id = g.current_user['sub']
    folder = session.query(Folder).filter_by(user_id=user_id).all()
    folder = [f.to_json() for f in folder]
    session.close()
    return jsonify(folder)


@app.route('/<user_id>/musics/<music_id>/music_name', methods=['GET'])
@requires_auth
def get_music_name(user_id, music_id):
    session = create_session()
    user_id = g.current_user['sub']
    musics = session.query(Music).filter_by(
        user_id=user_id, id=music_id).first()
    musics = musics.to_json()
    music_name = musics['name']
    session.close()
    return jsonify(music_name)


@app.route('/<user_id>/musics/change_name/<music_id>', methods=['PUT'])
@requires_auth
def change_name(user_id, music_id):
    session = create_session()
    user_id = g.current_user['sub']
    musics = session.query(Music).filter_by(
        user_id=user_id, id=music_id).first()
    musics.name = request.data.decode()
    # musics = musics.to_json()
    session.add(musics)
    session.commit()
    session.close()
    return jsonify("reseive")


# 録音データの削除
@app.route('/<user_id>/musics/delete/<music_id>', methods=['DELETE'])
@requires_auth
def delete(user_id, music_id):
    session = create_session()
    user_id = g.current_user['sub']
    musics = session.query(Music).filter_by(
        user_id=user_id, id=music_id).first()
    session.query(Comment).filter_by(
        music_id=music_id, user_id=user_id).delete()
    session.query(Music_Folders).filter_by(
        user_id=user_id, music_id=music_id).delete()
    session.delete(musics)
    # session.delete(comments)
    session.commit()
    session.close()

    musics = session.query(Music).filter_by(user_id=user_id).all()
    musics = [m.to_json() for m in musics]
    musics.reverse()
    session.close()
    print(musics)
    return jsonify(musics)


@app.route('/<user_id>/musics/delete/<music_id>/from/<folder_id>', methods=['DELETE'])
@requires_auth
def delete_from_folder(user_id, music_id, folder_id):
    session = create_session()
    # user_id = "auth0|5f6381061d80b10078e6515a"
    user_id = g.current_user['sub']
    session.query(Music_Folders).filter_by(
        user_id=user_id, music_id=music_id, folder_id=folder_id).delete()
    session.commit()
    session.close()
    print("Delete function")
    return "delete"


@app.route('/<user_id>/musics/delete_folder/<folder_id>', methods=['DELETE'])
@requires_auth
def delete_folder(user_id, folder_id):
    session = create_session()
    user_id = g.current_user['sub']
    session.query(Folder).filter_by(user_id=user_id, id=folder_id).delete()
    session.query(Music_Folders).filter_by(
        user_id=user_id, folder_id=folder_id).delete()
    session.commit()
    folder = session.query(Folder).filter_by(user_id=user_id).all()
    folder = [f.to_json() for f in folder]
    session.close()
    print("Delete function")
    return jsonify(folder)


@app.route('/<user_id>/musics/delete_comment/<comment_id>', methods=['DELETE'])
@requires_auth
def delete_comment(user_id, comment_id):
    session = create_session()
    user_id = g.current_user['sub']
    session.query(Comment).filter_by(id=comment_id, user_id=user_id).delete()
    session.commit()
    session.close()
    print("Delete comment function")
    return "delete_comment"


@app.route('/<user_id>/musics/folders', methods=['GET'])
@requires_auth
def get_music_folders(user_id):
    session = create_session()
    user_id = g.current_user['sub']
    data = session.query(Music_Folders).filter_by(user_id=user_id).all()
    data = [m.to_json() for m in data]
    session.close()
    return jsonify(data)


"""
# 使ってなさげ
@app.route('/<user_id>/musics/<music_id>/folders', methods=['GET'])
def get_foledrs(user_id, music_id):
    session = create_session()
    folder = session.query(Folder).filter_by(user_id=user_id).all()
    folder = [m.to_json() for m in folder]
    session.close()
    return jsonify(folder)
"""

# nameの変更あるから保留、名前未入力の場合のエラー(続行は出来る)


@app.route('/<user_id>/musics/folder_name/<folder_id>', methods=['GET'])
@requires_auth
def get_folderName(user_id, folder_id):
    session = create_session()
    user_id = g.current_user['sub']
    folder = session.query(Folder).filter_by(
        user_id=user_id, id=folder_id).all()
    folder = [f.to_json() for f in folder]
    session.close()
    return jsonify(folder[0]['name'])


@app.route('/<user_id>/musics/<music_id>/content', methods=['GET'])
# 照らし合わせが出来てない
def get_music_content(user_id, music_id):
    session = create_session()
    user_id = "auth0|5f6381061d80b10078e6515a"
    response = make_response()
    music = session.query(Music).filter_by(
        user_id=user_id, id=music_id).first()
    # music = session.query(Music).get(music_id)
    response.data = music.content
    response.mimetype = "audio/wav"
    session.close()
    print(user_id, music_id)
    return response


@app.route('/user_id', methods=['GET'])
@requires_auth
def res_user_id():
    user_id = g.current_user['sub']
    return jsonify(user_id)


# 使ってなさげ
# @app.route('/<user_id>/musics/<music_id>/created', methods=['GET'])


def create(user_id, music_id):
    session = create_session()
    music = session.query(Music).get(music_id)
    date = music.created
    session.close()
    return jsonify(date)

#####################################################


def manhattan_distance(x, y): return np.abs(x - y)


@app.route('/<user_id>/musics/folder_freq_compare/<folder_id>', methods=['GET'])
@requires_auth
def put_comp_freqData(user_id, folder_id):
    session = create_session()
    user_id = g.current_user['sub']
    folder = session.query(Music_Folders).filter_by(
        user_id=user_id, folder_id=folder_id).all()
    folder = [f.to_json() for f in folder]
    music_ids = []
    for i in range(len(folder)):
        music_ids.append(folder[i]['music_id'])
    music_ids = list(set(music_ids))
    music_ids.sort()
    cnt = min(len(music_ids), 10)
    music_ids = music_ids[-1*cnt:]

    preData = []

    for _id in music_ids:
        data = dtw_frequency_data(user_id, _id)
        start, end = find_start_end(user_id, _id)
        data = trim(data, start, end)
        data = np.array(data)
        preData.append(data)

    # print(preData)
    path = []
    Datas = []
    if len(preData) == 1:
        data = []
        d = list(preData[0])
        for i in range(len(d)):
            dic = {
                "x": i+1,
                "y": d[i]
            }
            data.append(dic)

        Datas.append({"id": music_ids[0], "data": data})

    else:
        # print(len(preData))
        print(music_ids)
        for i in range(len(preData)):
            print(len(preData[i]))
           # print(preData[i][:1000])
        for i in range(1, len(preData)):
            alignment = dtw(preData[0], preData[i], keep_internals=True)

            if i == 1:
                aliged_data = preData[0][alignment.index1]
                aliged_data = list(aliged_data)
                data = []
                for j in range(len(aliged_data)):
                    dic = {
                        "x": j+1,
                        "y": aliged_data[j]
                    }
                    data.append(dic)
                Datas.append({"id": music_ids[0], "data": data})

            aliged_data = preData[i][alignment.index2]
            aliged_data = list(aliged_data)
            # print(aliged_data)
            data = []
            for j in range(len(aliged_data)):
                dic = {
                    "x": j+1,
                    "y": round(aliged_data[j], 4)
                }
                data.append(dic)
            Datas.append({"id": music_ids[i], "data": data})
            print("fin"+str(i))
            print(len(Datas))
        print(Datas)
        print("finish")
        session.close()
    return jsonify(Datas)

# parallelCoordinates


@app.route('/<user_id>/musics/parallel/<folder_id>', methods=['PUT', 'GET'])
@requires_auth
def parallel_data(user_id, folder_id):
    session = create_session()
    user_id = g.current_user['sub']
    folder = session.query(Music_Folders).filter_by(
        user_id=user_id, folder_id=folder_id).all()
    folder = [f.to_json() for f in folder]
    music_ids = []
    for i in range(len(folder)):
        music_ids.append(folder[i]['music_id'])
    music_ids = list(set(music_ids))
    music_ids.sort()
    cnt = min(len(music_ids), 10)
    music_ids = music_ids[-1*cnt:]
    print(music_ids)

    Datas = []
    for _id in music_ids:
        # Datas.append([_id, frequency_ave_data(user_id, _id), fourier_roll_data(
        #    user_id, _id), round(decibel_ave_data(user_id, _id), 4)])
        Datas.append([_id, frequency_ave_data(user_id, _id),  spectrum_rollofff_ave_data(
            user_id, _id), round(decibel_ave_data(user_id, _id), 4)])

    """
    Datas = sorted(Datas, key=lambda x: x[2])
    for i in range(len(Datas)):
        Datas[i].append(Datas[i][1]+Datas[i][3] +
                        ((Datas[-1][2]-Datas[i][2])/10000))
    Datas = sorted(Datas, key=lambda x: x[4])
    print(Datas)
    """
    for i in range(len(Datas)):
        Datas[i].append(Datas[i][1]+Datas[i][3] + Datas[i][2]/100)
    Datas = sorted(Datas, key=lambda x: x[4])
    dicDatas = []
    for i in range(len(Datas)-1, -1, -1):
        dic = {
            "No.": Datas[i][0],
            "pich": Datas[i][1],
            "tone": Datas[i][2]/100,
            "volume": Datas[i][3],
        }
        dicDatas.append(dic)

    session.close()
    print(dicDatas)
    return jsonify(dicDatas)


# 精進グラフ
@ app.route('/<user_id>/musics/progress/<folder_id>', methods=['PUT', 'GET'])
@ requires_auth
def progress(user_id, folder_id):
    session = create_session()
    user_id = g.current_user['sub']
    folder = session.query(Music_Folders).filter_by(
        user_id=user_id, folder_id=folder_id).all()
    folder = [f.to_json() for f in folder]
    music_ids = []
    for i in range(len(folder)):
        music_ids.append(folder[i]['music_id'])
    music_ids = list(set(music_ids))
    music_ids.sort()

    Datas = []
    for _id in music_ids:
        # Datas.append([_id, frequency_ave_data(user_id, _id), fourier_roll_data(
        #    user_id, _id), round(decibel_ave_data(user_id, _id), 4)])
        Datas.append([_id, frequency_ave_data(user_id, _id),  spectrum_rollofff_ave_data(
            user_id, _id), round(decibel_ave_data(user_id, _id), 4)])

    # Datas = sorted(Datas, key=lambda x: x[2])
    """
    for i in range(len(Datas)):
        Datas[i].append(-1*(Datas[i][1]+Datas[i][3] +
                            ((Datas[-1][2]-Datas[i][2])/10000)))
    """
    for i in range(len(Datas)):
        Datas[i].append(-1*(Datas[i][1]+Datas[i][3] + Datas[i][2]/100))

    dicDatas = []
    for i in range(len(Datas)):
        dic = {
            "x": Datas[i][0],
            "y": round(Datas[i][4], 4)
        }
        dicDatas.append(dic)
    session.close()
    return jsonify(dicDatas)


#　波形
@ app.route('/<user_id>/musics/<music_id>/amplitude', methods=['GET'])
@ requires_auth
def amplitude(user_id, music_id):
    session = create_session()
    user_id = g.current_user['sub']
    music = session.query(Music).filter_by(
        user_id=user_id, id=music_id).first()
    # music = session.query(Music).get(music_id)
    wf = wave.open(io.BytesIO(music.content))
    buffer = wf.readframes(wf.getnframes())
    # 縦:振幅 2バイトずつ整理(-32768から32767)
    data = frombuffer(buffer, dtype="int16")
    # 横:サンプル数or時間
    x = len(data)  # サンプル数
    # 時間/サンプル数で1サンプル当たりの秒数→データの範囲絞ったとき時間表示するのに使う？
    # time = float(wf.getnframes()) / wf.getframerate()
    Datas = []
    for i in range(x):
        dic = {
            "x": i+1,
            "y": int(data[i])
        }
        Datas.append(dic)
    session.close()
    return jsonify(Datas)


# フーリエ変換
@ app.route('/<user_id>/musics/<music_id>/fourier', methods=['GET'])
@ requires_auth
def fourier(user_id, music_id):
    session = create_session()
    user_id = g.current_user['sub']
    # music = session.query(Music).filter_by(user_id=user_id, id=music_id).first()
    music = session.query(Music).get(music_id)
    rate, data = scipy.io.wavfile.read(io.BytesIO(music.content))
    # data, _ = librosa.effects.trim(data, 45)
    data = data/32768  # 振幅の配列らしい
    fft_data = np.abs(np.fft.fft(data))  # 縦:dataを高速フーリエ変換
    freList = np.fft.fftfreq(data.shape[0], d=1.0/rate)  # 横:周波数の取得

    pairData = []
    preNum = 0
    max_fft = 0
    for i in range(len(fft_data)):
        if 0 < freList[i] and freList[i] <= 8000:  # 24000に合わせた方がいいかも
            if int(freList[i]) != preNum:
                pairData.append([preNum, max_fft])
                preNum = int(freList[i])
                max_fft = 0
            if max_fft <= fft_data[i]:
                max_fft = fft_data[i]

    # print(pairData)
    # print(max(freList))

    Datas = []
    # print(len(freList))
    for i in range(min(6000, len(pairData))):  # len(fft_data)):
        if i % 10 == 0:
            dic = {
                "x": pairData[i][0],
                "y": pairData[i][1],
            }
            Datas.append(dic)

    """
    for i in range(min(1000, len(fft_data))):  # len(fft_data)):
        if 0 < freList[i] and freList[i] < 4000:  # 周波数の範囲
            dic = {
                # "x": '{:.4f}'.format(freList[i]),
                "x": int(freList[i]),
                "y": fft_data[i]
            }
            Datas.append(dic)
    """
    session.close()
    fourier_roll(user_id, music_id)
    return jsonify(Datas)


# フーリエ変換　ロールオフ
@ app.route('/<user_id>/musics/<music_id>/fourier_roll', methods=['GET'])
def fourier_roll(user_id, music_id):
    session = create_session()
    music = session.query(Music).get(music_id)
    rate, data = scipy.io.wavfile.read(io.BytesIO(music.content))
    # data, _ = librosa.effects.trim(data, 45)
    data = data/32768  # 振幅の配列らしい
    fft_data = np.abs(np.fft.fft(data))  # 縦:dataを高速フーリエ変換
    freList = np.fft.fftfreq(data.shape[0], d=1.0/rate)  # 横:周波数の取得
    print("pre len="+str(max(freList)))
    pairData = []
    preNum = 0
    max_fft = 0
    for i in range(len(fft_data)):
        if 0 < freList[i] and freList[i] <= 24000:  # 24000はサンプリング周波数/2
            if int(freList[i]) != preNum:
                pairData.append([preNum, max_fft])
                preNum = int(freList[i])
                max_fft = 0
            if max_fft <= fft_data[i]:
                max_fft = fft_data[i]

    total = 0
    print("data lend="+str(len(pairData)))
    for i in range(len(pairData)):
        total += pairData[i][1]

    eight = total*0.85
    total2 = 0
    idx = -1
    for i in range(len(pairData)):
        total2 += pairData[i][1]
        if total2 >= eight:
            idx = i
            break
    # print(total)
    # print(eight)
    # print(idx)

    session.close()
    return jsonify(idx)


def fourier_roll_data(user_id, music_id):
    session = create_session()
    music = session.query(Music).get(music_id)
    rate, data = scipy.io.wavfile.read(io.BytesIO(music.content))
    # data, _ = librosa.effects.trim(data, 45)
    data = data/32768  # 振幅の配列らしい
    fft_data = np.abs(np.fft.fft(data))  # 縦:dataを高速フーリエ変換
    freList = np.fft.fftfreq(data.shape[0], d=1.0/rate)  # 横:周波数の取得

    pairData = []
    preNum = 0
    max_fft = 0
    for i in range(len(fft_data)):
        if 0 < freList[i] and freList[i] < 8000:
            if int(freList[i]) != preNum:
                pairData.append([preNum, max_fft])
                preNum = int(freList[i])
                max_fft = 0
            if max_fft <= fft_data[i]:
                max_fft = fft_data[i]

    total = 0
    for i in range(len(pairData)):
        total += pairData[i][1]

    eight = total*0.85
    total2 = 0
    idx = -1
    for i in range(len(pairData)):
        total2 += pairData[i][1]
        if total2 >= eight:
            idx = i
            break

    session.close()
    return idx


# スペクトログラム
@ app.route('/<user_id>/musics/<music_id>/spectrogram', methods=['GET'])
@ requires_auth
def spectrogram(user_id, music_id):
    session = create_session()
    user_id = g.current_user['sub']
    music = session.query(Music).filter_by(
        user_id=user_id, id=music_id).first()
    music = session.query(Music).get(music_id)
    rate, data = scipy.io.wavfile.read(io.BytesIO(music.content))
    f, time, Sxx = signal.stft(data, rate)
    Sxx = np.log(np.abs(Sxx))
    # Sxxを0から1に正規化
    # norm = matplotlib.colors.Normalize(vmin=-1, vmax=1)
    # cm = matplotlib.pyplot.get_cmap("jet")
    # colors = cm(norm(Sxx))  # RGB
    Datas = []

    for i in range(min(100, len(f)), -1, -1):
        dic = OrderedDict()
        dic["y"] = '{:.4f}'.format(f[i])
        for j in range(min(100, len(time))):
            # key = str('{:.4f}'.format(time[j]))
            key = str(j)
            dic[key] = '{:.4f}'.format(Sxx[i][j])
        Datas.append(dic)
    session.close()
    return jsonify(Datas)


# デシベル値
@ app.route('/<user_id>/musics/<music_id>/decibel', methods=['GET'])
@ requires_auth
def decibel(user_id, music_id):
    session = create_session()
    user_id = g.current_user['sub']
    music = session.query(Music).filter_by(
        user_id=user_id, id=music_id).first()
    # music = session.query(Music).get(music_id)
    rate, data = scipy.io.wavfile.read(io.BytesIO(music.content))
    print(rate)
    data = data.astype(np.float)
    S = np.abs(librosa.stft(data))
    db = librosa.amplitude_to_db(S, ref=np.max)
    dbLine = []
    for i in range(len(db[0])):
        _max = -20
        for j in range(len(db)):
            if _max <= db[j][i]:
                _max = db[j][i]
        dbLine.append(_max)

    start = 0
    end = 0
    for i in range(len(dbLine)):
        if dbLine[i] > -20:
            start = i
            break
    for i in range(len(dbLine)-1, -1, -1):
        if dbLine[i] > -20:
            end = i
            break

    Datas = []
    # for i in range(len(dbLine)):
    if end < len(dbLine)-2:
        end += 1
    for i in range(start, end):
        dic = {
            "x": i+1,
            "y": int(dbLine[i])
        }
        Datas.append(dic)
    session.close()
    print(len(Datas))
    return jsonify(Datas)


def decibel_data(user_id, music_id):
    session = create_session()
    music = session.query(Music).filter_by(
        user_id=user_id, id=music_id).first()
    # music = session.query(Music).get(music_id)
    rate, data = scipy.io.wavfile.read(io.BytesIO(music.content))
    data = data.astype(np.float)
    S = np.abs(librosa.stft(data))
    db = librosa.amplitude_to_db(S, ref=np.max)
    dbLine = []
    for i in range(len(db[0])):
        _max = -80  # トリミングデシベル値設定
        for j in range(len(db)):
            if _max < db[j][i]:
                _max = db[j][i]
        dbLine.append(_max)
    """
    Datas = []
    for i in range(len(dbLine)):
        dic = {
            "x": i+1,
            "y": int(dbLine[i])
        }
        Datas.append(dic)
    """
    session.close()
    return dbLine


def find_start_end(user_id, music_id):
    decibelData = decibel_data(user_id, music_id)
    start = 0
    end = 0
    for i in range(len(decibelData)):
        if decibelData[i] > -20:
            start = i
            break
    for i in range(len(decibelData)-1, -1, -1):
        if decibelData[i] > -20:
            end = i
            break
    return [start, end]

# デシベル値　平均


@ app.route('/<user_id>/musics/<music_id>/decibel/ave', methods=['GET'])
@ requires_auth
def decibel_ave(user_id, music_id):
    session = create_session()
    user_id = g.current_user['sub']
    music = session.query(Music).filter_by(
        user_id=user_id, id=music_id).first()
    # music = session.query(Music).get(music_id)
    rate, data = scipy.io.wavfile.read(io.BytesIO(music.content))
    data = data.astype(np.float)
    S = np.abs(librosa.stft(data))
    db = librosa.amplitude_to_db(S, ref=np.max)
    dbLine = []
    for i in range(len(db[0])):
        _max = -80
        for j in range(len(db)):
            if _max < db[j][i]:
                _max = db[j][i]
                dbLine.append(_max)

    start = 0
    end = 0
    for i in range(len(dbLine)):
        if dbLine[i] > -20:
            start = i
            break
    for i in range(len(dbLine)-1, -1, -1):
        if dbLine[i] > -20:
            end = i
            break

    cnt = 0
    total = 0
    if end < len(dbLine)-2:
        end += 1
    for i in range(start, end):
        if not(dbLine[i] == 0 or dbLine[i+1] == 0):
            total += abs(dbLine[i]-dbLine[i+1])
            cnt += 1

    ave = total/cnt
    session.close()
    return jsonify(ave)


def decibel_ave_data(user_id, music_id):
    session = create_session()
    music = session.query(Music).filter_by(
        user_id=user_id, id=music_id).first()
    rate, data = scipy.io.wavfile.read(io.BytesIO(music.content))
    data = data.astype(np.float)
    S = np.abs(librosa.stft(data))
    db = librosa.amplitude_to_db(S, ref=np.max)
    dbLine = []
    for i in range(len(db[0])):
        _max = -80
        for j in range(len(db)):
            if _max < db[j][i]:
                _max = db[j][i]
        dbLine.append(_max)

    start = 0
    end = 0
    for i in range(len(dbLine)):
        if dbLine[i] > -20:
            start = i
            break
    for i in range(len(dbLine)-1, -1, -1):
        if dbLine[i] > -20:
            end = i
            break

    total = 0
    cnt = 0
    if end < len(dbLine)-2:
        end += 1
    for i in range(0, end):
        if not(dbLine[i] == 0 or dbLine[i+1] == 0):
            total += abs(dbLine[i]-dbLine[i+1])
            cnt += 1

    ave = total/cnt
    session.close()
    return ave


def trim(data, start, end):
    res = []
    print(start, end, len(data))
    if end < len(data)-2:
        end += 1
    for i in range(start, end):
        res.append(data[i])
    return res


@ app.route('/<user_id>/musics/folder_comp_volume/<folder_id>', methods=['GET'])
@ requires_auth
def comp_decibel(user_id, folder_id):
    session = create_session()
    user_id = g.current_user['sub']
    folder = session.query(Music_Folders).filter_by(
        user_id=user_id, folder_id=folder_id).all()
    folder = [f.to_json() for f in folder]
    music_ids = []
    for i in range(len(folder)):
        music_ids.append(folder[i]['music_id'])
    music_ids = list(set(music_ids))
    music_ids.sort()
    cnt = min(len(music_ids), 10)
    music_ids = music_ids[-1*cnt:]
    print(music_ids)

    preData = []

    for _id in music_ids:
        data = decibel_data(user_id, _id)
        start, end = find_start_end(user_id, _id)
        data = trim(data, start, end)
        data = np.array(data)
        preData.append(data)

    # print(preData)
    path = []
    Datas = []
    if len(preData) == 1:
        data = []
        d = list(preData[0])
        for i in range(len(d)):
            dic = {
                "x": i+1,
                "y": str(d[i])
            }
            data.append(dic)

        Datas.append({"id": music_ids[0], "data": data})

    else:
        print(len(preData))
        for i in range(1, len(preData)):
            alignment = dtw(preData[0], preData[i], keep_internals=True)

            if i == 1:
                aliged_data = preData[0][alignment.index1]
                aliged_data = list(aliged_data)
                data = []
                for j in range(len(aliged_data)):
                    dic = {
                        "x": j+1,
                        "y": str(aliged_data[j])
                    }
                    data.append(dic)
                Datas.append({"id": music_ids[0], "data": data})

            aliged_data = preData[i][alignment.index2]
            aliged_data = list(aliged_data)

            data = []
            for j in range(len(aliged_data)):
                dic = {
                    "x": j+1,
                    "y": str(aliged_data[j])
                }
                data.append(dic)
            Datas.append({"id": music_ids[i], "data": data})
            print("fin")
        print("all clear")
        session.close()
    return jsonify(Datas)


# 基本周波数
@ app.route('/<user_id>/musics/<music_id>/frequency', methods=['GET'])
@ requires_auth
def frequency(user_id, music_id):
    session = create_session()
    user_id = g.current_user['sub']
    music = session.query(Music).filter_by(
        user_id=user_id, id=music_id).first()
    music = session.query(Music).get(music_id)

    data, rate = librosa.load(io.BytesIO(music.content), 48000)
    data = data.astype(np.float)
    f0, voiced_flag, voiced_probs = librosa.pyin(
        data, fmin=librosa.note_to_hz('C2'), fmax=librosa.note_to_hz('C7'))

    start, end = find_start_end(user_id, music_id)
    Datas = []
    if end < len(f0)-2:
        end += 1
    for i in range(max(0, start), end):
        if f0[i] >= 0:
            dic = {
                "x": i+1,
                "y": round(f0[i], 4)
            }
        else:
            dic = {
                "x": i+1,
                "y": 0
            }
        Datas.append(dic)
    session.close()
    print(len(Datas))
    print(Datas)

    # print(Datas)

    return jsonify(Datas)


@ app.route('/<user_id>/musics/<music_id>/frequency/ave', methods=['GET'])
@ requires_auth
def frequency_ave(user_id, music_id):
    session = create_session()
    user_id = g.current_user['sub']
    music = session.query(Music).filter_by(
        user_id=user_id, id=music_id).first()
    # music = session.query(Music).get(music_id)
    rate, data = scipy.io.wavfile.read(io.BytesIO(music.content))
    data = data.astype(np.float)
    """
    _f0, _time = pw.dio(data, rate, f0_floor=70,
                        f0_ceil=1600, frame_period=10.625)
    f0 = pw.stonemask(data, _f0, _time, rate)
    """
    f0, voiced_flag, voiced_probs = librosa.pyin(
        data, fmin=librosa.note_to_hz('C2'), fmax=librosa.note_to_hz('C7'))

    start, end = find_start_end(user_id, music_id)
    total = 0
    cnt = 0
    if end < len(f0)-2:
        end += 1
    for i in range(max(0, start), end):
        if f0[i] >= 0 and f0[i+1] >= 0 and (not(f0[i] == 0 or f0[i+1] == 0)):
            if f0[i] > 0 and (not(f0[i] == 0 or f0[i+1] == 0)):
                total += abs(f0[i]-f0[i+1])
                cnt += 1

    print(total)
    ave = total/cnt
    print("ave = " + str((ave)))
    session.close()
    ave = round(ave, 4)
    return jsonify(ave)


def frequency_ave_data(user_id, music_id):
    session = create_session()
    music = session.query(Music).filter_by(
        user_id=user_id, id=music_id).first()
   # music = session.query(Music).get(music_id)
    rate, data = scipy.io.wavfile.read(io.BytesIO(music.content))
    data = data.astype(np.float)
    """
    _f0, _time = pw.dio(data, rate, f0_floor=70,
                        f0_ceil=1600, frame_period=10.625)
    f0 = pw.stonemask(data, _f0, _time, rate)
    """
    f0, voiced_flag, voiced_probs = librosa.pyin(
        data, fmin=librosa.note_to_hz('C2'), fmax=librosa.note_to_hz('C7'))

    start, end = find_start_end(user_id, music_id)
    total = 0
    cnt = 0
    if end < len(f0)-2:
        end += 1
    for i in range(max(0, start), end):
        if f0[i] >= 0 and f0[i+1] >= 0 and (not(f0[i] == 0 or f0[i+1] == 0)):
            # print(f0[i])
            total += abs(f0[i]-f0[i+1])
            cnt += 1

    print(total)
    ave = total/cnt
    print("ave = " + str((ave)))
    session.close()
    ave = round(ave, 4)
    return ave


def frequency_data(user_id, music_id):
    session = create_session()
    music = session.query(Music).filter_by(
        user_id=user_id, id=music_id).first()
    # music = session.query(Music).get(music_id)
    rate, data = scipy.io.wavfile.read(io.BytesIO(music.content))
    data = data.astype(np.float)
    f0, voiced_flag, voiced_probs = librosa.pyin(
        data, fmin=librosa.note_to_hz('C2'), fmax=librosa.note_to_hz('C7'))

    Datas = []
    if end < len(f0)-2:
        end += 1
    for i in range(max(0, start), end):
        if f0[i] >= 0:
            dic = {
                "x": i+1,
                "y": round(f0[i], 4)
            }
        else:
            dic = {
                "x": i+1,
                "y": 0
            }

        Datas.append(dic)
    session.close()
    return Datas

# dtw用


def dtw_frequency_data(user_id, music_id):
    session = create_session()
    music = session.query(Music).filter_by(
        user_id=user_id, id=music_id).first()
   # music = session.query(Music).get(music_id)
    rate, data = scipy.io.wavfile.read(io.BytesIO(music.content))
    data = data.astype(np.float)
    #data, _ = librosa.effects.trim(data, 45)
    """
    _f0, _time = pw.dio(data, rate, f0_floor=70,
                        f0_ceil=1600, frame_period=10.625)
    f0 = pw.stonemask(data, _f0, _time, rate)
    """
    f0, voiced_flag, voiced_probs = librosa.pyin(
        data, fmin=librosa.note_to_hz('C2'), fmax=librosa.note_to_hz('C7'))
    session.close()
    return f0

# グラフ比較(基本周波数)

# 多分使ってない
# グラフ比較(基本周波数)


"""
@ app.route('/<user_id>/musics/<music_id>/comp_chart/<music_id2>', methods=['GET'])
def comp_chart(user_id, music_id, music_id2):
    Datas = []
    data = frequency_data(user_id, music_id)
    dic = {
        "id": music_id,
        "data": data
    }
    Datas.append(dic)
    data = frequency_data(user_id, music_id2)
    dic = {
        "id": music_id2,
        "data": data
    }
    Datas.append(dic)

    return jsonify(Datas)

"""
# --スペクトル重心--------
# @app.route('/<user_id>/musics/<music_id>/spectrum_centroid', methods=['GET'])


def spectrum_centroid(user_id, music_id):
    session = create_session()
    music = session.query(Music).filter_by(
        user_id=user_id, id=music_id).first()
    y, sr = librosa.load(io.BytesIO(music.content), 48000)
    cent = librosa.feature.spectral_centroid(y=y, sr=sr)
    start, end = find_start_end(user_id, music_id)
    Datas = []
    # for i in range(len(cent[0])):
    if end < len(cent[0]-2):
        end += 1
    for i in range(start, end):
        dic = {
            "x": i+1,
            "y": int(cent[0][i])
        }
        Datas.append(dic)
    session.close()
    # return jsonify(Datas)
    return Datas


# ----スペクトルロールオフ---------
# @app.route('/<user_id>/musics/<music_id>/spectrum_rolloff', methods=['GET'])
def spectrum_rollofff(user_id, music_id):
    session = create_session()
    music = session.query(Music).filter_by(
        user_id=user_id, id=music_id).first()

    y, sr = librosa.load(io.BytesIO(music.content), 48000)
    # , _ = librosa.effects.trim(y, 45)
    rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr)

    start, end = find_start_end(user_id, music_id)
    Datas = []
    if end < len(rolloff[0]-2):
        end += 1
    for i in range(start, end):
        # for i in range(len(rolloff[0])):
        dic = {
            "x": i+1,
            "y": int(rolloff[0][i])
        }
        Datas.append(dic)
    session.close()
    print(len(Datas))
    return Datas


@ app.route('/<user_id>/musics/<music_id>/rolloff_ave', methods=['GET'])
@ requires_auth
def spectrum_rollofff_ave(user_id, music_id):
    session = create_session()
    user_id = g.current_user['sub']
    music = session.query(Music).filter_by(
        user_id=user_id, id=music_id).first()
    # music = session.query(Music).get(music_id)
    y, sr = librosa.load(io.BytesIO(music.content), 48000)
    # 引数roll_percent=0.8がデフォ
    rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr)
    # print(rolloff)
    """
    Datas = []

    for i in range(len(rolloff[0])):
        dic = {
            "x": i+1,
            "y": int(rolloff[0][i])
        }
        Datas.append(dic)
    # return jsonify(Datas)
    """
    start, end = find_start_end(user_id, music_id)
    cnt = 0
    total = 0
    for i in range(start, end):
        if rolloff[0][i] < 4000 and rolloff[0][i+1] < 4000:
            total += abs(rolloff[0][i]-rolloff[0][i+1])
            cnt += 1
    if cnt != 0:
        ave = total/cnt
    else:
        ave = -1

    session.close()

    return jsonify(ave)


def spectrum_rollofff_ave_data(user_id, music_id):
    session = create_session()
    user_id = g.current_user['sub']
    music = session.query(Music).filter_by(
        user_id=user_id, id=music_id).first()
    # music = session.query(Music).get(music_id)
    y, sr = librosa.load(io.BytesIO(music.content), 48000)
    # 引数roll_percent=0.8がデフォ
    rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr)

    start, end = find_start_end(user_id, music_id)
    cnt = 0
    total = 0
    for i in range(start, end):
        if rolloff[0][i] < 4000 and rolloff[0][i+1] < 4000:
            total += abs(rolloff[0][i]-rolloff[0][i+1])
            cnt += 1
    if cnt != 0:
        ave = total/cnt
    else:
        ave = -1

    session.close()

    return ave


def spectrum_rollofff_y(user_id, music_id):
    session = create_session()
    music = session.query(Music).filter_by(
        user_id=user_id, id=music_id).first()
    # music = session.query(Music).get(music_id)
    y, sr = librosa.load(io.BytesIO(music.content), 48000)
    #y, _ = librosa.effects.trim(y, 45)
    # 引数roll_percent=0.8がデフォ
    rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr)
    # print(rolloff)
    Datas = []

    for i in range(len(rolloff[0])):
        Datas.append(int(rolloff[0][i]))
    # return jsonify(Datas)
    session.close()
    return Datas


# --フラットネス--------
@ app.route('/<user_id>/musics/<music_id>/spectrum_flatness', methods=['GET'])
@ requires_auth
def spectrum_flatness(user_id, music_id):
    session = create_session()
    user_id = g.current_user['sub']
    music = session.query(Music).filter_by(
        user_id=user_id, id=music_id).first()
    # music = session.query(Music).get(music_id)
    y, sr = librosa.load(io.BytesIO(music.content), 48000)
    y, _ = librosa.effects.trim(y, 45)
    flatness = librosa.feature.spectral_flatness(y=y)
    Datas = []

    for i in range(len(flatness[0])):
        dic = {
            "x": i+1,
            "y": str(flatness[0][i])
        }
        Datas.append(dic)

    # print(Datas)
    session.close()
    return jsonify(Datas)


@ app.route('/<user_id>/musics/<music_id>/spectrum_centroid&rolloff', methods=['GET'])
@ requires_auth
def get_centroid_rolloff(user_id, music_id):
    user_id = g.current_user['sub']
    cent = spectrum_centroid(user_id, music_id)
    roll = spectrum_rollofff(user_id, music_id)
    print(len(cent))
    Datas = [{"id": "centroid", "data": cent}, {"id": "rolloff", "data": roll}]

    return jsonify(Datas)


@ app.route('/<user_id>/musics/folder_comp_tone/<folder_id>', methods=['PUT', 'GET'])
@ requires_auth
def comp_tone(user_id, folder_id):
    session = create_session()
    user_id = g.current_user['sub']
    folder = session.query(Music_Folders).filter_by(
        user_id=user_id, folder_id=folder_id).all()
    folder = [f.to_json() for f in folder]
    music_ids = []
    for i in range(len(folder)):
        music_ids.append(folder[i]['music_id'])
    music_ids = list(set(music_ids))
    music_ids.sort()
    cnt = min(len(music_ids), 10)
    music_ids = music_ids[-1*cnt:]
    print(music_ids)

    preData = []

    for _id in music_ids:
        data = spectrum_rollofff_y(user_id, _id)
        start, end = find_start_end(user_id, _id)
        data = trim(data, start, end)
        data = np.array(data)
        preData.append(data)

    print(preData)
    path = []
    Datas = []
    if len(preData) == 1:
        data = []
        d = list(preData[0])
        for i in range(len(d)):
            dic = {
                "x": i+1,
                "y": str(d[i])
            }
            data.append(dic)

        Datas.append({"id": music_ids[0], "data": data})

    else:
        print(len(preData))
        for i in range(1, len(preData)):
            # alignment = dtw(preData[0], preData[i], keep_internals=True)
            alignment = dtw(preData[0], preData[i], keep_internals=True)

            if i == 1:
                aliged_data = preData[0][alignment.index1]
                aliged_data = list(aliged_data)
                data = []
                for j in range(len(aliged_data)):
                    dic = {
                        "x": j+1,
                        "y": str(aliged_data[j])
                    }
                    data.append(dic)
                Datas.append({"id": music_ids[0], "data": data})

            aliged_data = preData[i][alignment.index2]
            aliged_data = list(aliged_data)
            # print(aliged_data)
            data = []
            for j in range(len(aliged_data)):
                dic = {
                    "x": j+1,
                    "y": str(aliged_data[j])
                }
                data.append(dic)
            Datas.append({"id": music_ids[i], "data": data})
            print("fin")
        print("all clear")
        session.close()
    return jsonify(Datas)


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0',
            port=int(os.environ.get('PORT', 8080)))
