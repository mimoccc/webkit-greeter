//------------------------------------------------------------------------

/**
 * This class provides device control handling and keys mapping
 */

if (!(DevControl instanceof Object)) { 

	var DevControl = function() {

		// default key mapping
		this.deviceName = 'default';

		if(typeof(DeviceInfo)!=='undefined') {

			// initialise application objects
			DeviceInfo.init();

			// and keyboard mapping to event trigger 
			this.deviceName = DeviceInfo.name;

			this.map('default', function(){

				// MAP KEYCODES
				log.info('DEVMAP: ' + DeviceInfo.name);

				// if event trigger for deviceReady is undefined, create new
				if(typeof(mjdevjs.deviceReady)==='undefined') 
					mjdevjs.deviceReady = new mjdevjs.Channel('deviceReady');

				this.map(DeviceInfo.name);

				// fire event to let other object know that device is ready to work
				mjdevjs.deviceReady.fire();

			}, this);

		}

	};

	/**
	 * maps default (user selected) device control to an application
	 *
	 * @param {String} deviceName         Device type for mapping
	 * @param successCallback   		  Callback function if device is supported
	 */

	DevControl.prototype.map = function(deviceName, successCallback, context) {

		// if event trigger is undefined, create new
		if(typeof(mjdevjs.onKeyDown)==='undefined') 
			mjdevjs.onKeyDown = new mjdevjs.Channel('onKeyDown');

		// load device mapping
		mjdevjs.includeJavascript(
			'dc_maps/'+deviceName+'.js', 
			function(){

				//document.onscroll = function () { return false; };

				//document.onkeydown	 = function(e) {

					// fire onKey event to application if key or device control have request
					//mjdevjs.onKeyDown.fire(e.which); 
					//return true;

				//};

				// on key down should be enough
				//document.onkeypress	 = function(e) { mjdevjs.onKeyDown.fire(e.which); };
				if(typeof(successCallback)==='function') successCallback.apply(context);

			}

		);

	};

};

//------------------------------------------------------------------------
