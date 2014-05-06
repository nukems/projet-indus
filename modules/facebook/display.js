function facebook() {

	var self = this;

	this.connectorId = null;

	/**
	* Le div qui doit contenir les donnees affichees est "connectorData{connectorId}"
	*/
	this.init = function(connectorId, fields) {
		self.connectorId = connectorId;

		//dates debut et gin
		moment.lang('fr');
		var dateEnd = moment().add('days', 1);
		var dateBefore = moment().subtract('days', 15);

		//affichage de base
		var html = '<div class="moduleHeader">' + 
						'<h2>Facebook ' + fields.pageName + '</h2>' + 
						'<a target="_blank" href="https://www.facebook.com/' + fields.pageName + '">https://www.facebook.com/' + fields.pageName + '</a>' +
						'<div style="clear: right;"></div>' +
					'</div>' +
					'<div class="facebookLegend">' +
						'<div class="facebookLegendItem" style="background-color: rgba(164, 138, 212, 0.5);"></div> Likes ' +
						'<div class="facebookLegendItem" style="background-color: rgba(0,135,147,.3);"></div> Shares' +
					'</div>' +
					'<h2 style="margin-top: 15px;">Nouveaux "J\'aime" et partages</h2>' +
					'<div id="graphNewLikesAndShares' + connectorId + '" style="min-width: 600px; height: 200px;"></div>' + 
					'<div class="facebookLegend">' +
						'<div class="facebookLegendItem" style="background-color: rgba(164, 138, 212, 0.5);"></div> Likes ' +
						'<div class="facebookLegendItem" style="background-color: rgba(0,135,147,.3);"></div> Shares' +
					'</div>' +
					'<h2>Total des "J\'aime" et partages</h2>' +
					'<div id="graphTotalLikesAndShares' + connectorId + '" style="min-width: 600px; height: 200px;"></div>' + 
					'<div class="moduleSeparator"></div>' +
					'<table class="facebookBottomTable">' + 
						'<tr>' + 
							'<td style="width: 50%; vertical-align: top; border-right: 10px solid #eeeeee;">' + 
								'<div class="facebookLegend" style="font-size: 0.8em;">' +
									'<div class="facebookLegendItem" style="background-color: rgba(164, 138, 212, 0.8); border-radius: 5px;"></div> Post' +
								'</div>' +
								'<h2>Posts et importance</h2>' +
								'<div id="graphHotPosts' + connectorId + '" style="height: 400px;"></div>' +
							'</td>' + 
							'<td style="vertical-align: top">' + 
								'<h2>Derniers posts</h2>' +
								'<div id="lastPosts' + connectorId + '"></div>' +
							'</td>' + 
						'</tr>' + 
					'</table>';
		$('#connectorData' + connectorId).html(html);

		self.getLikesAndShares(dateBefore, dateEnd);
		self.getLastPosts();
		self.getHotPosts(dateBefore, dateEnd);
	}

	/*****************************
	*	AFFICHAGE GRAPHIQUES LIKES AND SHARES
	*****************************/
	this.getLikesAndShares = function(dateBefore, dateEnd, connectorId) {
		get(Ajax).send('user/competitors/modules/get', {"connector_id": self.connectorId, 
														"moduleName": "facebook", 
														"where": {
															type: {
																type: "string",
																condition: {"$eq": "info_page"}
															},
															date: {
																type: "date",
																condition: {"$gt": new Date(dateBefore), "$lt": new Date(dateEnd)}
															}
														},
														"options": {"sort": {"date": 1}}},
		function(data) {
			self.displayLikesAndShares(dateBefore, dateEnd, data.data);
		});
	}

	/**
	*	Affichage des graphiques avec les likes et shares
	*/
	this.displayLikesAndShares = function(dateBefore, dateEnd, data) {
		var newLikes = [];
		var newShares = [];
		var totalLikes = [];
		var totalShares = [];


		var j = 0;
		//pour toutes les dates sur 15 jours
		while (dateBefore.format('MM/DD/YYYY') != dateEnd.format('MM/DD/YYYY')) { 
			if (j != 0) { //la premiere valeur n'est la que pour le calcul des nouveaux likes et shared
				var totalData = self.getData(dateBefore, data);
				newLikes.push({x: j, label: dateBefore.format('MM/DD/YYYY'), y: totalData.newLikes});
				newShares.push({x: j, label: dateBefore.format('MM/DD/YYYY'), y: totalData.newShared});
				totalLikes.push({x: j, label: dateBefore.format('MM/DD/YYYY'), y: totalData.totalLikes});
				totalShares.push({x: j, label: dateBefore.format('MM/DD/YYYY'), y: totalData.totalShared});
			}
			dateBefore.add('days', 1);
			j++;
		}

		var axisX = {tickColor: "#cccccc", tickLength: 3, tickThickness: 1, lineThickness: 1, interlacedColor: "#fafafa", labelFontSize: 10};
		var axisY = {minimum: 0, tickColor: "#cccccc", tickThickness: 0, lineThickness: 1, gridThickness: 0, labelFontSize: 10};

		//affichage du graphique total
		var chart = new CanvasJS.Chart("graphTotalLikesAndShares" + self.connectorId, {
			toolTip: {
				shared: true,
				borderColor: '#cccccc',
				content: function(e) {
					var ratio = (e.entries[1].dataPoint.y / e.entries[0].dataPoint.y * 100).toFixed(2);
					if (e.entries[0].dataPoint.y == 0) {
						ratio = 0;
					}
					return e.entries[0].dataPoint.label + "<br />" + ratio + "% en parlent<br />Likes : " + e.entries[0].dataPoint.y + "<br />Shares : " + e.entries[1].dataPoint.y;
				}
			}, 
			axisX: axisX, 
			axisY: axisY, 
			data: [   
		        { 
		        	type: "area",
		        	markerType: "square",
		        	color: "rgba(164, 138, 212, 0.5)",
		        	dataPoints: totalLikes
		       	},
		       	{
		       	    type: "area",
		        	color: "rgba(0,135,147,.3)",
		        	markerType: "square",
		        	dataPoints: totalShares       
		       	}]
	     	}
	     );


	    chart.render();

	    //affichage du graphique new
		var chart2 = new CanvasJS.Chart("graphNewLikesAndShares" + self.connectorId, {
			axisX: axisX, axisY: axisY, axisY2: {minimum: 0, tickColor: "#cccccc", tickThickness: 0, lineThickness: 1, gridThickness: 0, labelFontSize: 10}, 
			data: [   
		        { 
		        	type: "area",
		        	markerType: "square",
		        	color: "rgba(164, 138, 212, 0.5)",
		        	dataPoints: newLikes
		       	},
		       	{
		       	    type: "area",
		       	    axisYType: "secondary",
		        	color: "rgba(0,135,147,.3)",
		        	markerType: "square",
		        	dataPoints: newShares       
		       	}]
	     	}
	     );

	    chart2.render();
	}

	/**
	*	Retourne le nombre de nouveaux likes/shares et totaux pour une date
	*/
	this.getData = function(date, data) {
		var i = 0; 
		while (i < data.length && date.format('MM/DD/YYYY') != moment(data[i].date).format('MM/DD/YYYY')) {
			i++;
		}
		if (i < data.length) {
			var newLikes = 0;
			var newShared = 0;
			if (i > 0) {
				var newLikes = data[i].info.fans - data[i - 1].info.fans;
				if (newLikes < 0) {
					newLikes = 0;
				}
				var newShared = data[i].info.shared - data[i - 1].info.shared;
				if (newShared < 0) {
					newShared = 0;
				}
			}
			return {
				'totalShared': data[i].info.shared,
				'totalLikes': data[i].info.fans,
				'newLikes': newLikes,
				'newShared': newShared,
			};
		} else {
			return {
				'totalShared': 0,
				'totalLikes': 0,
				'newLikes': 0,
				'newShared': 0
			};
		}
	}

	/********************************
	*	AFFICHAGE LISTE DES DERNIERS POSTS
	********************************/
	this.getLastPosts = function() {
		get(Ajax).send('user/competitors/modules/get', {"connector_id": self.connectorId, 
														"moduleName": "facebook", 
														"where": {
															type: {
																type: "string",
																condition: {"$eq": "post"}
															}
														},
														"options": {"sort": {"info.created_time": -1}, "limit": 25}},
		function(data) {
			self.displayLastPosts(data.data);
		});
	}

	this.displayLastPosts = function(data) {
		var html = '<div class="facebookLastPostsDiv"><table class="facebookLastPosts">';
		var lineClass;
		for (var i = 0; i < data.length; i++) {
			if (i % 2 == 0) {
				lineClass = 'facebookPostGreyLine ';
			} else {
				lineClass = '';
			}
			html += '<tr class="' + lineClass + 'facebookLastPostsTr facebookLastPostsTr' + self.connectorId + '" post-id="' + data[i].info.id + '">' + 
						'<td class="facebookPostDate">' + moment(data[i].info.created_time).format('MM/DD/YYYY') + '<br />' +
						'<span class="facebookPostTime">' + moment(data[i].info.created_time).format('HH[h]mm') + '</td>' +
						'<td class="facebookPostType"><img title="' + data[i].info.type + '" src="front/client/design/pictures/';
			if (data[i].info.type == "link") {
				html += 'facebookLink.png';
			} else if (data[i].info.type == "video") {
				html += 'facebookVideo.png';
			} else if (data[i].info.type == "photo") {
				html += 'facebookPicture.png';
			} else {
				html += 'facebookStatus.png';
			}
			html +=		'"/></td>' + 
						'<td class="facebookPostContent">' + data[i].info.message + '</td>' +
						'<td class="facebookPostLikes"><img src="front/client/design/pictures/like.png"/> ' + data[i].info.likes + '</td>' +
						'<td class="facebookPostComments"><img src="front/client/design/pictures/comment.png"/> ' + data[i].info.comments + '</td>' +
						'<td class="facebookPostShares"><img src="front/client/design/pictures/share.png"/> ' + data[i].info.shares + '</td>' +
					'</tr>';
		}
		html += '</table></div>';
		$('#lastPosts' + self.connectorId).html(html);
		$('.facebookLastPostsTr' + self.connectorId).click(function() {
			self.getPost($(this).attr('post-id'));
		});
	}

	/********************************
	*	AFFICHAGE POSTS PAR IMPORTANCE
	********************************/
	this.getHotPosts = function(dateBefore, dateEnd) {
		get(Ajax).send('user/competitors/modules/get', {"connector_id": self.connectorId,
														"moduleName": "facebook",
														"where": {
															type: {
																type: "string", 
																condition: {"$eq": "post"}
															}
														},
														"options": {}}, 
		function(data) {
			self.displayHotPosts(data.data);
		});
	}
	
	this.displayHotPosts = function(data) {
		var posts = [];
		for(var i = 0; i < data.length; i++) {			
			posts.push({x: new Date(data[i].info.created_time), y: data[i].info.comments, z: data[i].info.likes, id: data[i].info.id});
		}

		var axisX = {tickColor: "#cccccc", tickLength: 3, tickThickness: 1, lineThickness: 1, interlacedColor: "#fafafa", valueFormatString: "MM/DD/YYYY", labelFontSize: 10};
		var axisY = {minimum: 0, tickColor: "#cccccc", tickThickness: 0, lineThickness: 1, gridThickness: 1, labelFontSize: 10};
		
		var chart = new CanvasJS.Chart("graphHotPosts" + self.connectorId, {	
			zoomEnabled: true,
			axisX: axisX, axisY: axisY,
		    data: [{
				type: "bubble",
		        dataPoints: posts,
		        color: "rgba(164, 138, 212, 0.8)",
				toolTipContent: "Cliquez pour voir le message<br />{y} comments<br />{z} likes",
				click: function(e){
			   		self.getPost(e.dataPoint.id);
			 	}
		    }]
	     });

	    chart.render();
	}

	/**********************************
	*	AFFICHAGE D'UN POST EN PARTICULIER
	**********************************/
	this.getPost = function(postId) {
		get(Window).create("Voir un post", get(Animations).getLoaderDiv(), 600);
		get(Ajax).send('user/competitors/modules/get', {"connector_id": self.connectorId, 
														"moduleName": "facebook", 
														"where": {
															type: {
																type: "string",
																condition: {"$eq": "post"}
															},
															"info.id": {
																type: "string",
																condition: {"$eq": postId}
															}
														},
														"options": {}},
		function(data) {
			self.displayPost(data.data);
		});
	}
	this.displayPost = function(data) {
		var html = '<div class="facebookPostPopupContent">';
		if (data[0].info.type == "link") {
			html += 'Lien : <a target="_blank" href="' + data[0].info.link + '">' + data[0].info.link + '</a><br /><br />';
		} else if (data[0].info.type == "photo") {
			html += '<img style="max-width: 200px; max-height: 200px; float: left; margin-right: 10px; margin-bottom: 5px;" src="' + data[0].info.picture + '"/>' +
					'<a target="_blank" href="' + data[0].info.link + '">' + data[0].info.link + '</a><br />';
		} else if (data[0].info.type == "video") {
			html += 'Vidéo : <a target="_blank" href="' + data[0].info.link + '">' + data[0].info.link + '</a><br /><br />';
		}
		html +=			data[0].info.message + 
					'</div>' + 
					'<div style="clear: left;"></div>' +
					'<div class="facebookPostPopupMeta">' +
						'<div style="float: right;">' + 
							'<img src="front/client/design/pictures/like.png"/> ' + data[0].info.likes + 
							' &middot <img src="front/client/design/pictures/comment.png"/> ' + data[0].info.comments +
							' &middot <img src="front/client/design/pictures/share.png"/> ' + data[0].info.shares +
						'</div>' +
						'Publié le ' + moment(data[0].info.created_time).format('MM/DD/YYYY à HH[h]mm') +   
					'</div>';
		get(Window).content(html);
	}
}