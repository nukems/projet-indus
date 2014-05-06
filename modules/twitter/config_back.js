var config = {
	"type" : [
		{
			"name" : "info_page",
			"fields" : [
				"followers", "tweets"
			]
		},
		{
			"name" : "tweet",
			"fields" : [
				"message", "retweet", "id", "created_time", "favorite"
			]
		}
	]
}

exports.config = config;