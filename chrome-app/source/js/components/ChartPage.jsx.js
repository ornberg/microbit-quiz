import React, { Component } from 'react'
import { updateChart, drawChart } from '../voteChart'

class ChartPage extends Component {
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
    updateChart(this.props.answers, ["Measurement"], this.props.votes, this.letterColours);
  }
  render() {
    return (
      <div>
        <h1 className="question-title">Results</h1>
        <canvas className="voteResults"></canvas>
      </div>
    );
  }
}

export default ChartPage
