FROM node:lts

COPY package.json /code/package.json

WORKDIR /code

RUN npm install

COPY server.js /code/server.js

EXPOSE 3000

CMD [ "node", "server.js" ]