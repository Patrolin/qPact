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
// Pact_blackmagic.js 1.0
var pactComponents = {};
function defineComponent(name, Class) {
  try {
    document.querySelector(name);
  } catch (e) {
    throw SyntaxError(`${name} is not a valid css selector`);
  }
  Class.events = getEvents(Class);
  pactComponents[name] = Class;
}
function getEvents(Class, prefix='on'){
  var ClassEvents = new Set();
  var Current = Class;
  for(; Current.name; Current = Object.getPrototypeOf(Current)) {
    var Prototype = Current.prototype;
    for (var key of Reflect.ownKeys(Prototype)) {
      var descriptor = Object.getOwnPropertyDescriptor(Prototype, key);
      if (
        Reflect.has(descriptor, 'value')
        && (key.constructor === String)
        && key.startsWith(prefix)
      )
        ClassEvents.add(key.slice(prefix.length));
    }
  }
  return ClassEvents;
}

function* pactWalk(e) {
  // yield elements bottom-up
  for(var c of e.children || [])
    for(var d of pactWalk(c))
      yield d;
  yield e;
}
function pactInit(root){
  var tags = Object.keys(pactComponents).reverse();
  for(var e of pactWalk(root)){
    if(!e.c) {
      var tag = tags.find(t =>
        (e.matches && t.constructor === String) ? e.matches(t) : e === t
      );
      var Class = tag ? pactComponents[tag] : Component;
      Class.init(e);
    }
    if(!e.c.loaded) {
      e.c.load && e.c.load();
      e.c.loaded = true;
    }
  }
}
function pactUpdate(mutationRecords){
  for(var mr of mutationRecords){
    for(var e of mr.addedNodes)
      pactInit(e);
    for(var f of mr.removedNodes)
      if(f.c){
        f.c.unload && f.c.unload();
        f.c.loaded = false;
      }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  pactInit(document.documentElement);
  var observer = new MutationObserver(pactUpdate);
  observer.observe(document.documentElement, {
    subtree: true,
    childList: true, /* includes Text changes because js is stupid */
  });
});


// Components
class Component {
  static init(e){
    var self = new this;

    self.e = e;
    e.c = self;

    for (var k of this.events)
      e.addEventListener(k, self[`on${k}`].bind(self));
  }
  alter(){
    this.e.dispatchEvent(
      new CustomEvent('alter', {
        bubbles: true,
        cancelable: true,
      })
    );
  }
  get disabled(){
    return this.e.hasAttribute('disabled');
  }
  set disabled(value){
    if(value)
      this.e.setAttribute('disabled', '');
    else
      this.e.removeAttribute('disabled');
    for(var e of this.e.children)
      e.c.disabled = value;
  }
}
defineComponent('*', Component);

class InputComponent extends Component {
  oninput(ev){
    this.alter();
  }
}
defineComponent('input', InputComponent);
// blackmagic.js 1.0
function setStyle(e, style) {
  for (var k in style)
    Reflect.set(e.style, k, style[k]);
}

// Padding
function padRight(n){
  var res = [0];
  for(var i = 0; i < n-1; ++i)
    res.push(0);
  //res.push(1);
  return res;
}
function padBetween(n){
  var res = [0];
  for(var i = 0; i < n-1; ++i)
    res.push(1/n);
  //res.push(1/n);
  return res;
}
function padAround(n){
  var res = [1/n / 2];
  for(var i = 0; i < n-1; ++i)
    res.push(1/n);
  //res.push(1/n / 2);
  return res;
}
function padEvenly(n){
  var res = [1/(n+1)];
  for(var i = 0; i < n-1; ++i)
    res.push(1/(n+1));
  //res.push(1/(n+1));
  return res;
}
function padOutside(n){
  var res = [0.5];
  for(var i = 0; i < n-1; ++i)
    res.push(0);
  //res.push(0.5);
  return res;
}
function padLeft(n){
  var res = [1];
  for(var i = 0; i < n-1; ++i)
    res.push(0);
  //res.push(0);
  return res;
}

