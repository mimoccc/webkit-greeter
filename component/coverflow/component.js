//------------------------------------------------------------------------

if (!(CoverFlow instanceof Object)) {

	var CoverFlow = function () {
		this.visible 	= false;
		this.draggable  = true; 
		this.content 	= [];
		this.require	= [
			'js/jquery.roundabout.min.js',
			'js/jquery-ui-1.8.16.custom.min.js'
		];
		this.css		= {
			component : {
				position	: 'absolute',
				left		: '100px', 
				top			: '100px',
				width		: '150px', 
				height		: '100px',
				padding		: 0
			},
			roundabout_moveable_item : {
				width				: '150px',
				height				: '100px',
				cursor				: 'pointer',
				background_color	: 'rgba(0,0,0,1)',
				border				: '2px solid rgba(255,255,255,0.5)',
				box_shadow			: '0 0 5px #000000'
			},
			roundabout_in_focus : {  
				border		: '2px solid rgba(0,0,0,0.7)',
				box_shadow	: '0 0 8px #000000'
			}
		};
		return this;
	};

	CoverFlow.prototype.create = function (custom_config) {
		mjdevjs.config(this, (custom_config||this.config));
		mjdevjs.createCSS('.roundabout-in-focus', mjdevjs.style(this.css.roundabout_in_focus));
		this.canvas	  = $('<ul/>')
						.attr('id',(this.id||mjdevjs.createUUID()))
						.attr('style', mjdevjs.style(this.css.component)) 
						.addClass((this.draggable)?'ui-draggable':'')
		        		.appendTo((this.append||mjdevjs.get_canvas()));
		this.canvas.hide();
		$.each(this.content, mjdevjs.contextfnc(function(i){
			if (typeof(this.content[i])==='string') {
				$('<li/>')
				.attr('id',this.id)
				.attr('style', mjdevjs.style(this.css.roundabout_moveable_item)) 
				.html(this.content[i])
        		.appendTo(this.canvas);
			}
		}, this));
		
		if(this.draggable) this.canvas.draggable();
		require(this.require, mjdevjs.contextfnc(function(){
			this.canvas.roundabout();
			return this.canvas;
		},this));
		return this;
	};

	CoverFlow.prototype.show = function () { 
		if (!this.visible) {
			this.canvas.show(); 
			this.visible = true;
		}
		return this;
	};

	CoverFlow.prototype.hide = function () { 
		if (this.visible) {
			this.canvas.hide();
			this.visible = false;
		}
		return this;
	};

};

//------------------------------------------------------------------------