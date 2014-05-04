function Main() {

	this.init = function() {
		get(Routes).init();
		get(UserController).init(function(result) {
			if (result == 1) {
				get(DashboardController).init(function() {

				});
			} else {
				get(Routes).goTo('#!/connexion');
			}
		});
	}

}

$(window).load(function() {
	get(Main).init();
});