import React, { Component } from 'react'
import update from 'react-addons-update'
import ConnectionStatus from '../components/ConnectionStatus'
import AppButton from '../components/AppButton'
import ChartPage from '../components/ChartPage'
import Question from '../components/Question'
import VoteCounter from '../components/VoteCounter'
import { Serial } from '../main.js'

class App extends Component {
  constructor(props) {
    super(props)
    this.handleRefreshClick = this.handleRefreshClick.bind(this)
    this.state = {
      voting: false,
      editing: false,
      votes: 0,
      hasMicrobit: false,
      page: "question",
      question: "Do you like chocolate?",
      answers: ["Yes", "No", "Maybe", "No answer"],
      answerCounts: [0, 0, 0, 0],
      voters: {},
      questionId: -1
    }
  }
  componentDidMount() {
    var self = this;

    //Create a new serial connection manager, takes two functions:
      //1. called when data is received
      //2. called when the microbit connection state changes

    window.serial = new Serial(
      (data) => {
        if (data[0] === "ans") {
          if (typeof self.state.voters[data[3]] === 'undefined') {
            var microbitId = data[3];
            var answerId = parseInt(data[4]);
            self.setState({
              votes: self.state.votes+1,
              voters: update(self.state.voters, {[microbitId]: { $set: true}}),
              answerCounts: update(self.state.answerCounts, {[answerId]: { $set: (self.state.answerCounts[parseInt(answerId)]+1)}})
            });
          }
          var cmd = "ack:" + data.join(":").substring(4) + ";"; //always ack even if it's a resubmission
          window.serial.write(cmd);
        }
      },
      (connected) => {
        self.setState({hasMicrobit: connected});
        if (!connected) {
          //poll for a new micro:bit connection
          setTimeout(function() {
            window.serial.reconnect(function() {});
          });
        }
    });
  }

  setPage(page) {
    this.setState({
      page: page
    })
  }

  toggleEdit() {
    this.setState({
      editing: !this.state.editing
    })
  }

  toggleVote() {
    let startingNewVote = !this.state.voting;
    this.setState({
      voting: !this.state.voting
    })

    if (startingNewVote) {
      //reset any vote-related state
      this.setState({
        questionId: this.state.questionId+1,
        votes: 0,
        voters: {},
        answerCounts: Array.apply(null, Array(this.state.answers.length)).map(function() { return 0 })
      }, function() {
          //AFTER the new state transaction finishes, start bursting set signals
          window.serial.write("set:ABCD:" + this.state.questionId + ":" + this.state.answers.length + ";");
          window.sendTimer = setInterval(
            function() {
              window.serial.write("set:ABCD:" + this.state.questionId + ":" + this.state.answers.length + ";");
              //stop bursts when we stop voting
              if (!this.state.voting) {
                clearInterval(sendTimer);
              }
            }.bind(this), 3000
          );
      });
    }
  }

  setAnswer(index, event, evt) {
    console.log(event, evt);
    var self = this;
    this.setState({
      answers: update(self.state.answers, {[index]: { $set: (event.target.value)}})
    })
  }

  deleteAnswer(index, event) {
    if (this.state.answers.length <= 2) {
      return; //minimum of two answers
    }
    var self = this;
    this.setState({
      answers: update(self.state.answers, { $splice: [[index, 1]]})
    })
  }

  newAnswer(index, event, evt) {
    console.log(event, evt);
    var self = this;
    this.setState({
      answers: update(self.state.answers, { $push: ["???"]})
    })
  }

  setQuestion(event) {
    this.setState({
      question: event.target.value
    });
  }

  render() {
    console.log(this.state.answers);
    var page;
    switch(this.state.page) {
      case "question":
        page =
          <div>
            <Question
              edit={this.state.editing}
              title={this.state.question}
              answers={this.state.answers}
              questionHandler={this.setQuestion.bind(this)}
              answerHandler={this.setAnswer.bind(this)}
              deleteAnswerHandler={this.deleteAnswer.bind(this)}
              newAnswerHandler={this.newAnswer.bind(this)}
            />
            <VoteCounter votes={this.state.votes}/>
            <AppButton active={!this.state.editing} text="Show Results" handleClick={this.setPage.bind(this, "results")}/>
            <AppButton active={!this.state.voting} text={this.state.editing ? "Stop Editing" : "Edit Question"} handleClick={this.toggleEdit.bind(this)}/>
            <AppButton active={!this.state.editing} text={this.state.voting ? "Stop Vote" : "Start Vote"} classNames={this.state.voting ? "stop-btn" : "start-btn"} handleClick={this.toggleVote.bind(this)}/>
          </div>
        break;
      case "results":
        page =
          <div>
            <ChartPage answers={this.state.answers} votes={this.state.answerCounts}/>
            <AppButton active={true} text="Return" handleClick={this.setPage.bind(this, "question")}/>
          </div>
        break;
      default:
        page =
          <p>Failed</p>
    }
    return (
      <div>
        <ConnectionStatus connected={this.state.hasMicrobit}/>
        {page}
      </div>
    );
  }
}

export default App
