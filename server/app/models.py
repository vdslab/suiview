from sqlalchemy.ext.automap import automap_base
from db import engine


Base = automap_base()


class Music(Base):
    __tablename__ = 'musics'

    def to_json(self):
        return {
            'id': self.id,
            'userId': self.user_id,
            'created': self.created,
            'name': self.name,
        }


class Comment(Base):
    __tablename__ = 'comments'

    def to_json(self):
        return{
            'id': self.id,
            'comment': self.text,
            'created': self.created,
        }


class Folder(Base):
    __tablename__ = 'folders'

    def to_json(self):
        return {
            'id': self.id,
            'name': self.name,
        }


class Music_Folders(Base):
    __tablename__ = 'music_folders'

    def to_json(self):
        return{
            'id': self.id,
            'music_id': self.music_id,
            'folder_id': self.folder_id,
            'user_id': self.user_id
        }


Base.prepare(engine, reflect=True)
