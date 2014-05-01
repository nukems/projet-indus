function facebook() {

	var self = this;

	this.connectorId = null;

	/**
	* Le div qui doit contenir les donnees affichees est "connectorData{connectorId}"
	*/
	this.init = function(connectorId, fields) {
		self.connectorId = connectorId;

		//recuperation des donnees
		//where est un tableau qui contient les criteres de selection, a la maniere mongodb
		get(Ajax).send('user/competitors/modules/get', {"connector_id": self.connectorId, 
														"moduleName": "facebook", 
														"where": {type: "info_page"}}, function(data) {

			var html = 'Page ' + fields.pageName + '<br />' + 
					   '<div id="canvas' + connectorId + '" style="width: 600px; height: 400px;"></div>';

			$('#connectorData' + connectorId).html(html);
			self.displayLikesAndShares(data.data, connectorId);
		});
	}

	this.displayLikesAndShares = function(data, connectorId) {
		var likes = [];
		var shares = [];
		for(var i = 0; i < data.length; i++) {
			 likes.push({x: new Date(data[i].date), y: data[i].info.fans});
			 shares.push({x: new Date(data[i].date), y: data[i].info.shared});
		}
		console.log(likes);
		console.log(shares);
		var chart = new CanvasJS.Chart("canvas" + connectorId, {

	    title:{
	        text: "Likes et partages"              
	    }, data: [//array of dataSeries              
	        { //dataSeries object

	         /*** Change type "column" to "bar", "area", "line" or "pie"***/
	         type: "line",
	         dataPoints: likes
	         
	       },
	       { //dataSeries object

	         /*** Change type "column" to "bar", "area", "line" or "pie"***/
	         type: "line",
	         dataPoints: shares
	         
	       }
	       ]
	     });

	    chart.render();
	}

}