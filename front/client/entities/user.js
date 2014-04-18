function User() {

	this.token = null;

	this.name;
	this.firstName;

	/**
	*	Retourne vrai si l'utilisateur est connecte, faux sinon
	*/
	this.isLogged = function() {
		return this.getToken() != null;
	}

	/**
	*	GETTERS et SETTERS
	*/
	this.getToken = function() {
		return this.token;
	}
	this.setToken = function(token) {
		this.token = token;
	}

}