$(document).ready(function()
{
	var currentDate = new Date()
    var day = currentDate.getDate()
    var month = currentDate.getMonth() + 1
    var year = currentDate.getFullYear()
    month = (month<10) ? "0"+month : month;
    $( "#race_date_start" ).val(year+'-'+month+'-'+day);
	$( "#race_date_start" ).datepicker({ minDate: 0, dateFormat: 'yy-mm-dd' });

	$('#btnCancel').on("click", function(e){
		e.preventDefault();
		location.href = "/";
	});

	$( "form#frmCreateRace" ).submit(function(event){

		var data = {};
		data["race_name"] = $("#race_name").val();
		data["race_description"] = $("#race_description").val();
		data["race_date_start"] = $("#race_date_start").val();
		data["race_status"] = $("#race_status").val();

		$.post( "/races", { 
			name: data["race_name"],
			description: data["race_description"], 
			date_start: data["race_date_start"], 
			status: data["race_status"]
		}, function(response){
			window.location = "/";
		});
		return false;
	});
});
