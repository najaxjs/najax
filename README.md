# najax

Fast, flexible, unit-tested jquery-ajax-stye serverside requests.

jQuery ajax is stupid simple. This project provides a lightweight wrapper for the nodejs http request object that enables jquery ajax style syntax when making serverside requests to other webpages in node.js

It features very flexible method overloads to suit various styles, including with jquery style deferreds.

It seamlessly handles ssl and makes some reasonable assumptions based on inputs but as usual everything can be overridden by passing an options object.

## Getting Started
Install the module with: `npm install najax`

```javascript
var najax = require('najax');
najax('http://www.google.com', function(html){ console.log(html); }); // "awesome"
najax('http://www.google.com', { type:'POST' }, function(html){ console.log(html); }); // "awesome"
najax({ url:'http://www.google.com', type:'POST', success: function(html){ console.log(html); }); // "awesome"
najax({ url:'http://www.google.com', type:'POST' }).success(function(resp){}).error(function(err){}); // "awesome"

najax.get, najax.post, najax.put, najax.delete...
```

## Run unit tests
- cd dir
- npm -g install grunt
- npm install
- grunt test

## Examples
_(Coming soon)_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/cowboy/grunt).


## License
Copyright (c) 2012 Alan Clarke  
Licensed under the MIT license.
