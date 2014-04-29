


options = {
	chart: {
		renderTo: 'viz2D',
		marginLeft: 80,
		marginBottom: 80,
		alignTicks: false,
		animation: false,
		borderColor: '#cccccc',
		borderRadius: 0,
		borderWidth: 1,
	},

	exporting: {
		enabled: true,
		filename: 'custom-file-name'
	},

	navigation: {
		buttonOptions: {
			align: 'left'
		}
	},

	title: {
		text: ''
	},

	xAxis: {
		title: {
			text: null
		},
		animation: false
	},

	yAxis: [],
	// 	{//primary axis
	// 		title: {
	// 			text: null
	// 		},
	// 		animation: false
	// 	}
	// ],

	plotOptions: {
		series: {
			animation: false
		},
		line: {
			marker: {
				enabled: false
			},
			events: {
				legendItemClick: function () { return false; }
			}
		}
	},

	legend: {
		layout: 'horizontal',
		align: 'center',
		verticalAlign: 'bottom',
		floating: true,
		x: 0,
		y: 0,
		backgroundColor: '#FFFFFF'
	},

	tooltip: {
		formatter: function() {
			return x + ': <b>'+ fmt(this.x) + '</b>, ' + this.series.name + ': <b>'+ fmt(this.y) +'</b>';
		}
	},

	// series: [{
	// 	name: 's',
	// 	data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
	// 	yAxis: 0,
	// 	lineWidth: 1.25,
	// 	color: 'red'
	// }],
};


// prepare several empty axes
for (var i = 0; i < 20; i++) {
	options.yAxis.push({
		showEmpty: true,
		title: {
			text: ' ' // needs be a white space
		},
		// animation: false,
		startOnTick: false,
		endOnTick: false,
		gridLineWidth: 0,
		opposite: 0,
		title: {
			text: null
		},
		labels: {
			enabled: false
		}
	});
}



var chart2D = new Highcharts.Chart(options);

// d3.scale.category10()
// var color = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'];

// d3.scale.category20()
var color = ['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5']

function update_graph_2D(x, z, axis, array_price) {

	var data = new Array(z.length),
		data_min = new Array(z.length),
		data_max = new Array(z.length);

	for (var k=0; k<z.length; k++) {
		data[k] = new Array(array_price.length);
		data_min[k] = 1e6;
		data_max[k] = -1e6;

		for (var m=0; m<data[k].length; m++) {
			data[k][m] = new Array(2);
			data[k][m][0] = array_price[m][0];
			data[k][m][1] = array_price[m][1][z[k]];

			if (data[k][m][1] < data_min[k]) { data_min[k] = data[k][m][1]; }
			if (data[k][m][1] > data_max[k]) { data_max[k] = data[k][m][1]; }
		}
		data_min[k] = data_min[k] - 0.03 * (data_max[k] - data_min[k])
		data_max[k] = data_max[k] + 0.03 * (data_max[k] - data_min[k])
	}
	window.data_plot = data;
	window.data_min = data_min;
	window.data_max = data_max;

	while(chart2D.series.length > 0) {
		chart2D.series[0].remove(false);
	}

	for (var k = 0; k < z.length; k++) {
		var z_index = output_selectors.indexOf(z[k]),
			axis_index = output_selectors.indexOf(axis);

		var data_series = {
			data: data[k],
			name: z[k],
			color: color[z_index],
			yAxis: z_index < 17 ? z_index : 10,		// each variable has its own axis except payoff and PV(payoff) which use same axis as value
			type: 'line',
			animation: false,
			shadow: false
		};
		window.data_series = data_series;
		window.z_index = z_index;
		window.axis_index = axis_index;

		chart2D.addSeries(data_series, true, false);
		chart2D.yAxis[z_index].update({
			min: data_min[k],
			max: data_max[k]
			}, false);
		// console.log('data_min[z_index]='+data_min[k]+', data_max[z_index]='+data_max[k]);
		// console.log('k='+k+', z_index='+z_index+', chart2D.yAxis[z_index].min='+chart2D.yAxis[z_index].min+', chart2D.yAxis[z_index].max='+chart2D.yAxis[z_index].max);
	}

	for (var i = 0; i < output_selectors.length; i++) {
		if (i==axis_index) {
			chart2D.yAxis[i].update({
				labels: { enabled: true },
				title: { text: output_selectors[axis_index] },
				gridLineWidth: 1
				}, false);
			// console.log('i='+i+', ymin='+chart2D.yAxis[i].min+', ymax='+chart2D.yAxis[i].max);
		}
		else {
			chart2D.yAxis[i].update({
				labels: { enabled: false },
				title: { text: null },
				gridLineWidth: 0
				}, false);
		}
	}
	// console.log('axis_index='+axis_index);

	chart2D.xAxis[0].update({
		title: { text: x },
		gridLineWidth: 1
		}, false);


	chart2D.redraw(false);

}


function clear_graph_2D() {
	while(chart2D.series.length > 0) {
		chart2D.series[0].remove(false);
	}
}


