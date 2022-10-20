const IndeedStrategy = require('../lib/strategy');
var chai = require('chai');
chai.use(require('chai-passport-strategy'));
global.expect = chai.expect;

describe('IndeedStrategy', function() {

  describe('constructed', function() {
    var strategy = new IndeedStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret'
      },
      function() {});

    it('should be named indeed', function() {
      expect(strategy.name).to.equal('indeed');
    });
  })

  describe('constructed with undefined options', function() {
    it('should throw', function() {
      expect(function() {
        var strategy = new IndeedStrategy(undefined, function(){});
      }).to.throw(Error);
    });
  })
});
