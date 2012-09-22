;(function(){
/**
* randomRange Get an array of numbers in random order
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
*/
$.fn.tiles = function(ops) {

  var o = $.extend({
    x: 5, y: 5,
    rand: false,
    speed: 400,
    effect: 'default'
  }, ops);

  return this.each(function() {

    var $img = $(this);
    var klass = 'tiles-'+ o.effect;

    if (!$img.is('img')) {
      $.error('Selector can only contain images.');
    }

    // Generate tiles
    var tiles = [], $tiles;
    (new Array(o.x * o.y))
      .join('.').split('.')
      .forEach(function(v, i){
        tiles.push('<div class="tiles-tile '+ klass +'-normal"/>');
      });
    $tiles = $(tiles.join(''));

    // Make sure image is loaded to get REAL width and height
    $img.load(function(){

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

    // Toggle effect
    $img.on('toggleTiles', function(){
      var delay = ~~(o.speed / $tiles.length);
      range(0, o.x*o.y, o.rand).forEach(function(v, i){
        setTimeout(function(){
          $tiles.eq(v).toggleClass(klass +'-toggle');
        }, i*delay);
      });
    });

    $img.hide();

  });
};
}());
