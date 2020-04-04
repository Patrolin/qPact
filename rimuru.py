from pprint import pprint
from itertools import chain, combinations, permutations, count
from functools import reduce
from collections import defaultdict, Counter
from time import time, sleep
from random import random

def powerset(iterable, start=0, stop=None):
	"powerset([1,2,3]) --> () (1,) (2,) (3,) (1,2) (1,3) (2,3) (1,2,3)"
	s = list(iterable)
	if stop == None:
		stop = len(s) + 1
	return chain.from_iterable(combinations(s, r) for r in range(start, stop))

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
css_str = open('dist/blackhole.css').read()
css = defaultdict(dict)
for sp in css_str.replace('\n', '').split('}')[:-1]:
	s, ps = sp.split('{')
	s = s.strip()
	if s:
		for p in ps.split(';'):
			k, _, v = p.partition(':')
			k, v = k.strip(), v.strip()
			if k and v:
				css[(s, )][k] = v

def emitter(inp, o=1):
	# -o0
	def stringify(css):
		def minify_selectors(ss):
			return ','.join(ss) # todo: use :is() (sometimes)
		
		return ''.join(f'{minify_selectors(ss)}{{{";".join(f"{k}:{v}" for k, v in ps.items())}}}' for ss, ps in css.items())
	
	o0 = stringify(inp)
	print(f' -o0         {len(o0)/len(css_str): 3.2%} {len(o0)}')
	if o == 0:
		return o0
	
	# -o1
	# gravity
	ssc = defaultdict(list)
	for (s, ), ps in inp.items():
		for k, v in ps.items():
			if v:
				ssc[(k, v)].append(s)
	css = defaultdict(dict)
	for (k, v), ss in ssc.items():
		css[tuple(ss)][k] = v
	
	o1 = stringify(css)
	print(f' -o1 {len(o1)/len(o0): 3.2%} {len(o1)/len(css_str): 3.2%} {len(o1)}')
	if o == 1:
		return o1
	
	# -o2
	
	def observe(ks):
		# general relativity
		shelves = defaultdict(set)
		for ss in ks:
			if len(ss) == 1:
				shelves[1].add(ss)
			else:
				for i in range(len(ss)):
					for c in combinations(ss, i):
						shelves[len(ss) - 1].add(c) # if matches multiple stmts
		'''
		print()
		print(reduce(lambda a, b: a * b, ((2**k - 1)**len(v) for k, v in shelves.items())))
		pprint(shelves)
		'''
		# TODO: black hole
		pass
	
	keys = set()
	for ss in css.keys():
		for s in ss:
			keys.add(s)
	
	if o == 2:
		observe((k, ) for k in keys)
		o2 = stringify(css)
		print(f' -o2 {len(o2)/len(o0): 3.2%} {len(o2)/len(css_str): 3.2%} {len(o2)}')
		return o2
	
	# -o3
	# special relativity
	used_by = defaultdict(set)
	for k in keys:
		for ss in css.keys():
			if k in ss:
				used_by[k].add(ss)
	good = []
	evil = {}
	for k, v in used_by.items():
		if len(v) <= 2:
			good.append(k)
		else:
			evil[k] = v
	_used_by = defaultdict(set)
	for s in evil.keys():
		sss = used_by[s]
		for ss in sss:
			for k in powerset(ss, 1):
				if k not in used_by:
					_used_by[k] = sum(not (set(k) - set(_ss)) for _ss in css.keys())
	pprint({k: v for k, v in _used_by.items() if v > 1})
	# TODO: quantum entanglement
	evil_copy = {k: v for k, v in evil.items()}
	shelves = []
	try:
		while True:
			k, v = evil_copy.popitem()
			seen = {k}
			tasks = [k]
			for ss in v:
				for s in ss:
					if s in evil and s not in seen:
						seen.add(s)
						tasks.append(s)
						del evil_copy[s]
			entangled = set()
			for t in tasks:
				entangled |= evil[t]
			shelves.append(entangled)
	except KeyError:
		pass
	'''
	print('\nEVIL')
	pprint(evil)
	print('\nSHELVES')
	pprint(shelves)
	for h in shelves:
		m = 1
		for ss in h: # ;P
			print(len(ss))
			m *= 2**len(ss) - 1
		for i in range(m):
			if i % 256 == 0:
				pass #print(f'{i/(m-1):%}')
		print(f' {m}')
	'''
	for s in shelves:
		observe(s)
	observe((s, ) for s in good)
	o3 = stringify(css)
	print(f' -o3 {len(o3)/len(o0): 3.2%} {len(o3)/len(css_str): 3.2%} {len(o3)}')
	return o3

COLOR = '\033[95m'
for o in (3, ):
	b = emitter(css, o)
