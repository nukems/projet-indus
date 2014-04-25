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
			},
			'pageName1': {
				'type': 'string',
				'name': 'Nom de la page',
				'description': 'Nom de la page disponible depuis l\'url'
			}
		}
	},
	'page_index': {
		'name': 'Connecteur page d\'acceuil',
		'description': 'Récupération des mises à jour d\'une page d\'accueil',
		'folderUrl': 'page_index',
		'fields': {

		}
	}
};

exports.modules = modules;