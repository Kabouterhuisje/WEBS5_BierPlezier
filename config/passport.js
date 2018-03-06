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

module.exports = init;