import io
import os
import wave
from flask import Flask, jsonify, request, make_response,  current_app, _app_ctx_stack
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
# from dtw import dtw
from dtw import *
from flask_jwt import JWT, jwt_required, current_identity
import jwt
import urllib
from functools import wraps
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
            "https://auth0-react-test.us.auth0.com/.well-known/jwks.json")
        jwks = json.loads(jsonurl.read())
        unverified_header = jwt.get_unverified_header(token)
        rsa_key = {}
        for key in jwks["keys"]:
            if key["kid"] == unverified_header["kid"]:
                rsa_key = {
                    "kty": key["kty"],
                    "kid": key["kid"],
                    "use": key["use"],
                    "n": key["n"],
                    "e": key["e"]
                }
        if rsa_key:
            print("token: ", token)
            print("--------------")
            print("rsa_key: ", rsa_key)
            try:
                payload = jwt.decode(
                    token,
                    rsa_key,
                    algorithms='RS256',
                    audience="https://musicvis",
                    issuer="https://auth0-react-test.us.auth0.com/"
                )
            except jwt.ExpiredSignatureError:
                raise AuthError({"code": "token_expired",
                                 "description": "token is expired"}, 401)
            # except jwt.JWTClaimsError:
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

            _app_ctx_stack.top.current_user = payload
            # print("-----------")
            # print(payload)
            return f(*args, **kwargs)
        raise AuthError({"code": "invalid_header",
                         "description": "Unable to find appropriate key"}, 400)
    # print(decorated)
    return decorated


# @app.route("/secured/ping")
@app.route("/user")  # 仮置き
# @cross_origin(headers=['Content-Type', 'Authorization'])
# @requires_auth
def secured_ping():
    return "All good. You only get this message if you're authenticated"


# @cross_origin(headers=['Content-Type', 'Authorization'])
# @app.route('/user', methods=['POST'])
# @requires_auth
def get_token():
    token = request.headers.get('Authorization')
    t = decode_auth_token(token)
    # print(t)
    # tokenからユーザ情報を取る?
    return token


def decode_auth_token(auth_token):
    """
    Decodes the auth token
    :param auth_token:
    :return: integer|string
    """
    try:
        payload = jwt.decode(auth_token, app.config.get('SECRET_KEY'))
        return payload['sub']
    except jwt.ExpiredSignatureError:
        return 'Signature expired. Please log in again.'
    except jwt.InvalidTokenError:
        return 'Invalid token. Please log in again.'


################################


@app.route('/<user_id>/musics', methods=['GET'])
def get_musics(user_id):
    session = create_session()
    musics = session.query(Music).filter_by(user_id=user_id).all()
    musics = [m.to_json() for m in musics]
    session.close()
    return jsonify(musics)


@app.route('/<user_id>/musics', methods=['PUT'])
def put_music(user_id):
    session = create_session()
    music = Music(user_id=user_id, content=request.data, name="music")
    session.add(music)
    session.commit()
    session.close()
    return 'received'


@app.route('/<user_id>/musics/<music_id>/comments', methods=['GET'])
def get_comment(user_id, music_id):
    session = create_session()
    comment = session.query(Comment).filter_by(
        music_id=music_id).all()
    comment = [m.to_json() for m in comment]
    session.close()
    print(comment)
    return jsonify(comment)


@app.route('/<user_id>/musics/<music_id>/comments', methods=['PUT'])
def put_comment(user_id, music_id):
    session = create_session()
    comment = Comment(music_id=music_id, text=request.data.decode())
    session.add(comment)
    session.commit()
    return 'message reseived'


@app.route('/<user_id>/musics/<music_id>/<folder_id>', methods=['PUT'])
def put_music_folders2(user_id, music_id, folder_id):
    session = create_session()
    data = Music_Folders(
        user_id=user_id, music_id=music_id, folder_id=folder_id)
    session.add(data)
    session.commit()
    return 'reseived'


