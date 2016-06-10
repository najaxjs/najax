var _ = require('lodash')

module.exports = function parseOptions (url, options, callback) {
  var opts = {}
  if (_.isString(url)) {
    opts.url = url
  } else {
    _.extend(opts, url)
  }
  if (_.isFunction(options)) {
    opts.success = options
  } else {
    if (_.isFunction(callback)) opts.success = callback
    _.extend(opts, options)
  }

  // support legacy jquery options.type
  if (!opts.method && opts.type) {
    opts.method = opts.type
  }

  return opts
}
