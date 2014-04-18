function Core_Example() {

	/**
	*	Voici un exemple de comment executer une requete sur une collection "test"
	*/
	this.test = function() {
		var databaseInstance = InstancesController.getInstance("Core_Database");
		var collectionTest = databaseInstance.getCollection("test");
		collectionTest.find().toArray(function(err, items) {
			console.log(items);
			//etc.
		});
	}
}

exports.controller = Core_Example;

//pour obtenir une instance de cette classe:
// var instanceDeExample = InstancesController.getInstance("Core_Example");