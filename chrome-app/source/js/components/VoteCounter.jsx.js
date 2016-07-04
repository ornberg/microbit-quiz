var VoteCounter = React.createClass({
  render() {
    return (
      <div className="styled-box vote-box">
        <span>{currentQuestion.getVoteCount()}</span>
        <p>Votes In</p>
      </div>
    );
  }
});
