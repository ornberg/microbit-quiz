var EditQuestionDisplay = React.createClass({
  getInitialState: function () {
    return {text: "I am an Answer", value: this.props.desc};//this.props.todo.title};
  },
  handleChange: function(event) {
    this.setState({ value: event.target.value});
  },
  render() {
    var answers = currentQuestion.getAnswerList();
		var answers = answers.map(function(ans, index) {
			return (
  				<Answer
            edit={true}
            key={index}
            index={index}
  					desc={ans}
  				/>
			);
		}, this);
    return (
      <div className="question-box">
        <input value={this.state.value} onChange={this.handleChange}/>
        <div className="answer-box">
          {answers}
        </div>
      </div>
    );
  }
});
