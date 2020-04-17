# MusicVis API Server

## Development

- requirements

  - Python3

    ```shell-session
    pip3 install -r requirements.txt
    ```

- start

  - set env

    ```shell-session
    export PGHOST='localhost'
    export PGPORT='5432'
    export PGDATABASE='databasename'
    export PGUSER='youraccount'
    export PGPASSWORD='yourpassword'
    ```

  - start app

    ```shell-session
    python3 app/app.py
    ```

## Production
