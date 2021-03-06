// Passport strategies
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var dbfunctions = require('./../routes/dbfunctions');
var userId;
var userName;
var userEmail;
global.userPhotograph = "photo";

//var User = require('../lib/user');

var configAuth = require('./auth');

module.exports = function(passport) {

    // Passport session setup. To support persistent login sessions, Passport needs to serialize 
  // users into and deserialize users out of the session.  Typically, this will be as simple
  // as storing the user ID when serializing, and finding the user by ID when deserializing.
    passport.serializeUser(function (email, done) {
        done (null, email);
    });

    passport.deserializeUser (function (email, done) {
    
    });
    
    
    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    passport.use(new GoogleStrategy({
            clientID : configAuth.googleAuth.clientID,
            clientSecret : configAuth.googleAuth.clientSecret,
            callbackURL : configAuth.googleAuth.callbackURL,
        }, function(accessToken, refreshToken, profile, done) {
        // asynchronous verification, for effect...
        process.nextTick(function() {

            userId = profile.id;
            userName = profile.displayName;
            userEmail = profile.emails[0].value;
            userPicture = profile._json['picture'];
            //console.log("Google Picture Url: " + picture);

            //send user to database
            function handleResult(err) {
                if (err) {
                    console.error(err.stack || err.message);
                    return;
                }
            }
            dbfunctions.locateUser(handleResult, userId, userName, userEmail, userPicture, "gmail");

            // To keep the example simple, the user's Google profile is returned to
            // represent the logged-in user.  In a typical application, you would want
            // to associate the Google account with a user record in your database,
            // and return that user instead.
            return done(null, profile);
        });
    }));
  
  // =========================================================================
    // Facebook ================================================================
    // =========================================================================
  passport.use(new FacebookStrategy({
        clientID: configAuth.facebookAuth.clientID,
        clientSecret: configAuth.facebookAuth.clientSecret,
        callbackURL: configAuth.facebookAuth.callbackURL,
        profileFields: ['id', 'displayName', 'link', 'photos', 'gender', 'emails'],
        enableProof: true
    },
    function(accessToken, refreshToken, profile, done) {
        //console.log("User Id: " + userId + "\nUser Name: " + userName + "\nUser Email: " + userEmail);
        // asynchronous verification, for effect...
        process.nextTick(function () {

            userId = profile.id;
            userName = profile.displayName;
            userEmail = profile.emails[0].value;
            userPicture = profile.photos ? profile.photos[0].value : "";

            //send user to database
            function handleResult(err) {
                if (err) {
                    console.error(err.stack || err.message);
                    return;
                }
            }
            dbfunctions.locateUser(handleResult, userId, userName, userEmail, userPicture, "facebook");
            return done(null, profile);
        });
    }
  ));
};