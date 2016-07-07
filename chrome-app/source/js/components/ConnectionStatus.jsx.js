import React, { Component } from 'react'

class ConnectionStatus extends Component {
  constructor() {
    super();
  }
  render() {
    let text = this.props.connected ? "Your Micro:bit is connected :)" : "There is no Micro:bit connected :("
    return (
      <div>
        {text}
      </div>
    );
  }
}

export default ConnectionStatus
