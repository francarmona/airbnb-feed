//import Server from './server';

//const DEFAULT_PORT = 3000;

//(new Server()).listen(process.env.PORT || DEFAULT_PORT);


console.log('asdf');

let a = 'aa';


var express = require('express');
var app = express();
var router = express.Router();

//app.use(express.static('public'));
app.get('/', function (req, res) {
  res.json({'test': 'test'});
  //res.sendfile('./public/index.html');
});

app.listen(5000);
