import React, { Component } from 'react'

class Answer extends Component {
  constructor() {
    super();
  }
  render() {
    console.log(this.props.label);
    var letter = String.fromCharCode(65 + this.props.index);
    return (
      <li className="styled-box answer">
        <div className="answer-letter">
          <span className={"coloured-" + letter}>{letter}</span>
        </div>
          { this.props.edit ? <input readOnly={!this.props.edit} onChange={this.props.answerHandler.bind(null, this.props.index)} value={this.props.label} className="answer-label"/> : <span className="answer-label">{this.props.label}</span> }
          { this.props.edit ? <div onClick={this.props.deleteAnswerHandler.bind(null, this.props.index)} className="delete-answer">X</div> : null }
      </li>
    )
  }
}

export default Answer
