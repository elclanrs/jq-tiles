# jq-tiles

Slideshow with many cool css3 effects.

**Demo:** http://elclanrs.github.com/jq-tiles/ (Use Google Chrome for best experience)  
**Support:** Webkit, Firefox, Opera, IE10, IE9-8*  
**License:** [MIT](http://en.wikipedia.org/wiki/MIT_License)  

### Options:
```javascript
{
  x              : 4, // # of tiles in x axis, 20 max
  y              : 4, // # of tiles in y axis, 20 max
  effect         : 'default',
  fade           : false, // fade images in addition to the tiles effect
  random         : false, // animate tiles in random order
  reverse        : false, // start animation from opposite direction
  backReverse    : false, // reverse the animation when going back in the slideshow (useful for some effects)
  rewind         : false, // reverse animation at a certain percentage in time
  auto           : false, // Start the slideshow on load
  loop           : false, // Start slideshow again when it finishes
  slideSpeed     : 3500, // time between slides
  tileSpeed      : 800, // time to clear all tiles
  cssSpeed       : 300, // css3 transition speed [100,200,300,400,500,600,700,800,900,1000],
  nav            : true, // Add navigation
  navWrap        : null, // Add the navigation to an existing element
  bullets        : true, // Show bullets, if false the show pagination with numbers
  thumbs         : true, // Show thumbnails when hovering nav
  thumbSize      : 25, // Thumbnail size (percentage of the original image)
  timer          : true // show or hide the timer bar
  beforeChange   : function() {}, // Runs before changing the image
  afterChange    : function() {} // Runs after the tiles have cleared
  onSlideshowEnd : function() {} // Runs when the slideshow finishes ( "loop" must be set to false )
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
  <img src="img1.jpg"/> <!-- No description -->
  <img src="img2.jpg"/><p>Description image two</p>
  <img src="img3.jpg"/><p>Description image three</p>
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