@app.route('/<user_id>/musics/put_folders/<music_id>', methods=['PUT'])
def put_music_folder(user_id, music_id):
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


@app.route('/<user_id>/musics/folder_name', methods=['PUT'])
def put_folder_name(user_id):
    session = create_session()
    folderName = Folder(name=request.data.decode(), user_id=user_id)
    session.add(folderName)
    session.commit()
    return 'folderName reseived'


@app.route('/<user_id>/musics/folders2', methods=['GET'])
def put_folder2(user_id):
    session = create_session()
    folder = session.query(Folder).filter_by(user_id=user_id).all()
    folder = [f.to_json() for f in folder]
    session.close()
    return jsonify(folder)


@app.route('/<user_id>/musics/<music_id>/music_name', methods=['GET'])
def get_music_name(user_id, music_id):
    session = create_session()
    musics = session.query(Music).filter_by(
        user_id=user_id, id=music_id).first()
    musics = musics.to_json()
    music_name = musics['name']
    session.close()
    return jsonify(music_name)


@app.route('/<user_id>/musics/change_name/<music_id>', methods=['PUT'])
def change_name(user_id, music_id):
    session = create_session()
    musics = session.query(Music).filter_by(
        user_id=user_id, id=music_id).first()
    musics.name = request.data.decode()
    # musics = musics.to_json()
    session.add(musics)
    session.commit()
    session.close()
    # print(musics)
    return "reseive"


@app.route('/<user_id>/musics/delete/<music_id>', methods=['DELETE'])
def delete(user_id, music_id):
    session = create_session()
    musics = session.query(Music).filter_by(
        user_id=user_id, id=music_id).first()
    session.query(Comment).filter_by(music_id=music_id).delete()
    session.query(Music_Folders).filter_by(
        user_id=user_id, music_id=music_id).delete()
    session.delete(musics)
    # session.delete(comments)
    session.commit()
    session.close()
    print("Delete function")
    return "delete"


@app.route('/<user_id>/musics/delete/<music_id>/from/<folder_id>', methods=['DELETE'])
def delete_from_folder(user_id, music_id, folder_id):
    session = create_session()
    session.query(Music_Folders).filter_by(
        user_id=user_id, music_id=music_id, folder_id=folder_id).delete()
    session.commit()
    session.close()
    print("Delete function")
    return "delete"


@app.route('/<user_id>/musics/delete_folder/<folder_id>', methods=['DELETE'])
def delete_folder(user_id, folder_id):
    session = create_session()
    session.query(Folder).filter_by(user_id=user_id, id=folder_id).delete()
    session.query(Music_Folders).filter_by(
        user_id=user_id, folder_id=folder_id).delete()
    session.commit()
    session.close()
    print("Delete function")
    return "delete"


# DBのcommentテーブルにuser_idを追加すること
@app.route('/<user_id>/musics/delete_comment/<comment_id>', methods=['DELETE'])
def delete_comment(user_id, comment_id):
    session = create_session()
    session.query(Comment).filter_by(id=comment_id).delete()
    session.commit()
    session.close()
    print("Delete comment function")
    return "delete_comment"

#####################################################


def manhattan_distance(x, y): return np.abs(x - y)
@app.route('/<user_id>/musics/folder_freq_compare/<folder_id>', methods=['PUT', 'GET'])
def put_comp_freqData(user_id, folder_id):
    session = create_session()
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


