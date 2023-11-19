// SPDX-License-Identifier: MIT

/*
Warning when testing code
Since transactions have to be approved within the contract they are created in
(So like approving a erc20 transaction must be done in an erc20 contract)
Before doing a transaction please approve it in the respective contract
*/
pragma solidity ^0.8.20;

    import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
    import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
    import "@openzeppelin/contracts/access/Ownable.sol";
    import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
    import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
    import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
    import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
    import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
    import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
    import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";



contract DeedToken is ERC721, ERC721Burnable, Ownable {
    /*
        This token may have meta data about basic info about the house such as square footage and address
    */
    //Data-------------------------------------------------------------------------------------------------------------------
        uint256 private _nextTokenId = 1;
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
        constructor()
            ERC721("DeedToken", "DDTK")
            Ownable(msg.sender)
        {    }
        
        //Is called upon creation of BuildingTokenContract and will automatically set BuildingContract when that occurs
        function setBuildingContractAddress() external NullBuildingContractAddress{
            BuildingContract = msg.sender;
        }

        //This is called from the 1155 where it just creates a new erc721 token
        function safeMint(address to) external MustHaveBuildingContract OnlyBuildingToken{
            uint256 tokenId = _nextTokenId++;
            _safeMint(to, tokenId);
        }
        //This checks the owner of a token
        function checkOwner(uint256 _id) public view returns(address){
            return ownerOf(_id);
        }
        //This just gets the next tokenID
        function nextTokenId() public view returns(uint256){
            return _nextTokenId;
        }
        function requestApproval() public MustHaveBuildingContract{
            setApprovalForAll(BuildingContract,true);
        }

    }