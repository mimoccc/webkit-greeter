//------------------------------------------------------------------------

if (!(SlideShow instanceof Object)) {

	var SlideShow = function (config) {
		this.id			= mjdevjs.createUUID();
		this.renderTo	= mjdevjs._body;
		this.visible 	= false;
		mjdevjs.config(this, config);
	};

	SlideShow.prototype.create = function () {
		this.canvas	  = mjdevjs.me({type:mjdevjs.DOM_TYPE_DIV, id:this.id,  append:this.append, class:'ui-draggable' });
		this.canvas.hide();
		this.visible 	= false;
	};

	SlideShow.prototype.show = function () { 
		if (!this.visible) {
			this.canvas.show(); 
			this.visible = true;
		}
	};

	SlideShow.prototype.hide = function () { 
		if (this.visible) {
			this.canvas.hide();
			this.visible = false;
		}
	};

};

//------------------------------------------------------------------------