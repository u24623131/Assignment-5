const regexNameSurname = /^([A-Z][a-z]*(?:['\-]?[A-Z][a-z]*)*(?:\s[A-Z][a-z]*(?:['\-]?[A-Z][a-z]*)*)*)$/;
const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
const regexPhoneNr = /^\+?(\d{1,3})?[-.\s]?(\(?\d{3}\)?)[-.\s]?\d{3}[-.\s]?\d{4}$/;

if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", initializeForm);
} else {
    initializeForm();
}

function getCsrfToken() {
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    return metaTag ? metaTag.content : null;
}

function initializeForm() {
    // Get form elements
    let fname = document.getElementsByName("Name")[0];
    let surname = document.getElementsByName("Surname")[0]; // First email field is surname
    let email = document.getElementsByName("Email")[0];   // Second email field is actual email
    let phoneNr = document.getElementsByName("Cell_No")[0];
    let password = document.getElementsByName("Password")[0];
    let type = document.getElementsByName("User_Type")[0];
    let submit = document.getElementById("btnSignUp");

    if (!submit) {
        console.error("❌ CRITICAL: Submit button not found!");
        return;
    }

    // Function to show error messages
    function showError(errorId, message) {
        const errorElement = document.getElementById(errorId);

        if (!errorElement) {
            console.error(`❌ Error element ${errorId} not found!`);
            return false;
        }

        errorElement.innerHTML = message;
        errorElement.style.display = "block";

        // Add error class to input container if it exists
        const containerId = errorId.replace('errCont', '').toLowerCase() + '-container';
        const container = document.getElementById(containerId);
        if (container) {
            container.classList.add('error');
        }

        return true;
    }

    // Function to clear error messages
    function clearError(errorId) {
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.innerHTML = "";
            errorElement.style.display = "none";
        }

        // Remove error class from input container
        const containerId = errorId.replace('errCont', '').toLowerCase() + '-container';
        const container = document.getElementById(containerId);
        if (container) {
            container.classList.remove('error');
        }
    }

    submit.addEventListener("click", function (event) {
        event.preventDefault();

        const csrfToken = getCsrfToken();

        if (!csrfToken) {
            console.error("CSRF token not found. Aborting DeleteAccount request.");
            alert("Security error: CSRF token missing. Please refresh the page.");
            return;
        }

        let isValid = true;

        // Validate Name
        if (!fname || fname.value.trim() === "") {
            showError("errContName", "Name is required!");
            isValid = false;
        } else if (regexNameSurname.test(fname.value)) {
            clearError("errContName");
        } else {
            showError("errContName", "Name can only contain letters. Capitalization is important!");
            isValid = false;
        }

        // Validate Surname
        if (!surname || surname.value.trim() === "") {
            showError("errContSurname", "Surname is required!");
            isValid = false;
        } else if (regexNameSurname.test(surname.value)) {
            clearError("errContSurname");
        } else {
            showError("errContSurname", "Surname can only contain letters. Capitalization is important!");
            isValid = false;
        }

        // Validate Email
        if (!email || email.value.trim() === "") {
            showError("email-error", "Email is required!");
            isValid = false;
        } else if (regexEmail.test(email.value)) {
            clearError("email-error");
        } else {
            showError("email-error", "Please enter a valid email address!");
            isValid = false;
        }

        // Validate Phone (optional field)
        if (phoneNr && phoneNr.value.trim() !== "") {
            if (regexPhoneNr.test(phoneNr.value)) {
                clearError("phone-error");
            } else {
                showError("phone-error", "Please enter a valid phone number!");
                isValid = false;
            }
        } else {
            clearError("phone-error");
        }

        // Validate Password
        if (!password || password.value.trim() === "") {
            showError("password-error", "Password is required!");
            isValid = false;
        } else if (regexPassword.test(password.value)) {
            clearError("password-error");
        } else {
            showError("password-error", "Password must be 8+ characters with upper/lowercase letters and numbers/symbols!");
            isValid = false;
        }

        if (isValid) {


            const form = document.getElementById("register-form"); // assuming your form has this ID
            const formData = new FormData(form);
            const json = Object.fromEntries(formData.entries());
            if (json.Cell_No === "") { // Check if the value is an empty string
                delete json.Cell_No; // Remove the property from the object
            }
            json.type = "Register";
            //console.log(json); // To check if form data is correctly formatted

            fetch("../api.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-Token": csrfToken
                },
                body: JSON.stringify(json), // This is the form data in JSON
            })
                .then(res => {
                    if (res.ok) {
                        //console.log("Submitted successfully.");
                        window.location.href = "login.php";
                    } else {
                        console.error("API error:", res.status);
                    }
                })
                .catch(err => console.error("Network error:", err));

            console.log("✅ All validations passed. Would proceed with API call.");
            //alert("Form is valid!");
        } else {
            console.log("❌ Form has validation errors. Not submitting.");
        }
    });
}