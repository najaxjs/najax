var najax = require('../lib/najax.js');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/



exports['najax'] = {
  setUp: function(done) {
    // setup here
    done();
  },
  'methods': function(test) {
    'get put post delete defaults'.split(' ').forEach(function(m){
      test.ok(typeof najax[m] ==='function', 'must contain method '+m);
    });
      test.done();
  },
  'method overloads': function(test){
    var opts, expected;
    najax.defaults({getopts:true});
    test.expect(4);
    var success = function success(){};
    expected = { host: 'www.example.com', path: '/', method: 'GET', port: 80 };
    
    //function(url, callback)
    opts = najax('http://www.example.com', success);
    test.deepEqual(opts, [false, expected, success], 'results should be get www.example.com:80, path = /', success);

    //function(url, opts, callback)    
    opts = najax('http://www.example.com', { }, success);
    test.deepEqual(opts, [false, expected, success], 'results should be get www.example.com:80, path = /', success);

    //function(opts, callback)    
    opts = najax({url:'http://www.example.com'}, success);
    test.deepEqual(opts, [false, expected, success], 'results should be get www.example.com:80, path = /', success);

    //function(opts)    
    opts = najax({url:'http://www.example.com', success:success});
    test.deepEqual(opts, [false, expected, success], 'results should be get www.example.com:80, path = /', success);
    test.done();
  },
  'url': function(test){

    var opts, expected;
    najax.defaults({getopts:true});
    test.expect(25);

    //standard
    opts = najax('http://www.example.com');
    expected = { host: 'www.example.com', path: '/', method: 'GET', port: 80 };
    test.deepEqual(opts, [false, expected], 'results should be get www.example.com:80, path = /');

    opts = najax({ url:'http://www.example.com' });
    test.deepEqual(opts, [false, expected], 'results should be get www.example.com:80, path = /');

    //ssl
    opts = najax('https://www.example.com');
    expected.port = 443;
    test.deepEqual(opts, [true, expected], 'results should be get www.example.com:80, path = /');

    //port
    opts = najax('http://www.example.com:66');
    expected.port = 66;
    test.deepEqual(opts, [false, expected], 'results should be get www.example.com:66, path = /');

    //path
    opts = najax('http://www.example.com:66/blah');
    expected.path = '/blah';
    test.deepEqual(opts, [false, expected], 'results should be get www.example.com:66, path = /blah');


    'get post put delete'.split(' ').forEach(function(m){
      var headers = false;

      if(m!=='get'){
        headers =  { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': 0 };
      }

      //standard
      opts = najax[m]('http://www.example.com');
      expected = { host: 'www.example.com', path: '/', method: m.toUpperCase(), port: 80 };
      if(headers) { expected.headers = headers; }
      test.deepEqual(opts, [false, expected], 'results should be '+m+' www.example.com:80, path = /');
      
      //ssl
      expected.port = 443;
      opts = najax[m]('https://www.example.com');
      test.deepEqual(opts, [true, expected], 'results should be '+m+' www.example.com:80, path = /');


      //port
      expected.port = 66;
      opts = najax[m]('http://www.example.com:66');
      test.deepEqual(opts, [false, expected], 'results should be '+m+' www.example.com:66, path = /');

      //path
      expected.path = '/blah';
      opts = najax[m]('http://www.example.com:66/blah');
      test.deepEqual(opts, [false, expected], 'results should be '+m+' www.example.com:66, path = /blah');

      //url2
      opts = najax[m]({ url:'http://www.example.com' });
      expected.path = '/';
      expected.port = 80;
      test.deepEqual(opts, [false, expected], 'results should be '+m+' www.example.com:80, path = /');
    });

    test.done();
  }
};
