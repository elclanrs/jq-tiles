;(function( $, window, undefined ) {

  // Globals:

  var _defaults = {
      x: 4, y: 4,
      slider: false,
      effect: 'default',
      fade: false,
      random: false,
      reverse: false,
      backReverse: false,
      limit: false,
      rewind: false,
      auto: false,
      loop: false,
      slideSpeed: 3500,
      tileSpeed: 800,
      cssSpeed: 300,
      nav: true,
      bullets: true,
      navWrap: null,
      thumbs: true,
      thumbSize: 25,
      timer: true,
      beforeChange: $.noop,
      afterChange: $.noop,
      onSlideshowEnd: $.noop
    }
    , Utils = {
     /**
      * range Get an array of numbers within a range
      * @param min {number} Lowest number in array
      * @param max {number} Highest number in array
      * @param rand {bool} Shuffle array
      * @return {array}
      */
      range: function( min, max, rand ) {
        var arr = ( new Array( ++max - min ) )
          .join('.').split('.')
          .map(function( v,i ){ return min + i })
        return rand
          ? arr.map(function( v ) { return [ Math.random(), v ] })
             .sort().map(function( v ) { return v[ 1 ] })
          : arr
      }
    }

  // Constructor:

  function TilesSlider( element, options ) {

    this.opts = $.extend( {}, _defaults, options )
    this.klass = 'tiles-'+ this.opts.effect
    this.klassNormal = this.klass + '-normal'
    this.klassAnim = this.klass + '-anim'
    this.n_tiles = this.opts.x * this.opts.y

    this.$container = $( element )
    this.$images = this.$container.find('img')

    this.imgWidth = this.$container.width()
    this.imgHeight = this.$container.height()

    this.timeouts = []
    this.slideshow = null
    this.isAnimating = null

    // Assign in _init when elements are generated
    this.$navLinks = null
    this.$descriptions = null
    this.$timer = null

    if ( this.opts.rewind ) { this.opts.fade = true }

    this._init()

  }

  // Methods:

  TilesSlider.prototype = {

    _init: function() {

      var self = this
        , o = self.opts

      // Do nothing if there are no images
      if ( !self.$images.length ) { return false }

      self.$container.addClass('tiles-slider-wrap tiles-slider-'+
        o.effect +' tiles-slider-s'+ o.cssSpeed)

      // Generate tiles
      self.$images.each(function() { self._generateTiles( $(this) ) })

      // Remove from DOM to handle in slider
      self.$wraps = self.$container.find('.tiles-wrap').detach()
      self.$wraps.first().addClass('tiles-wrap-current').appendTo( self.$container )

      if ( o.nav ) {
        self._addNav()
        self.$navLinks = self.$container.find('.tiles-nav-item')
      }

      if ( o.timer ) {
        self._addTimer()
        self.$timer = self.$container.find('.tiles-timer')
      }

      self._setupDescriptions()
      self.$descriptions = self.$container.find('.tiles-description')
      self._showOrHideDescription()

      // Prevent css3 transitions on load
      $('body').addClass('tiles-preload')
      $( window ).load(function(){ $('body').removeClass('tiles-preload') })

      if ( o.auto ) { self.start() }

    },

    _addTimer: function() {
      this.$container.append('<div class="tiles-timer"/>')
    },

    _updateTimer: function() {
      if ( this.opts.timer ) {
        this.$timer.animate( { width: '100%' }, this.opts.slideSpeed, 'linear' )
      }
    },

    _resetTimer: function() {
      if ( this.opts.timer ) {
        this.$timer.stop( true ).width( 0 )
      }
    },

    _addNav: function() {

      var self = this
        , o = self.opts
          // double-wrap in case a string is passed
        , $nav = $( o.navWrap || '<div/>' ).addClass('tiles-nav')
        , links = [], $links, thumb
        , $next = $('<a href="#" class="tiles-next">Next &raquo;</a>')
        , $prev = $('<a href="#" class="tiles-prev">&laquo; Prev</a>')
        , thumbHeight = self.imgHeight * o.thumbSize / 100
        , thumbWidth = self.imgWidth * o.thumbSize / 100

      for ( var i = 1; i < self.$wraps.length + 1; i++ ) {
        thumb = '<span><img src="'+ self.$images.eq( i-1 ).attr('src') +'"/></span>'
        links.push('<a href="#" class="tiles-nav-item '+ ( o.bullets ? 'tiles-bullet' : 'tiles-pagination' ) +'">'+
          ( !o.bullets ? i : '') + ( o.thumbs ? thumb : '' ) + '</a>')
      }

      $links = $( links.join('') )

      // Events
      $links.click(function() {
        var $this = $(this)
          , idx = $links.index( $this )
        self._navigate( idx, $.noop )
      })
      $links.first().addClass('tiles-nav-active') // init

      $next.click(function() { self.next() })
      $prev.click(function() { self.prev() })

      $links.add( $next ).add( $prev )
        .click(function(e) { e.preventDefault() })

      // Insert in DOM

      if ( o.navWrap ) {
        $nav.append( $links )
      } else {
        self.$container.append( $nav.append( $links ) )
        // Adjust center
        $nav.css( 'margin-left', '-'+ $nav.outerWidth()/2 +'px' )
      }

      self.$container.append( $prev, $next )

      // Adjust thumbnails when already in DOM
      $links.find('img').height( thumbHeight ).width( thumbWidth )
      $links.find('span').each(function(){
        var $this = $(this)
        $this.css({
          top: -$this.outerHeight() - $nav.outerHeight(),
          left: -( $this.outerWidth() - $this.parent().outerWidth() ) / 2
        })
      })

    },

    _updateNav: function() {
      if ( this.opts.nav ) {
        this.$navLinks.removeClass('tiles-nav-active')
          .eq( this._getCurrentIdx() ).addClass('tiles-nav-active')
      }
    },

    _setupDescriptions: function() {
      // Add empty description if it doesn't exist
      // so we don't mess with the index
      this.$images.each(function() {
        if ( !$(this).next('p').length ) { $(this).after('<p/>') }
      })
      this.$container.find('p').each(function() {
        $(this).wrapAll('<div class="tiles-description '+
          ( $(this).is(':empty') ? 'tiles-description-empty' : '' ) +'"/>')
      })
    },

    _showOrHideDescription: function( toggle ) {
      this.$descriptions.removeClass('tiles-description-active')
        .eq( this._getCurrentIdx() ).toggleClass( 'tiles-description-active', toggle )
    },

    _generateTiles: function( $img ) {

      var self = this
        , o = self.opts
        , tiles = [], $tiles

      for ( var i = 0; i < self.n_tiles; i++ ) {
        tiles.push('<div class="tiles-tile '+ self.klassNormal +'"/>')
      }

      $tiles = $( tiles.join('') )

      $tiles.addClass('tiles-x'+ o.x +' tiles-y'+ o.y)
        .filter(':odd').addClass('tiles-odd').end()
        .filter(':even').addClass('tiles-even')

      $tiles.css({
        width: self.imgWidth / o.x,
        height: self.imgHeight / o.y,
        backgroundImage: 'url('+ $img.attr('src') +')'
      })

      // Insert in DOM
      $('<div class="tiles-wrap"/>').append( $tiles ).insertAfter( $img.hide() )

      // Calculate offset when image is in DOM
      $tiles.each(function(){
        var $this = $(this), pos = $this.position()
        $this.css('backgroundPosition', -pos.left +'px '+ -pos.top +'px')
      })

    },

    _animateTiles: function( $wrap, callback ) {

      callback = callback || $.noop

      var self = this
        , o = self.opts
        , range = Utils.range( 0, self.n_tiles, o.random )
        , delay = Math.floor( o.tileSpeed / self.n_tiles )
        , limit = range.length / ( 100/o.limit )
        , done = self.n_tiles > 1 ? o.tileSpeed + o.cssSpeed : o.cssSpeed
        , $tiles = $wrap.find('.tiles-tile')

      self.isAnimating = true

      if ( o.reverse ) { range = range.reverse() }

      if ( o.limit ) {
        o.reverse
          ? range.splice( 0, limit )
          : range.splice( limit, range.length )
      }

      range.forEach(function( tile, i ) {

        var theTile = $tiles.eq( tile )
          , theDelay = i * delay

        setTimeout(function() { theTile.addClass( self.klassAnim ) }, theDelay )

        if ( o.rewind ) {
          theDelay += o.cssSpeed / ( 100/o.rewind )
          setTimeout(function() { theTile.removeClass( self.klassAnim ) }, theDelay )
        }

      })

      // Callback
      setTimeout(function() {
        self.isAnimating = false
        callback()
      }, done )

    },

    _resetTiles: function( $wrap ) {
      $wrap.find('.tiles-tile').removeClass( this.klassAnim )
    },

    _getCurrentWrap: function() {
      return this.$wraps.filter('.tiles-wrap-current')
    },

    _getCurrentIdx: function() {
      return this.$wraps.index( this._getCurrentWrap() )
    },

    _navigate: function( idx, callback ) {

      var self = this
        , o = self.opts
        , $cur = self._getCurrentWrap()
        , $target = self.$wraps.eq( idx )
        , curIdx = self._getCurrentIdx()

      if ( idx === curIdx || self.isAnimating ) {
        return false
      }

      self.$container.find('.tiles-wrap').removeClass('tiles-wrap-current')
      $target.addClass('tiles-wrap-current').prependTo( self.$container )

      if ( o.fade ) {
        $target.fadeOut(1).fadeIn( o.tileSpeed )
      }

      if ( o.rewind ) {
        $cur.fadeIn(1).delay( o.tileSpeed/2 ).fadeOut( o.tileSpeed )
      }

      if ( o.backReverse ) {
        o.reverse = idx < curIdx
      }

      self._animateTiles( $cur, function() {
        $cur.remove()
        self._resetTiles( $cur )
        self._showOrHideDescription( true )
        if ( self.slideshow ) { self.stop().start() }
        if ( callback ) { callback() }
        o.afterChange()
      })

      o.beforeChange()

      self._updateNav()
      self._resetTimer()
      self._showOrHideDescription( false )

      return this

    },

    // Public methods:

    prev: function( callback ) {

      var self = this
        , $cur = self._getCurrentWrap()
        , isFirst = $cur.is( self.$wraps.first() )
        , idx = isFirst ? self.$wraps.length - 1 : self._getCurrentIdx() - 1

      return this._navigate( idx, callback || $.noop )

    },

    next: function( callback ) {

      var self = this
        , $cur = self._getCurrentWrap()
        , isLast = $cur.is( self.$wraps.last() )
        , idx = isLast ? 0 : self._getCurrentIdx() + 1

      return this._navigate( idx, callback || $.noop )

    },

    start: function() {

      var self = this
        , o = self.opts
        , totalSpeed = o.slideSpeed + o.cssSpeed
        , endLoop = totalSpeed * ( self.$wraps.length - self._getCurrentIdx() )

      if ( self.n_tiles > 1 ) { endLoop += o.tileSpeed }

      this.slideshow = true
      self.timeouts.push( setTimeout(function(){ self.next() }, o.slideSpeed ) )

      if ( !o.loop ) {
        self.timeouts.push( setTimeout(function(){
          self.stop()
          o.onSlideshowEnd()
        }, endLoop ) );
      }

      this._updateTimer()

      return this

    },

    stop: function() {
      this.timeouts.forEach(function( v ) { clearTimeout( v ) })
      this.slideshow = false
      this._resetTimer()
      return this
    }

  }

  // jQuery plugin:

  $.fn.tilesSlider = function( options ) {
    var args = Array.prototype.slice.call( arguments, 1 )
    return this.each(function() {
      if ( typeof options === 'string' ) {
        var plugin = $.data( this, 'tiles-slider' )
        plugin[ options ].apply( plugin, args )
      } else if ( !$.data(this, 'tiles-slider') ) {
        $.data( this, 'tiles-slider', new TilesSlider( this, options ) )
      }
    })
  }

}( jQuery, window ))
