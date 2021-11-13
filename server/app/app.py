import io
import os
import json
import wave
from flask import Flask, jsonify, request, make_response, g
from flask_cors import CORS
from db import create_session
from models import Music, Comment, Folder, User, StudentTeacher
import numpy as np
import scipy.io.wavfile
from pylab import frombuffer
from scipy import signal
from collections import OrderedDict
import librosa
from dtw import dtw
from auth import requires_auth
import math
from dateutil.tz import gettz
import datetime
from pytz import timezone
from dateutil import parser
app = Flask(__name__)
cors = CORS(app)


@app.route('/users', methods=['GET'])
@requires_auth
def get_users():
    session = create_session()
    user_id = g.current_user['sub']
    user = session.query(User).filter_by(
        id=user_id).first()
    if user == None:
        user = User(id=user_id)
        user.name = user_id
        user.is_teacher = True
        session.add(user)
        session.commit()
    session.close()
    return jsonify(get_student_list(user_id))


def get_student_list(teacher_id):
    session = create_session()
    students = session.query(StudentTeacher).filter_by(
        teacher_id=teacher_id).all()
    data = []
    for i in range(len(students)):
        student = session.query(User).filter_by(
            id=students[i].student_id).first()
        data.append([student.id, student.name])
    print(data)
    session.close()
    return data


@app.route('/student', methods=['POST'])
@requires_auth
def put_student():
    session = create_session()
    user_id = g.current_user['sub']
    data = json.loads(request.data.decode('utf-8'))
    if data != None:
        student_teacher = session.query(StudentTeacher).filter_by(
            teacher_id=user_id, student_id=data).first()
        if student_teacher == None:
            student_teacher = StudentTeacher(
                teacher_id=user_id, student_id=data)
            session.add(student_teacher)
            session.commit()
    session.close()
    return jsonify(get_student_list(user_id))


@app.route('/<user_id>/folders', methods=['GET'])
@requires_auth
def get_student_folder(user_id):
    session = create_session()
    folders = session.query(Folder).filter_by(
        user_id=user_id.replace("%", "|")).all()
    folders = [f.to_json() for f in folders]
    session.close()
    return jsonify(folders)


@app.route('/<user_id>/folders/<folder_id>', methods=['GET'])
@requires_auth
def get_student_folder_musics(user_id, folder_id):
    session = create_session()
    """
    user = session.query(User).filter_by(
        name=user_name).first()
    """
    folder = session.query(Folder).filter_by(
        user_id=user_id.replace("%", "|"), id=folder_id).first()
    musics = session.query(Music).filter_by(
        user_id=user_id.replace("%", "|"), folder_id=folder.id).all()
    musics = [music.to_json() for music in musics]
    musics = sorted(musics, key=lambda x: x['created'], reverse=True)
    session.close()
    return jsonify(musics)


@app.route('/<user_id>/folders/<folder_id>/progress', methods=['GET'])
@requires_auth
def get_students_folder_progress(user_id, folder_id):
    session = create_session()
    musics = session.query(Music).filter_by(
        user_id=user_id.replace("%", "|"), folder_id=folder_id).order_by(Music.id).all()

    Datas = []
    for music in musics:
        Datas.append([music.id, frequency_ave_data(music),  spectrum_rolloff_ave(
            music), decibel_ave_data(music)])

    for i in range(len(Datas)):
        Datas[i].append(Datas[i][1][0]+Datas[i][3][0] + Datas[i][2][0])

    dicDatas = []
    j = 1
    for i in range(len(Datas)-1, -1, -1):
        dic = {
            "x": j,
            "y": round(Datas[i][4], 4)
        }
        dicDatas.append(dic)
        j += 1
    session.close()
    dicDatas = sorted(dicDatas, key=lambda x: x["x"], reverse=True)

    return jsonify(dicDatas)


