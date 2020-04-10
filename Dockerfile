FROM node:12

RUN mkdir /app
WORKDIR /app

ADD . .
RUN npm install

CMD ['node', 'minehut.js']
