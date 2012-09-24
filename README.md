#jq-tiles

Split images in tiles with css3 transitions.

**Demo:** http://elclanrs.github.com/jq-tiles/  
**Support:** Webkit, Firefox, Opera, IE10, IE9-8*  
**License:** [MIT](http://en.wikipedia.org/wiki/MIT_License)  
\* _In browsers that don't support css3 transitions classes won't be animated but some effects will still work, just a bit choppy._  
\*\* _IE8 requires polyfills for `Array.prototype.map` and `Array.prototype.forEach`. You may use [ES5 Shim](https://github.com/kriskowal/es5-shim/)._

### Options:
```javascript
{
x: 4, y: 4, // limit 20
slider: false,
effect: 'default',
fade: true,
random: false,
reverse: false,
limit: false,
rewind: false, // reverse animation at a certain percentage in time
loop: true,
effectSpeed: 1200,
sliderSpeed: 3000,
cssSpeed: 300
}
```

### Effects:
* **default**
* **simple**
* **switchlr:** `y=1` and `x` must be even.
* **switchud:** `x=1` and `y` must be even.
* **updown:** `y=1`.
* **leftright:** `x=1`.
* **fliplr:** `y=1`.
* **flipud:** `x=1`.

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
$('.slider').tilesSlider({ random: true });
```



