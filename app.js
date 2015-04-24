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
  , connection  = require('express-myconnection') //mysql connection
  , mysql = require('mysql')
  , moment = require('moment');

var app = express();

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

app.use(express.static(__dirname + '/public'));
app.set('views','./views');
app.set('view engine','ejs');

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
require('./config/passport')(passport);
require('./routes/routes')(app, passport);

//database tutorial and examples
//http://teknosains.com/i/simple-crud-nodejs-mysql
app.use(
    connection(mysql,{
        host     : 'localhost',
        user     : 'root',
        password : '',
        port   : 3306,
        database : 'mhcrideshare',
        debug    : false
    },'request')
);

var router = express.Router();

router.use (function (req, res, next) {
  console.log(req.method, req.url);
  next();
});

//end mysql
/*
// GET /auth/google
app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile',
                                            'https://www.googleapis.com/auth/userinfo.email'] }),
  function (req, res) {
    // The request will be redirected to Google for authentication, so this
    // function will not be called.
  }
);

// GET /auth/google/callback
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),

  function (req, res, next) {
      
    req.getConnection(function (err, conn) {
      
      if (err) {
        return next("connection error");
      }
        
      var query1 = conn.query("SELECT * FROM members WHERE gmailid = ? ",userId, function (err, rows) {            

        if (err) {
          console.log(err1);
          return next("mysql error");
        }
        
        if (rows.length < 1) {

          var name = userName.toString().split(" ");
          //console.log("first name: "+name[0]);
          //console.log("last name: "+name[1]);
          //console.log("member not already saved in database");
          var data = {
           firstname : name[0],
           lastname : name[1],
           email : userEmail,
           gmailid : userId,
          };
          
          var query2 = conn.query("INSERT INTO members set ? ", data, function (err2, rows2) {
          
            if (err2) {
              console.log(err2);
              return next("mysql error");
            } // if closes
          }); // query2 closes
        } // if closes
        res.render('pages/dashboard');
      }); // req.getConnection closes
    }); // function closes
  });*/

//SELECT  *
//FROM    ride, location
//WHERE   ride.`name` COLLATE UTF8_GENERAL_CI LIKE '%query%'

app.get('/searchrides', function (req, res) {

  req.getConnection(function (err,conn) {
    
    if (err) return next("connection error");
    var query = conn.query('SELECT r.id, m.firstname, m.lastname, l1.name AS origin, l2.name AS destination,' + 
      ' r.seats, r.datetime, r.flexibility FROM rides AS r, members AS m, locations as l1, ' +
      'locations as l2 WHERE m.id=r.driverid AND l1.id=r.origin AND l2.id=r.destination AND' + 
      ' r.datetime>= CURDATE() AND l2.city COLLATE UTF8_GENERAL_CI LIKE ?', "%"+req.query['search']+"%", function (err, rows) {
   
        if (err) {
          console.log(err);
          return next("mysql error");
        }
        res.render('searchrides',{title:"Rides Search",data:rows});
      });
    }); 
  //res.send("Searching for " + req.query['search']);
});

setInterval (function() {
  //console.log('test');
  var now = moment();
  var formatted = now.format('YYYY-MM-DD hh:mm:ss a');
  console.log(formatted);
  //console.log(Date.now())
  
  deleteoldrides();

  function deleteoldrides() {

  }  
  //write code to remove old rides
  
},24*60*60*1000);  

var members = router.route('/members');

members.get (function (req, res) {
  
  req.getConnection(function (err,conn) {
    if (err) return next("connection error");
    
    var query = conn.query('SELECT * FROM members',function (err, rows) {
    
      if (err) {
        console.log(err);
        return next("mysql error");
      }
      
      console.log(userId);
      console.log(userName);
      console.log(userEmail);
      
      res.render('members',{title:"Members Table Example",data:rows});
    });
  });
});

