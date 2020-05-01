import os
from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
from db import create_session
from models import Music, User
# 追加
import numpy as np
import scipy.io.wavfile
import wave
from pylab import frombuffer


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
    return 'received'


@app.route('/<user_id>/musics/<music_id>/content', methods=['GET'])
def get_music_content(user_id, music_id):
    response = make_response()
    music = session.query(Music).get(music_id)
    response.data = music.content
    response.mimetype = "application/octet-stream"
    return response


#　波形
def amplitude(user_id, music_id):
    wav_filename = '/<user_id>/musics/<music_id>/content'  # 引数とこれはあってるのか
    wf = wave.open(wav_filename, "r")
    buffer = wf.readframes(wf.getnframes())
    # 縦:振幅 2バイトずつ整理(-32768から32767)
    data = frombuffer(buffer, dtype="int16")
    # 横:サンプル数or時間
    y = len(data)  # サンプル数
    time = float(wf.getnframes()) / wf.getframerate()
    # 時間/サンプル数で1サンプル当たりの秒数→データの範囲絞ったとき時間表示するのに使う？
    return data, y, time


# フーリエ変換
def fourier(user_id, music_id):
    wav_filename = '/<user_id>/musics/<music_id>/content'
    rate, data = scipy.io.wavfile.read(wav_filename)
    data = data/32768  # 振幅の配列らしい
    fft_data = np.abs(np.fft.fft(data))  # 縦:dataを高速フーリエ変換
    freList = np.fft.fftfreq(data.shape[0], d=1.0/rate)  # 横:周波数の取得
    return fft_data, freList


# スペクトログラム
def spectrogram(user_id, music_id):
    #wav_filename = ""
    """
     時間,周波数,色？=振幅(音量)?が必要
     色はデシベルの相対から付けてるらしい
     heatMapに渡すなら縦横色に整理して渡すっぽい
    """


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0',
            port=int(os.environ.get('PORT', 8080)))
