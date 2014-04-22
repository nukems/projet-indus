function Main() {

	this.init = function() {
		get(Routes).init();
		get(UserController).init();
	}

}

$(window).load(function() {
	get(Main).init();
});