var facebook = require('./facebook.js');
var ConfigChecker = require('./../../back/ConfigChecker.js');

// Access Token illimité avec manage_pages
var accessToken = "CAADTa5xIkQUBACN5WetnSYdjAjn2Ddn1ZBkQ0gwnMzCY67hk4JlHUk4fQDvHbUlAR5mUlRL2SBIQKS6JsC25zY6sOzGHYbZAoUrBZBNAUgHrzFs3IqwdXCMzE1kwQtU4pp6y3agL2e6lZCBWHHgwAdjtXqdZCK0YRZCFXnQj2gR7Inz4WNPZBZA9oSjbZBt3iGWsZD";

var counterCallbackInfoPageFBRequest = 0;
var counterCallbackPostFBRequest = 0;
var counterCallbackPost = 0;

function execute(callback) {
	console.log("Execution du module facebook");

	ConfigChecker.get("facebook", function(linkFacebook){

		for(var i = 0; i < linkFacebook.length; i++)
		{
			doInfoPageFacebookRequest(linkFacebook, i, callback);
			doPostFacebookRequest(linkFacebook, i, callback);
		}

	});

}

function checkCallback(callback) {
	if(counterCallbackInfoPageFBRequest == 0 && counterCallbackPostFBRequest == 0 && counterCallbackPost == 0)
		callback();
}

/*
 *   Execute facebook request to get page's infos
 */
function doInfoPageFacebookRequest(linkFacebook, index, callback) {

	counterCallbackInfoPageFBRequest++;

	facebook.get(('/' + linkFacebook[index].fields.pageName + '?fields=likes,talking_about_count'), function(response) {

		response = JSON.parse(response);

		if(!response.error)
		{
			var date = new Date();
			var dataFBPage = {
				"connector_name" : "facebook",
				"type" : "info_page",
				"date" : new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0),
				"competitor_id" : linkFacebook[index].competitor_id,
				"connector_id" : linkFacebook[index].connector_id,
				"info" : {"fans" : response.likes, "shared" : response.talking_about_count}
			};

			var constraints = {
				"user_id"    : linkFacebook[index].user_id,
				"module_name": "facebook",
				"type_name"  : "info_page",
				"fields": {
					"date": new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0),
					"connector_id": linkFacebook[index].connector_id
				}
			};

			ConfigChecker.update(constraints, dataFBPage, function(){
				counterCallbackInfoPageFBRequest--;
				checkCallback(callback);
			});
		}
		else
		{
			console.log("Error : Problem on the info page result request for competitor " + linkFacebook[index].competitor_id + " and connector " + linkFacebook[index].connector_id + "\n" + response.error.message);

			counterCallbackInfoPageFBRequest--;
			checkCallback(callback);
		}

	});
}

/*
 *   Execute facebook request to get each post's infos
 */
function doPostFacebookRequest(linkFacebook, index, callback) {

	counterCallbackPostFBRequest++;

	facebook.get(('/' + linkFacebook[index].fields.pageName + '/posts/?fields=likes.limit(1).summary(true),comments.limit(1).summary(true),message,shares,type,link,picture&&access_token=' + accessToken), function(response) {
		
		response = JSON.parse(response);
			
		if(!response.error)
		{
			for(var j = 0; j < response.data.length; j++)
			{
				counterCallbackPost++;

				var likes = 0;
				var comments = 0;
				var shares = 0;
				var message = 'None';
				var link = "";
				var picture = "";

				if(response.data[j].likes != undefined)
					likes = response.data[j].likes.summary.total_count;
				if(response.data[j].comments != undefined)
					comments = response.data[j].comments.summary.total_count;
				if(response.data[j].message != undefined)
					message = response.data[j].message;
				if(response.data[j].shares != undefined) 
					shares = response.data[j].shares.count;
				if(response.data[j].link != undefined)
					link = response.data[j].link;
				if(response.data[j].type == 'photo')
					picture = response.data[j].picture;

				if (!(message == "None" && response.data[j].type == "status")) {
					var dataFBPost = {
						"connector_name" : "facebook",
						"type" : "post",
						"date" : new Date(),
						"competitor_id" : linkFacebook[index].competitor_id,
						"connector_id" : linkFacebook[index].connector_id,
						"info" : {
							"id" : response.data[j].id,
							"likes" : likes,
							"comments" : comments,
							"message" : message,
							"shares": shares,
							"link": link,
							"picture": picture,
							"type": response.data[j].type,
							"created_time" : response.data[j].created_time}
					};

					var constraints = {
						"user_id" : linkFacebook[index].user_id,
						"module_name" : "facebook",
						"type_name" : "post",
						"notification": 1,
						"fields" : {
										"info.id": response.data[j].id,
										"connector_id" : linkFacebook[index].connector_id
								   }
					};

					ConfigChecker.update(constraints, dataFBPost, function(){counterCallbackPost--;checkCallback(callback);});
				} else {
					counterCallbackPost--;
					checkCallback(callback);
				}
			}
		}
		else
		{
			console.log("Error : Problem on the post result request for competitor " + linkFacebook[index].competitor_id + " and connector " + linkFacebook[index].connector_id + "\n" + response.error.message);
		}

		counterCallbackPostFBRequest--;
		checkCallback(callback);

	});
}

function checkAdd(fields, callback) {
	if (fields.pageName.indexOf('http') == 0) {
		callback('Il ne faut pas rentrer l\'adresse entière de la page');
	}
	facebook.get(('/' + fields.pageName + '/posts?access_token=' + accessToken), function(response) {

		response = JSON.parse(response);
		if (!response.error && fields.displayName != '') {
			callback(true);
		} else {
			callback("Le nom (ou identifiant) de la page est incorrect");
		}
	});
}

exports.execute = execute;
exports.checkAdd = checkAdd;