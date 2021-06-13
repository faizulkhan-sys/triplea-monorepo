#!/bin/sh
ENV=prod docker-compose down --volumes
docker image prune -a --force
yarn && yarn build && ENV=prod docker-compose up -d --build --force