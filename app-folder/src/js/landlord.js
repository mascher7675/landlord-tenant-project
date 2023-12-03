import {App} from "./app.js";

document.addEventListener('DOMContentLoaded', async function () {

    const createRoomForm = document.querySelector('.create-room-container form');
    const viewRoomsButton = document.getElementById('view-rooms');
    //const viewOwnedRoomsButton = document.getElementById('view-owned-rooms');
    const sendDeedBackButton = document.getElementById('send-deed');
    const chargeRentButton = document.getElementById('charge-rent');
    const viewBalanceButton = document.getElementById('view-balance');
    const approveDeedButton = document.getElementById('approve-deed');


    createRoomForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const deedNumber = document.getElementById('deed').value;
        const roomId = document.getElementById('id').value;
        const roomAmount = document.getElementById('roomAmount').value;
        const roomRentAmount = document.getElementById('roomRentAmount').value;

        try {
            await App.contracts.BuildingToken.methods.createRooms(deedNumber, roomId, roomAmount, roomRentAmount).send({
                from: App.accounts[0],
                gas: 3000000,
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
                gas: 3000000, // adjust gas limit based on your contract deployment
            });
            alert('Deed created successfully!');
        } catch (error) {
            alert('Error creating deed: ' + error.message);
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

    /*viewRoomsButton.addEventListener('click', async function () {
        try {
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
    });*/

    sendDeedBackButton.addEventListener('click', async function () {
        try {
            console.log("sending deed back")
            const deedId = document.getElementById('sendDeedBack').value;
            if (deedId) {
                await App.contracts.BuildingToken.methods.sendDeedToContractOwner(deedId).send({
                    from: App.accounts[0],
                    gas: 3000000, // adjust gas limit based on your contract deployment
                });

                alert('Deed sent back successfully!');
            } else {
                alert('Please enter a valid Deed ID.');
            }
        } catch (error) {
            alert('Error sending deed back: ' + error.message);
        }
    });

    chargeRentButton.addEventListener('click', async function () {
        try {
            console.log("charging rent")
            await App.contracts.BuildingToken.methods.chargeRentAllBuildings().send({
                from: App.accounts[0],
                gas: 3000000, // adjust gas limit based on your contract deployment
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
            const resultInEther = App.web3.utils.fromWei(result, "ether");
            alert('Current Balance: ' + resultInEther)
        } catch (error) {
            alert('Error viewing tokens: ' + error.message);
        }
    });
});