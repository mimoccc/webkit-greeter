//------------------------------------------------------------------------

if (!(Menu instanceof Object)) {

	var Menu = function (config) {
		this.id			= mjdevjs.createUUID();
		this.name		= '';
		this.renderTo	= mjdevjs._body;
		this.visible 	= false;
		this.draggable  = false; 
		this.require	= [];
		this.css		= {
			component : {
				position	: 'absolute',
				top			: '0',
				right		: '10px',
				border		: 'solid white 1px'
			}
		};
		
		mjdevjs.config(this, config);
		
	};

	Menu.prototype.create = function () {
		this.canvas	  = mjdevjs.me({type:mjdevjs.DOM_TYPE_DIV, id:this.id, style: mjdevjs.style(this.css.component), append:this.append, class:(this.draggable)?'ui-draggable':'' });
		this.canvas.hide();
		this.canvas.innerHTML = 'test menu';
		this.jqe	  = $('#'+this.id)
		if(this.draggable) this.jqe.draggable();
	};

	Menu.prototype.show = function () { 
		if (!this.visible) {
			this.canvas.show(); 
			this.visible = true;
		}
	};

	Menu.prototype.hide = function () { 
		if (this.visible) {
			this.canvas.hide();
			this.visible = false;
		}
	};

};

//------------------------------------------------------------------------
