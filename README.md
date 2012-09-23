#jq-tiles

Split images in tiles with css3 transitions.

**Demo:** http://elclanrs.github.com/jq-tiles/  
**Support:** Webkit, Firefox, Opera, IE10, IE9-8*  
**License:** [MIT](http://en.wikipedia.org/wiki/MIT_License)  
\* _For browsers that don't support css3 transitions classes won't be animated but the effects will still work, just a bit choppy._  
\*\* _IE8 requires polyfills for `Array.prototype.map` and `Array.prototype.forEach`. You may use [ES5 Shim](https://github.com/kriskowal/es5-shim/)._

### Options:
* **x**: number of tiles in X axis.
* **y**: number of tiles in Y axis.
* **rand**: animate tiles in random order.
* **speed**: speed of effect in ms.
* **effect**: `default`, `simple`, `switchlr`, `switchud`, `updown`, `leftright`, `fliplr`, `flipud`.
* **reverse:** begin effect from opposite side.
* **limit:** limit animation to a certain percentage of the image.
* **rewind:** toggle animation back at a certain point in time (percentage).

### Effects:
* **default**
* **simple**
* **switchlr:** `y=1` and `x` must be even.
* **switchud:** `x=1` and `y` must be even.
* **updown:** `y=1`.
* **leftright** `x=1`.
* **fliplr**
* **flipud**

### Usage:
Use `.trigger('toggleTiles')` to toggle the effect on and off.

### Example:
```javascript
var $img = $('img').tiles({ rand: true });
$('button').click(function(){ $img.trigger('toggleTiles'); };
```



