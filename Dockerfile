FROM node:10-alpine

RUN apk add python make gcc g++ git bzip2
RUN mkdir -p /app
WORKDIR /app

ADD . .
RUN npm install

CMD /bin/sh -c "node minehut.js"
