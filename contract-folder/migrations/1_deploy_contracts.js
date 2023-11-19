const DeedToken = artifacts.require("DeedToken");
const RentToken = artifacts.require("RentToken");
const BuildingToken = artifacts.require("BuildingToken");

module.exports = async function (deployer) {
  // Deploy DeedToken
  await deployer.deploy(DeedToken);

  // Deploy RentToken, passing the address of DeedToken
  await deployer.deploy(RentToken, DeedToken.address);

  // Deploy BuildingToken, passing the addresses of RentToken and DeedToken
  await deployer.deploy(BuildingToken, RentToken.address, DeedToken.address);
};