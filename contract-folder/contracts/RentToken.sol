// SPDX-License-Identifier: MIT

/*
Warning when testing code
Since transactions have to be approved within the contract they are created in
(So like approving a erc20 transaction must be done in an erc20 contract)
Before doing a transaction please approve it in the respective contract
*/
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
   


contract RentToken is ERC20, Ownable {
    //Data-------------------------------------------------------------------------------------------------------------------
        uint    private tokens_per_wei = 1;
        address private contractOwner;
        address private BuildingContract = address(0);

    //Modifiers-------------------------------------------------------------------------------------------------------------------
        //Checks if BuildingContract has not been filled out
        modifier NullBuildingContractAddress(){
            assert(BuildingContract ==  address(0));
            _;
        }
        //Checks if BuildingContract has been filled out
        modifier MustHaveBuildingContract(){
            assert(BuildingContract !=  address(0));
            _;
        }
        
        //Checks if only the buildingContract is calling the function
        modifier OnlyBuildingToken(){
            require(msg.sender == BuildingContract);
            _;
        }
    //Functions-------------------------------------------------------------------------------------------------------------------
        constructor() ERC20("RoomToken", "ReTK") Ownable(msg.sender)
        {        
            contractOwner = msg.sender;
        }

        //Is called upon creation of BuildingTokenContract and will automatically set BuildingContract when that occurs
        function setBuildingContractAddress() external NullBuildingContractAddress{
            BuildingContract = msg.sender;
        }

        //This should be the only function called within the erc20 contract (Since apparently you cant approve things from different contracts
        //This will basically just approve a certain amount for a transaction sent from the Building Contract
        function requestApproval(uint _amount) public MustHaveBuildingContract{
            approve(BuildingContract,_amount);
        }

        function BuyRentTokens() payable public{
            _mint(msg.sender,(msg.value * tokens_per_wei));
        }

        //This is called in the ERC1155 contract and will allow anyone to buy Rent Tokens to trade
        function buyRentTokens(uint value, address _sender) external MustHaveBuildingContract OnlyBuildingToken {
            _mint(_sender,(value * tokens_per_wei));
        }
        
        function BuyRentTokens() payable public{
            _mint(msg.sender,(msg.value * tokens_per_wei));
        }
        
        }

        
