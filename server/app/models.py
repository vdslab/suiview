import pytz
from sqlalchemy import Column, Integer, ForeignKey, LargeBinary, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
import datetime


Base = declarative_base()


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)

    def to_json(self):
        return {
            'id': self.id,
        }


class Music(Base):
    __tablename__ = 'musics'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    name = Column(Text)
    content = Column(LargeBinary)
    created = Column(DateTime, default=datetime.datetime.now(
        pytz.timezone('Asia/Tokyo')))

    def to_json(self):
        return {
            'id': self.id,
            'userId': self.user_id,
            'created': self.created,
            'name': self.name,
        }


def to_date_string(date):
    if date is None:
        return None
    else:
        return date.strftime('%Y/%m/%d/%H:%M')


class Comment(Base):
    __tablename__ = 'comments'
    id = Column(Integer, primary_key=True)
    music_id = Column(Integer, ForeignKey('musics.id'))
    text = Column(Text)
    created = Column(DateTime, default=datetime.datetime.now(
        pytz.timezone('Asia/Tokyo')))

    def to_json(self):
        return{
            'id': self.id,
            'comment': self.text,
            'created': self.created,
        }


class Folder(Base):
    __tablename__ = 'folders'

    id = Column(Integer, primary_key=True)
    name = Column(Text)
    user_id = Column(Integer, ForeignKey('users.id'))
    #folder_id = Column(Text)

    def to_json(self):
        return {
            'id': self.id,
            'name': self.name,
        }


class Music_Folders(Base):
    __tablename__ = 'music_folders'

    id = Column(Integer, primary_key=True)
    music_id = Column(Integer, ForeignKey('musics.id'))
    folder_id = Column(Integer, ForeignKey('folders.id'))
    user_id = Column(Integer, ForeignKey('users.id'))

    def to_json(self):
        return{
            'id': self.id,
            'music_id': self.music_id,
            'folder_id': self.folder_id,
        }
