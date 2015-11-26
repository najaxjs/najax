/* globals it */
var chai = require('chai')
var expect = chai.expect

var Tally = function (num) {
  this.num = num
  this.mark = expect(num).checks()
}

Tally.prototype.finish = function () {
  var _this = this
  it('should have run ' + this.num + ' tests', function () {
    _this.mark.getCount().should.equal(_this.num)
  })
  _this.mark.setCount(0)
}

module.exports = Tally