@app.route('/<user_id>/folders/<folder_id>/parallel', methods=['GET'])
@requires_auth
def get_student_folders_parallel(user_id, folder_id):
    session = create_session()
    musics = session.query(Music).filter_by(
        user_id=user_id.replace("%", "|"), folder_id=folder_id).order_by(Music.id).all()

    Datas = []
    for music in musics:
        Datas.append([music.id, frequency_ave_data(music),  spectrum_rolloff_ave(
            music), decibel_ave_data(music)])

    for i in range(len(Datas)):
        Datas[i].append(Datas[i][1][0]+Datas[i][3][0] + Datas[i][2][0])

    dicDatas = []
    j = 1
    for i in range(len(Datas)-1, -1, -1):
        if j > 10:
            break
        dic = {
            "No.": j,
            "高さ": Datas[i][1][0],
            "音色": Datas[i][2][0],
            "強さ": Datas[i][3][0],
        }
        j += 1
        dicDatas.append(dic)
    dicDatas = sorted(dicDatas, key=lambda x: x["No."], reverse=True)
    session.close()
    return jsonify(dicDatas)


@app.route('/<user_id>/folders/<folder_id>/f0', methods=['GET'])
@requires_auth
def get_student_folder_f0(user_id, folder_id):
    session = create_session()
    user_id = user_id.replace("%", "|")
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
        #Datas.append({"id": musics[0].id, "data": data})
        Datas.append({"id": 1, "data": data})

    else:
        l = len(preData)-1
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
                #Datas.append({"id": musics[0].id, "data": data})
                Datas.append({"id": len(preData), "data": data})

            aliged_data = preData[i][alignment.index2]
            aliged_data = list(aliged_data)
            data = []
            for j in range(len(aliged_data)):
                dic = {
                    "x": j+1,
                    "y": round(aliged_data[j], 4)
                }
                data.append(dic)
            #Datas.append({"id": musics[i].id, "data": data})
            Datas.append({"id": l, "data": data})
            l -= 1

            print("fin"+str(i))
        print("finish")
    session.close()
    return jsonify(Datas)


@ app.route('/<user_id>/folders/<folder_id>/decibel', methods=['GET'])
@ requires_auth
def get_student_folder_decibel(user_id, folder_id):
    session = create_session()
    """
    user = session.query(User).filter_by(
        name=user_name).first()
    """
    user_id = user_id.replace("%", "|")
    musics = session.query(Music).filter_by(folder_id=folder_id,
                                            user_id=user_id).order_by(Music.id).all()

    preData = []

    for music in musics:
        data = decibel_data(music)
        start, end = find_start_end(music)
        data = trim(data, start, end)
        data = np.array(data)
        preData.append(data)

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

        Datas.append({"id": 1, "data": data})

    else:
        l = len(preData)-1
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
                Datas.append({"id": len(preData), "data": data})

            aliged_data = preData[i][alignment.index2]
            aliged_data = list(aliged_data)

            data = []
            for j in range(len(aliged_data)):
                dic = {
                    "x": j+1,
                    "y": str(aliged_data[j])
                }
                data.append(dic)
            Datas.append({"id": l, "data": data})
            l -= 1
            print("fin")
        print("all clear")
    session.close()
    return jsonify(Datas)


@ app.route('/<user_id>/folders/<folder_id>/tone', methods=['GET'])
@ requires_auth
def get_student_folder_tone(user_id, folder_id):
    session = create_session()
    """
    user = session.query(User).filter_by(
        name=user_name).first()
    """
    user_id = user_id.replace("%", "|")
    musics = session.query(Music).filter_by(
        user_id=user_id, folder_id=folder_id).order_by(Music.id).all()

    preData = []

    for music in musics:
        data = spectrum_rolloff_y(music)
        start, end = find_start_end(music)
        data = trim(data, start, end)
        data = np.array(data)
        preData.append(data)

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

        Datas.append({"id": 1, "data": data})

    else:
        l = len(preData)-1
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
                Datas.append({"id": len(preData), "data": data})

            aliged_data = preData[i][alignment.index2]
            aliged_data = list(aliged_data)

            data = []
            for j in range(len(aliged_data)):
                dic = {
                    "x": j+1,
                    "y": str(aliged_data[j])
                }
                data.append(dic)
            Datas.append({"id": l, "data": data})
            l -= 1
            print("fin")
        print("all clear")
    session.close()
    return jsonify(Datas)


