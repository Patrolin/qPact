# qPact

a library for manipulating DOM elements

## q

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

### setting boolean attributes

```js
q(/button/).setAttribute('clicked', true);
q(/button/).setAttribute('clicked', false);
q(/button/).setAttribute('clicked', 'something');
q(/button/).setAttribute('clicked', null);
```

## Pact
