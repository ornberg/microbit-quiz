(function () {
	'use strict';

	var Utils = app.Utils;

	app.QuizBitActions = app.alt.generateActions(
		'startVote',
    'updateConnectionState'/*
		'toggle',
		'destroy',
		'save',
		'clearCompleted',
		'edit',
		'show'*/
	);

	app.QuizBitActions = Utils.extend(
		app.QuizBitActions,
		app.alt.createActions({
			startVote: function() {
				return {
					voting: true
				};
			},
      updateConnectionState: function(state) {
        return {
          connected: state
        };
      }
		})
	);
})();
