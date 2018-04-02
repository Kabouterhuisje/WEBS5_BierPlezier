var express = require('express');
var router = express.Router();
var passport = require('passport');

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login')
}

module.exports = function(app, passport){

	router.post('/login', passport.authenticate('local-login'), function(req, res) {
		res.send(req.user);
  	});

	router.post('/signup', passport.authenticate('local-signup'), function(req, res) {
		res.send(req.user);
  	});

	/* FACEBOOK ROUTER */
    router.get('/facebook',
        passport.authenticate('facebook'));

    var options = {
    	successRedirect: '/', failureRedirect: '/login'
	};
    router.get('/facebook/callback',
        passport.authenticate('facebook', options),
        function(req, res) {
            // Successful authentication, redirect home.
            res.redirect('/');
        });

	router.get('/logout', function(req, res) {
	  req.logout();
	  res.redirect('/');
	});

	/* GET users listing. */
    router.get('/', ensureAuthenticated, function(req, res, next) {
        res.render('user', { user: req.user });
    });
	return router;
};
