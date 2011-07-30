/*!
 * jQuery DynamicList Plugin v1.0 by KREOforto
 * http://kreoforto.de/
 * Written by Marc-Lorenzo Schulz
 *
 * Copyright 2011, KREOforto GbR
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.kreoforto.de/license
 *
 * Date: Sat Jun 4 16:04:00 2011 +0100
 */
(function( $ ){
$.fn.DynamicList = function( options ) {
	
	var defaults = {
		triggerAddElement: null,
		triggerRemoveElement: null,
		addOnly: false,
		ctrlAddImg: 'add.gif',
		ctrlRemoveImg: 'subtract.gif',
		ctrlPosition: [5,20],
		ctrlClass: null
	};
	
	return this.each( function(){
		
		$this = $(this);
		var settings = $.extend( {}, defaults, options);

		$container = $(document.createElement('div'));
		$this.prev().length == 0 ?
		$this.parent().prepend($container) :
		$this.prev().after($container);
		
		if(settings.triggerAddElement === null && settings.triggerRemoveElement === null) {
			$c = $(document.createElement('div'));
			$i = $(document.createElement('img'));
			
			$add 	= $i.clone().attr('src',settings.ctrlAddImg);
			$ctrl   = $c.clone().append($add).css({
					paddingLeft: settings.ctrlPosition[1] + 'px',
					paddingTop:  settings.ctrlPosition[0] + 'px'
				  });
			if(!settings.addOnly) {
				
				$remove = $i.clone().attr('src',settings.ctrlRemoveImg);
				$ctrl.append($remove);
			}
			if(settings.ctrlClass !== null) { $ctrl.addClass(settings.ctrlClass) }
			$content = $c.clone().css('float','left');
			$this.appendTo($content);
			$container.html( $c.clone().append($content).append($ctrl.css('float','left')).append($c.clone().css('clear','left')) );
		}
		else {
			$this.appendTo($container);
			$add 	= $(settings.triggerAddElement);
			$remove = $(settings.triggerRemoveElement);
		}				
		
		var curr = $this;
		$add.bind('click.dynamicList', function() {
			$new = curr.clone(true);
			$in = $new.contents().filter('input[type!="button"][type!="submit"][type!="reset"],textarea');
			$in.each(function(){
				$(this).val('');
			});
			$container.append($new);	
		});
		
		if(!settings.addOnly) {
			
			$remove.bind('click.dynamicList', function(){
				$children = $container.children();
				if($children.length > 1) {
					$($children[$children.length - 1]).remove();
				}
			})
		}
	});
}
})( jQuery );