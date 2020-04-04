from collections import defaultdict

css_str = '''
full, [full]{
	width:100%;
	height:100%
}
foo{
	width:100%;
	color:red;
}
wide, [wide]{
	width:100%
}
'''
# CSS bubbles
# delta between the best case and worst case was 50ms in 2009
syntax = '''
css = (ws) {styleRule atRule}[(ws)] (ws)
	ws = {9 10 12 13}
	styleRule = <(ws) selector[ws] (ws)>[','] '{' {property styleRule atRule}[';'] '}'
		selector = chunk[operator]
			chunk = (tag) ({class id attribute})
				# ns|sel
				class = '.' char[]
				id = '#' char[]
				attribute = '['  ']'
			operator = {ws '>' '+' '~'}
			#<(chunk) (':' pseudoClass) ('::' pseudoElement)>/''
			pseudoClass = char[]/'(' ('(' char[] ')')
			pseudoElement = char[]
		property = ((ws) name (ws) ':' (ws) value (ws))
			name = char[]
			value = char[]
	atRule = '@' identifier (ws args) {';' <'{' css '}'>}
		identifier = char[]
		args = char[]
'''
css = defaultdict(dict)
for stmt in css_str.split('}')[:-1]:
	k, v = stmt.split('{')
	properties = [v.split(';')]
	print(repr(k), repr(v))
#css = {k: v for k, v in (stmt.split('{') for stmt in css_str.split('}')[:-1])}
