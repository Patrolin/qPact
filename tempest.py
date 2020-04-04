from pprint import pprint
from itertools import chain, combinations, permutations, count
from collections import defaultdict
from time import time, sleep

def powerset(iterable, start):
	"powerset([1,2,3]) --> () (1,) (2,) (3,) (1,2) (1,3) (2,3) (1,2,3)"
	s = list(iterable)
	return chain.from_iterable(combinations(s, r) for r in range(start, len(s) + 1))

def groupings(size: int):
	if size == 1:
		yield ([
		    0,
		], )
	else:
		for gs in groupings(size - 1):
			for i in range(len(gs)):
				curr = tuple(list(g) for g in gs)
				curr[i].append(size - 1)
				yield curr
			yield ([
			    size - 1,
			], *gs)

# one selector per statement
css_str = '''
[full]{
	height:100%;
	width:100%
}
[foo]{
	height:100%;
	color:red
}
[wide]{
	width:100%
}
'''
css = [sp.split('{') for sp in css_str.split('}')[:-1]]
css = {sp[0].strip(): sorted([s.strip() for s in sp[1].split(';')]) for sp in css}

def minify():
	full = {}
	for s, vs in css.items():
		for p in powerset(vs, 1):
			full[';'.join(p)] = []
	shared = []
	for s, vs in css.items():
		if len(vs) == 1:
			full[';'.join(vs)].append(s)
		else:
			shared.append((s, vs))
	
	def bruteforce(l):
		if len(l) == 0:
			# copy.deepcopy() is 10x slower
			yield {k: list(v) for k, v in full.items()}
		else:
			s, vs = l[0]
			for gs in groupings(len(vs)):
				res = [(';'.join(vs[i] for i in g), s) for g in gs]
				for m in bruteforce(l[1:]):
					for a, b in res:
						m[a].append(b)
					yield m
	
	def minify_selectors(ss):
		return ','.join(ss) # todo: use :is() (sometimes)
	
	best = css_str
	for m in bruteforce(shared):
		curr = ''
		for vs, ss in m.items():
			if ss:
				curr += f'{minify_selectors(ss)}{{{vs}}}'
		print('Curr:', f'{len(curr): 3}/{len(best): 3}', curr)
		if len(curr) < len(best):
			best = curr
	return best

b = minify()
COLOR = '\033[95m'
print()
print(f'{COLOR}  Res: {len(b)/len(css_str):.2%} {b}')
