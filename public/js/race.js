$(document).ready(function()
{
	var raceid = window.location.pathname.split('/')[2];
	var userid = user._id;

	var socket = io();
	
	socket.on('client_race_adduser', function(userid){
	  addUserToList(userid);
	});
	socket.on('client_race_addwaypoint', function(waypoint){
	  addWaypointToList(waypoint, raceid);
	});
	socket.on('client_race_participate', function(userid){
	  $("#btn_participate").parent().remove();
	  addUserToList(userid);
	});

	// Race info
	$.get("/races/" + raceid, function(race){
		$.each(race, function(i, item){
			if(i != "waypoints" && i != "users" && i != "__v")
				$("#race").append("<p>" + i + ": " + item + "</p>");
		});
	});

	// Waypoints
	$.get("/races/" + raceid + "/waypoints", function(waypoints){
		$.each(waypoints, function(i, waypoint){
			addWaypointToList(waypoint, raceid);			
		});
	});

	// Users
	$.get("/races/" + raceid + "/users", function(users){
		$.each(users, function(i, user){
			addUserToList(user);
		});
	});

	$("#btn_participate").on("click", function(e){
		e.preventDefault();

		$.post("/races/" + raceid + "/users/", function(data){
			socket.emit('server_race_adduser', data);
		});

		return false;
	});
});

function addUserToList(user){
	$("#users").append('<div class="well">' + user.full_name + '</div>');
}

function addWaypointToList(waypoint, raceid){
	console.log(waypoint);
	$("#waypoints").append('<div class="well"><div class="media"><div class="media-body"><h4 class="media-heading"><a href="/races/' + raceid + '/waypoints/' + waypoint._id + '/details">' + waypoint.name + '</a><p class="race-amount-users text-right"><span><i class="glyphicon glyphicon-user"></i> ' + waypoint.users.length + '</span></p></h4><p class="race-description"></p><ul class="race-date-start list-inline list-unstyled"><li><i class="glyphicon glyphicon-map-marker"></i></li><li>' + waypoint.latitude + ',</li><li>' + waypoint.longitude + '</li></ul></div></div></div>');
}