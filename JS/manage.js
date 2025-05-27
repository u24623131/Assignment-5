// function getCookie(name) {
//     const nameEQ = name + "=";
//     const ca = document.cookie.split(';'); // Split the cookie string into an array of individual cookies
//     for (let i = 0; i < ca.length; i++) {
//         let c = ca[i];
//         while (c.charAt(0) === ' ') { // Remove leading spaces (e.g., "; my_cookie=value" -> "my_cookie=value")
//             c = c.substring(1, c.length);
//         }
//         if (c.indexOf(nameEQ) === 0) { // If this cookie starts with the name we're looking for
//             return c.substring(nameEQ.length, c.length); // Return the value
//         }
//     }
//     return null; // Cookie not found
// }

// const apiKey = getCookie('api_key');

// document.addEventListener('DOMContentLoaded', function () {
//     // Get references to your buttons
//     const prodCatBtn = document.getElementById('prodCat');
//     const retCatBtn = document.getElementById('retCat');
//     const userCatBtn = document.getElementById('userCat');

//     // Get references to your form containers
//     const productForms = document.getElementById('productForms');
//     const retailerForms = document.getElementById('retailerForms');
//     const userForms = document.getElementById('userForms');

//     // Function to hide all form containers
//     function hideAllForms() {
//         if (productForms) productForms.style.display = 'none';
//         if (retailerForms) retailerForms.style.display = 'none';
//         if (userForms) userForms.style.display = 'none';
//     }

//     // Function to show a specific form container
//     function showForms(formContainer) {
//         hideAllForms(); // Hide all first
//         if (formContainer) {
//             formContainer.style.display = 'block'; // Or 'flex' if it's a flex container
//         }
//     }

//     // Add event listeners to the buttons
//     if (prodCatBtn) {
//         prodCatBtn.addEventListener('click', function () {
//             showForms(productForms);
//         });
//     }

//     if (retCatBtn) {
//         retCatBtn.addEventListener('click', function () {
//             showForms(retailerForms);
//         });
//     }

//     if (userCatBtn) {
//         userCatBtn.addEventListener('click', function () {
//             showForms(userForms);
//         });
//     }

//     // Initial state: Show the product forms by default when the page loads
//     showForms(productForms);
// });

// document.getElementById("btnAddRet").addEventListener("click", function (event) {
//     event.preventDefault();

//     let retNameInput = document.getElementsByName("retailName")[0];
//     let retAddressInput = document.getElementsByName("retailAddress")[0];

//     let isValid = true;
//     let retailerName = retNameInput ? retNameInput.value.trim() : "";
//     let retailerAddress = retAddressInput ? retAddressInput.value.trim() : "";

//     if (retailerName === "") {
//         alert("Retailer Name is required!");
//         isValid = false;
//     } else {
//         // clearError("retailNameInputId"); // Clear error if applicable
//     }

//     if (isValid) {
//         const payload = {
//             type: "AddRetailer",
//             apikey: apiKey,
//             retailName: retailerName
//         };

//         if (retailerAddress !== "") {
//             payload.retailAddress = retailerAddress;
//         }

//         console.log("Sending payload:", payload);

//         fetch("../api.php", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify(payload)
//         })
//             .then(response => response.json())
//             .then(data => {
//                 if (data.status === "success") {
//                     alert("Successfully added retailer!");
//                     if (retNameInput) retNameInput.value = "";
//                     if (retAddressInput) retAddressInput.value = "";
//                 } else {
//                     alert("Failed to add retailer: " + (data.data || "Unknown error."));
//                     console.error("API error:", data.data);
//                 }
//             })
//             .catch(error => {
//                 console.error("Network error adding retailer:", error);
//                 alert("Network error. Please check your connection.");
//             });
//     } else {
//         console.log("Validation failed. Not sending request.");
//     }
// });

// document.getElementById("btnUpdateRet").addEventListener("click", function (event) {
//     event.preventDefault();

//     let retNameInput = document.getElementsByName("retailName")[0];
//     let newRetNameInput = document.getElementsByName("newRetailName")[0];
//     let retAddressInput = document.getElementsByName("retailAddress")[0];

//     let isValid = true;
//     let curRetailerName = retNameInput ? retNameInput.value.trim() : "";
//     let newRetailerName = newRetNameInput ? newRetNameInput.value.trim() : "";
//     let retailerAddress = retAddressInput ? retAddressInput.value.trim() : "";

//     if (retailerName === "") {
//         alert("Retailer Name is required!");
//         isValid = false;
//     } else {
//         // clearError("retailNameInputId"); // Clear error if applicable
//     }

//     if (isValid && newRetailerName === "" && retailerAddress === "") {
//         alert("At least one field (New Retailer Name or New Retailer Address) must be provided to update the retailer."); // Use your showError function here
//         isValid = false;
//     }

//     if (isValid) {
//         const payload = {
//             type: "UpdateRetailer",
//             apikey: apiKey,
//             retailName: curRetailerName
//         };

//         if (retailerAddress !== "") {
//             payload.retailAddress = retailerAddress;
//         }
//         if (newRetailerName !== "") {
//             payload.newRetailName = newRetailerName;
//         }

//         console.log("Sending payload:", payload);

