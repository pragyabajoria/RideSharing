module.exports = function(app, passport) {
	
	//var admin=true;
	var auth = require('./auth');
	var dbfunctions = require('./dbfunctions');
		
	app.use('/auth', auth);
	
	//Home page
	app.get('/', function(req, res){
  		res.render('pages/index');
	});

	app.get('/ride', function(req, res){
  		res.render('pages/ride');
	});

	// Dashboard
	app.get('/dashboard', function(req, res) {
		//if user not logged in
		//redirect to homepage
		if (global.memberID == -1) {
			res.redirect('/');
		}
		function handleResult(err, result) {
			if (err) {
			    console.error(err.stack || err.message);
		    	return;
			}
	  		res.render('pages/dashboard', { data : result });
		}
		dbfunctions.getLocations(handleResult);
 	});

	// general locations available
	app.get('/generalLocations', function(req, res){
  		res.render('pages/generalLocations');
	});

	// about page
	app.get('/about', function(req, res){
  		res.render('pages/about');
	});

	// contact form
	app.get('/contact', function(req, res){
  		res.render('pages/contactForm');
	});

	app.get('/searchrides', function (req, res) {

		//if user not logged in
		//redirect to homepage
		if (global.memberID == -1){
			res.redirect("/");
		}


		function handleResult(err, result) {
		    if (err) {
		        console.error(err.stack || err.message);
		        return;
		    }

    		function handleResult(err, result2) {
			    if (err) {
			        console.error(err.stack || err.message);
			        return;
			    }
		  		res.render('pages/destination', {title: req.query['search'], data:result, userriderequests:result2, userid:global.memberID, status:global.memberStatus});
		  	}
	  		
	  		dbfunctions.selectUserRideRequests(handleResult);
		}

		dbfunctions.searchRides(handleResult, req.query['search']);
	
	});

	//edit ride
	app.get('/ride/:id', function(req, res){

		//if user not logged in
		//redirect to homepage
		if(global.memberID == -1) {
			res.redirect("/");
		}

		var id = req.params.id;
		function handleResult(err, ride, locations) {
		    if (err) {
		        console.error(err.stack || err.message);
		        return;
		    }
	  		res.render('pages/rideEdit', { ride : ride, locations : locations });
	  	}
	  	dbfunctions.selectRide(handleResult, id);
	});

	//cancel requests
	app.post('/request/:id', function(req,res) {

		//if user not logged in
		//redirect to homepage
		if (global.memberID == -1) {
			res.redirect('/');
		}

		var id = req.params.id;	
  		function handleResult(err) {
		    if (err) {
		        console.error(err.stack || err.message);
		        return;
		    }
	  		res.redirect('/myrides');
  		}
  		dbfunctions.cancelRequest(handleResult,id);
	});

	//all rides list
	app.get('/rides', function(req, res){

		//if user not logged in
		//redirect to homepage
		if (global.memberID == -1) {
			res.redirect("/");
		}

		function handleResult(err, result) {
		    if (err) {
		        console.error(err.stack || err.message);
		        return;
		    }

		    	function handleResult(err, result2) {
				    if (err) {
				        console.error(err.stack || err.message);
				        return;
				    }
			  		res.render('pages/allrideslist', {title : "All Posted Rides", data : result, userriderequests : result2, userid : global.memberID });
			  	}
	  		//res.render('pages/allrideslist', {title: "All Posted Rides",data:result});
	  		dbfunctions.selectUserRideRequests(handleResult);
	  	}
	  	dbfunctions.selectAllRides(handleResult);
	});

	//admin page
	app.get('/admin', function(req, res){
		//if admin
		if(global.admin == true) {
			res.render('pages/admin', {title: "Admin Dashboard"});
		}
		else{
			res.send("Access Denied");
		}
	});

	app.get('/admin/users', function(req, res){
		if(global.admin == true) {
			function handleResult(err, result) {
			    if (err) {
			        console.error(err.stack || err.message);
			        return;
			    }
		  		res.render('pages/users', {title: "Admin Dashboard", data : result});
		  	}
		  	dbfunctions.getUsers(handleResult);
	  	} else {
			res.send("Access Denied");
		}
	});

	app.get('/admin/locations', function(req, res){
		if(global.admin == true) {
			function handleResult(err, result) {
			    if (err) {
			        console.error(err.stack || err.message);
			        return;
			    }
		  		res.render('pages/locations', {title: "Admin Dashboard", data : result});
		  	}

		  	dbfunctions.getLocations(handleResult);

	  	}
		else{
			res.send("Access Denied");
		}

	});

	app.get('/admin/rides', function(req, res){
		if(global.admin == true){
			function handleResult(err, result) {
			    if (err) {
			        console.error(err.stack || err.message);
			        return;
			    }
		  		res.render('pages/rides', {title: "Admin Dashboard", data : result});
		  	}

		  	dbfunctions.selectAllRides(handleResult);
	  	}
		else{
			res.send("Access Denied");
		}
	});
	
	app.get('/admin/addlocation', function(req, res){

		if(global.admin == true){
	 		res.render('pages/locationAdd');
	 			  	
		} else{
			res.send("Access Denied");
		}
	});

	app.delete('/location/:id', function(req,res) {

		//if user not logged in
		//redirect to homepage
		if(global.memberID==-1){
			res.redirect("/");
		}

		var id = req.params.id;
		function handleResult(err) {
		    if (err) {
		        console.error(err.stack || err.message);
		        return;
		    }
	  		res.redirect('/admin/locations');
	  		//res.sendStatus(200);
  		}
  		dbfunctions.deleteLocation(handleResult, id);
	});

	app.get('/location/:id', function(req,res) {

		//if user not logged in
		//redirect to homepage
		if(global.memberID == -1){
			res.redirect('/');
		}

		var id = req.params.id;
		function handleResult(err, result) {
		    if (err) {
		        console.error(err.stack || err.message);
		        return;
		    }
	  		res.render('pages/locationEdit', { title : "Edit Location", data : result});
  		}
  		dbfunctions.getLocation(handleResult, id);
	});

	app.post('/location/:id', function(req, res){

		//if user not logged in
		//redirect to homepage
		if (global.memberID == -1) {
			res.redirect("/");
		}

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

		function handleResult(err, data) {
		    if (err) {
		        console.error(err.stack || err.message);
		        return;
		    }
	  		res.redirect('/admin/locations');
	  	}
	  	dbfunctions.updateLocation(handleResult, id, data);
	});

	// app.get('/addlocation', function(req, res){
	// 	if(global.admin==true){
	//  		res.render('pages/locationAdd');
	 			  	
	// 	}else{
	// 		res.send("Access Denied");
	// 	}
	// });

	app.post('/admin/addlocation', function(req,res) {

		//if user not logged in
		//redirect to homepage
		if(global.memberID == -1){
			res.redirect("/");
		}
		
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
	    	lastridedate: '0000-00-00 00:00:00'
	  	};
  		
  		function handleResult(err) {
		    if (err) {
		        console.error(err.stack || err.message);
		        return;
		    }
	  		res.redirect('/admin/locations');
  		}
  		dbfunctions.addNewLocation(handleResult, data);
	});

	app.delete('/user/:id', function(req,res) {

		//if user not logged in
		//redirect to homepage
		if(global.memberID == -1){
			res.redirect('/');
		}

		var id = req.params.id;
		function handleResult(err) {
		    if (err) {
		        console.error(err.stack || err.message);
		        return;
		    }
	  		res.render('pages/users');
	  		//res.sendStatus(200);
  		}
  		dbfunctions.deleteUser(handleResult, id);
	});

	
	app.get('/admin/users/deactivate/:id', function(req,res) {

		//if user not logged in
		//redirect to homepage
		if(global.memberID == -1){
			res.redirect("/");
		}

		if(global.admin==true){
			var id = req.params.id;
			function handleResult(err) {
		    if (err) {
		        console.error(err.stack || err.message);
		        return;
		    }
	  		res.redirect('/admin/users');
			}
			dbfunctions.deactivateUser(handleResult, id);
		}
	});

	app.get('/admin/users/activate/:id', function(req,res) {

		//if user not logged in
		//redirect to homepage
		if(global.memberID == -1){
			res.redirect('/');
		}
		
		if(global.admin == true){
			var id = req.params.id;
			function handleResult(err) {
		    if (err) {
		        console.error(err.stack || err.message);
		        return;
		    }
	  		res.redirect('/admin/users');
	  		//res.sendStatus(200);
			}
			dbfunctions.activateUser(handleResult, id);
		}
	});
	//end of admin pages

	//rides
	app.post('/ride/:id', function(req,res) {

		//if user not logged in
		//redirect to homepage
		if(global.memberID == -1) {
			res.redirect("/");
		}

		var id = req.params.id;
		
		req.assert('origin', 'Please Select Origin').notEmpty();
		req.assert('destination', 'Please Select Destination').notEmpty();
		req.assert('datetime', 'Please Enter Date and Time').notEmpty();
		  
		var errors = req.validationErrors();
		  
		if (errors) {
		    res.status(422).json(errors);
		    return;
		}

		//DATE_FORMAT(date,' %r')
		//DATE_FORMAT(date,' %T')

		var data = {
		    driverid : global.memberID,
		    origin : req.body.origin,
		    destination : req.body.destination,
		    seats : req.body.seats,
		    datetime : req.body.datetime,
		    flexibility : req.body.flexibility,
		};
  		
  		function handleResult(err) {
		    if (err) {
		        console.error(err.stack || err.message);
		        return;
		    }

		    res.redirect('/myrides');
  		}

  		dbfunctions.updateRide(handleResult,id, data);
	});

	app.post('/riderequest/:id', function(req,res) {

		//if user not logged in
		//redirect to homepage
		if(global.memberID == -1) {
			res.redirect("/");
		}

		var id = req.params.id;	

  		function handleResult(err) {
		    if (err) {
		        console.error(err.stack || err.message);
		        return;
		    }
	  		res.render('pages/dashboard');
  		}
  		dbfunctions.requestRide(handleResult,id);
	});


	//add a new ride

	app.post('/dashboard', function(req,res) {

		console.log("Dashboard post was called");
		//if user not logged in
		//redirect to homepage
		if(global.memberID == -1){
			res.redirect('/');
		}
		
		//req.assert('driverid', 'Please Enter ID').notEmpty();
		req.assert('origin', 'Please Select Origin').notEmpty();
		req.assert('destination', 'Please Select Destination').notEmpty();
		req.assert('datetime', 'Please Enter Date and Time').notEmpty();
		  
		var errors = req.validationErrors();
		  
		if (errors) {
		    res.status(422).json(errors);
		    return;
		}

		var request = req.body.request;
		console.log("request value: "+ request)

		var rideoffer = false;
		var riderequest = false;
		var dId = null;

		if(request == "offer"){
			rideoffer = true;
			dId = global.memberID;
		}

		//NOTE: also add to riderequests table
		if(request == 'request'){
			riderequest = true;
		}

		//console.log(" ****** "+ req.body.datetime);

		var data = {
		    driverid : dId,
		    origin : req.body.origin,
		    destination : req.body.destination,
		    seats : req.body.seats,
		    datetime : req.body.datetime,
		    flexibility : req.body.flexibility,
		    offered: rideoffer,
		    requested: riderequest,
		};
  		
  		function handleResult(err) {
		    if (err) {
		        console.error(err.stack || err.message);
		        return;
		    }
		    res.redirect('/myrides');
  		}
  		dbfunctions.addNewRide(handleResult, data, request);
	});

	app.post('/riderequest', function(req,res) {

		//if user not logged in
		//redirect to homepage
		if (global.memberID == -1) {
			res.redirect('/');
		}
		
		//req.assert('driverid', 'Please Enter ID').notEmpty();
		req.assert('origin', 'Please Select Origin').notEmpty();
		req.assert('destination', 'Please Select Destination').notEmpty();
		req.assert('datetime', 'Please Enter Date and Time').notEmpty();
		  
		var errors = req.validationErrors();
		  
		if (errors) {
		    res.status(422).json(errors);
		    return;
		}

		var request = req.body.request;
		//console.log("request value: "+ request)

		var rideoffer = false;
		var riderequest = false;
		var dId = null;

		if(request == "offer") {
			rideoffer = true;
			dId = global.memberID;
		}

		//NOTE: also add to riderequests table
		if(request == "request"){
			riderequest=true;
		}

		//console.log(" ****** "+ req.body.datetime);

		var data = {
		    driverid : dId,
		    origin : req.body.origin,
		    destination : req.body.destination,
		    seats : req.body.seats,
		    datetime : req.body.datetime,
		    flexibility : req.body.flexibility,
		    offered: rideoffer,
		    requested: riderequest,
		};
  		
  		function handleResult(err, id) {
		    if (err) {
		        console.error(err.stack || err.message);
		        return;
		    }
		    res.redirect('/myrides');
  		}
  		dbfunctions.addNewRide(handleResult, data);
	});

	app.delete('/ride/:id', function(req,res) {

		//if user not logged in
		//redirect to homepage
		if (global.memberID == -1) {
			res.redirect("/");
		}

		var id = req.params.id;
		function handleResult(err) {
		    if (err) {
		        console.error(err.stack || err.message);
		        return;
		    }
	  		res.render('pages/dashboard');
  		}
  		dbfunctions.deleteRide(handleResult, id);
	});


	//user related
	app.get('/contactform', function(req,res) {
  		res.render('pages/contactForm');
	});

	app.get('/profile', function (req, res) {
  		res.render('pages/profile', {name : global.userName, email : global.userEmail, picture : global.userPicture });
	});

	// dashboard locations
	app.get('/boston', function(req,res) {

		//if user not logged in
		//redirect to homepage
		if(global.memberID == -1) {
			res.redirect('/');
		}

		function handleResult(err, result) {
		    if (err) {
		        console.error(err.stack || err.message);
		        return;
		    }

		    function handleResult(err, result2) {
				    if (err) {
				        console.error(err.stack || err.message);
				        return;
				    }
			  		res.render('pages/destination', {title: 'Boston', data : result, userriderequests : result2, userid : global.memberID});
			  	}
	  		
	  		dbfunctions.selectUserRideRequests(handleResult);
    		//res.render('pages/destination', {title: 'Boston', data:result});
		}
		var destination = "Boston";		
		dbfunctions.selectRides(handleResult, destination);
	});

	app.get('/holyokeMall', function(req,res) {

		//if user not logged in
		//redirect to homepage
		if(global.memberID == -1) {
			res.redirect('/');
		}

		function handleResult(err, result) {
		    if (err) {
		        console.error(err.stack || err.message);
		        return;
		    }

			function handleResult(err, result2) {
			    if (err) {
			        console.error(err.stack || err.message);
			        return;
			    }
		  		res.render('pages/destination', {title: 'Holyoke Mall', data:result, userriderequests : result2, userid : global.memberID});
		  	}
	  		
	  		dbfunctions.selectUserRideRequests(handleResult);
		}
		var destination = "Holyoke Mall";
		dbfunctions.selectRides(handleResult, destination);

  		//.render('pages/destination', {title: 'Holyoke Mall'});
	});

	app.get('/nyc', function(req,res) {

		//if user not logged in
		//redirect to homepage
		if(global.memberID==-1){
			res.redirect("/");
		}

		function handleResult(err, result) {
		    if (err) {
		        console.error(err.stack || err.message);
		        return;
		    }

    		function handleResult(err, result2) {
			    if (err) {
			        console.error(err.stack || err.message);
			        return;
			    }
		  		res.render('pages/destination', {title: 'New York City', data:result, userriderequests:result2, userid:global.memberID});
		  	}
	  		
	  		dbfunctions.selectUserRideRequests(handleResult);
		}
		var destination = "New York City";
		dbfunctions.selectRides(handleResult, destination);
  		//res.render('pages/destination', {title: 'New York City'});
	});

	app.get('/springfield', function(req,res) {

		//if user not logged in
		//redirect to homepage
		if (global.memberID == -1) {
			res.redirect("/");
		}

		function handleResult(err, result) {
		    if (err) {
		        console.error(err.stack || err.message);
		        return;
		    }

    		function handleResult(err, result2) {
			    if (err) {
			        console.error(err.stack || err.message);
			        return;
			    }
		  		res.render('pages/destination', {title: 'Springfield Bus Terminal', data:result, userriderequests:result2, userid:global.memberID});
		  	}
	  		
	  		dbfunctions.selectUserRideRequests(handleResult);
		}
		var destination = "Springfield Bus Terminal";
		dbfunctions.selectRides(handleResult, destination);
  		//res.render('pages/destination', {title: 'Springfield'});
	});

	app.get('/bradley', function(req,res) {
		
		//if user not logged in
		//redirect to homepage
		if(global.memberID==-1){
			res.redirect("/");
		}
		function handleResult(err, result) {
		    if (err) {
		        console.error(err.stack || err.message);
		        return;
		    }

    		function handleResult(err, result2) {
			    if (err) {
			        console.error(err.stack || err.message);
			        return;
			    }
		  		res.render('pages/destination', {title: 'Bradley Airport', data:result, userriderequests:result2, userid:global.memberID});
		  	}
	  		
	  		dbfunctions.selectUserRideRequests(handleResult);
		}
		var destination = "Bradley Airport";
		dbfunctions.selectRides(handleResult, destination);
	});

	// my rides page for each user
	app.get('/myrides', function(req,res) {
		//if user not logged in
		//redirect to homepage
		if(global.memberID==-1){
			res.redirect("/");
		}

		function handleResult(err, result) {
		    if (err) {
		        console.error(err.stack || err.message);
		        return;
		    }

		    var offered=result;
		    function handleResult(err, result2) {
			    if (err) {
			        console.error(err.stack || err.message);
			        return;
			    }
			   
			 	var requested=result2;		    
			    function handleResult(err, result3) {

				    if (err) {
				        console.error(err.stack || err.message);
				        return;
				    }
					   var requests=result3;

					   function handleResult(err, result4) {

						    if (err) {
						        console.error(err.stack || err.message);
						        return;
						    }
							   var notofferedyet=result4;

							   			   
						 	   res.render('pages/myRides', {title: 'My Rides', offered:offered, requested:requested, requests:requests, notofferedyet:notofferedyet});
							}
				    dbfunctions.selectAllRequestedButNotOfferedRides(handleResult);

				 	   //res.render('pages/myRides', {title: 'My Rides', offered:offered, requested:requested, requests:requests});
					}
				    dbfunctions.selectRequestsForMyOfferedRides(handleResult);
				}
		    dbfunctions.selectMyRequestededRides(handleResult);    		
		}		
		dbfunctions.selectMyOfferedRides(handleResult); 		
	});

	app.post('/offer/:id', function(req,res) {

		//if user not logged in
		//redirect to homepage
		if(global.memberID==-1){
			res.redirect("/");
		}

		var id = req.params.id;
		function handleResult(err) {
		    if (err) {
		        console.error(err.stack || err.message);
		        return;
		    }
	  		res.redirect("/myrides");
  		}
  		dbfunctions.offerRide(handleResult, id);
	});
	
	//Logout
	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	});

	///////////////////////////////////////////////////////////////////////////

	// error handlers

	// development error handler
	// will print stacktrace
	if (app.get('env') === 'development') {
		app.use(function(err, req, res, next) {
			res.render('error', {
				message: err.message,
				error: err
			});
		});
	}

	// production error handler
	// no stacktraces leaked to user
	app.use(function(err, req, res, next) {
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
	res.redirect('/dashboard');
};