// Components
var sacrificeGoat = (ev) => {
  console.log('render:');
  document.body.c.size = {
    top: 0,
    left: 0,
    width: document.documentElement.clientWidth / window.devicePixelRatio,
    height: document.documentElement.clientHeight / window.devicePixelRatio,
  };
  document.body.c.render();
};

var fitText;
document.addEventListener('DOMContentLoaded', () => {
  var style = document.createElement('style');
  style.id = 'blackMagic';
  document.head.append(style);

  style.sheet.insertRule(`
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      border: none;
      outline: 1px solid;
      max-width: 100%;
      font-family: Helvetica, sans-serif;
      transition: opacity 0s;
      /*transition: top, left, width, height .5s ease-in-out;*/ /* chrome doesn't want to animate top, left */
    }
  `);
  style.sheet.insertRule(`
    ::placeholder {
      color: #bbbbbb;
    }
  `);
  style.sheet.insertRule(`
    :focus::placeholder {
      color: #dddddd;
    }
  `);
  style.sheet.insertRule(`
    html, body {
      width: 100%;
      height: 100%;
      background: #eeeeee;
      overflow-x: hidden;
    }
  `);
  style.sheet.insertRule(`
    [cHeight] {
      overflow: hidden auto;
    }
  `);
  style.sheet.insertRule(`
    b, em, i, s, text, p, input[type="text"], input[type="password"], output, label {
      background: #eeeeee;
    }
  `)
  style.sheet.insertRule(`
    b, em, i, s, text, p, input, output {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      text-align: center; /* input is dumb */
      outline: none;
    }
  `);
  style.sheet.insertRule(`
    [nooutline] {
      outline: none;
    }
  `);
  style.sheet.insertRule(`
    [bold] {
      font-weight: bold;
    }
  `);
  style.sheet.insertRule(`
  input[type="text"], input[type="password"] {
      outline: 1px solid;
    }
  `);
  style.sheet.insertRule(`
    [disabled] {
      display: none;
    }
  `);
  style.sheet.insertRule(`
    [blur] {
      filter: opacity(50%) blur(4px);
    }
  `);

  var ctx = document.createElement('canvas').getContext('2d');
  fitText = function fitText(e, size, contentSize=undefined) {
    if (contentSize == undefined) contentSize = size;
    var text = e.getAttribute('dvalue')
      || e.value
      || e.c.textContent
      || e.placeholder
      || '0';

    var style = getComputedStyle(e);
    ctx.font = `1px ${style.fontFamily}`;
    var lines = text.split('\n');
    var width = Math.max(...lines.map(line => {
      var m = ctx.measureText(line);
      return 1.8 + Math.max(m.width, m.actualBoundingBoxRight - m.actualBoundingBoxLeft); // what the fuck?
    }));

    var maxHeightSize = contentSize.height;
    var maxWidthSize = contentSize.width / width;
    setStyle(e, {
      fontSize: `${Math.min(maxHeightSize, maxWidthSize) * devicePixelRatio}px`,
      lineHeight: `${size.height / lines.length * devicePixelRatio}px`,
    });
  };

  sacrificeGoat();
  window.addEventListener('resize', sacrificeGoat);
});

