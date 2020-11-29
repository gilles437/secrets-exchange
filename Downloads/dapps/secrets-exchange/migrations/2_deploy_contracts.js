const Secret = artifacts.require("Secret");

module.exports = function(deployer) {
  deployer.deploy(Secret);
};
