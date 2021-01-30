import io
import os
import json
import wave
from flask import Flask, jsonify, request, make_response, g
from flask_cors import CORS
from db import create_session
from models import Music, Comment, Folder
import numpy as np
import scipy.io.wavfile
from pylab import frombuffer
from scipy import signal
from collections import OrderedDict
import librosa
from dtw import dtw
from auth import requires_auth
import math
app = Flask(__name__)
cors = CORS(app)


@app.route('/musics', methods=['GET'])
@requires_auth
def get_musics():
    session = create_session()
    user_id = g.current_user['sub']
    musics = session.query(Music).filter_by(
        user_id=user_id).order_by(Music.created.desc()).all()
    musics = [music.to_json() for music in musics]
    session.close()
    return jsonify(musics)


@ app.route('/musics', methods=['POST'])
@ requires_auth
def post_music():
    session = create_session()
    user_id = g.current_user['sub']
    music = Music(user_id=user_id)
    music.content = request.data
    session.add(music)
    session.commit()
    music = music.to_json()
    session.close()
    return jsonify(music)


@app.route('/musics/<music_id>', methods=['GET'])
@requires_auth
def get_music(music_id):
    session = create_session()
    user_id = g.current_user['sub']
    music = session.query(Music).filter_by(
        id=music_id, user_id=user_id).first()
    music = music.to_json()
    session.close()
    return jsonify(music)


@app.route('/musics/<music_id>', methods=['PUT'])
@requires_auth
def put_music(music_id):
    session = create_session()
    user_id = g.current_user['sub']
    data = json.loads(request.data.decode('utf-8'))
    music = session.query(Music).filter_by(
        id=music_id, user_id=user_id).first()
    if 'name' in data:
        music.name = data['name']
    if 'folderId' in data:
        music.folder_id = data['folderId']
    session.commit()
    music = music.to_json()
    session.close()
    return jsonify(music)


@app.route('/musics/<music_id>', methods=['DELETE'])
@requires_auth
def delete_music(music_id):
    session = create_session()
    user_id = g.current_user['sub']
    session.query(Music).filter_by(id=music_id, user_id=user_id).delete()
    session.commit()
    session.close()
    return jsonify({'message': 'deleted'})


@app.route('/musics/<music_id>/content', methods=['GET'])
@requires_auth
def get_music_content(music_id):
    session = create_session()
    user_id = g.current_user['sub']
    response = make_response()
    music = session.query(Music).filter_by(
        user_id=user_id, id=music_id).first()
    response.data = music.content
    response.mimetype = "audio/wav"
    session.close()
    print(user_id, music_id)
    return response


@app.route('/musics/<music_id>/content', methods=['PUT'])
@requires_auth
def put_music_content(music_id):
    session = create_session()
    user_id = g.current_user['sub']
    data = json.loads(request.data.decode('utf-8'))
    print(data)
    music = session.query(Music).filter_by(
        user_id=user_id, id=music_id).first()
    if 'name' in data:
        music.name = data['name']
    if 'folderId' in data:
        music.folder_id = data['folderId']
    if 'comment' in data:
        print(data["comment"])
        comment = Comment(music_id=music_id,
                          text=data['comment'], user_id=user_id)
        session.add(comment)
    session.add(music)
    session.commit()
    session.close()
    return {"message": "updated"}


# 曲ごとのコメントのリストを返す
@ app.route('/musics/<music_id>/comments', methods=['GET'])
@ requires_auth
def get_comment(music_id):
    session = create_session()
    user_id = g.current_user['sub']
    comments = session.query(Comment).filter_by(
        music_id=music_id, user_id=user_id).all()
    comments = [c.to_json() for c in comments]
    session.close()
    return jsonify(comments)


@ app.route('/musics/<music_id>/comments', methods=['POST'])
@ requires_auth
def post_comment(music_id):
    session = create_session()
    user_id = g.current_user['sub']
    data = json.loads(request.data.decode('utf-8'))
    print(data["item"])
    comment = Comment(music_id=music_id, text=data['item'], user_id=user_id)
    session.add(comment)
    session.commit()
    return get_comment(music_id)


