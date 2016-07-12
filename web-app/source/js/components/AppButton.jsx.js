import React, { Component } from 'react'

class AppButton extends Component {

  constructor() {
    super();
  }

  render() {
    if (typeof this.props.classNames === 'undefined')
      this.props.classNames = "";
    return (
      <button disabled={!this.props.active} onClick={this.props.handleClick} className={"styled-box btn " + this.props.classNames}>
        {this.props.text}
      </button>
    );
  }

}

AppButton.propTypes = {
  active: React.PropTypes.bool.isRequired,
  text: React.PropTypes.string.isRequired,
  handleClick: React.PropTypes.func.isRequired,
  classNames: React.PropTypes.string
}

export default AppButton