//save new member
members.post(function (req, res) {

  req.assert('firstname','Please Enter First Name').notEmpty();
  req.assert('lastname','Please Enter Last Name').notEmpty();
  req.assert('email','Please Enter a Valid Email').isEmail();
  req.assert('phone','Please Enter Phone').notEmpty();
  req.assert('status','Please Enter Status').notEmpty();
  
  var errors = req.validationErrors();
  
  if (errors) { 
    res.status(422).json(errors);
    return;
  }

  var data = {
    firstname : req.body.firstname,
    lastname : req.body.lastname,
    email : req.body.email,
    phone : req.body.phone,
    status : req.body.status,
  };
    
  req.getConnection(function (err, conn) {
    
    if (err) return next("connection error");
        
    var query = conn.query("INSERT INTO members set ? ", data, function (err, rows) {
           
      if (err) {
        console.log(err);
        return next("mysql error");
      }
    
      res.sendStatus(200);
    });
  });
});

var member = router.route('/members/:id');

member.all (function (req, res, next) {
  console.log(req.params);
  next();
});

member.get(function (req, res, next) {
  
  var id = req.params.id;
  req.getConnection(function (err, conn) {
    
    if (err) {
      return next("connection error");
    }  

    var query = conn.query("SELECT * FROM members WHERE id = ? ", [id], function (err,rows) {
      
      if (err) {
        console.log(err);
        return next("mysql error");
      }

      if(rows.length < 1) {
        return res.send("Member Not found");
      }
      res.render('membersform', {title : "Edit Member", data : rows });

    });
  });
});

member.put(function (req, res) {
  
  var id = req.params.id;

  req.assert('firstname', 'Please Enter First Name').notEmpty();
  req.assert('lastname', 'Please Enter Last Name').notEmpty();
  req.assert('email', 'Please Enter a Valid Email').isEmail();

  var errors = req.validationErrors();
  
  if (errors) {
    res.status(422).json(errors);
    return;
  }

  var data = {
    firstname : req.body.firstname,
    lastname : req.body.lastname,
    email : req.body.email,
    phone : req.body.phone,
    status : req.body.status
  };

  req.getConnection(function (err, conn) {
    if (err) {
      return next("connection error");
    }
    
    var query = conn.query("UPDATE members set ? WHERE id = ? ", [data,id], function (err, rows) {
  
      if(err) {
        console.log(err);
        return next("mysql error");
      }
      res.sendStatus(200);
    });
  });
});

member.delete (function (req,res) {
  var id = req.params.id;
  
  req.getConnection (function (err, conn) {
    if (err) {
      return next("connection error");
    }
    
    var query = conn.query("DELETE FROM members  WHERE id = ? ",[id], function(err, rows) {
      
      if(err) {
        console.log(err);
        return next("mysql error");
      }
      res.sendStatus(200);

    });
  });
});


//DATABASE - LOCATIONS 
var locations = router.route('/locations');

locations.get (function (req, res) {

  req.getConnection(function (err, conn) {

    if (err) {
      return next("connection error");
    }
    var query = conn.query('SELECT * FROM locations', function (err, rows) {
      
      if (err) {
        console.log (err);
        return next ("mysql error");
      }
      res.render('locations', { title : "Location Table Example", data : rows });

    });
  });
});

//save new location
locations.post(function(req, res) {

  req.assert('name','Please Enter Location Name').notEmpty();
  req.assert('city','Please Enter City').notEmpty();
  req.assert('state','Please State').notEmpty();
  req.assert('zipcode','Please Zip Code').notEmpty();
  
  var errors = req.validationErrors();
  
  if (errors) {
    res.status(422).json(errors);
    return;
  }

  var data = {
    name : req.body.name,
    city : req.body.city,
    state : req.body.state,
    zipcode : req.body.zipcode,
  };

  req.getConnection(function (err, conn) {
    if (err) {
      return next("connection error");
    }
    
    var query = conn.query("INSERT INTO locations set ? ",data, function (err, rows) {
      
      if(err) {
        console.log(err);
        return next("mysql error");
      }
      res.sendStatus(200);
    });
  });
});

var location = router.route('/locations/:id');

location.all (function (req, res, next) {
  console.log(req.params);
  next();
});

