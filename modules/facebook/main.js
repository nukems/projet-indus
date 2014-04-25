/**
*	Point d'entree de l'execution de ton module
*/
function execute(callback) {
	console.log("execution du module facebook");
	
	var ConfigChecker = require('./../../back/ConfigChecker.js');
	var facebook = require('./facebook.js');

	var linkFacebook = ConfigChecker.get("facebook");
	
	var parseData = {
		"datas" : []
	};
	
	for(var i = 0; i < linkFacebook.length; i++)
	{
		var dataFBPage = {
			"id" : i + 5449,
			"connector_name" : "facebook",
			"type" : "info_page",
			"date" : new Date(),
			"competitor_id" : linkFacebook[i].pagelink,
			"info" : []
		};
		
		facebook.get((linkFacebook[i].pagelink + '?fields=likes,talking_about_count'), function(response) {
			if(response)
			{
				response = JSON.parse(response);
				dataFBPage.info.push({ "fans" : response.likes });
				dataFBPage.info.push({ "shared" : response.talking_about_count });
			}
		});
		
		parseData.datas.push(dataFBPage);
		var accessToken = "CAADTa5xIkQUBACN5WetnSYdjAjn2Ddn1ZBkQ0gwnMzCY67hk4JlHUk4fQDvHbUlAR5mUlRL2SBIQKS6JsC25zY6sOzGHYbZAoUrBZBNAUgHrzFs3IqwdXCMzE1kwQtU4pp6y3agL2e6lZCBWHHgwAdjtXqdZCK0YRZCFXnQj2gR7Inz4WNPZBZA9oSjbZBt3iGWsZD";
		
		facebook.get((linkFacebook[i].pagelink + '/statuses/?fields=likes.limit(1).summary(true),comments.limit(1).summary(true),message&&access_token=' + accessToken),  		function(response) {
			response = JSON.parse(response);
			if(response.data)
			{
				for(var j = 0; j < response.data.length; j++)
				{
					var dataFBPost = {
						"id" : j + 5449,
						"connector_name" : "facebook",
						"type" : "post",
						"date" : new Date(),
						"competitor_id" : linkFacebook[i],
						"info" : []
					};
					
					dataFBPost.info.push({"id" : response.data[j].id});
					dataFBPost.info.push({"likes" : response.data[j].likes.summary.total_count});
					//dataFBPost.info.push({"comments" : response.data[j].comments.summary.total_count});
					dataFBPost.info.push({"message" : response.data[j].message});
			
					parseData.datas.push(dataFBPost);
					console.log(dataFBPost);
				}
			}
			
		});
		
	}
	
	for(var k = 0; k < parseData.datas.length; k++)
	{
		if(parseData.datas[k].type == "info_page")
			ConfigChecker.add("facebook", "info_page", parseData.datas[k]);
			
		if(parseData.datas[k].type == "post")
		{
			if(!ConfigChecker.update("facebook", "post", "id", parseData.datas[k]))
				ConfigChecker.add("facebook", "post", parseData.datas[k]);
		}
	}
	
	callback();
	
	/*var FB = require('fb');

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
*/
	

	
}

exports.execute = execute;