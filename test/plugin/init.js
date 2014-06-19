module('Poppy-Pagination', {
	setup : function() {
		$('#qunit-fixture')
			.PoppyPagination({
				totalResults : 20,
				perPage      : 5,
				startPage    : 1
			});
	},
	teardown : function() {
		// do nothing - preserve element structure
	}
});

test('Generate HTML', function() {
	equal($('#qunit-fixture').find(page).length, 2, 'Pagination elements created');
});
