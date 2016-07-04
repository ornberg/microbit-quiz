var App = React.createClass({
  onStoreChange: function(store) {
    this.setState(store);
  },    //var answers = currentQuestion.getAnswerList();

  componentDidMount: function () {
  },

  componentWillUnmount: function () {
  },
  getInitialState: function () {
    return {
      voting: false,
      votes: 0,
      page: "question",
      editing: false
    };
  },
  toggleQuizState: function() {
  	this.setState({
      voting: !this.state.voting
    });
    if (!this.state.voting && s.isConnected()) { //state hasn't updated yet! i.e. we're ABOUT to start voting if this is true
      s.write("set:ABCD" + ":" + (Math.floor(Math.random() * (5000 - 0 + 1)) + 0) + ":" + currentQuestion.getAnswerList().length + ";");
    }
  },
  toggleEditState: function() {
  	this.setState({
      editing: !this.state.editing
    });
  },
  ammendQuestion: function(data) {
    console.log(data);
  },
  setPage: function(page) {
    this.setState({
      page: page,
    });
  },
  render() {
    if (!s.isConnected()) {
      var recon = function () {
        s.reconnect(function(connected) {
          if (!connected) {
            setTimeout(recon, 2000);
          }
        });
      }
      setTimeout(recon, 2000);
    }
    if (this.state.page === "question") {
      var buttons = <div>
                      <AppButton active={s.isConnected() && !this.state.editing} text={this.state.voting ? "Stop Voting" : "Start Voting"} handleClick={this.toggleQuizState} classNames={ this.state.voting ? "stop-btn" : "start-btn"}/>
                      <AppButton active={!this.state.voting && !this.state.editing} text="Show Results" handleClick={this.setPage.bind(null, "charter")}/>
                      <AppButton active={!this.state.voting} text={this.state.editing ? "Stop Editing" : "Edit Question"} handleClick={this.toggleEditState} classNames={ this.state.editing ? "stop-btn" : "start-btn"}/>
                    </div>
      var page = <QuestionPage edit={this.state.editing} editHandler={this.ammendQuestion} question={currentQuestion} voting={this.state.voting} votes={this.state.votes}/>
    }
    else if (this.state.page === "charter") {
      var buttons = <div>
                      <AppButton active={true} text="Return to Question" handleClick={this.setPage.bind(null, "question")}/>
                    </div>
      var page = <ChartPage question={currentQuestion}/>
    }
    return (
      <div>
        <ConnectionStatus/>
        {page}
        {buttons}
      </div>
    );
  }
});

setInterval(function() {
  ReactDOM.render(
    <App/>,
    document.getElementById("app-frame")
  );
}, 50);
