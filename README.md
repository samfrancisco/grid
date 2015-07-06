# Grid
Grid is a jQuery plugin for building "masonry-like" layouts. Inspired by [salvattore.js](http://salvattore.com).


## Features
* May be used on multiple elements within the same page, each with its own set of options.
* No default/required styles.


## Requirements
* jQuery >= 2.1.3
* enquire.js >= v2.1.2
* matchMedia() polyfill


## Usage
```javascript
  // Initialize the grid. See Options for more details.
  $("#wall").grid(options);

  // Get the reference to the Grid instance
  var $wallGrid = $("#wall").data("grid");

  // See Methods for more details on valid items.
  $wallGrid.appendItems($items);
  $wallGrid.prependItems($items);
```

## Methods
Items may be in any of the following formats:
```javascript
  // A single jQuery object
  var $items = $("<div></div>");

  // A jQuery object returned by .children()
  var $items = $("#items").children();
```

### grid(options)
Initializes the grid. Attaches the instance to the element by using the data attribute. If the grid element has children before initialization, the grid will reattach all the direct children as a grid item.

```javascript
$("#wall").grid(options);
```

### appendItems(items)
Appends item(s) to the grid.

```javascript
var $wallGrid = $("#wall").data("grid"); // Get reference to the Grid instance
$wallGrid.appendItems(items);
```

### prependItems(items)
Prepends item(s) to the grid.

```javascript
var $wallGrid = $("#wall").data("grid"); // Get reference to the Grid instance
$wallGrid.prependItems(items);
```

### rebuildColumns()
Rebuilds the grid.
```javascript
var $wallGrid = $("#wall").data("grid"); // Get reference to the Grid instance
$wallGrid.rebuildColumns();
```

## Options
* __rules__: an array of objects defining the number of columns for a given viewport size.
```javascript
  $("#wall").grid({
    rules: [{
      minWidth: 0,      // minimum viewport width
      maxWidth: 599,    // maximum viewport width
      columns: 1        // number of columns for the given minWidth and maxWidth
    }];
  });
```
```javascript
  // Defaults to the following rules:
  [{
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
  }]
```

* __sortBy__
  * `columnHeight`: Default. Inserts the items into the shortest column.
  * `originalOrder`: Inserts the items as is, one per column.

* __columnClass__: CSS class to be assigned to the columns. Defaults to `column`.