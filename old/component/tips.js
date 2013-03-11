//------------------------------------------------------------------------

/*
 * Tip, GUI DOM element
 */	

if (!(Tips instanceof Object)) {

	var Tips = function () {
		
		this.visible = false;
		
	};
	
	/*
	 * create and show gui element
	 * params:
	 * id - element id will be created
	 * where_to, if is set element will be appended to this DOM element
	 */
	Tips.prototype.create = function (id, where_to) {
		
		this.id = id;
		
		this.canvas = mjdevjs.me(mjdevjs.DOM_TYPE_DIV, id, 'epg_tips',where_to);

		// should be visible
		this.visible = true;
		
	};
	
};

//--------------------------------
