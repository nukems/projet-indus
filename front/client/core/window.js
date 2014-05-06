function Window() {

	var self = this;

	/**
	*	Creer une popup
	*/
	this.create = function(title, content, width) {
		var html =  '<div id="windowBackground">' + 
						'<div id="window" style="width: ' + width + '">' + 
							'<div id="windowTitle">' + 
								'<button class="transparent" id="closeWindow"><img src="front/client/design/pictures/close.png"/></button>' +
								title + 
							'</div>' +
							'<div id="windowContent">' + 
								content + 
							'</div>' + 
						'</div>' +
					'</div>';
		$('#windows').html(html);
		$('#window').css("marginTop", ($(window).outerHeight() - $('#window').outerHeight()) / 2).fadeIn();
		$('#closeWindow').off().click(function() {
			self.close();
		});
	}

	/**
	*	Modifier le contenu de la popup
	*	Permet de gerer la modification de la taille
	*/
	this.content = function(newContent) {
		$("#windowContent").html(newContent);
		$('#window').css("marginTop", ($(window).outerHeight() - $('#window').outerHeight()) / 2);
	}

	/**
	*	Fermer et supprimer une popup
	*/
	this.close = function() {
		$('#windowBackground').fadeOut(function() {
			$(this).remove();
		});
	}

}