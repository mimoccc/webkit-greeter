/*
 * This file contains a device control map keycodess
 * 
 * note:
 * keys as defined in SDK. For Opera testing only, remove after testing.
 */

var KBD_MAP = new function () {
	
	this.id = 'opera';
	
	// key values
	this.keys	= [];
	
	this.keys[0]  ='VK_UNMAPPED';
	this.keys[37] ='VK_LEFT';
	this.keys[39] ='VK_RIGHT';
	this.keys[38] ='VK_UP';
	this.keys[40] ='VK_DOWN';
	this.keys[13] ='VK_ENTER';
	this.keys[27] ='VK_ESCAPE';
	
	this.keys[48] ='VK_0';
	this.keys[49] ='VK_1';
	this.keys[50] ='VK_2';
	this.keys[51] ='VK_3';
	this.keys[52] ='VK_4';
	this.keys[53] ='VK_5';
	this.keys[54] ='VK_6';
	this.keys[55] ='VK_7';
	this.keys[56] ='VK_8';
	this.keys[57] ='VK_9';
	
	this.keys[113] ='VK_BACK';
	this.keys[32] ='VK_DEBUG'; // 20
	
	this.keys['VK_UNMAPPED']		= 0;
	this.keys['VK_LEFT']			= 37;
	this.keys['VK_RIGH']			= 39;
	this.keys['VK_UP']				= 38;
	this.keys['VK_DOWN']			= 40;
	this.keys['VK_ENTER']			= 13;
	this.keys['VK_ESCAPE']			= 27;  // escape
	this.keys['VK_0']				= 48;
	this.keys['VK_1']				= 49;
	this.keys['VK_2']				= 50;
	this.keys['VK_3']				= 51;
	this.keys['VK_4']				= 52;
	this.keys['VK_5']				= 53;
	this.keys['VK_6']				= 54;
	this.keys['VK_7']				= 55;
	this.keys['VK_8']				= 56;
	this.keys['VK_9']				= 57;
	this.keys['VK_BACK']			= 113;
	this.keys['VK_DEBUG']			= 32; // 20
	
	this.getKeyName	= function (key)		{ return (typeof(this.keys[key])!=='undefined')?this.keys[key]:this.keys[0]; };
	this.getKey		= function (key_name)	{ return (typeof(this.keys[key_name])!=='undefined')?this.keys[key_name]:0; };
	
};