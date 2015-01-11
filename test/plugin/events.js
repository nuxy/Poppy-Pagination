test('Next Page', function() {
	ok($(pager).find('li.next a').trigger('click'), "Click event 'Next Page'");

	stop();

	setTimeout(function() {
		ok($(pager).find('li.last a').length, "Result link 'Last Page' is enabled");
		ok($(pager).find('li.next a').length, "Result link 'Next Page' is enabled");

		var crumbs1 = $(pager).find('li.crumbs').first();

		ok(crumbs1.find('a:nth-child(1)'),    "1st result '1' is enabled");
		ok(crumbs1.find('span:nth-child(2)'), "2nd result '2' is disabled");
		ok(crumbs1.find('a:nth-child(2)'),    "3rd result '3' is enabled");
		ok(crumbs1.find('a:nth-child(3)'),    "4th result '4' is enabled");

		var options1 = $(pager).find('div.options').first();

		equal(options1.find('strong:nth-child(1)').text(), 6,  "First result item is '6'");
		equal(options1.find('strong:nth-child(2)').text(), 10, "Last result item is '10'");

		start();

		ok($(pager).find('li.next a').trigger('click'), "Click event 'Next Page'");

		stop();

		setTimeout(function() {
			ok($(pager).find('li.last a').length, "Result link 'Last Page' is enabled");
			ok($(pager).find('li.next a').length, "Result link 'Next Page' is enabled");

			var crumbs2 = $(pager).find('li.crumbs').first();

			ok(crumbs2.find('a:nth-child(1)'),    "1st result '1' is enabled");
			ok(crumbs2.find('a:nth-child(2)'),    "2nd result '2' is enabled");
			ok(crumbs2.find('span:nth-child(3)'), "3rd result '3' is disabled");
			ok(crumbs2.find('a:nth-child(3)'),    "4th result '4' is enabled");

			var options2 = $(pager).find('div.options').first();

			equal(options2.find('strong:nth-child(1)').text(), 11, "First result item is '11'");
			equal(options2.find('strong:nth-child(2)').text(), 15, "Last result item is '15'");

			start();

			ok($(pager).find('li.next a').trigger('click'), "Click event 'Next Page'");

			stop();

			setTimeout(function() {
				ok($(pager).find('li.last a').length,    "Result link 'Last Page' is enabled");
				ok($(pager).find('li.next span').length, "Result link 'Next Page' is disabled");

				var crumbs3 = $(pager).find('li.crumbs').first();

				ok(crumbs3.find('a:nth-child(1)'),    "1st result '1' is enabled");
				ok(crumbs3.find('a:nth-child(2)'),    "2nd result '2' is enabled");
				ok(crumbs3.find('a:nth-child(3)'),    "3rd result '3' is enabled");
				ok(crumbs3.find('span:nth-child(4)'), "4th result '4' is disabled");

				var options3 = $(pager).find('div.options').first();

				equal(options3.find('strong:nth-child(1)').text(), 16, "First result item is '16'");
				equal(options3.find('strong:nth-child(2)').text(), 20, "Last result item is '20'");

				start();
			}, 500);
		}, 500);
	}, 500);
});

test('Last Page', function() {
	ok($(pager).find('li.last a').trigger('click'), "Click event 'Last Page'");

	stop();

	setTimeout(function() {
		ok($(pager).find('li.last a').length, "Result link 'Last Page' is enabled");
		ok($(pager).find('li.next a').length, "Result link 'Next Page' is enabled");

		var crumbs1 = $(pager).find('li.crumbs').first();

		ok(crumbs1.find('a:nth-child(1)'),    "1st result '1' is enabled");
		ok(crumbs1.find('a:nth-child(2)'),    "2nd result '2' is enabled");
		ok(crumbs1.find('span:nth-child(3)'), "3rd result '3' is disabled");
		ok(crumbs1.find('a:nth-child(3)'),    "4th result '4' is enabled");

		var options1 = $(pager).find('div.options').first();

		equal(options1.find('strong:nth-child(1)').text(), 11, "First result item is '11'");
		equal(options1.find('strong:nth-child(2)').text(), 15, "Last result item is '15'");

		start();

		ok($(pager).find('li.last a').trigger('click'), "Click event 'Last Page'");

		stop();

		setTimeout(function() {
			ok($(pager).find('li.last a').length, "Result link 'Last Page' is enabled");
			ok($(pager).find('li.next a').length, "Result link 'Next Page' is enabled");

			var crumbs2 = $(pager).find('li.crumbs').first();

			ok(crumbs2.find('a:nth-child(1)'),    "1st result '1' is enabled");
			ok(crumbs2.find('span:nth-child(2)'), "2nd result '2' is disabled");
			ok(crumbs2.find('a:nth-child(2)'),    "3rd result '3' is enabled");
			ok(crumbs2.find('a:nth-child(3)'),    "4th result '4' is enabled");

			var options2 = $(pager).find('div.options').first();

			equal(options2.find('strong:nth-child(1)').text(),  6, "First result item is '6'");
			equal(options2.find('strong:nth-child(2)').text(), 10, "Last result item is '10'");

			start();

			ok($(pager).find('li.last a').trigger('click'), "Click event 'Last Page'");

			stop();

			setTimeout(function() {
				ok($(pager).find('li.last span').length, "Result link 'Last Page' is disabled");
				ok($(pager).find('li.next a').length,    "Result link 'Next Page' is enabled");

				var crumbs3 = $(pager).find('li.crumbs').first();

				ok(crumbs3.find('span:nth-child(1)'), "1st result '1' is disabled");
				ok(crumbs3.find('a:nth-child(1)'),    "2nd result '2' is enabled");
				ok(crumbs3.find('a:nth-child(2)'),    "3rd result '3' is enabled");
				ok(crumbs3.find('a:nth-child(3)'),    "4th result '4' is enabled");

				var options3 = $(pager).find('div.options').first();

				equal(options3.find('strong:nth-child(1)').text(), 1, "First result item is '1'");
				equal(options3.find('strong:nth-child(2)').text(), 5, "Last result item is '5'");

				start();
			}, 500);
		}, 500);
	}, 500);
});

