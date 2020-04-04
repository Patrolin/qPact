qPact=new function(){var t=-2147483648,e=1e3,n=60*e,i=60*n,a=24*i,s=365.2425*a,r=s/12,l=[].map
LOCALE=navigator.userLanguage||navigator.language||navigator.browserLanguage||navigator.systemLanguage||'en-US'
UI_LOCALE=(new Intl.NumberFormat).resolvedOptions().locale
function*keys(t){for(var e of Reflect.ownKeys(t))yield e}function values(t){return keys(t).map(e=>t[e])}function entries(t){return keys(t).map(e=>[e,t[e]])}function define(t,e,n){for(var i=new Set,a=[t];a.length;i.add(s)){var s=a.shift()
if(i.has(s))throw Error(`Cyclic subclass in ${type(t)}`)
for(var r of s.__subclasses__||[])a.push(r)
for(var[l,o]of e instanceof Array?e:Reflect.ownKeys(e).map(t=>[t,e[t]]))({}).hasOwnProperty.call(s,l)||Object.defineProperty(s,l,n?o:{value:o,configurable:1,writable:1})}}function describe(t){return`${type(t).name}<${t instanceof Constructor?t.name:t}>`}function type(t){return null===t?Null:void 0===t?Undefined:t.constructor}function isInstance(t,e=[],n=[]){function test(e){return e&&t instanceof e}function testMany(t){return t instanceof Array?t.some(t=>test(t)):test(t)}return testMany(e)&&!testMany(n)}function assertInstance(t,e=[],n=[]){function format(t){return t instanceof Array?t.length?t.list(t=>t.name).join('|'):'':''+t.name}if(!isInstance(t,e,n)){var i=format(e),a=format(n)
throw TypeError(`${describe(t)} is not of type ${i}${a&&' - '+a}`)}}function parseIndentation(t){var e=[[]],n=0
for(var i of t.split('\n')){for(var a=0,s=0;'\t'===i[s];++s)a+=1
if(a>n){var r=e[e.length-1]
e.push(r[r.length-1].children)
n=a}else for(;n>a;){e.pop()
n-=1}e[e.length-1].push({value:i.slice(s),children:[]})}return e[0]}class Datetime extends Date{get y(){return this.getFullYear()}set y(t){this.setFullYear(t)}get o(){return this.getMonth()}set o(t){this.setMonth(t)}get d(){return this.getDate()}set d(t){this.setDate(t)}get h(){return this.getHours()}set h(t){this.setHours(t)}get m(){return this.getMinutes()}set m(t){this.setMinutes(t)}get s(){return this.getSeconds()}set s(t){this.setSeconds(t)}get ms(){return this.getMilliseconds()}set ms(t){this.setMilliseconds(t)}constructor(t){if(isInstance(t,Number))super(t)
else{super()
this.modify(t)}}[Symbol.toPrimitive](t){return'string'===t?this.toString():this.valueOf()}valueOf(){return this.getTime()}toString(){return new Intl.DateTimeFormat(LOCALE,{weekday:'long',day:'numeric',month:'long',year:'numeric',hour:'numeric',minute:'numeric',second:'numeric',timeZoneName:'long',...obj}).format(this)}modify(t){isInstance(t,Number)&&(t=`${t}ms`)
if(t){datetime_modify(this,t)
return this}}}var o=[1,'ms',e,'s',n,'m',i,'h',a,'d',r,'o',s]
class TimeInterval{constructor(t){var e=this
e.sign=1
e.ms=e.s=e.m=e.h=e.d=e.o=e.y=0
e.modify(t)}valueOf(){var{y:t,o:l,d:o,h:c,m:d,s:y,ms:p,sign:f}=this
return f*(t*s+l*r+o*a+c*i+d*n+y*e+p)}toString(){return'string!'}modify(t){isInstance(t,Number)&&(t=`${t}ms`)
if(t){var e=this
datetime_modify(e,t)
var n=+e
n*=e.sign=Math.sign(n)
for(var i=0;11>i;i+=2){var a=n%o[i+2]
n-=a
e[o[i+1]]=a/o[i]}e.y=n
return e}}}var c=['sunday','monday','tuesday','wednesday','thursday','friday','saturday']
function datetime_modify(t,e){var n=1
for(var[i,a,s,r,l,o]of e.matchAll(/([\d.]+)([a-z]+)|([a-z]+)([\d.]+)|([+-])/g))if(a){var d=c.indexOf(s)
if(0>d&&s in t)t[s]+=n*a
else{var y=t.getDate(),p=t.getDay()
if(d!=p){y+=n>0?d-p+7:d+p-8
a--}t.setDate(y+7*n*a)}}else l&&r in t?t[r]=+l:o&&(n='+'==o?1:-1)}class Interface extends(null){}class Null extends Interface{static[Symbol.hasInstance](t){return null===t}}class Undefined extends Interface{static[Symbol.hasInstance](t){return void 0===t}}class Constructor extends Interface{static[Symbol.hasInstance](t){return isInstance(t,Function)&&'prototype'in t}}var d=type(function*(){}()),y=Object.getPrototypeOf([].keys()),p=Object.getPrototypeOf((new Set).keys()),f=Object.getPrototypeOf((new Map).keys())
class Iterator extends Interface{static[Symbol.hasInstance](t){return t&&isInstance(t.next,Function)}}define(Iterator,{__subclasses__:[d]})
define(Iterator.prototype,{__subclasses__:[d.prototype,y,p,f]})
class Iterable extends Interface{static[Symbol.hasInstance](t){return t&&isInstance(t[Symbol.iterator],Function)}}define(Iterable,{__subclasses__:[NodeList,Array,Set,Map,String,Iterator]})
define(Iterable.prototype,{__subclasses__:[Object.prototype]})
class AsyncIterable extends Interface{static[Symbol.hasInstance](t){return null!=t&&isInstance(t[Symbol.asyncIterator],Function)}}define(Array.prototype,{Array(t){return t?l.call(this,t):[...this]}})
define(String.prototype,{keys:[].keys})
define(Iterator.prototype,{*keys(){var t=0
for(var e of this)yield t++},values(){return this},*entries(){var t=0
for(var e of this)yield[t++,e]}})
define(Iterable.prototype,{keys(){return keys(this)},values(){return values(this)},entries(){return entries(this)},*map(t){assertInstance(t,Function)
for(var[e,n]of this.entries())yield t(n,e,this)},Array(t){return[...t?this.map(t):this]},Set(t){return new Set(t?this.map(t):this)},Map(t){return new Map(t?this.map(t):this)},Object(t){var e={}
for(var[n,i]of t?this.map(t):this)e[n]=i
return e}})
delete Array.prototype.map
function floordiv(t,e){var n=t/e
return 0>n?Math.ceil(n):Math.floor(n)}function divmod(t,e){return[math.floordiv(t,e),t%e]}function q(t,e){if(t instanceof RegExp)return document.q(t,e)
if(t instanceof Node)return q_multiply(t,e)
if(t instanceof Array)return q_multiply(t.map(t=>q(t)),e)
let n=document.createElement('template')
n.innerHTML=t
let i=n.content.childNodes
return q_multiply(1===i.length?i[0]:[...i],e)}function q_multiply(t,e){function q_clone(t){return t instanceof Node?t.cloneNode(TRUE):t.map(q_clone)}return void 0===e?t:Array(e).fill().map(()=>q_clone(t))}define(Node.prototype,{Q:function(t,e){let n,i=this,a={}
for(;null!==(n=i.firstChild);){i.removeChild(n)
n.id&&(a[n.id]=n)}if(null===t)return[]
let s=i.q(t,e)
for(let t of i.querySelectorAll('[id]'))t.id in a&&!t.childNodes.length&&t.parentNode.replaceChild(a[t.id],t)
return s instanceof Node?s:s.map(t=>t.id?a[t.id]:t)},q:function(t,e){if(t instanceof RegExp){if(t.global)return q_multiply([...this.querySelectorAll(t.source)],e)
let n=this.querySelector(t.source)
return n?q_multiply(n,e):null}return q_Node_append(this,q(t,e))}})
function q_Node_append(t,e){return e instanceof Node?t.appendChild(e):e.map(e=>q_Node_append(t,e))}define(Array.prototype,{Q:function(t,e){return this.map(n=>n.Q(t,e))},q:function(t,e){return t instanceof RegExp?q_multiply(t.global?q_Array_filter(this,t.source):q_Array_find(this,t.source),e):this.map(n=>n.q(t,e))}})
function q_Array_filter(t,e){return t.map(t=>t instanceof Node?t.matches(e)?t:null:q_Array_filter(t,e)).filter(t=>null!==t)}function q_Array_find(t,e){return t.flat(1/0).find(t=>t.matches(e))}var u=(q(/#qPact/)||q(/head/).q('<div id="qPact">')).q("<style>html,\nbody\n\twidth: 100%\n\theight: 100%\n*\n\tbox-sizing: border-box\n\tdisplay: inline-block\n\tposition: relative\n\tpadding: 0\n\tmargin: 0\n\t/* TODO: padding\n\t*/\n\tpointer-events: auto\n\ttext-combine-upright: digits 3\nbody\n\tdisplay: block\n\tmargin: 0\n/* @todo: buttons\n*/\n@mixin flex\n\tdisplay: inline-flex\n\tflex-wrap: wrap\n\t&[items-stretch]\n\t\talign-content: stretch\n\t& > [self-stretch]\n\t\talign-self: stretch\n\n\n@mixin flex-vertical\n\t&[middle]\n\t\tjustify-content: center\n\t&[center]\n\t\talign-content: center\n\t& > [self-center]\n\t\talign-self: center\n\n@mixin flex-horizontal\n\t&[middle]\n\t\talign-content: center\n\t&[center]\n\t\tjustify-content: center\n\t& > [self-middle]\n\t\talign-self: center\n\n\n@mixin flex-upwards\n\t@include flex-vertical\n\tflex-direction: column-reverse\n\t&[up]\n\t\tjustify-content: flex-end\n\t&[down]\n\t\tjustify-content: flex-start\n\t&[left]\n\t\talign-content: flex-end\n\t&[right]\n\t\talign-content: flex-start\n\t& > [self-left]\n\t\talign-self: flex-end\n\t& > [self-right]\n\t\talign-self: flex-start\n\n@mixin flex-downwards\n\t@include flex-vertical\n\tflex-direction: column\n\t&[up]\n\t\tjustify-content: flex-start\n\t&[down]\n\t\tjustify-content: flex-end\n\t&[left]\n\t\talign-content: flex-start\n\t&[right]\n\t\talign-content: flex-end\n\t& > [self-left]\n\t\talign-self: flex-start\n\t& > [self-right]\n\t\talign-self: flex-end\n\n@mixin flex-leftwards\n\t@include flex-horizontal\n\tflex-direction: row-reverse\n\t&[up]\n\t\talign-content: flex-start\n\t&[down]\n\t\talign-content: flex-end\n\t&[left]\n\t\tjustify-content: flex-end\n\t&[right]\n\t\tjustify-content: flex-start\n\t& > [self-up]\n\t\talign-self: flex-end\n\t& > [self-down]\n\t\talign-self: flex-start\n\n@mixin flex-rightwards\n\t@include flex-horizontal\n\tflex-direction: row\n\t&[up]\n\t\talign-content: flex-start\n\t&[down]\n\t\talign-content: flex-end\n\t&[left]\n\t\tjustify-content: flex-start\n\t&[right]\n\t\tjustify-content: flex-end\n\t& > [self-up]\n\t\talign-self: flex-start\n\t& > [self-down]\n\t\talign-self: flex-end\n/* @todo: headers\n*/\n@mixin list\n\tlist-style-position: outside\n\tcounter-reset: list\n\t& > *\n\t\tdisplay: list-item\n\t\tcounter-increment: list\n@mixin stack\n\tposition: relative\n\t& > *\n\t\tposition: absolute\n\t\tleft: 0\n\t\ttop: 0\n\n/* TODO: better absolute positioning */\n@mixin table\n\tdisplay: inline-table\n\tborder-collapse: collapse\n\tborder-spacing: 0\n\t& > *\n\t\tdisplay: table-row\n\t\t& > *\n\t\t\tdisplay: table-cell\n@mixin tooltip\n\tdisplay: none\n\t:hover > &\n\t\tdisplay: inline-block\n\tposition: absolute\n\tleft: 50%\n\ttop: 50%\n\ttransform: translate(-50%, -50%)\n\t&[right]\n\t\tleft: 100%\n\t&[up]\n\t\ttop: 0\n\t&[left]\n\t\tleft: 0\n\t&[down]\n\t\ttop: 100%\n/* @TODO: add triangles\n*/\nalign\n\t@include flex\n\tjustify-content: center\n\talign-content: center\n\talign-items: center\n\ttext-align: center\n\t& > *\n\t\tflex: 0 1 auto\n\t&:not([upwards]):not([leftwards]):not([rightwards])\n\t\t@include flex-downwards\n\n/* TODO: add align spacing\n*/\nflex\n\t@include flex\n\talign-items: stretch\n\t& > *\n\t\tflex: 1 1 0\n\t&:not([upwards]):not([downwards]):not([leftwards])\n\t\t@include flex-rightwards\nlist\n\t@include list\nstack\n\t@include stack\n\t& > *\n\t\tpointer-events: none\ntable, tbody\n\t@include table\n\tborder-collapse: collapse\n\tborder-spacing: 0\ntbody\n\tdisplay: table-row-group\n\ncaption,\n[caption]\n\tdisplay: table-caption\ncol\n\tdisplay: table-column\ncolgroup\n\tdisplay: table-column-group\ntfoot\n\tdisplay: table-footer-group\nthead\n\tdisplay: table-header-group\ntooltip\n\t@include tooltip\n\tfont-weight: bold\n\tfont-size: 0.35em\n\tpadding: 0.2em 0.3em\n\tborder-radius: 0.5em\n[text-left]\n\ttext-align: left\n[text-center]\n\ttext-align: center\n[text-right]\n\ttext-align: right\n[text-justify]\n\ttext-align: justify\n[upwards]\n\t@include flex-upwards\n[downwards]\n\t@include flex-downwards\n[leftwards]\n\t@include flex-leftwards\n[rightwards]\n\t@include flex-rightwards\n\n[no-grow]\n\tflex-grow: 0\n[no-shrink]\n\tflex-shrink: 0\n[no-flex]\n\tflex-grow: 0\n\tflex-shrink: 0\n\n@for $b from 1 to $DEPTH\n\t[flex=\"$b\"]\n\t\tflex: $b\n\t@for $a from 1 to $b\n\t\t[flex=\"$a/$b\"]\n\t\t\tflex: resolve($a/$b)\n[position=\"inside\"]\n\tlist-style-position: inside\n[position=\"outside\"]\n\tlist-style-position: outside\n[type=\"disc\"]\n\tlist-style-type: disc\n[type=\"circle\"]\n\tlist-style-type: circle\n[type=\"square\"]\n\tlist-style-type: square\n[type=\"decimal\"]\n\tlist-style-type: decimal\n[type=\"cjk-decimal\"]\n\tlist-style-type: cjk-decimal\n[type=\"decimal-leading-zero\"]\n\tlist-style-type: decimal-leading-zero\n[type=\"lower-roman\"]\n\tlist-style-type: lower-roman\n[type=\"upper-roman\"]\n\tlist-style-type: upper-roman\n[type=\"lower-greek\"]\n\tlist-style-type: lower-greek\n[type=\"lower-alpha\"]\n\tlist-style-type: lower-alpha\n[type=\"lower-latin\"]\n\tlist-style-type: lower-latin\n[type=\"upper-alpha\"]\n\tlist-style-type: upper-alpha\n[type=\"upper-latin\"]\n\tlist-style-type: upper-latin\n[type=\"arabic-indic\"]\n\tlist-style-type: arabic-indic\n[type=\"armenian\"]\n\tlist-style-type: armenian\n[type=\"bengali\"]\n\tlist-style-type: bengali\n[type=\"cambodian\"]\n\tlist-style-type: cambodian\n[type=\"cjk-earthly-branch\"]\n\tlist-style-type: cjk-earthly-branch\n[type=\"cjk-heavenly-stem\"]\n\tlist-style-type: cjk-heavenly-stem\n[type=\"cjk-ideographic\"]\n\tlist-style-type: cjk-ideographic\n[type=\"devanagari\"]\n\tlist-style-type: devanagari\n[type=\"ethiopic-numeric\"]\n\tlist-style-type: ethiopic-numeric\n[type=\"georgian\"]\n\tlist-style-type: georgian\n[type=\"gujarati\"]\n\tlist-style-type: gujarati\n[type=\"gurmukhi\"]\n\tlist-style-type: gurmukhi\n[type=\"hebrew\"]\n\tlist-style-type: hebrew\n[type=\"hiragana\"]\n\tlist-style-type: hiragana\n[type=\"hiragana-iroha\"]\n\tlist-style-type: hiragana-iroha\n[type=\"japanese-formal\"]\n\tlist-style-type: japanese-formal\n[type=\"japanese-informal\"]\n\tlist-style-type: japanese-informal\n[type=\"kannada\"]\n\tlist-style-type: kannada\n[type=\"katakana\"]\n\tlist-style-type: katakana\n[type=\"katakana-iroha\"]\n\tlist-style-type: katakana-iroha\n[type=\"khmer\"]\n\tlist-style-type: khmer\n[type=\"korean-hangul-formal\"]\n\tlist-style-type: korean-hangul-formal\n[type=\"korean-hanja-formal\"]\n\tlist-style-type: korean-hanja-formal\n[type=\"korean-hanja-informal\"]\n\tlist-style-type: korean-hanja-informal\n[type=\"lao\"]\n\tlist-style-type: lao\n[type=\"lower-armenian\"]\n\tlist-style-type: lower-armenian\n[type=\"malayalam\"]\n\tlist-style-type: malayalam\n[type=\"mongolian\"]\n\tlist-style-type: mongolian\n[type=\"myanmar\"]\n\tlist-style-type: myanmar\n[type=\"oriya\"]\n\tlist-style-type: oriya\n[type=\"persian\"]\n\tlist-style-type: persian\n[type=\"simp-chinese-formal\"]\n\tlist-style-type: simp-chinese-formal\n[type=\"simp-chinese-informal\"]\n\tlist-style-type: simp-chinese-informal\n[type=\"tamil\"]\n\tlist-style-type: tamil\n[type=\"telugu\"]\n\tlist-style-type: telugu\n[type=\"thai\"]\n\tlist-style-type: thai\n[type=\"tibetan\"]\n\tlist-style-type: tibetan\n[type=\"trad-chinese-formal\"]\n\tlist-style-type: trad-chinese-formal\n[type=\"trad-chinese-informal\"]\n\tlist-style-type: trad-chinese-informal\n[type=\"upper-armenian\"]\n\tlist-style-type: upper-armenian\n[type=\"disclosure-open\"]\n\tlist-style-type: disclosure-open\n[type=\"disclosure-closed\"]\n\tlist-style-type: disclosure-closed\nfixed,\n[fixed]\n\tposition: fixed\n\nsticky,\n[sticky]\n\tposition: sticky\nwide,\n[wide]\n\twidth: 100%\n\ntall,\n[tall]\n\theight: 100%\n\nfull,\n[full]\n\tsize: 100%\n\n\n@for $b from 1 to $DEPTH\n\t@for $a from 1 to $b\n\t\t[width=\"$a/$b\"]\n\t\t\twidth: percentage($a/$b)\n\t\t[height=\"$a/$b\"]\n\t\t\theight: percentage($a/$b)\n\t\t[size=\"$a/$b\"]\n\t\t\tsize: percentage($a/$b)\n/* TODO: add writing-mode modifiers\n*/\nblank,\n[blank]\n\tvisibility: hidden\n\narea,\nhead,\nscript,\nstyle,\ndatalist,\nlink,\nparam,\ntitle\nhidden,\n[hidden]\n\tdisplay: none\n")
class Component extends HTMLElement{static set style(t){let e=this.elementName;(u.q(RegExp(`#${e}`))||u.q(`<style id="${e}">`)).innerHTML=`${e}{${t.entries().map(([t,e])=>`${t}:${e}`).Array().join(';')}`}constructor(){super()
let t=this,e=t.constructor
t.state={...e.state}
for(let n of e.events)t.addEventListener(n.slice(2),e=>t[n].call(t,e))}async connectedCallback(){let t=this
try{let e=t.constructor
console.log(describe(e.state.entries().Array()))
for(let[n,i]of e.state.entries())if(t.hasAttribute(n))try{t[n]=t.getAttribute(n)||i}finally{}await t.load()}catch(e){console.error(t,e)}}async disconnectedCallback(){let t=this
try{await t.unload()}catch(e){console.error(t,e)}}load(){}unload(){}alter(){this.dispatchEvent(new CustomEvent('alter',{bubbles:TRUE,cancelable:TRUE}))}}function defineElement(t,e){try{document.createElement(t)}catch(e){throw SyntaxError(`${t} is not a valid html element name`)}if(!/-/.test(t))throw SyntaxError("Custom element name must contain '-'")
let n={...e.state},i=new Set,a=e.prototype
for(let t of Reflect.ownKeys(a)){let e=Object.getOwnPropertyDescriptor(a,t)
if(e.set){e.get||Object.defineProperty(a,t,{...e,get:function(){return this.state[t]}})
void 0===n[t]&&(n[t]=void 0)}else isInstance(t,String)&&t.startsWith('on')&&i.add(t)}e.state=n
e.events=i
e.elementName=t
customElements.define(t,e)
return e}class Clock extends Component{load(){let t=this
t.interval=setInterval(()=>{t.render()},1e3)
t.render()}unload(){clearInterval(this.interval)}render(){this.Q(new Date)}}defineElement('q-clock',Clock)
class Copy extends Component{onclick(){let t=this
t.focus()
let e=t.contentEditable
t.contentEditable=TRUE
document.execCommand('selectAll')
t.contentEditable=e
try{document.execCommand('copy')}catch(e){navigator.clipboard.writeText(t.innerText)}}}defineElement('q-copy',Copy)
class Katex extends Component{init(){if(void 0===global.katex)return new Promise(function(t,e){let n=module.q(/head/)
n.q("<link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.css\" integrity=\"sha384-zB1R0rpPzHqg7Kpt0Aljp8JPLqbXI3bhnPWROx27a9N0Ll6ZP/+DiW/UqRcLbRjq\" crossorigin=\"anonymous\">")
let i=document.createElement('script')
Object.assign(i,{src:'https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.js',integrity:'sha384-y23I5Q6l+B6vatafAwxRu/0oK/79VlbSz7Q9aiSZUvyWYIYsd+qj+o24G5ZU2zJz',crossOrigin:'anonymous'})
i.onload=t
i.onerror=e
n.q(i)})}set value(t){let e=this
t=module.str(t)
e.setAttribute('value',t)
katex.render(e.state.value=t,e,{displayMode:TRUE})}}defineElement('q-katex',Katex)
for(var[m,h]of entries({MIN_INT32:t,keys,values,entries,define,describe,type,isInstance,assertInstance,parseIndentation,Datetime,TimeInterval,GeneratorFunction:d,Iterator,Iterable,AsyncIterable,floordiv,divmod,q,Component,defineElement})){isInstance(h,Function)&&define(h,{name:m})
window.hasOwnProperty(m)||(window[m]=h)}}