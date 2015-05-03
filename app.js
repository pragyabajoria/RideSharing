var express = require('express')
  , path = require('path')
  , expressValidator = require('express-validator')
  , passport = require('passport')
  , util = require('util')
  , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
  , LocalStrategy = require('passport-local').Strategy
  , FacebookStrategy = require('passport-facebook').Strategy
  , http = require('http')
  , morgan = require('morgan')
  , cookieParser = require('cookie-Parser')
  , bodyParser = require('body-parser')
  , multer = require('multer')
  , session = require('express-session')
  , methodOverride = require('method-override')
  , moment = require('moment');

var app = express();

app.use(express.static(__dirname + '/public'));
app.set('views','./views');
app.set('view engine','ejs');

// configure Express
app.use(morgan('combined'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(multer());
app.use(methodOverride());
app.use(expressValidator());
app.use(session({ secret: 'keyboard cat',
                  resave: false,
                  saveUninitialized: true,
                  cookie: { secure: true }}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

var router = express.Router();
router.use (function (req, res, next) {
  console.log(req.method, req.url);
  next();
});
app.use('/', router);

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
require('./config/passport')(passport);
require('./routes/routes')(app, passport);

// Export the app as the module:
module.exports = app;
