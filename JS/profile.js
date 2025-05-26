// document.getElementById("btnLogout").addEventListener("click", function () {
//     window.location.href = "logout.php";
// });

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

// // Example usage:
// const apiKey = getCookie('api_key');

// const regexNameSurname = /^([A-Z][a-z]*(?:['\-]?[A-Z][a-z]*)*(?:\s[A-Z][a-z]*(?:['\-]?[A-Z][a-z]*)*)*)$/;
// const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
// const regexPhoneNr = /^\+?(\d{1,3})?[-.\s]?(\(?\d{3}\)?)[-.\s]?\d{3}[-.\s]?\d{4}$/;

// if (document.readyState === 'loading') {
//     document.addEventListener("DOMContentLoaded", initializeForm);
// } else {
//     initializeForm();
// }

// function initializeForm() {
//     // Get form elements
//     let curFname = document.getElementsByName("curName")[0];
//     let curSurname = document.getElementsByName("curSurname")[0];
//     let curEmail = document.getElementsByName("curEmail")[0];
//     let curPhoneNr = document.getElementsByName("curPhoneNr")[0];
//     let password = document.getElementsByName("curPwd")[0];
//     let curType = document.getElementById("curAcc");
//     let submit = document.getElementById("btnSave");

//     fetch("../api.php", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//             type: "GetUserDetails",
//             apikey: apiKey,
//         })
//     })
//         .then(response => response.json())
//         .then(data => {
//             if (data.status === "success") {
//                 console.log(data);
//                 if (curFname) curFname.value = data.data.Name;
//                 if (curSurname) curSurname.value = data.data.Surname;
//                 if (curEmail) curEmail.value = data.data.Email;
//                 if (curPhoneNr) {
//                     curPhoneNr.value = data.data.Cell_No ? data.data.Cell_No : "No Phone Number Saved";
//                 } if (password) password.value = "********";
//                 if (curType) curType.value = data.data.User_Type;
//             } else {
//                 // Show error
//                 console.error(data.data);
//             }
//         });

//     submit.addEventListener("click", function (event) {
//         event.preventDefault();

//         let isValid = true;

//         // Validate Name
//         if (!fname || fname.value.trim() === "") {
//             showError("errContName", "Name is required!");
//             isValid = false;
//         } else if (regexNameSurname.test(fname.value)) {
//             clearError("errContName");
//         } else {
//             showError("errContName", "Name can only contain letters. Capitalization is important!");
//             isValid = false;
//         }

//         // Validate Surname
//         if (!surname || surname.value.trim() === "") {
//             showError("errContSurname", "Surname is required!");
//             isValid = false;
//         } else if (regexNameSurname.test(surname.value)) {
//             clearError("errContSurname");
//         } else {
//             showError("errContSurname", "Surname can only contain letters. Capitalization is important!");
//             isValid = false;
//         }

//         // Validate Email
//         if (!email || email.value.trim() === "") {
//             showError("email-error", "Email is required!");
//             isValid = false;
//         } else if (regexEmail.test(email.value)) {
//             clearError("email-error");
//         } else {
//             showError("email-error", "Please enter a valid email address!");
//             isValid = false;
//         }

//         // Validate Phone (optional field)
//         if (phoneNr && phoneNr.value.trim() !== "") {
//             if (regexPhoneNr.test(phoneNr.value)) {
//                 clearError("phone-error");
//             } else {
//                 showError("phone-error", "Please enter a valid phone number!");
//                 isValid = false;
//             }
//         } else {
//             clearError("phone-error");
//         }

//         // Validate Password
//         if (!password || password.value.trim() === "") {
//             showError("password-error", "Password is required!");
//             isValid = false;
//         } else if (regexPassword.test(password.value)) {
//             clearError("password-error");
//         } else {
//             showError("password-error", "Password must be 8+ characters with upper/lowercase letters and numbers/symbols!");
//             isValid = false;
//         }

//         if (isValid) {


//             const form = document.getElementById("register-form"); // assuming your form has this ID
//             const formData = new FormData(form);
//             const json = Object.fromEntries(formData.entries());
//             if (json.Cell_No === "") { // Check if the value is an empty string
//                 delete json.Cell_No; // Remove the property from the object
//             }
//             json.type = "UpdateUserDetails";
//             console.log(json); // To check if form data is correctly formatted

