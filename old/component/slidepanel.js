//------------------------------------------------------------------------

/*
 * SlidePanel, GUI DOM element
*/	

//------------------------------------------------------------------------

if (!(SlidePanel instanceof Object)) {

	var SlidePanel = function (visible_items) {
		
		this.vitems  = visible_items;
		
		this.width  = 0;
		this.height = 0;
		
		this.selected_value = 0;
		this.selected_item  = undefined;
		
		this.autoSize = false;
		
		this.data = new IArray();
		this.el   = [];
		
		this.visible = false;
		this.enabled = true;
		this.focused = false;
		
		this.orientation   = 'H'; // V || H
		
		this.SlidePanelItem = function (parent, id, label, img_url, text, callback, context) {
			
			this.id 			= id;
			this.label			= label;
			this.image			= new Image();
			this.image.parent	= parent;
			this.text			= text;
			this.context		= (context||this);
			this.callback		= (callback||false);
			this.parent			= (parent||this);
			this.el				= undefined;
			
			this.image.onload = function(){
				
				if(parent.autoSize) {
				
					if(this.parent.width<this.width)	this.parent.width  = this.width;
					if(this.parent.height<this.height)	this.parent.height = this.height;
					
					this.parent.resizeTo(this.parent.width, this.parent.height);
					
				}
				
			};
			
			this.image.src	= (img_url||'');
			
		};
		
	};
	
	/*
	 * add item to data array, item is not visible element, need to call create again
	 * to do : recreate function
	 */
	SlidePanel.prototype.add = function (id, label, img_url, text, callback, context) { 
		
		this.data.push(new this.SlidePanelItem(this, id, label, img_url, text, callback, context)); 
		
		if(this.data.count()==1) {
			
			this.selected_value = 0;
			this.selected_item  = this.data.get(this.selected_value);
			
		}
		
	};
	
	/*
	 * resize
	 */
	SlidePanel.prototype.resizeTo = function (w, h) { 
	
		this.canvas.resizeTo(w, h);
		this.scrollArea.resizeTo(false, h);
		this.text.resizeTo(w, 20);
		this.text.moveTo(0,h-20);
		
	};
	
	/*
	 * create and show gui element
	 * params:
	 * id - element id will be created
	 * where_to, if is set element will be appended to this DOM element
	 */
	SlidePanel.prototype.create = function (id, where_to) {
		
		this.id = id;
		
		this.canvas		= mjdevjs.me(mjdevjs.DOM_TYPE_DIV, id, 'epg_slidepanel', where_to);
		this.scrollArea = mjdevjs.me(mjdevjs.DOM_TYPE_DIV, 'slidepanel_scroll_area', 'epg_slidepanel_scroll_area', this.canvas);
		this.text   	= mjdevjs.me(mjdevjs.DOM_TYPE_DIV, 'text', 'epg_slidepanel_text', this.canvas);

		for(var i=0; i<this.data.count(); i++) {
			
			var data = this.data.get(i);
			
			if(typeof(data)!=='undefined') {
			
				data.el	= mjdevjs.me(mjdevjs.DOM_TYPE_DIV, 'item',  'epg_slidepanel_item', this.scrollArea);
				data.el.img = mjdevjs.me(mjdevjs.DOM_TYPE_IMG, 'image', 'epg_slidepanel_item_image', data.el);
				
			}
			
			// set image source, image is precached
			data.el.img.src = this.data.get(i).image.src;
				
		}
		
		// register for events
		mjdevjs.registerHandler(this);
		
		// element visible and ready
		this.visible = true;
		
	};

	/*
	 * event handlers 
	 */
	
	// handle focus event
	// event need to return boolean value if it is sucessfuly focused
	SlidePanel.prototype.onFocus		= function () {
		
		this.canvas.setCss(this.canvas.getCss()+'_focused');
		this.focused = true;
		
		return true;
		
	};
	
	// handle lost focus event
	// event need to return boolean value if it is sucessfuly focused
	SlidePanel.prototype.onUnFocus	= function () {
		
		this.canvas.setCss(this.canvas.getCss().replace('_focused',''));
		this.focused = false;
		
		return true;
		
	};
	
	// handle key event
	// event need to return boolean value if it is sucessfuly finished or false to give control to app
	SlidePanel.prototype.onKey		= function (key){
		
		switch (KBD_MAP.getKeyName(key)){
			case 'VK_ESCAPE' :
				this.onUnFocus();
				break;
			case 'VK_DOWN' : // down 
				this.prev();
				break;
			case 'VK_UP' : // up 
				this.next();
				break;
			case 'VK_LEFT' : // down 
				this.prev();
				break;
			case 'VK_RIGHT' : // up 
				this.next();
				break;	
			case 'VK_ENTER' : // enter/ok
				if(typeof(this.selected.callback)!=='undefined') 
					if(this.selected.callback) this.selected.callback.apply(this.selected.context);
				this.onUnFocus();
				break;
		}
		
		return true;
		
	};
	
	/*
	 * Shift elements up and redraw  
	 */
	SlidePanel.prototype.prev   = function () { 
		
		this.selected_value--;
		if(this.selected_value<0) this.selected_value=0;
		this.selected_item  = this.data.get(this.selected_value);
	    this.canvas.scrollLeft = this.selected_item.el.offsetLeft-2;
	    
	};
	
	/*
	 * Shift elements down and redraw
	 */
	SlidePanel.prototype.next = function () { 
		
		this.selected_value++;
		if(this.selected_value>this.data.count()) this.selected_value = this.data.count();
		this.selected_item  = this.data.get(this.selected_value);
	    this.canvas.scrollLeft = this.selected_item.el.offsetLeft-2;
	    
	};
	
	
	/* 
	 * show menu
	 */
	SlidePanel.prototype.show = function () {
		
		this.canvas.show();
		this.visible = true;
		
	};
	
	/*
	 * hide menu 
	 */	
	SlidePanel.prototype.hide = function()  {
		
		this.canvas.hide();
		this.focused = false;
		this.visible = false;
		
	};
	
};

//------------------------------------------------------------------------

//------------------------------------------------------------------------
