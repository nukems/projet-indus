 function Ajax() {
    
    this.ajaxInstance = null; //requete courante
    var self = this;

    /**
    *   Envoyer une requete ajax sans doublon
    *   @model le controlleur PHP utilise
    *   @action la methode du controlleur
    *   @data les donnees envoyees avec la requete
    *   @callback la fonction a executer a la fin de la requete
    */
    this.sendOne = function(url, data, callback) {
        this.stop();
        this.ajaxInstance = this.send(url, data, callback);
    }

    /**
    *   Envoyer une requete ajax avec doublon
    *   @url l'url appelee sur le serveur
    *   @data les donnees envoyees avec la requete
    *   @callback la fonction a executer a la fin de la requete
    */
    this.send = function(url, data, callback) {
        var request = $.ajax({
            type: "POST",
            url: url,
            data: {
                'token': get(User).getToken(),
                'isAjax': true,
                'data': JSON.stringify(data)
            },
            async: true,
            success: function(dataReturn){
                var dataParsed = self.parse(dataReturn);
                //si erreur fatale sur le serveur
                if(dataParsed.fatalError && dataParsed.fatalError == 1) {
                    alert("Une erreur fatale est survenue (logguée dans la console)");
                    console.log(dataParsed.error);
                } else if (callback != null) {
                    callback(dataParsed);
                }
            }
        });
        return request;
    }

    /**
    *   Stopper la requete courante
    */
    this.stop = function() {
        if (this.ajaxInstance != null) {
            this.ajaxInstance.abort();
            this.ajaxInstance = null;
        }
    }

    /**
    *   Parse les donnes recues de la requete pour obtenir un objet JSON
    *   @data le retour de la requete
    */
    this.parse = function(data) {
        return $.parseJSON(data);
    }
}