"""
@app.route('/<user_id>/musics/<music_id>/folders', methods=['GET'])
def put_folder(user_id, music_id):
    session = create_session()
    folder_name = request.data.decode()

    had_name = session.query(Folder).filter_by(
        user_id=user_id, name=folder_name).all()
    had_name = [m.to_json() for m in had_name]
    _id = session.query(func.max(Folder.id).filter(user_id == user_id)).one()
    # _id = [m.to_json() for m in _id]
    # print("max_id = "+ str(_id))
    # print(had_name)
    # print(len(had_name))
    if len(had_name) > 0:
        print(had_name[0]['id'])
        folder_id = had_name[0]['id']
    else:
        folder_id = _id
    # folder = Folder(id = fol_id, name=folder_name, user_id=user_id)
    folder = Folder(name=folder_name, user_id=user_id, folder_id=folder_id)

    # folder = Folder(name=folder_name, user_id=user_id)
    session.add(folder)
    session.commit()

    had_name = session.query(Folder).filter_by(
        user_id=user_id, name=folder_name).all()
    had_name = [m.to_json() for m in had_name]
    least_fl_id = had_name[-1]['folder_id']
    # print("least = ", end=" ")
    # print(least_fl_id)
    print("userID = ")
    print(user_id, end="  musicId = ")
    print(music_id, end="  folder_id = ")
    print(type(least_fl_id))
    put_music_folders(user_id, music_id, least_fl_id)
    return 'folder reseived'


def put_music_folders(user_id, music_id, folder_id):
    session = create_session()
    music_folder = Music_Folders(
        music_id=music_id, folder_id=folder_id, user_id=user_id)
    session.add(music_folder)
    session.commit()
    return 'music_folders reseived'
"""


@app.route('/<user_id>/musics/folders', methods=['GET'])
def get_music_folders(user_id):
    session = create_session()
    data = session.query(Music_Folders).filter_by(user_id=user_id).all()
    data = [m.to_json() for m in data]
    session.close()
    return jsonify(data)


@app.route('/<user_id>/musics/<music_id>/folders', methods=['GET'])
def get_foledrs(user_id, music_id):
    session = create_session()
    folder = session.query(Folder).filter_by(user_id=user_id).all()
    folder = [m.to_json() for m in folder]
    session.close()
    return jsonify(folder)


@app.route('/<user_id>/musics/folders/<folder_id>', methods=['GET'])
def get_folderName(user_id, folder_id):
    session = create_session()
    folder = session.query(Folder).filter_by(
        user_id=user_id, id=folder_id).all()
    folder = [f.to_json() for f in folder]
    session.close()
    return jsonify(folder[0]['name'])


@app.route('/<user_id>/musics/<music_id>/content', methods=['GET'])
def get_music_content(user_id, music_id):
    session = create_session()
    response = make_response()
    music = session.query(Music).get(music_id)
    response.data = music.content
    response.mimetype = "audio/wav"
    session.close()
    return response


@app.route('/<user_id>/musics/<music_id>/created', methods=['GET'])
def create(user_id, music_id):
    session = create_session()
    music = session.query(Music).get(music_id)
    date = music.created
    session.close()
    return jsonify(date)


# parallelCoordinates
@app.route('/<user_id>/musics/parallel/<folder_id>', methods=['PUT', 'GET'])
def parallel_data(user_id, folder_id):
    session = create_session()
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
        Datas.append([_id, frequency_ave_data(user_id, _id), fourier_roll_data(
            user_id, _id), round(decibel_ave_data(user_id, _id), 4)])
    Datas = sorted(Datas, key=lambda x: x[2])
    for i in range(len(Datas)):
        Datas[i].append(Datas[i][1]+Datas[i][3] +
                        ((Datas[-1][2]-Datas[i][2])/10000))
    Datas = sorted(Datas, key=lambda x: x[4])
    print(Datas)

    dicDatas = []
    for i in range(len(Datas)-1, -1, -1):
        dic = {
            "No.": Datas[i][0],
            "pich": Datas[i][1],
            "tone": Datas[i][2],
            "volume": Datas[i][3],
        }
        dicDatas.append(dic)

    session.close()
    return jsonify(dicDatas)


