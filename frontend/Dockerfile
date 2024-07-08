FROM node:20.14

WORKDIR /app

EXPOSE 3000

COPY package*.json ./

RUN npm install

RUN npm i -g serve

COPY . .

RUN npm run build

CMD [ "serve", "-s", "dist" ]
