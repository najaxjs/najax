# najax

[![Travis CI](https://travis-ci.org/najaxjs/najax.svg)](https://travis-ci.org/najaxjs/najax)
[![Dependency Status](https://david-dm.org/najaxjs/najax.svg)](https://david-dm.org/najaxjs/najax)
[![devDependency Status](https://david-dm.org/najaxjs/najax/dev-status.svg)](https://david-dm.org/najaxjs/najax#info=devDependencies)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)


jQuery ajax-stye http requests in node

jQuery ajax is stupid simple. This project provides a lightweight wrapper for the nodejs http request object that enables jquery ajax style syntax when making serverside requests to other webpages in node.js

It features very flexible method overloads to suit various styles, including with jquery style deferreds.

It seamlessly handles ssl and makes some reasonable assumptions based on inputs but as usual everything can be overridden by passing an options object.

## Changelog

### 0.3.0

  * switched from underscore to lodash

### 0.2.0

**Breaking changes!**

  * `success` and `error` callback arguments are now in [jQuery.ajax](https://api.jquery.com/jquery.ajax/) order and format.
  * `contentType` must now be the full string, i.e. `application/json`, not just `json`.
  * Undocumented `encoder` option deprecated.  Any object can already override its own `toString()`.
  * CRLF (`\n`) removed from end of POST message body.  It did not match HTTP spec.

## Getting Started
Install the module with: `npm install najax`

```javascript
var najax = $ = require('najax')
najax('http://www.google.com', callback)
najax('http://www.google.com', { type: 'POST' }, callback)
najax({ url: 'http://www.google.com', type: 'POST', success: callback })
najax({ url: 'http://www.google.com', type: 'POST' })
  .success(callback)
  .error(errorHandler)

$.get, $.post, $.put, $.delete...
```

## Run unit tests
- npm install && npm test

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [standardjs](https://github.com/feross/standard).
