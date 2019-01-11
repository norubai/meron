import React, {Component} from 'react';
import {Bar} from 'react-chartjs-2';
import HeatMap from 'react-heatmap-grid';
import { timingSafeEqual } from 'crypto';

/*
const xLabels = new Array(7).fill(0).map((_, i) => `${i}`);
const yLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const data = new Array(yLabels.length)
  .fill(0)
  .map(() => new Array(xLabels.length).fill(0).map(() => Math.floor(Math.random() * 100)));

'rgba(255,99,132,0.2)'
'rgba(255,99,132,1)'
rgba(255,99,132,0.4)
'rgba(255,99,132,1)'
*/

const GRAPH_HEIGHT = 400;

class Graph extends Component {
	constructor(props) {
		super(props)
		this.barData = {
			labels: null,
			datasets: [{
				backgroundColor: 'rgba(0,146,146,0.2)',
				borderColor: 'rgba(0,146,146,1)',
				borderWidth: 1,
				hoverBackgroundColor: 'rgba(0,146,146,0.4)',
				hoverBorderColor: 'rgba(0,146,146,1)',
				data: null
			}]
		};
	}

  render() {
		// we dont have a graph yet.
		if (!this.props.xLabels)	return(<div></div>);

		var xLabels = this.props.xLabels;
		let barOptions = {
			responsive: true,					
			maintainAspectRatio: false,
			scales: {
				yAxes: [{ ticks: { beginAtZero: true } }],
				xAxes: [{ticks: {
					callback: function(value, index, values) {
						if (xLabels[index] == '') return undefined;
						return value
					},
					autoSkip: false
				}}]
			},
			legend: { display: false }
		};

		// no yLabels, meaning we are drawing bar chart
		if (!this.props.yLabels) {
			this.barData.labels = this.props.xLabels;
			this.barData.datasets[0].data = this.props.graphData;
			return (
					<Bar
						data={this.barData}
						height={GRAPH_HEIGHT}
						options={barOptions}
					/>
			);
		}
		// we are drawing grid.
		else {
			let height = (GRAPH_HEIGHT-35) / this.props.yLabels.length;
			let xLabelVisibility = Array(xLabels.length).fill(true);
			if  (xLabels.length === 365)
				xLabelVisibility = xLabelVisibility.map((_, i) => xLabels[i] != '');

			return(
					<HeatMap
						className = "mapzie"
						xLabels={this.props.xLabels}
						xLabelVisibility={xLabelVisibility}
						yLabels={this.props.yLabels}
						data={this.props.graphData}
						height={height}
						background={"#009292"}
						yLabelTextAlign={'center'}
					/>
			);
		}
  }
}




export default Graph;