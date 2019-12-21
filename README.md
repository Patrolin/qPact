# qPact

technically does not work!

# q

### [Creating elements](#creating-elements)

### [Appending elements](#appending-elements)

### [Searching for elements](#searching-for-elements)

### [Replacing elements](#replacing-elements)

## Demo

```js
var table = q(/body/).Q("<table>"); // replace contents of body
var rows = table.q("<tr>", 3); // add content to table
var items = rows.q("<td>", 4); // add content to each row
items.forEach((row, r) => {
	row.forEach((td, c) => {
		td.q(String(4 * r + c));
	});
});
```

Go to https://patrolin.github.io/qPact/ and press F12 to try it out.

## Creating elements

```js
var a = q("Hello, world."); // same as new Text('Hello, world.');
q(a); // returns original a
q(a, 1); // creates one copy of a
q(a, 3); // creates three copies of a
q("some <div> html"); // see below
```

same as

```js
var a = new Text("Hello, world.");
a;
a.cloneNode(true);
Array(3)
	.fill(0)
	.map(() => {
		a.cloneNode(true);
	});
var div = document.createElement("div");
div.appendChild(new Text(" html"));
[new Text("some "), div];
```

## Appending elements

```js
var body = document.body;
body.q("foo"); // same as body.appendChild(new Text('foo'));
var p = q("<p>"); // create a Node
p.q(["Lorem", "ipsum"]); // append some text
body.q(p); // append a node
```

would be the same as

```js
var body = document.body;
body.appendChild(new Text("foo"));
var p = document.createElement("p");
p.appendChild(new Text("Lorem"));
p.appendChild(new Text("ipsum"));
body.appendChild(p);
```

which would be the same as

```js
var body = document.body;
body.q("foo");
body.q("<p>").q("Loremipsum");
```

## Searching for elements

q uses [css selectors](https://www.w3schools.com/cssref/css_selectors.asp)

```js
var body = q(/body/); // same as document.querySelector('body');
var buttons = body.q(`
	<button>A</button>
	<button disabled>B</button>
	<button disabled>C</button>`);
```

note that html is [somewhat whitespace sensitive by default](https://www.w3schools.com/cssref/pr_text_white-space.asp)

```js
var button = buttons.q(/:not([disabled])/); // gets the first button without a disabled attribute
var buttonsSearch = body.q(/button/g); // same as [...document.querySelectorAll('body button')];
var disabledButtons = buttonsSearch.q(/[disabled]/g);
// further filters buttonsSearch to only keep buttons with a disabled attribute
```

## Replacing elements

```js
var body = document.body;
var buttons = body.Q([
	"<button>A</button>",
	"<button disabled>B</button>",
	"<button disabled>C</button>",
]);
// replaces contents of body with three buttons (without the whitespace this time);
```

Now you can try out the [demo](#demo) at the top!
