/*
 *  Poppy Pagination
 *  Generate page options/results using pre-existing content
 *
 *  Copyright 2012-2013, Marc S. Brooks (http://mbrooks.info)
 *  Licensed under the MIT license:
 *  http://www.opensource.org/licenses/mit-license.php
 *
 *  Dependencies:
 *    jquery.js
 */

(function($) {
	var methods = {
		"init" : function(options, callback) {
			return this.each(function() {
				$(this).PoppyPagination('generate', options, callback);
			});
		},

		"destroy" : function() {
			return this.each(function() {
				$(this).removeData();
			});
		},

		"generate" : function(options, callback) {
			return this.each(function() {
				var data = calcPageResults(options);

				// if results are available, create page elements
				if (data.total > 0) {
					var node = $(this).parent();
					node.find('.poppy_pagination').remove();

					// .. results header
					var div1 = createResultBarElm(data, callback);
					var div2 = createPaginateElm( data, callback);
					node.prepend(div2, div1);

					// .. results footer
					div1.clone(true).appendTo(node);
					div2.clone(true).appendTo(node);
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

		// create result detail elements
		var strong1 = $('<strong>' + data.first + '</strong>');
		var strong2 = $('<strong>' + data.last  + '</strong>');
		var strong3 = $('<strong>' + data.total + '</strong>');

		var span = $('<span></span>')
			.append(strong1, ' - ', strong2, ' of ', strong3, ' found');

		var form = $('<form></form>');

		if (data.total > 10 && !data.limit) {

			// .. select menu
			var label = $('<label></label>').append('Viewing');
			form.append(label);

			var option = $('<option>-</option>');
			var select = $('<select></select>')
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
			if (callback) {
				select.change(function() {
					data.limit = parseInt(this.value);
					callback(data);
				});
			}

			form.append(select);
		}

		// return HTML object
		return $('<div></div>')
			.addClass('poppy_pagination options')
			.append(span, form);
	}

	/*
	 * Create the first/last and subsequent page links
	 */
	function createPaginateElm(data, callback) {

		// create node elements
		var list = $('<ul></ul>')
			.addClass('poppy_pagination pages');

		var tmp = $('<li></li>')
			.addClass('poppy_pagination crumbs');

		// define onclick event
		function onClickEvent(event) {
			event.preventDefault();
			data.start = event.data;
			callback(data);
		}

		// always show 10 results, if available
		var show_links = 10;
		var first_link = (data.first / data.limit) - (show_links / 2);
		var last_link  = (data.last  / data.limit) + (show_links / 2);

		for (var i = 1; i <= data.pages; i++) {
			if (first_link > i) { continue }
			if (last_link  < i) { continue }

			var elm;

			// .. page links
			if (data.start != i) {

				// bind mouse event
				elm = $('<a>' + i + '</a>')
					.bind('click', i, onClickEvent);
			}
			else {

				// disable crumb
				elm = $('<span>' + i + '</span>');
			}

			tmp.append(elm);
		}

		// .. last page link
		if (data.total > 0) {
			var item = $('<li></li>')
				.addClass('polly_pagination last');

			var elm;

			if (data.start > 1) {

				// bind mouse event
				elm = $('<a></a>')
					.click( (data.start - 1), onClickEvent);
			}
			else {

				// disable button
				elm = $('<span></span>');
			}

			elm.append('Last Page');

			item.append(elm);
			list.append(item);
		}

		// .. page crumbs (links)
		if ( tmp.children() ) {
			list.append(tmp);

			if (data.pages == 1) {
				tmp.css('visibility','hidden');
			}
		}

		// .. next page link
		if (data.total > 1) {
			var item = $('<li></li>')
				.addClass('poppy_pagination next');

			var elm;

			if (data.pages != data.start) {

				// bind mouse event
				elm = $('<a></a>')
					.click( (data.start + 1), onClickEvent);
			}
			else {

				// disable button
				elm = $('<span></span>');
			}

			elm.append('Next Page');

			item.append(elm);
			list.append(item);
		}

		return list;
	}

	/*
	 * Calculate page totals and return object of results
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
