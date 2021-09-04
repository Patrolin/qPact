# qPact

a library for manipulating DOM Nodes

## q.js

### searching for Elements

```js
q(/input[type="checkbox"]/);
q(/input:checked/g);
```

### creating Nodes

```js
q('<input type="checkbox">');
new Text('<script> XSS-free text');
```

### appending Nodes

```js
q(/#main/).q('<input type="checkbox">');
q(/#main/).Q(new Text('Hello, world!'));
```

### setting boolean attributes on Elements

```js
q(/button/).setAttribute('clicked', true);
q(/button/).setAttribute('clicked', false);
q(/button/).setAttribute('clicked', 'something');
q(/button/).setAttribute('clicked', null);
```

## qPact_blackhole.js

```js
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
```

## qPact_blackmagic.js

no.
