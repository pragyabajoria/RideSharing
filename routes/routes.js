module.exports = function(app, passport) {
	//var index = require('./index');
	//var user = require('./user');
	var auth = require('./auth');
	var dashboard = require('./dashboard');
	var dbfunctions = require('./dbfunctions');
		
	//app.use('/', index);
	//app.use('/user', user);
	//app.use('/event', event);
	app.use('/auth', auth);
	app.use('/dashboard', dashboard);
	//app.use('/', db);
	
	//Home page
	app.get('/', function(req, res){
  		res.render('pages/index');
	});

	app.get('/login', function(req, res){
  		res.render('login', { user: req.user });
	});

	app.get('/riderequest', function(req, res){
  		res.render('pages/rideRequest');
	});

	app.get('/contactform', function(req,res) {
  		res.render('pages/contactForm');
	});

	app.get('/account', ensureAuthenticated, function(req, res){
  		res.render('account', { user: req.user });
	});

	app.get('/profile', function (req, res) {
  		res.render('pages/profile');
	});

	app.get('/boston', function(req,res) {

		function handleResult(err, result) {
		    if (err) {
		        console.error(err.stack || err.message);
		        return;
		    }

    		res.render('pages/destination', {title: 'Boston', data:result});
		}
		var destination = "Boston";
		dbfunctions.selectAllRides(handleResult, destination);

  		//res.render('pages/destination', {title: 'Boston'});
	});

	app.get('/holyokeMall', function(req,res) {

		function handleResult(err, result) {
		    if (err) {
		        console.error(err.stack || err.message);
		        return;
		    }

    		res.render('pages/destination', {title: 'Holyoke Mall', data:result});
		}
		var destination = "Holyoke Mall";
		dbfunctions.selectAllRides(handleResult, destination);

  		//.render('pages/destination', {title: 'Holyoke Mall'});
	});

	app.get('/nyc', function(req,res) {

		function handleResult(err, result) {
		    if (err) {
		        console.error(err.stack || err.message);
		        return;
		    }

    		res.render('pages/destination', {title: 'New York City', data:result});
		}
		var destination = "New York City";
		dbfunctions.selectAllRides(handleResult, destination);
  		//res.render('pages/destination', {title: 'New York City'});
	});

	app.get('/springfield', function(req,res) {
		function handleResult(err, result) {
		    if (err) {
		        console.error(err.stack || err.message);
		        return;
		    }

    		res.render('pages/destination', {title: 'Springfield Bus Terminal', data:result});
		}
		var destination = "Springfield Bus Terminal";
		dbfunctions.selectAllRides(handleResult, destination);
  		//res.render('pages/destination', {title: 'Springfield'});
	});

	app.get('/bradley', function(req,res) {
		//var rows = dbfunctions.selectAllRides();
		//console.log('The results are: ', rows);

		function handleResult(err, result) {
		    if (err) {
		        console.error(err.stack || err.message);
		        return;
		    }

    		res.render('pages/destination', {title: 'Bradley Airport', data:result});
		}
		var destination = "Bradley Airport";
		dbfunctions.selectAllRides(handleResult, destination);
  		//res.render('pages/destination', {title: 'Bradley Airport', data:rows});
	});

	
	/*//Registration page
	app.get('/register', function(req, res){
		res.render('register.ejs', { title: 'ULynk',
									message: req.flash('message')
									});
	});
	
	app.post('/register', passport.authenticate('local-signup', {
        successRedirect : '/dashboard',
        failureRedirect : '/register',
        failureFlash : true // allow flash messages
    }));*/
	
	//Logout
	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	});

	///////////////////////////////////////////////////////////////////////////

	// catch 404 and forward to error handler
	app.use(function(req, res, next) {
		var err = new Error('Not Found');
		err.status = 404;
		next(err);
	});

	// error handlers

	// development error handler
	// will print stacktrace
	if (app.get('env') === 'development') {
		app.use(function(err, req, res, next) {
			res.status(err.status || 500);
			res.render('error', {
				message: err.message,
				error: err
			});
		});
	}

	// production error handler
	// no stacktraces leaked to user
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: {}
		});
	});
};

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	// else redirect to homepage
	res.redirect('/login');
};

