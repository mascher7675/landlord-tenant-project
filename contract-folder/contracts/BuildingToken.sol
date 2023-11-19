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
    import "./DeedToken.sol";
    import "./RentToken.sol";


contract BuildingToken is ERC1155, Ownable, ERC1155Burnable {
    //Data-------------------------------------------------------------------------------------------------------------------
        //Tokens
            RentToken                       private rentToken;
            DeedToken                       private deedToken;
            address                         private contractOwner;
            string public name = "RoomTokens";
            string public symbol = "RTK";




        //Building Tracking
            uint256[]                       public  Buildings;
            uint256[]                       private Buildings_available;
            mapping(uint256 => bool)        private Buildings_assigned;
       
            mapping (address => uint256[])  private owner_to_lands;
            mapping (uint256 => address)    private land_to_owner;
       
            mapping (uint256 => uint256[])  private buildings_to_rooms;
            mapping (uint256 => mapping(uint256=>uint)) private building_to_rooms_available;
            mapping (uint256 => uint256)    private room_to_building;
           
            mapping (address => bool)       private tenant_in_room_available;
            mapping (uint256 => address[])  private room_to_tenant;
            mapping (address => uint256)    private tenant_to_room;




        //Payment
            mapping (address => uint)       private amountDue;
            mapping (uint256 => uint)       private rentAmount;
            mapping (address => uint)       private tenantLate;




    //Modifiers-------------------------------------------------------------------------------------------------------------------
        //Checks if the landlord owns the Deed of the house
        modifier ownsLand(uint256 _land){
            require(deedToken.checkOwner(_land) == msg.sender);
            _;
        }
        //Checks if the deedID already exists
        modifier UniqueBuildingExists(uint256 _id){
            bool within = false;
            for(uint i; i < Buildings.length; i++){
                if(Buildings[i] == _id){
                    within = true;
                }
            }
            require(within);
            _;
        }




        //Checks if the landlord is interacting with his tenant
        modifier isLandlordofTenant(uint256 _roomid){
            bool within = false;
            for(uint i; i<room_to_tenant[_roomid].length; i++){
                if(room_to_tenant[_roomid][i] == msg.sender){
                    within=true;
                }
            }




            require(deedToken.ownerOf(room_to_building[_roomid]) == msg.sender && within);
            _;
        }




        //Checks if tenant is linked to the room
        modifier tenantInRoom(uint256 _id){
            require(balanceOf(msg.sender, _id) > 0);
            _;
        }




        //Checks if the tenant has enough balance
        modifier enoughBalance(address _user, uint _amount){
            require(rentToken.balanceOf(_user) >= _amount);
            _;
        }




        //Checks for non negative values
        modifier non_negative(uint _amount){
            require(_amount > 0);
            _;
        }




    //Functions-------------------------------------------------------------------------------------------------------------------
        constructor(address _rentToken, address _deedToken) ERC1155("") Ownable(msg.sender) {
            rentToken = RentToken(_rentToken);
            deedToken = DeedToken(_deedToken);
            rentToken.setBuildingContractAddress();
            deedToken.setBuildingContractAddress();
            contractOwner = msg.sender;


            }


        //_________________________________Rent Function_________________________________




            //Charge Fees to a single room
            function chargeFee(address _tenant, uint amount) public ownsLand(room_to_building[tenant_to_room[_tenant]]) non_negative(amount){
                amountDue[_tenant] += amount;
            }




            //Charge rent to all people in a single building
            function chargeRentinBuilding(uint256 building) private ownsLand(building){
                for(uint i; i < buildings_to_rooms[building].length;i++){           //For each room in the building
                    address[] memory _tenants = room_to_tenant[buildings_to_rooms[building][i]];    
                    for(uint j; j < _tenants.length;j++){         //For each tenant linked to roomID
                        if(amountDue[_tenants[j]] > 0){                       //If amount due is greater than 0, increase lateness
                            tenantLate[_tenants[j]] += 1;
                        }
                        amountDue[_tenants[j]] += rentAmount[buildings_to_rooms[building][i]];
                    }
                }
            }




            //Charge rent to all properties the messenger owns
            function chargeRentAllBuildings() public{
                for(uint i; i < owner_to_lands[msg.sender].length;i++){
                    chargeRentinBuilding(owner_to_lands[msg.sender][i]);
                }
            }




            //Changes the amount of rent linked to a room
            function changeRent(uint256 _id, uint _rentAmount) public ownsLand(_id){
                rentAmount[_id] = _rentAmount;
            }




            //Pay the rent in tokens
            function singlePayRent(uint _amount) public payable enoughBalance(msg.sender,_amount) non_negative(_amount){
                address _tenant = msg.sender;
                address _landlord = land_to_owner[room_to_building[tenant_to_room[msg.sender]]];
                uint due = amountDue[_tenant];
                if(_amount >= due){
                    assert(rentToken.allowance(msg.sender, address(this)) >= due);
                    rentToken.transferFrom(_tenant,_landlord, due);
                    amountDue[_tenant] = 0;
                }
                else{
                    assert(rentToken.allowance(msg.sender, address(this)) >= _amount);
                    rentToken.transferFrom(_tenant,_landlord, _amount);
                    amountDue[_tenant] -= _amount;
                }
            }








        //_________________________________Viewing Info Functions_________________________________




            //Check your rent
            function viewRent (uint256 _room) public view returns(uint){
                return rentAmount[_room];
            }




            //Check the amount due
            function viewDue (address _tenant) public view returns(uint){
                return amountDue[_tenant];
            }




            //Check the amount of payments they missed
            function viewLateness(address _tenant) public view returns(uint){
                return tenantLate[_tenant];
            }




            //View rooms associated to Building
            function viewRooms(uint256 _building) public view returns(uint256[] memory){
                return buildings_to_rooms[_building];
            }




            //View amount of rent tokens for an address
            function viewBalance(address _tenant) public view returns(uint){
                return rentToken.balanceOf(_tenant);
            }




            //View all the buildings
            function viewBuildings() public view  returns(uint256[] memory){
                return Buildings;
            }




            //View all unlinked buildings
            function viewBuildingsAvailable() public view returns(uint256[] memory){
                return Buildings_available;
            }




            //View all buildings owned
            function viewBuildingsOwned() public view returns(uint256[] memory){
                return owner_to_lands[msg.sender];
            }




            //view tenants linked to room
            function viewTenantswithRoom(uint _room) public view returns(address[] memory){
                return room_to_tenant[_room];
            }



            function viewAvailableRooms (uint256 roomID) public view returns(uint256){
                return building_to_rooms_available[room_to_building[roomID]][roomID];
}




        //_________________________________Token Creation Functions_________________________________




            function createDeed() public onlyOwner{
                Buildings.push(deedToken.nextTokenId());
                Buildings_assigned[deedToken.nextTokenId()] == false;
                Buildings_available.push(deedToken.nextTokenId());
                deedToken.safeMint(msg.sender);
            }




            function buyRentTokens() public payable  {
                require(msg.sender.balance >= msg.value);
                rentToken.buyRentTokens(msg.value,msg.sender);
            }




            function createRooms(uint256 deed, uint256 id, uint256 amount, uint _rentAmount) public ownsLand(deed){
                require(room_to_building[id] == 0x0 || room_to_building[id] == deed);
                _mint(msg.sender,id,amount,"");
                if(room_to_building[id] != deed){
                buildings_to_rooms[deed].push(id);
                }
                building_to_rooms_available[deed][id] += amount;
                room_to_building[id] = deed;
                rentAmount[id] = _rentAmount;
            }




        //_________________________________Token Transfer Functions_________________________________




            //Assigns a deed to a address
            function assignDeed(uint256 _deedId, address _to) public onlyOwner{
                for(uint i; i < owner_to_lands[_to].length;i++){
                    if(owner_to_lands[_to][i] == _deedId){
                        revert();
                    }
                }
                Buildings_assigned[_deedId] = true;
                for(uint i;i < Buildings_available.length;i++){
                    if(Buildings_available[i] == _deedId){
                        delete Buildings_available[i];
                    }
                }
                if(deedToken.ownerOf(_deedId) != msg.sender) {  
                    require(deedToken.isApprovedForAll(_to, address(this)),"Please Request Approval");
                    deedToken.safeTransferFrom(msg.sender, _to, _deedId);}
                land_to_owner[_deedId] = _to;
                owner_to_lands[_to].push(_deedId);
            }




            //Sends
            function sendDeedToContractOwner(uint256 _deedId) public ownsLand(_deedId){
                require(deedToken.isApprovedForAll(msg.sender, address(this)),"Please Request Approval");
                removeFromOwned(_deedId);
                deedToken.safeTransferFrom(msg.sender, contractOwner, _deedId);
                Buildings_assigned[_deedId]=false;
                Buildings_available[_deedId-1]=(_deedId);
                land_to_owner[_deedId] = address(0);
            }




            function removeFromOwned(uint256 _id) private ownsLand(_id){
                bool backing = false;
                if(owner_to_lands[msg.sender][owner_to_lands[msg.sender].length - 1] == _id){
                    owner_to_lands[msg.sender].pop();
                }
                else{
                    for(uint i; i < owner_to_lands[msg.sender].length - 1;i++){
                        if(owner_to_lands[msg.sender][i] == _id){
                            backing = true;
                            delete owner_to_lands[msg.sender][i];
                        }
                        if(backing){
                            owner_to_lands[msg.sender][i] = owner_to_lands[msg.sender][i+1];
                        }
                        owner_to_lands[msg.sender].pop();
                    }
                }
            }


            function assignTenant(address tenant, uint256 roomID) public ownsLand(room_to_building[roomID]){
                uint rooms_available = building_to_rooms_available[room_to_building[roomID]][roomID];
                if (rooms_available > 0){
                        building_to_rooms_available[room_to_building[roomID]][roomID] -= 1;
                        safeTransferFrom(msg.sender, tenant, roomID,1,"");
                        tenant_to_room[tenant] = roomID;
                        room_to_tenant[roomID].push(tenant);
                    }else{
                        revert();
                    }
                }
           


            function deleteFromRoom(address _tenant, uint256 room) private{
                bool backing = false;
                if(room_to_tenant[room][room_to_tenant[room].length - 1] == _tenant){
                    room_to_tenant[room].pop();
                }
                else{
                    for(uint i; i < room_to_tenant[room].length - 1;i++){
                        if(room_to_tenant[room][i] == _tenant){
                            backing = true;
                            delete owner_to_lands[msg.sender][i];
                        }
                        if(backing){
                            room_to_tenant[room][i] = room_to_tenant[room][i+1];
                        }
                        room_to_tenant[room].pop();
                    }
                }
            }




           function refundRoom(uint256 roomID) public tenantInRoom(roomID) {
                address landLord = land_to_owner[room_to_building[roomID]];
                safeTransferFrom(msg.sender,landLord, roomID,1,"");
                building_to_rooms_available[room_to_building[roomID]][roomID] += 1;
                delete tenant_to_room[msg.sender];
                deleteFromRoom(msg.sender,roomID);
           }
       
    }