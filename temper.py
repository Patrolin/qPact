from pprint import pprint
from itertools import chain, combinations, permutations, count
from functools import lru_cache
from collections import defaultdict
from time import time

def powerset(iterable, start):
	"powerset([1,2,3]) --> () (1,) (2,) (3,) (1,2) (1,3) (2,3) (1,2,3)"
	s = list(iterable)
	return chain.from_iterable(
	    combinations(s, r) for r in range(start,
	                                      len(s) + 1))

@lru_cache()
def groupings(size: int):
	if size == 1:
		return {(0, )}
	res = set()
	c = tuple(combinations(range(size), 2))
	for bits in _groupings(len(c)):
		woo = {}
		for i, b in enumerate(bits):
			if b:
				x, y = c[i]
				if (x in woo) and (y in woo):
					woo[y].update(woo[x])
					for n in woo[x]:
						woo[n] = woo[y]
				elif (x in woo):
					woo[x].add(y)
					woo[y] = woo[x]
				elif (y in woo):
					woo[y].add(x)
					woo[x] = woo[y]
				else:
					woo[x] = woo[y] = {x, y}
		for n in range(size):
			if n not in woo:
				woo[n] = {n}
		
		curr = []
		while woo:
			_, group = woo.popitem()
			curr.append(group)
			for x in group:
				if x in woo:
					del woo[x]
		res.add(tuple(sorted(tuple(sorted(i for i in g)) for g in curr)))
	return res

def _groupings(size: int):
	if size == 1:
		yield (0, )
		yield (1, )
	else:
		for g in _groupings(size - 1):
			yield (0, *g)
			yield (1, *g)

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