@app.route('/<user_id>/musics/<music_id>/content', methods=['GET'])
@requires_auth
def get_student_music_content(user_id, music_id):
    session = create_session()
    """
    user = session.query(User).filter_by(
        name=user_name).first()
    """
    user_id = user_id.replace("%", "|")
    print(user_id)
    response = make_response()
    music = session.query(Music).filter_by(
        user_id=user_id, id=music_id).first()
    print(music)
    if music != None:
        response.data = music.content
        response.mimetype = "audio/wav"
    session.close()
    return response


@ app.route('/<user_id>/musics/<music_id>/f0', methods=['GET'])
@ requires_auth
def get_student_music_f0(user_id, music_id):
    session = create_session()
    """
    user = session.query(User).filter_by(
        name=user_name).first()
    """
    user_id = user_id.replace("%", "|")
    music = session.query(Music).filter_by(
        user_id=user_id, id=music_id).first()

    f0 = music.fundamental_frequency(session)

    average = frequency_ave_data(music)

    start, end = find_start_end(music)
    data = []
    j = 0
    if end < len(f0)-2:
        end += 1
    for i in range(max(0, start), end):
        if f0[i] >= 0:
            dic = {
                "x": j,
                "y": round(f0[i], 4)
            }
        else:
            dic = {
                "x": i+1,
                "y": 0
            }
        j += 1
        data.append(dic)

    session.close()
    return jsonify({
        'average': average[1],
        's': average[0],
        'values': data
    })


@ app.route('/<user_id>/musics/<music_id>/decibel', methods=['GET'])
@ requires_auth
def get_student_music_decibel(user_id, music_id):
    session = create_session()
    """
    user = session.query(User).filter_by(
        name=user_name).first()
    """
    user_id = user_id.replace("%", "|")
    music = session.query(Music).filter_by(
        user_id=user_id, id=music_id).first()
    rate, data = scipy.io.wavfile.read(io.BytesIO(music.content))
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

    data = []
    j = 0
    if end < len(dbLine)-2:
        end += 1
    for i in range(start, end):
        dic = {
            "x": j,
            "y": round(dbLine[i], 4)
        }
        data.append(dic)
        j += 1

    average = decibel_ave_data(music)

    session.close()
    return jsonify({'average': average[1], 's': average[0], 'values': data})


@ app.route('/<user_id>/musics/<music_id>/centroid', methods=['GET'])
@ requires_auth
def get_student_music_spectrum_centroid(user_id, music_id):
    session = create_session()
    """
    user = session.query(User).filter_by(
        name=user_name).first()
    """
    user_id = user_id.replace("%", "|")
    music = session.query(Music).filter_by(
        user_id=user_id, id=music_id).first()
    session.close()
    return jsonify({
        'values': spectrum_centroid(music)
    })


@ app.route('/<user_id>/musics/<music_id>/rolloff', methods=['GET'])
@ requires_auth
def get_student_music_spectrum_rolloff(user_id, music_id):
    session = create_session()
    """
    user = session.query(User).filter_by(
        name=user_name).first()
    """
    user_id = user_id.replace("%", "|")
    music = session.query(Music).filter_by(
        user_id=user_id, id=music_id).first()
    average = spectrum_rolloff_ave(music)
    session.close()
    return jsonify({
        'average': {"stability": average[1], 's': average[0]},
        'values': spectrum_rolloff(music)
    })


@app.route('/<user_id>/musics/<music_id>/comment', methods=['POST'])
@ requires_auth
def put_teacher_comment(user_id, music_id):
    session = create_session()
    teacher_id = g.current_user['sub']
    teacher = session.query(User).filter_by(
        id=teacher_id).first()
    """
    student = session.query(User).filter_by(
        name=user_name).first()
    """
    student_id = user_id.replace("%", "|")
    data = json.loads(request.data.decode('utf-8'))
    comment = Comment(
        music_id=music_id, text=data['comment'], user_id=student_id, writer=teacher.name)
    session.add(comment)
    session.commit()
    session.close()
    return jsonify("receive")


