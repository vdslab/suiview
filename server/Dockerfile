# Use the official Python image.
# https://hub.docker.com/_/python
FROM python:3.8.6

# Copy local code to the container image.
ENV APP_HOME /app
ENV PGHOST localhost
ENV PGPORT 5432
ENV PGDATABASE musicvis
ENV PGUSER musicvis
ENV PGPASSWORD musicvis
WORKDIR $APP_HOME
COPY app .

RUN apt-get update
RUN apt-get install -y libsndfile1-dev

# Install production dependencies.
RUN pip install -r requirements.txt

# Run the web service on container startup. Here we use the gunicorn
# webserver, with one worker process and 8 threads.
# For environments with multiple CPU cores, increase the number of workers
# to be equal to the cores available.
CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 app:app
