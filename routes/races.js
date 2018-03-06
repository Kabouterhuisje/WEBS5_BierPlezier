var express = require('express');
var router = express.Router();


module.exports = function(mongoose){

	var Race =  mongoose.model('Race');
	var User =  mongoose.model('User');
	var Waypoint =  mongoose.model('Waypoint');
	var isAuthenticated = function (req, res, next) {
	  if (req.isAuthenticated())
	    return next();
	  res.redirect('/login');
	}

	var isAdmin = function (req, res, next) {
      if (req.isAuthenticated() && req.user.admin)
        return next();
      res.redirect('/');
    }

    router.route('/')
	.get(function(req, res) { 

		Race.find({}, function(err, races) {
			if (err) { console.log(err); }
			
			res.json(races);
		});
	})
	.post(function(req, res, next) {
		var race = new Race(req.body);
		race.save(function (err) {
		  	if (err) { console.log(err); }

		  	res.json(race);
		});
    })
    .delete(isAdmin, function(req, res) { 
	  Race.findByIdAndRemove(req.body._id, function(err) {
	    	if (err) { console.log(err); }
	    	res.send("ok");
	  	}); 
	});

	router.get('/create', isAdmin, function(req, res){ 
	  var passedMessage = req.message;
	  res.render('create', { title: 'Create Race', user: req.user });
	});

	router.route('/:raceid')
	.get(function(req, res) { 
		Race.findById(req.params.raceid, function(err, race) {
			if (err) { console.log(err); }

			res.json(race);
      	});
	})
	.put(isAdmin, function(req, res) { 
		Race
		.findOne({ _id: req.params.raceid })
		.exec(function(err, race) {
			if (err) { console.log(err); }

            for (var item in req.body) {
            	race[item] = req.body[item];
            }

            race.save(function(err) {
                if (err) { console.log(err); }

                res.send('updated');
            });
		});
	});


    router.get('/:raceid/details', isAuthenticated, function(req, res){ 
		Race
		.findOne({ _id: req.params.raceid })
		.exec(function (err, race) {
		  	if (err) { console.log(err); }

			Race.find({
			    "_id": req.params.raceid,
			    "users": req.user._id
			})
		    .exec(function (err, race) {
		        if (err) { console.log(err); }

		        if(Object.keys(race).length === 0)
					res.render('overview-race', { user: req.user, raceid: req.params.raceid, inRace: false });
				else
					res.render('overview-race', { user: req.user, raceid: req.params.raceid, inRace: true });
			});
		});
	});

	router.route('/:raceid/waypoints')
	.get(function(req, res){
		Race
		.findOne({ _id: req.params.raceid })
		.populate('waypoints')
		.exec(function (err, race) {
		  if (err) { console.log(err); }

		  res.json(race.waypoints);
		});
	})
	.post(function(req, res, next){ 
		var waypoint = new Waypoint(req.body);
		waypoint.save(function (err) {
		  	if (err) { console.log(err); }

		  	Race.findById(req.params.raceid, function(err, race) {
			    if (err) { console.log(err); }

				race.waypoints.push(waypoint._id);
				race.save(function(err) {
				    if (err) { console.log(err); }
				    
				    res.send(waypoint);
	    		});
			});
		});
	})
	.delete(function(req, res) { 
		Race.findOne({
		    "_id": req.params.raceid,
		    "waypoints": req.body._id
		})
		.populate('waypoints')
		.exec(function(err, race){
			if (err) { console.log(err); }

			for (var i=0; i<race.waypoints.length; i++) {
				if(req.body._id == race.waypoints[i]._id) {
		            race.waypoints.splice(i, 1);
		            break;
		        }
			}
			race.save(function(err) {
			    if (err) { console.log(err); }

			    res.json(race);
	    	});
		});
	});

	router.get('/:raceid/waypoints/create', isAdmin, function(req, res){ 
	  	res.render('create-waypoint', { title: 'Create Waypoint', user: req.user });
	});

	router.get('/:raceid/waypoints/:waypointid/details', isAuthenticated, function(req, res){ 
		Waypoint.find({
		    "_id": req.params.waypointid,
		    "users": req.user._id
		})
	    .exec(function (err, waypoint) {
	        if (err) { console.log(err); }

	        if(Object.keys(waypoint).length === 0)
	  			res.render('overview-waypoint', { user: req.user, checkedIn: false });
	  		else
				res.render('overview-waypoint', { user: req.user, checkedIn: true });
	   	});
	});
	router.route('/:raceid/waypoints/:waypointid/users')
	.get(function(req, res){
      	Waypoint
		.findOne({ _id: req.params.waypointid })
		.populate('users')
		.exec(function (err, waypoint) {
		  if (err) { console.log(err); }

		  res.json(waypoint.users);
		});
	})
	.post(function(req, res){
		var raceid = req.params.raceid;
		var waypointid = req.params.waypointid;
		Waypoint.findById(waypointid, function(err, waypoint) {
		    if (err) { console.log(err); }

			waypoint.users.push(req.user._id);
			waypoint.save(function(err) {
			    if (err) { console.log(err); }

			    res.send(req.user);
    		});
		});
	});

	router.route('/:raceid/waypoints/:waypointid')
	.get(isAuthenticated, function(req, res){
			var raceid = req.params.raceid;
			var waypointid = req.params.waypointid;
			Waypoint.findById(waypointid, function(err, waypoint) {
				if (err) { console.log(err); }

				res.send(waypoint);
      	});
	});

	router.route('/:raceid/users')
	.get(function(req, res){ 
      	Race
		.findOne({ _id: req.params.raceid })
		.populate('users')
		.exec(function (err, race) {
		  if (err) { console.log(err); }

		  res.json(race.users);
		});
	})
	.post(function(req, res, next){ 
		Race
		.findOne({ _id: req.params.raceid })
		.exec(function (err, race) {
		    if (err) { console.log(err); }

			race.users.push(req.user._id);
			race.save(function(err) {
			    if (err) { console.log(err); }

			    res.send(req.user);
    		});
		});
	})
	.delete(function(req, res) { 
		Race
		.findOne({ _id: req.params.raceid })
		.exec(function(err, race){
			console.log(race);
			if (err) { console.log(err); }

			for (var i=0; i<race.users.length; i++) {
				if(req.body._id == race.users[i]._id) {
		            race.users.splice(i, 1);
		            break;
		        }
			}
			race.save(function(err) {
			    if (err) { console.log(err); }

			    res.json(race);
	    	});
		});
	});
	return router;
};
