//------------------------------------------------------------------------

if (!(Footer instanceof Object)) {

	var Footer = function (config) {

		this.id			= mjdevjs.createUUID();
		this.renderTo	= mjdevjs._body;
		this.visible 	= false;

		mjdevjs.config(this, config);

	};

	/*
	 * create and show gui element
	 * params:
	 * id - element id will be created
	 * where_to, if is set element will be appended to this DOM element
	 */
	Footer.prototype.create = function () {
		this.canvas	  = mjdevjs.me({type:mjdevjs.DOM_TYPE_DIV, id:this.id,  append:this.append, class:'footer ui-draggable' });
		this.canvas.hide();
		this.bg1	= mjdevjs.me({type:mjdevjs.DOM_TYPE_DIV, id:'bar', class:'bar', append:this.canvas});
		this.txt	= mjdevjs.me({type:mjdevjs.DOM_TYPE_DIV, id:'txt', class:'bar_txt', append:this.bg1});
		this.txt.html('statusbar');
	};

	Footer.prototype.show = function () {
		if (!this.visible) {
			this.canvas.show(); 
			this.visible = true;
		}
	};

	Footer.prototype.hide = function () {
		if (this.visible) {
			this.canvas.hide(); 
			this.visible = false;
		}
	};

};

//------------------------------------------------------------------------