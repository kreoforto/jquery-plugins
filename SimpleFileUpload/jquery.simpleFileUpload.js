/*!
 * jQuery SimpleFileUpload Plugin v1.0 by KREOforto
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
$.fn.SimpleFileUpload = function() {
        
    return this.each( function(){
        
	$this = $(this);
	
	if($this.get(0).tagName.toLowerCase() == 'form') {
		
	    var ut = '_jqSFU' + String( Math.floor(Math.random() * (90000 - 10000 + 1)) + 10000 );
	    
	    $this.attr({
		method:  "post",
		enctype: "multipart/form-data",
		target:  ut   
	    });
	    
	    $iframe = $(document.createElement('iframe'));
	    $iframe.attr({
		src: '#',
		name: ut
	    }).css({
		width: 0,
		height: 0,
		border: '0px solid #fff'
	    });
	    
	    $('body').append($iframe);
	}
    });
}   
})( jQuery );