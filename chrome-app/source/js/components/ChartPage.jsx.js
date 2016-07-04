class ChartPage extends React.Component {
  constructor() {
    super();
    this.letterColours = [
      "#F08099",
      "#00AFD1",
      '#00D18F',
      "#FBC45B",
      "#CEA2FB"
    ];
  }
  componentDidMount() {
    drawChart();
    updateChart(this.props.question.getAnswerList(), ["Measurement"], this.props.question.getAnswerCounts(), this.letterColours);
  }
  render() {
    return (
      <div>
        <h1 className="question-title">{this.props.question.getDesc()}</h1>
        <canvas className="voteResults"></canvas>
      </div>
    );
  }
}
