;

/* 
 *   Backbone Infinite Scroll
 *   
 *   Requires:
 *    - BackboneJs   [ http://backbonejs.org/ ]
 *    - UnderscoreJs [ http://underscorejs.org/ ]  
 *    - jQuery       [ http://jquery.com/ ]    
 *            
 */


"use strict"; // jshint ;_;


/* FORM CLASS DEFINITION
 * ===================== */

!function($) {

    /* 
     * THE MODEL
     * ========== */

    var ProductModel = Backbone.Model.extend({
        initialize: function(options) {
            this.options = options;
        },
        defaults: {
            hash: ""
        },
        hasMore: function() {
            return this.get("noMoreItems") !== 1;
        },
        requestPending: false,
        getMore: function(callback) {

            var custom_query_data = this.options.customQueryData ? this.options.customQueryData : '';
            var link = this.options.url + "?" + this.get("hash") + custom_query_data;

            if (!this.get("defaultDataLoaded")) {
                this.set("defaultDataLoaded", true);
                if (typeof this.options.initialData !== 'undefined' && !this.get("hash")) {
                    this.dataReceived(this.options.initialData, callback);
                    return;
                }
            }

            if (typeof this.options.onRequestData !== 'undefined') {
                var tempData = this.options.onRequestData(link);
                if (typeof tempData === 'object') {
                    this.dataReceived(this.options.initialData, callback);
                    return;
                }
            }

            if (this.requestPending) {
                return;
            } else {
                this.requestPending = true;
            }

            var self = this;

            $.ajax({
                url: link
            }).done(function(data) {
                self.dataReceived(data, callback);
            }).fail(function() {
                console.log('ajax error');
            }).complete(function() {
                self.requestPending = false;
            });
        },
        dataReceived: function(data, callback) {
            var self = this;
            if (typeof self.options.onReceiveData !== 'undefined') {
                var tempData = self.options.onReceiveData(data);
                if (typeof tempData === 'object') {
                    data = tempData;
                }
            }

            if (typeof data.next === "undefined" || data.next === "") {
                self.set("noMoreItems", 1);
                self.set("hash", "");
            } else {
                self.set("hash", data.next);
            }

            callback(data.items);
        }
    });

    /* 
     * THE VIEWS
     * ========== */

    var ListView = Backbone.View.extend({
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
            var $column = null;

            _.each(this.$columns, function($item) {

                if ($column === null) {
                    $column = $item;
                } else {
                    //call handler that allowes user to change the column height count
                    var columnHeight = $column.height();
                    var itemHeight = $item.height();
                    if (typeof self.options.onCountLenght !== 'undefined') {
                        columnHeight = self.options.onCountLenght($column, columnHeight);
                        itemHeight = self.options.onCountLenght($item, itemHeight);
                    }

                    if (itemHeight < columnHeight) {
                        $column = $item;
                    }
                }

            });

            return $column;
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

            var templateSrc = self.$el.find(this.options.podPrototypeSelector).html();

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

    /* 
     * THE JQUERY PLUGIN
     * ================= */

    $.fn.summitInfinityScroll = function(option) {


        return this.each(function() {

            var $this = $(this);

            if (!$this.data('SummitInfinityScroll')) {
                var options = $.extend({}, $.fn.summitInfinityScroll.defaults, $this.data(), typeof option === 'object' && option);

                $this.data('SummitInfinityScroll', "has been initialised");

                var productModel = new ProductModel($.extend({url: options.url}, options));
                var listView = new ListView($.extend({model: productModel, el: $this}, options));

                $(window).on('hashchange', function() {
                    var path = location.hash;
                    if (path !== null && typeof path !== 'undefined') {

                        if (path.substring(0, 1) === '#') {
                            path = path.substring(1);
                        }

                        //we use ! because the google ajax crawling rules
                        if (path.substring(0, 1) === '!') {
                            path = path.substring(1);
                        }

                        productModel.set("hash", path);
                        listView.resetItems();
                    }
                }
                );

                // INFINITY SCROLL
                var infinityScrollHandler = function(e) {
                    //is position of scroll near by end?

                    if (($(window).scrollTop() + $(window).height()) > ($(document).height() / 2)) {
                        listView.addMoreItems();
                    }
                };

                //start of scroll event for touch devices
                document.addEventListener("touchmove", infinityScrollHandler, false);
                document.addEventListener("scroll", infinityScrollHandler, false);

                window.onresize = function(event) {
                    listView.fetchColumns();
                };
            }
        });
    };

    $.fn.summitInfinityScroll.defaults = {
        scrollArea: 0.7,
        podClass: "pod",
        podPrototypeSelector: ".pod-prototype",
        columnsSelector: ".column"
    };

}(window.jQuery);


