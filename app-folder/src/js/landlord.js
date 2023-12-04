import {App} from "./app.js";

document.addEventListener('DOMContentLoaded', async function () {

    const createRoomForm = document.querySelector('.create-room-container form');
    const viewRoomsButton = document.getElementById('view-rooms');
    const sendDeedBackButton = document.getElementById('send-deed');
    const viewTenantButton = document.getElementById('view-tenant')
    const chargeRentButton = document.getElementById('charge-rent');
    const viewBalanceButton = document.getElementById('view-balance');
    const approveDeedButton = document.getElementById('approve-deed');
    const sendRoomForm = document.querySelector('.room-container form');
    const availableRoomsButton = document.getElementById('view-room-ability')
    const viewDeedsButton = document.getElementById('view-deeds')


    createRoomForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const deedNumber = document.getElementById('deed').value;
        const roomId = document.getElementById('id').value;
        const roomAmount = document.getElementById('roomAmount').value;
        const roomRentAmount = document.getElementById('roomRentAmount').value;

        try {
            await App.contracts.BuildingToken.methods.createRooms(deedNumber, roomId, roomAmount, roomRentAmount).send({
                from: App.accounts[0],
            });
            alert('Room created successfully!');
        } catch (error) {
            alert('Error creating room: ' + error.message);
        }
    });

    approveDeedButton.addEventListener('click', async function () {
        try {
            await App.contracts.DeedToken.methods.requestApproval().send({
                from: App.accounts[0],
            });
            alert('Deed approved successfully!');
        } catch (error) {
            alert('Error approving deed: ' + error.message);
        }
    });

    sendRoomForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const roomId = document.getElementById('sendRoom-id').value;
        const receiverAddress = document.getElementById('sendRoom-address').value;
        console.log("tenant address: ", receiverAddress)

        try {
            await App.contracts.BuildingToken.methods.assignTenant(receiverAddress, roomId).send({
                from: App.accounts[0],
            });
            alert('Room assigned successfully, ' + roomId + ' -> ', receiverAddress);
        } catch (error) {
            alert('Error assigning room: ' + error.message);
        }
    });

    viewRoomsButton.addEventListener('click', async function () {
        try {
            console.log("viewing rooms")
            const buildings = await App.contracts.BuildingToken.methods.viewBuildingsOwned().call({
                from: App.accounts[0],
            });
    
            const roomsPromises = buildings.map(async (buildingId) => {
                return await App.contracts.BuildingToken.methods.viewRooms(buildingId).call({
                    from: App.accounts[0],
                });
            });
    
            const roomsArrays = await Promise.all(roomsPromises);
            const allRooms = [].concat(...roomsArrays);
    
            alert('Rooms owned: ' + allRooms.join(', '));
        } catch (error) {
            alert('Error viewing rooms: ' + error.message);
        }
    });

    viewDeedsButton.addEventListener('click', async function () {
        try {
            const buildings = await App.contracts.BuildingToken.methods.viewBuildingsOwned().call({
                from: App.accounts[0],
            });
    
            alert('Buildings owned: ' + buildings);
        } catch (error) {
            alert('Error viewing deeds: ' + error.message);
        }
    });

    viewTenantButton.addEventListener('click', async function () {
        try {
            const roomId = document.getElementById('viewTenant').value;
            if (roomId) {
                const tenant = await App.contracts.BuildingToken.methods.viewTenantswithRoom(roomId).call({
                    from: App.accounts[0],
                });

                console.log("tenant = ", tenant)

                alert('Tenant in Room: ' + tenant);
            } else {
                alert('Please enter a valid Room ID.');
            }
        } catch (error) {
            alert('Error finding tenant: ' + error.message);
        }
    });

    sendDeedBackButton.addEventListener('click', async function () {
        try {
            const deedId = document.getElementById('sendDeedBack').value;
            if (deedId) {
                await App.contracts.BuildingToken.methods.sendDeedToContractOwner(deedId).send({
                    from: App.accounts[0],
                });

                alert('Deed sent back successfully!');
            } else {
                alert('Please enter a valid Deed ID.');
            }
        } catch (error) {
            alert('Error sending deed back: ' + error.message);
        }
    });

    availableRoomsButton.addEventListener('click', async function () {
        try {
            const roomId = document.getElementById('viewAvailableRooms').value;
            if (roomId) {
                const available_rooms = await App.contracts.BuildingToken.methods.viewAvailableRooms(roomId).call({
                    from: App.accounts[0],
                });

                alert('Available Rooms: ' + available_rooms);
            } else {
                alert('Please enter a valid room ID.');
            }
        } catch (error) {
            alert('Error finding available rooms: ' + error.message);
        }
    });

    chargeRentButton.addEventListener('click', async function () {
        try {
            console.log("charging rent")
            await App.contracts.BuildingToken.methods.chargeRentAllBuildings().send({
                from: App.accounts[0],
            });

            alert('Rent charged to all buildings owned successfully!');
        } catch (error) {
            alert('Error charging rent: ' + error.message);
        }
    });

    viewBalanceButton.addEventListener('click', async function () {
        try {
            console.log("viewing balance")
            const result = await App.contracts.RentToken.methods.balanceOf(App.accounts[0]).call();
            //const resultInEther = App.web3.utils.fromWei(result, "ether");
            alert('Current Balance: ' + result)
        } catch (error) {
            alert('Error viewing tokens: ' + error.message);
        }
    });
});