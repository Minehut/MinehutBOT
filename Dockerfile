FROM node:12-alpine

RUN apk add dumb-init
RUN mkdir -p /app
WORKDIR /app
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

ADD . .
RUN yarn install

CMD ["/usr/local/bin/yarn", "start"]
