function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';'); // Split the cookie string into an array of individual cookies
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') { // Remove leading spaces (e.g., "; my_cookie=value" -> "my_cookie=value")
            c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) === 0) { // If this cookie starts with the name we're looking for
            return c.substring(nameEQ.length, c.length); // Return the value
        }
    }
    return null; // Cookie not found
}

const apiKey = getCookie('api_key');

document.addEventListener('DOMContentLoaded', function () {
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
        prodCatBtn.addEventListener('click', function () {
            showForms(productForms);
        });
    }

    if (retCatBtn) {
        retCatBtn.addEventListener('click', function () {
            showForms(retailerForms);
        });
    }

    if (userCatBtn) {
        userCatBtn.addEventListener('click', function () {
            showForms(userForms);
        });
    }

    // Initial state: Show the product forms by default when the page loads
    showForms(productForms);
});

document.getElementById("btnAddRet").addEventListener("click", function (event) {
    event.preventDefault();

    let retNameInput = document.getElementsByName("retailName")[0];
    let retAddressInput = document.getElementsByName("retailAddress")[0];

    let isValid = true;
    let retailerName = retNameInput ? retNameInput.value.trim() : "";
    let retailerAddress = retAddressInput ? retAddressInput.value.trim() : "";

    if (retailerName === "") {
        alert("Retailer Name is required!");
        isValid = false;
    } else {
        // clearError("retailNameInputId"); // Clear error if applicable
    }

    if (isValid) {
        const payload = {
            type: "AddRetailer",
            apikey: apiKey,
            retailName: retailerName
        };

        if (retailerAddress !== "") {
            payload.retailAddress = retailerAddress;
        }

        console.log("Sending payload:", payload);

        fetch("../api.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    alert("Successfully added retailer!");
                    if (retNameInput) retNameInput.value = "";
                    if (retAddressInput) retAddressInput.value = "";
                } else {
                    alert("Failed to add retailer: " + (data.data || "Unknown error."));
                    console.error("API error:", data.data);
                }
            })
            .catch(error => {
                console.error("Network error adding retailer:", error);
                alert("Network error. Please check your connection.");
            });
    } else {
        console.log("Validation failed. Not sending request.");
    }
});

document.getElementById("btnUpdateRet").addEventListener("click", function (event) {
    event.preventDefault();

    let retNameInput = document.getElementsByName("retailName")[0];
    let newRetNameInput = document.getElementsByName("newRetailName")[0];
    let retAddressInput = document.getElementsByName("retailAddress")[0];

    let isValid = true;
    let curRetailerName = retNameInput ? retNameInput.value.trim() : "";
    let newRetailerName = newRetNameInput ? newRetNameInput.value.trim() : "";
    let retailerAddress = retAddressInput ? retAddressInput.value.trim() : "";

    if (retailerName === "") {
        alert("Retailer Name is required!");
        isValid = false;
    } else {
        // clearError("retailNameInputId"); // Clear error if applicable
    }

    if (isValid && newRetailerName === "" && retailerAddress === "") {
        alert("At least one field (New Retailer Name or New Retailer Address) must be provided to update the retailer."); // Use your showError function here
        isValid = false;
    }

    if (isValid) {
        const payload = {
            type: "UpdateRetailer",
            apikey: apiKey,
            retailName: curRetailerName
        };

        if (retailerAddress !== "") {
            payload.retailAddress = retailerAddress;
        }
        if (newRetailerName !== "") {
            payload.newRetailName = newRetailerName;
        }

        console.log("Sending payload:", payload);

        fetch("../api.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    alert("Successfully updated retailer!");
                    if (retNameInput) retNameInput.value = "";
                    if (retAddressInput) retAddressInput.value = "";
                    if (newRetNameInput) newRetNameInput.value = "";
                } else {
                    alert("Failed to update retailer: " + (data.data || "Unknown error."));
                    console.error("API error:", data.data);
                }
            })
            .catch(error => {
                console.error("Network error updating retailer:", error);
                alert("Network error. Please check your connection.");
            });
    } else {
        console.log("Validation failed. Not sending request.");
    }
});