Component_ = Component;
Component = class Component extends Component_ {
  load(){
    if(this.e.localName && this.e.hasAttribute('disabled')) this.e.style.opacity = 0;
    this.disabledAnimation = null;
  }
  get textContent(){
    var res = '';
    if(this.e.textContent){
      for(var d of this.e.childNodes){
        switch(d.constructor){
          case Text:
            res += d.textContent;
            break;
          case HTMLBRElement:
            res += '\n';
            break;
          default:
            res += d.c.textContent;
            break;
        }
      }
    };
    return res;
  }
  get scroll(){
    return this.e.scrollTop;
  }
  set scroll(x){
    this.e.scrollTop = x;
  }
  get scrollMax(){
    return this.e.scrollHeight - this.e.clientHeight;
  }
  set disabled(value) {
    super.disabled = value;
    if(this.disabledAnimation != null) {
      clearInterval(this.disabledAnimation[0]);
      this.disabledAnimation = null;
    }
    if(value)
      this.e.style.opacity = 0;
    else
      this.disabledAnimation = [
        setInterval(function(){
          const DURATION = 1/Math.E;
          var d = new Date;
          var t = (d-this.disabledAnimation[1]) / 1000;
          if(t < DURATION){
            this.e.style.opacity = (t / DURATION);
          } else{
            this.e.style.opacity = 1;
            clearInterval(this.disabledAnimation[0]);
            this.disabledAnimation = null;
          }
        }.bind(this), 33),
        new Date
      ];
  }

  render() {
    var children = this.getRenderChildren();
    var size = this.size;
    var contentSize = this.contentSize(children.length, size);
    this.renderColumn(children, size, contentSize);
  }
  getRenderChildren(){
    return [...this.e.children].filter((x) => getComputedStyle(x).display !== 'none');
  }
  contentSize(n, size) {
    return this.shouldRenderPadding(n)
      ? this.padSize(size)
      : { ...size, top: 0, left: 0 };
  }
  shouldRenderPadding(n=2){
    return (n > 1 || this.e.hasAttribute('padding'))
      && !this.e.hasAttribute('nopadding');
  }
  padSize(size) {
    // f(0) = MAX
    // f(X) = Y
    // f(inf) = MIN
    const MIN = 0, MAX = 0.5;
    const W = 500, Y = 0.8;

    var { width, height } = size;
    var k = 1 - MAX + (MAX - MIN) * Math.exp((Math.log(Y) / W) * width);

    return {
      top: 0,
      left: 0,
      width: k * width,
      height: k * height,
    };
  }

  renderText(size, contentSize=undefined){
    fitText(this.e, size, contentSize);
  }
  renderColumn(children, size, contentSize=undefined){
    if(contentSize === undefined) contentSize = { ...size, top: 0, left: 0 };
    var cHeight = this.e.getAttribute('cHeight');
    var heights = this.getRenderLine(children, contentSize.height, 'height', cHeight);

    var paddingWidth = size.width-contentSize.width;
    var paddingHeight = size.height-contentSize.height;
    var paddings = this.getRenderPaddings(children.length);

    var reverse = this.e.hasAttribute('reverse'); // TODO(): browsers are dumb and don't know how to make a scrollbar
    var top = 0;
    var left = 0.5*paddingWidth;
    var width = contentSize.width;
    var height;
    for(var i = 0; i < children.length; ++i){
      if(cHeight === null)
        top += paddings[i]*paddingHeight;
      height = heights[i];
      children[i].c.renderChild({ top, left, width, height }, { bottom: reverse, right: false });
      top += height;
    }
  }
  renderRow(children, size, contentSize=undefined){
    if(contentSize) contentSize = { ...size, top: 0, left: 0 };
    var cWidth = this.e.getAttribute('cWidth');
    var widths = this.getRenderLine(children, contentSize.width, 'width', cWidth);

    var paddingWidth = size.width-contentSize.width;
    var paddingHeight = size.height-contentSize.height;
    var paddings = this.getRenderPaddings(children.length);

    var reverse = this.e.hasAttribute('reverse');
    var top = 0.5*paddingHeight;
    var left = 0;
    var width;
    var height = contentSize.height;
    for(var i = 0; i < children.length; ++i){
      if(cWidth === null)
        left += paddings[i]*paddingWidth;
      width = widths[i];
      children[i].c.renderChild({ top, left, width, height }, { bottom: false, right: reverse });
      left += width;
    }
  }
  renderStack(children, size, contentSize){
    if(contentSize) contentSize = { ...size, top: 0, left: 0 };

    var paddingWidth = size.width-contentSize.width;
    var paddingHeight = size.height-contentSize.height;

    var top = 0.5*paddingHeight;
    var left = 0.5*paddingWidth;
    var width = contentSize.width;
    var height = contentSize.height;
    for(var f of children)
      if(!f.hasAttribute('css'))
        f.c.renderChild({ top, left, width, height });
  }

  getRenderLine(children, contentMain, attribute, cMain){
    if(cMain !== null)
      return children.map(x => +cMain);

    var F = 0;
    var mains = [];
    var rigidContentMain = 0;
    for(var e of children){
      var currMain = e.getAttribute(attribute);
      if(currMain === null){
        var f = +e.getAttribute('f') || 1;
        F -= f;
        currMain = -f;
      } else{
        currMain = +currMain;
        rigidContentMain += currMain;
      }
      mains.push(currMain);
    }
    var flexContentMain = contentMain - rigidContentMain;
    return mains.map(currMain => currMain >= 0 ? currMain : currMain/F * flexContentMain);
  }
  getRenderPaddings(n){
    switch(this.e.getAttribute('pad') || 'evenly'){
      case 'right':
        return padRight(n);
      case 'between':
        return padBetween(n);
      case 'around':
        return padAround(n);
      case 'evenly':
        return padEvenly(n);
      case 'outside':
        return padOutside(n);
      case 'left':
        return padLeft(n);
      default:
        throw new TypeError(`pad expected type ("right" | "between" | "around" | "evenly" | "outside" | "left"), found ${qDescribe(pad)}`);
    }
  }
  renderChild(size, options = { bottom: false, right: false }) {
    var { top, left, width, height } = size;
    var { bottom, right } = options;

    setStyle(this.e, {
      position: 'absolute',
      top: '',
      left: '',
      bottom: '',
      right: '',
      [bottom ? 'bottom' : 'top']: `${top * window.devicePixelRatio}px`,
      [right ? 'right' : 'left']: `${left * window.devicePixelRatio}px`,
      width: `${width * window.devicePixelRatio}px`,
      height: `${height * window.devicePixelRatio}px`,
      outlineRadius: `${this.getRenderBorderRadius() * width * window.devicePixelRatio}px`,
    });

    this.size = size;
    this.render();
  }

  getRenderBorderRadius(){
    return +(this.e.getAttribute('br') || 0);
  }
};
defineComponent('*', Component);