location.get (function (req, res, next) {
  
  var id = req.params.id;

  req.getConnection(function (err, conn) {
    
    if (err) {
      return next("connection error");
    } 
    var query = conn.query("SELECT * FROM locations WHERE id = ? ",[id],function (err,rows) {
      
      if (err) {
        console.log(err);
        return next("mysql error");
      }
      if (rows.length < 1) {
        return res.send("Location Not found");
      }
      res.render('editlocation', { title : "Edit Location", data : rows });
    });
  });
});

location.put(function (req, res) {

  var id = req.params.id;

  req.assert('name', 'Please Enter Location Name').notEmpty();
  req.assert('city', 'Please Enter City').notEmpty();
  req.assert('state', 'Please Enter State').notEmpty();
   
  var errors = req.validationErrors();
  
  if (errors) {
    res.status(422).json(errors);
    return;
  }

  var data = {
    name : req.body.name,
    city : req.body.city,
    state : req.body.state,
    zipcode : req.body.zipcode
  };

  req.getConnection(function (err, conn) {
    
    if (err) {
      return next("connection error");
    }
    
    var query = conn.query("UPDATE locations set ? WHERE id = ? ", [data, id], function (err, rows) {

      if (err) {
        console.log(err);
        return next("mysql error");
      }
      res.sendStatus(200);
    });
  });
});

location.delete (function (req, res) {
  
  var id = req.params.id;
  req.getConnection (function (err, conn) {
    
    if (err) {
      return next("connection error");
    }
        
    var query = conn.query("DELETE FROM locations  WHERE id = ? ", [id], function (err, rows) {
      if (err) {
        console.log(err);
        return next("mysql error");
      }
      res.sendStatus(200);
    });
  });
});

//END of DATABASE - LOCATIONS

// DATABASE - RIDES
var rides = router.route('/rides');

//SEARCH Rides
//

//SELECT  *
//FROM    ride, location
//WHERE   ride.`name` COLLATE UTF8_GENERAL_CI LIKE '%query%'



//DISPLAY ALL RIDES
rides.get (function (req,res) {

  req.getConnection(function (err, conn) {
    
    if (err) {
      return next("connection error");
    }
    var query = conn.query("DELETE FROM rides  WHERE  datetime < CURDATE()", function (err, rows) {

      if(err) {
        console.log(err);
        return next("mysql error");
      }
    });
  });
   
  //To add: check for requests by current user
  req.getConnection(function (err,conn) {
    
    if (err) {
      return next("connection error");
    }

    var query = conn.query('SELECT r.id, m.firstname, m.lastname, l1.name AS origin,' +
                           'l2.name AS destination, r.seats, r.datetime, r.flexibility' +
                           'FROM rides AS r, members AS m, locations as l1,' + 
                           'locations as l2 WHERE m.id=r.driverid AND l1.id=r.origin AND' +
                            'l2.id=r.destination AND r.datetime>= CURDATE()', function (err, rows) {

      if (err) {
        console.log(err);
        return next("mysql error");
      }
      res.render('rides',{title:"Rides Table Example",data:rows});
    });
  });
});


//ADD NEW RIDE

var newride = router.route('/newride');

newride.get (function (req, res) {
  
  req.getConnection(function (err, conn) {

    if (err) {
      return next("connection error");
    }
  
    var query = conn.query('SELECT * FROM locations',function (err, rows) {
      
      if (err) {
        console.log(err);
        return next("mysql error");
      }
      res.render('newride', { title : "Add Ride", data : rows });

    });
  });
});

/* var datepicker = router.route('/datepicker');
datepicker.get(function(req, res){
  res.render('datepicker', { user: req.user });
}); */

