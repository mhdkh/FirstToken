var ArtexToken = artifacts.require("./ArtexToken.sol");

contract('ArtexToken', function(accounts) {
  it('sets the total supply upon deployment', function(){
    return ArtexToken.deployed().then(function(instance){
      tokenInstance = instance;
      return tokenInstance.totalSupply();

    }).then(function(totalSupply){
      assert.equal(totalSupply.toNumber(), 1000000, 'sets the total supply to 1,000,000');

    })


  });

});
