/**
*	Point d'entree de l'execution de ton module
*/
function execute(callback) {
	console.log("execution du module facebook");
	
	var ConfigChecker = require('./../../ConfigChecker.js');
	var facebook = require('./facebook.js');

	var linkFacebook = ConfigChecker.get("facebook");
	
	/*var parseData = {
		"datas" : []
	};
	
	parseData.datas.push({
			"id" : 6545,
			"connector_name" : "facebook",
			"type" : "info_page",
			"date" : new Date(),
			"competitor_id" : linkFacebook[0].pagelink,
			"info" : [{"fans" : 1458}, {"shared" : 654}]
		});*/
	
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
		
		facebook.get((linkFacebook[i].pagelink + '/posts/?fields=likes.fields(id),comments.fields(id),message'), function(response) {
			
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
					
					if(response.data[j].likes)
						dataFBPost.info.push({"likes" : response.data[j].likes.data.length});
					if(response.data[j].comments)
						dataFBPost.info.push({"comments" : response.data[j].comments.data.length});
					if(response.data[j].message)
						dataFBPost.info.push({"message" : response.data[j].message});
			
					parseData.datas.push(dataFBPost);		
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
}

exports.execute = execute;