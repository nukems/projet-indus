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

	this.getName = function() {
		return this.name;
	}
	this.setName = function(name) {
		this.name = name;
	}

	this.getFirstName = function() {
		return this.firstName;
	}
	this.setFirstName = function(firstName) {
		this.firstName = firstName;
	}

}