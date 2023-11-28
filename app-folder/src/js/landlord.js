import {App} from "./app.js";



document.addEventListener('DOMContentLoaded', async function () {

    const createRoomForm = document.querySelector('.create-room-container form');
    const viewRoomsButton = document.getElementById('view-rooms');
    const sendDeedBackButton = document.getElementById('send-deed-back');
    const chargeRentButton = document.getElementById('charge-rent');

    createRoomForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const deedNumber = document.getElementById('deed').value;
        const roomId = document.getElementById('id').value;
        const roomAmount = document.getElementById('roomAmount').value;
        const roomRentAmount = document.getElementById('roomRentAmount').value;

        try {
            await buildingTokenContract.methods.createRooms(deedNumber, roomId, roomAmount, roomRentAmount).send({
                from: accounts[0],
                gas: 3000000,
            });
            alert('Room created successfully!');
        } catch (error) {
            alert('Error creating room: ' + error.message);
        }
    });

    viewRoomsButton.addEventListener('click', async function () {
        try {
            const buildings = await buildingTokenContract.methods.viewBuildingsOwned().call({
                from: accounts[0],
            });
    
            const roomsPromises = buildings.map(async (buildingId) => {
                return await buildingTokenContract.methods.viewRooms(buildingId).call({
                    from: accounts[0],
                });
            });
    
            const roomsArrays = await Promise.all(roomsPromises);
            const allRooms = [].concat(...roomsArrays);
    
            alert('Rooms owned: ' + allRooms.join(', '));
        } catch (error) {
            alert('Error viewing rooms: ' + error.message);
        }
    });

    sendDeedBackButton.addEventListener('click', async function () {
        try {
            const deedId = document.getElementById('deedID').value;
            if (deedId) {
                await buildingTokenContract.methods.sendDeedToContractOwner(deedId).send({
                    from: accounts[0],
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
            await buildingTokenContract.methods.chargeRentAllBuildings().send({
                from: accounts[0],
                gas: 3000000, // adjust gas limit based on your contract deployment
            });

            alert('Rent charged to all buildings owned successfully!');
        } catch (error) {
            alert('Error charging rent: ' + error.message);
        }
    });
});