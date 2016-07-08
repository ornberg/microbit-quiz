import React, { Component } from 'react'

class ConnectionStatus extends Component {
  constructor() {
    super();
  }
  render() {
    return (
      <div className={"connection-status " + (this.props.connected ? "connected" : "disconnected")}></div>
    );
  }
}

export default ConnectionStatus
