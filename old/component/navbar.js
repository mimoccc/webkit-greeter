//------------------------------------------------------------------------

/*
 * Navigation bar, GUI DOM element to show status, events, location in app
 */	

if (!(NavigationBar instanceof Object)) {

	var NavigationBar = function () {
		
		this.visible = false;
		this.focused = false;
		
	};
	
	/*
	 * create and show gui element
	 * params:
	 * id - element id will be created
	 * where_to, if is set element will be appended to this DOM element
	 */
	NavigationBar.prototype.create = function (id, where_to) {
		
		this.id = id;
		
		this.canvas		= mjdevjs.me(mjdevjs.DOM_TYPE_DIV, id, 'epg_nav_bar', where_to);
		this.leftBg		= mjdevjs.me(mjdevjs.DOM_TYPE_DIV, 'left_bg','epg_nav_bar_left' , this.canvas);
		this.bar		= mjdevjs.me(mjdevjs.DOM_TYPE_DIV, 'bar', 'epg_nav_bar_text', this.canvas);
		this.rightBg	= mjdevjs.me(mjdevjs.DOM_TYPE_DIV, 'right_bg', 'epg_nav_bar_right', this.canvas);
		
		
		// should be visible
		this.visible = true;
		
	};
	
	/*
	 * set text to navigation / status bar
	 */
	
	NavigationBar.prototype.setText = function (text) { this.bar.innerHTML = text; }
	
};

//------------------------------------------------------------------------
