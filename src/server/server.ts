import * as express from 'express';
import * as path from 'path';

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

    this.express.use('/js', express.static('./dist/public/js', staticOptions));
    this.express.use('/sw.js', (req, res) => {
      res.sendFile(path.resolve('./dist/public/sw.js'));
    });
    this.express.use('/', this.router);
  }

  public listen(port) {
    this.express.listen(port, function() {
      console.log(`Server running on port ${port}`);
    });
  }

}