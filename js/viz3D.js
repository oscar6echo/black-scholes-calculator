

var graph3D,
	data_table;


function update_graph_3D(x, y, z, array_price) {

	var options = {packages: ['corechart'], callback : drawVisualization};
	google.load('visualization', '1', options);

	// Set callback to run when API is loaded
	google.setOnLoadCallback(drawVisualization);
}




function shape_data(x, y, z, array_price) {

	// Create and populate a data table.
	var data = new google.visualization.DataTable();
	data.addColumn('number', x);
	data.addColumn('number', y);
	data.addColumn('number', z);

	var N_x = array_price.length,
		N_y = array_price[0].length,
		value_x, value_y, value_z;

	for (var n_x = 0; n_x < N_x; n_x++) {
		for (var n_y = 0; n_y < N_y; n_y++) {
			value_x = array_price[n_x][n_y][0]
			value_y = array_price[n_x][n_y][1]
			value_z = array_price[n_x][n_y][2][z]
			data.addRow([value_x, value_y, value_z]);
		}
	}

	return data;
}


// Called when the Visualization API is loaded.
function drawVisualization() {

	// create data_table
	data_table = shape_data(x, y, z, array_price);

	// specify options
	options = {width:  "735px",
				height: "495px",
				style: "surface",
				showPerspective: true,
				showGrid: true,
				showShadow: false,
				keepAspectRatio: true,
				verticalRatio: 0.7,
				keepAspectRatio: false,
				backgroundColor: {
					stroke: '#cccccc',
					strokeWidth: 1
				}
	};

	// Instantiate our graph object.
	graph3D = new links.Graph3d(document.getElementById('viz3D'));

	// Draw our graph with the created data and options
	graph3D.draw(data_table, options);
}


function clear_graph_3D() {
	var sel = document.getElementById('viz3D');
	while (sel.hasChildNodes()) {
		sel.removeChild(sel.firstChild);
	}
}