@ app.route('/<user_id>/musics/<music_id>/stability', methods=['GET'])
@ requires_auth
def get_student_folder_stability(user_id, music_id):
    session = create_session()
    """
    student = session.query(User).filter_by(
        name=user_name).first()  
    """
    student_id = user_id.replace("%", "|")
    music = session.query(Music).filter_by(
        user_id=student_id, id=music_id).first()
    f0_ave = frequency_ave_data(music)
    vol_ave = decibel_ave_data(music)
    tone_ave = spectrum_rolloff_ave(music)
    data = {"f0": f0_ave[0], "vol": vol_ave[0], "tone": tone_ave[0],
            "total": f0_ave[0]+vol_ave[0]+tone_ave[0]}
    print(data)
    session.close()
    return jsonify(data)
#########################################################
#########################################################


# 初回ログイン時にできるようにする
@app.route('/username', methods=['GET'])
@requires_auth
def get_username():
    session = create_session()
    user_id = g.current_user['sub']
    user = session.query(User).filter_by(
        id=user_id).first()
    if user == None:
        user = User(id=user_id)
        user.name = "undefind"
        session.add(user)
    session.commit()
    user = user.to_json()
    session.close()
    print(user)
    return jsonify(user)


@app.route('/username', methods=['PUT'])
@requires_auth
def put_username():
    session = create_session()
    user_id = g.current_user['sub']
    data = json.loads(request.data.decode('utf-8'))
    user = session.query(User).filter_by(
        id=user_id).first()
    user.name = data["name"]
    session.add(user)
    session.commit()
    user = user.to_json()
    session.close()
    return jsonify(user)


@app.route('/musics', methods=['GET'])
@requires_auth
def get_musics():
    session = create_session()
    user_id = g.current_user['sub']
    musics = session.query(Music).filter_by(
        user_id=user_id).order_by(Music.created.desc()).all()
    musics = [music.to_json() for music in musics]
    Days = []
    for music in musics:
        day = str(music['created'].year)+"/" + \
            str(music['created'].month).zfill(2) + \
            "/"+str(music['created'].day).zfill(2)
        Days.append([day, 0])
    session.close()
    Days = list(map(list, set(map(tuple, Days))))
    Days.sort(reverse=True)
    data = {"music": musics, "day": Days}
    return jsonify(data)


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


@ app.route('/musics/<music_id>', methods=['GET'])
@ requires_auth
def get_music(music_id):
    session = create_session()
    user_id = g.current_user['sub']
    music = session.query(Music).filter_by(
        id=music_id, user_id=user_id).first()
    music = music.to_json()
    print(music)
    if music["assessment"] == None:
        music["assessment"] = 0
    print(music)
    session.close()
    return jsonify(music)


@ app.route('/musics/<music_id>', methods=['PUT'])
@ requires_auth
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


@ app.route('/musics/<music_id>', methods=['DELETE'])
@ requires_auth
def delete_music(music_id):
    session = create_session()
    user_id = g.current_user['sub']
    session.query(Music).filter_by(id=music_id, user_id=user_id).delete()
    session.commit()
    session.close()
    return jsonify({'message': 'deleted'})


@ app.route('/musics/<music_id>/content', methods=['GET'])
@ requires_auth
def get_music_content(music_id):
    session = create_session()
    user_id = g.current_user['sub']
    response = make_response()
    music = session.query(Music).filter_by(
        user_id=user_id, id=music_id).first()
    if music == None:
        return jsonify("no content")
    response.data = music.content
    response.mimetype = "audio/wav"
    session.close()
    return response


@ app.route('/musics/<music_id>/content', methods=['PUT'])
@ requires_auth
def put_music_content(music_id):
    session = create_session()
    user_id = g.current_user['sub']
    data = json.loads(request.data.decode('utf-8'))
    music = session.query(Music).filter_by(
        user_id=user_id, id=music_id).first()

    if 'name' in data:
        music.name = data['name']
    if 'folderId' in data:
        music.folder_id = data['folderId']

    if 'assessment' in data:
        music.assessment = data['assessment']
    if 'comment' in data:
        comment = Comment(music_id=music_id,
                          text=data['comment'], user_id=user_id)
        session.add(comment)

    music.name = music.created
    jst_time = music.name + datetime.timedelta(hours=9)
    time_str = jst_time.strftime('%Y/%m/%d  %H:%M:%S')
    music.name = time_str
    time_str = jst_time
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
    comment = Comment(music_id=music_id, text=data['item'], user_id=user_id)
    session.add(comment)
    session.commit()
    session.close()
    return get_comment(music_id)


