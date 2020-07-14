FROM node:12

RUN mkdir -p /app
WORKDIR /app
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

ADD . .
RUN npm install

CMD ["/usr/local/bin/npm", "start"]
