
if (!(Settings instanceof Object)) {

	var Settings = function (callback, context) {

		this.callback	= (callback||false);
		this.context	= (context||this);

		mjdevjs.requireComponent('json', function() {

			mjdevjs.requireComponent('stores', function() {	

				mjdevjs.requireComponent('cache', function() {

					log.info('creating cache object');

					this.data = new Cache();

					log.info('cache object created. type: ' + this.data.type);

					this.add	= function(name, mixed, expire){ this.data.set(name, mixed, expire); };

					this.addIfN	= function(name, mixed, expire){

						if(this.have(name)) return this.get(name);
						else this.set(name, mixed, expire);

					};

					this.set		= function(name, mixed, expire){ this.data.set(name, mixed, expire); };

					this.get		= function(name){ return this.data.get(name); };

					this.have		= function(name){ return this.data.has(name); };

					this.has		= function(name){ return this.data.has(name); };

					this.remove		= function(name){ this.data.kill(name); };

					if (this.callback) this.callback.apply(this.context);

				},this);

			},this);

		},this);

	};

}

