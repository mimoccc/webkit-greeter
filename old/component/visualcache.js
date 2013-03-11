//------------------------------------------------------------------------

/*
 * VisualCache is GUI element to show that content is loading.
 * Will show bordered frame and content which are actualy downloaded
 */	

if (!(VisualCache instanceof Object)) {

	var VisualCache = function () {
		
		this.visible	= false;
		this.data		= [];
		this.label_text = 'loading...';
		this.callback	= false;
		this.context	= this;
		
	};

	/*
	 * Function to add content which will be preloaded
	 */
	
	VisualCache.prototype.addRemoteContent = function (id, url, image_url, description, callback, context, schedule) {

		// create new object
		this.data.push({
			'id'			: id,
			'url'			: url,
			'image_url'		: (image_url||''),
			'description'	: (description||''),
			'data'			: undefined,
			'status'		: 0,
			'callback'  	: (callback || false),
			'context'		: (context || this),
			'headers'		: [],
			'schedule'		: (schedule||new Date()),
			'old_callback'	: false,
			'idx'			: this.data.length
		}); 
			
	};	
	
	/*
	 * create and show gui element
	 * params:
	 * id - element id will be created
	 * where_to, if is set element will be appended to this DOM element
	 */
	
	VisualCache.prototype.create = function (id, where_to) {
		
		this.id			= id;
		this,renderedTo = where_to;
		
		this.canvas			= mjdevjs.me(mjdevjs.DOM_TYPE_DIV, id,       'epg_visual_cache',	 where_to);
		this.window		 	= mjdevjs.me(mjdevjs.DOM_TYPE_DIV, 'window', 'epg_visual_cache_win',	 this.canvas);
		this.label	  		= mjdevjs.me(mjdevjs.DOM_TYPE_DIV, 'text',   'epg_visual_cache_txt', this.window);
		this.image  		= mjdevjs.me(mjdevjs.DOM_TYPE_IMG, 'image',  'epg_visual_cache_img', this.window);
		this.description	= mjdevjs.me(mjdevjs.DOM_TYPE_DIV, 'desc',   'epg_visual_cache_dsc', this.window);
		
		mjdevjs.requireComponent('ProgressBar',function(){
			
			this.label.innerHTML = this.label_text;
			
			this.progress 		= new ProgressBar();
			
			this.progress.create('progress', this.window);
			this.progress.setColor('rgb(0, 238, 34)');
			this.progress.resizeTo(418,4);
			this.progress.moveTo(36, 270);
			
			if (this.visible) this.load(callback, context);
			
		}, this);
		
	};
	
	/*
	 * function to test if there is item to load and returns his idx if so
	 */
	
	VisualCache.prototype.toLoad = function () {
		
		for(var i=0; i<this.data.length; i++) 		
			if(typeof(this.data[i].data)==='undefined') return this.data[i];
		
		return false;
		
	};
		
	/*
	 * function to load all items word
	 */
	
	VisualCache.prototype.load = function (callback, context) {
		
		if(typeof(callback)!=='undefined') 
			this.setCallback((callback || function(){}), (context||this));
		
		
		if (!this.visible) this.show();
		
		// if cachce is empty
		if(this.data.length==0) {
			
			this.update(0, 1, 1);
			return;
			
		}
		
		var data = this.toLoad();
		
		if (data) {
			
			if(data.callback) 
				data.old_callback = { 'callback' : data.callback, 'context':data.context };
			
			data.callback = this.update;
			data.context  = this;
			
			data.context.image.src				= data.image_url;
			data.context.description.innerHTML	= data.description; 
			
			mjdevjs.cache.getRemoteContent(data.id, data.url, function(id, data){

				this.data = data;
				this.callback.apply(this.context, [this, this.id, this.idx, this.context.data.length, this.context.data]);
				this.context.load();
								
			}, data);
							
		} else {
			
			this.hide();
			this.callback.apply(this.context);
			
		}
		
	};
	
	/*
	 * set new callback function
	 */
	
	VisualCache.prototype.setCallback = function (callback, context) {
		
		this.callback	= callback;
		this.context	= context;
		
	};
	
	/*
	 * update slider and so
	 */
	
	VisualCache.prototype.update = function (item, id, item_pos, item_cnt, data_array) {

		// update progress bar
		if (typeof(this.progress)!=='undefined') 
			this.progress.update((100/item_cnt)*item_pos);
		
		if(item.old_callback) 
			item.old_callback.callback.apply(item.old_callback.context);
		
	};

	VisualCache.prototype.show = function () {
		
		this.visible = true;
		this.canvas.show();
		
	};
	
	VisualCache.prototype.hide = function () {
		
		this.visible = false;
		this.canvas.hide();
		
	};
	
	// just a helper
	VisualCache.prototype.getRemoteContent	= mjdevjs.getRemoteContent;
	VisualCache.prototype.getContent		= mjdevjs.getContent;
	
};

//------------------------------------------------------------------------
