var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var configAuth = require('./auth');
var User = require('../models/user');


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

// =========================================================================
// FACEBOOK ================================================================
// =========================================================================
passport.use(new FacebookStrategy({
        clientID: configAuth.facebookAuth.clientID,
        clientSecret: configAuth.facebookAuth.clientSecret,
        callbackURL: configAuth.facebookAuth.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
        process.nextTick(function() {
           User.findOne({'facebook.id': profile.id}, function(err, user){
             if(err)
                 return done(err);
             if(user)
                 return done(null, user);
             else {
                 var newUser = new User();
                 newUser.facebook.id = profile.id;
                 newUser.facebook.token = accessToken;
                 newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
                 newUser.facebook.email = profile.emails[0].value;

                 newUser.save(function(err){
                    if(err)
                        throw err;
                    return done(null, newUser);
                 });
             }
           });
        });
    }
));

module.exports = init;