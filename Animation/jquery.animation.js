/*!
 * jQuery Animation Plugin v1.0 by KREOforto
 * http://kreoforto.de/
 * Written by Marc-Lorenzo Schulz
 *
 * Copyright 2011, KREOforto GbR
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.kreoforto.de/license
 *
 * Date: Wed Jun 1 23:20:00 2011 +0100
 */
(function( $ ){
  
  var defaults = {
    positions             : [[0,0]],
    forwardEvent          : 'none',
    reverseEvent          : 'none',
    animatedElement       : null, 
    triggerElement        : null,      // default: animatedElement
    triggerElementReverse : null,      // default: triggerElement    
    stopPosition          : null,      // default: position.length - 1
    startPosition         : 0,
    delay                 : 0,
    rewind                : false,
    delayRewind           : 0,
    autostart             : true,
    repeat                : 0,
    loop                  : false,
    frequency             : 25	    // frames per second, 25 is used in films  
  };
  
  var settings = {};
  
   var methods = {
      init : function( options ) {
        
        return this.each(function(){
      
          var $this = $(this);
                    
          if( typeof($this.attr('id')) == 'undefined' ) {
            $this.attr('id', '_jqA' + String( Math.floor(Math.random() * (90000 - 10000 + 1)) + 10000 ));
          }
          settings[$this.attr('id')] = $.extend( {}, defaults, options);
          var objSettings = settings[$this.attr('id')];
          
          objSettings.animatedElement = '#' + $this.attr('id');
          
          if(objSettings.stopPosition == null) {
            objSettings.stopPosition = objSettings.positions.length - 1;
          }
        
          if(objSettings.triggerElement == null) {
              objSettings.triggerElement = objSettings.animatedElement;
          }
          
          if(objSettings.triggerElementReverse == null && objSettings.reverseEvent != 'none' && objSettings.reverseEvent != 'after' && objSettings.reverseEvent != 'load') {
              objSettings.triggerElementReverse = objSettings.triggerElement;
          }
          
          objSettings['internal'] = {
            freq                  : 1/objSettings.frequency*1000,
            timerForward          : null,
            timerReverse          : null,
            nextFrameForward      : objSettings.startPosition + 1,
            nextFrameReverse      : objSettings.stopPosition - 1,
            runs                  : 0,
            runningForward        : true,
            active                : false
          };
          
          if(objSettings.autostart) {
            $this.Animation('Start');
          }
          
        });        
      },
      Start : function(noinit) {
        
        return this.each(function(){
          
          var $this = $(this);
          var objSettings = settings[$this.attr('id')];
          
          if(!noinit && objSettings.forwardEvent != 'none') {
            $(objSettings.animatedElement).css( 'background-position', objSettings.positions[objSettings.startPosition][0] + 'px '
                                                                     + objSettings.positions[objSettings.startPosition][1] + 'px' );
          }
          
          if(objSettings.forwardEvent == 'load') {
            
            var direction = objSettings.internal.runningForward ? 'AnimateForward' : 'AnimateReverse';
            
            objSettings.delay == 0 ?
            $this.Animation(direction) :
            objSettings.internal.timerForward = window.setTimeout( function(){ $this.Animation(direction); }, objSettings.delay);
          }
          else if(objSettings.forwardEvent != 'none') {
              
                $(objSettings.triggerElement).bind(objSettings.forwardEvent + '.animation', function() {
                  $this.Animation('AnimateForward');
                });
                
                if(objSettings.reverseEvent != 'none' && objSettings.reverseEvent != 'after' && objSettings.reverseEvent != 'load') {
                $(objSettings.triggerElementReverse ).bind(objSettings.reverseEvent + '.animation', function() {
                    $this.Animation('AnimateReverse');
                });
            }
          }
        });
      },
      AnimateForward : function() {
        
        return this.each(function(){
          
          var $this = $(this);
          var objSettings = settings[$this.attr('id')];

          if(!objSettings.internal.active) {
          
            objSettings.internal.runs = 1;
            objSettings.internal.active = true;
                
            if( objSettings.internal.timerReverse != null) { window.clearTimeout(objSettings.internal.timerReverse); }
            if( objSettings.internal.nextFrameReverse != objSettings.stopPosition - 1 ) { 
                    objSettings.internal.nextFrameForward = objSettings.internal.nextFrameReverse + 2; 
                    objSettings.internal.nextFrameReverse = objSettings.stopPosition - 1;
            }
          
            objSettings.internal.timerForward = window.setTimeout( function(){
                if(objSettings.internal.nextFrameForward <= objSettings.stopPosition) {
                    $this.Animation('SetBgPositionForward', objSettings.positions[objSettings.internal.nextFrameForward][0], objSettings.positions[objSettings.internal.nextFrameForward][1]);
                }
            }, objSettings.internal.freq );
          }
        });
      },
      SetBgPositionForward : function(x,y) {	
          
        return this.each(function(){
          
          var $this = $(this);
          var objSettings = settings[$this.attr('id')];
          objSettings.internal.runningForward = true;
      
          $(objSettings.animatedElement).css( 'background-position', x + 'px ' + y + 'px' );	
  
          objSettings.internal.timerForward = window.setTimeout( function(){
              if(objSettings.internal.nextFrameForward <= objSettings.stopPosition) {
                  $this.Animation('SetBgPositionForward', objSettings.positions[objSettings.internal.nextFrameForward][0], objSettings.positions[objSettings.internal.nextFrameForward][1]);
              }
          }, objSettings.internal.freq );
          
          objSettings.internal.nextFrameForward++;
          
          if(objSettings.internal.nextFrameForward == objSettings.stopPosition + 1) {
              
              window.clearTimeout(objSettings.internal.timerForward);
              objSettings.internal.runningForward = false;
              
              if(objSettings.reverseEvent == 'none') {
                                         
                  if(objSettings.repeat || objSettings.loop) {
                      
                      if(objSettings.repeat > 0 && objSettings.internal.runs <= objSettings.repeat) {
                          
                          objSettings.internal.nextFrameForward = objSettings.startPosition + 1;
                          objSettings.internal.runs++;
                          
                          objSettings.delayRewind == 0 ?
                          $this.Animation('SetBgPositionForward', objSettings.positions[objSettings.internal.nextFrameForward][0], objSettings.positions[objSettings.internal.nextFrameForward][1]) :
                          objSettings.internal.timerForward = window.setTimeout(function(){
                              $this.Animation('SetBgPositionForward', objSettings.positions[objSettings.internal.nextFrameForward][0], objSettings.positions[objSettings.internal.nextFrameForward][1]);    
                          }, objSettings.delayRewind);
                      }
                      else if(objSettings.loop) {
                          objSettings.internal.nextFrameForward = objSettings.startPosition + 1;
                          
                          objSettings.delayRewind == 0 ?
                          $this.Animation('SetBgPositionForward', objSettings.positions[objSettings.internal.nextFrameForward][0], objSettings.positions[objSettings.internal.nextFrameForward][1]) :
                          objSettings.internal.timerForward = window.setTimeout(function(){
                              $this.Animation('SetBgPositionForward', objSettings.positions[objSettings.internal.nextFrameForward][0], objSettings.positions[objSettings.internal.nextFrameForward][1]);    
                          }, objSettings.delayRewind);
                      }
                      else if(objSettings.rewind) {
                          $this.Animation('Rewind');
                      }
                      else {
                          objSettings.internal.active = false;
                      }
                  }
                  else if(objSettings.rewind) {
                      $this.Animation('Rewind');
                  }
                  else {
                      objSettings.internal.active = false;
                  }
              }
              else if(objSettings.reverseEvent == 'after') {
                  
                  objSettings.delayRewind == 0 ?
                  $this.Animation('SetBgPositionReverse', objSettings.positions[objSettings.internal.nextFrameReverse][0], objSettings.positions[objSettings.internal.nextFrameReverse][1]) :
                  objSettings.internal.timerReverse = window.setTimeout(function(){
                      $this.Animation('SetBgPositionReverse', objSettings.positions[objSettings.internal.nextFrameReverse][0], objSettings.positions[objSettings.internal.nextFrameReverse][1]);    
                  }, objSettings.delayRewind);
              }
              else {
                  objSettings.internal.active = false;
              }
          }
        });
      },
      AnimateReverse : function() {
    
        return this.each(function(){
          
          var $this = $(this);
          var objSettings = settings[$this.attr('id')];
          objSettings.internal.active = false;
    
          run = objSettings.internal.timerForward != null && objSettings.internal.nextFrameForward == objSettings.startPosition + 1 ? false : true;
          
          if( objSettings.internal.timerForward != null) { window.clearTimeout(objSettings.internal.timerForward); }
          if( objSettings.internal.nextFrameForward != objSettings.startPosition + 1 && objSettings.internal.runningForward) { 
                  objSettings.internal.nextFrameReverse = objSettings.internal.nextFrameForward - 2;
                  objSettings.internal.nextFrameForward = objSettings.startPosition + 1;			
          }
          
          if(run) {
              objSettings.internal.timerReverse = window.setTimeout( function(){
                  if(objSettings.internal.nextFrameReverse >= objSettings.startPosition) {
                      $this.Animation('SetBgPositionReverse', objSettings.positions[objSettings.internal.nextFrameReverse][0], objSettings.positions[objSettings.internal.nextFrameReverse][1]);
                  }
              }, objSettings.internal.freq );
          }
        });
      },
      SetBgPositionReverse : function(x,y) {	

        return this.each(function(){
          
          var $this = $(this);
          var objSettings = settings[$this.attr('id')];
          
            $(objSettings.animatedElement).css( 'background-position', x + 'px ' + y + 'px' );	
    
            objSettings.internal.timerReverse = window.setTimeout( function(){
                if(objSettings.internal.nextFrameReverse >= objSettings.startPosition) {
                    $this.Animation('SetBgPositionReverse', objSettings.positions[objSettings.internal.nextFrameReverse][0], objSettings.positions[objSettings.internal.nextFrameReverse][1]);
                }
            }, objSettings.internal.freq );
            
            objSettings.internal.nextFrameReverse--;
            
            if(objSettings.internal.nextFrameReverse == objSettings.startPosition - 1) {
              
                window.clearTimeout(objSettings.internal.timerReverse);
                objSettings.internal.runningForward = true;
                
                if(objSettings.reverseEvent == 'after') {
                                
                    if(objSettings.repeat || objSettings.loop) {
                       
                      if(objSettings.repeat > 0 && objSettings.internal.runs <= objSettings.repeat) {
                          
                          objSettings.internal.nextFrameReverse = objSettings.stopPosition - 1;
                          objSettings.internal.nextFrameForward = objSettings.startPosition + 1;
                          objSettings.internal.runs++;
                          
                          objSettings.delay == 0 ?
                          $this.Animation('SetBgPositionForward', objSettings.positions[objSettings.internal.nextFrameForward][0], objSettings.positions[objSettings.internal.nextFrameForward][1]) :
                          objSettings.internal.timerForward = window.setTimeout(function(){
                              $this.Animation('SetBgPositionForward', objSettings.positions[objSettings.internal.nextFrameForward][0], objSettings.positions[objSettings.internal.nextFrameForward][1]);    
                          }, objSettings.delay);
                      }
                      else if(objSettings.loop) {
                          
                          objSettings.internal.nextFrameReverse = objSettings.stopPosition - 1;
                          objSettings.internal.nextFrameForward = objSettings.startPosition + 1;
                          
                          objSettings.delay == 0 ?
                          $this.Animation('SetBgPositionForward', objSettings.positions[objSettings.internal.nextFrameForward][0], objSettings.positions[objSettings.internal.nextFrameForward][1]) :
                          objSettings.internal.timerForward = window.setTimeout(function(){
                              $this.Animation('SetBgPositionForward', objSettings.positions[objSettings.internal.nextFrameForward][0], objSettings.positions[objSettings.internal.nextFrameForward][1]);    
                          }, objSettings.delay);
                      }
                      else {
                          objSettings.internal.active = false;
                      }
                    }
                    else {
                        objSettings.internal.active = false;
                    }
                }
            }
        });
      },
      Rewind : function() {
    
        return this.each(function(){
          
          var $this = $(this);
          var objSettings = settings[$this.attr('id')];
          objSettings.internal.active = false;
          
          if(objSettings.delayRewind <= 0) {
              $(objSettings.animatedElement).css( 'background-position', objSettings.positions[objSettings.startPosition][0] + 'px ' + objSettings.positions[objSettings.startPosition][1] + 'px' );
              objSettings.internal.nextFrameForward = objSettings.startPosition + 1;
          }
          else {
              objSettings.internal.timerForward = window.setTimeout( function() {
                  $(objSettings.animatedElement).css( 'background-position', objSettings.positions[objSettings.startPosition][0] + 'px ' + objSettings.positions[objSettings.startPosition][1] + 'px' );
                  objSettings.internal.nextFrameForward = objSettings.startPosition + 1;
              }, objSettings.delayRewind);
          }
        });
      },
      Stop : function(reset) {
        
        return this.each(function(){
          
          var $this = $(this);
          var objSettings = settings[$this.attr('id')];
          
          if(objSettings.internal.timerForward != null) { window.clearTimeout(objSettings.internal.timerForward); }
          if(objSettings.internal.timerReverse != null) { window.clearTimeout(objSettings.internal.timerReverse); }
          objSettings.internal.active = false;
          
          if(reset) {
            
            objSettings.internal.nextFrameReverse = objSettings.stopPosition - 1;
            objSettings.internal.nextFrameForward = objSettings.startPosition + 1;
            objSettings.runs = 1;
            
            $(objSettings.animatedElement).css( 'background-position', objSettings.positions[objSettings.startPosition][0] + 'px ' + objSettings.positions[objSettings.startPosition][1] + 'px' );
          }
        });
      }
   };
  
  $.fn.Animation = function( method ) {
    
    // Method calling logic
    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.Animation' );
      return false;
    } 
    
  };
})( jQuery );