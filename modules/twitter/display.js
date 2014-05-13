function twitter() {

	var self = this;

	this.connectorId = null;

	this.sortLastTweets = {"info.created_time": -1};

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
		var html = '<div class="moduleHeader" style="background-color: #00c0f7;">' + 
						'<h2>Twitter ' + fields.displayName + '</h2>' + 
						'<a target="_blank" style="color: #eeeeee;" href="https://twitter.com/' + fields.pageName + '">https://twitter.com/' + fields.pageName + '</a>' +
						'<div style="clear: right;"></div>' +
					'</div>' +
					'<div id="twitterNotifications' + connectorId + '"></div>' +
					'<div style="background-color: white; margin: 0px -10px; padding: 10px;">' +
						'<div class="twitterLegend">' +
							'<div class="twitterLegendItem" style="background-color: rgba(0, 192, 247, 0.3);"></div> Tweets ' +
							'<div class="twitterLegendItem" style="background-color: rgba(83, 145, 127, 0.3);"></div> Followers' +
						'</div>' +
						'<h2 style="margin-top: 15px;">Nouveaux Tweets et Followers</h2>' +
						'<div id="graphNewTweetsAndFollowers' + connectorId + '" style="min-width: 600px; height: 200px;"></div>' +
						'<div class="twitterLegend">' +
							'<div class="twitterLegendItem" style="background-color: rgba(0, 192, 247, 0.3);"></div> Tweets ' +
							'<div class="twitterLegendItem" style="background-color: rgba(83, 145, 127, 0.3);"></div> Followers' +
						'</div>' +
						'<h2>Total des Tweets et Followers</h2>' +
						'<div id="graphTotalTweetsAndFollowers' + connectorId + '" style="min-width: 600px; height: 200px;"></div>' +
					'</div>' +
					'<div style="margin: 0px -10px;">' + 
						'<table class="twitterBottomTable">' +
							'<tr>' +
								'<td style="width: 50%; vertical-align: top; background-color: white;">' +
									'<div class="twitterLegend" style="font-size: 0.8em;">' +
										'<div class="twitterLegendItem" style="background-color: rgba(0, 192, 247, 0.3); border-radius: 5px;"></div> Tweet' +
									'</div>' +
									'<h2>Tweets et importance</h2>' +
									'<div id="graphHotTweets' + connectorId + '" style="height: 430px;"></div>' +
								'</td>' + 
								'<td style="vertical-align: top">' + 
									'<div style="background-color: white; margin: -10px -10px -10px 0px; padding: 10px;">' + 
										'<h2>Derniers tweets</h2>' +
										'<div id="lastTweets' + connectorId + '"></div>' +
									'</div>' +
								'</td>' +
							'</tr>' +
						'</table>' + 
					"</div>" +
					'<div class="twitterCloud">' + 
						'<h2>Nuage de mots</h2>' +
						'<div id="twitterCloud' + connectorId + '"></div>' +
					'</div>';
		$('#connectorData' + connectorId).html(html);

		self.getTweetsAndFollowers(dateBefore, dateEnd);
		self.getLastTweets();
		self.getHotTweets(dateBefore, dateEnd);
	}

	/*****************************
	*	AFFICHAGE GRAPHIQUES TWEETS AND FOLLOWERS
	*****************************/
	this.getTweetsAndFollowers = function(dateBefore, dateEnd) {
		get(Ajax).send('user/competitors/modules/get', {"connector_id": self.connectorId,
														"moduleName": "twitter",
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
			self.displayTweetsAndFollowers(dateBefore, dateEnd, data.data);
		});
	}

	/**
	*	Affichage des graphiques avec les likes et shares
	*/
	this.displayTweetsAndFollowers = function(dateBefore, dateEnd, data) {
		var newTweets = [];
		var newFollowers = [];
		var totalTweets = [];
		var totalFollowers = [];

		var j = 0;
		//pour toutes les dates sur 15 jours
		while (dateBefore.format('MM/DD/YYYY') != dateEnd.format('MM/DD/YYYY')) {
			if (j != 0) { //la premiere valeur n'est la que pour le calcul des nouveaux likes et shared
				var totalData = self.getData(dateBefore, data);
				newTweets.push({x: j, label: dateBefore.format('MM/DD/YYYY'), y: totalData.newTweets});
				newFollowers.push({x: j, label: dateBefore.format('MM/DD/YYYY'), y: totalData.newFollowers});
				totalTweets.push({x: j, label: dateBefore.format('MM/DD/YYYY'), y: totalData.totalTweets});
				totalFollowers.push({x: j, label: dateBefore.format('MM/DD/YYYY'), y: totalData.totalFollowers});
			}
			dateBefore.add('days', 1);
			j++;
		}

		var axisX = {tickColor: "#cccccc", tickLength: 3, tickThickness: 1, lineThickness: 1, interlacedColor: "#fafafa", labelFontSize: 10};
		var axisY = {minimum: 0, tickColor: "#cccccc", tickThickness: 0, lineThickness: 1, gridThickness: 0, labelFontSize: 10};

		//affichage du graphique total
		var chart = new CanvasJS.Chart("graphTotalTweetsAndFollowers" + self.connectorId, {
			toolTip: {
				shared: true,
				borderColor: '#cccccc',
				content: function(e) {
					var ratio = (e.entries[1].dataPoint.y / e.entries[0].dataPoint.y * 100).toFixed(2);
					if (e.entries[0].dataPoint.y == 0) {
						ratio = 0;
					}
					return e.entries[0].dataPoint.label + "<br />Tweets : " + e.entries[0].dataPoint.y + "<br />Followers : " + e.entries[1].dataPoint.y;
				}
			},
			axisX: axisX,
			axisY: axisY, axisY2: {minimum: 0, tickColor: "#cccccc", tickThickness: 0, lineThickness: 1, gridThickness: 0, labelFontSize: 10},
			data: [
		        {
		        	type: "area",
		        	markerType: "square",
		        	color: "rgba(0, 192, 247, 0.3)",
		        	dataPoints: totalTweets
		       	},
		       	{
		       	    type: "area",
		       	    axisYType: "secondary",
		        	color: "rgba(83, 145, 127, 0.3)",
		        	markerType: "square",
		        	dataPoints: totalFollowers
		       	}]
	     	}
	     );


	    chart.render();

	    //affichage du graphique new
		var chart2 = new CanvasJS.Chart("graphNewTweetsAndFollowers" + self.connectorId, {
			axisX: axisX, axisY: axisY, axisY2: {minimum: 0, tickColor: "#cccccc", tickThickness: 0, lineThickness: 1, gridThickness: 0, labelFontSize: 10},
			data: [
		        {
		        	type: "area",
		        	markerType: "square",
		        	color: "rgba(0, 192, 247, 0.3)",
		        	dataPoints: newTweets
		       	},
		       	{
		       	    type: "area",
		       	    axisYType: "secondary",
		        	color: "rgba(83, 145, 127, 0.3)",
		        	markerType: "square",
		        	dataPoints: newFollowers
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
			var newTweets = 0;
			var newFollowers = 0;
			if (i > 0) {
				var newTweets = data[i].info.tweets - data[i - 1].info.tweets;
				if (newTweets < 0) {
					newTweets = 0;
				}
				var newFollowers = data[i].info.followers - data[i - 1].info.followers;
				if (newFollowers < 0) {
					newFollowers = 0;
				}
			}
			return {
				'totalFollowers': data[i].info.followers,
				'totalTweets': data[i].info.tweets,
				'newTweets': newTweets,
				'newFollowers': newFollowers,
			};
		} else {
			return {
				'totalFollowers': 0,
				'totalTweets': 0,
				'newTweets': 0,
				'newFollowers': 0
			};
		}
	}

	/********************************
	*	AFFICHAGE LISTE DES DERNIERS TWEETS
	********************************/
	this.getLastTweets = function() {
		get(Ajax).send('user/competitors/modules/get', {"connector_id": self.connectorId, 
														"moduleName": "twitter", 
														"where": {
															type: {
																type: "string",
																condition: {"$eq": "tweet"}
															}
														},
														"options": {"sort": self.sortLastTweets, "limit": 25}},
		function(data) {
			self.displayLastTweets(data.data);
			self.getCloudWords(data.data);
		});
	}

	this.displayLastTweets = function(data) {
		var html =  '<table class="twitterLastTweets" style="margin-bottom: 1px;">' + 
						'<tr class="twitterLastTweetsTr">' + 
							'<th colspan="2">' + 
							'</th>' + 
							'<th class="twitterTweetFavorites">' + 
								'<img class="sortTwitterTweets" type="info.favorite" sort="-1" src="front/client/design/pictures/arrowDown.png"/>' +
								'<img class="sortTwitterTweets" type="info.favorite" sort="1" src="front/client/design/pictures/arrowUp.png"/>' +
							'</th>' + 
							'<th class="twitterTweetRetweets">' + 
								'<img class="sortTwitterTweets" type="info.retweet" sort="-1" src="front/client/design/pictures/arrowDown.png"/>' +
								'<img class="sortTwitterTweets" type="info.retweet" sort="1" src="front/client/design/pictures/arrowUp.png"/>' +
							'</th>' +
						'</tr>' + 
					'</table>' +
					'<div class="twitterLastTweetsDiv">' + 
					'<table class="twitterLastTweets">';
		var newTweets = 0;
		var lineClass, notification;
		for (var i = 0; i < data.length; i++) {
			lineClass = '';
			notification = '';
			if (i % 2 == 0) {
				lineClass = 'twitterTweetGreyLine ';
			}
			if (data[i].notification == 1) {
				newTweets++;
				notification = ' style="background-color: #efe7b2;"';
			}
			html += '<tr class="' + lineClass + 'twitterLastTweetsTr twitterLastTweetsTr' + self.connectorId + '" post-id="' + data[i].info.id + '" ' + notification + '>' +
						'<td class="twitterTweetDate">' + moment(data[i].info.created_time).format('MM/DD/YYYY') + '<br />' +
						'<span class="twitterTweetTime">' + moment(data[i].info.created_time).format('HH[h]mm') + '</td>' +
						'<td class="twitterTweetContent">' + data[i].info.message + '</td>' +
						'<td class="twitterTweetFavorites"><img class="twitterIcon" src="front/client/design/pictures/favorite.png"/> ' + data[i].info.favorite + '</td>' +
						'<td class="twitterTweetRetweets"><img class="twitterIcon" src="front/client/design/pictures/retweet.png"/> ' + data[i].info.retweet + '</td>' +
					'</tr>';
		}
		html += '</table></div>';
		$('#lastTweets' + self.connectorId).html(html);
		if (newTweets > 0) {
			$('#twitterNotifications' + self.connectorId).html('<div class="twitterNotificationsContent"><img src="front/client/design/pictures/bell.png"/> Il y a ' + newTweets + ' nouveaux tweets</div>');
			$('#goToConnector' + self.connectorId + ' .notificationItem').html(newTweets).show();
		}

		//voir un post
		$('.twitterLastTweetsTr' + self.connectorId).click(function() {
			self.getTweet($(this).attr('post-id'));
		});
		//trier par likes, shares, comments
		$('.sortTwitterTweets').click(function() {
			var type = $(this).attr('type');
			var value = parseInt($(this).attr('sort'), 10);
			self.sortLastTweets = {};
			self.sortLastTweets[type] = value;
			self.getLastTweets();
		});
	}

	/********************************
	*	AFFICHAGE TWEETS PAR IMPORTANCE
	********************************/
	this.getHotTweets = function(dateBefore, dateEnd) {
		get(Ajax).send('user/competitors/modules/get', {"connector_id": self.connectorId,
														"moduleName": "twitter",
														"where": {
															type: {
																type: "string",
																condition: {"$eq": "tweet"}
															}
														},
														"options": {"sort": self.sortLastTweets}},
		function(data) {
			self.displayHotTweets(data.data);
		});
	}

	this.displayHotTweets = function(data) {
		var tweets = [];
		for(var i = 0; i < data.length; i++) {
			tweets.push({x: new Date(data[i].info.created_time), y: data[i].info.retweet, z: data[i].info.favorite, id: data[i].info.id, date: moment(data[i].info.created_time).format('MM/DD/YYYY, HH[h]mm')});
		}
		var axisX = {tickColor: "#cccccc", tickLength: 3, tickThickness: 1, lineThickness: 1, interlacedColor: "#fafafa", valueFormatString: "MM/DD/YYYY", labelFontSize: 10};
		var axisY = {minimum: 0, tickColor: "#cccccc", tickThickness: 0, lineThickness: 1, gridThickness: 1, labelFontSize: 10};

		var chart = new CanvasJS.Chart("graphHotTweets" + self.connectorId, {
			zoomEnabled: true,
			axisX: axisX, axisY: axisY,
			toolTip: {
				animationEnabled: false
			},
		    data: [{
				type: "bubble",
		        dataPoints: tweets,
		        color: "rgba(0, 192, 247, 0.3)",
				toolTipContent: "Cliquez pour voir le tweet<br />{date}<br />{y} retweets<br />{z} favorites",
				click: function(e){
			   		self.getTweet(e.dataPoint.id);
			 	}
		    }]
	     });

	    chart.render();
	}

	/**********************************
	*	AFFICHAGE D'UN TWEET EN PARTICULIER
	**********************************/
	this.getTweet = function(postId) {
		$('.canvasjs-chart-tooltip').css('display', 'none');
		get(Window).create("Voir un tweet", get(Animations).getLoaderDiv(), 800);
		get(Ajax).send('user/competitors/modules/get', {"connector_id": self.connectorId,
														"moduleName": "twitter",
														"where": {
															type: {
																type: "string",
																condition: {"$eq": "tweet"}
															},
															"info.id": {
																type: "string",
																condition: {"$eq": postId}
															}
														},
														"options": {}},
		function(data) {
			self.displayTweet(data.data);
		});
	}
	this.displayTweet = function(data) {
		var html = '<div class="twitterTweetPopupContent">' +
					self.linkify(self.nl2br(data[0].info.message, true)) +
					'</div>' +
					'<div class="twitterHr"></div>' +
					'<div class="twitterTweetPopupMeta">' +
						'<div style="float: right;">' +
							'<img src="front/client/design/pictures/favorite.png" class="twitterIcon"/> ' + data[0].info.favorite +
							' &middot <img src="front/client/design/pictures/retweet.png" class="twitterIcon"/> ' + data[0].info.retweet +
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
		var MAX_LENGTH = 15;

		var occurrences = {};
		var message;
		var words;
		var word;
		for (var i=0; i<data.length; i++)
		{
			message = data[i].info.message;
			words = message.split(/\s/);
			for (var j=0; j<words.length; j++)
			{
				word = this.formatWord(words[j]);
				if (word == null || word.length < MIN_LENGTH || word.length > MAX_LENGTH)
					continue;

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
				console.log(key + " " + key.length);
				html += '<span class="twitterCloudWord" style="font-size: ' + (value / maxValue * 30) + 'px;">' + key + '</span> ';
			}
		} else {
			html += 'Aucun mot trouvé';
		}
		$('#twitterCloud' + self.connectorId).html(html);
	}

	this.formatWord = function(word) {
		word = self.decodeHtml(word);
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
		word = word.replace(".", '');
		word = word.replace(",", '');
		word = word.replace(":", '');
		word = word.replace(";", '');
		word = word.replace("!", '');
		word = word.replace("?", '');
		word = word.replace("(", '');
		word = word.replace(")", '');
		word = word.replace("=", '');
		word = word.replace(">", '');
		word = word.replace("<", '');
		return word;
	}

	this.decodeHtml = function(a) {
		return a.replace(/&([^;]+);/g, function(a, c) {
			switch (c) {
				case "amp":
					return "&";
				case "lt":
					return "<";
				case "gt":
					return ">";
				case "quot":
					return '"';
				default:
					if ("#" == c.charAt(0)) {
						var d = Number("0" + c.substr(1));
						if (!isNaN(d)) return String.fromCharCode(d)
					}
					return a;
			}
		});
	}

}