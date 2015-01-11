module('Poppy-Pagination', {
	setup: function() {
		if (setup) return;   // skip process

		(function getResults(config) {
			stop();

			$.getJSON('demo/' + (config.start || 1) + '.json', function(data) {
				$('#qunit-custom')
					.PoppyPagination({
						totalResults: 20,
						perPage:      5,
						startPage:    config.start,
						uiText: {
							RESULTS: '<strong>%first</strong> - <strong>%last</strong> of <strong>%total</strong> results'
						}
					}, getResults);

				// hide test elements
				$('#qunit-custom').hide(0);

				start();
			});
		})({});

		setup = true;
	}
});

done(function() {
	$('#qunit-custom').empty();
});

test('Generate HTML', function() {
	equal($('#qunit-custom').find(pager).length, 2, 'Pagination elements created');
});
