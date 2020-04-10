FROM node:12-alpine

RUN apk add python make gcc g++
RUN mkdir /app
WORKDIR /app

ADD . .
RUN npm install

CMD ['node', 'minehut.js']
