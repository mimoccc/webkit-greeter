//------------------------------------------------------------------------
// MJDEV JS API, base object and library
//------------------------------------------------------------------------

	// string.capitalise
	if (typeof(String.capitalise)==='undefined') {
		String.prototype.capitalise = function () { return this.substr(0,1).toUpperCase() + this.substr(1); };
	};

	// Array bug replacement
	if(typeof(Array.remove)==='undefined') {
		// Remove from array, an error to remove object from array fix
		Array.prototype.remove = function(from, to) {
			var rest = this.slice((to || from) + 1 || this.length);
			this.length = from < 0 ? this.length + from : from;
			return this.push.apply(this, rest);
		};
	};
	
	// Array bug replacement
	if(typeof(Array.contains)==='undefined') {
		// Remove from array, an error to remove object from array fix
		Array.prototype.contains = function(what, where) {
			for(var i=0; i<this.length; i++){
				if((this[i] === what)||(this[i] == what)||(((where || false)?((this[i][where] === what)||(this[i][where] == what)):false)))
				return true;
			}
			return false;
		};
	};
	
	// Event Channel 
	if(typeof(Channel)==='undefined') {
		Channel = function (type) {
			this.type = type;
			this.handlers = {};
			this.guid = 0;
			this.fired = false;
			this.enabled = true;
			this.fire = function(e) {
				if (this.enabled) {
					var fail = false;
					var item, handler, rv;
					for (item in this.handlers) {
						if (this.handlers.hasOwnProperty(item)) {
							handler = this.handlers[item];
							if ((handler instanceof Function)&&(!handler.locked)) {
								rv = (handler.apply(this, arguments) === false);
								fail = fail || rv;
							}
						}
					}
					this.fired = true;
					this.fireArgs = arguments;
					return !fail;
			    }
				return true;
			};
			
			this.subscribe = function(f, c, g, l) {
				if (f === null) { return; } // need a function to call
				var func = f;
				if (typeof c === "object" && f instanceof Function) { func = mjdevjs.close(c, f); }
				g = g || func.observer_guid || f.observer_guid || this.guid++;
				func.observer_guid = g;
				f.observer_guid = g;
				func.locked		= false;
				func.can_lock	= true;
				if(typeof(l)!=='undefined') func.can_lock = l;
				this.handlers[g] = func;
				return g;
			};
		
			this.subscribeOnce = function(f, c) {
				var g = null;
				var _this = this;
				var m = function() {
					f.apply(c || null, arguments);
					_this.unsubscribe(g);
				};
				if (this.fired) {
					if (typeof c === "object" && f instanceof Function)
						f = mjdevjs.contextfnc(f,c);
						f.apply(this, this.fireArgs);
					} else g = this.subscribe(m);
				return g;
			};
		
			this.unsubscribe = function(g) {
				if (g instanceof Function)  g = g.observer_guid;
				this.handlers[g] = null;
				delete this.handlers[g];
			};

			this.lockAll = function(g) {
				var item, handler, rv;
				for (item in this.handlers) {
					if (this.handlers.hasOwnProperty(item)) {
						handler = this.handlers[item];
						if ((handler instanceof Function) && (handler.observer_guid != g) && (handler.can_lock)) 
							handler.locked = true;
					}
				}
				return true;
			};

			this.unLockAll = function() {
				var item, handler, rv;
				for (item in this.handlers) {
					if (this.handlers.hasOwnProperty(item)) {
						handler = this.handlers[item];
						if (handler instanceof Function) handler.locked = false;
					}
				}
				return true;
			};
		
			this.join = function(h, c) {
				var i = c.length;
				var f = function() { if (!(--i)) h(); };
				var len = i;
				var j;
				for (j=0; j<len; j++) {
					if (!c[j].fired) c[j].subscribeOnce(f);
					else i--;
				}
				if (!i) h();
			};
			
			
			
		}
	};

//------------------------------------------------------------------------
// mjdevjs a base API
//------------------------------------------------------------------------

