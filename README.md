Backbone Infinite Scroll
========================

This is a demo case of an easy infinite scroll page layout.  

[**DEMO**](http://demoinfinite.appspot.com/) *(powered by Google App Engine)*

## Simple setup: ##

### Step #1 - Insert HTML: ###
```html
<div id="infiniteScrollList">
    <!-- 3 columns that will hold the pods -->
    <div class="column"></div>
    <div class="column"></div>
    <div class="column"></div>

    <!-- some controls -->
    <div class="btn btn-more">Load more</div>
    <div class="state no-more-state">There are no more items</div>
    <div class="state load-state">Loading...</div>

    <!-- template of the pods (the same variables as in a JSON below)-->
    <script type="text/template" id="podTemplate">
        <h3><%= title %></h3>
        <div class="id"><%= id %></div>
        <div class="desc"><%= desc %></div>
    </script>

</div>
```
Don't forget to link the requirements: [jQuery](http://jquery.org), [UnderscoreJs](http://underscorejs.org/), [BackboneJs](http://backbonejs.org/)


### Step #2 - Insert JS: ###
```html
<script>
    $(function() {

        //configuration
        var options = {
            columnsSelector: ".column",
            itemTemplateSelector: "#podTemplate",
            itemClasses: "pod",
            dataUrl: "/json"
        };

        //BackboneJs model and Viewer
        var scrollModel = new ScrollModel({options: options});
        new ScrollView({el: $("#infiniteScrollList"), model: scrollModel, options: options});

    })
</script>
```

### Step #3 - Prepare your JSON datastream on a server-side: ###

```json
[
    {
        "id":"0",
        "title":"ways everyone! There's need the away! the",
        "desc":"the to in peaceful me Club' Balance, the pollution. the the"
    },
    {
        "id":"0",
        "title":"ways everyone! There's need the away! the",
        "desc":"the to in peaceful me Club' Balance, the pollution. the the"
    }
]

```

## Configuration: ##

|option name               | desc                                                                              |
|--------------------------|-----------------------------------------------------------------------------------|
|**columnsSelector**       | *jQuery* selector of columns - as many columns as you need (required)             |
|**itemTemplateSelector**  | *jQuery* for the UnderscoreJS template used for rendering pods (required)         |
|**dataUrl**               | Link to server-side JSON document interface. Its called with single variable `?page=1` with a page number (0 - n) as users scroll |
|**data**                  | Static array of JSON objects, check the [demo](http://demoinfinite.appspot.com/static-data). **One of this two data sources is required** |
|**itemClasses**           | A class name (or names) added to each pod div                                     |
|**disableAutoscroll**     | If this option is set as boolean: *true* the scroll detection is disabled ([demo](http://demoinfinite.appspot.com/manual-loading)} |

## Handlers: ##

#### onCountColumnLenght ####
here you can change the encounted column height.

Params:

 - **$column**: the actual column - *DOM elementt extended by jQuery*

Returns:

 - **number** - modified column height  (check the [demo](http://demoinfinite.appspot.com/alternative-layout)) 
 
#### onAddItem ####
called before a new item is rendered

Params:

 - **count**: number of rendered items before + 1
 - **$column**: actual column which will be used for this item  - *DOM elementt extended by jQuery* - you can modify it
 - **$item**: the item itself  - DOM elementt extended by jQquery 
 - **itemData**: the data object for the item

Returns:

 - **FALSE** - when you want to skip this item
 
## Supported browsers: ##

IE8-edge, FF, CH, iOS... 
