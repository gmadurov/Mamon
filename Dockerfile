FROM python:3-alpine
COPY requirements.txt /
RUN apk update \
    && apk add --virtual build-deps git python3-dev build-base linux-headers postgresql-dev \
    && apk add --no-cache postgresql-client jpeg-dev zlib-dev openjpeg-dev tiff-dev tk-dev lcms2-dev tcl-dev gettext gettext-dev \
    && pip install -r /requirements.txt \
    && apk del build-deps \
    && rm -rf /root/.cache
RUN mkdir /code
WORKDIR /code
ADD . /code/
ENV PYTHONUNBUFFERED 1
CMD python backend/manage.py migrate && python backend/manage.py runserver 0.0.0.0:8000
