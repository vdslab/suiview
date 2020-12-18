FROM python:3.8.6

ENV APP_HOME /app
ENV PGHOST localhost
ENV PGPORT 5432
ENV PGDATABASE musicvis
ENV PGUSER musicvis
ENV PGPASSWORD musicvis
WORKDIR $APP_HOME

RUN apt-get update
RUN apt-get install -y libsndfile1-dev
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY app .

CMD exec gunicorn --bind :$PORT --workers 1 --timeout 0 --threads 8 app:app
