;

"use strict"; // jshint ;_;

var ScrollView = Backbone.View.extend({
    columns: [],
    itemCount: -1,
    initialize: function(opts) {

        this.options = opts.options;

        this.fetchColumns();
        this.addMoreItems();

        var self = this;

        //on scroll page - load more data
        if (this.options.disableAutoscroll !== true) {

            var infinityScrollHandler = function(e) {
                //is position of scroll near by end?

                if (($(window).scrollTop() + $(window).height()) > ($(document).height() - $(window).height())) {
                    self.addMoreItems();
                }
            };

            //start of scroll event for touch devices
            document.addEventListener("touchmove", infinityScrollHandler, false);
            document.addEventListener("scroll", infinityScrollHandler, false);
        }

        //on resize the window - check the column count (responsive behavior)
        window.onresize = function(event) {
            this.fetchColumns();
        };
    },
    events: {
        "click .btn-more": "addMoreItems" //it's a fallback, the link above the scroll area -  when auto-scroll detection is broken
    },
    fetchColumns: function() {
        var self = this;

        var $columns = $(this.options.columnsSelector + ":visible");

        if ($columns.length < 1) {
            jQuery.error("Columns are missing, please check the " + this.options.columnsSelector + ":visible selector");
        }

        var doResetItems = false;

        if (self.columns.length !== $columns.length) { //there is a different column size suddenly (responsive design works)

            self.columns = [];

            $columns.each(function(i, column) {
                self.columns.push($(column));
            });

            if (doResetItems) {
                self.resetItems();
            }
        }
    },
    resetItems: function() {
        this.thereAreNoMoreItems = false;
        this.itemCount = -1;

        //clear columns
        _.each(this.columns, function($item) {
            $item.html("");
        });

        this.addMoreItems();
    },
    getShortenColumn: function() { //determine the shorten column
        var self = this;

        var countHeight = function($column) {
            var columnHeight;

            //call handler that allowes progammer to change the column height count (check the demos)
            if (typeof self.options.onCountLenght !== 'undefined') {
                columnHeight = self.options.onCountLenght($column);
            }

            if (typeof columnHeight === 'undefined') {
                columnHeight = $column.height();
            }

            return columnHeight;
        };

        var $shortenColumn = this.columns[0]; //get first column
        var shortenColumnHeight = countHeight($shortenColumn);

        for (var i = 1; i < this.columns.length; i++) { //compare with the rest of columns
            var $nextColumn = this.columns[i];
            var nextColumnHeight = countHeight($nextColumn);
            if (nextColumnHeight < shortenColumnHeight) { //new shorten column ?
                var $shortenColumn = $nextColumn;
                shortenColumnHeight = nextColumnHeight;
            }
        }

        return $shortenColumn;
    },
    gettingMore: false, //lock if it's rendering now 
    addMoreItems: function() {
        var self = this;

        if (this.gettingMore === true) {
            return;
        } else {
            this.gettingMore = true;
        }

        if (!this.model.hasMore()) {
            this.$el.find(".btn-more, .load-state").hide();
            this.$el.find(".no-more-state").show();

        } else {
            this.$el.find(".btn-more, .no-more-state").hide();
            this.$el.find(".load-state").show();

            this.model.getMore(function(items) {
                self.renderItems(items);
            });
        }
    },
    renderItems: function(itemsData) {
        var self = this;

        var templateSrc = self.$el.find(this.options.itemTemplateSelector).html();

        if (typeof templateSrc === 'undefined') {
            jQuery.error("Missing pod prototype (check the itemTemplateSelector: " + this.options.itemTemplateSelector + ")");
        }

        var renderItem = function(i, itemsData) {

            self.itemCount = self.itemCount + 1;
            var itemData = itemsData[i];

            //evaluate additional CSS class names
            var classesStr = "";
            if (typeof self.options.itemClasses === 'string') { //if it's a string 
                classesStr = self.options.itemClasses;
            } else if (typeof self.options.itemClasses === 'function') { //a function
                classesStr = self.options.itemClasses(itemData);
            }

            var html = _.template(templateSrc, itemData); //item html body

            var $item = jQuery('<div/>', {//create an item DIV wrapper
                class: classesStr,
                html: html
            });

            // try to call the onAddItem - return false means don't continue
            //
            // returns:
            // 
            // false = don't continue, skip this item node
            // object = here is a new item node, please use it but use also the origin one
            // -none- = continue and place the origin node as usual            
            if (typeof self.options.onAddItem === 'undefined' || self.options.onAddItem(self.itemCount, self.getShortenColumn(), $item, items[i]) !== false) {
                $item.appendTo(self.getShortenColumn());
            }

            if (i < itemsData.length - 1) {
                setTimeout(function() { //it's necessary  
                    renderItem(i + 1, itemsData);
                }, 10);
            } else {
                self.gettingMore = false;

                if (self.model.hasMore()) {
                    self.$el.find(".btn-more").show();
                    self.$el.find(".load-state").hide();
                } else {
                    self.$el.find(".load-state").hide();
                    self.$el.find(".no-more-state").show();
                }
            }
        };

        renderItem(0, itemsData);
    }
});
