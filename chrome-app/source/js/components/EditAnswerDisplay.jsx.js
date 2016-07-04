var EditAnswerDisplay = React.createClass({
  render() {
    return (
      <li className="styled-box answer">
        <div className="answer-letter">
          <span className={"coloured-"+this.props.letter}>{this.props.letter}</span>
        </div>
          <input value={this.props.desc} className="answer-label"/>
      </li>
    );
  }
});
