var chartLabels = [];			// An array of strings. Each datapoint should have a label otherwise they won't show on the chart
var chartLabel = '';			// The 'units of measurement' for example 'number of votes' 
var chartData = [];				// The datapoints of the chart, the number of datapoints should match the number of labels
var chartBackgroundColor = [];	// An array of colours for each datapoint. Automatically generated in the updateData() function

var	chartType = 'bar'; 			// OPTIONS: 'line', 'bar', 'radar', 'polarArea', 'pie', 'doughnut'
 


/*
	Generates a random colour for the datapoints. Source: "http://stackoverflow.com/questions/24815851/how-do-clear-a-chart-from-a-canvas-so-that-hover-events-cannot-be-triggered"
*/
 
 
function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
	console.log(color);
    return color;
}

/* 
	Updates the 'chartLabels' array
 */

function updateLabels(labelsArray){
	chartLabels = labelsArray;
}

/* 
	Updates the 'chartLabel' string
 */

function updateLabel(labelString){
	chartLabel = labelString;
}

/* 
	Updates the 'chartData' array as well as fills the 'backgroundColor' array with chartData.length number of random colours
 */

function updateData(dataArray){
	chartData = dataArray;
	updateBackgroundColor();
}

/* 
	Fills the 'backgroundColor' array with chartData.length number of random colours
 */

function updateBackgroundColor(){
	chartBackgroundColor = [];
	for(i = 0; i < chartData.length; i++)
		chartBackgroundColor.push(getRandomColor());
}

/* 
	Updates the 'chartType' string
 */

function updateType(typeString){
	type = typeString;
}

/*
	Redraws the chart with new chartLabels, chartLabel and chartData
*/

function updateChart(newLabels, newLabel, newData){
	updateLabels(newLabels);
	updateLabel(newLabel);
	updateData(newData);
	drawChart();
}

/*
	Draws the chart in the canvas with the id 'voteResults'
*/

function drawChart(){
	var ctx = document.getElementById("voteResults");
	var myChart = new Chart(ctx, {
		type: chartType,
		data: {
			labels: chartLabels,
			datasets: [{
				label: chartLabel,
				data: chartData,
				backgroundColor: chartBackgroundColor,
				borderWidth: 1
			}]
		},
		options: {
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero:true
					}
				}]
			}
		}
	});
}