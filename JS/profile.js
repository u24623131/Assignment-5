document.getElementById("btnLogout").addEventListener("click", function () {
    window.location.href = "logout.php";
});

function getCsrfToken() {
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    return metaTag ? metaTag.content : null;
}

document.getElementById("btnDeleteAccount").addEventListener("click", function (event) {
    event.preventDefault();

    if (!confirm("Are you absolutely sure you want to delete your account? This action cannot be undone.")) {
        console.log("Account deletion cancelled by user.");
        return;
    }

    const csrfToken = getCsrfToken();

    if (!csrfToken) {
        console.error("CSRF token not found. Aborting DeleteAccount request.");
        alert("Security error: CSRF token missing. Please refresh the page.");
        return;
    }

    const payload = {
        type: "DeleteAccount",
        apikey: apiKey
    };

    console.log("Sending payload:", payload);

    fetch("../api.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": csrfToken
        },
        body: JSON.stringify(payload)
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                alert("Successfully deleted account!");
                window.location.href = "logout.php";
            } else {
                alert("Failed to delete account: " + (data.data || "Unknown error."));
                console.error("API error:", data.data);
            }
        })
        .catch(error => {
            console.error("Network error deleting account:", error);
            alert("Network error. Please check your connection.");
        });

});

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) === 0) {
            return c.substring(nameEQ.length, c.length);
        }
    }
    return null;
}

const apiKey = getCookie('api_key');

const regexNameSurname = /^([A-Z][a-z]*(?:['\-]?[A-Z][a-z]*)*(?:\s[A-Z][a-z]*(?:['\-]?[A-Z][a-z]*)*)*)$/;
const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
const regexPhoneNr = /^\+?(\d{1,3})?[-.\s]?(\(?\d{3}\)?)[-.\s]?\d{3}[-.\s]?\d{4}$/;


