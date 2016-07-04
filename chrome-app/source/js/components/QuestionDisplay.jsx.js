var QuestionDisplay = React.createClass({
  getInitialState: function () {
    return {text: "I am an Answer"};//this.props.todo.title};
  },
  render() {
    var answers = currentQuestion.getAnswerList();
		var answers = answers.map(function(ans, index) {
			return (
  				<Answer
            edit={this.props.edit}
            key={index}
            index={index}
  					desc={ans}
  				/>
			);
		}, this);
    return (
      <div className="question-box">
        <input readOnly={!this.props.edit} value={this.props.desc} className="question-title"/>
        <ul className="answer-box">
          {answers}
        </ul>
      </div>
    );
  }
});
