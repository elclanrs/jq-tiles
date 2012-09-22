;(function(){
/**
* randomRange Get an array of numbers in random order
* @param min Lowest number in array
* @param max Highest number in array
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

    var w = $img.width();
    var h = $img.height();

    $img.wrap($('<div class="tiles-wrap"/>').width(w).height(h));

    var tiles = [];
    (new Array(o.x * o.y))
      .join('.').split('.')
      .forEach(function(v, i){
        tiles.push('<div class="tiles-tile '+ klass +'-normal"/>');
      });

    var $tiles = $(tiles.join(''));

    $tiles.insertAfter($img);

    $tiles.css({
      width: w/o.x,
      height: h/o.y,
      backgroundImage: 'url('+ $img.attr('src') +')'
    })
    .each(function(){
      var $this = $(this);
      var pos = $this.position();
      $this.css('backgroundPosition', -pos.left +'px '+ -pos.top +'px');
    });

    $img.on('toggleSlice', function(){
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
