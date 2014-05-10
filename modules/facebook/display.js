function facebook() {

	var self = this;

	this.connectorId = null;

	this.sortLastPosts = {"info.created_time": -1};
	this.lastPostsType;

	this.types = ["status", "link", "photo", "video"];

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
		var html = '<div class="moduleHeader" style="background-color: #3b5998;">' + 
						'<h2>Facebook ' + fields.displayName + '</h2>' + 
						'<a target="_blank" href="https://www.facebook.com/' + fields.pageName + '">https://www.facebook.com/' + fields.pageName + '</a>' +
						'<div style="clear: right;"></div>' +
					'</div>' +
					'<div class="facebookLegend">' +
						'<div class="facebookLegendItem" style="background-color: rgba(59, 89, 152, 0.3);"></div> Likes ' +
						'<div class="facebookLegendItem" style="background-color: rgba(0,135,147,.3);"></div> Shares' +
					'</div>' +
					'<h2 style="margin-top: 15px;">Nouveaux "J\'aime" et partages</h2>' +
					'<div id="graphNewLikesAndShares' + connectorId + '" style="min-width: 600px; height: 200px;"></div>' +
					'<div class="facebookLegend">' +
						'<div class="facebookLegendItem" style="background-color: rgba(59, 89, 152, 0.3);"></div> Likes ' +
						'<div class="facebookLegendItem" style="background-color: rgba(0,135,147,.3);"></div> Shares' +
					'</div>' +
					'<h2>Total des "J\'aime" et partages</h2>' +
					'<div id="graphTotalLikesAndShares' + connectorId + '" style="min-width: 600px; height: 200px;"></div>' +
					'<div class="moduleSeparator"></div>' +
					'<table class="facebookBottomTable">' +
						'<tr>' +
							'<td style="width: 50%; vertical-align: top; border-right: 10px solid #eeeeee;">' +
								'<div class="facebookLegend" style="font-size: 0.8em;">' +
									'<div class="facebookLegendItem" style="background-color: #3b5998; border-radius: 5px;"></div> Post' +
								'</div>' +
								'<h2>Posts et importance</h2>' +
								'<div id="graphHotPosts' + connectorId + '" style="height: 430px;"></div>' +
							'</td>' + 
							'<td style="vertical-align: top">' + 
								'<h2>Derniers posts</h2>' +
								'<div id="lastPosts' + connectorId + '"></div>' +
							'</td>' +
						'</tr>' +
					'</table>' + 
					'<div class="facebookCloud">' + 
						'<h2>Nuage de mots</h2>' +
						'<div id="facebookCloud' + connectorId + '"></div>' +
					'</div>';
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
			axisY: axisY, axisY2: {minimum: 0, tickColor: "#cccccc", tickThickness: 0, lineThickness: 1, gridThickness: 0, labelFontSize: 10},
			data: [
		        {
		        	type: "area",
		        	markerType: "square",
		        	color: "rgba(59, 89, 152, 0.3)",
		        	dataPoints: totalLikes
		       	},
		       	{
		       	    type: "area",
		       	    axisYType: "secondary",
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
		        	color: "rgba(59, 89, 152, 0.3)",
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
		var where = {
			type: {
				type: "string",
				condition: {"$eq": "post"}
			}
		};
		if (self.lastPostsType != null) {
			where['info.type'] = {
				type: "string",
				condition: {"$eq": self.lastPostsType}
			};
		}
		get(Ajax).send('user/competitors/modules/get', {"connector_id": self.connectorId, 
														"moduleName": "facebook", 
														"where": where,
														"options": {"sort": self.sortLastPosts, "limit": 25}},
		function(data) {
			self.displayLastPosts(data.data);
			self.getCloudWords(data.data);
		});
	}

	this.displayLastPosts = function(data) {
		var selected = [];
		for (var i in self.types) {
			if (self.lastPostsType == self.types[i]) {
				selected[self.types[i]] = 'selected';
			} else {
				selected[self.types[i]] = '';
			}
		}
		var html =  '<table class="facebookLastPosts" style="margin-bottom: 1px;">' + 
						'<tr class="facebookLastPostsTr">' + 
							'<th colspan="2">' + 
								'Afficher : ' + 
								'<select id="changeFacebookLastPostsType">' + 
									'<option value="">Tout</option>' + 
									'<option value="status" ' + selected["status"] + '>Statuts</option>' + 
									'<option value="link" ' + selected["link"] + '>Liens</option>' +
									'<option value="photo" ' + selected["photo"] + '>Images</option>' + 
									'<option value="video" ' + selected["video"] + '>Vidéos</option>' + 
								'</select>' +  
							'</th>' + 
							'<th class="facebookPostLikes">' + 
								'<img class="sortFacebookPosts" type="info.likes" sort="-1" src="front/client/design/pictures/arrowDown.png"/>' +
								'<img class="sortFacebookPosts" type="info.likes" sort="1" src="front/client/design/pictures/arrowUp.png"/>' +
							'</th>' + 
							'<th class="facebookPostComments">' + 
								'<img class="sortFacebookPosts" type="info.comments" sort="-1" src="front/client/design/pictures/arrowDown.png"/>' +
								'<img class="sortFacebookPosts" type="info.comments" sort="1" src="front/client/design/pictures/arrowUp.png"/>' +
							'</th>' + 
							'<th class="facebookPostShares" style="padding-right: 20px;">' + 
								'<img class="sortFacebookPosts" type="info.shares" sort="-1" src="front/client/design/pictures/arrowDown.png"/>' +
								'<img class="sortFacebookPosts" type="info.shares" sort="1" src="front/client/design/pictures/arrowUp.png"/>' +
							'</th>' +
						'</tr>' + 
					'</table>' +
					'<div class="facebookLastPostsDiv">' + 
					'<table class="facebookLastPosts">';
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

		//voir un post
		$('.facebookLastPostsTr' + self.connectorId).click(function() {
			self.getPost($(this).attr('post-id'));
		});
		//trier par likes, shares, comments
		$('.sortFacebookPosts').click(function() {
			var type = $(this).attr('type');
			var value = parseInt($(this).attr('sort'), 10);
			self.sortLastPosts = {};
			self.sortLastPosts[type] = value;
			self.getLastPosts();
		});
		//n'afficher qu'un type
		$('#changeFacebookLastPostsType').change(function() {
			var val = $(this).val();
			if (val == '') {
				val = null;
			}
			self.lastPostsType = val;
			self.getLastPosts();
			self.getHotPosts(null, null);
		});
	}

	/********************************
	*	AFFICHAGE POSTS PAR IMPORTANCE
	********************************/
	this.getHotPosts = function(dateBefore, dateEnd) {
		var where = {
			type: {
				type: "string",
				condition: {"$eq": "post"}
			}
		};
		if (self.lastPostsType != null) {
			where['info.type'] = {
				type: "string",
				condition: {"$eq": self.lastPostsType}
			};
		}
		get(Ajax).send('user/competitors/modules/get', {"connector_id": self.connectorId,
														"moduleName": "facebook",
														"where": where,
														"options": {"sort": self.sortLastPosts}},
		function(data) {
			self.displayHotPosts(data.data);
		});
	}

	this.displayHotPosts = function(data) {
		var posts = [];
		for(var i = 0; i < data.length; i++) {
			posts.push({x: new Date(data[i].info.created_time), y: data[i].info.comments, z: data[i].info.likes, id: data[i].info.id, date: moment(data[i].info.created_time).format('MM/DD/YYYY, HH[h]mm')});
		}

		var axisX = {tickColor: "#cccccc", tickLength: 3, tickThickness: 1, lineThickness: 1, interlacedColor: "#fafafa", valueFormatString: "MM/DD/YYYY", labelFontSize: 10};
		var axisY = {minimum: 0, tickColor: "#cccccc", tickThickness: 0, lineThickness: 1, gridThickness: 1, labelFontSize: 10};

		var chart = new CanvasJS.Chart("graphHotPosts" + self.connectorId, {
			zoomEnabled: true,
			axisX: axisX, axisY: axisY,
			toolTip: {
				animationEnabled: false
			},
		    data: [{
				type: "bubble",
		        dataPoints: posts,
		        color: "rgba(59, 89, 152, 0.8)",
				toolTipContent: "Cliquez pour voir le message<br />{date}<br />{y} comments<br />{z} likes",
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
		$('.canvasjs-chart-tooltip').css('display', 'none');
		get(Window).create("Voir un post", get(Animations).getLoaderDiv(), 800);
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
		var html = '<div class="facebookPostPopupContent">' +
						'<div style="float: left; text-align: center;">';
		if (data[0].info.type == "link") {
			html += '<img src="front/client/design/pictures/facebookLink.png" style="margin-top: 2px;"/>' +
					'</div>' +
					'<div style="padding-left: 40px;">' +
						'<a target="_blank" href="' + data[0].info.link + '">' + data[0].info.link + '</a><br />';
		} else if (data[0].info.type == "photo") {
			html += '<div style="float: left; width: 200px; text-align: center;">' +
						'<img style="max-width: 200px; max-height: 200px;" src="' + data[0].info.picture + '"/><br />' +
						'<a target="_blank" href="' + data[0].info.link + '">Taille réelle</a>' +
					'</div>' +
					'</div>' +
					'<div style="margin-left: 200px;">';
		} else if (data[0].info.type == "video") {
			html += '<img src="front/client/design/pictures/facebookVideo.png" style="margin-top: 2px;"/>' +
					'</div>' +
					'<div style="margin-left: 40px;">' +
						'<a target="_blank" href="' + data[0].info.link + '">' + data[0].info.link + '</a><br />';
		}
		html +=			self.linkify(self.nl2br(data[0].info.message, true)) +
					'</div>' +
					'<div style="clear: left;"></div>' +
					'<div class="facebookHr"></div>' +
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

	this.nl2br = function(str, is_xhtml) {
    	var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    	return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
	}
	this.linkify = function(text) {
        var urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
        return text.replace(urlRegex, function(url) {
            return '<a target="_blank" href="' + url + '">' + url + '</a>';
        });
    }

	this.getCloudWords = function(data) {
		var MIN_LENGTH = 5

		var occurrences = {};
		var message;
		var words;
		var word;
		for (var i=0; i<data.length; i++)
		{
			message = data[i].info.message;
			words = message.split(' ');
			for (var j=0; j<words.length; j++)
			{
				word = words[j];

				if (word == null || word.length < MIN_LENGTH)
					continue;

				word = this.formatWord(word);

				if (occurrences[word] == null)
					occurrences[word] = 1;
				else
					occurrences[word] = occurrences[word] + 1;
			}
		}

		var tuples = [];

		for (var key in occurrences)
			tuples.push([key, occurrences[key]]);

		tuples.sort(function(a, b) {
			a = a[1];
			b = b[1];

			return a < b ? -1 : (a > b ? 1 : 0);
		});

		var html = '';
		if(tuples.length > 0) {
			var maxValue = tuples[tuples.length - 1][1];
			for (var i = tuples.length - 1; i > tuples.length - 10; i--) {
				var key = tuples[i][0];
				var value = tuples[i][1];
				html += '<span class="facebookCloudWord" style="font-size: ' + (value / maxValue * 30) + 'px;">' + key + '</span> ';
			}
		} else {
			html += 'Aucun mot trouvé';
		}
		$('#facebookCloud' + self.connectorId).html(html);
	}

	this.formatWord = function(word) {
		word = word.toLowerCase();
		word = word.replace('â', 'a');
		word = word.replace('à', 'a');
		word = word.replace('é', 'e');
		word = word.replace('è', 'e');
		word = word.replace('ê', 'e');
		word = word.replace('ë', 'e');
		word = word.replace('î', 'i');
		word = word.replace('ï', 'i');
		word = word.replace('ô', 'o');
		word = word.replace('ö', 'o');
		word = word.replace('û', 'u');
		word = word.replace('ù', 'u');
		word = word.replace('"', '');
		word = word.replace("'", '');
		return word;
	}

}