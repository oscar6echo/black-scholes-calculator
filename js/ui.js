

var graph_type,
	option_type,
	nb_step,
	x, y,
	z, axis,
	valid,
	price,
	array_price;


var S, K, T, v, r, q,
	S_max, K_max, T_max, v_max, r_max, q_max,
	S_min, K_min, T_min, v_min, r_min, q_min;

var BS_input_param_bounds = [['Smin', 0.0001], ['Kmin', 0], ['Tmin', 0.0001], ['vmin', 0.0001], ['rmin', -100.0], ['qmin', -25]];

var output_selectors = ['d1', 'N_d1_call', 'N_d1_put', 'N_prime_d1', 'd2', 'N_d2_call', 'N_d2_put', 'N_prime_d2', 'PV', 'PV_K', 'value', 'delta', 'gamma', 'vega', 'theta', 'rho', 'voma', 'payoff', 'PV_payoff'];



function fmt (x) {
	if (x===undefined) { return undefined; }
	else { return x.toFixed(4); }
}


function between(x, min, max) {
	return (x>=min) && (x<=max);
}


function on_click_graph_type() {
	var radio_graph_type = document.getElementsByName('graph_type');
	for (var i = 0; i < radio_graph_type.length; i++) {
		if (radio_graph_type[i].checked) {
			graph_type = radio_graph_type[i].value;
			break;
		}
	}

	if (graph_type=='2D') {
		var sel = document.getElementsByName('y');
		for (var i = 0; i < sel.length; i++) {
			sel[i].checked = false;
			sel[i].className = 'invisible';
		}
		var sel = document.getElementsByClassName('y');
		sel[0].className = 'y invisible';

		var sel = document.getElementsByName('z');
		for (var i = 0; i < sel.length; i++) {
			sel[i].type = 'checkbox';
			sel[i].checked = false;
		}

		var sel = document.getElementsByName('axis');
		for (var i = 0; i < sel.length; i++) {
			sel[i].className = 'invisible';
			sel[i].checked = false;
		}

		var sel = document.getElementById('viz2D');
		sel.style.display = 'block';

		var sel = document.getElementById('viz3D');
		sel.style.display = 'none';

		document.getElementById('nbstep').value = 200;

		clear_graph_3D();
	}

	if (graph_type=='3D') {
		var sel = document.getElementsByName('y');
		for (var i = 0; i < sel.length; i++) {
			sel[i].className = '';
			sel[i].checked = false;
		}
		var sel = document.getElementsByClassName('y invisible');
		sel[0].className = 'y';


		var sel = document.getElementsByName('z');
		for (var i = 0; i < sel.length; i++) {
			sel[i].type = 'radio';
			sel[i].checked = false;
		}

		var sel = document.getElementsByName('axis');
		for (var i = 0; i < sel.length; i++) {
			sel[i].checked = false;
			sel[i].className = 'invisible';
		}

		var sel = document.getElementById('viz2D');
		sel.style.display = 'none';

		var sel = document.getElementById('viz3D');
		sel.style.display = 'block';

		document.getElementById('nbstep').value = 50;

		clear_graph_2D();
	}


	update();
}



function on_click_option_type() {
	var radio_option_type = document.getElementsByName('option_type');
	for (var i = 0; i < radio_option_type.length; i++) {
		if (radio_option_type[i].checked) {
			option_type = radio_option_type[i].value;
			break;
		}
	}

	if (option_type=='call') {

		var index = z.indexOf('N_d1_put_variable');
		if (index>-1) { z.splice(index, 1); }
		document.getElementById('N_d1_put_variable').parentNode.children[0].firstElementChild.checked = false;
		document.getElementById('N_d1_put_variable').parentNode.children[1].firstElementChild.checked = false;
		document.getElementById('N_d1_put_variable').parentNode.className = 'nodisplay';

		var index = z.indexOf('N_d2_put_variable');
		if (index>-1) { z.splice(index, 1); }
		document.getElementById('N_d2_put_variable').parentNode.children[0].firstElementChild.checked = false;
		document.getElementById('N_d2_put_variable').parentNode.children[1].firstElementChild.checked = false;
		document.getElementById('N_d2_put_variable').parentNode.className = 'nodisplay';

		document.getElementById('N_d1_call_variable').parentNode.className = '';
		document.getElementById('N_d2_call_variable').parentNode.className = '';
	}

	if (option_type=='put') {

		var index = z.indexOf('N_d1_call_variable');
		if (index>-1) { z.splice(index, 1); }
		document.getElementById('N_d1_call_variable').parentNode.children[0].firstElementChild.checked = false;
		document.getElementById('N_d1_call_variable').parentNode.children[1].firstElementChild.checked = false;
		document.getElementById('N_d1_call_variable').parentNode.className = 'nodisplay';

		var index = z.indexOf('N_d2_call_variable');
		if (index>-1) { z.splice(index, 1); }
		document.getElementById('N_d2_call_variable').parentNode.children[0].firstElementChild.checked = false;
		document.getElementById('N_d2_call_variable').parentNode.children[1].firstElementChild.checked = false;
		document.getElementById('N_d2_call_variable').parentNode.className = 'nodisplay';

		document.getElementById('N_d1_put_variable').parentNode.className = '';
		document.getElementById('N_d2_put_variable').parentNode.className = '';
	}

	update();
}



