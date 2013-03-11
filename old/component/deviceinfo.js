//------------------------------------------------------------------------

/*
 * Device info object and hw depend base functions
 */

if (!(DeviceInfo instanceof Object)) { 

	var DeviceInfo = {

		init : function () {}

	};

	// try catch cause of opera error

	try {DeviceInfo.codeName			= navigator.appCodeName.toString().toLowerCase();	} catch(e){}
	//log.info('codeName: '+DeviceInfo.codeName);

	try {DeviceInfo.name				= navigator.appName.toString().toLowerCase();		} catch(e){}
	//log.info('name: '+DeviceInfo.codeName);

	try {DeviceInfo.version				= navigator.appVersion.toString().toLowerCase();	} catch(e){}
	//log.info('version: '+DeviceInfo.version);

	try {DeviceInfo.cookiesEnabled		= navigator.cookieEnabled.toString();				} catch(e){}
	//log.info('cookiesEnabled: '+DeviceInfo.cookiesEnabled);

	try {DeviceInfo.platform			= navigator.platform.toString().toLowerCase();		} catch(e){}
	//log.info('platform: '+DeviceInfo.platform);

	try {DeviceInfo.userAgentHeader		= navigator.userAgent.toString().toLowerCase();		} catch(e){}
	//log.info('userAgentHeader: '+DeviceInfo.userAgentHeader);

	try {DeviceInfo.language			= navigator.language.toString().toLowerCase();		} catch(e){}
	//log.info('language: '+DeviceInfo.language);

	try {DeviceInfo.product				= navigator.product.toString().toLowerCase();		} catch(e){
		DeviceInfo.product = navigator.appName.toString().toLowerCase();
		log.info('product: '+DeviceInfo.product);
	}

	try {DeviceInfo.vendor				= navigator.vendor.toString().toLowerCase();		} catch(e){}
	//log.info('vendor: '+DeviceInfo.vendor);

	DeviceInfo.screenWidth				= ((typeof(window.innerWidth)!=='undefined')?parseInt(window.innerWidth):0);
	//log.info('screenWidth: '+DeviceInfo.screenWidth);

	DeviceInfo.screenHeight				= ((typeof(window.innerHeight)!=='undefined')?parseInt(window.innerHeight):0);
	//log.info('screenHeight: '+DeviceInfo.screenHeight);

};

//------------------------------------------------------------------------
