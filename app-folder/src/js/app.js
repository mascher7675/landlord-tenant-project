const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));

const rentTokenABI = require('src/abi/RentTokenABI.json');
const deedTokenABI = require('src/abi/DeedTokenABI.json');
const buildingTokenABI = require('src/abi/BuildingTokenABI.json');

const rentTokenAddress = '0xDA0bab807633f07f013f94DD0E6A4F96F8742B53'; // ERC20 contract address
const deedTokenAddress = '0x358AA13c52544ECCEF6B0ADD0f801012ADAD5eE3'; // ERC721 contract address
const buildingTokenAddress = '0x9D7f74d0C41E726EC95884E0e97Fa6129e3b5E99'; // ERC1155 contract address

const accounts = await web3.eth.getAccounts();

// Create contract instances
const rentTokenContract = new web3.eth.Contract(rentTokenABI, rentTokenAddress);
const deedTokenContract = new web3.eth.Contract(deedTokenABI, deedTokenAddress);
const buildingTokenContract = new web3.eth.Contract(buildingTokenABI, buildingTokenAddress);

async function setBuildingContractAddresses() {
    // try {
    //     // Set Building Contract Address for ERC20
    //     //await rentTokenContract.methods.setBuildingContractAddress().send({ from: accounts[0] });

    //     // Set Building Contract Address for ERC721
    //     //await deedTokenContract.methods.setBuildingContractAddress().send({ from: accounts[0] });

    //     console.log('Building Contract Addresses Set');
    // } catch (error) {
    //     console.error('Error setting Building Contract Addresses:', error);
    // }
}

module.exports = {
    web3,
	accounts,
    rentTokenContract,
    deedTokenContract,
    buildingTokenContract,
};

setBuildingContractAddresses();