import {App} from "./app.js";

console.log(App.buildingTokenAddress)


document.addEventListener('DOMContentLoaded', async function () {

    const viewDueButton = document.getElementById('view-due');
    const sendRoomBackButton = document.getElementById('send-room-back');
    const validateERC20Button = document.getElementById('validate-erc20');
    const submitPaymentButton = document.getElementById('submit-payment');
    const buyTokensButton = document.getElementById('buy-tokens');

    viewDueButton.addEventListener('click', async function () {
        try {
            const amountDue = await buildingTokenContract.methods.viewDue(accounts[0]).call();
            alert('Amount Due: ' + amountDue);
        } catch (error) {
            alert('Error viewing amount due: ' + error.message);
        }
    });

    sendRoomBackButton.addEventListener('click', async function () {
        try {
            const roomID = document.getElementById('sendRoomBack').value;
            if (roomID) {
                await buildingTokenContract.methods.refundRoom(roomID).send({
                    from: accounts[0],
                    gas: 3000000, // adjust gas limit based on your contract deployment
                });
    
                alert('Room sent back successfully!');
            } else {
                alert('Please enter a valid Room ID.');
            }
        } catch (error) {
            alert('Error sending room back: ' + error.message);
        }
    });

    validateERC20Button.addEventListener('click', async function () {
        try {
            const amountToValidate = document.getElementById('validateAmount').value;
            if (amountToValidate) {
                // You can add your validation logic here
                alert('Validation successful!');
            } else {
                alert('Please enter a valid amount to validate.');
            }
        } catch (error) {
            alert('Error during validation: ' + error.message);
        }
    });

    submitPaymentButton.addEventListener('click', async function () {
        try {
            const rentAmount = document.getElementById('rentAmount').value;
            if (rentAmount) {
                await buildingTokenContract.methods.singlePayRent(rentAmount).send({
                    from: accounts[0],
                    gas: 3000000, // adjust gas limit based on your contract deployment
                });

                alert('Rent payment successful!');
            } else {
                alert('Please enter a valid rent amount.');
            }
        } catch (error) {
            alert('Error during rent payment: ' + error.message);
        }
    });

    buyTokensButton.addEventListener('click', async function () {
        const tokenAmount = document.getElementById('tokenAmount').value;
        try {
            await rentTokenContract.methods.buyRentTokens(tokenAmount).send({
                from: accounts[0],
                value: tokenAmount * 1e18, // convert to Wei
                gas: 3000000, // adjust gas limit based on your contract deployment
            });
            alert('Tokens purchased successfully!');
        } catch (error) {
            alert('Error buying tokens: ' + error.message);
        }
    });
});