# フォルダのリストを返す
@app.route('/folders', methods=['GET'])
@requires_auth
def get_folders():
    session = create_session()
    user_id = g.current_user['sub']
    folders = session.query(Folder).filter_by(user_id=user_id).all()
    #folders = [f.to_json() for f in folders]
    # 初期フォルダーの作成(どこでやるのがベスト？)
    if len(folders) == 0:
        folder = Folder(name="ロングトーン", user_id=user_id)
        session.add(folder)
        folder = Folder(name="スケール", user_id=user_id)
        session.add(folder)
        folder = Folder(name="アルペジオ", user_id=user_id)
        session.add(folder)
        session.commit()
    # print(len(folders))
    folders = session.query(Folder).filter_by(user_id=user_id).all()
    folders = [f.to_json() for f in folders]

    session.close()
    return jsonify(folders)


# フォルダの追加
@app.route('/folders', methods=['POST'])
@requires_auth
def post_folder():
    session = create_session()
    user_id = g.current_user['sub']
    data = json.loads(request.data.decode('utf-8'))
    folder = Folder(name=data['name'], user_id=user_id)
    session.add(folder)
    session.commit()
    folder = folder.to_json()
    session.close()
    return jsonify(folder)


@app.route('/folders/<folder_id>', methods=['GET'])
@requires_auth
def get_folder(folder_id):
    session = create_session()
    user_id = g.current_user['sub']
    folder = session.query(Folder).filter_by(
        id=folder_id, user_id=user_id).first()
    folder = folder.to_json()
    session.commit()
    session.close()
    return jsonify(folder)


@app.route('/folders/<folder_id>', methods=['PUT'])
@requires_auth
def put_folder(folder_id):
    session = create_session()
    user_id = g.current_user['sub']
    data = json.loads(request.data.decode('utf-8'))
    folder = session.query(Folder).filter_by(
        id=folder_id, user_id=user_id).first()
    if 'name' in data:
        folder.name = data['name']
    session.commit()
    folder = folder.to_json()
    session.close()
    return jsonify(folder)


@app.route('/folders/<folder_id>', methods=['DELETE'])
@requires_auth
def delete_folder(folder_id):
    session = create_session()
    user_id = g.current_user['sub']
    session.query(Music).filter_by(
        folder_id=folder_id, user_id=user_id).delete()
    session.query(Folder).filter_by(id=folder_id, user_id=user_id).delete()
    session.commit()
    session.close()
    return jsonify({'message': 'deleted'})


@app.route('/folders/<folder_id>/musics', methods=['GET'])
@requires_auth
def get_folder_musics(folder_id):
    session = create_session()
    user_id = g.current_user['sub']
    musics = session.query(Music).filter_by(
        folder_id=folder_id, user_id=user_id).all()
    musics = [m.to_json() for m in musics]
    session.close()
    return jsonify(musics)


@app.route('/comments/<comment_id>', methods=['DELETE'])
@requires_auth
def delete_comment(comment_id):
    session = create_session()
    user_id = g.current_user['sub']
    session.query(Comment).filter_by(id=comment_id, user_id=user_id).delete()
    session.commit()
    session.close()
    return {"message": "deleted"}


@app.route('/folders/<folder_id>/f0', methods=['GET'])
@requires_auth
def get_folder_f0(folder_id):
    session = create_session()
    user_id = g.current_user['sub']
    musics = session.query(Music).filter_by(
        folder_id=folder_id, user_id=user_id).all()

    preData = []

    for music in musics:
        data = dtw_frequency_data(music)
        start, end = find_start_end(music)
        data = trim(data, start, end)
        data = np.array(data)
        data = np.nan_to_num(data)
        preData.append(data)

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

        Datas.append({"id": musics[0].id, "data": data})

    else:
        for i in range(len(preData)):
            print(len(preData[i]))
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
                Datas.append({"id": musics[0].id, "data": data})

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
            Datas.append({"id": musics[i].id, "data": data})
            print("fin"+str(i))
            print(len(Datas))
        print(Datas)
        print("finish")
        session.close()
    return jsonify(Datas)

# parallelCoordinates


