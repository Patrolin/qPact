let Q=new function(){'use strict'
let e=this,t=window,n=void 0,r=null,o=!0
e.q=function(e,t=n){return e instanceof RegExp?u(document,e,t):i(e,t)}
function i(t,n){if(t instanceof Node)return c(t,n)
if(t instanceof Array)return c(t.map(t=>e.q(t)),n)
let r=document.createElement('template')
r.innerHTML=t
let o=r.content.childNodes
return c(1===o.length?o[0]:[...o],n)}function c(e,t){return t===n?e:Array(t).fill().map(()=>l(e))}function l(e){return e instanceof Node?e.cloneNode(o):e.map(l)}Node.prototype.Q=function(e,t=n){let o,i=this,c={}
for(;(o=i.firstChild)!==r;){i.removeChild(o)
o.id&&(c[o.id]=o)}if(e===r)return[]
let l=i.q(e,t)
for(let e of i.querySelectorAll('[id]'))e.id in c&&!e.childNodes.length&&e.parentNode.replaceChild(c[e.id],e)
return l instanceof Node?l:l.map(e=>e.id?c[e.id]:e)}
Node.prototype.q=function(e,t=n){return e instanceof RegExp?u(this,e,t):f(this,i(e,t))}
function u(e,t,n){if(t.global)return c([...e.querySelectorAll(t.source)],n)
let o=e.querySelector(t.source)
return o?c(o,n):r}function f(e,t){return t instanceof Node?e.appendChild(t):t.map(t=>f(e,t))}Array.prototype.Q=function(e,t=n){return this.map(n=>n.Q(e,t))}
Array.prototype.q=function(e,t=n){return e instanceof RegExp?c(e.global?a(this,e.source):d(this,e.source),t):this.map(n=>n.q(e,t))}
function a(e,t){return e.map(e=>e instanceof Node?e.matches(t)?e:r:a(e,t)).filter(e=>e!==r)}function d(e,t){return e.flat(1/0).find(e=>e.matches(t))}for(let n in e)n in t?e.isNative(t[n])||console.warn(`Q: ${n} is already defined`):t[n]=e[n]}