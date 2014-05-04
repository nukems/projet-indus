function facebook() {

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
														"moduleName": "facebook", 
														"where": {type: "info_page"}}, function(data) {

			var html =  '<div id="canvas' + connectorId + '" style="min-width: 600px; height: 400px;"></div>';
					   

			$('#connectorData' + connectorId).append(html);
			self.displayLikesAndShares(data.data, connectorId);
			
			get(Ajax).send('user/competitors/modules/get', {"connector_id": self.connectorId,
															"moduleName": "facebook",
															"where": {type: "post"}}, function(data) {
																
				var html = '<div id="canvas-post' + connectorId + '" style="min-width: 600px; height: 400px;float:left;"></div>' +
						   '<div id="post-detail" style="float:left"><div><h1>Post detail</h1></div><p>No post selected</p></div>';
				
				$('#connectorData' + connectorId).append(html);
				self.displayPosts(data.data, connectorId);
			});
		});
		
		/*get(Ajax).send('user/competitors/modules/get', {"connector_id": self.connectorId, 
														"moduleName": "facebook", 
														"where": {}}, function(data) {

			var html = 'Page ' + fields.pageName + '<br />' + 
					   '<div id="canvas' + connectorId + '" style="min-width: 600px; height: 400px;"></div>';

			$('#connectorData' + connectorId).html(html);
			self.displayLikesSharePosts(data.data, connectorId);
		});*/
		
	}

	this.displayLikesAndShares = function(data, connectorId) {
		var likes = [];
		var shares = [];
		for(var i = 0; i < data.length; i++) {
			 likes.push({x: new Date(data[i].date), y: data[i].info.fans});
			 shares.push({x: new Date(data[i].date), y: data[i].info.shared});
		}
<<<<<<< HEAD
=======

>>>>>>> e690836e22947f1f490efc800b2e608a73baecbb
		var chart = new CanvasJS.Chart("canvas" + connectorId, {

		toolTip: {
			shared: true,
			content: function(e) {
				var ratio = (e.entries[1].dataPoint.y / e.entries[0].dataPoint.y * 100).toFixed(2);
				return e.entries[0].dataPoint.x + "<br />" + ratio + "% en parlent<br />Likes : " + e.entries[0].dataPoint.y + "<br />Shares : " + e.entries[1].dataPoint.y;
			}
		},
	    title:{
	        text: "Likes et partages"              
	    }, data: [//array of dataSeries              
	        { //dataSeries object

	         /*** Change type "column" to "bar", "area", "line" or "pie"***/
	         type: "line",
	         dataPoints: likes,
     		 showInLegend: true,
			 legendText: "Likes"
	         
	       },
	       { //dataSeries object

	         /*** Change type "column" to "bar", "area", "line" or "pie"***/
	         type: "line",
	         dataPoints: shares,
     		 showInLegend: true,
			 legendText: "Shares"
	         
	       }
	       ]
	     });

	    chart.render();
	}
	
	this.displayLikesSharePosts = function(data, connectorId) {
		var likes = [];
		var shares = [];
		var posts = [];
		for(var i = 0; i < data.length; i++) {
			if(data[i].type == "info_page")
			{
				likes.push({x: new Date(data[i].date), y: data[i].info.fans});
				shares.push({x: new Date(data[i].date), y: data[i].info.shared});
			}
			
			if(data[i].type == "post")
			{
				posts.push({x: new Date(data[i].info.created_time), y: data[i].info.comments, z: data[i].info.likes, message: data[i].info.message});
			}
		}
		
		var chart = new CanvasJS.Chart("canvas" + connectorId, {
			
		zoomEnabled: true,
	    title:{
	        text: "Likes, share and posts"              
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
	         
	       },
	       { //dataSeries object

	         /*** Change type "column" to "bar", "area", "line" or "pie"***/
	         type: "bubble",
	         dataPoints: posts,
			 toolTipContent: "{x} : {message}"
	         
	       }
	       ]
	     });

	    chart.render();
	}
	
	this.displayPosts = function(data, connectorId) {
		var posts = [];
		for(var i = 0; i < data.length; i++) {
			posts.push({x: new Date(data[i].info.created_time), y: data[i].info.comments, z: data[i].info.likes, message: data[i].info.message});
		}
		
		var chart = new CanvasJS.Chart("canvas-post" + connectorId, {
			
		zoomEnabled: true,
	    title:{
	        text: "Post"              
	    }, data: [//array of dataSeries              
	       { //dataSeries object

	         /*** Change type "column" to "bar", "area", "line" or "pie"***/
	         type: "bubble",
	         dataPoints: posts,
			 toolTipContent: "{x} : {message}<br />Likes : {z}<br />Comments : {y}",
			 click: function(e){
			   $('#post-detail').html('<div><h1>Post detail</h1></div><p>' + e.dataPoint.message + '</p>');
			 },
	         
	       }
	       ]
	     });

	    chart.render();
	}

}