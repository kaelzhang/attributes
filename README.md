# attributes

> Apply flavored getter and setter to objects.

## Getting Started
Before anything taking its part, you should install [node](http://nodejs.org) and "cortex".

#### Install Node

Visit [http://nodejs.org](http://nodejs.org), download and install the proper version of nodejs.

#### Install Cortex

    # maybe you should use `sudo`
    npm install -g cortex

## Using attributes In Your Project

First, install 'attributes' directly with `cortex install` (recommended)
	
	cortex install attributes --save
	
or, you could update your package.json manually
    
    dependencies: {
        'attributes': '<version-you-want>'
    }
    
and install dependencies
	
	cortex install
    
Then, use `require` method in your module
    
    var attributes = require('attributes');
    
Finally, start cortex server
    
    cortex server
    
Then cortex will care all the rest.


## API Documentation

### attributes: constructor
': constructor' means the `module.exports` of module 'attributes' is a constructor that we should use it with the `new` keyword

	new attributes(options)
	
#### options
- options.name {String}



### attributes.\<method-name\>(arguments)
Means this is a static method of `module.exports`

#### arguments
// arguments description here

### .\<method-name\>(arguments)
Mean this is a method of the instance

#### arguments
// arguments description here