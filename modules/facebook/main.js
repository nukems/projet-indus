/**
*	Point d'entree de l'execution de ton module
*/
function execute(callback) {
	console.log("execution du module facebook");
	
	var FB = require('fb');

	FB.api('oauth/access_token', {
	    client_id: '513818025323224',
	    client_secret: '4e96acfeeaa8cdd781cf2d8841bdeaa7',
	    grant_type: 'client_credentials'
	}, function (resu) {
	    if(!resu || resu.error) {
	        console.log(!resu ? 'error occurred' : resu.error);
	        return;
	    }

	    var accessToken = resu.access_token;
	    FB.setAccessToken(accessToken);

	    FB.api('182411791898555/posts', function (result) {
		  if(!result || result.error) {
		   console.log(!result ? 'error occurred' : result.error);
		   //return;
		  }
		  //console.log(result);
		  res.end(JSON.stringify(result));
		  callback();
		});
	});

	

	
}

exports.execute = execute;