function on_click_z(obj) {

	if (graph_type=='2D') {
		var sel = obj.parentNode.parentNode.children[1].firstElementChild;
		if (obj.checked) {
			sel.className = '';
			sel.checked = true;
		}
		else {
			sel.className = 'invisible';
			if (sel.checked==true) {
				sel.checked = false;

				var checkbox_z = document.getElementsByName("z");
				z = [];
				for (var i = 0; i < checkbox_z.length; i++) {
					if (checkbox_z[i].checked) {
						z.push(checkbox_z[i].value);
					}
				}
				if (z.length>0) {
					document.getElementById(z[0] + '_variable').parentNode.children[1].firstElementChild.checked = true;
				}
			}
		}
	}
	update();
}



function check_if_valid_input() {
	// returns 'ok' if input valid else error msg
	var valid = 'Ok';

	if (!between(S, S_min, S_max)) { valid = 'Wrong S range'; }
	else if (!between(K, K_min, K_max)) { valid = 'Wrong K range'; }
	else if (!between(T, T_min, T_max)) { valid = 'Wrong T range'; }
	else if (!between(v, v_min, v_max)) { valid = 'Wrong v range'; }
	else if (!between(r, r_min, r_max)) { valid = 'Wrong r range'; }
	else if (!between(q, q_min, q_max)) { valid = 'Wrong q range'; }
	else if (x==0) { valid = 'Wrong x'; }
	else if ((y==0) && (graph_type=='3D')) { valid = 'Wrong y'; }
	else if ((z.length==0) || (z==0)) { valid = 'Wrong z'; }
	else if ((axis==0) && (graph_type=='2D')){ valid = 'Wrong axis'; }

	document.getElementById('status').innerHTML = 'Status: ' + valid;

	return valid;
}



function bring_BS_input_param_within_bounds() {

	var bounds = BS_input_param_bounds;

	for (var i = 0; i < bounds.length; i++) {
		var fieldmin = bounds[i][0],
			field = fieldmin.substring(0, fieldmin.length-3),
			fieldmax = field + 'max'
			limit = bounds[i][1];

		if (+document.getElementById(fieldmin).value<limit) {
			document.getElementById(fieldmin).value = limit;
		}

		if (+document.getElementById(field).value<+document.getElementById(fieldmin).value) {
			document.getElementById(field).value = document.getElementById(fieldmin).value;
		}

		if (+document.getElementById(fieldmax).value<+document.getElementById(field).value) {
			document.getElementById(fieldmax).value = document.getElementById(field).value;
		}
	}
}


