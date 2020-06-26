import io
import os
import wave
from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
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

app = Flask(__name__)
cors = CORS(app)


@app.route('/<user_id>/musics', methods=['GET'])
def get_musics(user_id):
    session = create_session()
    musics = session.query(Music).filter_by(user_id=user_id).all()
    musics = [m.to_json() for m in musics]
    return jsonify(musics)


@app.route('/<user_id>/musics', methods=['PUT'])
def put_music(user_id):
    session = create_session()
    music = Music(user_id=user_id, content=request.data)
    session.add(music)
    session.commit()
    return 'received'


@app.route('/<user_id>/musics/<music_id>/comments', methods=['GET'])
def get_comment(user_id, music_id):
    session = create_session()
    comment = session.query(Comment).filter_by(
        music_id=music_id).all()
    comment = [m.to_json() for m in comment]

    return jsonify(comment)


@app.route('/<user_id>/musics/<music_id>/comments', methods=['PUT'])
def put_comment(user_id, music_id):
    session = create_session()
    comment = Comment(music_id=music_id, text=request.data.decode())
    session.add(comment)
    session.commit()
    return 'message reseived'

@app.route('/<user_id>/musics/<music_id>/folders', methods=['PUT'])
def put_folder(user_id, music_id):
    session = create_session()
    folder_name = request.data.decode()
    
    had_name = session.query(Folder).filter_by(user_id=user_id, name=folder_name).all()
    had_name = [m.to_json() for m in had_name]
    _id = session.query(func.max(Folder.id).filter(user_id==user_id)).one()
    #_id = [m.to_json() for m in _id]
    #print("max_id = "+ str(_id))
    #print(had_name)
    #print(len(had_name))
    if len(had_name) > 0 :
        print(had_name[0]['id'])
        folder_id = had_name[0]['id']
    else:
        folder_id = _id
    #folder = Folder(id = fol_id, name=folder_name, user_id=user_id)
    folder = Folder(name=folder_name, user_id=user_id, folder_id = folder_id)   

    
    #folder = Folder(name=folder_name, user_id=user_id)
    session.add(folder)
    session.commit()
    
    had_name = session.query(Folder).filter_by(user_id=user_id, name=folder_name).all()
    had_name = [m.to_json() for m in had_name]
    least_fl_id = had_name[-1]['folder_id']
    #print("least = ", end=" ")
    #print(least_fl_id)
    put_music_folders(user_id, music_id, least_fl_id)
    return 'folder reseived'

def put_music_folders(user_id, music_id, folder_id):
    session = create_session()
    music_folder = Music_Folders(music_id=music_id, folder_id=folder_id, user_id=user_id)
    session.add(music_folder)
    session.commit()
    return 'music_folders reseived'

@app.route('/<user_id>/musics/folders', methods=['GET'])
def get_music_folders(user_id):
    session = create_session()
    data = session.query(Music_Folders).filter_by(user_id=user_id).all()
    data = [m.to_json() for m in data]
    return jsonify(data)



@app.route('/<user_id>/musics/<music_id>/folders', methods=['GET'])
def get_foledr(user_id, music_id):
    session = create_session()
    folder = session.query(Folder).filter_by(user_id=user_id).all()
    folder = [m.to_json() for m in folder]
    return jsonify(folder)


@app.route('/<user_id>/musics/<music_id>/content', methods=['GET'])
def get_music_content(user_id, music_id):
    session = create_session()
    response = make_response()
    music = session.query(Music).get(music_id)
    response.data = music.content
    response.mimetype = "audio/wav"
    return response


@app.route('/<user_id>/musics/<music_id>/created', methods=['GET'])
def create(user_id, music_id):
    session = create_session()
    music = session.query(Music).get(music_id)
    date = music.created
    return jsonify(date)


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

    return jsonify(Datas)


# フーリエ変換
@app.route('/<user_id>/musics/<music_id>/fourier', methods=['GET'])
def fourier(user_id, music_id):
    session = create_session()
    music = session.query(Music).get(music_id)
    rate, data = scipy.io.wavfile.read(io.BytesIO(music.content))
    data = data/32768  # 振幅の配列らしい
    fft_data = np.abs(np.fft.fft(data))  # 縦:dataを高速フーリエ変換
    freList = np.fft.fftfreq(data.shape[0], d=1.0/rate)  # 横:周波数の取得
    Datas = []

    for i in range(min(1000, len(fft_data))):  # len(fft_data)):
        if 0 < freList[i] and freList[i] < 4000:  # 周波数の範囲
            dic = {
                # "x": '{:.4f}'.format(freList[i]),
                "x": int(freList[i]),
                "y": fft_data[i]
            }
            Datas.append(dic)

    return jsonify(Datas)


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

    return jsonify(Datas)


# 基本周波数
@app.route('/<user_id>/musics/<music_id>/frequency', methods=['GET'])
def frequency(user_id, music_id):
    session = create_session()
    music = session.query(Music).get(music_id)
    rate, data = scipy.io.wavfile.read(io.BytesIO(music.content))
    data = data.astype(np.float)
    _f0, _time = pw.dio(data, rate, f0_floor=70, f0_ceil=1600)
    f0 = pw.stonemask(data, _f0, _time, rate)
    Datas = []
    # for i in range(500):  # )len(f0)):
    for i in range(len(f0)):
        dic = {
            "x": i+1,
            "y": f0[i]
        }
        Datas.append(dic)

    return jsonify(Datas)


def frequency_data(user_id, music_id):
    session = create_session()
    music = session.query(Music).get(music_id)
    rate, data = scipy.io.wavfile.read(io.BytesIO(music.content))
    data = data.astype(np.float)
    _f0, _time = pw.dio(data, rate, f0_floor=70, f0_ceil=1600)
    f0 = pw.stonemask(data, _f0, _time, rate)
    Datas = []
    # for i in range(500):  # )len(f0)):
    for i in range(len(f0)):
        dic = {
            "x": i+1,
            "y": f0[i]
        }
        Datas.append(dic)
    return Datas

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


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0',
            port=int(os.environ.get('PORT', 8080)))
