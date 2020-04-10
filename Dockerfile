FROM node:10-alpine

RUN apk add python make gcc g++ git bzip2 dumb-init
RUN mkdir -p /app
WORKDIR /app
ENTRYPOINT ['/usr/bin/dumb-init']

ADD . .
RUN npm install

CMD node minehut.js
