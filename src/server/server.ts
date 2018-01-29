import * as express from 'express';

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
    this.router.get('/', function(req, res) {
      res.json({'test':'test'});
    });

    this.express.use('/', this.router);
  }

  public listen(port) {
    this.express.listen(port, function() {
      console.log(`Server running on port ${port}`);
    });
  }

}