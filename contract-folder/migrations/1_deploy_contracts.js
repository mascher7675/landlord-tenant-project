var DeedToken = artifacts.require("DeedToken.sol");
var RentToken = artifacts.require("RentToken");
var BuildingToken = artifacts.require("BuildingToken");

module.exports =  function (deployer) {
  // Deploy DeedToken
  deployer.deploy(DeedToken, {overwrite:true}).then(
    ()=>{
    return deployer.deploy(RentToken,{overwrite:true}).then(
      ()=>{
      return deployer.deploy(BuildingToken, RentToken.address, DeedToken.address,{overwrite:true})
          }
      ).catch((error)=>{console.log(error)})}
    ).catch((error)=>{console.log(error)})
  // Deploy RentToken, passing the address of DeedToken
  // Deploy BuildingToken, passing the addresses of RentToken and DeedToken
};