FROM node:carbon

WORKDIR /app

COPY package.json /app
RUN npm install
RUN npm install gulp-cli -g
COPY . /app
RUN npm run build

EXPOSE 8080

CMD [ "npm", "start" ]