# 精進グラフ
@app.route('/<user_id>/musics/progress/<folder_id>', methods=['PUT', 'GET'])
def progress(user_id, folder_id):
    session = create_session()
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
        Datas.append([_id, frequency_ave_data(user_id, _id), fourier_roll_data(
            user_id, _id), round(decibel_ave_data(user_id, _id), 4)])
    # Datas = sorted(Datas, key=lambda x: x[2])
    for i in range(len(Datas)):
        Datas[i].append(-1*(Datas[i][1]+Datas[i][3] +
                            ((Datas[-1][2]-Datas[i][2])/10000)))
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
@app.route('/<user_id>/musics/<music_id>/amplitude', methods=['GET'])
def amplitude(user_id, music_id):
    session = create_session()
    music = session.query(Music).get(music_id)
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
@app.route('/<user_id>/musics/<music_id>/fourier', methods=['GET'])
def fourier(user_id, music_id):
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
@app.route('/<user_id>/musics/<music_id>/fourier_roll', methods=['GET'])
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
@app.route('/<user_id>/musics/<music_id>/spectrogram', methods=['GET'])
def spectrogram(user_id, music_id):
    session = create_session()
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
@app.route('/<user_id>/musics/<music_id>/decibel', methods=['GET'])
def decibel(user_id, music_id):
    session = create_session()
    music = session.query(Music).get(music_id)
    rate, data = scipy.io.wavfile.read(io.BytesIO(music.content))
    print(rate)
    data = data.astype(np.float)
    data, _ = librosa.effects.trim(data, 45)
    S = np.abs(librosa.stft(data))
    db = librosa.amplitude_to_db(S, ref=np.max)
    dbLine = []
    for i in range(len(db[0])):
        _max = -80
        for j in range(len(db)):
            if _max < db[j][i]:
                _max = db[j][i]
        dbLine.append(_max)

    Datas = []
    for i in range(len(dbLine)):
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
    music = session.query(Music).get(music_id)
    rate, data = scipy.io.wavfile.read(io.BytesIO(music.content))
    data = data.astype(np.float)
    data, _ = librosa.effects.trim(data, 45)
    S = np.abs(librosa.stft(data))
    db = librosa.amplitude_to_db(S, ref=np.max)
    dbLine = []
    for i in range(len(db[0])):
        _max = -80
        for j in range(len(db)):
            if _max < db[j][i]:
                _max = db[j][i]
        dbLine.append(_max)

    Datas = []
    for i in range(len(dbLine)):
        dic = {
            "x": i+1,
            "y": int(dbLine[i])
        }
        Datas.append(dic)
    session.close()
    return dbLine


# デシベル値　平均
@app.route('/<user_id>/musics/<music_id>/decibel_ave', methods=['GET'])
def decibel_ave(user_id, music_id):
    session = create_session()
    music = session.query(Music).get(music_id)
    rate, data = scipy.io.wavfile.read(io.BytesIO(music.content))
    data = data.astype(np.float)
    # data, _ = librosa.effects.trim(data, 45)
    data, _ = librosa.effects.trim(data, 45)
    S = np.abs(librosa.stft(data))
    db = librosa.amplitude_to_db(S, ref=np.max)
    dbLine = []
    for i in range(len(db[0])):
        _max = -80
        for j in range(len(db)):
            if _max < db[j][i]:
                _max = db[j][i]
        dbLine.append(_max)

    Datas = []
    total = 0
    cnt = 0
    for i in range(len(dbLine)-1):
        if not(dbLine[i] == 0 or dbLine[i+1] == 0):
            if dbLine[i] >= -30:
                total += abs(dbLine[i]-dbLine[i+1])
                cnt += 1

    ave = total/cnt
    session.close()
    return jsonify(ave)


"""
def decibel_ave(user_id, music_id):
    session = create_session()
    music = session.query(Music).get(music_id)
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

    Datas = []
    total = 0
    cnt = 0
    for i in range(len(dbLine)-1):
        if not(dbLine[i] == 0 or dbLine[i+1] == 0):
            if dbLine[i] >= -30:
                total += abs(dbLine[i]-dbLine[i+1])
                cnt += 1

    ave = total/cnt
    session.close()
    return jsonify(ave)
"""


