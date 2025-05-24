document.addEventListener('DOMContentLoaded', function() {
    // Get references to your buttons
    const prodCatBtn = document.getElementById('prodCat');
    const retCatBtn = document.getElementById('retCat');
    const userCatBtn = document.getElementById('userCat');

    // Get references to your form containers
    const productForms = document.getElementById('productForms');
    const retailerForms = document.getElementById('retailerForms');
    const userForms = document.getElementById('userForms');

    // Function to hide all form containers
    function hideAllForms() {
        if (productForms) productForms.style.display = 'none';
        if (retailerForms) retailerForms.style.display = 'none';
        if (userForms) userForms.style.display = 'none';
    }

    // Function to show a specific form container
    function showForms(formContainer) {
        hideAllForms(); // Hide all first
        if (formContainer) {
            formContainer.style.display = 'block'; // Or 'flex' if it's a flex container
        }
    }

    // Add event listeners to the buttons
    if (prodCatBtn) {
        prodCatBtn.addEventListener('click', function() {
            showForms(productForms);
        });
    }

    if (retCatBtn) {
        retCatBtn.addEventListener('click', function() {
            showForms(retailerForms);
        });
    }

    if (userCatBtn) {
        userCatBtn.addEventListener('click', function() {
            showForms(userForms);
        });
    }

    // Initial state: Show the product forms by default when the page loads
    showForms(productForms);
});