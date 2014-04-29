var facebook = require('./facebook.js');
var ConfigChecker = require('./../../back/ConfigChecker.js');

var accessToken = "CAADTa5xIkQUBACN5WetnSYdjAjn2Ddn1ZBkQ0gwnMzCY67hk4JlHUk4fQDvHbUlAR5mUlRL2SBIQKS6JsC25zY6sOzGHYbZAoUrBZBNAUgHrzFs3IqwdXCMzE1kwQtU4pp6y3agL2e6lZCBWHHgwAdjtXqdZCK0YRZCFXnQj2gR7Inz4WNPZBZA9oSjbZBt3iGWsZD";

function execute(callback) {
	console.log("Execution du module facebook");

	ConfigChecker.get("facebook", function(linkFacebook){
		
		for(var i = 0; i < linkFacebook.length; i++)
		{			
			doInfoPageFacebookRequest(linkFacebook, i);			
			doPostFacebookRequest(linkFacebook, i);
		}
	});
	
	callback();	
}

/*
 *   Execute facebook request to get page's infos
 */
function doInfoPageFacebookRequest(linkFacebook, index) {
	
	facebook.get(('/' + linkFacebook[index].fields.pageName + '?fields=likes,talking_about_count'), function(response) {
		if(response)
		{
			response = JSON.parse(response);
			
			var dataFBPage = {
				"connector_name" : "facebook",
				"type" : "info_page",
				"date" : new Date(),
				"competitor_id" : linkFacebook[index].competitor_id,
				"info" : {"fans" : response.likes, "shared" : response.talking_about_count}
			};
				
			var constraints = {
				"user_id" : linkFacebook[index].user_id, 
				"module_name" : "facebook", 
				"type_name" : "info_page",
			}
			
			ConfigChecker.add(constraints, dataFBPage);
		}
	});
};


/*
 *   Execute facebook request to get each post's infos
 */
function doPostFacebookRequest(linkFacebook, index) {
	
	facebook.get(('/' + linkFacebook[index].fields.pageName + '/statuses/?fields=likes.limit(1).summary(true),comments.limit(1).summary(true),message,updated_time&&access_token=' + accessToken), function(response) {
		
		if(response)
		{
			response = JSON.parse(response);
			
			for(var j = 0; j < response.data.length; j++)
			{		
				var dataFBPost = {
					"connector_name" : "facebook",
					"type" : "post",
					"date" : new Date(),
					"competitor_id" : linkFacebook[index].competitor_id,
					"info" : {"id" : parseInt(response.data[j].id), "likes" : response.data[j].likes.summary.total_count, "message" : response.data[j].message, "updated_time" : response.data[j].updated_time}
				};		
				
				var constraints = {
					"user_id" : linkFacebook[index].user_id, 
					"module_name" : "facebook", 
					"type_name" : "post",
					"field" : "id"
				}
				
				ConfigChecker.update(constraints, dataFBPost);
			}
		}
		
	});
};

exports.execute = execute;