def decibel_ave_data(user_id, music_id):
    session = create_session()
    music = session.query(Music).get(music_id)
    rate, data = scipy.io.wavfile.read(io.BytesIO(music.content))
    data = data.astype(np.float)
    data, _ = librosa.effects.trim(data, 45)
    S = np.abs(librosa.stft(data))
    db = librosa.amplitude_to_db(S, ref=np.max)
    dbLine = []
    for i in range(len(db[0])):
        _max = -80
        for j in range(len(db)):
            if _max < db[j][i]:
                _max = db[j][i]
        dbLine.append(_max)

    Datas = []
    total = 0
    cnt = 0
    for i in range(len(dbLine)-1):
        if not(dbLine[i] == 0 or dbLine[i+1] == 0):
            if dbLine[i] >= -30:
                total += abs(dbLine[i]-dbLine[i+1])
                cnt += 1

    ave = total/cnt
    session.close()
    return ave


@app.route('/<user_id>/musics/folder_comp_volume/<folder_id>', methods=['PUT', 'GET'])
def comp_decibel(user_id, folder_id):
    session = create_session()
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


# 基本周波数
@app.route('/<user_id>/musics/<music_id>/frequency', methods=['GET'])
def frequency(user_id, music_id):
    session = create_session()
    music = session.query(Music).get(music_id)
    # rate, data = scipy.io.wavfile.read(io.BytesIO(music.content))
    data, rate = librosa.load(io.BytesIO(music.content), 48000)
    print(rate)
    data = data.astype(np.float)
    data, _ = librosa.effects.trim(data, 45)
    _f0, _time = pw.dio(data, rate, f0_floor=70,
                        f0_ceil=1600, frame_period=10.625)
    # print(_time)
    f0 = pw.stonemask(data, _f0, _time, rate)
    Datas = []
    # for i in range(500):  # )len(f0)):
    for i in range(len(f0)):
        dic = {
            "x": i+1,
            "y": f0[i]
        }
        Datas.append(dic)
    session.close()
    print(len(Datas))
    return jsonify(Datas)


@app.route('/<user_id>/musics/<music_id>/frequency_ave', methods=['GET'])
def frequency_ave(user_id, music_id):
    session = create_session()
    music = session.query(Music).get(music_id)
    rate, data = scipy.io.wavfile.read(io.BytesIO(music.content))
    data = data.astype(np.float)
    data, _ = librosa.effects.trim(data, 45)
    _f0, _time = pw.dio(data, rate, f0_floor=70,
                        f0_ceil=1600, frame_period=10.625)
    f0 = pw.stonemask(data, _f0, _time, rate)
    total = 0
    cnt = 0
    for i in range(len(f0)-1):
        if not(f0[i] == 0 or f0[i+1] == 0):
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
    music = session.query(Music).get(music_id)
    rate, data = scipy.io.wavfile.read(io.BytesIO(music.content))
    data = data.astype(np.float)
    data, _ = librosa.effects.trim(data, 45)
    _f0, _time = pw.dio(data, rate, f0_floor=70,
                        f0_ceil=1600, frame_period=10.625)
    f0 = pw.stonemask(data, _f0, _time, rate)
    total = 0
    cnt = 0
    for i in range(len(f0)-1):
        if not(f0[i] == 0 or f0[i+1] == 0):
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
    music = session.query(Music).get(music_id)
    rate, data = scipy.io.wavfile.read(io.BytesIO(music.content))
    data = data.astype(np.float)
    data, _ = librosa.effects.trim(data, 45)
    _f0, _time = pw.dio(data, rate, f0_floor=70,
                        f0_ceil=1600, frame_period=10.625)
    f0 = pw.stonemask(data, _f0, _time, rate)
    Datas = []
    # for i in range(500):  # )len(f0)):
    for i in range(len(f0)):
        dic = {
            "x": i+1,
            "y": f0[i]
        }
        Datas.append(dic)
    session.close()
    return Datas

# dtw用


