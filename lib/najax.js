/*
 * najax
 * https://github.com/alanclarke/najax
 *
 * Copyright (c) 2012 Alan Clarke
 * Licensed under the MIT license.
 */

var https   = require('https'),
http        = require('http'),
querystring = require('querystring'),
url         = require('url'),
$           = require('jquery-deferred'),
_           = require('underscore'),
default_settings = { type: 'GET' },
najax       = module.exports = request;


/* set default settings */
module.exports.defaults = function(opts) {
	return _.extend(default_settings, opts);
};

function _parseOptions(options, a, b){
	var args = [], opts = _.extend({}, default_settings); ;
	if (_.isString(options)) { opts.url = options; }
	else { _.extend(opts, options); }
    _.each([a, b], function(fn) {
        if (_.isFunction(fn)) { opts.success = fn; }
    });
    if (!_.isFunction(a)) { _.extend(opts, a); }
	return opts;
}

/* auto rest interface go! */
_.each('get post put delete'.split(' '),function(method){
	najax[method] = module.exports[method] = function(options, a, b) {
		var opts = _parseOptions(options, a, b);
		opts.type = method.toUpperCase();
		return najax(opts);
	};
});

/* main function definition */
function request(options, a, b) {
//OPTIONS
	/* 
		method overloading, can use:
		-function(url, opts, callback) or 
		-function(url, callback)
		-function(opts)
	*/
	if (_.isString(options) || _.isFunction(a)) {
	    return request(_parseOptions(options, a, b));
	}

	var dfd = new $.Deferred(),
	    o = _.extend({}, default_settings, options),
	    l = url.parse(o.url),
	    ssl = l.protocol.indexOf('https') === 0,
	    data = '';

	//DATA
		/* massage request data according to options */
		if(o.data && !o.encoder){
		    o.data  = o.contentType==='json'?JSON.stringify(o.data):querystring.stringify(o.data);
		} else if(o.encoder){
		    o.data = o.encoder(o.data);
		} else {
		    o.data = '';
		}

		/* if get, use querystring method for data */
		if (o.type === 'GET') {
		    l.search = (l.search ? l.search + '&' : ( o.data ? '?'+o.data : '' ));
		}

	/* if get, use querystring method for data */
	options = {
	    host: l.hostname,
	    path: l.pathname + (l.search||''),
	    method: o.type,
	    port: l.port || (ssl? 443 : 80)
	};

		/* set data content type */
		if(o.type!=='GET'){
		    options.headers = {
		        'Content-Type': o.contentType==='json'?'application/json':'application/x-www-form-urlencoded',
		        'Content-Length': o.data ? o.data.length : 0
		    };
		}

//AUTHENTICATION
	/* add authentication to http request */
	if (l.auth) {
	    options.auth = l.auth;
	} else if (o.username && o.password) {
	    options.auth = o.username + ':' + o.password;
	} else if (o.auth){
	    options.auth = o.auth;
	}

	/* apply header overrides */
	_.extend(options.headers, o.headers);
	_.extend(options, _.pick(o, ['auth', 'agent']));

	/* for debugging, method to get options and return */
	if(o.getopts){
		var getopts =  [ssl, options];
		if(o.success){ getopts.push(o.success); }
		if(o.error){ getopts.push(o.error); }
		return getopts;
	}

//REQUEST
	var req = (ssl ? https : http).request(options, function(res) {
	    res.on('data', function(d) {
	        data += d;
	    });
	    
	    res.on('end', function() {
	        if (o.dataType === 'json') { data = JSON.parse(data); }
	        if ( _.isFunction(o.success)) { o.success(data); }
	        dfd.resolve(data);
	    });
	});

//ERROR
	req.on('error', function(e) {
	    if (_.isFunction(o.error)) { o.error(e); }
	    dfd.reject(e);
	});

//SEND DATA
	if (o.type !== 'GET' && o.data) {
	    req.write(o.data + '\n');
	}
	req.end();

//DEFERRED
	dfd.success = dfd.done;
	dfd.error = dfd.fail;
	return dfd;
}