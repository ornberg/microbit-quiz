var Answer = React.createClass({
  getInitialState: function () {
    return {
      desc: this.props.desc,
      index: this.props.index
    };
  },
  render() {
    var asciiValue = (65 + this.props.index);
    if (asciiValue > 90) {
      //handle more than 26 answers...?
    }
    var answerLetter = String.fromCharCode(asciiValue);
    return <AnswerDisplay editHandler={this.props.editHandler} edit={this.props.edit} desc={this.props.desc} letter={answerLetter}/>;
  }
});
