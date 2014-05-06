function twitter() {

	var self = this;

	this.connectorId = null;

	/**
	* Le div qui doit contenir les donnees affichees est "connectorData{connectorId}"
	*/
	this.init = function(connectorId, fields) {
		self.connectorId = connectorId;

		
		$('#connectorData' + connectorId).append('Page ' + fields.pageName + '<br />');
		//recuperation des donnees
		//where est un tableau qui contient les criteres de selection, a la maniere mongodb
		get(Ajax).send('user/competitors/modules/get', {"connector_id": self.connectorId, 
														"moduleName": "twitter", 
														"where": {type: "info_page"}}, function(data) {

			var html =  '<div id="canvas' + connectorId + '" style="min-width: 600px; height: 400px;"></div>';
					   

			$('#connectorData' + connectorId).append(html);
			self.displayTweetsAndFollowers(data.data, connectorId);
		});
		
	}

	this.displayTweetsAndFollowers = function(data, connectorId) {
		var followers = [];
		var tweets = [];
		for(var i = 0; i < data.length; i++) {
			 followers.push({x: new Date(data[i].date), y: data[i].info.followers});
			 tweets.push({x: new Date(data[i].date), y: data[i].info.tweets});
		}

		var chart = new CanvasJS.Chart("canvas" + connectorId, {

	    title:{
	        text: "Followers and Tweets"              
	    }, data: [//array of dataSeries              
	        { //dataSeries object

	         /*** Change type "column" to "bar", "area", "line" or "pie"***/
	         type: "line",
	         dataPoints: followers,
     		 showInLegend: true,
			 legendText: "Followers"
	         
	       },
	       { //dataSeries object

	         /*** Change type "column" to "bar", "area", "line" or "pie"***/
	         type: "line",
	         dataPoints: tweets,
     		 showInLegend: true,
			 legendText: "Tweets"
	         
	       }
	       ]
	     });

	    chart.render();
	}
}