@ app.route('/musics/<music_id>/assesment', methods=['PUT'])
@ requires_auth
def put_assesment(music_id):
    session = create_session()
    user_id = g.current_user['sub']
    data = json.loads(request.data.decode('utf-8'))
    music = session.query(Music).filter_by(
        user_id=user_id, id=music_id).first()
    music.assessment = data
    print(data, music.assessment)
    session.add(music)
    session.commit()
    music = music.to_json()
    print(music)
    session.close()
    return jsonify(music)


# フォルダのリストを返す
@ app.route('/folders', methods=['GET'])
@ requires_auth
def get_folders():
    session = create_session()
    user_id = g.current_user['sub']
    folders = session.query(Folder).filter_by(user_id=user_id).all()
    # 初期フォルダーの作成
    # 英語の時どうする？
    if len(folders) == 0:
        folder = Folder(name="ロングトーン", user_id=user_id)
        session.add(folder)
        folder = Folder(name="スケール", user_id=user_id)
        session.add(folder)
        folder = Folder(name="アルペジオ", user_id=user_id)
        session.add(folder)
        session.commit()
    folders = session.query(Folder).filter_by(user_id=user_id).all()
    folders = [f.to_json() for f in folders]
    session.close()
    return jsonify(folders)


# フォルダの追加
@ app.route('/folders', methods=['POST'])
@ requires_auth
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


@ app.route('/folders/<folder_id>', methods=['GET'])
@ requires_auth
def get_folder(folder_id):
    session = create_session()
    user_id = g.current_user['sub']
    folder = session.query(Folder).filter_by(
        id=folder_id, user_id=user_id).first()
    print(folder)
    if folder != None:
        folder = folder.to_json()
    print(folder)
    session.commit()
    session.close()
    return jsonify(folder)


@ app.route('/folders/<folder_id>', methods=['PUT'])
@ requires_auth
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


@ app.route('/folders/<folder_id>', methods=['DELETE'])
@ requires_auth
def delete_folder(folder_id):
    session = create_session()
    user_id = g.current_user['sub']
    session.query(Music).filter_by(
        folder_id=folder_id, user_id=user_id).delete()
    session.query(Folder).filter_by(id=folder_id, user_id=user_id).delete()
    session.commit()
    session.close()
    return jsonify({'message': 'deleted'})


@ app.route('/folders/<folder_id>/musics', methods=['GET'])
@ requires_auth
def get_folder_musics(folder_id):
    session = create_session()
    user_id = g.current_user['sub']
    musics = session.query(Music).filter_by(
        folder_id=folder_id, user_id=user_id).all()
    musics = [m.to_json() for m in musics]
    musics = sorted(musics, key=lambda x: x['created'], reverse=True)
    session.close()
    return jsonify(musics)


@ app.route('/comments/<comment_id>', methods=['DELETE'])
@ requires_auth
def delete_comment(comment_id):
    session = create_session()
    user_id = g.current_user['sub']
    session.query(Comment).filter_by(id=comment_id, user_id=user_id).delete()
    session.commit()
    session.close()
    return {"message": "deleted"}


@ app.route('/folders/<folder_id>/f0', methods=['GET'])
@ requires_auth
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
        Datas.append({"id": 1, "data": data})
        # Datas.append({"id": musics[0].id, "data": data})

    else:
        l = len(preData)-1
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
                Datas.append({"id": len(preData), "data": data})
                #Datas.append({"id": musics[0].id, "data": data})

            aliged_data = preData[i][alignment.index2]
            aliged_data = list(aliged_data)
            data = []
            for j in range(len(aliged_data)):
                dic = {
                    "x": j+1,
                    "y": round(aliged_data[j], 4)
                }
                data.append(dic)
            #Datas.append({"id": musics[i].id, "data": data})
            Datas.append({"id": l, "data": data})
            l -= 1
            print("fin"+str(i))
        print("finish")
    session.close()
    return jsonify(Datas)