//         fetch("../api.php", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify(payload)
//         })
//             .then(response => response.json())
//             .then(data => {
//                 if (data.status === "success") {
//                     alert("Successfully updated retailer!");
//                     if (retNameInput) retNameInput.value = "";
//                     if (retAddressInput) retAddressInput.value = "";
//                     if (newRetNameInput) newRetNameInput.value = "";
//                 } else {
//                     alert("Failed to update retailer: " + (data.data || "Unknown error."));
//                     console.error("API error:", data.data);
//                 }
//             })
//             .catch(error => {
//                 console.error("Network error updating retailer:", error);
//                 alert("Network error. Please check your connection.");
//             });
//     } else {
//         console.log("Validation failed. Not sending request.");
//     }
// });

// document.getElementById("btnDelAcc").addEventListener("click", function (event) {
//     event.preventDefault();

//     let accToDeleteInput = document.getElementsByName("accToDeleteAPIKey")[0];

//     let isValid = true;
//     let apiKeyToDelete = accToDeleteInput ? accToDeleteInput.value.trim() : "";

//     if (apiKeyToDelete === "") {
//         alert("APIKey of account to delete is required!");
//         isValid = false;
//     } else {
//         // clearError("retailNameInputId"); // Clear error if applicable
//     }

//     if (isValid) {
//         const payload = {
//             type: "DeleteAccount",
//             apikey: apiKeyToDelete
//         };


//         console.log("Sending payload:", payload);

//         fetch("../api.php", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify(payload)
//         })
//             .then(response => response.json())
//             .then(data => {
//                 if (data.status === "success") {
//                     alert("Successfully deleted account!");
//                     if (accToDeleteInput) accToDeleteInput.value = "";
//                 } else {
//                     alert("Failed to delete account: " + (data.data || "Unknown error."));
//                     console.error("API error:", data.data);
//                 }
//             })
//             .catch(error => {
//                 console.error("Network error deleting account:", error);
//                 alert("Network error. Please check your connection.");
//             });
//     } else {
//         console.log("Validation failed. Not sending request.");
//     }
// });

// document.getElementById("btnChangeAcc").addEventListener("click", function (event) {
//     event.preventDefault();

//     let accToChangeInput = document.getElementsByName("accToChangeAPIKey")[0];

//     let isValid = true;
//     let apiKeyToChange = accToChangeInput ? accToChangeInput.value.trim() : "";

//     if (apiKeyToChange === "") {
//         alert("APIKey of account to change is required!");
//         isValid = false;
//     } else {
//         // clearError("retailNameInputId"); // Clear error if applicable
//     }

//     if (isValid) {
//         const payload = {
//             type: "MakeUserAdmin",
//             adminkey: apiKey,
//             targetkey: apiKeyToChange
//         };


//         console.log("Sending payload:", payload);

//         fetch("../api.php", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify(payload)
//         })
//             .then(response => response.json())
//             .then(data => {
//                 if (data.status === "success") {
//                     alert("Successfully changed account type!");
//                     if (accToChangeInput) accToChangeInput.value = "";
//                 } else {
//                     alert("Failed to change account type: " + (data.data || "Unknown error."));
//                     console.error("API error:", data.data);
//                 }
//             })
//             .catch(error => {
//                 console.error("Network error changing account type:", error);
//                 alert("Network error. Please check your connection.");
//             });
//     } else {
//         console.log("Validation failed. Not sending request.");
//     }
// });

// document.getElementById("btnDelRev").addEventListener("click", function (event) {
//     event.preventDefault();

//     let reviewerAPIKeyInput = document.getElementsByName("reviewerAPIKey")[0];
//     let productTitleInput = document.getElementsByName("prodTitle")[0];

//     let isValid = true;
//     let reviewerAPIKey = reviewerAPIKeyInput ? reviewerAPIKeyInput.value.trim() : "";
//     let prodTitle = productTitleInput ? productTitleInput.value.trim() : "";

//     if (reviewerAPIKey === "") {
//         alert("Reviewer API_Key is required!");
//         isValid = false;
//     } else {
//         // clearError("retailNameInputId"); // Clear error if applicable
//     }

//     if (prodTitle === "") {
//         alert("Product Title is required!");
//         isValid = false;
//     } else {
//         // clearError("retailNameInputId"); // Clear error if applicable
//     }

//     if (isValid) {
//         const payload = {
//             type: "removeReview",
//             apikey: apiKey,
//             Title: prodTitle,
//             userapikey: reviewerAPIKey
//         };


//         console.log("Sending payload:", payload);

//         fetch("../api.php", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify(payload)
//         })
//             .then(response => response.json())
//             .then(data => {
//                 if (data.status === "success") {
//                     alert("Successfully removed review!");
//                     if (reviewerAPIKeyInput) reviewerAPIKeyInput.value = "";
//                     if (productTitleInput) productTitleInput.value = "";
//                 } else {
//                     alert("Failed to remove review: " + (data.data || "Unknown error."));
//                     console.error("API error:", data.data);
//                 }
//             })
//             .catch(error => {
//                 console.error("Network error removing review:", error);
//                 alert("Network error. Please check your connection.");
//             });
//     } else {
//         console.log("Validation failed. Not sending request.");
//     }
// });

// document.getElementById("btnDelProd").addEventListener("click", function (event) {
//     event.preventDefault();

//     let prodToDeleteInput = document.getElementsByName("delProdTitleInput")[0];

//     let isValid = true;
//     let prodToDelete = prodToDeleteInput ? prodToDeleteInput.value.trim() : "";

//     if (prodToDelete === "") {
//         alert("Title of product to delete is required!");
//         isValid = false;
//     } else {
//         // clearError("retailNameInputId"); // Clear error if applicable
//     }

