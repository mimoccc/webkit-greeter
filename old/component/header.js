//------------------------------------------------------------------------

if (!(Header instanceof Object)) {

	var Header = function (config) {

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
	Header.prototype.create = function () {

		this.canvas	= mjdevjs.me(mjdevjs.DOM_TYPE_DIV, this.id, 'header', this.renderTo);
		this.canvas.hide();
		this.bg1	= mjdevjs.me(mjdevjs.DOM_TYPE_DIV, 'bar', 'bar', this.canvas);
		this.txt	= mjdevjs.me(mjdevjs.DOM_TYPE_DIV, 'txt', 'clock_txt', this.bg1);

	};

	Header.prototype.show = function () {

		if (!this.visible) {

			this.canvas.show(); 
			this.visible = true;

		}

};

	Header.prototype.hide = function () {

		if (this.visible) {

			this.canvas.hide(); 
			this.visible = false;

		}

	};

};

//------------------------------------------------------------------------
