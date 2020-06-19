import os
import sqlalchemy
from sqlalchemy.orm import sessionmaker
from models import Base


def create_engine():
    drivername = 'postgres+pg8000'
    db_host = os.environ.get('PGHOST')
    db_port = os.environ.get('PGPORT')
    db_name = os.environ.get('PGDATABASE')
    db_user = os.environ.get('PGUSER')
    db_pass = os.environ.get('PGPASSWORD')
    target = os.environ.get('TARGET', 'development')

    if target == 'production':
        cloud_sql_connection_name = os.environ.get('CONNECTION')
        socket_path = '/cloudsql/{}/.s.PGSQL.5432'.format(
            cloud_sql_connection_name)
        return sqlalchemy.create_engine(
            sqlalchemy.engine.url.URL(
                drivername=drivername,
                username=db_user,
                password=db_pass,
                database=db_name,
                query={
                    'unix_sock': socket_path
                }
            ),
            client_encoding="utf8",
            encoding="utf8",
        )
    return sqlalchemy.create_engine(
        sqlalchemy.engine.url.URL(
            drivername=drivername,
            username=db_user,
            password=db_pass,
            database=db_name,
            host=db_host,
            port=db_port,
            #query={'charset': 'utf8'},
        ),
        client_encoding="utf8",
        encoding="utf8",
    )


engine = create_engine()
Session = sessionmaker(bind=engine)


def create_session():
    return Session()


if __name__ == '__main__':
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)