test('Breadcrumbs', function() {
	var crumbs1 = $(pager).find('li.crumbs').first();

	ok(crumbs1.find('a:nth-child(2)').trigger('click'), "Click event crumb '2'");

	stop();

	setTimeout(function() {
		ok($(pager).find('li.last a').length, "Result link 'Last Page' is enabled");
		ok($(pager).find('li.next a').length, "Result link 'Next Page' is enabled");

		crumbs1 = $(pager).find('li.crumbs').first();

		ok(crumbs1.find('a:nth-child(1)'),    "1st result '1' is enabled");
		ok(crumbs1.find('span:nth-child(2)'), "2nd result '2' is disabled");
		ok(crumbs1.find('a:nth-child(2)'),    "3rd result '3' is enabled");
		ok(crumbs1.find('a:nth-child(3)'),    "4th result '4' is enabled");

		var options1 = $(pager).find('div.options').first();

		equal(options1.find('strong:nth-child(1)').text(), 6,  "First result item is '6'");
		equal(options1.find('strong:nth-child(2)').text(), 10, "Last result item is '10'");

		start();

		var crumbs2 = $(pager).find('li.crumbs').first();

		ok(crumbs2.find('a:nth-child(3)').trigger('click'), "Click event crumb '3'");

		stop();

		setTimeout(function() {
			ok($(pager).find('li.last a').length, "Result link 'Last Page' is enabled");
			ok($(pager).find('li.next a').length, "Result link 'Next Page' is enabled");

			crumbs2 = $(pager).find('li.crumbs').first();

			ok(crumbs2.find('a:nth-child(1)'),    "1st result '1' is enabled");
			ok(crumbs2.find('a:nth-child(2)'),    "2nd result '2' is enabled");
			ok(crumbs2.find('span:nth-child(3)'), "3rd result '3' is disabled");
			ok(crumbs2.find('a:nth-child(3)'),    "4th result '4' is enabled");

			var options2 = $(pager).find('div.options').first();

			equal(options2.find('strong:nth-child(1)').text(), 11, "First result item is '11'");
			equal(options2.find('strong:nth-child(2)').text(), 15, "Last result item is '15'");

			start();

			var crumbs3 = $(pager).find('li.crumbs').first();

			ok(crumbs3.find('a:nth-child(4)').trigger('click'), "Click event crumb '4'");

			stop();

			setTimeout(function() {
				ok($(pager).find('li.last a').length,    "Result link 'Last Page' is enabled");
				ok($(pager).find('li.next span').length, "Result link 'Next Page' is disabled");

				crumbs3 = $(pager).find('li.crumbs').first();

				ok(crumbs3.find('a:nth-child(1)'),    "1st result '1' is enabled");
				ok(crumbs3.find('a:nth-child(2)'),    "2nd result '2' is enabled");
				ok(crumbs3.find('a:nth-child(3)'),    "3rd result '3' is enabled");
				ok(crumbs3.find('span:nth-child(4)'), "4th result '4' is disabled");

				var options3 = $(pager).find('div.options').first();

				equal(options3.find('strong:nth-child(1)').text(), 16, "First result item is '16'");
				equal(options3.find('strong:nth-child(2)').text(), 20, "Last result item is '20'");

				start();
			}, 500);
		}, 500);
	}, 500);
});
