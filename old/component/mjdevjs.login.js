//------------------------------------------------------------------------
// Login, GUI DOM element to show login screen
//------------------------------------------------------------------------

if (!(Login instanceof Object)) {

	var Login = function (config) {
		this.id = mjdevjs.createUUID();
		this.renderTo = mjdevjs._body;
		this.visible		= false;
		this.focused		= true;
		this.enabled		= true;
		this.users		= [];
		this.selected_user	= 0;
		this.context		= this;
		this.callback		= false;
		// base logon object if doesnt exists
		if (typeof(window.logon)==='undefined') window.logon = {};
		if ((typeof(this.selected_user)==='undefined') || (this.selected_user == null) )
			this.selected_user = 0;
		// if no history
		if ((typeof(window.logon.users)==='undefined') || (window.logon.users==null)) {
			window.logon.users = [];
			// for new login, not in history
			window.logon.users[0] = {
				name : 'new login',
				photo : 'users/nobody.jpg',
				password : ''
			};
		}
		// if user deleted
		if(this.selected_user>window.logon.users.length)
			this.selected_user = 0;
		mjdevjs.config(this, config);
	};

	Login.prototype.removeUserName = function (uname) {
		for(var i=0; i<logon.users; i++)
			if(logon.users[i].name==uname) 
				logon.users.remove(i);
	};

	Login.prototype.removeUserIdx = function (idx) {
		logon.users.remove(idx);
	};

	Login.prototype.new_user = function (uname, upass, uphoto) {
		this.users[this.selected_user].u_div.hide();
		window.logon.users[window.logon.users.length] = {
			name		: (uname || 'nobody'), 
			photo		: (uphoto || 'users/nobody.jpg'),
			password	: (upass || '')
		};
		this.selected_user = window.logon.users.length-1;
		this.recreate_users();
		this.password_text.innerHTML = 'password:';
		this.password_data.type = 'password';
	};

	/*
	 * create and show gui element
	 * params:
	 * id - element id will be created
	 * where_to, if is set element will be appended to this DOM element
	 */
	Login.prototype.create = function () {

		this.selected_user = 0;

		this.canvas	= mjdevjs.me(mjdevjs.DOM_TYPE_DIV, this.id, 'login', this.renderTo);
		this.canvas.setOpacity(0);

		this.bg1	= mjdevjs.me(mjdevjs.DOM_TYPE_DIV, 'bg1',  'login_bg1',  this.canvas);
		this.bg2	= mjdevjs.me(mjdevjs.DOM_TYPE_DIV, 'bg2',  'login_bg2',  this.canvas);
		
		this.txt1	= mjdevjs.me(mjdevjs.DOM_TYPE_DIV, 'txt1', 'login_txt1', this.bg1);
		this.txt2	= mjdevjs.me(mjdevjs.DOM_TYPE_DIV, 'txt2', 'login_txt2', this.bg1);

		this.userpanel	= mjdevjs.me(mjdevjs.DOM_TYPE_DIV, 'users','users', this.bg1);

		this.password   	= mjdevjs.me(mjdevjs.DOM_TYPE_DIV, 'login_pwd','login_pwd', this.bg1);
		this.password_text	= mjdevjs.me(mjdevjs.DOM_TYPE_DIV, 'pwd_text','login_pwd_text', this.password);
		this.password_data	= mjdevjs.me(mjdevjs.DOM_TYPE_INPUT, 'pwd_data','login_pwd_data', this.password);

		this.password_text.innerHTML = 'password:';
		this.password_data.type = 'password';

		this.sessions = mjdevjs.me(mjdevjs.DOM_TYPE_SELECT, 'sessions','sessions', this.bg1);

		this.bt_restart	= mjdevjs.me(mjdevjs.DOM_TYPE_INPUT, 'bt_restart','bt_restart', this.canvas);
		this.bt_restart.type = 'button';
		this.bt_restart.value = 'restart';
		this.bt_restart.onclick = function () { document.title = 'comprestart'; };

		this.bt_halt = mjdevjs.me(mjdevjs.DOM_TYPE_INPUT, 'bt_halt','bt_halt', this.canvas);
		this.bt_halt.type = 'button';
		this.bt_halt.value = 'shutdown';
		this.bt_halt.onclick = function () { document.title = 'comphalt'; };

		this.alert_data = mjdevjs.me(mjdevjs.DOM_TYPE_DIV, 'alerts', 'alert_text', this.bg1);

		this.txt1.innerHTML = 'Welcome';
		this.txt2.innerHTML = 'whats up today ? ...';

		this.recreate_users();

	};

	Login.prototype.recreate_users = function (){
	
		// clear users
		this.users = [];
		
		// remove dom elements
		this.bg1.removeChild(this.userpanel);
		
		// create new dom element
		this.userpanel	= mjdevjs.me(mjdevjs.DOM_TYPE_DIV, 'users','users', this.bg1);
		
		// create all users, hide them and show only actual user
		for(var i=0; i<logon.users.length; i++) {
			
			if (typeof(logon.users[i])==='object') {
				
				var u_div   = mjdevjs.me(mjdevjs.DOM_TYPE_DIV, 'user','user', this.userpanel);
				
				if(i == this.selected_user) u_div.show();
				else u_div.hide();
		    
				var u_data  = mjdevjs.me(mjdevjs.DOM_TYPE_DIV, 'user_data','user_data', u_div);
				var u_photo = mjdevjs.me(mjdevjs.DOM_TYPE_IMG, 'image','user_image', u_div);
				var u_name  = mjdevjs.me(mjdevjs.DOM_TYPE_DIV, 'user_name','user_name', u_div);
		    
				this.users[i]	= { 
		    		
						'u_div'		: u_div, 
						'u_photo'	: u_photo, 
						'u_name'	: u_name, 
						'u_data'	: u_data,
						'data'		: logon.users[i]
		              		              
				};
		    
				u_name.innerHTML	= logon.users[i].name;
				u_photo.src			= logon.users[i].photo;
				
			}

		}
		
	};

	Login.prototype.alert = function (text, type) {

		this.alert_data.innerHTML = text + '<br>' + this.alert_data.innerHTML;

	};

	Login.prototype.disable = function (text, type) {

		mjdevjs.unRegisterHandler(this);
		this.enabled = false;
		//this.password_data.disabled = true;

	};

	Login.prototype.enable = function (text, type) {

		this.enabled = true;
		//this.password_data.disabled = false;
		this.password_data.focus();
		mjdevjs.registerHandler(this);

	};

	Login.prototype.hide = function (callback, context) {

		this.disable();

		this.canvas.fadeOut (32,1,function() {

			this.canvas.hide();
			this.visible = false;

			if(typeof(callback)!=='undefined')
				callback.apply((context||this));

		},this);

	}

	Login.prototype.show = function () {

		this.canvas.setOpacity(0);
		this.canvas.show();

		this.password_data.value = '';
		this.password_data.focus();

		this.visible = true;

		try {

			this.users[this.selected_user].u_div.setOpacity(1);
			this.users[this.selected_user].u_div.show();

		} catch (e) {};

		this.canvas.fadeIn(32,1, function(){

			this.enable();

		}, this);

	}

	Login.prototype.left		= function (){

		this.disable();
		this.prev_user = this.users[this.selected_user];

		if(this.selected_user>0) this.selected_user--;

		if(this.selected_user!=this.prev_user.idx) {

			this.prev_user.u_div.fadeOut(32,1, function() {

				this.prev_user.u_div.hide();
				this.users[this.selected_user].u_div.setOpacity(0);
				this.users[this.selected_user].u_div.show();
				this.users[this.selected_user].u_div.fadeIn(32,1,function(){ 

					this.enable();

				 }, this);

			}, this);

		}

	}

	Login.prototype.right		= function (){

		this.disable();
		this.prev_user = this.users[this.selected_user];

		if(this.selected_user<this.users.length-1) this.selected_user++;

		if(this.selected_user!=this.prev_user.idx) {

			this.prev_user.u_div.fadeOut(32,1, function(){

				this.prev_user.u_div.hide();
				this.users[this.selected_user].u_div.setOpacity(0);
				this.users[this.selected_user].u_div.show();
				this.users[this.selected_user].u_div.fadeIn(32,1, function(){ this.enable(); }, this);

			}, this);

		}

	}

	Login.prototype.onFocus		= function () {

		this.focused = true;
		return true;

	};

	Login.prototype.onUnFocus	= function () {

		this.focused = false;
		return true;

	};

	Login.prototype.onKey		= function (key){

		switch (KBD_MAP.getKeyName(key)){

			case 'VK_LEFT' :
				this.left();
				return true;
				break;

			case 'VK_RIGHT' :
				this.right();
				return true;
				break;

			case 'VK_ENTER' : // enter/ok

				this.users[this.selected_user].data.password = this.password_data.value;
				document.title = 'login:' + this.users[this.selected_user].data.toString();
				break;

		}

		return true;

	};

};

//------------------------------------------------------------------------