// Function to show tooltip error
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) {
        console.error(`Field with ID '${fieldId}' not found for error display.`);
        return;
    }

    clearError(fieldId);

    const tooltip = document.createElement('div');
    tooltip.className = 'error-tooltip';
    tooltip.textContent = message;
    tooltip.setAttribute('data-field-id', fieldId);

    const rect = field.getBoundingClientRect();
    tooltip.style.position = 'absolute';
    tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`;
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

function deleteCookie(name, path = '/') {
    // Set cookie with past expiration date to delete it
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=" + path + "; SameSite=Lax";
    console.log(`Cookie '${name}' deleted.`);
}

// Function to initialize or re-initialize form data
function initializeForm() {
    const csrfToken = getCsrfToken();

    if (!csrfToken) {
        console.error("CSRF token not found. Aborting DeleteAccount request.");
        alert("Security error: CSRF token missing. Please refresh the page.");
        return;
    }
    // Get current details elements (disabled)
    let curFname = document.getElementsByName("curName")[0];
    let curSurname = document.getElementsByName("curSurname")[0];
    let curEmail = document.getElementsByName("curEmail")[0];
    let curPhoneNr = document.getElementsByName("curPhoneNr")[0];
    let curType = document.getElementById("curAcc");

    // Fetch current user details
    fetch("../api.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": csrfToken
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
                    curPhoneNr.value = data.data.Cell_No ? data.data.Cell_No : "No Phone Number Saved";
                }
                if (curType) curType.value = data.data.User_Type;
            } else {
                console.error("Failed to fetch user details:", data.data);
            }
        })
        .catch(error => {
            console.error("Network error fetching user details:", error);
        });

    fetch("../api.php", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken
    },
    body: JSON.stringify({
        type: "GetUserXP",
        apikey: apiKey,
    })
})
.then(response => response.json())
.then(data => {
    if (data.status === "success") {
        const xp = data.data.XP;
        let level;
        
        document.getElementById("expDisplay").innerHTML = "Experience: " + xp;
        
        // Determine level based on XP
        if (xp < 100) {
            level = 0;
            document.getElementById("lvlDisplay").innerHTML = "Level: 0";
        } else if (xp < 200) {
            level = 1;
            document.getElementById("lvlDisplay").innerHTML = "Level: 1";
        } else if (xp < 300) {
            level = 2;
            document.getElementById("lvlDisplay").innerHTML = "Level: 2";
        } else {
            level = 3;
            document.getElementById("lvlDisplay").innerHTML = "Level: 3";
        }
        
        // Set the level cookie with improved management
        console.log(`Setting level cookie to: ${level} (XP: ${xp})`);
        setLevelCookie(level);
        
        // Alternative: Use the more forceful approach if regular method doesn't work
        // forceSetLevelCookie(level);
        
    } else {
        console.error("Failed to fetch user experience:", data.data);
    }
})
.catch(error => {
    console.error("Network error fetching user experience:", error);
});
}

function forceSetLevelCookie(level) {
    const cookieName = 'temp_user_level';
    
    // Always delete first, regardless of existence
    deleteCookie(cookieName);
    
    // Small delay to ensure deletion is processed
    setTimeout(() => {
        const d = new Date();
        d.setTime(d.getTime() + (24 * 60 * 60 * 1000));
        const expires = "expires=" + d.toUTCString();
        
        document.cookie = cookieName + "=" + level + ";" + expires + ";path=/;SameSite=Lax";
        
        console.log(`Cookie '${cookieName}' forcefully set to:`, level);
        
        // Verify after a short delay
        setTimeout(() => {
            const verifySetCookie = getCookie(cookieName);
            if (verifySetCookie === level.toString()) {
                console.log(`✅ Cookie successfully verified with value: ${verifySetCookie}`);
            } else {
                console.error(`❌ Cookie verification failed. Expected: ${level}, Got: ${verifySetCookie}`);
            }
        }, 100);
    }, 100);
}

function setLevelCookie(level) {
        const cookieName = 'temp_user_level';
    
    // Check if cookie already exists
    const existingCookie = getCookie(cookieName);
    
    if (existingCookie !== null) {
        console.log(`Existing cookie found with value: ${existingCookie}`);
        // Delete the existing cookie first
        deleteCookie(cookieName);
    }
    
    // Create new cookie with updated level
    const d = new Date();
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000)); // Cookie expires in 1 day
    const expires = "expires=" + d.toUTCString();
    
    // Set the new cookie
    document.cookie = cookieName + "=" + level + ";" + expires + ";path=/;SameSite=Lax";
    
    console.log(`Cookie '${cookieName}' set to:`, level);
    
    // Verify the cookie was set correctly
    const verifySetCookie = getCookie(cookieName);
    if (verifySetCookie === level.toString()) {
        console.log(`✅ Cookie successfully verified with value: ${verifySetCookie}`);
        
        // Notify coupon system of level change (if it exists)
        if (typeof window.updateUserLevel === 'function') {
            console.log('Notifying coupon system of level change');
            window.updateUserLevel(level);
        }
        
    } else {
        console.error(`❌ Cookie verification failed. Expected: ${level}, Got: ${verifySetCookie}`);
    }
}


document.addEventListener('DOMContentLoaded', function() {
    const btnExpHelp = document.getElementById('btnExpHelp');
    const expHelpModal = document.getElementById('expHelpModal');
    const closeExpHelpModal = document.getElementById('closeExpHelpModal');

    // Toggle visibility of the modal
    if (btnExpHelp) {
        btnExpHelp.addEventListener('click', function() {
            if (expHelpModal) {
                expHelpModal.style.display = 'block'; // Show the modal
            }
        });
    }

    // Close the modal when the close button is clicked
    if (closeExpHelpModal) {
        closeExpHelpModal.addEventListener('click', function() {
            if (expHelpModal) {
                expHelpModal.style.display = 'none'; // Hide the modal
            }
        });
    }

    // Close the modal if the user clicks anywhere outside the modal content
    if (expHelpModal) {
        window.addEventListener('click', function(event) {
            if (event.target === expHelpModal) {
                expHelpModal.style.display = 'none';
            }
        });
    }
});

// Call initializeForm on DOMContentLoaded to populate initial data
if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", initializeForm);
} else {
    initializeForm();
}


// Attach the submit event listener ONLY ONCE after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    const submit = document.getElementById("btnSave");
    // Get the NEW input fields for validation and update
    const fname = document.getElementById("name");
    const surname = document.getElementById("surname");
    const email = document.getElementById("email");
    const phoneNumber = document.getElementById("phoneNumber");
    const curPasswordInput = document.getElementById("curPasswordInput");
    const newPasswordInput = document.getElementById("newPasswordInput");

    submit.addEventListener("click", function (event) {
        event.preventDefault();

        let isValid = true;
        const updatedUserDetailsFields = {};
        let oldPassword = null;
        let newPasswordVal = null;

        const csrfToken = getCsrfToken();

        if (!csrfToken) {
            console.error("CSRF token not found. Aborting DeleteAccount request.");
            alert("Security error: CSRF token missing. Please refresh the page.");
            return;
        }

        // --- Name (Optional Field for User Details Update) ---
        if (fname && fname.value.trim() !== "") {
            if (!regexNameSurname.test(fname.value)) {
                showError("name", "Name can only contain letters (e.g., John Doe).");
                isValid = false;
            } else {
                clearError("name");
                updatedUserDetailsFields.name = fname.value.trim();
            }
        } else {
            clearError("name");
        }

        // --- Surname (Optional Field for User Details Update) ---
        if (surname && surname.value.trim() !== "") {
            if (!regexNameSurname.test(surname.value)) {
                showError("surname", "Surname can only contain letters (e.g., Smith).");
                isValid = false;
            } else {
                clearError("surname");
                updatedUserDetailsFields.surname = surname.value.trim();
            }
        } else {
            clearError("surname");
        }

        // --- Email (Optional Field for User Details Update) ---
        if (email && email.value.trim() !== "") {
            if (!regexEmail.test(email.value)) {
                showError("email", "Please enter a valid email address!");
                isValid = false;
            } else {
                clearError("email");
                updatedUserDetailsFields.email = email.value.trim();
            }
        } else {
            clearError("email");
        }

        // --- Phone Number (Optional Field for User Details Update) ---
        if (phoneNumber && phoneNumber.value.trim() !== "") {
            if (!regexPhoneNr.test(phoneNumber.value)) {
                showError("phoneNumber", "Please enter a valid phone number (e.g., +27831234567 or 0831234567)!");
                isValid = false;
            } else {
                clearError("phoneNumber");
                updatedUserDetailsFields.cell_no = phoneNumber.value.trim();
            }
        } else {
            clearError("phoneNumber");
        }

        // --- Password Change Logic ---
        const isPasswordChangeAttempted = (curPasswordInput && curPasswordInput.value.trim() !== "") ||
            (newPasswordInput && newPasswordInput.value.trim() !== "");

        if (isPasswordChangeAttempted) {
            // Old Password (Required for password change)
            if (!curPasswordInput || curPasswordInput.value.trim() === "") {
                showError("curPasswordInput", "Current password is required to change password!");
                isValid = false;
            } else {
                clearError("curPasswordInput");
                oldPassword = curPasswordInput.value.trim();
            }

            // New Password (Required for password change, and must meet regex)
            if (!newPasswordInput || newPasswordInput.value.trim() === "") {
                showError("newPasswordInput", "New password is required!");
                isValid = false;
            } else if (!regexPassword.test(newPasswordInput.value)) {
                showError("newPasswordInput", "New password must be 8+ characters with upper/lowercase, numbers, and symbols!");
                isValid = false;
            } else {
                clearError("newPasswordInput");
                newPasswordVal = newPasswordInput.value.trim();
            }

            // Additional check: New password should not be the same as old password
            if (oldPassword === newPasswordVal && oldPassword !== null) {
                showError("newPasswordInput", "New password cannot be the same as the current password.");
                isValid = false;
            }
        } else {
            clearError("curPasswordInput");
            clearError("newPasswordInput");
        }

        // Determine if any update attempt was made (either user details or password)
        const hasUserDetailsToUpdate = Object.keys(updatedUserDetailsFields).length > 0;
        const isAnyChangeAttempted = hasUserDetailsToUpdate || isPasswordChangeAttempted;


        // --- API Call Logic ---
        if (isValid) {
            if (!isAnyChangeAttempted) {
                alert("No changes detected. Please update at least one field or attempt a password change to save.");
                console.log("No changes detected to update.");
                return;
            }

            const fetchPromises = [];

            if (hasUserDetailsToUpdate) {
                const userDetailsPayload = {
                    type: "UpdateUserDetails",
                    apikey: apiKey,
                    ...updatedUserDetailsFields
                };
                console.log("Sending User Details to API:", userDetailsPayload);

                fetchPromises.push(
                    fetch("../api.php", {
                        method: "POST",
                        headers: { "Content-Type": "application/json", "X-CSRF-Token": csrfToken },
                        body: JSON.stringify(userDetailsPayload),
                    })
                        .then(res => {
                            if (!res.ok) {
                                return res.json().then(errorData => {
                                    throw new Error(errorData.data || `HTTP error! Status: ${res.status}`);
                                });
                            }
                            return res.json();
                        })
                        .then(data => {
                            if (data.status === "success") {
                                console.log("User details updated successfully:", data);
                                return { success: true, message: "User details updated." };
                            } else {
                                throw new Error("Failed to update user details: " + (data.data || "Unknown error."));
                            }
                        })
                );
            }

            if (isPasswordChangeAttempted && oldPassword && newPasswordVal) {
                const passwordChangePayload = {
                    type: "ChangePassword",
                    apikey: apiKey,
                    oldPassword: oldPassword,
                    newPassword: newPasswordVal
                };
                console.log("Sending Password Change to API:", passwordChangePayload);

                fetchPromises.push(
                    fetch("../api.php", {
                        method: "POST",
                        headers: { "Content-Type": "application/json", "X-CSRF-Token": csrfToken },
                        body: JSON.stringify(passwordChangePayload),
                    })
                        .then(res => {
                            if (!res.ok) {
                                return res.json().then(errorData => {
                                    throw new Error(errorData.data || `HTTP error! Status: ${res.status}`);
                                });
                            }
                            return res.json();
                        })
                        .then(data => {
                            if (data.status === "success") {
                                console.log("Password changed successfully:", data);
                                return { success: true, message: "Password changed." };
                            } else {
                                throw new Error("Failed to change password: " + (data.data || "Unknown error."));
                            }
                        })
                );
            }

            if (fetchPromises.length > 0) {
                Promise.all(fetchPromises)
                    .then(results => {
                        const allSuccess = results.every(res => res.success);
                        if (allSuccess) {
                            alert("Profile updated successfully!");
                            initializeForm(); // Re-fetch details to show updated values
                            // Clear password fields only after successful update
                            if (curPasswordInput) curPasswordInput.value = "";
                            if (newPasswordInput) newPasswordInput.value = "";
                        }
                    })
                    .catch(err => {
                        console.error("API error during profile update:", err);
                        alert("Error updating profile: " + err.message);
                    });
            }

            console.log("✅ All validations passed. Proceeding with API call(s).");
        } else {
            console.log("❌ Form has validation errors. Not submitting.");
        }
    });
});