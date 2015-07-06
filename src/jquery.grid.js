/*
 * jQuery Grid plugin
 * https://github.com/resurii14/grid
 */

;(function($) {
  function Grid(el, userOptions) {
    var _el = el;
    var _$el = $(el);
    var _columnCount = 1;

    var defaultOptions = {
      rules: [{
        minWidth: 0,
        maxWidth: 599,
        columns: 1
      }, {
        minWidth: 600,
        maxWidth: 959,
        columns: 2
      }, {
        minWidth: 960,
        maxWidth: 0,
        columns: 3
      }],

      sortBy: "columnHeight",
      columnClass: "column"
    };

    var _options = $.extend({}, defaultOptions, userOptions);

    Object.defineProperty(this, "el", {
      get: function() {
        return _el;
      }
    });

    Object.defineProperty(this, "$el", {
      get: function() {
        return _$el;
      }
    });

    Object.defineProperty(this, "options", {
      get: function() {
        return _options;
      }
    });

    Object.defineProperty(this, "rules", {
      get: function() {
        return _options.rules;
      }
    });

    Object.defineProperty(this, "sortBy", {
      get: function() {
        return _options.sortBy;
      }
    });

    Object.defineProperty(this, "columnCount", {
      get: function() {
        return _columnCount;
      },
      set: function(newColumns) {
        _columnCount = parseInt(newColumns) || 1;
      }
    });

    Object.defineProperty(this, "columnClass", {
      get: function() {
        return _options.columnClass;
      }
    });

    this._init();
  };

  Grid.prototype.appendItems = function($newItems) {
    if (this.sortBy == "columnHeight") {
      this._attachItemsByHeight($newItems);
    } else {
      this._attachItemsByOriginalOrder($newItems);
    }
  };

  Grid.prototype.prependItems = function($newItems) {
    var $items = this._getExistingItems();

    if (typeof $newItems != "array") {
      $newItems = [$newItems];
    }

    $newItems = $newItems.concat($items);

    this._removeColumns();
    this._addColumns();
    this.appendItems($newItems);
  };

  Grid.prototype.rebuildColumns = function() {
    var $items = this._getExistingItems();
    var $buffer;

    this._removeColumns();
    this._addColumns();

    if ($items.length > 0) {
      $buffer = $("<div></div>").html($items);
      this.appendItems($buffer.children());
    }
  };


  Grid.prototype._makeColumnFragments = function() {
    var $columns = [];

    for (var i = 0; i < this.columnCount; i++) {
      var $col = $("<div></div>").addClass(this.columnClass);
      $columns.push($col);
    }

    return $columns;
  };

  Grid.prototype._getColumns = function() {
    return this.$el.children();
  };

  Grid.prototype._addColumns = function() {
    var $columns = this._makeColumnFragments();
    this.$el.html($columns);
  };

  Grid.prototype._removeColumns = function() {
    this._getColumns().remove();
  };

  Grid.prototype._getShortestColumn = function($columns) {
    var shortestColIndex = 0;

    $columns.each(function(colIndex) {
      if ($(this).outerHeight() < $columns.eq(shortestColIndex).outerHeight()) {
        shortestColIndex = colIndex;
      }
    });

    return shortestColIndex;
  };

  Grid.prototype._getExistingItems = function() {
    var $columns = this._getColumns();
    var $items = [];
    var colCount = $columns.length;

    $columns.each(function(colIndex) {
      var $rows = $(this).children().detach();

      if ($rows.length) {
        $rows.each(function(rowIndex) {
          $items[rowIndex * colCount + colIndex] = $(this);
        });
      }
    });

    return $.grep($items, function(n) {
      return n;
    });
  };

  Grid.prototype._attachItemsByHeight = function($newItems) {
    var self = this;
    var nextColIndex = 0;
    var $columns = self._getColumns();

    $.each($newItems, function(itemIndex) {
      nextColIndex = self._getShortestColumn($columns);
      $columns.eq(nextColIndex).append($(this));
    });
  };

  Grid.prototype._attachItemsByOriginalOrder = function($newItems) {
    var self = this;
    var nextColIndex = 0;
    var $columns = self._getColumns();
    var $buffer = self._makeColumnFragments();

    $.each($newItems, function() {
      $buffer[nextColIndex].append($(this));

      nextColIndex++;

      if (nextColIndex >= $columns.length) {
        nextColIndex = 0;
      }
    });

    $columns.each(function(colIndex) {
      $(this).append($buffer[colIndex].children());
    });
  };

  Grid.prototype._init = function() {
    var self = this;
    var $items = self.$el.children().detach();

    self._addColumns();
    self.appendItems($items);

    if (self.rules.length) {
      $.each(self.rules, function() {
        var rule = this;
        var mediaQuery = [];

        if (rule.minWidth) {
          mediaQuery.push("(min-width: " + rule.minWidth + "px)");
        }

        if (rule.maxWidth) {
          mediaQuery.push("(max-width: " + rule.maxWidth + "px)");
        }

        if (mediaQuery.length) {
          mediaQuery = mediaQuery.join(" and ");
          enquire.register(mediaQuery, {
            match: function() {
              self.columnCount = rule.columns;
              self.rebuildColumns();
            }
          }, true);
        }
      });
    }
  };


  // Make it available to jQuery-wrapped objects
  $.fn.grid = function(options) {
    return $(this).each(function() {
      //store grid instance to element's data
      $.data(this, "grid", new Grid(this, options));
    });
  };
})(window.jQuery);