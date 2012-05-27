/*
 *  Poppy Pagination
 *  Generate page options/results using pre-existing content
 *
 *  Copyright 2012, Marc S. Brooks (http://mbrooks.info)
 *  Licensed under the MIT license:
 *  http://www.opensource.org/licenses/mit-license.php
 *
 *  Dependencies:
 *    jquery.js
 */

(function($) {
	var methods = {
		init : function(config, callback) {
			return this.each(function() {
				$(this).PoppyPagination('generate', config, callback);
			});
		},

		destroy : function() {
			return this.each(function() {
				$(this).removeData();
			});
		},

		generate : function(config, callback) {
			return this.each(function() {
				if (config.totalResults > 0) {

					// create page result elements
					var div1 = createResultBarElm(config, callback);
					var div2 = createPaginateElm( config, callback);

					// .. header
					var target = $(this).parent()
						.prepend(div1)
						.prepend(div2);

					// .. footer
					div1.clone(true).appendTo(target);
					div2.clone(true).appendTo(target);
				}
			});
		}
	};

	$.fn.PoppyPagination = function(method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1) );
		}
		else
		if (typeof method === 'object' || ! method) {
			return methods.init.apply(this, arguments);
		}
		else {
			$.error('Method ' +  method + ' does not exist on jQuery.PoppyPagination');
		}
	};

	/*
	 * Create page results bar elements
	 */
	function createResultBarElm(data, callback) {

		// calculate totals
		var total = data.totalResults;
		var limit = data.perPage;
		var pages = getTotalRows(total, limit);

		var first = data.startPage;
		var last  = (first + limit) - 1;
		last = (last <= total) ? last : total;

		// create result detail elements
		var strong1 = $('<strong>' + first + '</strong>');
		var strong2 = $('<strong>' + last  + '</strong>');
		var strong3 = $('<strong>' + total + '</strong>');

		var obj = $('<div></div>')
			.addClass('poppy_pagination options');

		var span = $('<span></span>')
			.append(strong1, ' - ', strong2, ' of ', strong3, ' found');

		var form = $('<form></form>');

		if (total > 10) {

			// .. select menu
			var label = $('<label></label>').append('Viewing');
			form.append(label);

			var select = $('<select></select>');

			var opts = [ 10, 20, 30, 40, 50 ];

			// .. options
			$.each(opts, function() {
				if (this < total) {
					var option = $('<option>' + this + '</option>')
						.attr('value', this);

					select.append(option);

					// if the option is selected
					if (this == limit) {
						select.selectedIndex = this;
					}
				}
			});

			// attach menu options events
			if (callback) {
				select.change(function() {
					data.perPage   = parseInt(this.value);
					data.startPage = 1;
					callback(true);
				});
			}

			form.append(select);
		}

		obj.append(span, form);
		return obj;
	}

	/*
	 * Create the first/last and subsequent page links
	 */
	function createPaginateElm(data, callback) {

		// calculate totals
		var total = data.totalResults;
		var limit = data.perPage;
		var pages = getTotalRows(total, limit);

		var first = data.startPage;
		var last  = (first + limit) - 1;
		last = (last <= total) ? last : total;

		// always show 10 results, if available
		var first_link = ((first - 1) / limit) - 6;
		var last_link  = ((last  - 1) / limit) + 6;

		var curr_page = 0;

		// create node elements
		var list = $('<ul></ul>')
			.addClass('poppy_pagination pages');

		var temp = $('<li></li>')
			.addClass('poppy_pagination crumbs');

		for (var i = 0; i < pages; i++) {
			if (first_link > i) { continue }
			if (last_link  < i) { continue }

			var elm;

			// .. page links
			if (i == 0) {
				if (first != 1) {
					elm = $('<a>' + (i + 1) + '</a>').attr('href','#');

					// bind mouse event
					elm.bind('click', i, function(i) {
						data.perPage   = limit;
						data.startPage = limit * i;
						callback(true);
						return false;
					});
				}
				else {
					elm = $('<span>' + (i + 1) + '</span>');

					curr_page = i + 1;
				}

				temp.append(elm);
			}

			// .. page links
			if (i > 0) {
				if (first != (i * limit) ) {
					elm = $('<a>' + (i + 1) + '</a>').attr('href','#');

					// bind mouse event
					elm.bind('click', i, function(i) {
						data.perPage   = limit;
						data.startPage = limit * i;
						callback(true);
						return false;
					});
				}
				else {
					elm = $('<span>' + (i + 1) + '</span>');

					curr_page = i + 1;
				}

				temp.append(elm);
			}
		}

		// .. last page link
		if (total > 0) {
			var item = $('<li></li>')
				.addClass('polly_pagination last');

			var elm;

			if (curr_page > 1) {
				elm = $('<a></a>').attr('href','#');

				// bind mouse event
				elm.click(function() {
					data.perPage   = limit;
					data.startPage = ((curr_page * limit) - (limit * 2));
					callback(true);
					return false;
				});
			}
			else {
				elm = $('<span></span>');
			}

			elm.append('Last Page');

			item.append(elm);
			list.append(item);
		}

		// .. page crumbs (links)
		if ( temp.children() ) {
			list.append(temp);

			if (pages == 1) {
				temp.css('visibility','hidden');
			}
		}

		// .. next page link
		if (total > 0) {
			var item = $('<li></li>')
				.addClass('poppy_pagination next');

			var elm;

			if ( (pages > 1) && (total > (curr_page * limit)) ) {
				elm = $('<a></a>').attr('href','#');

				// bind mouse event
				elm.click(function() {
					data.perPage   = limit;
					data.startPage = curr_page * limit;
					callback(true);
					return false;
				});
			}
			else {
				elm = $('<span></span>');
			}

			elm.append('Next Page');

			item.append(elm);
			list.append(item);
		}

		return list;
	}

	/*
	 * Return the row total
	 */
	function getTotalRows(total, limit) {
		var count = Math.round(total / limit);
		if ((count * limit) < total) {
			count++;
		}
		return count;
	}
})(jQuery);
