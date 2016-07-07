import Chart from 'chart.js'

var chartLabels = [];			// An array of strings. Each datapoint should have a label otherwise they won't show on the chart
var chartDataLabel = '';			// The 'units of measurement' for example 'number of votes'
var chartData = [];				// The datapoints of the chart, the number of datapoints should match the number of labels
var chartBackgroundColor = [];	// An array of colours for each datapoint. Automatically generated in the updateData() function

var	chartType = 'bar'; 			// OPTIONS: 'line', 'bar', 'radar', 'polarArea', 'pie', 'doughnut'
var firstFlag = true;


/*
	Updates the 'chartLabels' array
 */

function updateLabels(labelsArray){
	chartLabels = labelsArray;
}

/*
	Updates the 'chartDataLabel' string
 */

function updateLabel(labelString){
	chartDataLabel = labelString;
}

/*
	Updates the 'chartData' array
 */

function updateData(dataArray){
	chartData = dataArray;
}

/*
	Updates the 'chartBackgroundColor' array
 */

function updateBackgroundColor(colourArray){
	chartBackgroundColor = colourArray;
}

/*
	Updates the 'chartType' string
 */

function updateType(typeString){
	type = typeString;
}

/*
	Redraws the chart with new chartLabels, chartDataLabel and chartData
*/

export function updateChart(newLabels, newLabel, newData, colourArray){
	updateLabels(newLabels);
	updateLabel(newLabel);
	updateData(newData);
	updateBackgroundColor(colourArray);
	drawChart();
	firstFlag = false;
}

/*
	Draws the chart in the canvas with the id 'voteResults'
*/

export function drawChart(){
	var ctx = document.getElementsByClassName("voteResults")[0];
	var myChart = new Chart(ctx, {
		type: chartType,
		data: {
			labels: chartLabels,
			datasets: [{
				label: chartDataLabel,
				data: chartData,
				backgroundColor: chartBackgroundColor,
				borderWidth: 1
			}]
		},
		options: {
			animation: firstFlag,
			responsive: true,
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero:true,
						stepSize: 1
					}
				}]
			},
			legend: {
				display: false
			}
		}
	});
}
