let lib=new function(){'use strict'
let t=this,e=window,r=void 0,n=null,i=!0
t.isPrimitive=function(t){return t!==Object(t)}
t.isNative=function(t){return/\[native code\]/.test(t.name)}
t.isBoolean=function(t){return'boolean'==typeof t}
t.isString=function(t){return'string'==typeof t}
t.isNumber=function(t){return'number'==typeof t}
t.MAX_INT32=-(t.MIN_INT32=-2147483648)-1
t.MAX_UINT32=4294967295
t.MAX_INT64=-(t.MIN_INT64=-Math.pow(2,63))-1
t.MAX_UINT64=Math.pow(2,64)-1
t.MAX_INT=-(t.MIN_INT=Number.MIN_SAFE_INTEGER-1)
t.WEEK=7*(t.DAY=24*(t.HOUR=60*(t.MINUTE=60*(t.SECOND=1e3))))
t.MONTH=(t.YEAR=365.2425*t.DAY)/12
t.DateTime=class DateTime extends Date{get y(){this.getFullYear()}set y(t){this.setFullYear(t)}get o(){this.getMonth()}set o(t){this.setMonth(t)}get d(){this.getDate()}set d(t){this.setDate(t)}get h(){this.getHours()}set h(t){this.setHours(t)}get m(){this.getMinutes()}set m(t){this.setMinutes(t)}get s(){this.getSeconds()}set s(t){this.setSeconds(t)}get ms(){this.getMilliseconds()}set ms(t){this.setMilliseconds(t)}constructor(t=""){super()
this.modify(t)}modify(t=""){o(this,t)}format(t){return new Intl.DateTimeFormat(r,{weekday:'long',day:'numeric',month:'long',year:'numeric',hour:'numeric',minute:'numeric',second:'numeric',timeZoneName:'long',...t}).format(this)}}
t.TimeInterval=class{constructor(t){let e=this
e.y=e.o=e.d=e.h=e.m=e.s=e.ms=0
t&&e.modify(t)}valueOf(){let{y:e,o:r,d:n,h:i,m:s,s:o,ms:a}=this
return e*t.YEAR+r*t.MONTH+n*t.DAY+i*t.HOUR+s*t.MINUTE+o*t.SECOND+a}modify(e=""){let r=this
o(r,e)
let n=+r
n*=r.sign=Math.sign(n)
n-=r.ms=n%t.SECOND
n-=r.s=n%t.MINUTE
n-=r.m=n%t.HOUR
n-=r.h=n%t.DAY
n-=r.d=n%t.MONTH
n-=r.o=n%t.YEAR
r.y=n
r.s/=t.SECOND
r.m/=t.MINUTE
r.h/=t.HOUR
r.d/=t.DAY
r.o/=t.MONTH
r.y/=t.YEAR}toString(){let{y:e,o:r,d:n,h:i,m:s,s:o,ms:a,sign:u}=this,l={}
e&&(l.years=e)
r&&(l.months=r)
n&&(l.days=n)
i&&(l.hours=i)
s&&(l.minutes=s)
o&&(l.seconds=o)
a&&(l.milliseconds=a)
return`${['','-','+'][u+1]}${t.items(l).map(([t,e])=>`${e}${e>1?t:t.slice(0,-1)}`).join(' ')}`}}
let s=['sunday','monday','tuesday','wednesday','thursday','friday','saturday']
function o(t,e){let r=1
for(let[n,i,o,a,u,l]of e.matchAll(/(\d+)([a-z]+)|([a-z]+)(\d+)|([+-])/g))if(i){let e=s.indexOf(o)
if(0>e&&o in t)t[o]+=r*i
else{let n=t.getDate(),s=t.getDay()
if(e!=s){n+=r>0?e-s+7:e+s-15
i--}t.setDate(n+7*r*i)}}else u&&a in t?t[a]=+u:l&&(r='+'==l?1:-1)}t.assoc_keys=function(t){let e=t[Symbol.iterator]
if(e){let r='entries'===e.name,n=Array.from(e.call(t))
return[r,$1r?n.map(([t])=>t):n.map((t,e)=>e)]}{let e=[]
for(let r in t)e.push(r)
return[i,e]}}
t.assoc_values=function(t){let e=t[Symbol.iterator]
if(e){let r='entries'===e.name,n=Array.from(e.call(t))
r&&(n=n.map(([t,e])=>e))
return[r,n]}{let e=[]
for(let r in t)e.push(t[r])
return[i,e]}}
t.assoc_items=function(t){let e=t[Symbol.iterator]
if(e){let r='entries'===e.name,n=Array.from(e.call(t))
r||(n=n.map((t,e)=>[e,t]))
return[r,n]}{let e=[]
for(let r in t)e.push([r,t[r]])
return[i,e]}}
t.keys=function(e){return t.assoc_keys(e)[1]}
t.values=function(e){return t.assoc_values(e)[1]}
t.items=function(e){return t.assoc_items(e)[1]}
t.bool=function(e=i){return e&&(t.isPrimitive(e)||e.length)}
t.int=function(e=0){let r=Math.floor(+e)
if(Object.is(r,NaN))throw TypeError(`Cannot convert ${describe(e)} to int`)
if(r<t.MIN_INT||r>t.MAX_INT)throw RangeError(`${describe(e)} must be in range <${t.MIN_INT}, ${t.MAX_INT}>`)
return r}
t.float=function(t=0){if(isNaN(+t))throw TypeError(`Cannot convert ${describe(t)} to float`)
return+t}
t.str=function(e=""){if(t.isPrimitive(e))return e+""
{let[r,n]=assoc_items(e)
return r?`{${n.map(([e,r])=>`${t.isString(e)?`"${e}"`:`${e}`}: ${str(r)}`).join(', ')}}`:`[${n.map(([t,e])=>str(e)).join(', ')}]`}}
t.list=function(e=[]){if(t.isPrimitive(e)&&!t.isString(e))throw TypeError(`Cannot convert ${describe(e)} to list`)
return Array.from(e)}
t.set=function(t=new Set){if(t[Symbol.iterator])return new Set(t)
throw TypeError(`Cannot convert ${describe(t)} to set`)}
t.dict=function(t=new Map){try{return new Map(t instanceof Object?Object.entries(t):'string'==typeof t?value=JSON.parse(t):t)}catch(e){throw TypeError(`Cannot convert ${describe(t)} to map`)}}
t.obj=function(t={}){if(t&&t.letructor===Object)return t
{let e='string'==typeof t?JSON.parse(t):t
if(e[Symbol.iterator]){let t={}
for(let[r,n]of e)t[r]=n
return t}if(e instanceof Object)return e
throw TypeError(`Cannot convert ${describe(t)} to dict`)}}
t.describe=function(t){return`${t!=n?`${t.constructor.name}: `:''}${t}`}
t.matchAll=function(t,e){let r,i=[]
for(;(r=e.exec(t))!==n;)i.push(r)
return i}
t.divmod=function(t,e){let r=t/e
return[0>r?Math.ceil(r):Math.floor(r),t%e]}
for(let r in t)r in e?t.isNative(e[r])||console.warn(`lib: ${r} is already defined`):e[r]=t[r]}