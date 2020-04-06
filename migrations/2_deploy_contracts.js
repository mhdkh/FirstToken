const ArtexToken = artifacts.require("./ArtexToken.sol");

module.exports = function(deployer) {
  deployer.deploy(ArtexToken);
};