//     if (isValid) {
//         const payload = {
//             type: "deleteProduct",
//             apikey: apiKey,
//             productTitle: prodToDelete
//         };

//         console.log("Sending payload:", payload);

//         fetch("../api.php", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify(payload)
//         })
//             .then(response => response.json())
//             .then(data => {
//                 if (data.status === "success") {
//                     alert("Successfully deleted product!");
//                     if (prodToDeleteInput) prodToDeleteInput.value = "";
//                 } else {
//                     alert("Failed to delete product: " + (data.data || "Unknown error."));
//                     console.error("API error:", data.data);
//                 }
//             })
//             .catch(error => {
//                 console.error("Network error deleting product:", error);
//                 alert("Network error. Please check your connection.");
//             });
//     } else {
//         console.log("Validation failed. Not sending request.");
//     }
// });

// document.getElementById("btnUpProdPrice").addEventListener("click", function (event) {
//     event.preventDefault();

//     let prodToUpdateInput = document.getElementsByName("upProdTitleInput")[0];
//     let retailerNameInput = document.getElementsByName("retailerNameInput")[0];
//     let newPriceInput = document.getElementsByName("newProdPrice")[0];

//     let isValid = true;
//     let prodToUpdate = prodToUpdateInput ? prodToUpdateInput.value.trim() : "";
//     let retailerName = retailerNameInput ? retailerNameInput.value.trim() : "";
//     let newProdPriceString = newPriceInput ? newPriceInput.value.trim() : ""; // Keep original string for initial check

//     // Validation for empty strings first
//     if (prodToUpdate === "") {
//         alert("Title of product to update is required!");
//         isValid = false;
//     } else {
//         // clearError("prodTitleInputId"); // Example: clear specific error
//     }

//     if (retailerName === "") {
//         alert("Title of retailer selling the product to update is required!");
//         isValid = false;
//     } else {
//         // clearError("retailerNameInputId"); // Example: clear specific error
//     }

//     // Now, handle the price input
//     let newProdPrice; // Declare here
//     if (newProdPriceString === "") { // Check if the *original string* was empty
//         alert("New price to change to is required!");
//         isValid = false;
//     } else {
//         newProdPrice = parseFloat(newProdPriceString); // Parse only if not empty
//         if (isNaN(newProdPrice)) { // Check if parsing resulted in NaN
//             alert("New price must be a valid number!");
//             isValid = false;
//         } else if (newProdPrice < 0) { // Optional: Add check for non-negative price
//             alert("Price cannot be negative!");
//             isValid = false;
//         }
//         // else { clearError("newPriceInputId"); } // Example: clear specific error
//     }

//     if (isValid) {
//         const payload = {
//             type: "updateProductPrice",
//             apikey: apiKey,
//             productTitle: prodToUpdate,
//             retailer: retailerName,
//             newPrice: newProdPrice // This will now be a number
//         };

//         console.log("Sending payload:", payload);

//         fetch("../api.php", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify(payload)
//         })
//             .then(response => response.json())
//             .then(data => {
//                 if (data.status === "success") {
//                     alert("Successfully updated price!");
//                     if (prodToUpdateInput) prodToUpdateInput.value = "";
//                     if (retailerNameInput) retailerNameInput.value = "";
//                     if (newPriceInput) newPriceInput.value = "";
//                 } else {
//                     alert("Failed to update price: " + (data.data || "Unknown error."));
//                     console.error("API error:", data.data);
//                 }
//             })
//             .catch(error => {
//                 console.error("Network error updating price:", error);
//                 alert("Network error. Please check your connection.");
//             });
//     } else {
//         console.log("Validation failed. Not sending request.");
//     }
// });

// document.getElementById("btnAddProd").addEventListener("click", function (event) {
//     event.preventDefault();

//     // Get references to input elements
//     let prodToAddInput = document.getElementsByName("addProdTitleInput")[0];
//     let categoryInput = document.getElementsByName("addProdCatInput")[0];
//     let descriptionInput = document.getElementsByName("addProdDescInput")[0];
//     let brandInput = document.getElementsByName("addProdBrandInput")[0];
//     let imgUrlInput = document.getElementsByName("addImgUrlInput")[0];
//     let retailersInput = document.getElementsByName("addProdRetailersInput")[0];
//     let pricesInput = document.getElementsByName("addProdPricesInput")[0];

//     let isValid = true; // Flag to track overall form validity

//     // Get and trim raw string values from inputs
//     let prodToAdd = prodToAddInput ? prodToAddInput.value.trim() : "";
//     let category = categoryInput ? categoryInput.value.trim() : "";
//     let description = descriptionInput ? descriptionInput.value.trim() : "";
//     let brand = brandInput ? brandInput.value.trim() : "";
//     let imgUrl = imgUrlInput ? imgUrlInput.value.trim() : "";
//     let retailersRawString = retailersInput ? retailersInput.value.trim() : ""; // Renamed for clarity
//     let pricesRawString = pricesInput ? pricesInput.value.trim() : "";       // Renamed for clarity

//     // --- Validation Checks for single string inputs ---

//     if (prodToAdd === "") {
//         alert("Title of product is required!");
//         isValid = false;
//     }

//     if (category === "") {
//         alert("Category of product is required!");
//         isValid = false;
//     }

//     if (description === "") {
//         alert("Description of product is required!");
//         isValid = false;
//     }

