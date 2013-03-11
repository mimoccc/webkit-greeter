//------------------------------------------------------------------------

/*
 * Button, GUI DOM element
*/	

if (!(Button instanceof Object)) {

	var Button = function () {
		
		this.visible = false;
		this.focused = false;
		
	};
	
	/*
	 * create and show gui element
	 * params:
	 * id - element id will be created
	 * where_to, if is set element will be appended to this DOM element
	 */
	Button.prototype.create = function (id, where_to) {
		
		this.id = id;
		
		this.canvas = mjdevjs.me(mjdevjs.DOM_TYPE_DIV, id, 'epg_Button',where_to);
		this.bg1	= mjdevjs.me(mjdevjs.DOM_TYPE_DIV, 'bg1', 'epg_Button_bg1', this.canvas);
		this.bg2	= mjdevjs.me(mjdevjs.DOM_TYPE_DIV, 'bg2', 'epg_Button_bg2', this.canvas);

		// should be visible
		this.visible = true;
		
		// update time
		this.update();			
	
		// register for events
		//mjdevjs.registerHandler(this);
		
	};
	
	/*
	 * just to test
	 * 
	 * handle focus event
 	 * event need to return boolean value if it is sucessfuly focused 
	 */
	
	Button.prototype.onFocus		= function () {
		
		this.canvas.setStyle('border','solid rgb(0, 238, 34) 2px');
		return true;
		
	};
	
	// handle lost focus event
	// event need to return boolean value if it is sucessfuly focused
	Button.prototype.onUnFocus	= function () {
		
		this.focused = false;
		this.canvas.setStyle('border','');
		
		return true;
		
	};
	
	// handle key event
	// event need to return boolean value if it is sucessfuly finished or false to give control to app
	Button.prototype.onKey		= function (key) {
		
		switch (KBD_MAP.get_key_name(key)) {
		
			case 'VK_ESCAPE' : // esc
				this.onUnFocus();
				break;
				
			case 'VK_DOWN' : // down 
				break;
				
			case 'VK_UP' : // up 
				break;
				
			case 'VK_ENTER' : // enter/ok
				break;
				
		}
		
		return true;
	};
	
};

//------------------------------------------------------------------------
