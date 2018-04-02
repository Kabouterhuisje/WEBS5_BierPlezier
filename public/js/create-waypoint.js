$(document).ready(function()
{
	var socket = io();
	initialize();

	$('#btnCancel').on("click", function(e){
		e.preventDefault();
		window.history.back();
	});

	$( "form#frmCreateWaypoint" ).submit(function(event){
		var raceid = window.location.pathname.split('/')[2];

		var data = {};
		data["waypoint_name"] = $("#waypoint_name").val();
		data["waypoint_lat"] = $("#waypoint_lat").val();
		data["waypoint_lng"] = $("#waypoint_lng").val();

		$.post( "/races/" + raceid + "/waypoints", { 
			placeid: raceid,
			name: data["waypoint_name"], 
			latitude: data["waypoint_lat"], 
			longitude: data["waypoint_lng"]
		}, function(response){
			console.log(response);
			if(response._id != null)
	          {
	          	socket.emit('server_race_addwaypoint', response);
	           	window.location = "/races/" + raceid + "/details";
	          }
	          else
	          {
                $(".alerts").html('<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>Er is iets mis gegaan! Probeer het nog eens of neem contact op met onze deskundige!</div>');
	          };
		});

		return false;
	});
});

function initialize() {
	
    autocomplete = new google.maps.places.Autocomplete((document.getElementById('waypoint_nearby')), { types: ['geocode'] });

    google.maps.event.addListener(autocomplete, 'place_changed', function() {
	    var place = autocomplete.getPlace();
	    $("#waypoint_lat").val(place.geometry.location.lat());
	    $("#waypoint_lng").val(place.geometry.location.lng());
	});
}