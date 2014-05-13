var modules = {
	'facebook': {
		'name': 'Connecteur facebook',
		'description': "Le connecteur Facebook permet de suivre l'évolution des mentions \"J'aime\" et des partages d'une page, ainsi que l'analyse en temps réel des nouveaux posts de cette page.",
		'folderUrl': 'facebook',
		'fields': {
			'pageName': {
				'type': 'string',
				'name': ' Identifiant de la page',
				'description': "Le nom de la page est disponible depuis l'url vous permettant d'accéder à la page. Cet url est de la forme https://www.facebook.com/{nomDeLaPage}. Il ne faut renseigner que le nom de la page, pas l'adresse entière."
			},
			'displayName': {
				'type': 'string',
				'name': 'Nom de la page',
				'description': "Nom de la page qui s'affichera sur l'interface"
			}

		}
	},
	'twitter': {
		'name': 'Connecteur twitter',
		'description': "Ce connecteur permet l'analyse des followers et des tweet de la page",
		'folderUrl': 'twitter',
		'fields': {
			'pageName': {
				'type': 'string',
				'name': 'Nom de la page',
				'description': 'Nom de la page disponible depuis l\'url'
			},
			'displayName': {
				'type': 'string',
				'name': 'Nom de la page',
				'description': "Nom de la page qui s'affichera sur l'interface"
			}
		}
	},
	'website': {
		'name': "Connecteur de page d'accueil",
		'description': "Ce connecteur permet le monitoring des pages d'accueil des concurrents",
		'folderUrl': 'website',
		'fields': {
			'pageName': {
				'type': 'string',
				'name': 'Url de la page',
				'description': "Url de la page d'accueil du concurrent"
			}
		}
	}
};

exports.modules = modules;