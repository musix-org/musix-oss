FROM docker.io/node:20-alpine

#Dependencies
RUN apk add --virtual .build-deps python3 make g++ gcc git

WORKDIR /usr/src/app

COPY / /usr/src/app/

RUN npm install

RUN npm run build

CMD [ "npm", "start" ]
