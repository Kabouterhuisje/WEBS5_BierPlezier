var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;


var init = function(User) {

    var localStrategyOptions = {
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true 
    };

    passport.use('local-login', new LocalStrategy(localStrategyOptions, function(req, username, password, done) {

        // Kijk of user al bestaat
        User.findOne({ 'local.email' :  username }, function(err, user) {
            // checken voor errors
            if (err)
                return done(err);        
            if (!user || !user.validPassword(password))
                return done(null, false, null);
            // return user
            return done(null, user);
        });

    }));

    passport.use('local-signup', new LocalStrategy(localStrategyOptions, function(req, username, password, done) {

        findOrCreateUser = function(){
          // check voor user in database
          User.findOne({ 'local.email': username },function(err, user) {
            // checken voor errors
            if (err){
              console.log( 'Registreren niet gelukt: ' + err );
              return done(err);
            }
            // username bestaat al
            if (user) {
              console.log('Dit e-mailadres bestaat al! Probeer het opnieuw!');
              return done(null, false, null);
            } else {
                // username bestaat nog niet
                var newUser = new User(req.body);
                newUser.local.email = username;
                newUser.local.password = newUser.generateHash(password);
                newUser.save(function(err) {
                  if (err){
                    console.log('Gebruiker opslaan niet gelukt: ' + err);  
                    return next(err); 
                  }
                  console.log('Gebruiker opslaan gelukt');    
                  return done(null, newUser);
                });
            }
          });
        };  
        process.nextTick(findOrCreateUser);
      }));

    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
    return passport;
};



// config/passport.js

var FacebookStrategy = require('passport-facebook').Strategy;

// load up the user model
var User       = require('../models/user');

// load the auth variables
var configAuth = require('./auth');

module.exports = function(passport) {

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });


    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use(new FacebookStrategy({

            // pull in our app id and secret from our auth.js file
            clientID        : configAuth.facebookAuth.clientID,
            clientSecret    : configAuth.facebookAuth.clientSecret,
            callbackURL     : configAuth.facebookAuth.callbackURL

        },

        // facebook will send back the token and profile
        function(token, refreshToken, profile, done) {

            // asynchronous
            process.nextTick(function() {

                // find the user in the database based on their facebook id
                User.findOne({ 'facebook.id' : profile.id }, function(err, user) {

                    // if there is an error, stop everything and return that
                    // ie an error connecting to the database
                    if (err)
                        return done(err);

                    // if the user is found, then log them in
                    if (user) {
                        return done(null, user); // user found, return that user
                    } else {
                        // if there is no user found with that facebook id, create them
                        var newUser            = new User();

                        // set all of the facebook information in our user model
                        newUser.facebook.id    = profile.id; // set the users facebook id
                        newUser.facebook.token = token; // we will save the token that facebook provides to the user
                        newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                        newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

                        // save our user to the database
                        newUser.save(function(err) {
                            if (err)
                                throw err;

                            // if successful, return the new user
                            return done(null, newUser);
                        });
                    }

                });
            });

        }));

};

module.exports = init;