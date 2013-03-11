/*
	Kwicks for jQuery (version 1.5.1)
	Copyright (c) 2008 Jeremy Martin
	http://www.jeremymartin.name/projects.php?project=kwicks
	
	Licensed under the MIT license:
		http://www.opensource.org/licenses/mit-license.php

	Any and all use of this script must be accompanied by this copyright/license notice in its present form.
*/

(function($){
	$.fn.kwicks = function(options) {
		var defaults = {
			isVertical: false,
			sticky: false,
			defaultKwick: 0,
			event: 'mouseover',
			spacing: 0,
			duration: 10
		};
		var o = $.extend(defaults, options);
		var WoH = 'width';
		var LoT = 'left';
		
		return this.each(function() {
			container = $(this);
			var kwicks = container.children('li');
			var width = container.css('width').replace(/px/, '');;
			var normWoH = Math.round((width / kwicks.size())) - o.spacing;
			if(!o.max) {
				o.max = Math.round((normWoH * kwicks.size()) - (o.min * (kwicks.size() - 1)));
				o.med = o.min;
			} else {
				o.med = Math.round(((o.max - normWoH) / 2));
				o.min = Math.round(((normWoH * kwicks.size()) - o.max - (2 * o.med)) / (kwicks.size() -1));
				o.med += o.min;
			}				

			// pre calculate left or top values for all kwicks but the first and last
			// i = index of currently hovered kwick, j = index of kwick we're calculating
			var preCalcWoHs = []; // preCalcWoHs = pre-calculated Width or Height
			var preCalcLoTs = []; // preCalcLoTs = pre-calculated Left or Top's
			for(i = 0; i < kwicks.size(); i++) {
				preCalcWoHs[i] = [];
				preCalcLoTs[i] = [];
				for(j = 0; j < kwicks.size(); j++) {
					// values for the first kwick
					if(i == 0 && j == 1){
						preCalcWoHs[i][j] = o.med + ((o.med - o.min) / 2);
						preCalcLoTs[i][j] = o.max + (j * o.spacing);
					} else if(i == 0 && j == 2){
						preCalcWoHs[i][j] = o.med - ((o.med - o.min) / 2);
						preCalcLoTs[i][j] = o.max + (o.med + ((o.med - o.min) / 2)) + (j * o.spacing);
					// values for the last kwick
					} else if(i == (kwicks.size() - 1) && j == (kwicks.size() - 1)){
						preCalcWoHs[i][j] = o.max + 10;
						preCalcLoTs[i][j] = (((j-2) * o.min) + (2 * o.med)) + ((j-1) * o.spacing);
					} else if(i == (kwicks.size() - 1) && j == (kwicks.size() - 2)){
						preCalcWoHs[i][j] = o.med + ((o.med - o.min) / 2);
						preCalcLoTs[i][j] = (((j-1) * o.min) + (o.med - ((o.med - o.min) / 2))) + (j * o.spacing);
					} else if(i == (kwicks.size() - 1) && j == (kwicks.size() - 3)){
						preCalcWoHs[i][j] = o.med - ((o.med - o.min) / 2);
						preCalcLoTs[i][j] = (((j) * o.min)) + (j * o.spacing);
					// values for all others
					} else if(i == j) {
						preCalcWoHs[i][j] = o.max;
						preCalcLoTs[i][j] = (((j-1) * o.min) + o.med) + (j * o.spacing);
					} else if((i+1) == j && j == kwicks.size() - 1){
						preCalcWoHs[i][j] = o.med + 10;
						preCalcLoTs[i][j] = (((j-2) * o.min) + o.med + o.max) + (j * o.spacing);
					}else if((i+1) == j){
						preCalcWoHs[i][j] = o.med;
						preCalcLoTs[i][j] = (((j-2) * o.min) + o.med + o.max) + (j * o.spacing);
					} else if((i-1) == j){
						preCalcWoHs[i][j] = o.med;
						preCalcLoTs[i][j] = (j * o.min) + (j * o.spacing);
					} else if(j == kwicks.size() - 1){
						preCalcWoHs[i][j] = o.min + 10;
						preCalcLoTs[i][j] = (((j-3) * o.min) + (2 * o.med) + o.max) + (j * o.spacing);
					} else if(j < i){
						preCalcWoHs[i][j] = o.min;
						preCalcLoTs[i][j] = (j * o.min) + (j * o.spacing);
					} else {
						preCalcWoHs[i][j] = o.min;
						preCalcLoTs[i][j] = (((j-3) * o.min) + (2 * o.med) + o.max) + (j * o.spacing);
					}
				}
			}
			
			// loop through all kwick elements
			kwicks.each(function(i) {
				var kwick = $(this);
				// set initial width or height and left or top values
				// set first kwick
				if(i === 0) {
					kwick.css(WoH, normWoH);
					kwick.css(LoT, '0px');
					kwick.addClass('visible');
				} 
				// set last kwick
				else if(i == kwicks.size() - 1) {
					if(o.sticky) {
						kwick.css(WoH, normWoH + 10);
						kwick.css(LoT, preCalcLoTs[o.defaultKwick][i]);
						kwick.addClass('visible');
					} else {
						kwick.css(WoH, normWoH + 10);
						kwick.css(LoT, (i * normWoH) + (i * o.spacing));
						kwick.addClass('visible');
					}
				}
				// set all other kwicks
				else {
					if(o.sticky) {
						kwick.css(WoH, normWoH);
						kwick.css(LoT, preCalcLoTs[o.defaultKwick][i]);
						kwick.addClass('visible');
					} else {
						kwick.css(WoH, normWoH);
						kwick.css(LoT, (i * normWoH) + (i * o.spacing));
						kwick.addClass('visible');
					}
				}
				// correct size in sticky mode
				if(o.sticky) {
					if(o.defaultKwick == i) {
						kwick.css(WoH, o.max + 'px');
						kwick.addClass('active');
					} else {
						kwick.css(WoH, o.min + 'px');
					}
				}
				kwick.css({
					margin: 0,
					position: 'absolute'
				});
				
				kwick.bind(o.event, function() {
					// calculate previous width or heights and left or top values
					var prevWoHs = []; // prevWoHs = previous Widths or Heights
					var prevLoTs = []; // prevLoTs = previous Left or Tops
					kwicks.stop().removeClass('active');
					for(j = 0; j < kwicks.size(); j++) {
						prevWoHs[j] = kwicks.eq(j).css(WoH).replace(/px/, '');
						prevLoTs[j] = kwicks.eq(j).css(LoT).replace(/px/, '');
					}
					var aniObj = {};
					aniObj[WoH] = o.max;
					var maxDif = o.max - prevWoHs[i];
					var prevWoHsMaxDifRatio = prevWoHs[i]/maxDif;
					kwick.addClass('active').animate(aniObj, {
						step: function(now) {
							// calculate animation completeness as percentage
							var percentage = maxDif != 0 ? now/maxDif - prevWoHsMaxDifRatio : 1;
							// adjust other elements based on percentage
							kwicks.each(function(j) {
								if(j != i) {
									kwicks.eq(j).css(WoH, prevWoHs[j] - ((prevWoHs[j] - preCalcWoHs[i][j]) * percentage) + 'px');
								}
								if(j > 0 && j < kwicks.size()) { // if not the first kwick
									kwicks.eq(j).css(LoT, prevLoTs[j] - ((prevLoTs[j] - preCalcLoTs[i][j]) * percentage) + 'px');
								}
							});
						},
						duration: o.duration,
						easing: o.easing
					});
				});
				
				kwick.bind("mousemove", function(e) {
					var $this = $(this);
					var offset = $this.offset();
					var left = offset.left;
					var top = offset.top;
					var y = e.pageY - offset.top;
					var x = e.pageX - offset.left;
					$('.kwicks > li.active > a > .text-overlay').css({top:y-20,left:x-10});
				});
				
			});
			if(!o.sticky) {
				container.bind("mouseleave", function() {
					var prevWoHs = [];
					var prevLoTs = [];
					kwicks.removeClass('active').stop();
					for(i = 0; i < kwicks.size(); i++) {
						prevWoHs[i] = kwicks.eq(i).css(WoH).replace(/px/, '');
						prevLoTs[i] = kwicks.eq(i).css(LoT).replace(/px/, '');
					}
					var aniObj = {};
					aniObj[WoH] = normWoH;
					var normDif = normWoH - prevWoHs[0];
					kwicks.eq(0).animate(aniObj, {
						step: function(now) {
							var percentage = normDif != 0 ? (now - prevWoHs[0])/normDif : 1;
							for(i = 1; i < kwicks.size(); i++) {
								kwicks.eq(i).css(WoH, prevWoHs[i] - ((prevWoHs[i] - normWoH) * percentage) + 'px');
								if(i < kwicks.size()) {
									kwicks.eq(i).css(LoT, prevLoTs[i] - ((prevLoTs[i] - ((i * normWoH) + (i * o.spacing))) * percentage) + 'px');
								}
							}
							
						},
						duration: o.duration,
						easing: o.easing
					});
				});
			}
		});
	};
})(jQuery);