import React, { Component } from 'react'
import { updateChart, runChart } from '../voteChart'

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
    runChart();
    updateChart(this.props.answers, this.props.votes, this.letterColours);
    window.chartTimer = setInterval(function() { updateChart(this.props.answers, this.props.votes, this.letterColours); }.bind(this), 2000);
  }
  componentWillUnmount() {
    clearInterval(window.chartTimer);
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
