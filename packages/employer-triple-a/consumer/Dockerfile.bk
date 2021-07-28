FROM node:12.20.0-alpine3.12
WORKDIR /usr/src/app
COPY package.json ./

RUN yarn install --network-timeout 1000000000
