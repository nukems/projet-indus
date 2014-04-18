var instances = [];

function get(name) {
	if (!instances[name]) {
		instances[name] = new name();
	}
	return instances[name];
}