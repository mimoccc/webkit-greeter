//------------------------------------------------------------------------

if (!(Clock instanceof Object)) {

	var Clock = function () {
		this.id			= mjdevjs.createUUID();
		this.visible 	= false;
		this.draggable  = true; 
		this.require	= [
			'jquery-ui-1.8.16.custom.min.js'
		];
		this.css		= {
			component : {
				position	: 'absolute',
				right		: '32px', 
				top			: '70px',
				width		: '200px', 
				height		: '127px',
				background	: 'url("component/clock/img/MIUIDIGI-black.png") no-repeat',
			},
			txt : {
				color			: 'rgba(200,200,200,0.9)',
				overflow		: 'hidden',
				padding_left	: '32px',
				padding_right	: '32px',
				padding_top		: '26px',
				height			: '60px',
			},
			txt1 : {
				color			: 'rgba(200,200,200,0.9)',
				overflow		: 'hidden',
				clear			: 'both',
				margin_left		: '16px',
				margin_right	: '16px',
				margin_top		: '10px',
			},
			text : {
				color 		: 'rgba(200,200,200,0.9)',
				font_size	: '40px',
				text_shadow	: '2px 2px 2px #888',
			},
			theme : {
				color		: 'rgba(200,200,200,0.9)', 
				position	: 'absolute', 
				right		: '0', 
				top			: '0', 
				left		: '0',
				bottom		: '0',
				width		: '200px', 
				height		: '127px',
			}
		};
		return this;
	};

	Clock.prototype.create = function (custom_config) {
		mjdevjs.config(this, (custom_config,this.config));
		this.canvas	  = $('<div/>')
						.attr('id',this.id)
						.attr('style', mjdevjs.style(this.css.component)) 
						.addClass((this.draggable)?'ui-draggable':'')
        				.appendTo((this.append||mjdevjs.get_canvas()));
		this.canvas.hide();
		this.txt	  = $('<div/>')
						.attr('id','txt')
						.attr('style', mjdevjs.style(this.css.txt))
						.appendTo((this.canvas||mjdevjs.get_canvas()));
		this.txt1	  = $('<div/>')
						.attr('id','txt1')
						.attr('style', mjdevjs.style(this.css.txt1))
						.appendTo((this.canvas||mjdevjs.get_canvas()));
		this.theme	  = $('<div/>')
						.attr('id','theme')
						.attr('style', mjdevjs.style(this.css.theme))
						.appendTo((this.canvas||mjdevjs.get_canvas()));
		if(this.draggable) this.canvas.draggable();
		return this;
	};

	Clock.prototype.update = function () {
		if (!this.visible) return;
		var dt = new Date();
		this.txt.html('<div id="text" style="float:left;'+ mjdevjs.style(this.css.text) +'">'+dt.to00(dt.getHours(),2) + '</div><div id="text" style="float:right;'+ mjdevjs.style(this.css.text) +'">' + dt.to00(dt.getMinutes(),2)+'</div>');
		this.txt1.html('<div id="text1">'+dt.toLocaleDateString()+'</div>');
		return this;
	};

	Clock.prototype.show = function () { 
		if (!this.visible) {
			this.canvas.show(); 
			this.visible = true;
			this.update();
			this.interval = window.setInterval(mjdevjs.contextfnc(this.update, this), 1000);
		}
		return this;
	};

	Clock.prototype.hide = function () { 
		if (this.visible) {
			window.clearInterval(this.interval);
			this.canvas.hide();
			this.visible = false;
		}
		return this;
	};

};

//------------------------------------------------------------------------