//------------------------------------------------------------------------

/*
 * ProgressBar, GUI DOM element
*/	

if (!(ProgressBar instanceof Object)) {

	var ProgressBar = function () { this.visible = false; };
	
	/*
	 * create and show gui element
	 * params:
	 * id - element id will be created
	 * where_to, if is set element will be appended to this DOM element
	 */
	ProgressBar.prototype.create = function (id, where_to) {

		this.id = id;
		this.renderedTo = where_to;
		
		this.canvas 	= mjdevjs.me(mjdevjs.DOM_TYPE_DIV,  id,      'epg_progressbar', where_to);
		this.progress	= mjdevjs.me(mjdevjs.DOM_TYPE_SPAN, 'meter', 'epg_pgbar_pg'   , this.canvas);
	
		// should be visible
		this.visible = true;
		
	};
	
	ProgressBar.prototype.update	= function (percent)	{ this.progress.setStyle('width', percent+'%'); };
	
	ProgressBar.prototype.setColor	= function (color)		{ this.progress.setStyle('background', color); };
	
	ProgressBar.prototype.moveTo	= function (x, y)		{ this.canvas.moveTo(x,y); };
	
	ProgressBar.prototype.setWidth	= function (w)			{ this.canvas.resizeTo(w,false); };
	
	ProgressBar.prototype.setHeight	= function (h)			{ this.canvas.resizeTo(false,h); };
	
	ProgressBar.prototype.resizeTo	= function (w, h)		{ this.canvas.resizeTo(w,h); };
	
	ProgressBar.prototype.hide		= function (w)			{ this.renderedTo.removeChild(this.canvas); this.visible = false;};

	ProgressBar.prototype.destroy	= function (w)			{ this.hide(); };

};

//------------------------------------------------------------------------
