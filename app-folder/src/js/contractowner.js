const { web3, accounts, deedTokenContract, buildingTokenContract } = require('./app.js');

document.addEventListener('DOMContentLoaded', async function () {

    const createDeedButton = document.getElementById('create-deed');
    const viewDeedsButton = document.getElementById('view-deeds');
    const sendDeedForm = document.querySelector('.deed-container');

    createDeedButton.addEventListener('click', async function () {
        try {
            await buildingTokenContract.methods.createDeed().send({
                from: accounts[0],
                gas: 3000000, // adjust gas limit based on your contract deployment
            });

            alert('Deed created successfully!');
        } catch (error) {
            alert('Error creating deed: ' + error.message);
        }
    });

    viewDeedsButton.addEventListener('click', async function () {
        try {
            const openDeeds = await buildingTokenContract.methods.viewBuildingsAvailable().call();
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
            await buildingTokenContract.methods.assignDeed(deedId, receiverAddress).send({
                from: accounts[0],
                gas: 3000000, // adjust gas limit based on your contract deployment
            });
            alert('Deed assigned successfully!');
        } catch (error) {
            alert('Error assigning deed: ' + error.message);
        }
    });
});