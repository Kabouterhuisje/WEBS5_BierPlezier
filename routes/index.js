var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var http = require('http');
var fs = require('fs');

var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
}

var isAdmin = function (req, res, next) {
  if (req.isAuthenticated() && req.user.admin)
    return next();
  else {
  	req.session.notice = "Je hebt geen rechten om deze actie uit te voeren!";
  	res.redirect('/');
  }
}

var isNotAuthenticated = function (req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  req.session.success = "De race is succesvol aangemaakt!";
  res.redirect('/');
}

router.get('/', isAuthenticated, function(req, res){
  res.render('index', { user: req.user });
});

router.post('/message', function(req, res, next){
  if(req.body.success) {
    req.session.success = req.body.success;
    res.send("success");
  }
  if(req.body.error) {
    req.session.error = req.body.error;
    res.send("error");
  }
  if(req.body.notice) {
    req.session.notice = req.body.notice;
    res.send("notice");
  }
  if(!req.body.success && !req.body.error && !req.body.notice)
    res.send("");
});

router.get('/img/:img', function(req, res, next) {
	var file = req.params.img;
  res.sendFile(file, { root: './img/' });
});
router.get('/js/:js', function(req, res, next) {
	var file = req.params.js;
  res.sendFile(file, { root: './img/' });
});

router.get('/css/:css', function(req, res, next) {
	var file = req.params.css;
  res.sendFile(file, { root: './css/' });
});

router.get('/login', isNotAuthenticated, function(req, res) {
	res.render('login', { title: 'Express' });
});

router.get('/register', isNotAuthenticated, function(req, res) {
	res.render('register', { title: 'Express' });
});

module.exports = router;