if(!(JSONWrapper instanceof Object)) {

	/**
	 * wraps JSON so we can use a JSON encoder which uses toString and fromString or parse and stringify
	 */

	var JSONWrapper = function() {

		var my = {

			/**
			 * passes control to the JSON object; defaults to JSON.stringify
			 */
			toString: function() { return JSON.stringify(arguments); },

			/**
			 * passes control to the JSON object; defaults to JSON.parse
			 */
			fromString: function() { return JSON.parse(arguments); },

			/**
			 * sets toString handler
			 * @param func reference to toString function, eg this.set_toString(JSON.stringify);
			 */
			set_toString: function(func) {

				my.toString = function() {

				// send all arguments to the desired function as an array
				var args = Array.prototype.slice.call(arguments);

					return func(args);

				}

			},

			/**
			 * sets fromString handler
			 * @param func reference to fromString function, eg this.set_toString(JSON.parse);
			 */
			set_fromString: function(func) {

				my.fromString = function() {

					// send all arguments to the desired function as an array
					var args = Array.prototype.slice.call(arguments);

					return func(args);

				}

			}

		};

		return my;

	};

}

/**
 * DBFStore - the default Cache storage
 */

if(!(DBFStore instanceof Object)) {	

	var DBFStore = function () {

		try {

			var myStore = window.openDatabase('CacheJS', '1.0', 'CacheJS', 1*1024*1024);
			myStore.transaction(function (tx) { tx.executeSql('CREATE TABLE IF NOT EXISTS CacheJS (id, value)'); });

		} catch (e) { log.error(e); };

		var my = {

			type :  'DBFStore',

			has : function (key) { return (this.get(key)!== null); },

			get : function (key) {

				var myStore = window.openDatabase('CacheJS', '1.0', 'CacheJS', 1*1024*1024);

				myStore.transaction(function (tx) {

					tx.executeSql('SELECT * FROM CacheJS WHERE id = \''+ key +'\'', [], function (tx, results) {

						var len = results.rows.length, i;

						for (i = 0; i < len; i++) {

							alert(results.rows.item(i).id);

						}

					 }, null);

				});

			},

			set : function (key,val) {

				var myStore = window.openDatabase('CacheJS', '1.0', 'CacheJS', 1*1024*1024);

				myStore.transaction(function (tx) {

					tx.executeSql('CREATE TABLE IF NOT EXISTS CacheJS (id, value)');
					tx.executeSql('INSERT INTO CacheJS (id, value) VALUES (\''+ key +'\', \''+ JSON.stringify(val) +'\')');

				});

			},

			kill: function (key) {
// to do
			}

		};

		if (typeof(window.openDatabase)!=='undefined' && typeof(myStore)!=='undefined' ) return my;
		else {

	    	// database can not be open
	    	return LocalStorageStore();

	    }

	};


}

/**
 * arrayStore - the default Cache storage
 */

if(!(ArrayStore instanceof Object)) {	
	
	var ArrayStore = function () {
		
	    var myStore = Array();
	
	    var my = {
	    	
	    	type :  'ArrayStore',
	    		
	        has : function (key) { return (typeof myStore[key]!="undefined"); },
	        
	        get : function (key) { return myStore[key]; },
	        
	        set : function (key,val) { myStore[key] = val; },
	        
	        kill: function (key) { delete myStore[key]; }
	    };
	
	    return my;
	    
	};
	
}
	
/**
 * localStorageStore.
 */

if (!(LocalStorageStore instanceof Object)) {

	var LocalStorageStore = function() {
		
	    var prefix = "CacheJS_"; // change this if you're developing and want to kill everything ;0)
	
	    var my = {
	    		
    		type : 'LocalStorageStore',
	    		
	        has: function(key) { return (localStorage[prefix+key]!=null); },
	        
	        get: function(key) {
	        	
	            if(!my.has(key)) return undefined;
	            else return JSON.parse(localStorage[prefix+key]);
	        },
	        
	        set: function(key,val) {
	        	
	            if(val===undefined) my.kill(key);
	            else localStorage[prefix+key] = JSON.stringify(val);
	            
	        },
	        
	        kill: function(key) {
	        	
	            //delete localStorage[prefix+key]; // not supported in IE8
	            localStorage.removeItem(prefix+key);
	            
	        }
	        
	    };
	
	    if(window.localStorage) return my;
	    else {
	    	
	        // localStorage not supported on this browser; degrade to arrayStore.
	        return CookieStore();
	        
	    }
	    
	};
	
}

/**
 * Cookie Monster Want Cookies.
 * I don't recommend the use of this store really; cookies have limited length, and you can only have a limited number of cookies per domain
 * It's really only included to show how flexible the pluggable storage system is.
 */

if(!(CookieStore instanceof Object)){	
	
	var CookieStore = function() {
		
	    // uses cookie functions from http://www.quirksmode.org/js/cookies.html
	    var prefix = "CacheJS_";
	
	    var my = {
	    		
    		type : 'CookieStore',	
	    		
	        has: function(key) { return (my.get(key)!==undefined); },
	        
	        get: function(key) {
	        	
	            var nameEQ = prefix + "=";
	            var ca = document.cookie.split(';');
	            
	            for(var i=0 ; i < ca.length ; i++) {
	            	
	                var c = ca[i];
	                
	                while (c.charAt(0)==' ') 
	                    c = c.substring(1,c.length);
	                
	                if (c.indexOf(nameEQ) == 0) {
	                    
	                	// found our cookie; split it out for the specified key
	                    cookieContents = JSON.parse(c.substring(nameEQ.length,c.length));
	                    
	                    if(key) return cookieContents[key];
	                    else    return cookieContents;
	                    
	                }
	                
	            }
	            
	            return undefined;
	            
	        },
	        
	        set: function(key, val) {
	        	
	            cookieContents = my.get();
	            
	            if(cookieContents==null) 
	                cookieContents = Object();
	            
	            cookieContents[key] = val;
	            
	            document.cookie = prefix+"="+JSON.stringify(cookieContents)+"; path=/";
	            
	        },
	        
	        kill: function(key) { my.set(key,undefined); }
	        
	    };
	    	
	    
		var cookieEnabled = ((navigator.cookieEnabled)? true : false);

		//if not IE4+ nor NS6+
		if (typeof navigator.cookieEnabled=="undefined" && !cookieEnabled){
			
			document.cookie = "testcookie";
			cookieEnabled = ((document.cookie.indexOf("testcookie")!=-1)? true : false);
					
		}
	    
		if(cookieEnabled) return my;
	    else {
	    	
	        // cookie not supported on this browser; degrade to arrayStore.
	        return ArrayStore();
	        
	    }
	    
	};
	
}