@app.route('/folders/<folder_id>/parallel', methods=['GET'])
@requires_auth
def get_folders_parallel(folder_id):
    session = create_session()
    user_id = g.current_user['sub']
    musics = session.query(Music).filter_by(
        user_id=user_id, folder_id=folder_id).order_by(Music.id).all()

    Datas = []
    for music in musics:
        Datas.append([music.id, frequency_ave_data(music),  spectrum_rolloff_ave(
            music), decibel_ave_data(music)])

    for i in range(len(Datas)):
        Datas[i].append(Datas[i][1][1]+Datas[i][3][1] + Datas[i][2][1]/100)
    Datas = sorted(Datas, key=lambda x: x[4])
    dicDatas = []
    for i in range(len(Datas)-1, -1, -1):
        dic = {
            "No.": Datas[i][0],
            "pich": Datas[i][1][1],
            "tone": Datas[i][2][1]/100,
            "volume": Datas[i][3][1],
        }
        dicDatas.append(dic)

    session.close()
    print(dicDatas)
    return jsonify(dicDatas)


# 精進グラフ
@ app.route('/folders/<folder_id>/progress', methods=['GET'])
@ requires_auth
def get_folder_progress(folder_id):
    session = create_session()
    user_id = g.current_user['sub']
    musics = session.query(Music).filter_by(
        user_id=user_id, folder_id=folder_id).order_by(Music.id).all()

    Datas = []
    for music in musics:
        Datas.append([music.id, frequency_ave_data(music),  spectrum_rolloff_ave(
            music), decibel_ave_data(music)])

    for i in range(len(Datas)):
        Datas[i].append(-1*(Datas[i][1][1]+Datas[i]
                            [3][1] + Datas[i][2][1]/100))

    dicDatas = []
    for i in range(len(Datas)):
        dic = {
            "x": Datas[i][0],
            "y": round(Datas[i][4], 4)
        }
        dicDatas.append(dic)
    session.close()
    return jsonify(dicDatas)


# 波形
@ app.route('/musics/<music_id>/amplitude', methods=['GET'])
@ requires_auth
def amplitude(music_id):
    session = create_session()
    user_id = g.current_user['sub']
    music = session.query(Music).filter_by(
        user_id=user_id, id=music_id).first()
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
            "y": round(data[i], 4)
        }
        Datas.append(dic)
    session.close()
    return jsonify(Datas)


# フーリエ変換
@ app.route('/musics/<music_id>/fourier', methods=['GET'])
@ requires_auth
def fourier(music_id):
    session = create_session()
    user_id = g.current_user['sub']
    music = session.query(Music).filter_by(
        user_id=user_id, id=music_id).first()
    rate, data = scipy.io.wavfile.read(io.BytesIO(music.content))
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
    fourier_roll(music_id)
    return jsonify(Datas)


# フーリエ変換　ロールオフ
@ app.route('/musics/<music_id>/fourier_roll', methods=['GET'])
def fourier_roll(music_id):
    session = create_session()
    user_id = g.current_user['sub']
    music = session.query(Music).filter_by(
        user_id=user_id, id=music_id).first()
    rate, data = scipy.io.wavfile.read(io.BytesIO(music.content))
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


def fourier_roll_data(music_id):
    session = create_session()
    user_id = g.current_user['sub']
    music = session.query(Music).filter_by(
        user_id=user_id, id=music_id).first()
    rate, data = scipy.io.wavfile.read(io.BytesIO(music.content))
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
@ app.route('/musics/<music_id>/spectrogram', methods=['GET'])
@ requires_auth
def get_music_spectrogram(music_id):
    session = create_session()
    user_id = g.current_user['sub']
    music = session.query(Music).filter_by(
        user_id=user_id, id=music_id).first()
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
@ app.route('/musics/<music_id>/decibel', methods=['GET'])
@ requires_auth
def get_music_decibel(music_id):
    session = create_session()
    user_id = g.current_user['sub']
    music = session.query(Music).filter_by(
        user_id=user_id, id=music_id).first()
    rate, data = scipy.io.wavfile.read(io.BytesIO(music.content))
    data = data.astype(np.float)
    S = np.abs(librosa.stft(data))
    db = librosa.amplitude_to_db(S, ref=np.max)
    dbLine = []
    for i in range(len(db[0])):
        _max = -20  # -80 にしてる処理もあるが？
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

    data = []
    if end < len(dbLine)-2:
        end += 1
    for i in range(start, end):
        dic = {
            "x": i+1,
            "y": round(dbLine[i], 4)
        }
        data.append(dic)

    average = decibel_ave_data(music)

    session.close()
    return jsonify({'average': average[1], 's': average[0], 'values': data})


