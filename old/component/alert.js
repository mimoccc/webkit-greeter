//------------------------------------------------------------------------

/*
 * Alert popup gui element
 */

if (!(Alert instanceof Object)) {

	var Alert = function () {

		this.visible 	= false;
		this.renderedTo = false;

	};

	/*
	 * 
	 */
	Alert.prototype.create = function (id, where_to) {

		mjdevjs.requireComponent('CollapsibleList', function() {

			this.id = id;
			this.renderedTo = where_to;

			this.canvas			= mjdevjs.me(mjdevjs.DOM_TYPE_DIV, id, 'alert', where_to);
			this.canvas.hide();
			this.window			= mjdevjs.me(mjdevjs.DOM_TYPE_DIV, 'window', 'alert_window', this.canvas);
			this.window_label	= mjdevjs.me(mjdevjs.DOM_TYPE_DIV, 'label', 'alert_label', this.window);

			this.window_label.innerHTML = 'Alert';

			this.messages = new CollapsibleList('messages', this.window);

			this.add = function (mixed) { this.messages.add(mixed); };

		}, this);

	};

	/*
	 * remove rendered element from canvas where it were rendered
	 */

	Alert.prototype.show = function () {

		if(!this.visible) {

			this.canvas.show();
			// register for events
			mjdevjs.onKeyDown.subscribe(this.onKey, this, this.id);
			mjdevjs.onKeyDown.lockAll(this.id);
			this.visible = true;

		}

	};

	Alert.prototype.hide = function () {

		if(this.visible) {

			this.canvas.hide();
			mjdevjs.onKeyDown.unsubscribe(this.id);
			mjdevjs.onKeyDown.unLockAll();
			this.visible = false;

		}

	};

	Alert.prototype.destroy = function () { 

		this.hide();

		if(this.renderedTo){

			this.renderedTo.removeChild(this.canvas);
			this.renderedTo = false;

		}

	};

	// handle key event
	// event need to return boolean value if it is sucessfuly finished or false to give control to app
	Alert.prototype.onKey		= function (key) {

		switch (KBD_MAP.getKeyName(key)) {

			case 'VK_ESCAPE' : // esc
				this.hide();
				break;

			case 'VK_BACK' : // esc
				this.hide();
				break;

			case 'VK_ENTER' : // enter/ok
				this.hide();
				break;

		}

		return false;

	};

};

//------------------------------------------------------------------------
