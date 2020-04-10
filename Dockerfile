FROM node:12-alpine

RUN apk add python make gcc g++ git bzip2
RUN mkdir /app
WORKDIR /app

ADD . .
RUN npm install

CMD node minehut.js
