/**
 *  Poppy Pagination
 *  A simple way to generate next and last page buttons, breadcrumb links
 *  and per-page result totals, as HTML.
 *
 *  Copyright 2012-2015, Marc S. Brooks (https://mbrooks.info)
 *  Licensed under the MIT license:
 *  http://www.opensource.org/licenses/mit-license.php
 *
 *  Dependencies:
 *    jquery.js
 */

if (!window.jQuery || (window.jQuery && parseInt(window.jQuery.fn.jquery.replace('.', '')) < parseInt('1.8.3'.replace('.', '')))) {
  throw new Error('Poppy-Pagination requires jQuery 1.8.3 or greater.');
}

(function($) {

  /**
   * @namespace PoppyPagination
   */
  var methods = {

    /**
     * Create new instance of Poppy-Pagination
     *
     * @memberof PoppyPagination
     * @method init
     *
     * @example
     * $('#container').PoppyPagination(config, callback);
     *
     * @param {Object} config
     * @param {Function} callback
     *
     * @returns {Object} jQuery object
     */
    "init": function(config, callback) {
      var $this = $(this);

      // Config defaults
      config = $.extend(true, {
        totalResults: 0,
        perPage:      10,
        startPage:    1,
        uiText: {
          LAST_PAGE: 'Last Page',
          NEXT_PAGE: 'Next Page',
          RESULTS:   '%first - %last of %total results',
          VIEWING:   'Viewing'
        }
      }, config);

      $this.data('config', config);

      return $this.PoppyPagination('_createPageResults', callback);
    },

    /**
     * Perform cleanup
     *
     * @memberof PoppyPagination
     * @method destroy
     *
     * @example
     * $('#container').PoppyPagination('destroy');
     */
    "destroy": function() {
      $(this).removeData();
    },

    /**
     * Perform cleanup
     *
     * @memberof PoppyPagination
     * @method _createPageResults
     * @private
     *
     * @param {Function} callback
     *
     * @returns {Object}
     */
    "_createPageResults": function(callback) {
      var $this = $(this);

      // If results are available, create page elements.
      var results = $this.PoppyPagination('_calcPageResults');
      if (results.total > 0) {
        var pager = $this.find('div.poppy_pagination');

        // Remove existing elements..
        if (pager[0]) {
          pager.remove();
        }

        // .. Header
        var header = $('<div></div>')
          .addClass('poppy_pagination');

        var elm1 = $this.PoppyPagination('_createResultElm', results, callback),
            elm2 = $this.PoppyPagination('_createPagerElm',  results, callback);
        header.append(elm2, elm1);
        $this.prepend(header);

        // .. Footer
        var footer = header.clone(true);
        footer.append(footer.children().get().reverse());
        $this.append(footer);
      }

      return $this;
    },

    /**
     * Create page result elements.
     *
     * @memberof PoppyPagination
     * @method _createResultElm
     * @private
     *
     * @param {Object} results
     * @param {Function} callback
     *
     * @returns {Object}
     */
    "_createResultElm": function(results, callback) {
      var $this = $(this),
          data  = $this.data(),
          lang  = data.config.uiText;

      // Create result total elements..
      var span = $('<span></span>')
        .append(replaceTokens(lang.RESULTS, results));

      var form = $('<form></form>');

      if (results.total > 10 && results.limit > 1) {

        // .. Select menu
        var label = $('<label></label>')
          .append(replaceTokens(lang.VIEWING, results));

        form.append(label);

        var option = $('<option>-</option>'),
          select = $('<select></select>')
          .append(option);

        var opts = [ 10, 20, 30, 40, 50 ];

        // .. Options
        $.each(opts, function() {
          if (this <= results.total) {
            option = $('<option>' + this + '</option>')
              .attr('value', this);
            select.append(option);

            // If the option is selected..
            if (this == results.limit) {
              select.selectedIndex = this;
            }
          }
        });

        // Attach menu options events.
        if ( $.isFunction(callback) ) {
          select.on('change', function() {
            results.limit = parseInt(this.value);
            callback(results);
          });
        }

        form.append(select);
      }

      // Return HTML object.
      return $('<div></div>')
        .addClass('options')
        .append(span, form);
    },

    /**
     * Create the first/last and subsequent page links.
     *
     * @memberof PoppyPagination
     * @method _createPagerElm
     * @private
     *
     * @param {Object} results
     * @param {Function} callback
     *
     * @returns {Object}
     */
    "_createPagerElm": function(results, callback) {
      var $this = $(this),
          data  = $this.data(),
          lang  = data.config.uiText;

      // Create node elements.
      var list = $('<ul></ul>')
        .addClass('pages');

      var crumbs = $('<li></li>')
        .addClass('crumbs');

      // Define onclick event
      function onClickEvent(event) {
        event.preventDefault();
        results.start = event.data;

        if ( $.isFunction(callback) ) {
          callback(results);
        }
      }

      // Always show 10 results, if available..
      (function() {
        var show_links = 10,
            first_link = (results.first / results.limit) - (show_links / 2),
            last_link  = (results.last  / results.limit) + (show_links / 2);

        for (var i = 1; i <= results.pages; i++) {
          if (first_link > i) continue;
          if (last_link  < i) continue;

          var link = null;

          // .. Page links
          if (results.start != i) {

            // Bind mouse event
            link = $('<a>' + i + '</a>')
              .on('click', i, onClickEvent);
          }
          else {

            // Disable crumb
            link = $('<span>' + i + '</span>');
          }

          crumbs.append(link);
        }
      })();

      // .. Last page link
      (function() {
        if (results.total > 0) {
          var item = $('<li></li>')
            .addClass('last');

          var link = null;

          if (results.start > 1) {

            // Bind mouse event
            link = $('<a></a>')
              .on('click', (results.start - 1), onClickEvent);
          }
          else {

            // Disable button
            link = $('<span></span>');
          }

          link.append(replaceTokens(lang.LAST_PAGE, results));
          item.append(link);
          list.append(item);
        }
      })();

      // .. Page crumbs (links)
      if (crumbs.children()) {
        list.append(crumbs);
      }

      // .. Next page link
      (function() {
        if (results.total > 1) {
          var item = $('<li></li>')
            .addClass('next');

          var link = null;

          if (results.pages != results.start) {

            // Bind mouse event
            link = $('<a></a>')
              .on('click', (results.start + 1), onClickEvent);
          }
          else {

            // Disable button
            link = $('<span></span>');
          }

          link.append(replaceTokens(lang.NEXT_PAGE, results));
          item.append(link);
          list.append(item);
        }
      })();

      if (results.pages == 1) {
        list.addClass('disabled');
      }

      return list;
    },

    /**
     * Calculate page totals and return object of results.
     *
     * @memberof PoppyPagination
     * @method _calcPageResults
     * @private
     *
     * @returns {Object}
     */
    "_calcPageResults": function() {
      var $this = $(this),
          data  = $this.data();

      var obj = {};
      obj.total = data.config.totalResults;
      obj.limit = data.config.perPage;
      obj.start = data.config.startPage || 1;
      obj.pages = getTotalRows(obj.total, obj.limit);
      obj.first = obj.start * obj.limit + 1 - obj.limit;
      obj.last  = ((obj.first + obj.limit - 1) < obj.total) ? (obj.first + obj.limit - 1) : obj.total;
      return obj;
    }
  };

  $.fn.PoppyPagination = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    }
    else
    if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    }
    else {
      $.error('Method ' +  method + ' does not exist in jQuery.PoppyPagination');
    }
  };

  /**
   * Return the row tota;.
   *
   * @protected
   *
   * @param {String} total
   * @param {Number} limit
   *
   * @returns {Number}
   */
  function getTotalRows(total, limit) {
    var count = Math.round(total / limit);
    if ((count * limit) < total) {
      count++;
    }
    return count;
  }

  /**
   * Replace language string tokens with its object defined value.
   *
   * @protected
   *
   * @param {String} text
   * @param {Object} vals
   *
   * @returns {String}
   */
  function replaceTokens(text, vals) {
    for (var key in vals) {
      if (vals[key]) {
        var token = key,
          regex = new RegExp('%' + token, 'i');

        text = text.replace(regex, vals[key]);
      }
    }
    return text;
  }
})(jQuery);
