var express = require('express');
var router = express.Router();
var passport = require('passport');

// GET /auth/google
router.get('/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile',
											'https://www.googleapis.com/auth/userinfo.email'] }),
	function (req, res){
	  // The request will be redirected to Google for authentication, so this
	  // function will not be called.
	}
);

// GET /auth/google/callback
router.get('/google/callback', 
	passport.authenticate('google', {
		failureRedirect: '/',
		successRedirect: '/dashboard'})
);

// GET /auth/facebook
router.get('/facebook',
  passport.authenticate('facebook', { scope: ['email'] }),
  function(req, res){
	// The request will be redirected to Facebook for authentication, so this
	// function will not be called.
  }
);

// GET /auth/facebook/callback
router.get('/facebook/callback', 
  passport.authenticate('facebook', {
		failureRedirect: '/',
		successRedirect: '/dashboard'})
);

module.exports = router;