newride.post (function (req, res) {

  req.assert('driverid', 'Please Enter ID').notEmpty();
  req.assert('origin', 'Please Select Origin').notEmpty();
  req.assert('destination', 'Please Select Destination').notEmpty();
  req.assert('datetime', 'Please Enter Date and Time').notEmpty();
  
  var errors = req.validationErrors();
  
  if (errors) {
    res.status(422).json(errors);
    return;
  }

  var data = {
    driverid : req.body.driverid,
    origin : req.body.origin,
    destination : req.body.destination,
    seats : req.body.seats,
    datetime : req.body.datetime,
    flexibility : req.body.flexibility,
  };
  
  req.getConnection(function (err, conn) {

    if (err) {
      return next("connection error");
    }
    
    var query = conn.query("INSERT INTO rides set ? ", data, function (err, rows) {
      
      if(err) {
        console.log(err);
        return next("mysql error");
      }
      res.sendStatus(200);

    });
  });
});

//EDIT A RIDE
var ride = router.route('/rides/:id');

ride.all (function (req, res, next) {
  console.log(req.params);
  next();
});

ride.get (function (req, res, next) {
  
  var id = req.params.id;
  req.getConnection (function (err, conn) {

    if (err) {
      return next("connection error");
    }
   
    var query1 = conn.query("SELECT * FROM rides WHERE id = ? ", [id], function (err, ride) {            
    
      if (err) {
        console.log(err);
        return next("mysql error");
      }
    
      if(ride.length < 1) {
        return res.send("ride Not found");
      }
    
      var query2 = conn.query('SELECT * FROM locations', function (err, locations) {
      
        if (err) {
         console.log(err);
         return next("mysql error");
         }
      
        res.render('editride',{title:"Edit ride", ride:ride, locations:locations});
      });
    });
   });  
});

ride.put(function (req,res) {
  
  var id = req.params.id;

  //req.assert('driverid','Please Enter ID').notEmpty();
  req.assert('origin', 'Please Select Origin').notEmpty();
  req.assert('destination', 'Please Select Destination').notEmpty();
  req.assert('datetime', 'Please Enter Date and Time').notEmpty();
  req.assert('flexibility', 'Please Enter Flexibility').notEmpty();
	req.assert('datetime', 'Please Enter Date and Time').notEmpty();
	req.assert('flexibility', 'Please Enter Flexibility').notEmpty();
  
  var errors = req.validationErrors();
  
  if (errors) {
    res.status(422).json(errors);
    return;
  }

  var data = {
        //driverid:req.body.driverid,
    origin : req.body.origin,
    destination : req.body.destination,
    seats : req.body.seats,
    datetime : req.body.datetime,
    flexibility : req.body.flexibility,
  };

  req.getConnection(function (err, conn) {

    if (err) return next("connection error");
 
    var query = conn.query("UPDATE rides set ? WHERE id = ? ", [data,id], function (err, rows) {
      
      if (err) {
        console.log(err);
        return next("mysql error");
      }
      res.sendStatus(200);

    });
  });
});

//DELETE A RIDE
ride.delete(function (req,res) {
  
  var id = req.params.id;
  
  req.getConnection(function (err, conn) {
    
    if (err) return next("connection error");
    
    var query = conn.query("DELETE FROM rides  WHERE id = ? ", [id], function (err, rows) {

      if (err) {
        console.log(err);
        return next("mysql error");
      }
      res.sendStatus(200);

    });
  });
});

//REQUEST A RIDE
ride.post(function (req, res, next) {

  req.getConnection(function (err, conn) {
    
    if (err) return next("connection error");
    
    //console.log("*** ");
    var query1 = conn.query("SELECT * FROM members WHERE gmailid = ? ", userId, function (err1, rows) {            
      
      if (err1) {
        console.log(err1);
        return next("mysql error");
      }
      
      //console.log("*** " + rows[0].id);
            
      if(rows.length = 1) { 
  
       var rideid = req.params.id;
       var memberid = rows[0].id;
       var data = {
          rideid : rideid,
          memberid : memberid,
       };
          
       var query2 = conn.query("INSERT INTO riderequests set ? ", data, function (err2, rows2) {
        
        if (err2) {
          console.log(err2);
          return next("mysql error");
        }
          //res.sendStatus(200);
       });
         
      }
      res.sendStatus(200);
    });
  });
});

//END OF RIDES
app.use('/', router);

// Export the app as the module:
module.exports = app;
