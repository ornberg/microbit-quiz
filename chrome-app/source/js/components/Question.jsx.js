import React, { Component } from 'react'
import Answer from './Answer'

class Question extends Component {
  constructor() {
    super();
  }

  render() {
    console.log(this.props.answers);
    var answers = this.props.answers.map(function(ans, index) {
			return <Answer deleteAnswerHandler={this.props.deleteAnswerHandler} edit={this.props.edit} answerHandler={this.props.answerHandler} key={index} index={index} label={ans}/>;
		}, this);
    console.log(this.props.question);
    return (
      <div className="question-box">
        <input readOnly={!this.props.edit} onChange={this.props.questionHandler} value={this.props.title} className="question-title animated"/>
        <ul className={"answer-box" + (this.props.edit ? " edit" : "")}>
          {answers}
          { this.props.edit ? <li onClick={this.props.newAnswerHandler} className="styled-box answer add-answer animated"><div className="add-answer-symbol"></div></li> : null }
        </ul>
      </div>
    )
  }
}

export default Question