function read_input() {
	var radio_graph_type = document.getElementsByName("graph_type");
	graph_type = 0;
	for (var i = 0; i < radio_graph_type.length; i++) {
		if (radio_graph_type[i].checked) {
			graph_type = radio_graph_type[i].value;
			break;
		}
	}

	var radio_option_type = document.getElementsByName("option_type");
	option_type = 0;
	for (var i = 0; i < radio_option_type.length; i++) {
		if (radio_option_type[i].checked) {
			option_type = radio_option_type[i].value;
			break;
		}
	}

	var radio_x = document.getElementsByName("x");
	x = 0;
	for (var i = 0; i < radio_x.length; i++) {
		if (radio_x[i].checked) {
			x = radio_x[i].value;
			break;
		}
	}

	var radio_y = document.getElementsByName("y");
	y = 0;
	for (var i = 0; i < radio_y.length; i++) {
		if (radio_y[i].checked) {
			y = radio_y[i].value;
			break;
		}
	}

	if (graph_type=='2D') {
		var checkbox_z = document.getElementsByName("z");
		z = [];
		for (var i = 0; i < checkbox_z.length; i++) {
			if (checkbox_z[i].checked) {
				z.push(checkbox_z[i].value);
			}
		}
	}
	else if (graph_type=='3D') {
		var radio_z = document.getElementsByName("z");
		z = 0;
		for (var i = 0; i < radio_z.length; i++) {
			if (radio_z[i].checked) {
				z = radio_z[i].value;
				break;
			}
		}
	}

	var radio_axis = document.getElementsByName("axis");
	axis = 0;
	for (var i = 0; i < radio_axis.length; i++) {
		if (radio_axis[i].checked) {
			axis = radio_axis[i].value;
			break;
		}
	}


	nb_step = +document.getElementById("nbstep").value;

	S = +document.getElementById("S").value;
	K = +document.getElementById("K").value;
	T = +document.getElementById("T").value;
	v = +document.getElementById("v").value/100;
	r = +document.getElementById("r").value/100;
	q = +document.getElementById("q").value/100;

	S_min = +document.getElementById("Smin").value;
	K_min = +document.getElementById("Kmin").value;
	T_min = +document.getElementById("Tmin").value;
	v_min = +document.getElementById("vmin").value/100;
	r_min = +document.getElementById("rmin").value/100;
	q_min = +document.getElementById("qmin").value/100;

	S_max = +document.getElementById("Smax").value;
	K_max = +document.getElementById("Kmax").value;
	T_max = +document.getElementById("Tmax").value;
	v_max = +document.getElementById("vmax").value/100;
	r_max = +document.getElementById("rmax").value/100;
	q_max = +document.getElementById("qmax").value/100;
}



function update_and_write_price() {

	var sel = output_selectors,
		price = create_price(option_type, S, K, T, v, r, q);

	for (var i = 0; i < sel.length; i++) {
		document.getElementById(sel[i] + '_value').innerHTML = fmt(price[sel[i]]);
	}

	window.price = price;
	window.sel = sel;
}



function update_array() {
	var x_index = ['S', 'K', 'T', 'v', 'r', 'q'].indexOf(x),
		x_min = [S_min, K_min, T_min, v_min, r_min, q_min][x_index],
		x_max = [S_max, K_max, T_max, v_max, r_max, q_max][x_index];

	if (graph_type=='2D') {
		array_price = create_price_array_2D(option_type, S, K, T, v, r, q, x_index, x_min, x_max, nb_step);
	}
	else if (graph_type=='3D') {
		var y_index = ['S', 'K', 'T', 'v', 'r', 'q'].indexOf(y),
			y_min = [S_min, K_min, T_min, v_min, r_min, q_min][y_index],
			y_max = [S_max, K_max, T_max, v_max, r_max, q_max][y_index];

		array_price = create_price_array_3D(option_type, S, K, T, v, r, q, x_index, x_min, x_max, nb_step, y_index, y_min, y_max, nb_step);
	}
}



function update_graph() {
	if (graph_type=='2D') {
		update_graph_2D(x, z, axis, array_price);
	}
	else if (graph_type=='3D') {
		update_graph_3D(x, y, z, array_price);
	}
}

function clear_graph() {
	if (graph_type=='2D') {
		clear_graph_2D();
	}
	else if (graph_type=='3D') {
		clear_graph_3D();
	}
}


function update() {
	bring_BS_input_param_within_bounds();
	read_input();
	valid = check_if_valid_input();
	if (valid === 'Ok') {
		update_and_write_price()
		update_array();
		update_graph();
	}
	else {
		clear_graph();
	}
}


function init() {
	// select 2D
	document.getElementsByName('graph_type')[0].checked = true;
	on_click_graph_type();

	// select Call
	document.getElementsByName('option_type')[0].checked = true;
	on_click_option_type();

	// select x=S
	document.getElementsByName('x')[0].checked = true;
	update();

	// select z=V
	var sel = document.getElementsByName('z')[10];
	sel.checked = true;
	on_click_z(sel);
}


// -------------------------- main
init();
show_input_param();



// -------------------------- debugging

function show_input_param() {
	console.log('graph_type=' + graph_type);
	console.log('option_type=' + option_type);

	console.log('S=' + S + ', S_min=' + S_min	+ ', S_max=' + S_max);
	console.log('K=' + K + ', K_min=' + K_min + ', K_max=' + K_max);
	console.log('T=' + T + ', T_min=' + T_min + ', T_max=' + T_max);
	console.log('v=' + v + ', v_min=' + v_min	+ ', v_max=' + v_max);
	console.log('r=' + r + ', r_min=' + r_min + ', r_max=' + r_max);
	console.log('q=' + q + ', q_min=' + q_min + ', q_max=' + q_max);

	console.log('x=' + x);
	console.log('y=' + y);
	console.log('axis=' + axis);
	console.log('z=' + z);

	console.log('valid=' + valid);
}



