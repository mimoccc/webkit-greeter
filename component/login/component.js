//------------------------------------------------------------------------

/*
 * Login, GUI DOM element to show login screen
 */

if (!(Login instanceof Object)) {

	var Login = function (config) {

		this.id = mjdevjs.createUUID();
		this.renderTo = mjdevjs._body;
		this.visible		= false;
		this.focused		= true;
		this.enabled		= true;
		this.context		= this;
		this.callback		= false;
		this.draggable		= false;
		
		this.require	= [
			'jquery-ui-1.8.16.custom.min.js'
		];
		
		this.css		= {
			component		: { 
				position	: 'absolute' 
			},
			row_full_width : { 
				width	: '100%', 
				float	: 'left'
			},
			one_of_two	: { float: 'left' }, 
			two_of_two  : { float: 'left' },
			section : { 
				width	: '1000px',
				margin	: '0 auto' 
			},
			carousel		: { 
				margin		: '25px 0 50px',
				overflow	: 'hidden',
				position	: 'relative'
			},
			carousel_clip	: {
				overflow: 'hidden', 
				position: 'relative'
			},
			carousel_arrow : { 
				position	: 'absolute',
				top			: '0',
				width		: '310px',
				height		: '373px',
				background	: 'url(img/arrow.png) no-repeat scroll 0 0 transparent',
				text_indent	: '-999px',
				cursor		: 'pointer',
				display		: 'block'
			},
			carousel_back : { 
				background_position	: '0 0',
				top					: '-135px',
				left				: '0' 
			},
			carousel_forward : { 
				background_position : '-310px 0',
				top					: '-135px',
				right				: '0'
			},
			carousel_list	: {
				overflow	: 'hidden', 
				position	: 'relative',
				top			: '0',
				margin		: '0px', 
				padding		: '0',
				left		: '-320px',
				width		: '3300px;'
			},

			
			
			carousel_img	: { 
				box_shadow	: '0 0 5px rgb(0, 0, 0)' 
			},
			carousel_ul_li	: { 
				width		: '300px', 
				height		: '200px',
				padding		: '10px',
				float		: 'left',
				list_style	: 'none outside none'
			},
			
			user_embed	: {
				background:'#202020',
				width:'600px'
			},
			
			username : {
				font_weight	: 'bold',
				font_size	: '32px',
				color		: 'rgba(240,240,240,.7)',
				height		: '34px',
				margin		: '0',
				padding		: '0',
				text_shadow	: '0 -1px 1px #3D0700'
			},
			usertype : {
				font_weight	: 'bold',
				font_size	: '10px',
				color		: 'rgba(240,240,240,.5)',
				height		: '16px',
				margin		: '0',
				padding		: '0'
			},
			userdetails : {
				position		: 'absolute',
				right			: '10px',
				top				: '10px',
				left			: '310px',
				height			: '200px',
				background		: 'rgba(0,0,0,0.4)',
				box_shadow		: '0 0 5px #000000',
				padding_left	: '6px'
			},
			user_menu : {
				height			: '132px',
				background		: 'rgba(0,0,0,0.4)',
				margin_top		: '4px',
				margin_left		: '-10px',
				margin_right	: '-10px',
				display 		: 'none'
			},
			user_menu_toogle : {
				height			: '12px',
				background		: 'rgba(0,0,0,0.4)',
				margin_top		: '6px',
				margin_left		: '-10px',
				margin_right	: '-10px',
				font_size		: '10px',
				font_weight		: 'bold',
				color			: 'rgba(255,255,255,0.6)',
				cursor			: 'pointer'
			},
			password : {
				width:'90%'
			
			}
		};
		
		mjdevjs.config(this, config);

		// base logon object if doesnt exists
		if (typeof(window.logon)==='undefined') window.logon = {};

		// if no history
		if ((typeof(window.logon.users)==='undefined') || (window.logon.users==null)) {
			
			window.logon.users = [];

			// for new login, not in history
			for(var i=0; i<5; i++)
			window.logon.users[i] = {
				id : 0,
				name : 'new login',
				photo : 'data/users/mimo.png',
				password : 'x',
				g_name:'no priviledge',
				details:'this user have no details, it is here to add a new user to os.',
				toString : function () {
					var ret = "";
					ret += this.id + ":";
					ret += this.password+ ":";
					ret += this.name;
					return ret;
				}
			};
		}
	};

	Login.prototype.create = function () {

		this.canvas		= mjdevjs.me({type:mjdevjs.DOM_TYPE_DIV, id:this.id, style:mjdevjs.style(this.css.row), append:this.append, class:(this.draggable)?'ui-draggable':''});
		this.canvas.hide();
		
		this.jqe	  = $('#'+this.id)
		if(this.draggable) this.jqe.draggable();
		
		this.section		= mjdevjs.me({type:mjdevjs.DOM_TYPE_DIV, id:'section', append:this.canvas, style:mjdevjs.style(this.css.section)});
		
		this.carousel		= mjdevjs.me({
			type	: mjdevjs.DOM_TYPE_DIV,
			id		: 'carousel',
			class	: 'jcarousel-container',
			style	: mjdevjs.style(this.css.carousel),
			append	: this.section
		});
		
		this.carousel_clip	= mjdevjs.me({
			type	: mjdevjs.DOM_TYPE_DIV,
			id		: 'carousel_clip',
			class	: 'jcarousel-clip',
			style	: mjdevjs.style(this.css.carousel_clip),
			append	: this.carousel
		});
		
		this.carousel_list		= mjdevjs.me({
			type:mjdevjs.DOM_TYPE_UL,
			id:'slides',
			class	: 'jcarousel-list',
			style:mjdevjs.style(this.css.carousel_list),
			append:this.carousel_clip
		});
		
		this.recreate_users();

		this.button_prev		= mjdevjs.me({
			type	: mjdevjs.DOM_TYPE_DIV,
			style	: mjdevjs.style(this.css.carousel_arrow) + mjdevjs.style(this.css.carousel_back),
			class	: 'jcarousel-prev',
			append	: this.carousel
		});
		
		this.button_next		= mjdevjs.me({
			type:mjdevjs.DOM_TYPE_DIV,
			style	: mjdevjs.style(this.css.carousel_arrow) + mjdevjs.style(this.css.carousel_forward),
			class	: 'jcarousel-next',
			append	: this.carousel
		});

		this.carousel_list = false;

	};

	Login.prototype.recreate_users = function (){
		
		this.carousel_first		= mjdevjs.me({
			type:mjdevjs.DOM_TYPE_LI,
			style:mjdevjs.style(this.css.carousel_ul_li),
			append:this.carousel_list
		});
		
		this.carousel_item = [];
		
		for(var i=0; i<logon.users.length; i++) {
			if (typeof(logon.users[i])==='object') {
			
				this.carousel_item[i] = mjdevjs.me({
					type:mjdevjs.DOM_TYPE_LI,
					style:mjdevjs.style(this.css.carousel_ul_li),
					append:this.carousel_list
				});
				
				this.carousel_item[i].a = mjdevjs.me({
					type:mjdevjs.DOM_TYPE_A,
					href:'#embed-'+(i+2),
					title:logon.users[i].name,
					style:'float: left; list-style: none outside none;',
					class:'thumbnail-frame excerpt-text user',
					append:this.carousel_item[i]
				});
				
				this.carousel_item[i].img = mjdevjs.me({
					type:mjdevjs.DOM_TYPE_IMG,
					src:logon.users[i].photo,
					class:'attachment-post-thumbnail wp-post-image',
					alt:logon.users[i].name,
					title:logon.users[i].name,
					height:200,
					width:300,
					append:this.carousel_item[i]
				});
				
				this.carousel_item[i].login_form = mjdevjs.me({
					type:mjdevjs.DOM_TYPE_DIV,
					style : 'display : none',
					append:this.carousel_item[i]
				});
				
				this.carousel_item[i].login_form.canvas = mjdevjs.me({
					type:mjdevjs.DOM_TYPE_DIV,
					id:"embed-"+(i+2),
					style:mjdevjs.style(this.css.user_embed),
					append:this.carousel_item[i].login_form,
					idx: i
				});
				
				this.carousel_item[i].login_form.details = mjdevjs.me({
					type	: mjdevjs.DOM_TYPE_DIV,
					style	: mjdevjs.style(this.css.userdetails),
					html	: logon.users[i].details,
					append	: this.carousel_item[i].login_form.canvas
				});
				
				this.carousel_item[i].img = mjdevjs.me({
					type:mjdevjs.DOM_TYPE_IMG,
					src:logon.users[i].photo,
					style	: mjdevjs.style(this.css.carousel_img),
					class:'shadowed',
					alt:logon.users[i].name,
					title:logon.users[i].name,
					height:200,
					width:300,
					append:this.carousel_item[i].login_form.canvas
				});
				
				this.carousel_item[i].username = mjdevjs.me({
					type	: mjdevjs.DOM_TYPE_P,
					style	: mjdevjs.style(this.css.username),
					alt		: logon.users[i].name,
					title	: logon.users[i].name,
					html	: '<b>'+logon.users[i].name+'</b>',
					append:this.carousel_item[i].login_form.canvas
				});
				
				this.carousel_item[i].usergroup = mjdevjs.me({
					type	: mjdevjs.DOM_TYPE_P,
					style	: mjdevjs.style(this.css.usertype),
					alt		: '('+logon.users[i].g_name+')',
					title	: '('+logon.users[i].g_name+')',
					html 	: '<b>('+logon.users[i].g_name+')</b>',
					append	: this.carousel_item[i].login_form.canvas
				});
				
				this.carousel_item[i].password = mjdevjs.me({
					type:mjdevjs.DOM_TYPE_PASSWORD,
					id:"password"+(i+2),
					name:"password"+(i+2),
					style	: mjdevjs.style(this.css.password),
					value:'',
					onfocus:function(){alert(this.id);},
					append:this.carousel_item[i].login_form.canvas
				});
				
				this.carousel_item[i].login_button = mjdevjs.me({
					type:mjdevjs.DOM_TYPE_BUTTON,
					id:"login_button",
					class:"slick-black",
					onclick:'logon.users['+i+'].password = $("#password'+(i+2)+'").val(); document.title = "login:"+ logon.users['+i+'].toString();',
					html : 'login',
					append:this.carousel_item[i].login_form.canvas
				});
				
				this.carousel_item[i].message_button = mjdevjs.me({
					type:mjdevjs.DOM_TYPE_BUTTON,
					id:"message_button",
					class:"slick-black",
					//onclick:'',
					html : 'message',
					append:this.carousel_item[i].login_form.canvas
				});
				
				this.carousel_item[i].contact_button = mjdevjs.me({
					type:mjdevjs.DOM_TYPE_BUTTON,
					id:"contact_button",
					class:"slick-black",
					onclick:'',
					html : 'contact',
					append:this.carousel_item[i].login_form.canvas
				});

				this.carousel_item[i].user_menu_toogle = mjdevjs.me({
					type	: mjdevjs.DOM_TYPE_DIV,
					id		: "user_menu_toogle_"+i,
					style	: mjdevjs.style(this.css.user_menu_toogle),
					//onclick	: '',
					html 	: '+ details',
					append	: this.carousel_item[i].login_form.canvas
				});

				this.carousel_item[i].user_menu_toogle.visible = false;
				this.carousel_item[i].user_menu_toogle.index   = i;
				this.carousel_item[i].user_menu_toogle.onclick = function(){
					if(this.visible){
						$("#user_menu_"+this.index).hide("slow");
						$("#user_menu_toogle_"+this.index).html("+ details");
						$("#fancybox-content").css("height", parseInt(($("#fancybox-content").css("height")))-136);
						$.fancybox.center();
						this.visible = false;
					}else{
						$("#fancybox-content").css("height", parseInt(($("#fancybox-content").css("height")))+136);
						$("#user_menu_toogle_"+this.index).html("- details");
						$("#user_menu_"+this.index).show("slow");
						$.fancybox.center();
						this.visible = true; 
					}
				};

				this.carousel_item[i].user_menu = mjdevjs.me({
					type:mjdevjs.DOM_TYPE_DIV,
					id:"user_menu_"+i,
					style	: mjdevjs.style(this.css.user_menu),
					//onclick:'',
					html : '',
					append:this.carousel_item[i].login_form.canvas
				});
			}
		}
		
		// create last empty element
		this.carousel_last		= mjdevjs.me({
			type:mjdevjs.DOM_TYPE_LI,
			style:mjdevjs.style(this.css.carousel_ul_li),
			append:this.carousel_list
		});

	};

	Login.prototype.hide = function (callback, context) {
		this.canvas.fadeOut (32,1,function() {
			this.canvas.hide();
			this.visible = false;
		},this);
	}

	Login.prototype.show = function () {
		this.canvas.show();
		this.visible = true;
		
		$("#"+this.carousel.id).jcarousel({
			wrap: 'both',
			scroll: 1,
			start: 1,
			auto: 0,
			animation: 'slow',
			vertical : false,
			size : logon.users.length+2,
			//itemLoadCallback: function(){
			
				//for (var i = carousel.first; i <= carousel.last; i++) {
			        //if (!carousel.has(i)) {
			            //carousel.add(i, "I'm item #" + i);
			        //}
			    //}
			
			//}
		});
		
// todo: implement in object scope		
		$("a.user").fancybox({
			width		: '600',
			height		: 'auto',
			transitionIn	: 'elastic',
			transitionOut	: 'elastic',
			autoDimensions	: false,
			overlayColor	: '#202020',
			overlayOpacity	: 0.9,
			padding		: '0',
			titleShow	: false,
			onStart		: function (selectedArray, selectedIndex, selectedOpts) {
				var objid 			= selectedArray[selectedIndex].toString();
				objid 				= objid.substr(objid.indexOf('#'));
				var obj				= $(objid);
				App.fancybox 		= selectedOpts;
				App.selected_user	= obj;
			},
			onClosed	:function () {
				App.selected_user	= false;
				document.title		= '';
			},
			onComplete	: function () {
				if(App.selected_user) {
					var obj = parseInt(App.selected_user.attr("idx"));
					if(!(typeof(obj)==='number')) return;
					obj = $('#password'+(obj+2));
					if(!(typeof(obj)==='object')) return;
					if(!(typeof(obj.focus)==='function')) return;
// todo: focus error					
					try { obj.focus(); } catch (e) {}
				}
			}
		});
	}

};

//------------------------------------------------------------------------