document.getElementById("btnDelAcc").addEventListener("click", function (event) {
    event.preventDefault();

    let accToDeleteInput = document.getElementsByName("accToDeleteAPIKey")[0];

    let isValid = true;
    let apiKeyToDelete = accToDeleteInput ? accToDeleteInput.value.trim() : "";

    if (apiKeyToDelete === "") {
        alert("APIKey of account to delete is required!");
        isValid = false;
    } else {
        // clearError("retailNameInputId"); // Clear error if applicable
    }

    if (isValid) {
        const payload = {
            type: "DeleteAccount",
            apikey: apiKeyToDelete
        };


        console.log("Sending payload:", payload);

        fetch("../api.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    alert("Successfully deleted account!");
                    if (accToDeleteInput) accToDeleteInput.value = "";
                } else {
                    alert("Failed to delete account: " + (data.data || "Unknown error."));
                    console.error("API error:", data.data);
                }
            })
            .catch(error => {
                console.error("Network error deleting account:", error);
                alert("Network error. Please check your connection.");
            });
    } else {
        console.log("Validation failed. Not sending request.");
    }
});

document.getElementById("btnChangeAcc").addEventListener("click", function (event) {
    event.preventDefault();

    let accToChangeInput = document.getElementsByName("accToChangeAPIKey")[0];

    let isValid = true;
    let apiKeyToChange = accToChangeInput ? accToChangeInput.value.trim() : "";

    if (apiKeyToChange === "") {
        alert("APIKey of account to change is required!");
        isValid = false;
    } else {
        // clearError("retailNameInputId"); // Clear error if applicable
    }

    if (isValid) {
        const payload = {
            type: "MakeUserAdmin",
            adminkey: apiKey,
            targetkey: apiKeyToChange
        };


        console.log("Sending payload:", payload);

        fetch("../api.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    alert("Successfully changed account type!");
                    if (accToChangeInput) accToChangeInput.value = "";
                } else {
                    alert("Failed to change account type: " + (data.data || "Unknown error."));
                    console.error("API error:", data.data);
                }
            })
            .catch(error => {
                console.error("Network error changing account type:", error);
                alert("Network error. Please check your connection.");
            });
    } else {
        console.log("Validation failed. Not sending request.");
    }
});

document.getElementById("btnDelRev").addEventListener("click", function (event) {
    event.preventDefault();

    let reviewerAPIKeyInput = document.getElementsByName("reviewerAPIKey")[0];
    let productTitleInput = document.getElementsByName("prodTitle")[0];

    let isValid = true;
    let reviewerAPIKey = reviewerAPIKeyInput ? reviewerAPIKeyInput.value.trim() : "";
    let prodTitle = productTitleInput ? productTitleInput.value.trim() : "";

    if (reviewerAPIKey === "") {
        alert("Reviewer API_Key is required!");
        isValid = false;
    } else {
        // clearError("retailNameInputId"); // Clear error if applicable
    }
    
    if (prodTitle === "") {
        alert("Product Title is required!");
        isValid = false;
    } else {
        // clearError("retailNameInputId"); // Clear error if applicable
    }

    if (isValid) {
        const payload = {
            type: "removeReview",
            apikey: apiKey,
            Title: prodTitle,
            userapikey: reviewerAPIKey
        };


        console.log("Sending payload:", payload);

        fetch("../api.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    alert("Successfully removed review!");
                    if (reviewerAPIKeyInput) reviewerAPIKeyInput.value = "";
                    if (productTitleInput) productTitleInput.value = "";
                } else {
                    alert("Failed to remove review: " + (data.data || "Unknown error."));
                    console.error("API error:", data.data);
                }
            })
            .catch(error => {
                console.error("Network error removing review:", error);
                alert("Network error. Please check your connection.");
            });
    } else {
        console.log("Validation failed. Not sending request.");
    }
});

document.getElementById("btnDelProd").addEventListener("click", function (event) {
    event.preventDefault();
});

document.getElementById("btnUpProdPrice").addEventListener("click", function (event) {
    event.preventDefault();
});

document.getElementById("btnAddProd").addEventListener("click", function (event) {
    event.preventDefault();
});