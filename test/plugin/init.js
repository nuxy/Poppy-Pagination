module('Poppy-Pagination', {
	setup : function() {
		(function getResults(obj) {
			stop();

			$.getJSON('demo/' + (obj.start || 1) + '.json', function(data) {
				$('#qunit-fixture')
					.PoppyPagination({
						totalResults : 20,
						perPage      : 5,
						startPage    : obj.start
					}, getResults);

				start();
			});
		})({});
	},
	teardown : function() {
		// do nothing - preserve element structure
	}
});

test('Generate HTML', function() {
	equal($('#qunit-fixture').find(page).length, 2, 'Pagination elements created');
});
