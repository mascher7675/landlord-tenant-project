import {App} from "./app.js";

console.log(App.contracts)


document.addEventListener('DOMContentLoaded', async function () {

    const viewDueButton = document.getElementById('view-due');
    const sendRoomBackButton = document.getElementById('send-room-back');
    const validateERC20Button = document.getElementById('validate-erc20');
    const submitPaymentButton = document.getElementById('submit-payment');
    const buyTokensButton = document.getElementById('buy-tokens');
    const viewBalanceButton = document.getElementById('view-balance')

    viewDueButton.addEventListener('click', async function () {
        try {
            console.log("user = ", App.accounts[0])
            const amountDue = await App.contracts.BuildingToken.methods.viewDue(App.accounts[0]).call();
            alert('Amount Due: ' + amountDue);
        } catch (error) {
            alert('Error viewing amount due: ' + error.message);
        }
    });

    sendRoomBackButton.addEventListener('click', async function () {
        try {
            const roomID = document.getElementById('sendRoomBack').value;
            if (roomID) {
                await App.contracts.BuildingToken.methods.refundRoom(roomID).send({
                    from: App.accounts[0],
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
                await App.contracts.RentToken.methods.requestApproval(amountToValidate).send({
                    from: App.accounts[0]
                })
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
                await App.contracts.BuildingToken.methods.singlePayRent(rentAmount).send({
                    from: App.accounts[0]
                });

                alert('Rent payment successful!');
            } else {
                alert('Please enter a valid rent amount.');
            }
        } catch (error) {
            alert('Error during rent payment: ' + error.message);
        }
    });

    viewBalanceButton.addEventListener('click', async function () {
        try {
            const result = await App.contracts.RentToken.methods.balanceOf(App.accounts[0]).call();
            const resultInEther = App.web3.utils.fromWei(result, "ether");
            alert('Current Balance: ' + resultInEther)

        } catch (error) {
            alert('Error viewing tokens: ' + error.message);
        }
    });

    buyTokensButton.addEventListener('click', async function () {
        const tokenAmount = document.getElementById('tokenAmount').value;
        try {
            await App.contracts.RentToken.methods.BuyRentTokens().send({
                from: App.accounts[0],
                value: tokenAmount * 1e18
            });
            alert('Tokens purchased successfully!');
        } catch (error) {
            alert('Error buying tokens: ' + error.message);
        }
    });
});