def decibel_data(music):
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
    return dbLine


def find_start_end(music):
    decibelData = decibel_data(music)
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


def decibel_ave_data(music):
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

    end = 0
    for i in range(len(dbLine)):
        if dbLine[i] > -20:
            break
    for i in range(len(dbLine)-1, -1, -1):
        if dbLine[i] > -20:
            end = i
            break

    total = 0
    cnt = 0
    s_total = 0
    s_count = 0
    if end < len(dbLine)-2:
        end += 1
    for i in range(0, end):
        if not(dbLine[i] == 0 or dbLine[i+1] == 0):
            total += abs(dbLine[i]-dbLine[i+1])
            cnt += 1
        if dbLine[i] != 0:
            s_total += dbLine[i]
            s_count += 1

    stability = total/cnt
    average = s_total/s_count
    s = 0
    for i in range(s_count):
        s += pow(dbLine[i]-average, 2)
    s /= s_count
    s = math.sqrt(s)
    # どっちがいい？
    print("s = ", s)
    print("stability = ", stability)
    return [round(s, 4), round(stability, 4)]


def trim(data, start, end):
    res = []
    print(start, end, len(data))
    if end < len(data)-2:
        end += 1
    for i in range(start, end):
        res.append(data[i])
    return res


@ app.route('/folders/<folder_id>/decibel', methods=['GET'])
@ requires_auth
def get_folder_decibel(folder_id):
    session = create_session()
    user_id = g.current_user['sub']
    musics = session.query(Music).filter_by(folder_id=folder_id,
                                            user_id=user_id).order_by(Music.id).all()

    preData = []

    for music in musics:
        data = decibel_data(music)
        start, end = find_start_end(music)
        data = trim(data, start, end)
        data = np.array(data)
        preData.append(data)

    # print(preData)
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

        Datas.append({"id": musics[0].id, "data": data})

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
                Datas.append({"id": musics[0].id, "data": data})

            aliged_data = preData[i][alignment.index2]
            aliged_data = list(aliged_data)

            data = []
            for j in range(len(aliged_data)):
                dic = {
                    "x": j+1,
                    "y": str(aliged_data[j])
                }
                data.append(dic)
            Datas.append({"id": musics[i].id, "data": data})
            print("fin")
        print("all clear")
        session.close()
    return jsonify(Datas)


# 基本周波数
@ app.route('/musics/<music_id>/f0', methods=['GET'])
@ requires_auth
def get_music_f0(music_id):
    session = create_session()
    user_id = g.current_user['sub']
    music = session.query(Music).filter_by(
        user_id=user_id, id=music_id).first()

    f0 = music.fundamental_frequency(session)

    average = frequency_ave_data(music)

    start, end = find_start_end(music)
    data = []
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
        data.append(dic)

    session.close()
    return jsonify({
        'average': average[1],
        's': average[0],
        'values': data
    })


def frequency_ave_data(music):
    session = create_session()
    f0 = music.fundamental_frequency(session)

    start, end = find_start_end(music)
    total = 0
    cnt = 0
    if end < len(f0)-2:
        end += 1
    for i in range(max(0, start), end):
        if f0[i] >= 0 and f0[i+1] >= 0 and (not(f0[i] == 0 or f0[i+1] == 0)):
            total += abs(f0[i]-f0[i+1])
            cnt += 1

    data = np.array(f0)
    data = np.nan_to_num(f0)
    s_total = 0
    s_count = 0
    for i in range(max(0, start), end):
        if data[i] != 0:
            s_total += data[i]
            s_count += 1

    if s_count != 0:
        average = s_total/s_count
        s = 0
        for i in range(max(0, start), end):
            if data[i] != 0:
                s += pow(data[i]-average, 2)
        s /= s_count
        s = math.sqrt(s)
        print("s=", s)
    else:
        s = -1

    if cnt != 0:
        stability = total/cnt
    else:
        stability = -1

    print("ave = " + str((stability)))
    session.close()
    return [round(s, 4), round(stability, 4)]


# dtw用
def dtw_frequency_data(music):
    session = create_session()
    f0 = music.fundamental_frequency(session)
    session.close()
    return f0

# --スペクトル重心--------


