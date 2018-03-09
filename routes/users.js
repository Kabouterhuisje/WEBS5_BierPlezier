var express = require('express');
var router = express.Router();

module.exports = function(passport, mongoose){

	router.post('/login', passport.authenticate('local-login'), function(req, res) {
		res.send(req.user);
  	});

	router.post('/signup', passport.authenticate('local-signup'), function(req, res) {
		res.send(req.user);
  	});

    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    router.get('/facebook', passport.authenticate('facebook', {
        scope : 'email'
    }));

    // handle the callback after facebook has authenticated the user
    router.get('/facebook/callback', passport.authenticate('facebook', {
        successRedirect : '/',
        failureRedirect : '/'
    }));

	router.get('/logout', function(req, res) {
	  req.logout();
	  res.redirect('/');
	});
	return router;
};
