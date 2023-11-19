function selectUser(userType) {
    // Redirect to the appropriate page based on the selected user type
    switch (userType) {
        case 'Landlord':
            window.location.href = 'landlord.html';
            break;
        case 'Tenant':
            window.location.href = 'tenant.html';
            break;
        case 'ContractOwner':
            window.location.href = 'contractowner.html';
            break;
        default:
            // Handle unexpected user types
            alert('Invalid user type');
    }
}