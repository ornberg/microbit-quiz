class EditQuestionPage extends React.Component {
  constructor() {
    super();
  }
  render() {
    return (
      <div>
        <Question edit={true} desc={this.props.question.getDesc()} answers={this.props.question.getAnswerList()}/>
        <AppButton active={true} text="Add Answer"/>
      </div>
    );
  }
}
