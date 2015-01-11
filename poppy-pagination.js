/**
 *  Poppy Pagination
 *  Generate page options/results using pre-existing content
 *
 *  Copyright 2012-2015, Marc S. Brooks (http://mbrooks.info)
 *  Licensed under the MIT license:
 *  http://www.opensource.org/licenses/mit-license.php
 *
 *  Dependencies:
 *    jquery.js
 */

if (!window.jQuery || (window.jQuery && window.jQuery.fn.jquery < '1.8.3')) {
	throw new Error('Poppy-Pagination requires jQuery 1.8.3 or greater.');
}

(function($) {

	/**
	 * @namespace PoppyPagination
	 */
	var methods = {

		/**
		 * Create new instance of Poppy-Pagination
		 * @memberof PoppyPagination
		 * @method init
		 * @param {Object} config
		 * @param {Function} callback
		 * @returns {Object} jQuery object
		 */
		"init": function(config, callback) {
			var $this = $(this),
				data  = $this.data();

			// config defaults
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

			if ( $.isEmptyObject(data) ) {
				$this.data({
					config: config
				});
			}

			return $this.PoppyPagination('_createPageResults', callback);
		},

		/**
		 * Perform cleanup
		 * @memberof PoppyPagination
		 * @method destroy
		 */
		"destroy": function() {
			$(this).removeData();
		},

		/**
		 * Perform cleanup
		 * @memberof PoppyPagination
		 * @method _createPageResults
		 * @param {Function} callback
		 * @returns {Object}
		 * @private
		 */
		"_createPageResults": function(callback) {
			var $this = $(this),
				block = $this.parent();

			// if results are available, create page elements
			var results = $this.PoppyPagination('_calcPageResults');
			if (results.total > 0) {
				var pager = block.find('div.poppy_pagination');

				// remove existing
				if (pager[0]) {
					pager.remove();
				}

				// .. header
				var header = $('<div></div>')
					.addClass('poppy_pagination');

				var elm1 = $this.PoppyPagination('_createResultElm', results, callback),
					elm2 = $this.PoppyPagination('_createPagerElm',  results, callback);
				header.append(elm2, elm1);
				block.prepend(header);

				// .. footer
				var footer = header.clone(true);
				footer.append(footer.children().get().reverse());
				block.append(footer);
			}

			return block;
		},

		/**
		 * Create page result elements
		 * @memberof PoppyPagination
		 * @method _createResultElm
		 * @param {Object} results
		 * @param {Function} callback
		 * @returns {Object}
		 * @private
		 */
		"_createResultElm": function(results, callback) {
			var $this = $(this),
				data  = $this.data(),
				lang  = data.config.uiText;

			// create result total elements
			var span = $('<span></span>')
				.append(replaceTokens(lang.RESULTS, results));

			var form = $('<form></form>');

			if (results.total > 10 && results.limit > 1) {

				// .. select menu
				var label = $('<label></label>')
					.append(replaceTokens(lang.VIEWING, results));

				form.append(label);

				var option = $('<option>-</option>'),
					select = $('<select></select>')
					.append(option);

				var opts = [ 10, 20, 30, 40, 50 ];

				// .. options
				$.each(opts, function() {
					if (this <= results.total) {
						option = $('<option>' + this + '</option>')
							.attr('value', this);
						select.append(option);

						// if the option is selected
						if (this == results.limit) {
							select.selectedIndex = this;
						}
					}
				});

				// attach menu options events
				if ( $.isFunction(callback) ) {
					select.on('change', function() {
						results.limit = parseInt(this.value);
						callback(results);
					});
				}

				form.append(select);
			}

			// return HTML object
			return $('<div></div>')
				.addClass('options')
				.append(span, form);
		},

		/**
		 * Create the first/last and subsequent page links
		 * @memberof PoppyPagination
		 * @method _createPagerElm
		 * @param {Object} results
		 * @param {Function} callback
		 * @returns {Object}
		 * @private
		 */
		"_createPagerElm": function(results, callback) {
			var $this = $(this),
				data  = $this.data(),
				lang  = data.config.uiText;

			// create node elements
			var list = $('<ul></ul>')
				.addClass('pages');

			var crumbs = $('<li></li>')
				.addClass('crumbs');

			// define onclick event
			function onClickEvent(event) {
				event.preventDefault();
				results.start = event.data;

				if ( $.isFunction(callback) ) {
					callback(results);
				}
			}

			// always show 10 results, if available
			(function() {
				var show_links = 10,
					first_link = (results.first / results.limit) - (show_links / 2),
					last_link  = (results.last  / results.limit) + (show_links / 2);

				for (var i = 1; i <= results.pages; i++) {
					if (first_link > i) continue;
					if (last_link  < i) continue;

					var link = null;

					// .. page links
					if (results.start != i) {

						// bind mouse event
						link = $('<a>' + i + '</a>')
							.on('click', i, onClickEvent);
					}
					else {

						// disable crumb
						link = $('<span>' + i + '</span>');
					}

					crumbs.append(link);
				}
			})();

			// .. last page link
			(function() {
				if (results.total > 0) {
					var item = $('<li></li>')
						.addClass('last');

					var link = null;

					if (results.start > 1) {

						// bind mouse event
						link = $('<a></a>')
							.on('click', (results.start - 1), onClickEvent);
					}
					else {

						// disable button
						link = $('<span></span>');
					}

					link.append(replaceTokens(lang.LAST_PAGE, results));
					item.append(link);
					list.append(item);
				}
			})();

			// .. page crumbs (links)
			if (crumbs.children()) {
				if (results.pages == 1) {

					// TODO: to be removed - use CSS instead
					crumbs.css('visibility', 'hidden');
				}

				list.append(crumbs);
			}

			// .. next page link
			(function() {
				if (results.total > 1) {
					var item = $('<li></li>')
						.addClass('next');

					var link = null;

					if (results.pages != results.start) {

						// bind mouse event
						link = $('<a></a>')
							.on('click', (results.start + 1), onClickEvent);
					}
					else {

						// disable button
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
		 * Calculate page totals and return object of results
		 * @memberof PoppyPagination
		 * @method _calcPageResults
		 * @returns {Object}
		 * @private
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
	* Return the row total
	* @param {String} total
	* @param {Number} limit
	* @returns {Number}
	* @protected
	*/
	function getTotalRows(total, limit) {
		var count = Math.round(total / limit);
		if ((count * limit) < total) {
			count++;
		}
		return count;
	}

	/**
	* Replace language string tokens with its object defined value
	* @param {String} text
	* @param {Object} vals
	* @returns {String}
	* @protected
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
