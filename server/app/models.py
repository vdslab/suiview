import io
import numpy as np
import librosa
from sqlalchemy.ext.automap import automap_base
from db import engine


Base = automap_base()


class User(Base):
    __tablename__ = 'users'

    def to_json(self):
        return {
            'userId': self.id,
            'name': self.name,
        }


class Music(Base):
    __tablename__ = 'musics'

    # XXX remove session from argument
    def fundamental_frequency(self, session, cache=True):
        if not cache or self.f0 is None:
            data, rate = librosa.load(io.BytesIO(self.content), 48000)
            data = data.astype(np.float)
            f0, _, _ = librosa.pyin(data, fmin=librosa.note_to_hz(
                'C2'), fmax=librosa.note_to_hz('C7'))
            self.f0 = f0.tobytes()
            session.commit()
        return np.frombuffer(self.f0, dtype=np.float64)

    def to_json(self):
        return {
            'id': self.id,
            'userId': self.user_id,
            'folderId': self.folder_id,
            'created': self.created,
            'name': self.name,
            'assessment': self.assessment,
        }


class Comment(Base):
    __tablename__ = 'comments'

    def to_json(self):
        return{
            'id': self.id,
            'comment': self.text,
            'created': self.created,
            'writer': self.writer,
        }


class Folder(Base):
    __tablename__ = 'folders'

    def to_json(self):
        return {
            'id': self.id,
            'name': self.name,
        }


Base.prepare(engine, reflect=True)
