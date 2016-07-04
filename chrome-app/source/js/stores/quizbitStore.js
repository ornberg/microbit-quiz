(function () {
	'use strict';

	var Utils = app.Utils;
	var LOCALSTORAGE_NAMESPACE = 'react-alt-todo';

	var QuizBitStore = function () {
		this.state = {
      votimg: false
		};

		this.bindListeners({
			startVote: app.QuizBitActions.startVote
		  updateConnectionState: app.QuizBitActions.updateConnectionState, /*
			toggle: app.todoActions.toggle,
			destroy: app.todoActions.destroy,
			save: app.todoActions.save,
			clearCompleted: app.todoActions.clearCompleted,
			edit: app.todoActions.edit,
			show: app.todoActions.show */
		});
	};

	QuizBitStore.prototype.startVote = function() {
		this.setState({
			voting: true
		});

		//Utils.store(LOCALSTORAGE_NAMESPACE + '.voting', this.state.voting);
	};

  QuizBitStore.prototype.updateConnectionState = function() {
		this.setState({
			voting: true
		});

		//Utils.store(LOCALSTORAGE_NAMESPACE + '.voting', this.state.voting);
	};

  /*
	QuizBitStore.prototype.toggleAll = function (checked) {
		var updatedTodos = this.state.todos.map(function (todo) {
			return Utils.extend({}, todo, {completed: checked});
		});

		this.setState({
			todos: updatedTodos
		});

		Utils.store(LOCALSTORAGE_NAMESPACE + '.todos', this.state.todos);
	};

	QuizBitStore.prototype.toggle = function (todoToToggle) {
		var updatedTodos = this.state.todos.map(function (todo) {
			return todo !== todoToToggle ?
				todo :
				Utils.extend({}, todo, {completed: !todo.completed});
		});

		this.setState({
			todos: updatedTodos
		});

		Utils.store(LOCALSTORAGE_NAMESPACE + '.todos', this.state.todos);
	};

	QuizBitStore.prototype.destroy = function (todoToDestroy) {
		var updatedTodos = this.state.todos.filter(function (todo) {
			return todo !== todoToDestroy;
		});

		this.setState({
			todos: updatedTodos
		});

		Utils.store(LOCALSTORAGE_NAMESPACE + '.todos', this.state.todos);
	};

	QuizBitStore.prototype.save = function (command) {
		var updatedTodos = this.state.todos.map(function (todo) {
			return todo !== command.todoToSave ?
				todo :
				Utils.extend({}, command.todoToSave, {title: command.text});
		});

		this.setState({
			todos: updatedTodos
		});

		Utils.store(LOCALSTORAGE_NAMESPACE + '.todos', this.state.todos);
	};

	QuizBitStore.prototype.clearCompleted = function () {
		var updatedTodos = this.state.todos.filter(function (todo) {
			return !todo.completed;
		});

		this.setState({
			todos: updatedTodos
		});

		Utils.store(LOCALSTORAGE_NAMESPACE + '.todos', this.state.todos);
	};

	TodoStore.prototype.edit = function (id) {
		this.setState({
			editing: id
		});

		Utils.store(LOCALSTORAGE_NAMESPACE + '.editing', this.editing);
	};

	QuizBitStore.prototype.show = function (nowShowing) {
		this.setState({
			nowShowing: nowShowing
		});

		Utils.store(LOCALSTORAGE_NAMESPACE + '.nowShowing', this.nowShowing);
	};*/

	QuizBitStore.displayName = 'QuizBitStore';

	app.QuizBitStore = app.alt.createStore(QuizBitStore);
})();
