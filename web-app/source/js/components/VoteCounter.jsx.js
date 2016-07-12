import React, { Component } from 'react'

class VoteCounter extends Component {

  constructor() {
    super();
  }

  render() {
    return (
      <div className="styled-box vote-box">
        <span>{this.props.votes}</span>
        <p>votes in</p>
      </div>
    );
  }

}

VoteCounter.propTypes = {
  votes: React.PropTypes.number.isRequired
}

export default VoteCounter