//     if (brand === "") {
//         alert("Brand of product is required!");
//         isValid = false;
//     }

//     // Basic URL validation (can be more robust if needed)
//     if (imgUrl === "") {
//         alert("Image URL is required!");
//         isValid = false;
//     } else if (!/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)$/i.test(imgUrl)) {
//         alert("Please enter a valid image URL (e.g., starts with http/https and ends with common image extensions).");
//         isValid = false;
//     }

//     // --- Handling and Validation for Retailers (comma-separated string to array) ---
//     let retailersArray = [];
//     if (retailersRawString === "") {
//         alert("Retailers selling the product are required!");
//         isValid = false;
//     } else {
//         // Split the string by comma, trim each item, and filter out any empty strings
//         retailersArray = retailersRawString.split(',').map(item => item.trim()).filter(item => item !== "");
//         if (retailersArray.length === 0) {
//             alert("Please enter at least one valid retailer name.");
//             isValid = false;
//         }
//     }

//     // --- Handling and Validation for Prices (comma-separated string to array of numbers) ---
//     let pricesArray = [];
//     if (pricesRawString === "") {
//         alert("Prices of product at corresponding retailers are required!");
//         isValid = false;
//     } else {
//         // Split the string by comma, trim each item, and attempt to parse as float
//         let tempPrices = pricesRawString.split(',').map(item => item.trim());
//         let hasInvalidPrice = false; // Flag to track if any individual price is invalid

//         for (let i = 0; i < tempPrices.length; i++) {
//             const priceStr = tempPrices[i];
//             if (priceStr === "") { // Handle cases like "10,,20" or "10, ,20"
//                 alert("Please ensure all prices are valid numbers and not empty within the list.");
//                 hasInvalidPrice = true;
//                 isValid = false;
//                 break; // Stop checking further prices if one is invalid
//             }
//             let parsedPrice = parseFloat(priceStr);
//             if (isNaN(parsedPrice) || parsedPrice < 0) { // Check for NaN or negative price
//                 alert(`Price "${priceStr}" is not a valid non-negative number.`);
//                 hasInvalidPrice = true;
//                 isValid = false;
//                 break; // Stop checking further prices if one is invalid
//             }
//             pricesArray.push(parsedPrice);
//         }

//         // Additional check: Ensure number of retailers matches number of prices
//         // Only perform this check if general validation is still good and we have retailers
//         if (isValid && retailersArray.length > 0 && pricesArray.length !== retailersArray.length) {
//             alert("The number of retailers must match the number of prices.");
//             isValid = false;
//         }
//     }


//     // --- If all validations pass, proceed with API call ---
//     if (isValid) {
//         const payload = {
//             type: "addProduct",
//             apikey: apiKey, // Ensure apiKey is defined in your script
//             Title: prodToAdd,
//             Category: category,
//             Description: description,
//             Brand: brand,
//             Image_URL: imgUrl,
//             Retailers: retailersArray, // Now correctly an array of strings
//             Prices: pricesArray        // Now correctly an array of numbers
//         };

//         console.log("Sending payload:", payload);

//         fetch("../api.php", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify(payload)
//         })
//             .then(response => response.json())
//             .then(data => {
//                 if (data.status === "success") {
//                     alert("Successfully added product!");
//                     // Clear all input fields on success
//                     if (prodToAddInput) prodToAddInput.value = "";
//                     if (categoryInput) categoryInput.value = "";
//                     if (descriptionInput) descriptionInput.value = "";
//                     if (brandInput) brandInput.value = "";
//                     if (imgUrlInput) imgUrlInput.value = "";
//                     if (retailersInput) retailersInput.value = "";
//                     if (pricesInput) pricesInput.value = "";
//                 } else {
//                     alert("Failed to add product: " + (data.data || "Unknown error."));
//                     console.error("API error:", data.data);
//                 }
//             })
//             .catch(error => {
//                 console.error("Network error adding product:", error);
//                 alert("Network error. Please check your connection.");
//             });
//     } else {
//         console.log("Validation failed. Not sending request.");
//     }
// });

// document.getElementById("btnShowUsers").addEventListener("click", function (event) {
//     // event.preventDefault();


//     // const payload = {
//     //     type: "GetAllUsers",
//     //     apikey: apiKey
//     // };


//     // console.log("Sending payload:", payload);

//     // fetch("../api.php", {
//     //     method: "POST",
//     //     headers: {
//     //         "Content-Type": "application/json"
//     //     },
//     //     body: JSON.stringify(payload)
//     // })
//     //     .then(response => response.json())
//     //     .then(data => {
//     //         if (data.status === "success") {
//     //             alert("Successfully retrieved users!");
//     //         } else {
//     //             alert("Failed to retrieve users: " + (data.data || "Unknown error."));
//     //             console.error("API error:", data.data);
//     //         }
//     //     })
//     //     .catch(error => {
//     //         console.error("Network error retrieving users:", error);
//     //         alert("Network error. Please check your connection.");
//     //     });

//     event.preventDefault();

//     // Correct payload type to match the PHP API handler for users
//     const payload = {
//         type: "GetAllUsers", // Changed from "GetAllProducts" to "GetAllUsers"
//         apikey: apiKey      // Ensure apiKey is defined in your script
//     };

//     console.log("Sending payload:", payload);

