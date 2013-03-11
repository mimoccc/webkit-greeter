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
				photo : 'users/mimo.png',
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

	/*
	 * create and show gui element
	 * params:
	 * id - element id will be created
	 * where_to, if is set element will be appended to this DOM element
	 */
	Login.prototype.create = function () {

		this.canvas		= mjdevjs.me({type:mjdevjs.DOM_TYPE_DIV, id:this.id, css:'row', append:this.append});
		this.canvas.setOpacity(0);
		this.canvas.hide();
		this.section		= mjdevjs.me({type:mjdevjs.DOM_TYPE_DIV, id:'section', append:this.canvas});
		this.carousel		= mjdevjs.me({
			type:mjdevjs.DOM_TYPE_DIV,
			id:'carousel',
			style:'overflow: hidden; position: relative;',
			class:'jcarousel-container jcarousel-container-horizonta',
			append:this.section
		});
		this.carousel_clip	= mjdevjs.me({
			type:mjdevjs.DOM_TYPE_DIV,
			id:'',
			style:'overflow: hidden; position: relative;',
			class:'jcarousel-clip jcarousel-clip-horizontal',
			append:this.carousel
		});

		this.recreate_users();

		this.button_prev		= mjdevjs.me({
			type:mjdevjs.DOM_TYPE_DIV,
			style:'display: block;',
			class:'arrow back hover jcarousel-prev jcarousel-prev-horizontal',
			append:this.carousel
		});
		this.button_next		= mjdevjs.me({
			type:mjdevjs.DOM_TYPE_DIV,
			style:'display: block;',
			class:'arrow forward hover jcarousel-next jcarousel-next-horizontal',
			append:this.carousel
		});

		this.carousel_list = false;

	};

	Login.prototype.recreate_users = function (){

		// remove dom elements
		if(this.carousel_list)	this.carousel_clip.removeChild(this.carousel_list);

		// create new dom element
		this.carousel_list		= mjdevjs.me({
			type:mjdevjs.DOM_TYPE_UL,
			id:'slides',
			style:'overflow: hidden; position: relative; top: 0px; margin: 0px; padding: 0px; left: -320px; width: 3300px;',
			class:'jcarousel-list jcarousel-list-horizontal',
			append:this.carousel_clip
		});
		// create first empty element
		this.carousel_first		= mjdevjs.me({
			type:mjdevjs.DOM_TYPE_LI,
			jcarouselindex:'1',
			style:'float: left; list-style: none outside none;',
			class:'jcarousel-item jcarousel-item-horizontal jcarousel-item-1 jcarousel-item-1-horizontal',
			append:this.carousel_list
		});

		this.carousel_item = [];

		// create all users, hide them and show only actual user
		for(var i=0; i<logon.users.length; i++) {

			if (typeof(logon.users[i])==='object') {
				// create last empty element
				this.carousel_item[i] = mjdevjs.me({
					type:mjdevjs.DOM_TYPE_LI,
					jcarouselindex:(i+2),
					style:'float: left; list-style: none outside none;',
					class:'jcarousel-item jcarousel-item-horizontal jcarousel-item-'+ (i+2) +' jcarousel-item-'+ (i+2) +'-horizontal',
					append:this.carousel_list
				});
				//name
				this.carousel_item[i].a = mjdevjs.me({
					type:mjdevjs.DOM_TYPE_A,
					href:'#embed-'+(i+2),
					title:logon.users[i].name,
					style:'float: left; list-style: none outside none;',
					class:'thumbnail-frame excerpt-text user',
					append:this.carousel_item[i]
				});
				//photo
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
				//login form
				this.carousel_item[i].login_form = mjdevjs.me({
					type:mjdevjs.DOM_TYPE_DIV,
					class:'hidden',
					append:this.carousel_item[i]
				});
				//login form canvas
				this.carousel_item[i].login_form.canvas = mjdevjs.me({
					type:mjdevjs.DOM_TYPE_DIV,
					id:"embed-"+(i+2),
					class:"video-embed",
					style:"background:#202020; width:600px;",
					append:this.carousel_item[i].login_form,
					idx: i
				});
				//user details
				this.carousel_item[i].login_form.details = mjdevjs.me({
					type:mjdevjs.DOM_TYPE_DIV,
					class:"userdetails",
					html : logon.users[i].details,
					append:this.carousel_item[i].login_form.canvas
				});
				//user photo
				this.carousel_item[i].img = mjdevjs.me({
					type:mjdevjs.DOM_TYPE_IMG,
					src:logon.users[i].photo,
					class:'shadowed',
					alt:logon.users[i].name,
					title:logon.users[i].name,
					height:200,
					width:300,
					append:this.carousel_item[i].login_form.canvas
				});
				//user name
				this.carousel_item[i].username = mjdevjs.me({
					type:mjdevjs.DOM_TYPE_P,
					class:'username',
					alt:logon.users[i].name,
					title:logon.users[i].name,
					html : '<b>'+logon.users[i].name+'</b>',
					append:this.carousel_item[i].login_form.canvas
				});
				//user group
				this.carousel_item[i].usergroup = mjdevjs.me({
					type:mjdevjs.DOM_TYPE_P,
					class:'usertype',
					alt:'('+logon.users[i].g_name+')',
					title:'('+logon.users[i].g_name+')',
					html : '<b>('+logon.users[i].g_name+')</b>',
					append:this.carousel_item[i].login_form.canvas
				});
				//user password
				this.carousel_item[i].password = mjdevjs.me({
					type:mjdevjs.DOM_TYPE_PASSWORD,
					id:"password"+(i+2),
					name:"password"+(i+2),
					class:"password",
					value:'',
					onfocus:function(){alert(this.id);},
					append:this.carousel_item[i].login_form.canvas
				});
				//login button
				this.carousel_item[i].login_button = mjdevjs.me({
					type:mjdevjs.DOM_TYPE_BUTTON,
					id:"login_button",
					class:"slick-black",
					onclick:'logon.users['+i+'].password = $("#password'+(i+2)+'").val(); document.title = "login:"+ logon.users['+i+'].toString();',
					html : 'login',
					append:this.carousel_item[i].login_form.canvas
				});
				//message button
				this.carousel_item[i].message_button = mjdevjs.me({
					type:mjdevjs.DOM_TYPE_BUTTON,
					id:"message_button",
					class:"slick-black",
					onclick:'',
					html : 'message',
					append:this.carousel_item[i].login_form.canvas
				});
				//contact button
				this.carousel_item[i].contact_button = mjdevjs.me({
					type:mjdevjs.DOM_TYPE_BUTTON,
					id:"contact_button",
					class:"slick-black",
					onclick:'',
					html : 'contact',
					append:this.carousel_item[i].login_form.canvas
				});
				//image menu toogle
				this.carousel_item[i].user_menu_toogle = mjdevjs.me({
					type:mjdevjs.DOM_TYPE_DIV,
					id:"user_menu_toogle_"+i,
					class:"user_menu_toogle",
					onclick:'',
					html : '+ details',
					append:this.carousel_item[i].login_form.canvas
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
				//image menu
				this.carousel_item[i].user_menu = mjdevjs.me({
					type:mjdevjs.DOM_TYPE_DIV,
					id:"user_menu_"+i,
					class:"user_menu",
					onclick:'',
					html : '',
					append:this.carousel_item[i].login_form.canvas
				});
			}
		}
		// create last empty element
		this.carousel_last		= mjdevjs.me({
			type:mjdevjs.DOM_TYPE_LI,
			jcarouselindex:(i+2),
			style:'float: left; list-style: none outside none;',
			css:'jcarousel-item jcarousel-item-horizontal jcarousel-item-'+ (i+2) +' jcarousel-item-'+ (i+2) +'-horizontal',
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
		this.canvas.setOpacity(0);
		this.canvas.show();
		this.visible = true;
		this.canvas.fadeIn(32,1, function(){}, this);
	}

};

//------------------------------------------------------------------------
