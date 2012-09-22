#jq-tiles

Split images into tiles with css3 transitions.

**Demo:** http://elclanrs.github.com/jq-tiles/

### Options:
* **x**: number of tiles in X axis.
* **y**: number of tiles in Y axis.
* **rand**: animate effect in random order.
* **speed**: speed of effect in ms.
* **effect**: `default`, `simple`.

### Example:
```javascript
  $('img').tiles({ rand: true }).trigger('toggleTiles');
```



