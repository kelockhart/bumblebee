define([
	'underscore'
], function (_) {

	var exports = {
		formatCount: function (count) {
			if (count >= 100000) {

			}
		},

		splitTitle: function (title) {
			return title.split('/')[1];
		},

		isEqual: function (a, b) {
			if (!a || !b) {
				return false;
			}
			return _.isEqual(
				_.flatten(_.toArray(a.toJSON())),
				_.flatten(_.toArray(b.toJSON()))
			);
		}
	};

	return exports;
});