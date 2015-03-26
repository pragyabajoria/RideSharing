var express = require('express')
  , path = require('path')
  , expressValidator = require('express-validator')
  , passport = require('passport')
  , util = require('util')
  , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
  , FacebookStrategy = require('passport-facebook').Strategy
  , http = require('http')
  , morgan = require('morgan')
  , cookieParser = require('cookie-Parser')
  , bodyParser = require('body-parser')
  , multer = require('multer')
  , session = require('express-session')
  , methodOverride = require('method-override');

  
// Google API Access link for creating client ID and secret:
// https://code.google.com/apis/console/
var GOOGLE_CLIENT_ID = "398983337498-4aeok6070njf36gp6rkhfqhoijfisr6t.apps.googleusercontent.com";
var GOOGLE_CLIENT_SECRET = "oeuagjMWcUCBvnap-fG_Ni9A";

// 
var FACEBOOK_APP_ID = "428397073986914"
var FACEBOOK_APP_SECRET = "f97c85a02714df3e124d56aa9fb56950";

// Passport session setup. To support persistent login sessions, Passport needs to serialize 
// users into and deserialize users out of the session.  Typically, this will be as simple
// as storing the user ID when serializing, and finding the user by ID when deserializing.
// However, since this example does not have a database of user records, the complete Google
// profile/Facebook profile is serialized and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


// Use GoogleStrategy within Passport.
// Strategies in Passport require a `verify` function, which accept
// credentials (in this case, an accessToken, refreshToken, and Google
//  profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:4000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // To keep the example simple, the user's Google profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Google account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:4000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // To keep the example simple, the user's Facebook profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Facebook account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));

var app = express();

// configure Express
//app.set('views', __dirname + '/views');
//app.set('view engine', 'ejs');

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

// Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));
//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressValidator());
app.set('views','./views');
  app.set('view engine','ejs');

app.get('/', function(req, res){
  res.redirect('/index.html');
});

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

app.get('/login', function(req, res){
  res.render('login', { user: req.user });
});

app.get('/members', function(req, res){
  res.render('members', { user: req.user });
});

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile',
                                            'https://www.googleapis.com/auth/userinfo.email'] }),
  function(req, res){
    // The request will be redirected to Google for authentication, so this
    // function will not be called.
  });

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/dashboard.html');
  }
);

// GET /auth/facebook
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Facebook authentication will involve
//   redirecting the user to facebook.com.  After authorization, Facebook will
//   redirect the user back to this application at /auth/facebook/callback
app.get('/auth/facebook',
  passport.authenticate('facebook'),
  function(req, res){
    // The request will be redirected to Facebook for authentication, so this
    // function will not be called.
  }
);


// GET /auth/facebook/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/dashboard.html');
  }
);

app.get('/boston', function(req,res) {
  var calendar = '<iframe src="https://www.google.com/calendar/embed?src=bajor22p%40mtholyoke.edu&ctz=America/New_York" style="border: 0" width="800" height="600" frameborder="0" scrolling="no"></iframe>';
  res.send(calendar);
});


app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/profile', function (req, res) {
  // Create the form to add a new user
  var form = '<p><b>Add Profile Information</b></p><br>' +      
    '<form action="/users/add" method="get">' +
    'UID:<br> <input type="text" name="uid"><br><br>' + 
    'First Name:<br> <input type="text" name="fname"><br><br>' +
    'Last Name:<br> <input type="text" name="lname"><br><br>' +
    'University:<br> <input type="text" name="university"><br><br>' +
    'Age:<br> <input type="text" name="age"><br><br>' +
    '<input type="submit" value="Submit Profile Changes">' +
    '</form><br><br>';
  res.send(form);
});

app.get('/searchrides', function (req, res) {
  res.send("Searching for " + req.query['search']);
});

//mysql connection
var connection  = require('express-myconnection'),
    mysql = require('mysql');

app.use(
    connection(mysql,{
        host     : 'localhost',
        user     : 'root',
        password : '',
		port	 : 3306,
        database : 'mhcrideshare',
        debug    : false
    },'request')
);

var router = express.Router();

router.use(function(req, res, next) {
    console.log(req.method, req.url);
    next();
});

var cu1 = router.route('/members');

cu1.get(function(req,res){
    req.getConnection(function(err,conn){
        if (err) return next("connection error");
        var query = conn.query('SELECT * FROM members',function(err,rows){
            if(err){
                console.log(err);
                return next("mysql error");
            }
            res.render('members',{title:"Members Table Example",data:rows});
         });
    });
});

//save new member
cu1.post(function(req,res){

    req.assert('firstname','Please Enter First Name').notEmpty();
	req.assert('lastname','Please Enter Last Name').notEmpty();
    req.assert('email','Please Enter a Valid Email').isEmail();
	req.assert('phone','Please Enter Phone').notEmpty();
	req.assert('status','Please Enter Status').notEmpty();
    var errors = req.validationErrors();
    if(errors){
        res.status(422).json(errors);
        return;
    }

    var data = {
        firstname:req.body.firstname,
		lastname:req.body.lastname,
        email:req.body.email,
		phone:req.body.phone,
		status:req.body.status,
     };
    req.getConnection(function (err, conn){
        if (err) return next("connection error");
        var query = conn.query("INSERT INTO members set ? ",data, function(err, rows){
           if(err){
                console.log(err);
                return next("mysql error");
           }
          res.sendStatus(200);
        });
     });
});

var cu2 = router.route('/members/:id');
cu2.all(function(req,res,next){
    console.log(req.params);
    next();
});

cu2.get(function(req,res,next){
    var id = req.params.id;
    req.getConnection(function(err,conn){
        if (err) return next("connection error");
        var query = conn.query("SELECT * FROM members WHERE id = ? ",[id],function(err,rows){            if(err){
                console.log(err);
                return next("mysql error");
            }
            if(rows.length < 1)
                return res.send("Member Not found");
            res.render('membersform',{title:"Edit Member",data:rows});
        });

    });

});

cu2.put(function(req,res){
    var id = req.params.id;

	req.assert('firstname','Please Enter First Name').notEmpty();
	req.assert('lastname','Please Enter Last Name').notEmpty();
    req.assert('email','Please Enter a Valid Email').isEmail();

    var errors = req.validationErrors();
    if(errors){
        res.status(422).json(errors);
        return;
    }

    var data = {
        firstname:req.body.firstname,
		lastname:req.body.lastname,
        email:req.body.email,
        phone:req.body.phone,
		status:req.body.status
     };

    req.getConnection(function (err, conn){
        if (err) return next("connection error");
        var query = conn.query("UPDATE members set ? WHERE id = ? ",[data,id], function(err, rows){
           if(err){
                console.log(err);
                return next("mysql error");
           }
          res.sendStatus(200);
        });
     });

});

cu2.delete(function(req,res){
    var id = req.params.id;
     req.getConnection(function (err, conn) {
        if (err) return next("connection error");
        var query = conn.query("DELETE FROM members  WHERE id = ? ",[id], function(err, rows){
             if(err){
                console.log(err);
                return next("mysql error");
             }
             res.sendStatus(200);
        });
     });
});

app.use('/database', router);

//end of mysql

app.use(express.static(__dirname + '/public'));

http.createServer(app).listen(4000);

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}
