

function erf(x) {
	// sign of x
	var sign = (x >= 0) ? 1 : -1;
	x = Math.abs(x);

	// constants
	var a1 =  0.254829592;
	var a2 = -0.284496736;
	var a3 = 1.421413741;
	var a4 = -1.453152027;
	var a5 = 1.061405429;
	var p  = 0.3275911;

	// A&S formula 7.1.26
	var t = 1.0/(1.0 + p*x);
	var y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
	return sign * y; // erf(-x) = -erf(x);
}

function cdf(x, mean, variance) {
	if ((x-mean)/variance<-1e4) { return 0; }
	else if ((x-mean)/variance>1e4) { return 1; }
	else { return 0.5 * (1 + erf((x - mean) / (Math.sqrt(2 * variance)))); }
}

// standard normal CDF
function N(z) {
	return cdf(z, 0, 1);
}

// standard normal PDF
function Nprime(z) {
	return (1.0 / (Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * z*z);
}



// BlackScholes formula and Greeks - Call option
function BS_Greeks_Call(input) {
	var S, K, T, v, r, q;
	S = input[0];
	K = input[1];
	T = input[2];
	v = input[3];
	r = input[4];
	q = input[5];

	var sqrt_T = Math.sqrt(T),
		d1 = (1 / (v *sqrt_T)) * (Math.log(S/K) + (r -q + v*v) * T),
		d2 = d1 - v * sqrt_T,
		N_d1 = N(d1),
		N_prime_d1 = Nprime(d1),
		N_d2 = N(d2),
		N_prime_d2 = Nprime(d2),
		PV = Math.exp(-r * T),
		PV_K = K * PV,
		D = Math.exp(-q * T),
		value = N_d1 * S *D- N_d2 * PV_K;

	var delta = D * N_d1,
		gamma = D * N_prime_d1 / (S * v * sqrt_T),
		vega = S *D * N_prime_d1 * sqrt_T,
		theta = -D * S * N_prime_d1 * v / (2 * sqrt_T) - r * PV_K * N_d2 + q * S * D * N_d1,
		rho = PV_K * T * N_d2,
		voma = S * D * N_prime_d1 * sqrt_T * d1 *d2 / v;

	var payoff = Math.max(0, S - K),
		PV_payoff = PV * payoff;


	return {'d1': d1, 'd2': d2, 'N_d1_call': N_d1, 'N_d2_call': N_d2, 'N_prime_d1': N_prime_d1, 'N_prime_d2': N_prime_d2, 'PV': PV, 'PV_K': PV_K, 'D': D, 'value': value,
			'delta': delta, 'gamma': gamma, 'vega': vega, 'theta': theta, 'rho': rho, 'voma': voma, 'payoff': payoff, 'PV_payoff': PV_payoff};
}


// BlackScholes formula and Greeks - Put option
function BS_Greeks_Put(input) {
	var S, K, T, v, r, q;
	S = input[0];
	K = input[1];
	T = input[2];
	v = input[3];
	r = input[4];
	q = input[5];

	var sqrt_T = Math.sqrt(T),
		d1 = (1 / (v *sqrt_T)) * (Math.log(S/K) + (r -q + v*v) * T),
		d2 = d1 - v * sqrt_T,
		N_minus_d1 = N(-d1),
		N_prime_d1 = Nprime(d1),
		N_minus_d2 = N(-d2),
		N_prime_d2 = Nprime(d2),
		PV = Math.exp(-r * T),
		PV_K = K * PV,
		D = Math.exp(-q * T),
		value = N_minus_d2 * PV_K - N_minus_d1 * S * D;

	var delta = - D * N_minus_d1,
		gamma = D * N_prime_d1 / (S * v * sqrt_T),
		vega = S *D * N_prime_d1 * sqrt_T,
		theta = -D * S * N_prime_d1 * v / (2 * sqrt_T) + r * PV_K * N_minus_d2 - q * S * D * N_minus_d1,
		rho = - PV_K * T * N_minus_d2,
		voma = S * D * N_prime_d1 * sqrt_T * d1 *d2 / v;

	var payoff = Math.max(0, K - S),
		PV_payoff = PV * payoff;

	return {'d1': d1, 'd2': d2, 'N_d1_put': N_minus_d1, 'N_d2_put': N_minus_d2, 'N_prime_d1': N_prime_d1, 'N_prime_d2': N_prime_d2, 'PV': PV, 'PV_K': PV_K, 'D': D, 'value': value,
			'delta': delta, 'gamma': gamma, 'vega': vega, 'theta': theta, 'rho': rho, 'voma': voma, 'payoff': payoff, 'PV_payoff': PV_payoff};
}



function create_price(option_type, S, K, T, v, r, q) {
	var input = [S, K, T, v, r, q],
		BS = choose_pricing_function(option_type),
		res;

	return BS(input);
}


function create_price_array_2D(option_type, S, K, T, v, r, q, x, x_min, x_max, x_nb_step) {
	// x is the no of input param, from 0 to 5
	// option_type is 'call', or 'put'

	var BS,
		res,
		input_init = [S, K, T, v, r, q],
		input,
		rng_x = range(x_min, x_max, x_nb_step);

	BS = choose_pricing_function(option_type);

	var arr = new Array(rng_x.length);
	for (var i = 0; i < arr.length; i++) {
		input = input_init.slice(0);
		input[x] = rng_x[i];
		res = BS(input);

		arr[i] = new Array(2);
		arr[i][0] = rng_x[i];
		arr[i][1] = res;
	}

	window.arr = arr;
	window.res = res;

	return	arr;
}




function create_price_array_3D(option_type, S, K, T, v, r, q, x, x_min, x_max, x_nb_step, y, y_min, y_max, y_nb_step) {
	// x is the no of input param, from 0 to 5
	// y is the no of input param, from 0 to 5
	// option_type is 'call', or 'put'

	var res,
		input_init = [S, K, T, v, r, q],
		input_init_x,
		input,
		rng_x = range(x_min, x_max, x_nb_step);
		rng_y = range(y_min, y_max, y_nb_step);

	BS = choose_pricing_function(option_type);

	var arr = new Array(rng_x.length);
	for (var k = 0; k < arr.length; k++) {
		input_init_x = input_init.slice(0);
		input_init_x[x] = rng_x[k];
		arr[k] = new Array(rng_y.length);
		for (var i = 0; i < arr.length; i++) {
			input = input_init_x.slice(0);
			input[y] = rng_y[i];
			res = BS(input);

			arr[k][i] = new Array(3);
			arr[k][i][0] = rng_x[k];
			arr[k][i][1] = rng_y[i];
			arr[k][i][2] = res;
		}
	}

	window.arr = arr;
	window.res = res;

	return	arr;
}



function choose_pricing_function(option_type) {
	if (option_type=='call') {
		return BS_Greeks_Call;
	}
	else if (option_type=='put') {
		return BS_Greeks_Put;
	}
	else {
		return;
	}
}

function range(a, b, n) {
	var rng = [],
		s = (b-a)/n;
	for (var k = 0; k < n+1; k++) {
		rng.push(a + s * k);
	}
	return rng;
}


