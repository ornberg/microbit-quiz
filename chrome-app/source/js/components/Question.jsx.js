var Question = React.createClass({
  getInitialState: function () {
    return {
      desc: this.props.desc,
      answers: this.props.answers
    };
  },
  render() {
    var description = this.state.desc;
    var answers = this.state.answers;
		var answers = answers.map(function(ans, index) {
			return <Answer editHandler={this.props.editHandler} edit={this.props.edit} key={index} index={index} desc={ans}/>;
		}, this);
    return <QuestionDisplay edit={this.props.edit} desc={description} answers={answers}/>;
  }
});
