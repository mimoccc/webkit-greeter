//------------------------------------------------------------------------

/*
 * Alert popup gui element
 */

if (!(GMenu instanceof Object)) {

	var GMenu = function (config) {

		this.id = mjdevjs.createUUID();
		this.renderTo = mjdevjs._body;

		this.visible 	= false;
		this.itemWidth = 320;
		this.itemHeight = 240;
		this.data		= new Array();
		this.cols = 0;
		this.rows = 0;
		this.cx = 0;
		this.cy = 0;

		mjdevjs.config(this, config);

	};

	GMenu.prototype.create = function () {

		this.canvas	 = mjdevjs.me(mjdevjs.DOM_TYPE_DIV, this.id, 'gmenu', this.renderTo);
		this.canvas.hide();
		
		//this.canvas.setStyle('overflow','hidden');
		//this.canvas.resizeTo(this.itemWidth*1.2,this.itemHeight*1.2);

		//this.canvas1 = mjdevjs.me(mjdevjs.DOM_TYPE_DIV, 'canvas', 'gmenu_canvas', this.canvas);
		//this.canvas1.resizeTo(this.itemWidth*(this.cols+1),this.itemHeight*(this.rows+1));

		//this.label = mjdevjs.me(mjdevjs.DOM_TYPE_DIV, 'label', 'gmenu_label', this.canvas);
		//this.label.resizeTo(this.itemWidth*1.2,false);
		//this.label.html('&nbsp;test');

		//if(this.data.length<1) return;

		//for(var i=0; i<this.data.length; i++) {

			//if(typeof(this.data[i])==='function') continue;

			//if (this.data[i] instanceof Array){

				//var el = mjdevjs.me(mjdevjs.DOM_TYPE_DIV, 'item', 'gmenu_item', this.canvas1);
				//el.setStyle('cssFloat','left');
				//this.data[i].el = el;

				//for(var j=0; j<this.data[i].length; j++){

					//if(this.data[i][j] instanceof Object){

						//var el1 = mjdevjs.me(mjdevjs.DOM_TYPE_DIV, 'item', 'gmenu_item', el);
						//el1.setStyle('clear','both');
						//var img = mjdevjs.me(mjdevjs.DOM_TYPE_IMG, 'img', 'gmenu_img', el1);
						//img.src = this.data[i][j].img;
						//this.data[i][j].el = el1;
						//el1.resizeTo(this.itemWidth,this.itemHeight);

					//}

				//}

			//} else if (this.data[i] instanceof Object){

				//var el = mjdevjs.me(mjdevjs.DOM_TYPE_DIV, 'item', 'gmenu_item', this.canvas1);
				//el.setStyle('cssFloat','left');
				//var img = mjdevjs.me(mjdevjs.DOM_TYPE_IMG, 'img', 'gmenu_img', el);
				//img.src = this.data[i].img;
				//this.data[i].el = el;
				//el.resizeTo(this.itemWidth,this.itemHeight);

			//}

		//}

		//this.canvas.center(this.renderedTo);

	};

	GMenu.prototype.add = function (id, label, img, callback, context) {

		var ii = {'id':id, 'label':label, 'img':img, 'callback':callback, 'context':context};

		if (id in this.data) {

			if (!(this.data[id] instanceof Array)) {

				var i = new Array();
				i.push(this.data[id]);
				i.push(ii);
				this.data[id] = i;

			} else 	this.data[id].push(ii);

			if(this.rows<this.data[id].length) this.rows=this.data[id].length

		} else {

			this.data[id] = ii;
			this.cols = this.data.length;
			if(this.rows==0) this.rows = 1;

		}

	};

	/*
	 * remove rendered element from canvas where it were rendered
	 */

	GMenu.prototype.show = function () {

		if(!this.visible) {

			//this.canvas.scrollTo(0,0);
			this.canvas.show();
			// register for events
			//mjdevjs.onKeyDown.subscribe(this.onKey, this, this.id);
			//mjdevjs.onKeyDown.lockAll(this.id);
			this.visible = true;

		}

	};

	GMenu.prototype.hide = function () {

		if(this.visible) {

			this.canvas.hide();
			//mjdevjs.onKeyDown.unsubscribe(this.id);
			//mjdevjs.onKeyDown.unLockAll();
			this.visible = false;

		}

	};

	GMenu.prototype.down = function () {

		if (this.cy==this.rows) return;

		if(this.visible) {

			this.cy++;
			this.canvas.scrollTo(false, this.cy*this.item_height);

		}

	};

	GMenu.prototype.up = function () {

		if (this.cy==0) return;

		if(this.visible) {

			this.cy--;
			this.canvas.scrollTo(false, this.cy*this.item_height);

		}

	};

	GMenu.prototype.left = function () {

		if(this.visible) {

			this.cx--;
			if(this.cx<0) this.cx=0;
			this.cy = 0;
			this.data[this.cx].el.show();
			//this.data[this.cx].el.setOpacity(0);
			//this.data[this.cx].el.fadeIn(120,1);

		}

	};

	GMenu.prototype.right = function () {

		if(this.visible) {
			
			//this.data[this.cx].el.fadeOut(120,1,
			this.data[this.cx].el.hide();
			//,this.data[this.cx].el);
			this.cx++;
			if(this.cx>this.cols) this.cx=this.cols;
			this.cy = 0;
			this.data[this.cx].el.show();
			//this.data[this.cx].el.setOpacity(0);
			//this.data[this.cx].el.fadeIn(120,1);

		}

	};

	GMenu.prototype.destroy = function () { 

		this.hide();

		if(this.renderedTo){

			this.renderedTo.removeChild(this.canvas);
			this.renderedTo = false;

		}

	};

	// handle key event
	// event need to return boolean value if it is sucessfuly finished or false to give control to app
	GMenu.prototype.onKey		= function (key) {

		switch (KBD_MAP.getKeyName(key)) {

			case 'VK_ESCAPE' : // esc
				this.hide();
				break;

			case 'VK_BACK' : // esc
				this.hide();
				break;

			case 'VK_LEFT' : // esc
				this.left();
				break;

			case 'VK_RIGHT' : // esc
				this.right();
				break;

			case 'VK_UP' : // esc
				this.up();
				break;

			case 'VK_DOWN' : // esc
				this.down();
				break;

			case 'VK_ENTER' : // enter/ok
				this.hide();
				this.run_selected();
				break;

		}

		return false;

	};

};

//------------------------------------------------------------------------