//             fetch("../api.php", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify(json), // This is the form data in JSON
//             })
//                 .then(res => {
//                     if (res.ok) {
//                         console.log("Submitted successfully.");
//                     } else {
//                         console.error("API error:", res.status);
//                     }
//                 })
//                 .catch(err => console.error("Network error:", err));

//             console.log("✅ All validations passed. Would proceed with API call.");
//             alert("Form is valid!");
//         } else {
//             console.log("❌ Form has validation errors. Not submitting.");
//         }
//     });

// }
document.getElementById("btnLogout").addEventListener("click", function () {
    window.location.href = "logout.php";
});

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

const regexNameSurname = /^([A-Z][a-z]*(?:['\-]?[A-Z][a-z]*)*(?:\s[A-Z][a-z]*(?:['\-]?[A-Z][a-z]*)*)*)$/;
const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
const regexPhoneNr = /^\+?(\d{1,3})?[-.\s]?(\(?\d{3}\)?)[-.\s]?\d{3}[-.\s]?\d{4}$/;


if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", initializeForm);
} else {
    initializeForm();
}

// Function to show tooltip error
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) {
        console.error(`Field with ID '${fieldId}' not found for error display.`);
        return;
    }

    // Clear any existing tooltip for this field
    clearError(fieldId);

    const tooltip = document.createElement('div');
    tooltip.className = 'error-tooltip';
    tooltip.textContent = message;
    tooltip.setAttribute('data-field-id', fieldId); // Link tooltip to its field

    // Position the tooltip relative to the input field
    const rect = field.getBoundingClientRect();
    tooltip.style.position = 'absolute';
    tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`; // 5px below the input
    tooltip.style.left = `${rect.left + window.scrollX}px`;
    // Add these styles to your CSS file for better practice, but they work inline for now
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

    field.classList.add('input-error-border');
}

// Function to clear tooltip error
function clearError(fieldId) {
    const existingTooltip = document.querySelector(`.error-tooltip[data-field-id="${fieldId}"]`);
    if (existingTooltip) {
        existingTooltip.style.opacity = '0';
        setTimeout(() => {
            existingTooltip.remove();
        }, 300);
    }
    const field = document.getElementById(fieldId);
    if (field) {
        field.classList.remove('input-error-border');
    }
}


function initializeForm() {
    // Get current details elements (disabled)
    let curFname = document.getElementsByName("curName")[0];
    let curSurname = document.getElementsByName("curSurname")[0];
    let curEmail = document.getElementsByName("curEmail")[0];
    let curPhoneNr = document.getElementsByName("curPhoneNr")[0];
    let password = document.getElementsByName("curPwd")[0];
    let curType = document.getElementById("curAcc");

    // Get the NEW input fields for validation and update
    let fname = document.getElementById("name");
    let surname = document.getElementById("surname");
    let email = document.getElementById("email");
    let phoneNumber = document.getElementById("phoneNumber"); // Using 'phoneNumber' for the input ID
    let newPassword = document.getElementById("password");
    let typeSelect = document.getElementById("type");

    let submit = document.getElementById("btnSave");

    // Fetch current user details
    fetch("../api.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            type: "GetUserDetails",
            apikey: apiKey,
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                if (curFname) curFname.value = data.data.Name;
                if (curSurname) curSurname.value = data.data.Surname;
                if (curEmail) curEmail.value = data.data.Email;
                if (curPhoneNr) {
                    // Assuming data.data.Cell_No is the key from your GetUserDetails API for phone number
                    curPhoneNr.value = data.data.Cell_No ? data.data.Cell_No : "No Phone Number Saved";
                }
                if (password) password.value = "********";
                if (curType) curType.value = data.data.User_Type;
            } else {
                console.error("Failed to fetch user details:", data.data);
            }
        })
        .catch(error => {
            console.error("Network error fetching user details:", error);
        });


    submit.addEventListener("click", function (event) {
        event.preventDefault();

        let isValid = true; // Flag to track overall form validity
        const updatedFields = {}; // Object to store only the fields that are valid and non-empty

        // --- Name (Required Field) ---
        if (!fname || fname.value.trim() === "") {
            clearError("name");
        } else if (!regexNameSurname.test(fname.value)) {
            showError("name", "Name can only contain letters (e.g., John Doe).");
            isValid = false;
        } else {
            clearError("name");
            updatedFields.name = fname.value.trim(); // Add to updated fields if valid
        }

        // --- Surname (Required Field) ---
        if (!surname || surname.value.trim() === "") {
            clearError("surname");
        } else if (!regexNameSurname.test(surname.value)) {
            showError("surname", "Surname can only contain letters (e.g., Smith).");
            isValid = false;
        } else {
            clearError("surname");
            updatedFields.surname = surname.value.trim(); // Add to updated fields if valid
        }

        // --- Email (Required Field) ---
        if (!email || email.value.trim() === "") {
            clearError("email");
        } else if (!regexEmail.test(email.value)) {
            showError("email", "Please enter a valid email address!");
            isValid = false;
        } else {
            clearError("email");
            updatedFields.email = email.value.trim(); // Add to updated fields if valid
        }

        // --- Phone Number (Optional Field) ---
        // Check if a value is entered. Only validate if it's not empty.
        if (phoneNumber && phoneNumber.value.trim() !== "") {
            if (!regexPhoneNr.test(phoneNumber.value)) {
                showError("phoneNumber", "Please enter a valid phone number (e.g., +27831234567 or 0831234567)!");
                isValid = false;
            } else {
                clearError("phoneNumber");
                updatedFields.cell_no = phoneNumber.value.trim(); // API expects 'cell_no'
            }
        } else {
            clearError("phoneNumber"); // Clear error if optional field is empty
            // Do NOT add to updatedFields if empty, as per "Optional Fields" requirement
        }


        // --- Password (Required Field) ---
        if (!newPassword || newPassword.value.trim() === "") {

            clearError("password");
        } else
            if (!regexPassword.test(newPassword.value)) {
                showError("password", "Password must be 8+ characters with upper/lowercase, numbers, and symbols!");
                isValid = false;
            } else {
                clearError("password");
                updatedFields.password = newPassword.value.trim(); // Add to updated fields if valid
            }

        // --- Account Type (Required Field) ---
        // Assuming your select has id="type" and default value is not empty string
        // If it's a dropdown, usually all options are valid unless you have a "Select..." default.
        if (!typeSelect || typeSelect.value.trim() === "") {
            showError("type", "Account Type is required!");
            isValid = false;
        } else {
            clearError("type");
            updatedFields.type = typeSelect.value; // Add to updated fields if valid
        }


        // --- API Call Logic ---
        if (isValid) {
            // Check if at least one optional field has been provided for update
            const hasOptionalFields = Object.keys(updatedFields).length > 0;

            if (!hasOptionalFields) {
                // If only required fields were *initially* empty and now filled, but no optional fields changed,
                // you might want to prevent an empty update call.
                // However, with "UpdateUserDetails" and *all* the current fields being required,
                // this check is slightly redundant unless you convert some of them to optional.
                // For your current setup, it will always have 'name', 'surname', 'email', 'password', 'type' if valid.
                // The API spec says "at least one required" under Optional fields. This is slightly confusing.
                // Let's assume if any of the mutable fields are changed (name, surname, etc.), we send them.
            }

            // The API requires 'type' and 'apikey'
            updatedFields.type = "UpdateUserDetails"; // Add the type of API call
            updatedFields.apikey = apiKey; // Add the API key

            console.log("Sending to API:", updatedFields); // Check the payload before sending

            fetch("../api.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedFields), // Send only the valid and non-empty fields
            })
                .then(res => res.json()) // Assume API always returns JSON
                .then(data => {
                    if (data.status === "success") {
                        console.log("Submitted successfully:", data);
                        alert("Profile updated successfully!");
                        initializeForm(); // Re-fetch details to show updated values
                    } else {
                        console.error("API error:", data.data);
                        alert("Failed to update profile: " + data.data); // Display API-specific error
                    }
                })
                .catch(err => {
                    console.error("Network error:", err);
                    alert("Network error. Please check your connection.");
                });

            console.log("✅ All validations passed. Proceeding with API call.");
        } else {
            console.log("❌ Form has validation errors. Not submitting.");
        }
    });

}