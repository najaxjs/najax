var najax = require('../lib/najax.js'),
querystring = require('querystring'),
_ = require('underscore'),
chai = require('chai'),
checkmark = require('chai-checkmark'),
nock = require('nock'),
Tally = require('./tally'),
expect = chai.expect,
should = chai.should();


chai.use(checkmark);
var testcount = 0;


function withDefaults(also) {
  return _.extend({ headers: {}, rejectUnauthorized: true }, also);
}

function createSuccess(done) {
  return function(data, statusText) {
    data.should.equal('Ok');
    statusText.should.equal('success').mark();
    done();
  };
}

function error(e){ throw e; }

describe('methods', function() {
  testcount += 5;

  'get put post delete defaults'.split(' ').forEach(function(m){
    it('should respond to ' + m, function() {
      najax.should.itself.respondTo(m).mark();
    });
  });
});

describe('method overloads', function(next) {
  var scope;

  najax.defaults({ error: error });
  testcount += 4;

  beforeEach(function() {
    scope = nock('http://www.example.com')
            .get('/')
            .reply(200, 'Ok');
  });

  it('should accept argument order: (url, callback)', function(done) {
    najax('http://www.example.com/', createSuccess(done));
  });

  it('should accept argument order: (url, opts, callback)', function(done) {
    najax('http://www.example.com', { }, createSuccess(done));
  });

  it('should accept argument order: (opts, callback)', function(done) {
    najax({url:'http://www.example.com'}, createSuccess(done));
  });

  it('should accept single argument object: (opts)', function(done) {
    najax({url:'http://www.example.com', success:createSuccess(done), error:error});
  });
});

describe('url', function(next) {
  var scope,
      username = 'user',
      password = 'test',
      authString = username + ':' + password,
      encrypted = (new Buffer(authString)).toString('base64');

  najax.defaults({ error: error });
  testcount += 8;

  function mockPlain(method) {
    scope = nock('http://www.example.com')[method]('/')
            .reply(200, 'Ok');
  }

  function mockHttps(method) {
    scope = nock('https://www.example.com')[method]('/')
            .reply(200, 'Ok');
  }

  function mockAuth(method) {
    scope = nock('http://www.example.com')[method]('/')
            .matchHeader('authorization', 'Basic ' + encrypted)
            .reply(200, 'Ok');
  }

  it('should accept plain URL', function(done) {
    mockPlain('get');
    najax('http://www.example.com', createSuccess(done));
  });

  it('should accept url as property of options object', function(done) {
    mockPlain('get');
    najax({ url:'http://www.example.com' }, createSuccess(done));
  });

  it('should parse auth from the url', function(done) {
    mockAuth('get');
    najax({ url:'http://' + authString + '@www.example.com' }, createSuccess(done));
  });

  it('should accept auth as property of options object', function(done) {
    mockAuth('get');
    najax({ url:'http://www.example.com', auth: authString }, createSuccess(done));
  });

  it('should accept username, password as properties of options object', function(done) {
    mockAuth('get');
    najax({ url:'http://www.example.com', username: username, password: password }, createSuccess(done));
  });

  it('should set port to 443 for https URLs', function(done) {
    mockHttps('get');
    najax('https://www.example.com', createSuccess(done));
  });

  it('should set port to the port in the URL string', function(done) {
    scope = nock('http://www.example.com:66')
            .get('/')
            .reply(200, 'Ok');

    najax('http://www.example.com:66', createSuccess(done));
  });

  it('should set path to the path in the URL string', function(done) {
    scope = nock('http://www.example.com:66')
            .get('/blah')
            .reply(200, 'Ok');

    najax('http://www.example.com:66/blah', createSuccess(done));
  });

  testcount += 32;

  'get post put delete'.split(' ').forEach(function(m){
    var M = m.toUpperCase();

    it(M + ' should accept plain URL', function(done) {
      mockPlain(m);
      najax[m]('http://www.example.com', createSuccess(done));
    });

    it(M + ' should accept url as property of options object', function(done) {
      mockPlain(m);
      najax[m]({ url:'http://www.example.com' }, createSuccess(done));
    });

    it(M + ' should parse auth from the url', function(done) {
      mockAuth(m);
      najax[m]({ url:'http://' + authString + '@www.example.com' }, createSuccess(done));
    });

    it(M + ' should accept auth as property of options object', function(done) {
      mockAuth(m);
      najax[m]({ url:'http://www.example.com', auth: authString }, createSuccess(done));
    });

    it(M + ' should accept username, password as properties of options object', function(done) {
      mockAuth(m);
      najax[m]({ url:'http://www.example.com', username: username, password: password }, createSuccess(done));
    });

    it(M + ' should set port to 443 for https URLs', function(done) {
      mockHttps(m);
      najax[m]('https://www.example.com', createSuccess(done));
    });

    it(M + ' should set port to the port in the URL string', function(done) {
      scope = nock('http://www.example.com:66')[m]('/')
              .reply(200, 'Ok');

      najax[m]('http://www.example.com:66', createSuccess(done));
    });

    it(M + ' should set path to the path in the URL string', function(done) {
      scope = nock('http://www.example.com:66')[m]('/blah')
              .reply(200, 'Ok');

      najax[m]('http://www.example.com:66/blah', createSuccess(done));
    });
  });
});

describe('data', function(next) {
  var scope,
      data = { a: 1 },
      encodedData = '?a=1';

  najax.defaults({ error: error });
  testcount += 5;

  it('should encode data passed in options object', function(done) {
    scope = nock('http://www.example.com')
            .get('/' + encodedData)
            .reply(200, 'Ok');

    najax.get('http://www.example.com', { data: data }, createSuccess(done));
  });

  it('should pass correct headers for x-www-form-urlencoded data', function(done) {
    scope = nock('http://www.example.com')
            .post('/')
            .matchHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8')
            .matchHeader('Content-Length', 4)
            .reply(200, 'Ok');

    najax.post('http://www.example.com', { data: data }, createSuccess(done));
  });

  it('should pass correct headers for json data', function(done) {
    scope = nock('http://www.example.com')
            .post('/')
            .matchHeader('Content-Type', 'application/json;charset=utf-8')
            .matchHeader('Content-Length', 8)
            .reply(200, 'Ok');

    najax.post('http://www.example.com', { data: data, contentType:'application/json' }, createSuccess(done));
  });

  it('should pass correct headers for xml data', function(done) {
    scope = nock('http://www.example.com')
            .post('/')
            .matchHeader('Content-Type', 'application/xml;charset=utf-8')
            .matchHeader('Content-Length', 8)
            .reply(200, 'Ok');

    najax.post('http://www.example.com', { data: JSON.stringify(data), contentType:'application/xml' }, createSuccess(done));
  });

  it('should pass custom headers (Cookie)', function(done) {
    var cookie = 'connect.sid=s%3ATESTCOOKIE';

    scope = nock('http://www.example.com')
            .post('/')
            .matchHeader('Content-Type', 'application/xml;charset=utf-8')
            .matchHeader('Content-Length', 8)
            .matchHeader('Cookie', cookie)
            .reply(200, 'Ok');

    najax.post('http://www.example.com', { data: JSON.stringify(data), contentType:'application/xml', headers: {'Cookie': cookie} }, createSuccess(done));
  });
});

describe('tally', function() {
  var tally = expect(testcount).checks();
  it('should have run ' + testcount + ' tests', function() {
    tally.getCount().should.equal(testcount);
  });
});
