//------------------------------------------------------------------------

/*
 * NavTab, GUI DOM element 
 */	

if (!(NavTab instanceof Object)) {

	var NavTab = function () {
		this.visible = false;
		this.focused = false;
	};
	
	/*
	 * create and show gui element
	 * params:
	 * id - element id will be created
	 * where_to, if is set element will be appended to this DOM element
	 */
	NavTab.prototype.create = function (id, where_to) {

		this.id = id;
		this.canvas = mjdevjs.me(mjdevjs.DOM_TYPE_DIV, id, 'epg_clock',where_to);
		
	};

	
};

//------------------------------------------------------------------------
