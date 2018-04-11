const expect = require('chai').expect;

const userDAO = require('./userDAO');

describe('User', function() {
  describe('DAO test', function() {
    it('should return the username', function() {
      expect(userDAO.getUsername()).to.equal('John');
    });
  });
});
