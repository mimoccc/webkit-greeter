var hoverEffect = true; // set true for hover effect, set false for no hover effect

var searchEngine = 'google'; // default search engine - set google for google search, bing for bing search, yahoo for yahoo search

var numberOfScreens = 3; // set number of screens (1 or 2 or 3)
 
var blockName = new Array(); // set names of blocks
blockName[1] = 'Most used';
blockName[2] = 'Social';
blockName[3] = 'News & fun';

var bookmark = new Array();
bookmark[0] = new Array();
bookmark[1] = new Array();
bookmark[2] = new Array();

// set your bookmarks here: (If you do not fill 'thumb' for thumbnail will be used title)
// FIRST BLOCK
bookmark[0][0] = {
	'title':'YouTube',
	'url':'http://youtube.com',
	'thumb':'youtube.png'
};
bookmark[0][1] = {
	'title':'Yahoo',
	'url':'http://yahoo.com',
	'thumb':'yahoo.png'
};
bookmark[0][2] = {
	'title':'Grooveshark',
	'url':'http://grooveshark.com',
	'thumb':'grooveshark.png'
};
bookmark[0][3] = {
	'title':'last.fm',
	'url':'http://www.last.fm/',
	'thumb':'lastfm.png'
};
bookmark[0][4] = {
	'title':'twitter',
	'url':'http://twitter.com',
	'thumb':'twitter.png'
};
bookmark[0][5] = {
	'title':'google',
	'url':'http://google.com',
	'thumb':'google.png'
};
bookmark[0][6] = {
	'title':'facebook',
	'url':'http://facebook.com',
	'thumb':'facebook.png'
};
bookmark[0][7] = {
	'title':'BBC news',
	'url':'http://www.bbc.co.uk/news/',
	'thumb':'bbcnews.png'
};
bookmark[0][8] = {
	'title':'CNN',
	'url':'http://www.cnn.com',
	'thumb':'cnn.png'
};
bookmark[0][9] = {
	'title':'deviantART',
	'url':'http://deviantart.com',
	'thumb':'deviantart.png'
};
bookmark[0][10] = {
	'title':'wikipedia',
	'url':'http://wikipedia.org',
	'thumb':'wikipedia.png'
};
bookmark[0][11] = {
	'title':'iTunes',
	'url':'http://www.apple.com/itunes/',
	'thumb':'itunes.png'
};
// end of FIRST BLOCK
// SECOND BLOCK
bookmark[1][0] = {
	'title':'linkedin',
	'url':'http://www.linkedin.com/',
	'thumb':'linkedin.png'
};
bookmark[1][1] = {
	'title':'digg',
	'url':'http://digg.com/',
	'thumb':'digg.png'
};
bookmark[1][2] = {
	'title':'flickr',
	'url':'http://www.flickr.com/',
	'thumb':'flickr.png'
};
bookmark[1][3] = {
	'title':'msn',
	'url':'http://www.msn.com/',
	'thumb':'msn.png'
};
bookmark[1][4] = {
	'title':'reddit',
	'url':'http://www.reddit.com/',
	'thumb':'reddit.png'
};
bookmark[1][5] = {
	'title':'skype',
	'url':'http://www.skype.com/',
	'thumb':'skype.png'
};
bookmark[1][6] = {
	'title':'technorati',
	'url':'http://technorati.com',
	'thumb':'technorati.png'
};
bookmark[1][7] = {
	'title':'delicious',
	'url':'http://www.delicious.com/',
	'thumb':'delicious.png'
};
bookmark[1][8] = {
	'title':'MySpace',
	'url':'http://www.myspace.com/',
	'thumb':'myspace.png'
};
bookmark[1][9] = {
	'title':'orkut',
	'url':'http://www.orkut.com/',
	'thumb':'orkut.png'
};
bookmark[1][10] = {
	'title':'tumblr',
	'url':'http://www.tumblr.com/',
	'thumb':'tumblr.png'
};
bookmark[1][11] = {
	'title':'StumbleUpon',
	'url':'http://www.stumbleupon.com/',
	'thumb':'stumbleupon.png'
};
//end of SECOND BLOCK
// THIRD BLOCK
bookmark[2][0] = {
	'title':'eurosport',
	'url':'http://www.eurosport.com/',
	'thumb':'eurosport.png'
};
bookmark[2][1] = {
	'title':'amazon',
	'url':'http://www.amazon.com/',
	'thumb':'amazon.png'
};
bookmark[2][2] = {
	'title':'eBay',
	'url':'http://www.ebay.com/',
	'thumb':'ebay.png'
};
bookmark[2][3] = {
	'title':'IMDb',
	'url':'http://www.imdb.com/',
	'thumb':'imdb.png'
};
bookmark[2][4] = {
	'title':'vimeo',
	'url':'http://vimeo.com',
	'thumb':'vimeo.png'
};
bookmark[2][5] = {
	'title':'lifehacker',
	'url':'http://lifehacker.com/',
	'thumb':'lifehacker.png'
};
bookmark[2][6] = {
	'title':'engadged',
	'url':'http://www.engadget.com/',
	'thumb':'engadget.png'
};
bookmark[2][7] = {
	'title':'zune',
	'url':'http://www.zune.net/',
	'thumb':'zune.png'
};
bookmark[2][8] = {
	'title':'dropbox',
	'url':'http://www.dropbox.com/',
	'thumb':'dropbox.png'
};
bookmark[2][9] = {
	'title':'National Geographic',
	'url':'http://www.nationalgeographic.com/',
	'thumb':'natgeo.png'
};
bookmark[2][10] = {
	'title':'CBC news',
	'url':'http://www.cbc.ca/news/',
	'thumb':'cbcnews.png'
};
bookmark[2][11] = {
	'title':'weather.com',
	'url':'http://www.weather.com/',
	'thumb':'weather.png'
};