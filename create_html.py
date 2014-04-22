
from jinja2 import Environment
import paperclip


# --------------------------------------------------------------------------------------------------------
title = """
<h4>Black Scholes Calculator</h4>
"""

# --------------------------------------------------------------------------------------------------------
pre_input_template = """
<table id="preinput">
	<thead>
		<tr>
			<th class="variable"></th>
			<th class="value"></th>
			<th class="value"></th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>Graph</td>
			<td><input type="radio" name="graph_type" value="2D" onclick="on_click_graph_type()" checked>2D</td>
			<td><input type="radio" name="graph_type" value="3D" onclick="on_click_graph_type()">3D</td>
		</tr>
		<tr>
			<td>Option</td>
			<td><input type="radio" name="option_type" value="call" onclick="on_click_option_type()" checked>Call</td>
			<td><input type="radio" name="option_type" value="put" onclick="on_click_option_type()">Put</td>
		</tr>
		<tr>
			<td>Nb steps (x, y)</td>
			<td colspan="2"><input id="nbstep" type="number" name="nbstep" value="200" onchange="update()"></td>
		</tr>
	</tbody>
</table>
"""

HTML_pre_input = pre_input_template
print HTML_pre_input

# --------------------------------------------------------------------------------------------------------
input_template = """
<table id="input">
	<thead>
		<tr>
			<th class="x">x</th>
			<th class="y">y</th>
			<th class="variable"></th>
			<th class="equal"></th>
			<th class="symbol"></th>
			<th class="current">input</th>
			<th class="transition"></th>
			<th class="min">min</th>
			<th class="transition"></th>
			<th class="max">max</th>
		</tr>
	</thead>
	<tbody>
		{% for x in input_data %}
		<tr>
			<td><input type="radio" name="x" value="{{x[0]}}" onclick="update()"></td>
			<td><input type="radio" name="y" value="{{x[0]}}" onclick="update()" class="threedim"></td>
			<td>{{x[6]}}</td>
			<td>=</td>
			<td>\({{x[1]}}\)</td>
			<td><input id="{{x[0]}}" type="number" name="{{x[0]}}" value="{{x[2]}}" onchange="update()"></td>
			<td>from</td>
			<td><input id="{{x[0]}}min" type="number" name="{{x[0]}}min" value="{{x[3]}}" step="{{x[5]}}" onchange="update()"></td>
			<td>to</td>
			<td><input id="{{x[0]}}max" type="number" name="{{x[0]}}max" value="{{x[4]}}" step="{{x[5]}}" onchange="update()"></td>
		</tr>
		{% endfor %}
	</tbody>
</table>
"""

# slider removed
# <th class="slider"></th>
# <td><input id="slider_{{x[0]}}" type="range" min="{{x[3]}}" max="{{x[4]}}" step="{{x[5]}}" value="{{x[2]}}" onchange="onchange_{{x[0]}}(this);"/></td>


input_data = [
	# symbol, symbol latex, value, min value, max value, step, description
	['S', 'S', '100', '0', '200', '1', 'Spot'],
	['K', 'K', '100', '0', '200', '1', 'Strike'],
	['T', 'T', '3', '0', '10', '0.1', 'Mat (y)'],
	['v', '\sigma', '15', '0', '40', '1', 'Vol (%)'],
	['r', 'r', '3', '-2', '10', '0.5', 'Rate (%)'],
	['q', 'q', '0', '-2', '5', '0.5', 'Div (%)']
]

HTML_input = Environment().from_string(input_template).render(input_data=input_data)
print HTML_input

# -------------------------------------------------------------------------------------------------------
output_template = """
<table id="output">
	<thead>
		<tr>
			<th class="z">z</th>
			<th class="axis">axis</th>
			<th class="symbol"></th>
			<th class="equal"></th>
			<th class="current">output</th>
		</tr>
	</thead>
	<tbody>
		{% for x in output_data %}
		<tr >
			<td><input type="checkbox" name="z" value="{{x[0]}}" onclick="on_click_z(this)"></td>
			<td><input type="radio" name="axis" value="{{x[0]}}" onclick="update()" class="invisible"></td>
			<td id="{{x[0]}}_variable">\({{x[1]}}\)</td>
			<td>=</td>
			<td id="{{x[0]}}_value"></td>
		</tr>
		{% endfor %}
	</tbody>
</table>
"""

output_data = [
	# css name, symbol latex
	['d1', r"d_1"],
	['N_d1_call', r"N(d_1)"],
	['N_d1_put', r"N(-d_1)"],
	['N_prime_d1', r"N'(d_1)"],
	['d2', r"d_2"],
	['N_d2_call', r"N(d_2)"],
	['N_d2_put', r"N(-d_2)"],
	['N_prime_d2', r"N'(d_2)"],
	['PV', r"e^{-rT}"],
	['PV_K', r"e^{-rT}K"],
	['value', r"V"],
	['delta', r"\Delta"],
	['gamma', r"\Gamma"],
	['vega', r"\nu"],
	['theta', r"\Theta"],
	['rho', r"\rho"],
	['voma', r"voma"],
	['payoff', r"Payoff"],
	['PV_payoff', r"e^{-rT}Payoff"]
]

