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
    window.serial = new Serial(function(data) {
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
        //console.log(cmd);
        window.serial.write(cmd);
        //console.log(self.state.answerCounts);
      }
    },
    function(connected) {
      self.setState({hasMicrobit: connected});
      if (!connected) {
        setTimeout(function() {
          window.serial.reconnect(function() {});
        });
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    /*if (nextProps.selectedSubreddit !== this.props.selectedSubreddit) {
      const { dispatch, selectedSubreddit } = nextProps
      dispatch(fetchPostsIfNeeded(selectedSubreddit))
    }*/
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
    let newState = !this.state.voting;
    this.setState({
      voting: !this.state.voting
    })

    if (newState) {
      this.setState({
        questionId: this.state.questionId+1,
        votes: 0,
        voters: {},
        answerCounts: Array.apply(null, Array(this.state.answers.length)).map(function() { return 0 })
      }, function() {
          window.serial.write("set:ABCD:" + this.state.questionId + ":" + this.state.answers.length + ";");
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

  deleteAnswer(index, event, evt) {
    if (this.state.answers.length <= 2) {
      return; //minimum of two answers
    }
    console.log(event, evt);
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

  addAnswer(index, event) {

  }

  setQuestion(event) {
    this.setState({
      question: event.target.value
    });
  }

  handleRefreshClick(e) {
    /*e.preventDefault()

    const { dispatch, selectedSubreddit } = this.props
    dispatch(invalidateSubreddit(selectedSubreddit))
    dispatch(fetchPostsIfNeeded(selectedSubreddit))*/
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
            <AppButton active={!this.state.voting && !this.state.editing} text="Show Results" handleClick={this.setPage.bind(this, "results")}/>
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

function mapStateToProps(state) {
  /*const { selectedSubreddit, postsBySubreddit } = state
  const {
    isFetching,
    lastUpdated,
    items: posts
  } = postsBySubreddit[selectedSubreddit] || {
    isFetching: true,
    items: []
  }

  return {
    selectedSubreddit,
    posts,
    isFetching,
    lastUpdated
  }*/
  return state;
}

export default App
