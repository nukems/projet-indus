function Main() {

	this.init = function() {
		get(Routes).init();
		get(UserController).init(function(result) {
			if (result == 1) {
				
			} else {
				get(Routes).goTo('#!/connexion');
			}
		});
	}

}

$(window).load(function() {
	get(Main).init();
});