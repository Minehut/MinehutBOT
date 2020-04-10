FROM node:10-alpine

ENV TINI_VERSION v0.18.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /app/tini
RUN chmod +x /app/tini
ENTRYPOINT ["/app/tini", "--"]

RUN apk add python make gcc g++ git bzip2
RUN mkdir -p /app
WORKDIR /app

ADD . .
RUN npm install

CMD node minehut.js
