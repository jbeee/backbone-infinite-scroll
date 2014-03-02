Simple Backbone Infinite Scroll
========================

This is a demo case of an easy infinite scroll page layout.  

[Demo](http://demoinfinite.appspot.com/) (powered by Google App Engine)


### Simple setup: ###

<script>
    $(function() {
        $(".infinity").summitInfinityScroll({
            url: "/api/data"
        });
    })
</script>

```html
<div class="infinity">
    <!-- 3 columns that will hold the pods -->
    <div class="column column-first"></div>
    <div class="column column-second"></div>
    <div class="column column-third"></div>

    <!-- some controls -->
    <div class="btn btn-more">Load more</div>
    <div class="state no-more-state">There are no more items</div>
    <div class="state load-state">Loading...</div>

    <!-- template of the pods -->
    <script type="text/template" class="pod-prototype">
        <h3><%= title %></h3>
        <div class="id"><%= title %></div>
        <div class="desc"><%= desc %></div>
    </script>
</div>
```

There is needed a JSON api on server side:

```json
{
    "next": "api/data",
    "items": [
        {
            "id":"0",
            "title":"ways everyone! There's need the away! the",
            "desc":"the to in peaceful me Club' Balance, the pollution. the the"
        }
    ]
}
```
(The data content can be as needed - it should reflect the template above)

