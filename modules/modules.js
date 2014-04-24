var modules = {
	'facebook': {
		'name': 'Connecteur facebook',
		'description': "Ce connecteur permet l'analyse des mentions \"j'aime\" et partages de la page, ainsi que l'analyse des posts de la page", 
		'folderUrl': 'facebook',
		'fields': {
			'pageName': {
				'type': 'string',
				'name': 'Nom de la page',
				'description': 'Nom de la page disponible depuis l\'url'
			}
		}
	}
};

exports.modules = modules;