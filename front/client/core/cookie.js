function Cookie() {
    
    this.val = function(name) {
        var cookies = document.cookie.split(';');
        var cookie;
        var returnValue = null;
        $.each(cookies, function(key, value) {
            cookie = value.split('=');
            while (cookie[0].charAt(0) == ' ') {
                cookie[0] = cookie[0].substring(1,cookie[0].length);
            }
            if(cookie[0] == name) {
                returnValue = cookie[1];
            }
        });
        return returnValue;
    }
    
    this.create = function(name, value, days) {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            var expires = "; expires="+date.toGMTString();
        }
        else var expires = "";
        document.cookie = name+"="+value+expires+"; path=/";
    }
    
    this.delete = function(name) {
        get(Cookie).create(name,"",-1);
    }
}