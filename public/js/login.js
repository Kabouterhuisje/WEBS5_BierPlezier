$(document).ready(function()
{
	$( "form#frmLogin" ).submit(function(event){
    var _email = $("#email").val();
    var _password = $("#password").val();

    $.post("users/login", { email: _email, password: _password }, function(response)
    {
      if(response._id != null)
      {
        $.post('/message', { success: "Je bent succesvol ingelogd! Veel plezier!" });
        window.location = '/';
      }
      else
      {
        $.post('/message', { error: "Er is iets mis gegaan! Probeer het nog eens of neem contact op met onze deskundige!" });
        location.reload();
      }
    }).error(function(httpObj, textStatus) {       
              if(httpObj.status==401)
                $(".alerts").html('<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Er is iets mis gegaan! Probeer het nog eens of neem contact op met onze deskundige!</div>');
            });
		return false;
	});
});