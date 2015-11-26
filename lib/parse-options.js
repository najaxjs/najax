var _ = require('lodash')

module.exports = function parseOptions (url, options, callback) {
  var opts = {}
  if (_.isString(url)) {
    opts.url = url
  } else {
    _.extend(opts, url)
  }
  _.each([options, callback], function (fn) {
    if (_.isFunction(fn)) {
      opts.success = fn
    }
  })
  if (!_.isFunction(options)) {
    _.extend(opts, options)
  }
  return opts
}
