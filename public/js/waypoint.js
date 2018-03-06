$(document).ready(function()
{
	var raceid = window.location.pathname.split('/')[2];
	var waypointid = window.location.pathname.split('/')[4];

	var socket = io();
	
	socket.on('client_waypoint_adduser', function(userid){
	  addUserToList(userid);
	});
	socket.on('client_waypoint_checkin', function(userid){
	  $("#btn_checkin").parent().remove();
	  addUserToList(userid);
	});

	// Waypoint info
	$.get("/races/" + raceid + '/waypoints/' + waypointid, function(waypoint){
		$.each(waypoint, function(i, item){
			if(i != "waypoints" && i != "users" && i != "__v")
				$("#waypoint").append("<p>" +i + ": " + item + "</p>");
		});
	});

	// Users
	$.get("/races/" + raceid + '/waypoints/' + waypointid + "/users", function(users){
		$.each(users, function(i, user){
			addUserToList(user);
		});
	});

	$("#btn_checkin").on("click", function(e){
		e.preventDefault();

		$.post("/races/" + raceid + '/waypoints/' + waypointid + "/users", function(data){
			socket.emit('server_waypoint_checkin', data);
		});
		return false;
	});
});

function addUserToList(user){
	$("#users").append('<div class="well">' + user.full_name + '</div>');
}