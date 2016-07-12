import update from 'react-addons-update'
import React, { Component } from 'react'
import ConnectionStatus from '../components/ConnectionStatus'
import AppButton from '../components/AppButton'
import ChartPage from '../components/ChartPage'
import Question from '../components/Question'
import VoteCounter from '../components/VoteCounter'
import Serial from '../classes/Serial.js'

class App extends Component {
  constructor() {
    super();
    this.state = {
      voting: false,
      editing: false,
      votes: 0,
      mbConnected: false,
      page: "question",
      question: "Do you like chocolate?",
      answers: ["Yes", "No", "Maybe", "No answer"],
      answerCounts: [0, 0, 0, 0],
      voters: {},
      questionId: -1
    }
    this.handlers = {
      editAnswer: (index, event) => {
        this.setState({
          answers: update(this.state.answers, {[index]: { $set: (event.target.value)}})
        })
      },
      delAnswer: (index, event) => {
        if (this.state.answers.length <= 2)
          return; //minimum of two answers
          this.setState({
            answers: update(this.state.answers, { $splice: [[index, 1]]})
          })
      },
      addAnswer: (index, event) => {
        this.setState({
          answers: update(this.state.answers, { $push: ["???"]})
        })
      },
      editQuestion: (index, event) => {
        this.setState({
          question: event.target.value
        });
      }
    }
  }
  componentDidMount() {

    //Create a new serial connection manager, takes two functions:
      //1. called when data is received
      //2. called when the microbit connection state changes

    window.serial = new Serial(
      (data) => {
        if (data[0] === "ans" && this.state.voting) {
          if (typeof this.state.voters[data[3]] === 'undefined') {
            var microbitId = data[3];
            var answerId = parseInt(data[4]);
            this.setState({
              votes: this.state.votes+1,
              voters: update(this.state.voters, {[microbitId]: { $set: true}}),
              answerCounts: update(this.state.answerCounts, {[answerId]: { $set: (this.state.answerCounts[parseInt(answerId)]+1)}})
            });
          }
          var cmd = "ack:" + data.join(":").substring(4) + ";"; //always ack even if it's a resubmission
          window.serial.write(cmd);
        }
      },
      (connected) => {
        this.setState({mbConnected: connected});
        if (!connected) {
          //cancel any current vote
          if (this.state.voting)
            this.toggleVote();
          setTimeout(function() {
            //poll for a new micro:bit connection
            window.serial.reconnect(function() {});
          }, 1000);
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
            }.bind(this), 3000
          );
      });
    }
    else {
      //stop bursts when we stop voting
      clearInterval(sendTimer);
    }
  }

  render() {
    var page, buttons;
    switch(this.state.page) {

      case "question":
        page =
          <Question
            edit={this.state.editing}
            title={this.state.question}
            answers={this.state.answers}
            handlers={this.handlers}
          />
        buttons =
          <div className="bottom-container">
            <VoteCounter votes={this.state.votes}/>
            <AppButton
              active={!this.state.editing}
              text="Show Results" classNames="animated"
              handleClick={this.setPage.bind(this, "results")}
            />
            <AppButton
              active={!this.state.voting}
              text={this.state.editing ? "Stop Editing" : "Edit Question"}
              classNames="animated"
              handleClick={this.toggleEdit.bind(this)}
            />
            <AppButton
              active={!this.state.editing && this.state.mbConnected}
              text={this.state.voting ? "Stop Vote" : "Start Vote"}
              handleClick={this.toggleVote.bind(this)}
              classNames={this.state.voting ? "stop-btn animated" : "start-btn animated"}
            />
          </div>
        break;

      case "results":
        page =
          <ChartPage answers={this.state.answers} votes={this.state.answerCounts}/>
        buttons =
          <AppButton
            active={true}
            text="Return"
            classNames="fixed-return-btn"
            handleClick={this.setPage.bind(this, "question")}
          />
        break;

      default:
        page =
          <p>Failed to load page.</p>
        buttons = null
    }
    return (
      <div>
        <ConnectionStatus connected={this.state.mbConnected}/>
        <div className="wrapper">
          {page}
          {buttons}
        </div>
      </div>
    );
  }
}

export default App;
