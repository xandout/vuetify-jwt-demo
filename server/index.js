// Load ENV via runtime(docker)
// require('dotenv').config(); // Sets up dotenv as soon as our application starts

const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
var cors = require('cors')

const app = express();
const router = express.Router();

const environment = process.env.NODE_ENV; // development
const stage = require('./config')[environment];

// Configure global mongoose
var mongoose = require('mongoose');

const connUri = process.env.MONGO_LOCAL_CONN_URL;
const connUser = process.env.MONGO_USER;
const connPass = process.env.MONGO_PASS;

global.db = (global.db ? global.db : mongoose.createConnection(connUri, {
  // https://mongoosejs.com/docs/deprecations.html
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
  user: connUser,
  pass: connPass,
  auth: {
    "authSource": "admin"
  }
}))

app.use(cors())
app.use(express.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

if (environment !== 'production') {
  app.use(logger('dev'));
}

const routes = require('./routes/index.js');

app.use('/api/v1', routes(router));

app.listen(`${stage.port}`, () => {
  console.log(`Server now listening at localhost:${stage.port}`);
});

// Uncomment below if you want to serve on https as well

/*
console.log("Starting up https")
const https = require("https"),
  fs = require("fs");

const options = {
  key: fs.readFileSync("./key.pem"),
  cert: fs.readFileSync("./cert.pem")
};
https.createServer(options, app).listen(8443);
*/

module.exports = app;