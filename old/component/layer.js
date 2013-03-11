//------------------------------------------------------------------------

/*
 * Layer, GUI DOM
 */	

if (!(Layer instanceof Object)) {

	var Layer = function () {
		
		this.visible = false;
		
	};
	
	/*
	 * create and show gui element
	 * params:
	 * id - element id will be created
	 * where_to, if is set element will be appended to this DOM element
	 * mixed_ciontent, see remarks bellow
	 * css
	 * style
	 */
	Layer.prototype.create = function (id, where_to, mixed_content, css, style) {
		
		this.id = id;
		this.renderedTo = where_to;
		
		this.canvas = mjdevjs.me(mjdevjs.DOM_TYPE_DIV, id, (css||''), where_to);

		this.setContent(mixed_content);
		
		this.canvas.setEStyle((style||''));
		
		//this.canvas.fadeIn(32,1,function() { 
		this.visible = true; 
		//});

	};
	
	Layer.prototype.moveTo = function (x,y) { this.canvas.moveTo(x,y); };
	
	Layer.prototype.resizeTo = function (w,h) { 
		this.canvas.resizeTo(w,h); 
	};
	
	Layer.prototype.setContent = function (mixed_content) { 
		
		try {
		
			if(typeof(mixed_content)==='string') // normal string with html content
				this.canvas.innerHTML = mixed_content;
			else
				if(typeof(mixed_content)==='function') // function which returns html content
					this.canvas.innerHTML = mixed_content();
				else
					if(typeof(mixed_content)==='object') // DOM Element
						this.canvas.appendChild(mixed_content);
			
		} catch (e) { this.canvas.innerHTML = e; }
		
	};
	
	/*
	 * remove rendered element from canvas where it were rendered
	 */
	
	Layer.prototype.destroy = function () {

		if(this.renderedTo){
			this.canvas.fadeOut(32,1,function(){
				
				this.renderedTo.removeChild(this.canvas);
				this.renderedTo = false;
				this.visible = false;
				
			},this);
		}
		
	};


	
};

//------------------------------------------------------------------------