class BodyComponent extends Component {
  getRenderChildren(){
    return [this.e.q(/app/)];
  }
}
defineComponent('body', BodyComponent);

class RowComponent extends Component {
  render(){
    var children = this.getRenderChildren();
    var size = this.size;
    var contentSize = this.contentSize(children.length, size);
    this.renderRow(children, size, contentSize);
  }
}
defineComponent('row', RowComponent);

class StackComponent extends Component {
  render(){
    var children = this.getRenderChildren();
    var size = this.size;
    var contentSize = this.contentSize(2, size);
    this.renderStack(children, size, contentSize);
  }
}
defineComponent('stack', StackComponent);

class TextComponent extends Component {
  render(){
    var size = this.size;
    var contentSize = this.contentSize(2, size);
    this.renderText(this.size, contentSize);
  }
}
defineComponent('text, output, b, em, i, s', TextComponent);

InputComponent = class InputComponent extends Component {
  render(){
    var size = this.size;
    var contentSize = this.contentSize(2, size);
    this.renderText(size, contentSize);
  }
  onfocus(){
    this.e.reportValidity();
  }
  oninput(ev){
    this.alter();
    this.render();
  }
  get validity(){
    var validity = this.e.validity;
    return !(validity.badInput
    //|| validity.customError // custom errors are handled by parents
    || validity.patternMismatch
    || validity.rangeOverflow
    || validity.rangeUnderflow
    || validity.stepMismatch
    || validity.tooLong
    || validity.tooShort
    || validity.typeMismatch
    //|| validity.valid // same as e.checkValidity()
    || validity.valueMissing);
  }
  set validity(value){
    this.e.setCustomValidity(value);
  }
};
delete pactComponents['input'];
defineComponent('input', InputComponent);

class PasswordComponent extends InputComponent {
  load(){
    super.load();
    if(!this.e.hasAttribute('minlength'))
      this.e.minLength = 8;
  }
}
defineComponent('input[type="password"]', PasswordComponent);

class ButtonComponent extends InputComponent {
  onclick(){
    this.alter();
  }
}
defineComponent('button, input[type="button"], input[type="submit"]', ButtonComponent);
