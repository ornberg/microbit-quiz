var AnswerDisplay = React.createClass({
  render() {
    return (
      <li className="styled-box answer">
        <div className="answer-letter">
          <span className={"coloured-" + this.props.letter}>{this.props.letter}</span>
        </div>
          { this.props.edit ? <input readOnly={!this.props.edit} value={this.props.desc} className="answer-label"/> : <span className="answer-label">{this.props.desc}</span> }
      </li>
    );
  }
});
