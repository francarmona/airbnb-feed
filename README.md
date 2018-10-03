# Airbnb feed
A basic *offline first* airbnb feed made by scraping https://www.airbnb.es/s/homes, taking data out and serving it with a node express API.

Demo: [Airbnb feed](https://airbnb-feed.fcarmona.com).

![Airbnb feed demo picture](http://i64.tinypic.com/2isia35.png)

## Out of the box

* Offline first web app.
* Fully responsive.
* Build with Gulp.
* Web scraping with [PhantomJS](http://http://phantomjs.org/).
* Material design with [Materialize](http://materializecss.com/).
* API with Node Express.
* Add to home screen feature (manifest.json).
* Deploy with Docker.

## Dependencies

* Node and npm (for easy managing of node version use [nvm](https://github.com/creationix/nvm)).
* Gulp (npm install gulp-cli -g).
* Docker (if you run the app with Docker).

## Run

First, install dependencies:
```sh
npm install
```
Then run:

```sh
npm run serve
```

Now you should have the app running on http://localhost:5000.

If you use *npm run serve* gulp will listen for file changes and will re-build the app, so that is good for development.

You can also do:

```sh
npm run build
```
and then,

```sh
npm run start
```
but this way it won´t listen changes of files (good for production).

## Build and run with Docker

You can also run it with Docker. Just build the image:
```sh
docker build -t <your username>/node-web-app .
```
and then run it:
```sh
docker run -p 5000:5000 -d <your username>/node-web-app
```
