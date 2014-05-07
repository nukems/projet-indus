/**
 * Created by kln on 05/05/14.
 */

var https = require('https');

function whatHttpCodeForFacebookPage(path)
{
	var options = {
		hostname: 'www.facebook.com',
		path    : path,
		method  : 'GET'
	};

	var req = https.request(options, function(res)
	{
		console.log('STATUS: ' + res.statusCode);
	});

	req.end();

	req.on('error', function(e) {
		console.log('problem with request: ' + e.message);
	});
}

whatHttpCodeForFacebookPage("/LDLC.com");
whatHttpCodeForFacebookPage("/LDLC.co");