//     fetch("../api.php", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify(payload)
//     })
//     .then(response => {
//         // Check if the response is OK (status code 200-299)
//         if (!response.ok) {
//             // If not, throw an error to be caught by .catch()
//             // This is important for handling HTTP errors (like 403, 400, 500 from PHP)
//             return response.json().then(errorData => {
//                 throw new Error(errorData.data || `HTTP error! Status: ${response.status}`);
//             });
//         }
//         return response.json();
//     })
//     .then(data => {
//         if (data.status === "success" && data.data) {
//             // Get the list container and modal elements
//             const usersListDiv = document.getElementById("usersList");
//             const usersModal = document.getElementById("usersModal");

//             usersListDiv.innerHTML = ''; // Clear previous content

//             if (data.data.length > 0) {
//                 // Create a table to display users
//                 const table = document.createElement('table');
//                 table.style.width = '100%';
//                 table.style.borderCollapse = 'collapse';

//                 // Table header
//                 const thead = table.createTHead();
//                 const headerRow = thead.insertRow();
//                 const emailHeader = document.createElement('th');
//                 emailHeader.textContent = 'Email';
//                 emailHeader.style.border = '1px solid #ddd';
//                 emailHeader.style.padding = '8px';
//                 emailHeader.style.textAlign = 'left';
//                 headerRow.appendChild(emailHeader);

//                 const apiKeyHeader = document.createElement('th');
//                 apiKeyHeader.textContent = 'API Key';
//                 apiKeyHeader.style.border = '1px solid #ddd';
//                 apiKeyHeader.style.padding = '8px';
//                 apiKeyHeader.style.textAlign = 'left';
//                 headerRow.appendChild(apiKeyHeader);
                
//                 // Table body
//                 const tbody = table.createTBody();
//                 data.data.forEach(user => {
//                     const row = tbody.insertRow();
//                     const emailCell = row.insertCell();
//                     emailCell.textContent = user.Email;
//                     emailCell.style.border = '1px solid #ddd';
//                     emailCell.style.padding = '8px';

//                     const apiKeyCell = row.insertCell();
//                     apiKeyCell.textContent = user.API_Key;
//                     apiKeyCell.style.border = '1px solid #ddd';
//                     apiKeyCell.style.padding = '8px';
//                 });
//                 usersListDiv.appendChild(table);

//             } else {
//                 usersListDiv.innerHTML = '<p>No users found.</p>';
//             }

//             // Display the modal
//             usersModal.style.display = "block";

//             // Add event listener to close button (if not already added globally)
//             const closeButton = usersModal.querySelector('.close-button');
//             if (closeButton) {
//                 closeButton.onclick = function() {
//                     usersModal.style.display = "none";
//                 }
//             }

//             // Optional: Close modal if user clicks outside of it
//             window.onclick = function(event) {
//                 if (event.target === usersModal) {
//                     usersModal.style.display = "none";
//                 }
//             }

//         } else {
//             // Handle API success status but empty or problematic data.data
//             alert("Failed to retrieve users: " + (data.data || "Unknown API response data."));
//             console.error("API error:", data.data);
//         }
//     })
//     .catch(error => {
//         console.error("Fetch error:", error);
//         alert("Error retrieving users: " + error.message); // Display error message from the thrown error
//     });
// });

// manage.js
// manage.js

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

