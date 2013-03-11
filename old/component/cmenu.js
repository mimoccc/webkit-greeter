//------------------------------------------------------------------------

/*
 * Circle menu
 */


/*
 
 // cmenu  classes
.epg_cmenu { position:absolute; left:0px; top:0px; }

.epg_cmenu_text {
	background : url(img/title.png);
	position : absolute;
	left : 0;
	bottom : 0;
	color : #e0e0e0;
	text-align : center;
	font-weight : bold;
	margin-bottom : 14px;
	margin-left : 10px;
	width  : 185px;
	z-index : 1002;
}

.epg_cmenu_item {
	text-align : center;
	position : absolute;
	left:0;
	top:0;
}

.epg_cmenu_item_selected {
	text-align : center;
	position : absolute;
	background : url(img/bg-frame.png);
    width  : 205px;
    height : 133px;
    z-index : 1001;
}

.epg_cmenu_item_image {
}

 */
	
if (!(CMenu instanceof Object)) {

	var CMenu = function (visible_items) {
		
		this.iitems  = visible_items;
		this.iwidth  = 0;
		this.iheight = 133;
		
		this.data = new IArray();
		this.el   = [];
		
		this.visible = false;
		this.enabled = true;
		this.focused = false;
		
		this.CMenuItem = function (id, label, img_url, callback, context) {
			this.id = id;
			this.label = label;
			this.image = new Image();
			this.image.src = img_url;
			this.context = context;
			this.callback = callback;
		};
		
	};
	
	/*
	 * add item to data array, item is not visible element, need to call create again
	 * to do : recreate function
	 */
	CMenu.prototype.add = function (id, label, img_url, callback, context) { 
		
		var i = new this.CMenuItem(id, label, img_url, callback, context);
		
		if(this.iwidth<i.image.width) this.iwidth=i.image.width;
		
		this.data.push(i); 
		
	};
		
	/*
	 * create and show gui element
	 * params:
	 * id - element id will be created
	 * where_to, if is set element will be appended to this DOM element
	 */
	CMenu.prototype.create = function (id, where_to) {
		
		this.id = id;
		
		var xx = 0;
		var yy = 0;
		
		this.canvas = mjdevjs.me(mjdevjs.DOM_TYPE_DIV, id, 'epg_cmenu', where_to);
		this.text   = mjdevjs.me(mjdevjs.DOM_TYPE_DIV, 'text', 'epg_cmenu_text');
		
		for(var i=0; i<this.iitems; i++) {
			this.el[i] 	   = mjdevjs.me(mjdevjs.DOM_TYPE_DIV, 'item',  'epg_cmenu_item', this.canvas);
			this.el[i].img = mjdevjs.me(mjdevjs.DOM_TYPE_IMG, 'image', 'epg_cmenu_item_image', this.el[i]);
			
			// set zIndex, only selected item is in focus
			this.el[i].style.zIndex  = xx+900;

			if(i==((this.iitems-1)/2)) { // for selected element, half of all shown at the begining
			    this.el[i].setCss('epg_cmenu_item_selected');
			    // only this one is container for text label
			    this.el[i].appendChild(this.text);
			    // and as in constructor a selected element
			    this.selected = this.data.get(i);
				this.text.innerHTML = this.selected.label;
			} else {
			    this.el[i].resizeTo(
			    	this.iwidth-((3-xx)*20),
			    	this.iheight-((3-xx)*20)-14
			    );
			}

			// set element opacity depends on position
			this.el[i].style.opacity = 0.2+Math.abs((1/(this.iitems))*xx*2);
			
			// move element due the menu position
			this.el[i].moveTo ((10*xx), yy);
			
			//set image height 
			this.el[i].img.resizeTo(false, this.el[i].getCoords()[3]);
			
			// set image source, image is precached
			this.el[i].img.src = this.data.get(i).image.src;
			
			xx+=(i<((this.iitems-1)/2))?1:-1;
			yy+=(this.el[i].getCoords()[3]/2);
			
		}
		
		// move to center of window, need to be called once only
		this.canvas.moveTo(false,((DeviceInfo.screenHeight-yy)/2));
		
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
	CMenu.prototype.onFocus		= function () {
		
		// autofocus?
		this.focused = true;
		if(!this.visible) this.show();
		
		return true;
		
	};
	
	// handle lost focus event
	// event need to return boolean value if it is sucessfuly focused
	CMenu.prototype.onUnFocus	= function () {
		
		this.focused = false;
		if(this.visible) this.hide();
				
		return true;
		
	};
	
	// handle key event
	// event need to return boolean value if it is sucessfuly finished or false to give control to app
	CMenu.prototype.onKey		= function (key){
		
		switch (KBD_MAP.getKeyName(key)){
			case 'VK_ESCAPE' : // esc
				this.onUnFocus();
				break;
			case 'VK_DOWN' : // down 
				this.down();
				break;
			case 'VK_UP' : // up 
				this.up();
				break;
			case 'VK_ENTER' : // enter/ok
				this.hide();
				if(typeof(this.selected.callback)!=='undefined') 
					this.selected.callback.apply(this.selected.context);
				break;
		}
		
		return true;
		
	};
	
	/*
	 * refresh menu, redraw canvas
	 */
	CMenu.prototype.refresh = function () {
		
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
	CMenu.prototype.up   = function () { 
		
	    this.data.pop(); 
	    this.refresh(); 
	    
	};
	
	/*
	 * Shift elements down and redraw
	 */
	CMenu.prototype.down = function () { 
		
	    this.data.poprev(); 
	    this.refresh(); 
	    
	};
	
	/*
	 * hide menu, slide to left and fade
	 */
	CMenu.prototype.slideToLeft = function (x) {
		
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
	CMenu.prototype.slideToRight = function (x) {
		
		this.canvas.moveTo(1,false);
		this.canvas.setStyle('opacity',1);
		
		this.visible = true;
		
	};
	
	/* 
	 * show menu
	 */
	CMenu.prototype.show = function () { this.slideToRight(); };
	
	/*
	 * hide menu 
	 */	
	CMenu.prototype.hide = function()  {
		this.focused = false;
		this.slideToLeft(this.el[Math.round(this.iitems/2)].getCoords()[2]); 
	};
	
};

//------------------------------------------------------------------------
