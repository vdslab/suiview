import io
import os
import wave
from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
from db import create_session
from models import Music, User
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

app = Flask(__name__)
cors = CORS(app)
session = create_session()


@app.route('/<user_id>/musics', methods=['GET'])
def get_musics(user_id):
    musics = session.query(Music).filter_by(user_id=user_id).all()
    musics = [m.to_json() for m in musics]
    return jsonify(musics)


@app.route('/<user_id>/musics', methods=['PUT'])
def put_music(user_id):
    music = Music(user_id=user_id, content=request.data)
    session.add(music)
    session.commit()
    # get_created_date()
    return 'received'


def get_created_date():
    d = datetime.datetime.now()
    date = d.strftime('%Y/%m/%d/%H:%M')
    # print(date)
    return date


@app.route('/<user_id>/musics/<music_id>/content', methods=['GET'])
def get_music_content(user_id, music_id):
    response = make_response()
    music = session.query(Music).get(music_id)
    # print(type(music))
    response.data = music.content
    # response.mimetype = "application/octet-stream"
    response.mimetype = "audio/wav"
    return response


@app.route('/<user_id>/musics/<music_id>/created', methods=['GET'])
def create(user_id, music_id):
    music = session.query(Music).get(music_id)
    date = music.created
    return jsonify(date)


#　波形
@app.route('/<user_id>/musics/<music_id>/amplitude', methods=['GET'])
def amplitude(user_id, music_id):
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
    n = int(music_id2)
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
