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
  slideSpeed: 3000,
  tileSpeed: 1000,
  cssSpeed: 300
};

/*--------------------------------------------------------------------

  jquery.tiles

---------------------------------------------------------------------*/

$.fn.tiles = function(ops) {

  var o = $.extend({}, options, ops);

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
        tiles.push('<div class="tiles-tile '+ klass +'-normal"/>');
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
    $img.on('toggleTiles', function(e, toggleOps) {

      toggleOps = $.extend(true, {
        toggle: true,
        reset: false,
        cb: $.noop
      }, toggleOps);

      var ran = range(0, n_tiles, o.random);
      var delay = ~~(o.tileSpeed / n_tiles);

      if (o.limit) {
        var lim = ran.length/(100/o.limit);
        o.reverse ?
          ran.splice(0, lim) :
          ran.splice(lim, ran.length);
      }

      // Reset
      $tiles.removeClass('tiles-reset');
      if (toggleOps.reset) { $tiles.addClass('tiles-reset'); }

      (o.reverse ? ran.reverse() : ran).forEach(function(v, i) {
        function anim(toggle, delay) {
          setTimeout(function(){
            $tiles.addClass('tiles-animated');
            $tiles.eq(v).toggleClass(klass +'-toggle', toggle);
          }, delay);
        }
        anim(toggleOps.toggle, toggleOps.reset ? 0 : i * delay);
        if (o.rewind) { anim(false, i * delay + (o.cssSpeed/(100/o.rewind))); }
      });

      // Finished animating
      var isSingle = o.x === 1 && o.y === 1;
      var done = toggleOps.reset ? 0 : (isSingle ? o.cssSpeed : o.tileSpeed + o.cssSpeed);
      setTimeout(function(){
        $tiles.removeClass('tiles-animated');
        // callback
        toggleOps.cb($tiles, $img);
      }, done);

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
  // Insert in reverse order so next image is always on top
  $containers.each(function(){ $(this).prependTo($wrap); });

  // Start slideshow / Next slide:
  function start() {

    var $cur = $containers.filter(':last-child');
    var $next = $cur.prev(); // Next image is the previous one
    var $img = $cur.find('img');

    if (o.fade) { $next.fadeTo(0,0).fadeTo(o.tilesSpeed, 1); }
    if (o.rewind) { $cur.delay(o.tileSpeed/2).fadeTo(o.tileSpeed, 0); }

    $img.trigger('toggleTiles', { cb: function(){
      $cur.prependTo($wrap);
      $img.trigger('toggleTiles', { toggle: false, reset: true });
    }});
  }

  // Methods:
  var ival;
  $wrap.on('start', function(e, cb) {

    var $cur = $containers.filter(':last-child');
    var $img = $cur.find('img');
    var isAnimating = $containers.filter(':last-child').find('.tiles-animated').length;
    var delay = o.slideSpeed * ($imgs.length-2) + o.tileSpeed;

    if (ival) { clearInterval(ival); }
    ival = setInterval(start, o.slideSpeed);

    if (!isAnimating) {
      start();
    } else {
      $img.trigger('toggleTiles', { toggle: false, reset: true });
      $cur.prependTo($wrap);
    }

    if (!o.loop) { setTimeout(function(){ $wrap.trigger('stop'); }, delay); }

    // Callback
    cb = cb || $.noop;
    setTimeout(cb, delay);
  });

  $wrap.on('stop', function(){ clearInterval(ival); });

  if (o.auto) {
    setTimeout(function(){ $wrap.trigger('start'); }, o.slideSpeed);
  }

  return $wrap;

};

}());
