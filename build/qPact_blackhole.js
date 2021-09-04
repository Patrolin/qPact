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
// Pact_blackhole.js 1.0
class Component extends HTMLElement {
  constructor() {
    super();
    let self = this;
    let Class = self.constructor;
    self.state = { ...Class.state };
    for (let k of Class.events) {
      self.addEventListener(k.slice(2), (e) => self[k].call(self, e));
    }
  }
  async connectedCallback() {
    let self = this;
    try {
      await self.load();
    } catch (e) {
      console.error(self, e);
    }
  }
  async disconnectedCallback() {
    let self = this;
    try {
      await self.unload();
    } catch (e) {
      console.error(self, e);
    }
  }
  load() {}
  unload() {}
  alter() {
    this.dispatchEvent(
      new CustomEvent('alter', {
        bubbles: 1,
        cancelable: 1,
      })
    );
  }
}
function defineElement(name, Class) {
  try {
    document.createElement(name);
  } catch (e) {
    throw SyntaxError(`${name} is not a valid html element name`);
  }
  if (!/-/.test(name))
    throw SyntaxError("Custom element names must contain '-'");

  let ClassEvents = new Set();
  let Prototype = Class.prototype;
  for (let key of Reflect.ownKeys(Prototype)) {
    let descriptor = Object.getOwnPropertyDescriptor(Prototype, key);
    if (descriptor.value && key.constructor === String && key.startsWith('on'))
      ClassEvents.add(key);
  }
  Class.events = ClassEvents;
  Class.elementName = name;
  customElements.define(name, Class);
  return Class;
}

// Components
class Button extends Component {
  load() {
    this.input = this.q('<button>');
    this.input.onclick = () => {
      this.input.setAttribute('clicked', true);
      setTimeout(() => {
        this.input.setAttribute('clicked', false);
      }, 245);
      this.alter();
    };
    this.value = this.getAttribute('value') ?? '';
  }
  set value(value) {
    this.input.textContent = value;
  }
  get value() {
    return this.input.textContent;
  }
}
defineElement('c-button', Button);

class Radio extends Component{
  load(){
    this.input = this.q(`<input type="radio">`);
    this.onclick = () => {
      this.input.checked = true;
      this.alter();
    };

    this.name = this.getAttribute('name');
    this.value = this.getAttribute('value');
  }
  set name(value){
    this.input.name = value;
  }
  get name(){
    return this.input.name;
  }
  set value(value){
    this.input.checked = value;
  }
  get value(){
    return this.input.checked;
  }
}
defineElement('c-radio', Radio);

class CheckboxInput extends Component {
  load() {
    this.bool = this.q('<input type="checkbox">');
    this.bool.onclick = () => this.alter();
  }
  set value(value) {
    this.bool.checked = +value ? 1 : 0;
  }
  get value() {
    return this.bool.checked ? 1 : 0;
  }
}
defineElement('c-checkboxinput', CheckboxInput);

class NumberInput extends Component {
  load() {
    this.input = this.q('<input type="number">');
    this.input.onblur = () => {
      this.value = this.input.value;
      this.alter();
    };

    this.min = this.getAttribute('min');
    this.max = this.getAttribute('max');
    this.step = this.getAttribute('step');
    this.value = this.getAttribute('value');
  }
  set min(value) {
    this._min = value != null ? +value : -Infinity;
    this.setAttribute('min', value);
    this.input.setAttribute('min', value);
  }
  get min() {
    return this._min;
  }
  set max(value) {
    this._max = value != null ? +value : Infinity;
    this.setAttribute('max', value);
    this.input.setAttribute('max', value);
    this.input.style.width = `${16 * (value != null ? value+'' : '10000').length}px`;
  }
  get max() {
    return this._max;
  }
  set step(value) {
    this._step = value != null ? +value : 1;
    this.setAttribute('step', value);
    this.input.setAttribute('step', value);
  }
  get step() {
    return this._step;
  }
  set value(value) {
    this.input.value = clamp(value, this.min, this.max);
  }
  get value() {
    return +this.input.value;
  }
  onkeydown(e){
    switch(e.key){
      case 'ArrowUp':
        e.preventDefault();
        this.value = Math.floor(this.value/this.step)*this.step + this.step;
        break;
      case 'ArrowDown':
        e.preventDefault();
        this.value = Math.ceil(this.value/this.step)*this.step - this.step;
        break;
    }
  }
}
defineElement('c-numberinput', NumberInput);

class SliderInput extends Component {
  load() {
    this.output = this.q('<output>');
    this.input = this.q('<input type="range">');
    this.min = this.getAttribute('min');
    this.max = this.getAttribute('max');
    this.step = this.getAttribute('step');
    this.input.oninput = () => {
      this.output.Q(this.input.value);
      this.alter();
    };
    this.value = this.getAttribute('value') | 0;
  }
  set min(value) {
    this._min = value != null ? +value : -Infinity;
    this.setAttribute('min', value);
    this.input.setAttribute('min', value);
    this.setWidth();
  }
  get min() {
    return this._min;
  }
  set max(value) {
    this._max = value != null ? +value : Infinity;
    this.setAttribute('max', value);
    this.input.setAttribute('max', value);
    this.setWidth();
  }
  get max() {
    return this._max;
  }
  setWidth(){
    this.input.style.width = `${4 * (this.max - this.min)}px`;
  }
  set step(value) {
    this._step = value != null ? +value : 1;
    this.setAttribute('step', value);
    this.input.setAttribute('step', value);
  }
  get step() {
    return this._step;
  }
  set value(value) {
    this.input.value = clamp(value ?? 0, this.min, this.max);
    this.output.Q(this.input.value);
  }
  get value() {
    return +this.input.value;
  }
}
defineElement('c-sliderinput', SliderInput);

class OptionalNumberInput extends Component {
  load() {
    this.checkbox = this.q('<c-checkboxinput>');
    this.number = this.q(' <c-numberinput>').q(/c-numberinput/);

    this.min = this.getAttribute('min');
    this.max = this.getAttribute('max');
    this.step = this.getAttribute('step');
    this.default = this.getAttribute('default');
    this.value = this.default;
  }
  set min(value) {
    this.number.min = value;
  }
  get min() {
    return +this.number.min;
  }
  set max(value) {
    this.number.max = value;
  }
  get max() {
    return +this.number.max;
  }
  set step(value) {
    this.number.step = value;
  }
  get step() {
    return +this.number.step;
  }
  set default(value) {
    this._default = value != null ? +value : 0;
  }
  get default() {
    return this._default;
  }
  set value(value) {
    this.number.value = clamp(value ?? this.default, this.min, this.max);
    this.checkbox.value = (this.min <= value) && (value <= this.max);
    this.number.setAttribute('disabled', !this.checkbox.value);
  }
  get value() {
    return this.checkbox.value
      ? this.number.value
      : this.default;
  }
  onalter(e = {}) {
    if(e.srcElement === this) return;
    this.number.setAttribute('disabled', !this.checkbox.value);
    e.stopPropagation();
    this.alter();
  }
}
defineElement(
  'c-optionalnumberinput',
  OptionalNumberInput
);