# parallelCoordinates
@ app.route('/folders/<folder_id>/parallel', methods=['GET'])
@ requires_auth
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
        Datas[i].append(Datas[i][1][0]+Datas[i][3][0] + Datas[i][2][0])
    #Datas = sorted(Datas, key=lambda x: x[4])
    dicDatas = []
    j = 1
    # for i in range(len(Datas)):
    for i in range(len(Datas)-1, -1, -1):
        if j > 10:
            break
        dic = {
            # "No.": Datas[i][0],
            "No.": j,
            "高さ": Datas[i][1][0],
            "強さ": Datas[i][3][0],
            "音色": Datas[i][2][0],
        }
        j += 1
        dicDatas.append(dic)
    dicDatas = sorted(dicDatas, key=lambda x: x["No."], reverse=True)
    session.close()
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
        Datas[i].append(Datas[i][1][0]+Datas[i][3][0] + Datas[i][2][0])

    dicDatas = []
    j = 1
    for i in range(len(Datas)-1, -1, -1):
        dic = {
            # "x": Datas[i][0],
            "x": j,
            "y": round(Datas[i][4], 4)
        }
        dicDatas.append(dic)
        j += 1
    dicDatas = sorted(dicDatas, key=lambda x: x["x"], reverse=True)

    session.close()
    return jsonify(dicDatas)


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
    times = librosa.times_like(db, sr=48000)
    print("len", times)
    print(times)
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

    data = []
    if end < len(dbLine)-2:
        end += 1
    j = 0
    for i in range(start, end):
        dic = {
            # "x": j,
            "x":  round(times[i], 2),
            "y": round(dbLine[i], 4)
        }
        data.append(dic)
        j += 1

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

    a = 70
    x = np.arange(0, 40)
    y = np.exp(-x/a)
    if s < 40:
        s = y[int(s)]
    else:
        s = y[-1]
    print("vol = ", s)

    return [round(s*100), round(stability, 4)]


def trim(data, start, end):
    res = []
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

        Datas.append({"id": 1, "data": data})

    else:
        l = len(preData)-1

        alignment = dtw(preData[0], preData[1], keep_internals=True)
        # データの中で一番長いやつの時間をとる
        # DTWの伸び縮みしないやつがいいね
        times = librosa.times_like(preData[0][alignment.index1], sr=48000)

        for i in range(1, len(preData)):
            alignment = dtw(preData[0], preData[i], keep_internals=True)

            if i == 1:
                aliged_data = preData[0][alignment.index1]
                aliged_data = list(aliged_data)

                data = []
                for j in range(len(aliged_data)):
                    dic = {
                        # "x": j+1,
                        "x": round(times[j], 2),
                        "y": str(aliged_data[j])
                    }
                    data.append(dic)
                Datas.append({"id": len(preData), "data": data})

            aliged_data = preData[i][alignment.index2]
            aliged_data = list(aliged_data)

            data = []
            for j in range(len(aliged_data)):
                dic = {
                    # "x": j+1,
                    "x": round(times[j], 2),
                    "y": str(aliged_data[j])
                }
                data.append(dic)
            Datas.append({"id": l, "data": data})
            l -= 1
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
    times = librosa.times_like(f0, sr=48000)
    print(len(f0))
    print("len", times)
    print(times)

    average = frequency_ave_data(music)

    start, end = find_start_end(music)
    data = []
    if end < len(f0)-2:
        end += 1
    j = 0
    for i in range(max(0, start), end):
        if f0[i] >= 0:
            dic = {
                "x": round(times[i], 2),
                "y": round(f0[i], 4)
            }
        else:
            dic = {
                "x":  round(times[i], 2),
                "y": 0
            }
        data.append(dic)
        j += 1

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
    for i in range(max(0, start), end-1):
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
    else:
        s = -1

    if cnt != 0:
        stability = total/cnt
    else:
        stability = -1

    normalized_s = 0
    tone_n = 0
    i = start
    while i < end-1:
        if data[i+1] == 0 or data[i]/data[i+1] == 0:
            cent = 0
        else:
            cent = 1200*math.log2(data[i]/data[i+1])
        sp = i
        count = 0
        total = 0
        while i < end-1 and abs(cent) <= 38:
            total += data[i]
            count += 1
            i += 1
            if data[i+1] == 0 or data[i]/data[i+1] == 0:
                cent = 0
            else:
                # cent = 1200*math.log2(data[i]/data[i+1])
                cent = 1200*math.log2(data[i]/data[i+1])
        if count >= 15:
            ave = total/count
            ns = 0
            while sp <= i:
                ns += pow(data[sp]-ave, 2)
                sp += 1
            ns /= count
            ns = math.sqrt(ns)
            tone_n += 1
            normalized_s += ns
        i += 1
    if tone_n == 0:
        s = 0
    else:
        ss = normalized_s/tone_n
        # 閾値
        a = 4
        x = np.arange(0, 5.0, 0.01)
        y = np.exp(-x/a)
        if round(ss*100) < len(y):
            s = y[round(ss*100)]
        else:
            s = 0
    session.close()
    print("fre = ", s)

    return [round(s*100), round(stability, 4)]


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
    times = librosa.times_like(cent, sr=48000)
    start, end = find_start_end(music)
    Datas = []
    if end < len(cent[0]-2):
        end += 1
    j = 0
    for i in range(start, end):
        dic = {
            "x": round(times[i], 2),
            # "x": j,
            "y": round(cent[0][i], 4)
        }
        Datas.append(dic)
        j += 1
    session.close()
    return Datas


