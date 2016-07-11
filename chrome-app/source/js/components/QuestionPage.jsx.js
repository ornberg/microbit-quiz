class QuestionPage extends React.Component {
  constructor() {
    super();
  }
  render() {
    return (
      <div className="container">
        <Question editHandler={this.props.editHandler} edit={this.props.edit} desc={this.props.question.getDesc()} answers={this.props.question.getAnswerList()}/>
        {this.props.edit ? null : <VoteCounter votes={this.props.votes}/>}
      </div>
    );
  }
}
