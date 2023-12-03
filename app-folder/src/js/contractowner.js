import {App} from "./app.js";


document.addEventListener('DOMContentLoaded', async function () {

    const createDeedButton = document.getElementById('create-deed');
    const viewDeedsButton = document.getElementById('view-deeds');
    const sendDeedForm = document.querySelector('.deed-container form');
    //const sendDeedForm = document.getElementById('send-deed');
    const approveDeedButton = document.getElementById('approve-deed');
    //const assignDeed = document

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

    createDeedButton.addEventListener('click', async function () {
        try {
            await App.contracts.BuildingToken.methods.createDeed().send({
                from: App.accounts[0],
                gas: 3000000, // adjust gas limit based on your contract deployment
            });
            alert('Deed created successfully!');
        } catch (error) {
            alert('Error creating deed: ' + error.message);
        }
    });

    viewDeedsButton.addEventListener('click', async function () {
        try {
            const openDeeds = await App.contracts.BuildingToken.methods.viewBuildingsAvailable().call();
            alert('Open Deeds: ' + openDeeds.join(', '));
        } catch (error) {
            alert('Error viewing open deeds: ' + error.message);
        }
    });

    sendDeedForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const deedId = document.getElementById('sendDeed-id').value;
        const receiverAddress = document.getElementById('sendDeed-address').value;

        try {
            await App.contracts.BuildingToken.methods.assignDeed(deedId, receiverAddress).send({
                from: App.accounts[0],
                gas: 3000000, // adjust gas limit based on your contract deployment
            });
            alert('Deed assigned successfully!');
        } catch (error) {
            alert('Error assigning deed: ' + error.message);
        }
    });
});