def spectrum_centroid(music):
    session = create_session()
    y, sr = librosa.load(io.BytesIO(music.content), 48000)
    cent = librosa.feature.spectral_centroid(y=y, sr=sr)
    start, end = find_start_end(music)
    Datas = []
    if end < len(cent[0]-2):
        end += 1
    for i in range(start, end):
        dic = {
            "x": i+1,
            "y": round(cent[0][i], 4)
        }
        Datas.append(dic)
    session.close()
    return Datas


# ----スペクトルロールオフ---------
def spectrum_rolloff(music):
    session = create_session()
    y, sr = librosa.load(io.BytesIO(music.content), 48000)
    rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr)

    start, end = find_start_end(music)
    Datas = []
    if end < len(rolloff[0]-2):
        end += 1
    for i in range(start, end):
        dic = {
            "x": i+1,
            "y": round(rolloff[0][i], 4)
        }
        Datas.append(dic)
    session.close()
    return Datas


def spectrum_rolloff_ave(music):
    session = create_session()
    y, sr = librosa.load(io.BytesIO(music.content), 48000)
    # 引数roll_percent=0.8がデフォ
    rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr)

    start, end = find_start_end(music)
    cnt = 0
    total = 0
    s_total = 0
    s_count = 0
    for i in range(start, end):
        if rolloff[0][i] < 4000 and rolloff[0][i+1] < 4000:
            total += abs(rolloff[0][i]-rolloff[0][i+1])
            cnt += 1
        if rolloff[0][i] != 0:
            s_total += rolloff[0][i]
            s_count += 1
    if cnt != 0:
        stability = total/cnt
    else:
        stability = -1

    s = 0
    average = s_total/s_count
    for i in range(s_count):
        s += pow(rolloff[0][i]-average, 2)
    s /= s_count
    s = math.sqrt(s)

    session.close()

    return [round(s, 4), round(stability, 4)]


def spectrum_rolloff_y(music):
    session = create_session()
    y, sr = librosa.load(io.BytesIO(music.content), 48000)
    # 引数roll_percent=0.8がデフォ
    rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr)
    # print(rolloff)
    Datas = []

    for i in range(len(rolloff[0])):
        Datas.append(round(rolloff[0][i], 4))
    # return jsonify(Datas)
    session.close()
    return Datas


# --フラットネス--------
@ app.route('/musics/<music_id>/spectrum_flatness', methods=['GET'])
@ requires_auth
def spectrum_flatness(music_id):
    session = create_session()
    user_id = g.current_user['sub']
    music = session.query(Music).filter_by(
        user_id=user_id, id=music_id).first()
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


@ app.route('/musics/<music_id>/spectrum_centroid', methods=['GET'])
@ requires_auth
def get_music_spectrum_centroid(music_id):
    session = create_session()
    user_id = g.current_user['sub']
    music = session.query(Music).filter_by(
        user_id=user_id, id=music_id).first()
    return jsonify({
        'values': spectrum_centroid(music)
    })


@ app.route('/musics/<music_id>/spectrum_rolloff', methods=['GET'])
@ requires_auth
def get_music_spectrum_rolloff(music_id):
    session = create_session()
    user_id = g.current_user['sub']
    music = session.query(Music).filter_by(
        user_id=user_id, id=music_id).first()
    average = spectrum_rolloff_ave(music)
    return jsonify({
        'average': {"stability": average[1], 's': average[0]},
        'values': spectrum_rolloff(music)
    })


@ app.route('/folders/<folder_id>/tone', methods=['GET'])
@ requires_auth
def get_folder_tone(folder_id):
    session = create_session()
    user_id = g.current_user['sub']
    musics = session.query(Music).filter_by(
        user_id=user_id, folder_id=folder_id).order_by(Music.id).all()

    preData = []

    for music in musics:
        data = spectrum_rolloff_y(music)
        start, end = find_start_end(music)
        data = trim(data, start, end)
        data = np.array(data)
        preData.append(data)

    print(preData)
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

        Datas.append({"id": musics[0].id, "data": data})

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
                Datas.append({"id": musics[0].id, "data": data})

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
            Datas.append({"id": musics[i].id, "data": data})
            print("fin")
        print("all clear")
        session.close()
    return jsonify(Datas)


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0',
            port=int(os.environ.get('PORT', 8080)))
