$(document).ready(function()
{
	$( "form#frmRegister" ).submit(function(event){
		var data = {};
		data["first_name"] = $("#first_name").val();
		data["middle_name"] = $("#middle_name").val();
		data["last_name"] = $("#last_name").val();
		data["age"] = $("#age").val();
		data["email"] = $("#email").val();
		data["password"] = $("#password").val();
		data["password_confirmation"] = $("#password_confirmation").val();
 
		if (data["password"] == data["password_confirmation"]) {
	        $.post("users/signup", { first_name: data["first_name"],  middle_name: data["middle_name"],  last_name: data["last_name"],  age: data["age"],  email: data["email"], password: data["password"], admin: false}, function(response)
	        {
	        	console.log(response);
	          if(response._id != null)
	          {
	            $.post('/message', { success: "Je account is succesvol aangemaakt!" });
	            window.location = "/";
	          }
	          else
	          {
                $(".alerts").html('<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>Er is iets mis gegaan! Probeer het nog eens of neem contact op met onze deskundige!</div>');
	          }
	        });
		} else{
                $(".alerts").html('<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>Je wachtwoorden komen niet met elkaar overeen! Probeer het nog eens!</div>');
		}
		return false;
	});
});