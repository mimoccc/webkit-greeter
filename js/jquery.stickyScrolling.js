(function($){
	$.fn.stickyScrolling = function(stickyChild, topOffset){
		$ntry(window).stop();
		topOffset = topOffset||0;
		var sticky = 'sticky';
		return this.each(function(){
			var topEdgeOffset = $(this).offset().top - $(window).scrollTop();
			var bottomEdgeOffset = topEdgeOffset + $(this).outerHeight();
			var child = $(stickyChild,this);
			if(topEdgeOffset <= topOffset && bottomEdgeOffset > topOffset){
				if(topOffset + child.outerHeight() >= bottomEdgeOffset){
					$('.'+sticky).removeClass(sticky);
					$(stickyChild).css({top:0, bottom:'auto', position:'absolute'});
					$(this).removeClass(sticky);
					child.css({bottom:0, top:'auto', position:'absolute'});
				} else {
					$('.'+sticky).removeClass(sticky);
					$(stickyChild).css({top:0, bottom:'auto', position:'absolute'});
					$(this).addClass(sticky);
					child.css({bottom:'auto', top:topOffset, position:'fixed'});
				}
			} else if(bottomEdgeOffset > topOffset && child.position().top> 0){
				$(this).removeClass(sticky);
				child.css({top:'0', bottom:'auto', position:'absolute'});
			}
			
			//Hack to hide the playbutton
			if($('.promocontent',this).offset().top <= child.offset().top+265){
				$('.playbutton',this).fadeOut(300);
			} else {
				if(!$('.playbutton',this).is(':visible'))
					$('.playbutton',this).fadeIn(300);
			}
		});
	};
	
	$.fn.epgScrolling = function(stickyChild, topOffset){
	topOffset = topOffset||0;
		var sticky = 'sticky';
		return this.each(function(){
			var topEdgeOffset = $(this).offset().top - $(window).scrollTop();
			var bottomEdgeOffset = topEdgeOffset + $(this).outerHeight();
			var child = $(stickyChild,this);
			if(topEdgeOffset <= topOffset){
				$(stickyChild).css({top:0, bottom:'auto', position:'absolute'});
				$(this).addClass(sticky);
				child.css({bottom:'auto', top:topOffset, position:'fixed'});
			} else if(bottomEdgeOffset > topOffset && child.position().top> 0){
				$(this).removeClass(sticky);
				child.css({top:'auto', bottom:'auto', position:'absolute'});
			}
		});
	};
	
})(jQuery);