/**
 *  Poppy Pagination
 *  Generate page options/results using pre-existing content
 *
 *  Copyright 2012-2014, Marc S. Brooks (http://mbrooks.info)
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
	var lang = {};

	var methods = {
		"init": function(config, callback) {
			var $this = $(this);

			// config defaults
			config = $.extend({
				totalResults: 0,
				perPage:      10,
				startPage:    1,
				uiText: {
					LAST_PAGE: 'Last Page',
					NEXT_PAGE: 'Next Page',
					RESULTS:   '%s - %s of %s results',
					VIEWING:   'Viewing'
				}
			}, config);

			lang = config.uiText;

			// if results are available, create page elements
			var res = calcPageResults(config);
			if (res.total > 0) {
				var node = $this.find('div.poppy_pagination');

				// remove existing
				if (node[0]) {
					node.remove();
				}

				// .. header
				var header = $('<div></div>')
					.addClass('poppy_pagination');

				var block1 = createResultElm(res, callback),
					block2 = createPagerElm (res, callback);
				header.append(block2, block1);

				$this.prepend(header);

				// .. footer
				var footer = header.clone(true);
				footer.append(footer.children().get().reverse());

				$this.append(footer);
			}
		},

		"destroy": function() {
			$(this).removeData();
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
	 * Create page result elements
	 * @param {Object} data
	 * @param {Function} callback
	 * @returns {Object}
	 */
	function createResultElm(data, callback) {

		// create result total elements
		var span = $('<span></span>')
			.append(printf(lang.RESULTS, data.first, data.last, data.total));

		var form = $('<form></form>');

		if (data.total > 10 && data.limit > 1) {

			// .. select menu
			var label = $('<label></label>').append(lang.VIEWING);
			form.append(label);

			var option = $('<option>-</option>'),
				select = $('<select></select>')
				.append(option);

			var opts = [ 10, 20, 30, 40, 50 ];

			// .. options
			$.each(opts, function() {
				if (this <= data.total) {
					option = $('<option>' + this + '</option>')
						.attr('value', this);
					select.append(option);

					// if the option is selected
					if (this == data.limit) {
						select.selectedIndex = this;
					}
				}
			});

			// attach menu options events
			if ( $.isFunction(callback) ) {
				select.on('change', function() {
					data.limit = parseInt(this.value);
					callback(data);
				});
			}

			form.append(select);
		}

		// return HTML object
		return $('<div></div>')
			.addClass('options')
			.append(span, form);
	}

	/**
	 * Create the first/last and subsequent page links
	 * @param {Object} data
	 * @param {Function} callback
	 * @returns {Object}
	 */
	function createPagerElm(data, callback) {

		// create node elements
		var list = $('<ul></ul>')
			.addClass('pages');

		var tmp = $('<li></li>')
			.addClass('crumbs');

		// define onclick event
		function onClickEvent(event) {
			event.preventDefault();
			data.start = event.data;

			if ( $.isFunction(callback) ) {
				callback(data);
			}
		}

		// always show 10 results, if available
		(function() {
			var show_links = 10,
				first_link = (data.first / data.limit) - (show_links / 2),
				last_link  = (data.last  / data.limit) + (show_links / 2);

			for (var i = 1; i <= data.pages; i++) {
				if (first_link > i) continue;
				if (last_link  < i) continue;

				var link = null;

				// .. page links
				if (data.start != i) {

					// bind mouse event
					link = $('<a>' + i + '</a>')
						.on('click', i, onClickEvent);
				}
				else {

					// disable crumb
					link = $('<span>' + i + '</span>');
				}

				tmp.append(link);
			}
		})();

		// .. last page link
		(function() {
			if (data.total > 0) {
				var item = $('<li></li>')
					.addClass('last');

				var link = null;

				if (data.start > 1) {

					// bind mouse event
					link = $('<a></a>')
						.on('click', (data.start - 1), onClickEvent);
				}
				else {

					// disable button
					link = $('<span></span>');
				}

				link.append(lang.LAST_PAGE);
				item.append(link);
				list.append(item);
			}
		})();

		// .. page crumbs (links)
		if (tmp.children()) {
			list.append(tmp);

			if (data.pages == 1) {
				tmp.css('visibility', 'hidden');
			}
		}

		// .. next page link
		(function() {
			if (data.total > 1) {
				var item = $('<li></li>')
					.addClass('next');

				var link = null;

				if (data.pages != data.start) {

					// bind mouse event
					link = $('<a></a>')
						.on('click', (data.start + 1), onClickEvent);
				}
				else {

					// disable button
					link = $('<span></span>');
				}

				link.append(lang.NEXT_PAGE);
				item.append(link);
				list.append(item);
			}
		})();

		return list;
	}

	/**
	 * Calculate page totals and return object of results
	 * @param {Object} settings
	 * @returns {Object}
	 */
	function calcPageResults(settings) {
		var obj = {};
		obj.total = settings.totalResults;
		obj.limit = settings.perPage;
		obj.start = settings.startPage || 1;
		obj.pages = getTotalRows(obj.total, obj.limit);
		obj.first = obj.start * obj.limit + 1 - obj.limit;
		obj.last  = ((obj.first + obj.limit - 1) < obj.total) ? (obj.first + obj.limit - 1) : obj.total;
		return obj;
	}

	/**
	 * Return the row total
	 * @param {String} total
	 * @param {Number} limit
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
	 * Output a formatted string
	 * @param {String} str
	 * @returns {String}
	 */
	function printf() {
		var args = arguments,
			str  = args[0];

		for (var i = 1; i < args.length; i++) {
			str = str.replace(/\%s/i, args[i]);
		}
		return str;
	}
})(jQuery);
