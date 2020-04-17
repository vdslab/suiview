import os
from flask import Flask, jsonify
from flask_cors import CORS
from db import create_session
from models import Music

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
    # TODO
    return 'received'


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))
