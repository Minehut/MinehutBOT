FROM node:10-alpine

ENV TINI_VERSION v0.18.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini tini
RUN chmod +x ./tini
ENTRYPOINT ["./tini", "--"]

RUN apk add python make gcc g++ git bzip2
RUN mkdir /app
WORKDIR /app

ADD . .
RUN npm install

CMD node minehut.js
