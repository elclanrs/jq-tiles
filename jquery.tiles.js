/*jshint expr:true */
;(function(){

/**
* range Get an array of numbers within a range
* @param min {number} Lowest number in array
* @param max {number} Highest number in array
* @param rand {bool} Shuffle array
* @return {array}
*/
function range(min, max, rand) {
  var arr = (new Array(++max-min))
    .join('.').split('.')
    .map(function(v,i){ return min+i; });
  return rand ?
    arr.map(function(v) { return [Math.random(), v]; })
       .sort().map(function(v) { return v[1]; }) :
    arr;
}

/*--------------------------------------------------------------------

  Options

---------------------------------------------------------------------*/

var options = {
  x: 4, y: 4,
  slider: false,
  effect: 'default',
  fade: true,
  random: false,
  reverse: false,
  limit: false,
  rewind: false,
  loop: true,
  auto: true,
  effectSpeed: 1000,
  tileSpeed: false, //= effectSpeed
  sliderSpeed: 3000,
  cssSpeed: 300
};

/*--------------------------------------------------------------------

  jquery.tiles

---------------------------------------------------------------------*/

$.fn.tiles = function(ops) {

  var o = $.extend({}, options, ops);

  o.tileSpeed = o.tileSpeed || o.effectSpeed;

  // Prevent css3 transitions on load
  $('body').addClass('tiles-preload');
  $(window).load(function(){
    $('body').removeClass('tiles-preload');
  });

  return this.each(function() {

    var $img = $(this);
    var klass = 'tiles-'+ o.effect;
    var n_tiles = o.x*o.y;

    if (!$img.is('img')) {
      $.error('Selector can only contain images.');
    }

    var $wrap = $('<div class="tiles-wrap"/>');

    // Generate tiles
    var tiles = [], $tiles;
    (new Array(n_tiles))
      .join('.').split('.')
      .forEach(function(v, i){
        tiles.push('<div class="tiles-tile '+
          (o.slider && 'tiles-slider ') + klass +'-normal"/>');
      });
    $tiles = $(tiles.join(''));

    $tiles.addClass('tiles-x'+ o.x +' tiles-y'+ o.y);
    $tiles.filter(':odd').addClass('tiles-odd');
    $tiles.filter(':even').addClass('tiles-even');

    // Insert in DOM
    $wrap.insertAfter($img);
    $wrap.append($img, $tiles);

    // Make sure image is loaded to get REAL width and height
    // Only load once if image is not cached
    $img.one('load', function(){

      var w = $img.width();
      var h = $img.height();

      $wrap.width(w).height(h);

      $tiles.css({
        width: w/o.x,
        height: h/o.y,
        backgroundImage: 'url('+ $img.attr('src') +')'
      });

      $tiles.each(function(){
        var $this = $(this);
        var pos = $this.position();
        $this.css('backgroundPosition', -pos.left +'px '+ -pos.top +'px');
      });

    });

    // Trigger load event if image is cached
    if ($img[0].complete) { $img.trigger('load'); }

    // Toggle effect
    $img.on('toggleTiles', function(e, reset, cb) {

      reset = reset || false;
      cb = cb || $.noop;

      var delay = ~~(o.tileSpeed / n_tiles);
      var ran = range(0, n_tiles, o.random);

      if (o.limit) {
        var lim = ran.length/(100/o.limit);
        o.reverse ?
          ran.splice(0, lim) :
          ran.splice(lim, ran.length);
      }

      (o.reverse ? ran.reverse() : ran).forEach(function(v,i){
        function anim() { $tiles.eq(v).toggleClass(klass +'-toggle'); }
        setTimeout(anim, reset || i*delay);
        if (o.rewind) {
          var d = i*delay + (o.cssSpeed/(100/o.rewind));
          setTimeout(anim, d);
        }
      });

      // Callback
      setTimeout(cb($tiles, $img), o.tileSpeed);

    });

    $img.hide();

  });
};

/*--------------------------------------------------------------------

  jquery.tilesSlider

---------------------------------------------------------------------*/

$.fn.tilesSlider = function(ops) {

  var o = $.extend({}, options, ops);

  o.slider = true;
  if (o.rewind) { o.fade = true; }

  var $wrap = this;
  $wrap.addClass('tiles-slider-wrap tiles-slider-'+ o.effect +
    ' tiles-slider-s'+ o.cssSpeed);

  var $imgs = $wrap.find('img');
  $imgs.tiles(o);

  var $containers = $wrap.find('.tiles-wrap');
  $containers.fadeTo(0,0).first().fadeTo(0,1);

  // Slideshow:

  function start() {

    var $cont = $containers.filter(':first-child');
    var $img = $cont.find('img');

    o.fade ?
      $cont.delay(o.effectSpeed/2).fadeTo(o.effectSpeed, 0).next().fadeTo(o.effectSpeed, 1) :
      $cont.delay(o.effectSpeed + o.cssSpeed).fadeTo(0,0).next().fadeTo(0,1);

    $img.trigger('toggleTiles', [0, function(tiles){
      tiles.parent().appendTo($wrap);
      if (!o.rewind) {
        setTimeout(function(){
          $img.trigger('toggleTiles', 1);
        }, o.effectSpeed + o.cssSpeed);
      }
    }]);
  }

  // Methods:

  var ival;
  $wrap.on('start', function(e, cb){

    if (ival) { clearInterval(ival); }
    ival = setInterval(start, o.sliderSpeed);
    start();

    var delay = o.sliderSpeed * ($imgs.length-1) + o.effectSpeed;

    if (!o.loop) {
      setTimeout(function(){ $wrap.trigger('stop'); }, delay);
    }

    // Callback
    cb = cb || $.noop;
    setTimeout(cb, delay);
  });

  $wrap.on('stop', function(){ clearInterval(ival); });

  if (o.auto) {
    setTimeout(function(){ $wrap.trigger('start'); }, o.sliderSpeed);
  }

  return $wrap;

};

}());
