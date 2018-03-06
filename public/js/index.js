$(document).ready(function()
{
	$.get("/races", function(races){
		$.each(races, function(i, race){
			if(race.status == "Open"){
				switch(race.status){
					case "Open":
						$("#tab-open").append('<div class="well"><div class="media"><div class="media-body"><h4 class="media-heading"><a href="/races/' + race._id + '/details">' + race.name + '</a><p class="race-amount-users text-right"><span><i class="glyphicon glyphicon-user"></i> ' + race.users.length + '</span></p></h4><p class="race-description">' + race.description + '</p><ul class="race-date-start list-inline list-unstyled"><li><span><i class="glyphicon glyphicon-calendar"></i> ' + moment(race.date_start).format('MMMM Do YYYY, hh:mm') + ' (' + moment(race.date_start).fromNow() + ')</span></li><li><span><i class="glyphicon glyphicon-flag"></i> ' + race.waypoints.length + '</span></li></ul></div></div></div>');
						break;
					case "Closed":
						$("#tab-closed").append('<div class="well"><div class="media"><div class="media-body"><h4 class="media-heading"><a href="/races/' + race._id + '/details">' + race.name + '</a><p class="race-amount-users text-right"><span><i class="glyphicon glyphicon-user"></i> ' + race.users.length + '</span></p></h4><p class="race-description">' + race.description + '</p><ul class="race-date-start list-inline list-unstyled"><li><span><i class="glyphicon glyphicon-calendar"></i> ' + moment(race.date_start).format('MMMM Do YYYY, hh:mm') + ' (' + moment(race.date_start).fromNow() + ')</span></li><li><span><i class="glyphicon glyphicon-flag"></i> ' + race.waypoints.length + '</span></li></ul></div></div></div>');
						break;
					default:
	        			$("#tab-open").html("Geen races aanwezig!");
				}
			}
		});
	});
	$( "#races" ).tabs();
});
