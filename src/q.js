// q.js 1.7
const MIN_SAFE_INTEGER = Number.MIN_SAFE_INTEGER - 1;
const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER + 1;

function describe(input) {
  return `${input != null ? `${input.constructor.name}: ` : ''}${input}`;
}

function mod(a, b) {
  return ((a%b) + b) % b;
}
function clamp(x, min, max) {
  return Math.min(Math.max(min, x), max);
}

function q(input) {
  if(input == null) return null;
  switch(input.constructor){
    case String:
      var template = document.createElement('template');
      if(!input) return template.content;
      template.innerHTML = input;
      var children = template.content.childNodes;
      return children.length > 1 ? [...children] : children[0];
    case Array:
      return input.map((e) => q(e));
    case RegExp:
      return document.q(input);
    default:
      if(input instanceof Node) return input;
      throw TypeError(
        `input expected type (RegExp | string | Node | Array | null), found ${
          qDescribe(input)
        }`
      );
  }
}

Node.prototype.Q = function (input) {
  var first;
  while ((first = this.firstChild) !== null)
    this.removeChild(first);
  this.q(input);
};
Node.prototype.q = function (input) {
  if(input == null) return null;
  switch(input.constructor){
    case RegExp:
      return input.global
        ? [...this.querySelectorAll(input.source, input)]
        : this.querySelector(input.source, input);
    default:
      var x = q(input);
      if(x instanceof Node)
        this.appendChild(x);
      else if(x.constructor === Array)
        for(var e of x)
          this.appendChild(e);
      return x;
  }
};

Array.prototype.q = function (input) {
  if (!(input instanceof RegExp))
    throw TypeError(`input expected type RegExp, found ${qDescribe(input)}`);
  return input.global
    ? [...this.querySelectorAll(input.source, input)]
    : this.querySelector(input.source, input);
}
Array.prototype.querySelector = function (source, input) {
  var x = null;
  for(var e of this){
    if(e instanceof Node){
      if(e.matches(source))
        x = e;
    }
    else if(e.constructor === Array)
      x = e.querySelector(source, input);
    else
      throw TypeError(`e expected type (Node | Array), found ${qDescribe(x)}`);
    if(x != null) break;
  }
  return x;
}
Array.prototype.querySelectorAll = function (source, input) {
  var x = [];
  for(var e of this){
    if(e instanceof Node){
      if(e.matches(source))
        x.push(e);
    }
    else if(e.constructor === Array)
      x.push(e.querySelectorAll(source, input));
    else
      throw TypeError(`e expected type (Node | Array), found ${qDescribe(x)}`);
  }
  return x;
}

Text.prototype.matches = function () {
  return false;
}

Element.prototype._setAttribute = Element.prototype.setAttribute;
Element.prototype.setAttribute = function (key, input) {
  return (typeof input === 'boolean' || input == null)
    ? input
      ? this._setAttribute(key, '')
      : this.removeAttribute(key)
    : this._setAttribute(key, input);
};
