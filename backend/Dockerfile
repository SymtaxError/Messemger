FROM python:3
WORKDIR /var/messemger/backend/

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

COPY ./requirements.txt ./
RUN pip3 install -r ./requirements.txt
COPY . ./