def dtw_frequency_data(user_id, music_id):
    session = create_session()
    music = session.query(Music).get(music_id)
    rate, data = scipy.io.wavfile.read(io.BytesIO(music.content))
    data = data.astype(np.float)
    data, _ = librosa.effects.trim(data, 45)
    _f0, _time = pw.dio(data, rate, f0_floor=70,
                        f0_ceil=1600, frame_period=10.625)
    f0 = pw.stonemask(data, _f0, _time, rate)
    session.close()
    return f0

# グラフ比較(基本周波数)


# グラフ比較(基本周波数)
@app.route('/<user_id>/musics/<music_id>/comp_chart/<music_id2>', methods=['GET'])
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


# --スペクトル重心--------
# @app.route('/<user_id>/musics/<music_id>/spectrum_centroid', methods=['GET'])
def spectrum_centroid(user_id, music_id):
    session = create_session()
    music = session.query(Music).get(music_id)
    y, sr = librosa.load(io.BytesIO(music.content), 48000)
    # y, sr = librosa.load(io.BytesIO(music.content), 96000)

    y, _ = librosa.effects.trim(y, 45)
    cent = librosa.feature.spectral_centroid(y=y, sr=sr)
    Datas = []

    for i in range(len(cent[0])):
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
    music = session.query(Music).get(music_id)
    y, sr = librosa.load(io.BytesIO(music.content), 48000)
    # y, sr = librosa.load(io.BytesIO(music.content), 96000)
    print(sr)
    y, _ = librosa.effects.trim(y, 45)
    # 引数roll_percent=0.8がデフォ
    rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr)
    # print(rolloff)
    Datas = []

    for i in range(len(rolloff[0])):
        dic = {
            "x": i+1,
            "y": int(rolloff[0][i])
        }
        Datas.append(dic)
    # return jsonify(Datas)
    session.close()
    print(len(Datas))
    return Datas


@app.route('/<user_id>/musics/<music_id>/rolloff_ave', methods=['GET'])
def spectrum_rollofff_ave(user_id, music_id):
    session = create_session()
    music = session.query(Music).get(music_id)
    y, sr = librosa.load(io.BytesIO(music.content), 48000)
    # y, sr = librosa.load(io.BytesIO(music.content), 96000)
    print(sr)
    y, _ = librosa.effects.trim(y, 45)
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
    cnt = 0
    total = 0
    for i in range(len(rolloff[0])-1):
        if rolloff[0][i] < 4000 and rolloff[0][i+1] < 4000:
            total += abs(rolloff[0][i]-rolloff[0][i+1])
            cnt += 1
    ave = total/cnt

    session.close()

    return jsonify(ave)


def spectrum_rollofff_y(user_id, music_id):
    session = create_session()
    music = session.query(Music).get(music_id)
    y, sr = librosa.load(io.BytesIO(music.content), 48000)
    y, _ = librosa.effects.trim(y, 45)
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
@app.route('/<user_id>/musics/<music_id>/spectrum_flatness', methods=['GET'])
def spectrum_flatness(user_id, music_id):
    session = create_session()
    music = session.query(Music).get(music_id)
    y, sr = librosa.load(io.BytesIO(music.content), 48000)
    y, _ = librosa.effects.trim(y, 45)
    flatness = librosa.feature.spectral_flatness(y=y)
    # print(flatness)
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


@app.route('/<user_id>/musics/<music_id>/spectrum_centroid&rolloff', methods=['GET'])
def get_centroid_rolloff(user_id, music_id):
    cent = spectrum_centroid(user_id, music_id)
    roll = spectrum_rollofff(user_id, music_id)
    Datas = [{"id": "centroid", "data": cent}, {"id": "rolloff", "data": roll}]

    return jsonify(Datas)


@app.route('/<user_id>/musics/folder_comp_tone/<folder_id>', methods=['PUT', 'GET'])
def comp_tone(user_id, folder_id):
    session = create_session()
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
