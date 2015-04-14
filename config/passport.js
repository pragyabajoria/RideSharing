// Passport strategies
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

//var User = require('../lib/user');

var configAuth = require('./auth');

module.exports = function(passport) {

    // Passport session setup. To support persistent login sessions, Passport needs to serialize 
  // users into and deserialize users out of the session.  Typically, this will be as simple
  // as storing the user ID when serializing, and finding the user by ID when deserializing.
    passport.serializeUser(function(email, done) {
        done(null, email);
    });

    passport.deserializeUser(function(email, done) {
        User.findByEmail(email, function(err, user) {
            done(err, user);
        });
    });
    
    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    passport.use( new GoogleStrategy({
        clientID: configAuth.googleAuth.clientID,
        clientSecret: configAuth.googleAuth.clientSecret,
        callbackURL: configAuth.googleAuth.callbackURL,
    },
    function(accessToken, refreshToken, profile, done) {
        // asynchronous verification, for effect...
        process.nextTick(function() {
            // try to find the user based on their Google email
            /*User.login(profile.emails[0].value, profile.id, function(err, user) {
                if (err)
                    return done(err);
                if (user) {
                    // if a user is found, login
                    return done(undefined, user);
                } else {
          //newUser.google.id    = profile.id;
                    //newUser.google.token = accessToken;
                    //newUser.google.name  = profile.displayName;
                    //newUser.google.email = profile.emails[0].value;
                    var email = profile.emails[0].value;
          var password = profile.id;
                    /*User.register(email, password, function(err, result) {
                        if (err)
                            console.log(err);
                        return done(undefined, result);
                    });
                }
            }); */
        });
    }));
  
  // =========================================================================
    // Facebook ================================================================
    // =========================================================================
  passport.use(new FacebookStrategy({
        clientID: configAuth.facebookAuth.clientID,
        clientSecret: configAuth.facebookAuth.clientSecret,
        callbackURL: configAuth.facebookAuth.callbackURL,
    },
    function(accessToken, refreshToken, profile, done) {
        userId = profile.id;
        userName = profile.displayName;
        // asynchronous verification, for effect...
        process.nextTick(function () {
            return done(null, profile);
        });
    }
  ));
};