# ----スペクトルロールオフ---------
def spectrum_rolloff(music):
    session = create_session()
    y, sr = librosa.load(io.BytesIO(music.content), 48000)
    rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr)
    times = librosa.times_like(rolloff, sr=48000)
    #print("len", times)
    # print(times)

    start, end = find_start_end(music)
    Datas = []
    if end < len(rolloff[0]-2):
        end += 1
    j = 0
    for i in range(start, end):
        dic = {
            "x": round(times[i], 2),
            # "x": j,
            "y": round(rolloff[0][i], 4)
        }
        Datas.append(dic)
        j += 1
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

    a = 15000
    x = np.arange(0, 12000)
    y = np.exp(-x/a)
    if s != -1 and s < 12000:
        s = y[int(s)]
    elif s != -1:
        s = y[-1]
    print("tone = ", s)
    return [round(s*100), round(stability, 4)]


def spectrum_rolloff_y(music):
    session = create_session()
    y, sr = librosa.load(io.BytesIO(music.content), 48000)
    # 引数roll_percent=0.8がデフォ
    rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr)
    Datas = []
    for i in range(len(rolloff[0])):
        Datas.append(round(rolloff[0][i], 4))
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

    session.close()
    return jsonify(Datas)


@ app.route('/musics/<music_id>/spectrum_centroid', methods=['GET'])
@ requires_auth
def get_music_spectrum_centroid(music_id):
    session = create_session()
    user_id = g.current_user['sub']
    music = session.query(Music).filter_by(
        user_id=user_id, id=music_id).first()
    session.close()
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
    session.close()
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

        Datas.append({"id": 1, "data": data})

    else:
        l = len(preData)-1
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
                Datas.append({"id": len(preData), "data": data})

            aliged_data = preData[i][alignment.index2]
            aliged_data = list(aliged_data)
            data = []
            for j in range(len(aliged_data)):
                dic = {
                    "x": j+1,
                    "y": str(aliged_data[j])
                }
                data.append(dic)
            Datas.append({"id": l, "data": data})
            l -= 1
            print("fin")
        print("all clear")
    session.close()
    return jsonify(Datas)


@ app.route('/musics/<music_id>/stability', methods=['GET'])
@ requires_auth
def get_folder_stability(music_id):
    session = create_session()
    user_id = g.current_user['sub']
    music = session.query(Music).filter_by(
        user_id=user_id, id=music_id).first()
    f0_ave = frequency_ave_data(music)
    vol_ave = decibel_ave_data(music)
    tone_ave = spectrum_rolloff_ave(music)
    data = {"f0": f0_ave[0], "vol": vol_ave[0], "tone": tone_ave[0],
            "total": f0_ave[0]+vol_ave[0]+tone_ave[0]}
    print(data)
    session.close()
    return jsonify(data)


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0',
            port=int(os.environ.get('PORT', 8080)))
