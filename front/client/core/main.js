function Main() {

	this.init = function() {
		get(Routes).init();
		
	}

}

$(window).load(function() {
	get(Main).init();
});