HTML_output = Environment().from_string(output_template).render(output_data=output_data)
print HTML_output


# --------------------------------------------------------------------------------------------------------
ref_template_1 = """
<br><br><br>
<h4>Reference</h4>
<table id="ref_1">
	<thead>
		<tr>
			<th></th>
			<th ></th>
			<th ></th>
		</tr>
	</thead>
	<tbody>
		{% for x in output_data %}
		<tr>
			{% if x[2] %}
			<td>\[{{x[0]}}\]</td>
			<td>\[{{x[1]}}\]</td>
			<td>\[{{x[2]}}\]</td>
			{% else %}
			<td>\[{{x[0]}}\]</td>
			<td  colspan="2">\[{{x[1]}}\]</td>
			{% endif %}
		</tr>
		{% endfor %}
	</tbody>
</table>
"""

ref_data_1 = [
	['Option', 'Call', 'Put'],
	['Payoff', 'Max(0, S-K)', 'Max(0, K-S)'],
	[r"Value=V", r"Se^{-qT}N(d_1)-Ke^{-rT}N(d_2)", r'Ke^{-rT}N(-d_2)-Se^{-qT}N(-d_1)'],
	[r"\Delta=\frac{\partial V}{\partial S}", r"e^{-qT}N(d_1)", r'-e^{-qT}N(-d_1)'],
	[r"\Gamma=\frac{\partial \Delta}{\partial S}", r"e^{-qT}\frac{N'(d_1)}{S\sigma\sqrt{T}}"],
	[r"\nu=\frac{\partial V}{\partial \sigma}", r"Se^{-qT}N'(d_1)\sqrt{T}=Ke^{-rT}N'(d_2)\sqrt{T}"],
	[r"\Theta=-\frac{\partial V}{\partial T}", r"-e^{qT}\frac{SN'(d_1)\sigma}{2\sqrt{T}}-rKe^{-rT}N(d_2)+qSe^{-qT}N(d_1)", r"-e^{qT}\frac{SN'(d_1)\sigma}{2\sqrt{T}}+rKe^{-rT}N(-d_2)-qSe^{-qT}N(-d_1)"],
	[r"\rho=\frac{\partial V}{\partial r}", r"KTe^{-rT}N(d_2)", r"-KTe^{-rT}N(-d_2)"],
	[r"Voma=\frac{\partial \nu}{\partial \sigma}", r"Se^{-qT}N'(d_1)\sqrt{T}\frac{d_1 d_2}{\sigma}"],
]

HTML_ref_1 = Environment().from_string(ref_template_1).render(output_data=ref_data_1)
print HTML_ref_1


# --------------------------------------------------------------------------------------------------------
ref_template_2 = """
<table id="ref_2">
	{% for x in output_data %}
	<tr>
		<td>\[{{x[0]}}\]</td>
	</tr>
	{% endfor %}
</table>
"""

ref_data_2 = [
	[r"\frac{\partial V}{\partial t} + rS\frac{\partial V}{\partial S} + \frac{1}{2}\sigma^2S^2\frac{\partial^2 V}{\partial S^2}=rV"],
	[r"d_1=\frac{\log(S/K) + (r-q +\sigma^2/2)T}{\sigma \sqrt{T}}"],
	[r"d_2=\frac{\log(S/K) + (r-q -\sigma^2/2)T}{\sigma \sqrt{T}}=d_1 - \sigma \sqrt{T - t}"],
	[r"N(x)=\frac{1}{\sqrt{2\pi}}\int_{-\infty}^{x} e^{-\frac{t^{2}}{2}}dt"],
	[r"N'(x)=\frac{1}{\sqrt{2\pi}}e^{-\frac{x^{2}}{2}}"]
]

HTML_ref_2 = Environment().from_string(ref_template_2).render(output_data=ref_data_2)
print HTML_ref_2



# --------------------------------------------------------------------------------------------------------
viz_template = """
<div id="viz2D"></div>
<div id="viz3D"></div>
"""

HTML_viz = viz_template

status_template = """
<p id="status">Status: Missing input</p>
"""

HTML_status = status_template

# --------------------------------------------------------------------------------------------------------
start_table_div = """
<div class="display_like_table">
"""
start_row_div = """
<div class="display_like_row">
"""
start_cell_div = """
<div class="display_like_cell">
"""
end_div = """
</div>
"""


# --------------------------------------------------------------------------------------------------------
HTML_content = \
	title + \
	start_table_div + \
		start_row_div + \
			start_cell_div + HTML_pre_input + end_div + \
			start_cell_div + HTML_input + end_div  + \
		end_div + \
		start_row_div + \
			start_cell_div + ' ' + end_div + \
			start_cell_div + HTML_status + end_div  + \
		end_div + \
		start_row_div + \
			start_cell_div + HTML_output + end_div + \
			start_cell_div + HTML_viz	 + end_div  + \
		end_div + \
	end_div + \
	HTML_ref_1 + \
	HTML_ref_2


paperclip.copy(HTML_content)



