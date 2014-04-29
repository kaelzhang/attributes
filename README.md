# attributes

`attributes` provides mechanisms for validation, setter and getter to objects or constructors.


## API Documentation

### attributes.patch(ctor, attrs)

Patches the attibutes and utility methods to the constructor `ctor`.
    
#### ctor

type `Function | Object`

#### attrs

type `Object`

All keys are **optional**.

key       | type          | description
--------- | ------------- | -------------------------
value     | mixed         | the default value (optional)
setter    | function(v)   | the return value will be the real value to be set. `v` is the original value by user.
getter    | function(v)   | the return value will be the return value of `ins.get(key)` method. `v` is the saved value.
validator | function(v)   | if returns false, the value will not be saved.
readOnly  | boolean       | if `readOnly` is set to `true`, the value will not be able to change.
writeOnce | boolean       | could be changed only once.

#### Examples

To realize how `attributes` works, you might as well read the example below.

```js
function A(){}

attributes.patch(A, {
	a: {
		value: 'AAA',
		setter: function(v){
			return v + '-new';
		},
		validator: function(v){
			return typeof v === 'string';
		},
		getter: function(v){
			return v;
		}
	}
});
```

Then, the instances which created by `new A` will have **FOUR** methods:

### .get(key)

Gets a value by key.

- key `String` the name of a key.

#### returns

If the specified key has a `getter`, the saved value will be passed to the getter as the first parameter, then the returnValue of the getter will be returned by `instance.get(key)`.

For the example above:

```js
new A().get('a'); // returns 'AAA'
```

### .get()

Gets values of all keys.

#### returns

`Object`

Notice that, changing the returned value will not affect the real value.

### .set(key, value)
### .set(keyMap)

Sets a value or a bunch of values.

#### returns

`Boolean` whether the value(s) has been set successfully.

```js
var ins = new A();
ins.set('a', 1); // false, should be a string
ins.set('a', 'B');
ins.get('a'); // 'B-new', cooked by the setter
```


### .addAttr(key, attr=, override=false)

Adds a new key.

- attr `Object` the attribute definition of the key
- override `Boolean` whether should override existing attribute.

### .removeAttr(key)

Removes a key. After this, it will be no longer able to set or get the key.

```js
var ins = new A;
ins.removeAttr('a');
ins.get('a'); // undefined
ins.set('a', 'foo'); // false
```

## Installation

Before anything taking its part, you should install [node](http://nodejs.org) and "cortex".

### Install Cortex

```sh
# maybe you should use `sudo`
npm install -g cortex
```

### Using attributes In Your Project

First, install 'attributes' directly with `cortex install`
    
    cortex install attributes --save
    
Then, use `require` method in your module
    
    var attributes = require('attributes');