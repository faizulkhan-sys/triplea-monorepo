FROM node:12.20.0-alpine3.12
WORKDIR /usr/src/app
COPY package.json ./


RUN yarn install --network-timeout 1000000000

RUN npm install --production

COPY .. /usr/src/app/
EXPOSE 4000

CMD [ "npm","run","start",":prod"]






