//------------------------------------------------------------------------

if (!(Label instanceof Object)) {

	var Label = function (config) {
		this.id			= mjdevjs.createUUID();
		this.name		= '';
		this.renderTo	= mjdevjs._body;
		this.visible 	= false;
		this.draggable  = false; 
		this.require	= [];
		this.css		= {
			component : {
				position		: 'absolute',
				left			: '10px', 
				top				: '30px',
				padding_left	: '45px',
			},
			txt : {
				font_size		: '20px',
				font_weight		: 'bold',
				color			: 'rgba(255,255,255,0.9)',
				text_shadow		: '1px 1px 0 #000000'
			}
		};
		
		mjdevjs.config(this, config);
		
	};

	Label.prototype.create = function () {
		this.canvas	  = mjdevjs.me({type:mjdevjs.DOM_TYPE_DIV, id:this.id, style: mjdevjs.style(this.css.component), append:this.append, class:(this.draggable)?'ui-draggable':'' });
		this.canvas.hide();
		this.jqe	  = $('#'+this.id)
		this.txt	  = mjdevjs.me({type:mjdevjs.DOM_TYPE_DIV, id:'txt',   style: mjdevjs.style(this.css.txt),   append:this.canvas});
		if(this.draggable) this.jqe.draggable();
	};

	Label.prototype.show = function () { 
		if (!this.visible) {
			this.canvas.show(); 
			this.visible = true;
		}
	};

	Label.prototype.setText = function (text) { this.txt.innerHTML = text; };

	Label.prototype.hide = function () { 
		if (this.visible) {
			this.canvas.hide();
			this.visible = false;
		}
	};

};

//------------------------------------------------------------------------
