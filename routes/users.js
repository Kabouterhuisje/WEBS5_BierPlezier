var express = require('express');
var router = express.Router();

module.exports = function(passport, mongoose){

	router.post('/login', passport.authenticate('local-login'), function(req, res) {
		res.send(req.user);
  	});

	router.post('/signup', passport.authenticate('local-signup'), function(req, res) {
		res.send(req.user);
  	});

    express.get('/auth/facebook', passport.authenticate('facebook'));

    express.get('/auth/facebook/callback',
        passport.authenticate('facebook', { successRedirect: '/',
            failureRedirect: '/login' }));

	router.get('/logout', function(req, res) {
	  req.logout();
	  res.redirect('/');
	});
	return router;
};
