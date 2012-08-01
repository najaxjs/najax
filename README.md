# najax

A lightweight wrapper for the nodejs http request object to enable jquery ajax style serverside requests in nodejs

## Getting Started
Install the module with: `npm install najax`

```javascript
var najax = require('najax');
najax('http://www.google.com', function(html){ console.log(html); }); // "awesome"
najax('http://www.google.com', { type:'POST' }, function(html){ console.log(html); }); // "awesome"
najax({ url:'http://www.google.com', type:'POST', success: function(html){ console.log(html); }); // "awesome"
najax({ url:'http://www.google.com', type:'POST').success(function(resp){}).error(function(err){}); // "awesome"

najax.get, najax.post, najax.put, najax.delete...
```

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/cowboy/grunt).

## Release History
_(Nothing yet)_

## License
Copyright (c) 2012 Alan Clarke  
Licensed under the MIT license.
