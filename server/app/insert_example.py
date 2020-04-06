from db import create_session
from models import User, Music


def main():
    session = create_session()
    user = User()
    session.add(user)
    session.commit()
    musics = [Music(user_id=user.id) for _ in range(5)]
    session.add_all(musics)
    session.commit()


if __name__ == '__main__':
    main()
