from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.ext.declarative import declarative_base

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

    def to_json(self):
        return {
            'id': self.id,
            'userId': self.user_id,
        }
