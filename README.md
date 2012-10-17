#jq-tiles

Slideshow with images split in tiles and css3 transitions.

**Demo:** http://elclanrs.github.com/jq-tiles/  
**Support:** Webkit, Firefox, Opera, IE10, IE9-8*  
**License:** [MIT](http://en.wikipedia.org/wiki/MIT_License)  
\* _In browsers that don't support css3 transitions classes won't be animated but some effects will still work, just a bit choppy._  
\*\* _IE8 requires polyfills for `Array.prototype.map` and `Array.prototype.forEach`. You may use [ES5 Shim](https://github.com/kriskowal/es5-shim/)._  

[Download as zip](https://github.com/elclanrs/jq-tiles/raw/master/zip/jquery.tiles.zip)

### Options:
```javascript
{
x: 4, y: 4, // limit 20 each
effect: 'default',
fade: false, // fade images in addition to the tiles effect
random: false, // animate tiles in random order
reverse: false, // start animation from opposite direction
rewind: false, // reverse animation at a certain percentage in time
auto: false,
loop: true,
slideSpeed: 3000, // time between slides
tileSpeed: 1000, // time to clear all tiles
cssSpeed: 300, // css3 transition speed [100,200,300,400,500,600,700,800,900,1000]
beforeChange: function() {},
afterChange: function() {}
}
```

### Methods:

#### start
```javascript
$('.slider').tilesSlider('start')
```

#### stop
```javascript
$('.slider').tilesSlider('stop')
```

#### next
```javascript
$('.slider').tilesSlider('next', callback)
```

#### prev
```javascript
$('.slider').tilesSlider('prev', callback)
```

### Usage:

**HTML:**
```html
<div class="slider">
  <img src="img1.jpg"/>
  <img src="img2.jpg"/>
  <img src="img3.jpg"/>
</div>
```

**CSS:**
```css
.slider { width: 600px; height: 400px; }
```

**jQuery:**
```javascript
$('.slider').tilesSlider({ random: true })
```