// Function to show tooltip error
function showError(fieldElement, message) {
    if (!fieldElement) {
        console.error(`Field element not found for error display.`);
        return;
    }

    // Clear any existing tooltip for this field
    clearError(fieldElement);

    const tooltip = document.createElement('div');
    tooltip.className = 'error-tooltip';
    tooltip.textContent = message;
    tooltip.setAttribute('data-field-id', fieldElement.id || fieldElement.name); // Use ID or name for linking

    // Position the tooltip relative to the input field
    const rect = fieldElement.getBoundingClientRect();
    tooltip.style.position = 'absolute';
    tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`; // 5px below the input
    tooltip.style.left = `${rect.left + window.scrollX}px`;
    tooltip.style.backgroundColor = '#dc3545';
    tooltip.style.color = 'white';
    tooltip.style.padding = '5px 10px';
    tooltip.style.borderRadius = '3px';
    tooltip.style.zIndex = '1000';
    tooltip.style.whiteSpace = 'nowrap';
    tooltip.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    tooltip.style.opacity = '0';
    tooltip.style.transition = 'opacity 0.3s ease-in-out';

    document.body.appendChild(tooltip);

    setTimeout(() => {
        tooltip.style.opacity = '1';
    }, 10);

    fieldElement.classList.add('input-error-border');
}

// Function to clear tooltip error
function clearError(fieldElement) {
    const fieldIdOrName = fieldElement.id || fieldElement.name; // Get ID or name for lookup
    const existingTooltip = document.querySelector(`.error-tooltip[data-field-id="${fieldIdOrName}"]`); // Select based on attribute
    if (existingTooltip) {
        existingTooltip.style.opacity = '0';
        setTimeout(() => {
            existingTooltip.remove();
        }, 300);
    }
    if (fieldElement) {
        fieldElement.classList.remove('input-error-border');
    }
}

// Function to clear all error messages on the page
function clearAllErrors() {
    const errorTooltips = document.querySelectorAll('.error-tooltip');
    errorTooltips.forEach(tooltip => {
        tooltip.style.opacity = '0';
        setTimeout(() => {
            tooltip.remove();
        }, 300);
    });

    const errorBorders = document.querySelectorAll('.input-error-border');
    errorBorders.forEach(element => {
        element.classList.remove('input-error-border');
    });
}


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
        clearAllErrors(); // Clear all errors when switching forms
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

    let retNameInput = document.querySelector("#addRetForm input[name='retailName']"); // Select specific input
    let retAddressInput = document.querySelector("#addRetForm input[name='retailAddress']"); // Select specific input

    let isValid = true;
    let retailerName = retNameInput ? retNameInput.value.trim() : "";
    let retailerAddress = retAddressInput ? retAddressInput.value.trim() : "";

    if (retailerName === "") {
        showError(retNameInput, "Retailer Name is required!");
        isValid = false;
    } else {
        clearError(retNameInput);
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
                    alert("Successfully added retailer!"); // Consider changing this to a success tooltip
                    if (retNameInput) retNameInput.value = "";
                    if (retAddressInput) retAddressInput.value = "";
                    clearAllErrors(); // Clear errors on successful submission
                } else {
                    // For API errors, you might want a general error display or a specific one if possible
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

    let retNameInput = document.querySelector("#updateRetForm input[name='retailName']"); // Select specific input
    let newRetNameInput = document.querySelector("#updateRetForm input[name='newRetailName']"); // Select specific input
    let retAddressInput = document.querySelector("#updateRetForm input[name='retailAddress']"); // Select specific input

    let isValid = true;
    let curRetailerName = retNameInput ? retNameInput.value.trim() : "";
    let newRetailerName = newRetNameInput ? newRetNameInput.value.trim() : "";
    let retailerAddress = retAddressInput ? retAddressInput.value.trim() : "";

    if (curRetailerName === "") {
        showError(retNameInput, "Current Retailer Name is required!");
        isValid = false;
    } else {
        clearError(retNameInput);
    }

    if (isValid && newRetailerName === "" && retailerAddress === "") {
        showError(newRetNameInput, "At least one field (New Retailer Name or New Retailer Address) must be provided to update the retailer.");
        // We are intentionally showing the same error on both related fields if both are empty.
        // It's important to clear both when one becomes valid.
        showError(retAddressInput, "At least one field (New Retailer Name or New Retailer Address) must be provided to update the retailer.");
        isValid = false;
    } else {
        // If at least one of them is filled, clear errors for both.
        clearError(newRetNameInput);
        clearError(retAddressInput);
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
                    alert("Successfully updated retailer!"); // Consider changing this to a success tooltip
                    if (retNameInput) retNameInput.value = "";
                    if (retAddressInput) retAddressInput.value = "";
                    if (newRetNameInput) newRetNameInput.value = "";
                    clearAllErrors(); // Clear errors on successful submission
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

    let accToDeleteInput = document.querySelector("#delAccForm input[name='accToDeleteAPIKey']"); // Select specific input

    let isValid = true;
    let apiKeyToDelete = accToDeleteInput ? accToDeleteInput.value.trim() : "";

    if (apiKeyToDelete === "") {
        showError(accToDeleteInput, "APIKey of account to delete is required!");
        isValid = false;
    } else {
        clearError(accToDeleteInput);
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
                    alert("Successfully deleted account!"); // Consider changing this to a success tooltip
                    if (accToDeleteInput) accToDeleteInput.value = "";
                    clearAllErrors(); // Clear errors on successful submission
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

    let accToChangeInput = document.querySelector("#changeAccTypeForm input[name='accToChangeAPIKey']"); // Select specific input

    let isValid = true;
    let apiKeyToChange = accToChangeInput ? accToChangeInput.value.trim() : "";

    if (apiKeyToChange === "") {
        showError(accToChangeInput, "APIKey of account to change is required!");
        isValid = false;
    } else {
        clearError(accToChangeInput);
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
                    alert("Successfully changed account type!"); // Consider changing this to a success tooltip
                    if (accToChangeInput) accToChangeInput.value = "";
                    clearAllErrors(); // Clear errors on successful submission
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

    let reviewerAPIKeyInput = document.querySelector("#remRevForm input[name='reviewerAPIKey']"); // Select specific input
    let productTitleInput = document.querySelector("#remRevForm input[name='prodTitle']"); // Select specific input

    let isValid = true;
    let reviewerAPIKey = reviewerAPIKeyInput ? reviewerAPIKeyInput.value.trim() : "";
    let prodTitle = productTitleInput ? productTitleInput.value.trim() : "";

    if (reviewerAPIKey === "") {
        showError(reviewerAPIKeyInput, "Reviewer API_Key is required!");
        isValid = false;
    } else {
        clearError(reviewerAPIKeyInput);
    }

    if (prodTitle === "") {
        showError(productTitleInput, "Product Title is required!");
        isValid = false;
    } else {
        clearError(productTitleInput);
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
                    alert("Successfully removed review!"); // Consider changing this to a success tooltip
                    if (reviewerAPIKeyInput) reviewerAPIKeyInput.value = "";
                    if (productTitleInput) productTitleInput.value = "";
                    clearAllErrors(); // Clear errors on successful submission
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

    let prodToDeleteInput = document.querySelector("#delProdForm input[name='delProdTitleInput']"); // Select specific input

    let isValid = true;
    let prodToDelete = prodToDeleteInput ? prodToDeleteInput.value.trim() : "";

    if (prodToDelete === "") {
        showError(prodToDeleteInput, "Title of product to delete is required!");
        isValid = false;
    } else {
        clearError(prodToDeleteInput);
    }

    if (isValid) {
        const payload = {
            type: "deleteProduct",
            apikey: apiKey,
            productTitle: prodToDelete
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
                    alert("Successfully deleted product!"); // Consider changing this to a success tooltip
                    if (prodToDeleteInput) prodToDeleteInput.value = "";
                    clearAllErrors(); // Clear errors on successful submission
                } else {
                    alert("Failed to delete product: " + (data.data || "Unknown error."));
                    console.error("API error:", data.data);
                }
            })
            .catch(error => {
                console.error("Network error deleting product:", error);
                alert("Network error. Please check your connection.");
            });
    } else {
        console.log("Validation failed. Not sending request.");
    }
});

document.getElementById("btnUpProdPrice").addEventListener("click", function (event) {
    event.preventDefault();

    let prodToUpdateInput = document.querySelector("#updateProdPriceForm input[name='upProdTitleInput']");
    let retailerNameInput = document.querySelector("#updateProdPriceForm input[name='retailerNameInput']");
    let newPriceInput = document.querySelector("#updateProdPriceForm input[name='newProdPrice']");

    let isValid = true;
    let prodToUpdate = prodToUpdateInput ? prodToUpdateInput.value.trim() : "";
    let retailerName = retailerNameInput ? retailerNameInput.value.trim() : "";
    let newProdPriceString = newPriceInput ? newPriceInput.value.trim() : "";

    // Validation for empty strings first
    if (prodToUpdate === "") {
        showError(prodToUpdateInput, "Title of product to update is required!");
        isValid = false;
    } else {
        clearError(prodToUpdateInput);
    }

    if (retailerName === "") {
        showError(retailerNameInput, "Retailer selling the product to update is required!");
        isValid = false;
    } else {
        clearError(retailerNameInput);
    }

    let newProdPrice;
    if (newProdPriceString === "") {
        showError(newPriceInput, "New price to change to is required!");
        isValid = false;
    } else {
        newProdPrice = parseFloat(newProdPriceString);
        if (isNaN(newProdPrice)) {
            showError(newPriceInput, "New price must be a valid number!");
            isValid = false;
        } else if (newProdPrice < 0) {
            showError(newPriceInput, "Price cannot be negative!");
            isValid = false;
        } else {
            clearError(newPriceInput);
        }
    }

    if (isValid) {
        const payload = {
            type: "updateProductPrice",
            apikey: apiKey,
            productTitle: prodToUpdate,
            retailer: retailerName,
            newPrice: newProdPrice
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
                    alert("Successfully updated price!"); // Consider changing this to a success tooltip
                    if (prodToUpdateInput) prodToUpdateInput.value = "";
                    if (retailerNameInput) retailerNameInput.value = "";
                    if (newPriceInput) newPriceInput.value = "";
                    clearAllErrors(); // Clear errors on successful submission
                } else {
                    alert("Failed to update price: " + (data.data || "Unknown error."));
                    console.error("API error:", data.data);
                }
            })
            .catch(error => {
                console.error("Network error updating price:", error);
                alert("Network error. Please check your connection.");
            });
    } else {
        console.log("Validation failed. Not sending request.");
    }
});

document.getElementById("btnAddProd").addEventListener("click", function (event) {
    event.preventDefault();

    // Get references to input elements
    let prodToAddInput = document.querySelector("#addProdForm input[name='addProdTitleInput']");
    let categoryInput = document.querySelector("#addProdForm input[name='addProdCatInput']");
    let descriptionInput = document.querySelector("#addProdForm input[name='addProdDescInput']");
    let brandInput = document.querySelector("#addProdForm input[name='addProdBrandInput']");
    let imgUrlInput = document.querySelector("#addProdForm input[name='addImgUrlInput']");
    let retailersInput = document.querySelector("#addProdForm input[name='addProdRetailersInput']");
    let pricesInput = document.querySelector("#addProdForm input[name='addProdPricesInput']");

    let isValid = true; // Flag to track overall form validity

    // Get and trim raw string values from inputs
    let prodToAdd = prodToAddInput ? prodToAddInput.value.trim() : "";
    let category = categoryInput ? categoryInput.value.trim() : "";
    let description = descriptionInput ? descriptionInput.value.trim() : "";
    let brand = brandInput ? brandInput.value.trim() : "";
    let imgUrl = imgUrlInput ? imgUrlInput.value.trim() : "";
    let retailersRawString = retailersInput ? retailersInput.value.trim() : "";
    let pricesRawString = pricesInput ? pricesInput.value.trim() : "";

    // --- Validation Checks for single string inputs ---

    if (prodToAdd === "") {
        showError(prodToAddInput, "Title of product is required!");
        isValid = false;
    } else {
        clearError(prodToAddInput);
    }

    if (category === "") {
        showError(categoryInput, "Category of product is required!");
        isValid = false;
    } else {
        clearError(categoryInput);
    }

    if (description === "") {
        showError(descriptionInput, "Description of product is required!");
        isValid = false;
    } else {
        clearError(descriptionInput);
    }

    if (brand === "") {
        showError(brandInput, "Brand of product is required!");
        isValid = false;
    } else {
        clearError(brandInput);
    }

    // Basic URL validation (can be more robust if needed)
    if (imgUrl === "") {
        showError(imgUrlInput, "Image URL is required!");
        isValid = false;
    } else if (!/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)$/i.test(imgUrl)) {
        showError(imgUrlInput, "Please enter a valid image URL (e.g., starts with http/https and ends with common image extensions).");
        isValid = false;
    } else {
        clearError(imgUrlInput);
    }

    // --- Handling and Validation for Retailers (comma-separated string to array) ---
    let retailersArray = [];
    if (retailersRawString === "") {
        showError(retailersInput, "Retailers selling the product are required!");
        isValid = false;
    } else {
        retailersArray = retailersRawString.split(',').map(item => item.trim()).filter(item => item !== "");
        if (retailersArray.length === 0) {
            showError(retailersInput, "Please enter at least one valid retailer name.");
            isValid = false;
        } else {
            clearError(retailersInput);
        }
    }

    // --- Handling and Validation for Prices (comma-separated string to array of numbers) ---
    let pricesArray = [];
    if (pricesRawString === "") {
        showError(pricesInput, "Prices of product at corresponding retailers are required!");
        isValid = false;
    } else {
        let tempPrices = pricesRawString.split(',').map(item => item.trim());
        let hasInvalidPrice = false;

        for (let i = 0; i < tempPrices.length; i++) {
            const priceStr = tempPrices[i];
            if (priceStr === "") {
                showError(pricesInput, "Please ensure all prices are valid numbers and not empty within the list.");
                hasInvalidPrice = true;
                isValid = false;
                break;
            }
            let parsedPrice = parseFloat(priceStr);
            if (isNaN(parsedPrice) || parsedPrice < 0) {
                showError(pricesInput, `Price "${priceStr}" is not a valid non-negative number.`);
                hasInvalidPrice = true;
                isValid = false;
                break;
            }
            pricesArray.push(parsedPrice);
        }

        if (!hasInvalidPrice) {
            clearError(pricesInput);
        }

        if (isValid && retailersArray.length > 0 && pricesArray.length !== retailersArray.length) {
            showError(pricesInput, "The number of retailers must match the number of prices.");
            isValid = false;
        }
    }


    // --- If all validations pass, proceed with API call ---
    if (isValid) {
        const payload = {
            type: "addProduct",
            apikey: apiKey,
            Title: prodToAdd,
            Category: category,
            Description: description,
            Brand: brand,
            Image_URL: imgUrl,
            Retailers: retailersArray,
            Prices: pricesArray
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
                    alert("Successfully added product!"); // Consider changing this to a success tooltip
                    if (prodToAddInput) prodToAddInput.value = "";
                    if (categoryInput) categoryInput.value = "";
                    if (descriptionInput) descriptionInput.value = "";
                    if (brandInput) brandInput.value = "";
                    if (imgUrlInput) imgUrlInput.value = "";
                    if (retailersInput) retailersInput.value = "";
                    if (pricesInput) pricesInput.value = "";
                    clearAllErrors(); // Clear errors on successful submission
                } else {
                    alert("Failed to add product: " + (data.data || "Unknown error."));
                    console.error("API error:", data.data);
                }
            })
            .catch(error => {
                console.error("Network error adding product:", error);
                alert("Network error. Please check your connection.");
            });
    } else {
        console.log("Validation failed. Not sending request.");
    }
});

document.getElementById("btnShowUsers").addEventListener("click", function (event) {
    event.preventDefault();

    const payload = {
        type: "GetAllUsers",
        apikey: apiKey
    };

    console.log("Sending payload:", payload);

    fetch("../api.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.data || `HTTP error! Status: ${response.status}`);
            });
        }
        return response.json();
    })
    .then(data => {
        if (data.status === "success" && data.data) {
            const usersListDiv = document.getElementById("usersList");
            const usersModal = document.getElementById("usersModal");

            usersListDiv.innerHTML = '';

            if (data.data.length > 0) {
                const table = document.createElement('table');
                table.style.width = '100%';
                table.style.borderCollapse = 'collapse';

                const thead = table.createTHead();
                const headerRow = thead.insertRow();
                const emailHeader = document.createElement('th');
                emailHeader.textContent = 'Email';
                emailHeader.style.border = '1px solid #ddd';
                emailHeader.style.padding = '8px';
                emailHeader.style.textAlign = 'left';
                headerRow.appendChild(emailHeader);

                const apiKeyHeader = document.createElement('th');
                apiKeyHeader.textContent = 'API Key';
                apiKeyHeader.style.border = '1px solid #ddd';
                apiKeyHeader.style.padding = '8px';
                apiKeyHeader.style.textAlign = 'left';
                headerRow.appendChild(apiKeyHeader);
                
                const tbody = table.createTBody();
                data.data.forEach(user => {
                    const row = tbody.insertRow();
                    const emailCell = row.insertCell();
                    emailCell.textContent = user.Email;
                    emailCell.style.border = '1px solid #ddd';
                    emailCell.style.padding = '8px';

                    const apiKeyCell = row.insertCell();
                    apiKeyCell.textContent = user.API_Key;
                    apiKeyCell.style.border = '1px solid #ddd';
                    apiKeyCell.style.padding = '8px';
                });
                usersListDiv.appendChild(table);

            } else {
                usersListDiv.innerHTML = '<p>No users found.</p>';
            }

            usersModal.style.display = "block";

            const closeButton = usersModal.querySelector('.close-button');
            if (closeButton) {
                closeButton.onclick = function() {
                    usersModal.style.display = "none";
                }
            }

            window.onclick = function(event) {
                if (event.target === usersModal) {
                    usersModal.style.display = "none";
                }
            }

        } else {
            alert("Failed to retrieve users: " + (data.data || "Unknown API response data."));
            console.error("API error:", data.data);
        }
    })
    .catch(error => {
        console.error("Fetch error:", error);
        alert("Error retrieving users: " + error.message);
    });
});