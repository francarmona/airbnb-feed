FROM node:carbon

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        curl \
    && mkdir /tmp/phantomjs \
    && curl -L https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-2.1.1-linux-x86_64.tar.bz2 \
           | tar -xj --strip-components=1 -C /tmp/phantomjs \
    && cd /tmp/phantomjs \
    && mv bin/phantomjs /usr/local/bin \
    && cd \
    && apt-get purge --auto-remove -y \
       curl \
    && apt-get clean \
    && rm -rf /tmp/* /var/lib/apt/lists/*
RUN phantomjs -v

COPY package.json /app
RUN npm install
RUN npm install gulp-cli -g
COPY . /app
RUN npm run build

EXPOSE 5000

CMD [ "npm", "start" ]