if (!(mjdevjs instanceof Object)) {

	/**
	 * This represents the mjdevjs API itself, and provides a global namespace for accessing
	 * information about the state of mjdevjs.
	 */

	var mjdevjs = {

		DOM_TYPE_DIV		: 'div',
		DOM_TYPE_IMG		: 'img',
		DOM_TYPE_SPAN		: 'span',
		DOM_TYPE_INPUT		: 'input',
		DOM_TYPE_SELECT		: 'select',
		DOM_TYPE_UL			: 'ul',
		DOM_TYPE_LI			: 'li',
		DOM_TYPE_A			: 'a',
		DOM_TYPE_P			: 'p',
		DOM_TYPE_BUTTON		: 'button',
		DOM_TYPE_PASSWORD	: 'password',
		
		onAppStart		: new Channel('AppStart'),
		onAppReady		: new Channel('AppReady'),
		onKeyDown		: new Channel('KeyDown'),
		onAppPause 		: new Channel('AppPause'),
		onAppStop  		: new Channel('AppStop'),
		
		get_head			: function(){return document.getElementsByTagName('head')[0];},
		get_canvas			: function(){return document.getElementsByTagName('body')[0];},
		get_scripts			: function(){return document.getElementsByTagName('body')[0];},
		
		config : function(obj, cfg){
			if ((obj instanceof Object)&&(cfg instanceof Object)) 
				for(var i in cfg) obj[i] = cfg[i];
		},
		
		style : function(data) {
			var str = '';
			for(var i in data) {
				if(typeof(data[i]) === 'string') str += i.replace('_','-') + ':' + data[i] + ';';
			}
			return str;
		},
		
		includeJavascript : function(jsfile, jsdir, successCallback, context) {
			if(!this.scriptsLoaded().contains(jsfile)) {
				var id = this.get_head();         
				var el = document.createElement('script');
				el.type = 'text/javascript';
				el.src = (jsdir ||'js') + '/' + jsfile;
				id.appendChild(el);
				if (typeof successCallback !== 'undefined') 
					el.onload = function() { return (successCallback||function(){}).apply((context||window)); };
			} else {
				return (successCallback||function(){}).apply((context||window));
			}
		},
	
		scriptsLoaded : function(){
			var sc = [];
			var scripts = this.get_scripts();
			for (var i=0; i<scripts.length; i++){
				var script 		= scripts[i];
				var scriptsrc 	= script.src;
				var scriptname 	= scriptsrc.substring(scriptsrc.lastIndexOf('/')+1); 
				if (scriptsrc != '') {
					sc.push({
						name	: scriptname,
						src		: scriptsrc,
						dom		: script
					});
				}
			}
			return sc;
		},
	
		createCSS : function (selector, declaration) {
			var style_node = document.createElement("style");
			style_node.setAttribute("type", "text/css");
			style_node.setAttribute("media", "screen"); 
			style_node.appendChild(document.createTextNode(selector + " {" + declaration + "}"));
			document.getElementsByTagName("head")[0].appendChild(style_node);
		},
	
		createUUID : function() {
			return mjdevjs.UUIDcreatePart(4) + '-' +
				mjdevjs.UUIDcreatePart(2) + '-' +
				mjdevjs.UUIDcreatePart(2) + '-' +
				mjdevjs.UUIDcreatePart(2) + '-' +
				mjdevjs.UUIDcreatePart(6);
		},
	
		UUIDcreatePart : function(length) {
			var uuidpart = "";
			var i, uuidchar;
			for (i=0; i<length; i++) {
				uuidchar = parseInt((Math.random() * 256),0).toString(16);
				if (uuidchar.length === 1) uuidchar = "0" + uuidchar;
				uuidpart += uuidchar;
			}
			return uuidpart;
		},
		
		loadComponent : function (compName, callback, context) {
			require(
				[
					'component/'+compName.toLowerCase()+'/component.js'
				], 
				function(){
					callback.apply(context || window);
				}
			);
		},
		
		requireComponent : function(compName, successCallback, context) {
			if (
				!(
					(window[compName.capitalise()] instanceof Object)&&
					(window[compName.capitalise()] instanceof Function)
				)
			)
				this.loadComponent(compName.toLowerCase(), successCallback, context);
			else
				if (typeof successCallback !== 'undefined') return successCallback.apply((context||window));
		},
		
		contextfnc : function(func, context, params) { 
			return function() { return func.apply(context,(params||arguments)); }; 
		},
		
		init			: function(onstartfnc,context) {		
			this.includeJavascript("jquery.require.js", false, function(){
				require([
					"js/mjdevjs.date.js", 
					"js/mjdevjs.iarray.js", 
					"js/jquery.js",
					"js/l10n.js",
					"js/jquery.superfish.min.js",
					"js/jquery.poshytip.min.js",
					"js/jquery.carousel.min.js",
					"js/jquery.easing.min.js",
					"js/jquery.fancybox.min.js",	
					"js/jquery-ui-1.8.16.custom.min.js"
				], function($) {
		 			window.$ = jQuery;
					this.log = {
						info	: function (){},
						resize	: function (){},
						hide	: function (){},
						debug	: function (){},
						error	: function (){},
						show	: function (){}
					};
					(onstartfnc||function(){}).apply((context||window));
		 		});
			}, this);
		},
		
		me : function(config) {
			if(typeof(config)!=='object') return;
			if(typeof(config.type)==='undefined') return;
			if(typeof(config.append)==='undefined') {
				if(typeof(mjdevjs._body)!=='undefined') config.append = this.get_canvas();
				else return;
			}
			if(config.type==mjdevjs.DOM_TYPE_PASSWORD) {
				var e = document.createElement(mjdevjs.DOM_TYPE_INPUT);
				e.setAttribute('type','password');
			} else {
				var e = document.createElement(config.type);
			}
			e.config = config;
			// for animations
			e.is_animated = false;
			// set id of element
			e.setId = function(id) { this.setAttribute('id',id); };
			// get id of element
			e.getId = function() { return this.getAttribute('id'); };
			// get dom element from this element by id		
			e.get = function (id) { return this.getElementById(id); };
			// set style
			e.setEStyle = function(st) { e.setAttribute('style', st); };
			// get style
			e.getEStyle = function() { return e.getAttribute('style'); };
			// set css style name
			e.setCss = function(css){ this.setAttribute('class',css); };
			// get css style name
			e.getCss = function(){ return this.getAttribute('class'); };
			//show element
			e.show = function () { this.style.display = 'block'; };
			//hide element
			e.hide = function () { this.style.display = 'none'; };
			// get/set html
			e.html = function(html) {
				if(typeof(html)!=='undefined') this.innerHTML = html;
				else return this.innerHTML;
			};
			if(typeof(config.html)!=='undefined') {
				e.html(config.html);
				delete(config.html);
			}
			config.append.appendChild(e);
			delete(config.append);
			delete(config.type);
			//if(typeof(config.class)==='undefined')
				//if(typeof(config.id)!=='undefined') config.class = config.id;
			for(var i in config) e.setAttribute(i,config[i]);
			if(config.type=='select') {
				e.addOption = function(name, value) {
					this.innerHTML += '<option name="'+ name +'" value="'+ name +'">'+ name +'</option>';
				};
			}
			// center element on screen or parent element if assigned in params
			e.center = function (parentEl) {
				this.moveTo(
					((parentEl||document).clientWidth - this.clientWidth)/2,
					((parentEl||document).clientHeight - this.clientHeight)/2
				);
			};
			// move element by coords
			e.moveTo = function (x,y) {
				// set position
				if (x) this.style.left = x+'px';
				if (y) this.style.top  = y+'px';
			};
			// scroll element body
			e.scrollTo = function (x,y) {
				if (x) this.scrollLeft = x;
				if (y) this.scrollTop  = y;
			};
			/*
			 * a helper function to make name as is used for styles
			 */
			e.toCamelCase = function (sInput) {
				var oStringList = sInput.split('-');
				if(oStringList.length == 1)  return oStringList[0];
				var ret = sInput.indexOf("-") == 0 ? oStringList[0].charAt(0).toUpperCase() + oStringList[0].substring(1) : oStringList[0];
				for(var i = 1, len = oStringList.length; i < len; i++) {
					var s = oStringList[i];
					ret += s.charAt(0).toUpperCase() + s.substring(1);
				};
				return ret;
			};
			// set style of element
			e.setStyle = function (style, value) { this.style[style] = value; };
			// get style of element
			e.getStyle = function (style) {
				var value = this.style[this.toCamelCase(style)];
				if(!value){
					if(document.defaultView) { 
						value = document.defaultView.getComputedStyle(this, "").getPropertyValue(style);
					} else {
						if(this.currentStyle)
							value = this.currentStyle[this.toCamelCase(style)];
					}
				}
				return value;
			};
			//returns element details in array, [x,y,w,h]
			e.getCoords = function () {
				var x = parseInt(e.style.left);
				// get base position, which should work in any browser
				// if class is set, no automatic computing is working in some browsers, see code below
				var y = parseInt(e.style.top);
				var w = parseInt(e.style.width);
				var h = parseInt(e.style.height);
				// if some of elements have class definition and no style
				// we need to search their data in styles
				x = x || parseInt(this.getStyle('left'));
				y = y || parseInt(this.getStyle('top'));
				w = w || parseInt(this.getStyle('width'));
				h = h || parseInt(this.getStyle('height'));
				// in styles also not found, element may be wrong, but we need to be clear
				if(isNaN(x)) x = 0;
				if(isNaN(y)) y = 0;
				if(isNaN(w)) w = 0;
				if(isNaN(h)) h = 0;
				return([x, y, w, h]);
			};
			// resize element
			e.resizeTo = function (w, h) {
				// this sets size if property is not false, useful for sizing only one axis
				if (w) e.style.width  = w+'px';
				if (h) e.style.height = h+'px';
	
			};
			return e;
		}
				
	};
	
}
//------------------------------------------------------------------------
