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

/**
* tiles jQuery plugin to split images into tiles with css3 transitions
* @param ops {obj} Options:
* - x: number of tiles in x axis
* - y: number of tiles in y axis
* - rand: animate in random order
* - speed: duration of the effect
* - effect: the animation effect (css class with transitions)
* - reverse: begin effect from opposite side
* - limit: limit animation to a certain percentage of the image. 
*/
$.fn.tiles = function(ops) {

  var o = $.extend({
    x: 4, y: 4,
    rand: false,
    speed: 400,
    effect: 'default',
    reverse: false,
    limit: false
  }, ops);

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

    // Generate tiles
    var tiles = [], $tiles;
    (new Array(n_tiles))
      .join('.').split('.')
      .forEach(function(v, i){
        tiles.push('<div class="tiles-tile '+ klass +'-normal"/>');
      });
    $tiles = $(tiles.join(''));

    // Make sure image is loaded to get REAL width and height
    // Only load once if needed
    $img.one('load', function(){

      var w = $img.width();
      var h = $img.height();

      // Insert in DOM
      $img.wrap($('<div class="tiles-wrap"/>').width(w).height(h));
      $tiles.insertAfter($img);

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
    $img.on('toggleTiles', function(){
      var delay = ~~(o.speed / n_tiles);
      var ran = range(0, n_tiles, o.rand);
      function anim(i,v,d,lim) {
       setTimeout(function(){
          $tiles.eq(v).toggleClass(klass +'-toggle');
        }, i*d+(lim||0));
      }
      (o.reverse ? ran.reverse() : ran).forEach(function(v,i){
        anim(i,v,delay);
        if (o.limit) { anim(i,v,delay,(o.speed/(100/o.limit))); }
      });
    });
    
    $tiles.addClass('tiles-x'+ o.x +' tiles-y'+ o.y);
    $tiles.filter(':odd').addClass('tiles-odd');
    $tiles.filter(':even').addClass('tiles-even');

    $img.hide();

  });
};
}());
