FROM python:3.10.7-alpine
COPY backend/requirements.txt ./
RUN apk update \
    && apk add postgresql-dev gcc python3-dev musl-dev \
    && apk add -u zlib-dev jpeg-dev gcc musl-dev \
    && pip install -r requirements.txt 
RUN mkdir /code
WORKDIR /code
ADD . /code/
ENV PYTHONUNBUFFERED 1
EXPOSE 8000
CMD gunicorn core.wsgi   --chdir backend -b 0.0.0.0:8000 --log-file -
