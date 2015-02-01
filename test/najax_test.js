var najax = require('../lib/najax.js'),
querystring = require('querystring'),
_ = require('underscore'),
chai = require('chai'),
checkmark = require('chai-checkmark'),
Tally = require('./tally'),
expect = chai.expect,
should = chai.should();


chai.use(checkmark);
var testcount = 0;


function withDefaults(also) {
  return _.extend({ headers: {}, rejectUnauthorized: true }, also);
}

describe('methods', function() {
  testcount += 5;

  'get put post delete defaults'.split(' ').forEach(function(m){
    it('should respond to ' + m, function() {
      najax.should.itself.respondTo(m).mark();
    });
  });
});

describe('method overloads', function(next) {
  var opts,
      expected,
      success = function success(){},
      error = function error(){};

  najax.defaults({getopts:true});
  expected = withDefaults({ host: 'www.example.com', path: '/', method: 'GET', port: 80 });

  testcount += 4;

  it('should accept argument order: (url, callback)', function() {
    opts = najax('http://www.example.com', success);
    opts.should.deep.equal([false, expected, false, success, false]).mark();
  });

  it('should accept argument order: (url, opts, callback)', function() {
    opts = najax('http://www.example.com', { }, success);
    opts.should.deep.equal([false, expected, false, success, false]).mark();
  });

  it('should accept argument order: (opts, callback)', function() {
    opts = najax({url:'http://www.example.com'}, success);
    opts.should.deep.equal([false, expected, false, success, false]).mark();
  });

  it('should accept single argument object: (opts)', function() {
    opts = najax({url:'http://www.example.com', success:success, error:error});
    opts.should.deep.equal([false, expected, false, success, error]).mark();
  });
});

describe('url', function(next) {
  var opts,
      expected;

  najax.defaults({getopts:true});
  expected = withDefaults({ host: 'www.example.com', path: '/', method: 'GET', port: 80 });
  //ssl, options, o.data, o.success, o.error];

  testcount += 25;

  it('should accept plain URL', function() {
    opts = najax('http://www.example.com');
    opts.should.deep.equal([false, expected, false, false, false]).mark();
  });

  it('should accept url as property of options object', function() {
    opts = najax({ url:'http://www.example.com' });
    opts.should.deep.equal([false, expected, false, false, false]).mark();
  });

  it('should set port to 443 for https URLs', function() {
    opts = najax('https://www.example.com');
    expected.port = 443;
    opts.should.deep.equal([true, expected, false, false, false]).mark();
  });

  it('should set port to the port in the URL string', function() {
    opts = najax('http://www.example.com:66');
    expected.port = 66;
    opts.should.deep.equal([false, expected, false, false, false]).mark();
  });

  it('should set path to the path in the URL string', function() {
    opts = najax('http://www.example.com:66/blah');
    expected.path = '/blah';
    opts.should.deep.equal([false, expected, false, false, false]).mark();
  });

  'get post put delete'.split(' ').forEach(function(m){
    var headers = false,
        M = m.toUpperCase(),
        expected;

    expected = withDefaults({ host: 'www.example.com', path: '/', method: m.toUpperCase(), port: 80 });

    if(m!=='get'){
      //headers = {'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': 0 };
    }

    it(M + ' should accept plain URL', function() {
      opts = najax[m]('http://www.example.com');
      if (headers) { expected.headers = headers; }
      opts.should.deep.equal([false, expected, false, false, false]).mark();
    });

    it(M + ' should accept url as property of options object', function() {
      opts = najax[m]({ url:'http://www.example.com' });
      expected.path = '/';
      expected.port = 80;
      opts.should.deep.equal([false, expected, false, false, false]).mark();
    });

    it(M + ' should set port to 443 for https URLs', function() {
      expected.port = 443;
      opts = najax[m]('https://www.example.com');
      opts.should.deep.equal([true, expected, false, false, false]).mark();
    });

    it(M + ' should set port to the port in the URL string', function() {
      expected.port = 66;
      opts = najax[m]('http://www.example.com:66');
      opts.should.deep.equal([false, expected, false, false, false]).mark();
    });

    it(M + ' should set path to the path in the URL string', function() {
      expected.path = '/blah';
      opts = najax[m]('http://www.example.com:66/blah');
      opts.should.deep.equal([false, expected, false, false, false]).mark();
    });
  });
});

describe('data', function(next) {
  var opts,
      expected,
      data = {a:1};

  najax.defaults({getopts:true});
  expected = withDefaults({ host: 'www.example.com', path: '/?a=1', method: 'GET', port: 80 });

  testcount += 4;

  it('should encode data passed in options object', function() {
    opts = najax.get('http://www.example.com', { data: data });
    opts.should.deep.equal(opts, [false, expected, 'a=1', false, false ]).mark();
  });

  it('should pass correct headers for x-www-form-urlencoded data', function() {
    expected.path = '/';
    expected.method = 'POST';
    expected.headers = {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8', 'Content-Length': 4 };
    opts = najax.post('http://www.example.com', { data: data});
    opts.should.deep.equal(opts, [false, expected, 'a=1\n', false, false ]).mark();
  });

  it('should pass correct headers for json data', function() {
    expected.headers = {'Content-Type': 'application/json;charset=utf-8', 'Content-Length': 8 };
    opts = najax.post('http://www.example.com', { data: data, contentType:'json' });
    opts.should.deep.equal(opts, [false, expected, '{"a":1}\n', false, false ]).mark();
  });

  it('should pass correct headers for xml data', function() {
    expected.headers = {'Content-Type': 'application/xml;charset=utf-8', 'Content-Length': 8 };
    opts = najax.post('http://www.example.com', { data: JSON.stringify(data), contentType:'xml' });
    opts.should.deep.equal(opts, [false, expected, '{"a":1}\n', false, false ]).mark();
  });
});

describe('tally', function() {
  var tally = expect(testcount).checks();
  it('should have run ' + testcount + ' tests', function() {
    tally.getCount().should.equal(testcount);
  });
});
