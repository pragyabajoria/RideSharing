var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('pages/dashboard.ejs');
});

module.exports = router;

/*
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
	res.redirect('/');
};*/