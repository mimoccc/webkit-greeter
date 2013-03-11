//------------------------------------------------------------------------

/*
 * TOP Navigation
 */

if (!(TopNav instanceof Object)) {

	var TopNav = function () {
		this.logo_img = new Image();
	};
	
	/*
	 * create and show gui element
	 * params:
	 * id - element id will be created
	 * where_to, if is set element will be appended to this DOM element
	 */
	TopNav.prototype.create = function (id, where_to) {
		this.canvas = mjdevjs.me(mjdevjs.DOM_TYPE_DIV, id, 'epg_top_nav', where_to);
		this.logo	= mjdevjs.me(mjdevjs.DOM_TYPE_IMG, 'logo', 'epg_top_nav_logo', this.canvas);
	};
	
	/*
	 * set logo
	 */
	TopNav.prototype.set_logo = function (img_url) {
		this.logo_img.src = img_url;
		this.logo.src = img_url; 
	};
	
};

//------------------------------------------------------------------------
