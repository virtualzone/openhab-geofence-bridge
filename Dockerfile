FROM node:8-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
COPY server.js /usr/src/app/
RUN npm install

EXPOSE 8080
CMD [ "npm", "start" ]
