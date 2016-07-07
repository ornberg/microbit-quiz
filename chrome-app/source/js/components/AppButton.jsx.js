import React, { Component } from 'react'

class AppButton extends Component {
  constructor() {
    super();
  }
  render() {
    return (
      <button className={"styled-box btn " + this.props.classNames} disabled={!this.props.active} onClick={this.props.handleClick}>{this.props.text}</button>
    );
  }
}

export default AppButton
