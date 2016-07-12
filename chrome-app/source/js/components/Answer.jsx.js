import React, { Component } from 'react'

class Answer extends Component {

  constructor() {
    super();
  }

  render() {
    var letter = String.fromCharCode(65 + this.props.index);
    return (
      <li className="styled-box answer">
        <div className="answer-letter">
          <span className={"coloured-" + letter}>{letter}</span>
        </div>
          { this.props.edit ?
            <input
              readOnly={!this.props.edit}
              onChange={this.props.editHandler.bind(null, this.props.index)}
              value={this.props.label}
              className="answer-label animated"
            />
          : <span className="answer-label">{this.props.label}</span> }
          { (this.props.edit && this.props.canDelete) ?
            <div onClick={this.props.delHandler.bind(null, this.props.index)} className="delete-answer">
              <div className="delete-answer-symbol"></div>
            </div>
          : null }
      </li>
    )
  }

}

Answer.propTypes = {
  index:       React.PropTypes.number.isRequired,
  edit:        React.PropTypes.bool.isRequired,
  label:       React.PropTypes.string.isRequired,
  canDelete:   React.PropTypes.bool.isRequired,
  editHandler: React.PropTypes.func.isRequired,
  delHandler:  React.PropTypes.func.isRequired
}

export default Answer
