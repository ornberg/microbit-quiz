import React, { Component } from 'react'

class AppButton extends Component {
  constructor() {
    super();
  }
  render() {
    if (typeof this.props.classNames === 'undefined')
      this.props.classNames = "";
    return (
      <button className={"styled-box btn " + this.props.classNames} disabled={!this.props.active} onClick={this.props.handleClick}>{this.props.text}</button>
    );
  }
}

export default AppButton
