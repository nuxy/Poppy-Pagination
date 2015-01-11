test('Load State', function() {
	ok($(pager).find('li.last span').length, "Result link 'Last Page' is disabled");
	ok($(pager).find('li.next a').length,    "Result link 'Next Page' is enabled");

	var crumbs = $(pager).find('li.crumbs').first();

	equal(crumbs.children().size(), 4, 'Total of 4 pages available');

	ok(crumbs.find('span:nth-child(2)'), "1st result '1' is disabled");
	ok(crumbs.find('a:nth-child(1)'),    "2nd result '2' is enabled");
	ok(crumbs.find('a:nth-child(2)'),    "3rd result '3' is enabled");
	ok(crumbs.find('a:nth-child(3)'),    "4th result '4' is enabled");

	var options = $(pager).find('div.options').first();

	equal(options.find('form').is(':visible'), 0, 'Select menu options are not available');

	equal(options.find('strong:nth-child(1)').text(), 1,  "First result item is '1'");
	equal(options.find('strong:nth-child(2)').text(), 5,  "Last result item is '5'");
	equal(options.find('strong:nth-child(3)').text(), 20, "Total items found is '20");
});
