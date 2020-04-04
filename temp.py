from pprint import pprint
from itertools import chain, combinations, permutations, count
from functools import lru_cache
from time import time

def powerset(iterable, start):
	"powerset([1,2,3]) --> () (1,) (2,) (3,) (1,2) (1,3) (2,3) (1,2,3)"
	s = list(iterable)
	return chain.from_iterable(
	    combinations(s, r) for r in range(start,
	                                      len(s) + 1))

@lru_cache()
def groupings(size: int):
	res = set()
	for p in permutations(range(size)):
		for gs in _groupings(size):
			# python sorting magic
			gs = sorted(tuple(sorted(p[i] for i in g)) for g in gs)
			res.add(tuple(gs))
	return res

@lru_cache()
def _groupings(size: int):
	return tuple(__groupings(size))

def __groupings(size: int):
	if size == 1:
		yield ((0, ), )
	else:
		for g in _groupings(size - 1):
			yield ((size - 1, *g[0]), *g[1:])
			yield ((size - 1, ), *g)

for i in count(1):
	a = time()
	gs = groupings(i)
	print(f'+{time()-a:.0f}s')
	gs = sorted(gs)
	print(f'{i}. {len(gs)} {gs}')

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
ss = [sp[0].strip() for sp in css]
ps = [[s.strip() for s in sp[1].split(';')] for sp in css]

def bruteforce():
	sets = [tuple(powerset(p, 1)) for p in ps]
	groups = {}
	for s in sets:
		for g in s:
			groups[g] = []
	pprint(sets)
	pprint(groups)
	
	def out(groups):
		pass
	
	def iter(groups, i):
		if i not in sets:
			out(groups)
		else:
			pass
	
	best = css_str
