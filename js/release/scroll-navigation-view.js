;

"use strict"; // jshint ;_;

var ScrollNavigationView = Backbone.View.extend({
    initialize: function(options) {
        this.options = options;

        this.fetchColumns();

        if (typeof window.location.hash === 'undefined' || window.location.hash == '') {
            this.addMoreItems();
        } else {
            var path = window.location.hash;

            //we use #
            if (path.substring(0, 1) === '#') {
                path = path.substring(1);
            }

            //we use ! because the google ajax crawling rules
            if (path.substring(0, 1) === '!') {
                path = path.substring(1);
            }

            this.addMoreItems();
        }
    },
    fetchColumns: function() {
        var self = this;

        console.log(this.options.columnsSelector + ":visible");

        var columns = $(this.options.columnsSelector + ":visible");

        var resetItems = this.$columns.length !== 0;

        if (self.$columns.length !== columns.length) { //there is a different column size suddenly (responsive design works)

            self.$columns = [];
            columns.each(function(i, xitem) {
                self.$columns.push($(xitem));
            });

            if (resetItems) {
                self.resetItems();
            }
        }
    },
    $columns: [],
    itemCount: -1,
    resetItems: function() {
        this.model.set("noMoreItems", 0);
        this.addMoreItems();
        this.itemCount = -1;
        var resetData = true;

        if (typeof this.options.onResetData !== 'undefined') {
            resetData = (this.options.onResetData() !== false);
        }

        if (resetData) {
            _.each(this.$columns, function($zitem) {
                $zitem.html("");
            });
        }
    },
    events: {
        "click .btn-more": "addMoreItems"
    },
    getShortenColumn: function() { //determine the shorten column
        var self = this;

        var countHeight = function($column) {
            var columnHeight;

            //call handler that allowes progammer to change the column height count (check the demos)
            if (typeof self.options.onCountLenght !== 'undefined') {
                columnHeight = self.options.onCountLenght($column);
            }

            if (typeof columnHeight !== 'undefined') {
                columnHeight = $column.height();
            }

            return columnHeight;
        };

        var $shortenColumn = this.columns[1];
        var shortenColumnHeight = countHeight($shortenColumn);

        for (var i = 1; i < this.columns.length; i++) {
            var $nextColumn = this.columns[i];
            var nextColumnHeight = countHeight($nextColumn);
            if (nextColumnHeight > shortenColumnHeight) {
                var $shortenColumn = $nextColumn;
                shortenColumnHeight = nextColumnHeight;
            }
        }

        return $shortenColumn;
    },
    addMoreItems: function() {
        var self = this;

        if (!this.model.hasMore()) {
            this.$el.find(".btn-more, .load-state").hide();
            this.$el.find(".no-more-state").show();
        } else {

            this.$el.find(".btn-more, .no-more-state").hide();
            this.$el.find(".load-state").show();

            this.model.getMore(function(items) {
                self.renderItems(items)
            });
        }
    },
    renderItems: function(items) {
        var self = this;

        var templateSrc = self.$el.find(this.options.setup.itemTemplateSelector).html();

        if (typeof templateSrc === 'undefined') {
            jQuery.error("Missing pod prototype (check the podPrototypeSelector: " + this.options.podPrototypeSelector + ")");
        }

        var addData = function(i, items) {

            self.itemCount = self.itemCount + 1;

            var $item = jQuery('<div/>', {
                class: self.options.podClass,
                html: _.template(templateSrc, items[i])
            });

            //try to call the onAddItem - return false means don't continue the item has been used yet or canceled :) 
            if (typeof self.options.onAddItem === 'undefined' || self.options.onAddItem(self.itemCount, self.getShortenColumn(), $item, items[i]) !== false) {
                $item.appendTo(self.getShortenColumn());
            }

            if (i < items.length - 1) {
                setTimeout(function() {
                    addData(i + 1, items);
                }, 10);
            } else if (typeof self.options.onFinishRendering !== "undefined") {
                self.options.onFinishRendering(items.length);
            }
        };

        addData(0, items);
    }
});


