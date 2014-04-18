/**
*	Point d'entree de l'execution de ton module
*/
function execute(callback) {
	console.log("execution du module facebook");
	//exemple d'appel de fnction d'un module de core
	InstancesController.getInstance("Core_Example").test();
	//on appelle TOUJOURS le callback a la fin de l'execution du module pour terminer la requete
	callback();
}

exports.execute = execute;