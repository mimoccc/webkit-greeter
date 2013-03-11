//------------------------------------------------------------------------

/*
 * Menu GUI element
 */
	
if (!(Menu instanceof Object)) {

	var Menu = function (visible_items) {
		
		this.iitems  = visible_items;
		this.iwidth  = 0;
		this.iheight = 0;
		
		this.item_width = 48;
		
		this.data = new IArray();
		this.el   = [];
		
		this.visible = false;
		this.enabled = true;
		this.focused = false;
		
		this.orientation   = 'V'; // V || H
		
		this.MenuItem = function (id, label, img_url, callback, context) {
			
			this.id = id;
			this.label		= label;
			this.image		= new Image();
			this.image.src	= (img_url||'');
			this.context	= (context||this);
			this.callback	= (callback||false);
			
		};
		
	};
	
	/*
	 * add item to data array, item is not visible element, need to call create again
	 * to do : recreate function
	 */
	Menu.prototype.add = function (id, label, img_url, callback, context) { 
		
		var i = new this.MenuItem(id, label, img_url, callback, context);
		
		switch(this.orientation) {
			
			case 'H' :
				if(this.iheight<i.image.height) 
					this.iheight = i.image.height;
				break;
				
			default :
				if(this.iwidth<i.image.width) 
					this.iwidth = i.image.width;
				break;
				
		}
		
		this.data.push(i); 
		
	};
		
	/*
	 * create and show gui element
	 * params:
	 * id - element id will be created
	 * where_to, if is set element will be appended to this DOM element
	 */
	Menu.prototype.create = function (id, where_to) {
		
		this.id = id;
		
		var xx = 0;
		var yy = 0;
		
		this.canvas = mjdevjs.me(mjdevjs.DOM_TYPE_DIV, id, 'epg_Menu', where_to);
		this.text   = mjdevjs.me(mjdevjs.DOM_TYPE_DIV, 'text', 'epg_Menu_text');
		
		for(var i=0; i<this.iitems; i++) {
			
			this.el[i] 	   = mjdevjs.me(mjdevjs.DOM_TYPE_DIV, 'item',  'epg_menu_item', this.canvas);
			this.el[i].img = mjdevjs.me(mjdevjs.DOM_TYPE_IMG, 'image', 'epg_menu_item_image', this.el[i]);
			
			// set zIndex, only selected item is in focus
			this.el[i].style.zIndex  = xx + 900;

			if(i==((this.iitems-1)/2)) { // for selected element, half of all shown at the begining
			    
				this.el[i].setCss('epg_Menu_item_selected');
			    
				// only this one is container for text label
			    this.el[i].appendChild(this.text);
			    
			    // and as in constructor a selected element
			    this.selected = this.data.get(i);
				this.text.innerHTML = this.selected.label;
				
			}
			
			// move and resize element due the menu position and orientation
		    switch(this.orientation) {
				
				case 'H' :
// to do
					break;
					
				default :
					this.el[i].resizeTo(this.iwidth-((3-xx)*20), this.iheight-((3-xx)*20)-14);
					this.el[i].moveTo ((10*xx), yy);
					
					var coords = this.el[i].getCoords();
					
					xx  = 0;
					yy += coords[3];
					
					this.canvas.resizeTo(this.iwidth/2,yy);
					this.canvas.moveTo(false,((DeviceInfo.screenHeight-yy)/2));
					
					break;
					
		    }
			
			// set image source, image is precached
			this.el[i].img.src = this.data.get(i).image.src;
			
		}
		
		// register for events
		mjdevjs.registerHandler(this);
		
		// element visible and ready
		this.visible = true;
		
		//effect
		//this.canvas.fadeIn(32,1);
	};

	/*
	 * event handlers 
	 */
	
	// handle focus event
	// event need to return boolean value if it is sucessfuly focused
	Menu.prototype.onFocus		= function () {
		
		this.focused = true;
		this.canvas.setStyle('border','solid rgb(0, 238, 34) 2px');
		return true;
		
	};
	
	// handle lost focus event
	// event need to return boolean value if it is sucessfuly focused
	Menu.prototype.onUnFocus	= function () {
		
		this.focused = false;
		this.canvas.setStyle('border','');
		return true;
		
	};
	
	// handle key event
	// event need to return boolean value if it is sucessfuly finished or false to give control to app
	Menu.prototype.onKey		= function (key){
		
		switch (KBD_MAP.getKeyName(key)){
		
			case 'VK_ESCAPE' :
				this.onUnFocus();
				break;
			case 'VK_DOWN' : // down 
				this.up();
				break;
			case 'VK_UP' : // up 
				this.down();
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
	 * refresh menu, redraw canvas
	 */
	Menu.prototype.refresh = function () {
		
		for(var i=0; i<this.iitems; i++) {
			// change item image
		    this.el[i].img.src = this.data.get(i).image.src;
		    
		    if(i==((this.iitems-1)/2)){
		    	// selected item label
		        this.text.innerHTML = this.data.get(i).label;
		        // selected item
				this.selected = this.data.get(i);
			}
		    
		}
		
	};
	
	/*
	 * Shift elements up and redraw  
	 */
	Menu.prototype.up   = function () { 
		
	    this.data.pop(); 
	    this.refresh(); 
	    
	};
	
	/*
	 * Shift elements down and redraw
	 */
	Menu.prototype.down = function () { 
		
	    this.data.poprev(); 
	    this.refresh(); 
	    
	};
	
	/*
	 * hide menu, slide to left and fade
	 */
	Menu.prototype.slideToLeft = function (x) {
		
		if(typeof(this.slidex)==='undefined') {
			this.slideStep = 64;
			this.slidex = x/this.slideStep;
			this.opax   = 1/this.slideStep;
		}
		
		if(this.slideStep>0) {
			this.canvas.moveTo(
				this.canvas.getCoords()[0]-this.slidex,
				false
			);
			this.canvas.setStyle('opacity',(this.opax*this.slideStep));
			this.slideStep--;
			
			setTimeout(mjdevjs.close(this,this.slideToLeft), 1);
			
		} else {
			
			delete(this.slidex);
			delete(this.slideStep);
			delete(this.opax);
			
			this.visible = false;
			
		}
		
	};
	
	/* 
	 * Show menu by sliding back right
	 */
	Menu.prototype.slideToRight = function (x) {
		
		this.canvas.moveTo(1,false);
		this.canvas.setStyle('opacity',1);
		
		this.visible = true;
		
	};
	
	/* 
	 * show menu
	 */
	Menu.prototype.show = function () { this.slideToRight(); };
	
	/*
	 * hide menu 
	 */	
	Menu.prototype.hide = function()  {
		
		this.focused = false;
		this.slideToLeft(this.el[Math.round(this.iitems/2)].getCoords()[2]);
		
	};
	
};

//------------------------------------------------------------------------
