import * as express from 'express';
import * as path from 'path';
import Scraper from './scraper';
import * as fs from 'fs';

export default class Server {

  private router;
  private express;

  constructor() {
    this.express = express();
    this.router = express.Router();
    this.setCorssMiddleware();
    this.setupRoutes();
  }

  private setCorssMiddleware() {
    this.router.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });
  }

  private setupRoutes() {
    const staticOptions = {
      maxAge: 0
    };

    this.router.get('/', function(req, res) {
      res.sendFile(path.join(path.resolve('./dist/public/index.html')));
    });

    this.router.get('/api/v1/houses', function(req, res) {
      const scraper = new Scraper();
      let rawHouses = fs.readFileSync('./dist/server/houses.json');
      let houses = JSON.parse(rawHouses.toString());
      if(houses.length > 0) {
        res.json(houses);
        scraper.getHouses()
          .catch((error) => {
            console.log(error);
          });
      } else {
        scraper.getHouses().then((data) => {
          res.json(data);
        })
        .catch((error) => {
          console.log(error);
          res.json(houses);
        });
      }
    });

    this.express.use('/js', express.static('./dist/public/js', staticOptions));
    this.express.use('/css', express.static('./dist/public/css', staticOptions));
    this.express.use('/imgs', express.static('./dist/public/imgs', staticOptions));
    this.express.use('/sw.js', (req, res) => {
      res.sendFile(path.resolve('./dist/public/sw.js'));
    });
    this.express.use('/manifest.json', (req, res) => {
      res.sendFile(path.resolve('./dist/public/manifest.json'));
    });
    this.express.use('/', this.router);
  }

  public listen(port) {
    this.express.listen(port, function() {
      console.log(`Server running on port ${port}`);
    });
  }

}