var ConfigChecker = require('./../../back/ConfigChecker.js');

var request = require('./../../back/node_modules/request');
var OAuth   = require('./../../back/node_modules/oauth-1.0a');

var counterCallbackInfoPageTwitterRequest = 0;
var counterCallbackTweetTwitterRequest = 0;
var counterCallbackTweet = 0;

function execute(callback) {
	console.log("Execution du module twitter");

	ConfigChecker.get("twitter", function(linkTwitter){
		
		for(var i = 0; i < linkTwitter.length; i++)
		{
			doInfoPageTwitterRequest(linkTwitter, i, callback);
			doTweetsTwitterRequest(linkTwitter, i, callback);
		}
	});
	
}

function checkCallback(callback) {
	if(counterCallbackInfoPageTwitterRequest == 0 && counterCallbackTweetTwitterRequest == 0 && counterCallbackTweet == 0)
		callback();
}

/*
 *   Execute twitter request to get page's infos
 */
function doInfoPageTwitterRequest(linkTwitter, index, callback) {	

	counterCallbackInfoPageTwitterRequest++;
	
  request.get(
	{
		url:'https://api.twitter.com/1.1/users/lookup.json?screen_name=' + linkTwitter[index].fields.pageName, 
		oauth: {
			consumer_key: 'kqrFKLzLOWSExxpHE0MTvOqVh'
			, consumer_secret: 'wtoELfW5QfCRtIcowjgDUSUnaW9nEPy9JF1Q8ErHRaX26pxn8z'
			, token: '66474348-k5bva9A4lALFAFMO1KZIPDOuOC3tMfNFAFyBDaHoB'
			, token_secret: 'FU1Ku9MwMoez1vJw5fieZ0L8rjcY4ODHDL3YabGsOxHbI'
				}
	}, function (error, response, body) {
		
		body = JSON.parse(body);		
		
		if(error == null) {
			var date = new Date();
			var dataTwitterPage = {
				"connector_name" : "twitter",
				"type" : "info_page",
				"date" : new Date(),
				"competitor_id" : linkTwitter[index].competitor_id,
				"connector_id" : linkTwitter[index].connector_id,
				"info" : {"followers" : body[0].followers_count, "tweets" : body[0].statuses_count}
			};

			var constraints = {
				"user_id"    : linkTwitter[index].user_id,
				"module_name": "twitter",
				"type_name"  : "info_page",
				"fields" : {
					"date": new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0),
					"connector_id": linkTwitter[index].connector_id
				}
			};

			ConfigChecker.update(constraints, dataTwitterPage, function(){counterCallbackInfoPageTwitterRequest--;checkCallback(callback);});
		}
		else
		{
			console.log("Error : Problem on the info page result request for competitor " + linkTwitter[index].competitor_id + " and connector " + linkTwitter[index].connector_id + "\n" + error);

			counterCallbackInfoPageTwitterRequest--;
			checkCallback(callback);
		}

		
	});
	
};


/*
 *   Execute twitter request to get each tweet's infos
 */
function doTweetsTwitterRequest(linkTwitter, index, callback) {	

	counterCallbackTweetTwitterRequest++;
	
  request.get(
	{
		url:'https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=' + linkTwitter[index].fields.pageName, 
		oauth: {
			consumer_key: 'kqrFKLzLOWSExxpHE0MTvOqVh'
			, consumer_secret: 'wtoELfW5QfCRtIcowjgDUSUnaW9nEPy9JF1Q8ErHRaX26pxn8z'
			, token: '66474348-k5bva9A4lALFAFMO1KZIPDOuOC3tMfNFAFyBDaHoB'
			, token_secret: 'FU1Ku9MwMoez1vJw5fieZ0L8rjcY4ODHDL3YabGsOxHbI'
				}
	}, function (error, response, body) {
		
		body = JSON.parse(body);
		if(error == null)
		{
			for(var j = 0; j < body.length; j++)
			{
				counterCallbackTweet++;
				var dataTwitterTweet = {
					"connector_name" : "twitter",
					"type" : "tweet",
					"date" : new Date(),
					"competitor_id" : linkTwitter[index].competitor_id,
					"connector_id" : linkTwitter[index].connector_id,
					"info" : {
						"id" : body[j].id_str,
						"retweet" : body[j].retweet_count,
						"favorite" : body[j].favorite_count,
						"message" : body[j].text,
						"created_time" : body[j].created_at}
				};

				var constraints = {
					"user_id" : linkTwitter[index].user_id,
					"module_name" : "twitter",
					"type_name" : "tweet",
					"fields" : {"info.id": body[j].id_str}
				};

				ConfigChecker.update(constraints, dataTwitterTweet, function(){counterCallbackTweet--;checkCallback(callback);});
			}
		}
		else
		{
			console.log("Error : Problem on the post result request for competitor " + linkTwitter[index].competitor_id + " and connector " + linkTwitter[index].connector_id + "\n" + error);
		}

		counterCallbackTweetTwitterRequest--;
		checkCallback(callback);
		
	});
	
};

function checkAdd(fields, callback) {
	console.log(fields);
	request.get(
	{
		url:'https://api.twitter.com/1.1/users/lookup.json?screen_name=' + fields.pageName, 
		oauth: {
			consumer_key: 'kqrFKLzLOWSExxpHE0MTvOqVh'
			, consumer_secret: 'wtoELfW5QfCRtIcowjgDUSUnaW9nEPy9JF1Q8ErHRaX26pxn8z'
			, token: '66474348-k5bva9A4lALFAFMO1KZIPDOuOC3tMfNFAFyBDaHoB'
			, token_secret: 'FU1Ku9MwMoez1vJw5fieZ0L8rjcY4ODHDL3YabGsOxHbI'
				}
	}, function (error, response, body) {
		
		body = JSON.parse(body);		
		
		if (body.errors && body.errors.length > 0) {
			callback("Le nom de page est incorrect");
			
		} else {
			callback(true);
		}

		
	});
}
exports.execute = execute;
exports.checkAdd = checkAdd;