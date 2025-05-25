const regexNameSurname = /^([A-Z][a-z]*(?:['\-]?[A-Z][a-z]*)*(?:\s[A-Z][a-z]*(?:['\-]?[A-Z][a-z]*)*)*)$/;
const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

document.addEventListener("DOMContentLoaded", function () {
    let fname = document.getElementsByName("name")[0];
    let surname = document.getElementsByName("surname")[0];
    let email = document.getElementsByName("email")[0];
    let password = document.getElementsByName("password")[0];
    let passwordconf = document.getElementsByName("password_conf")[0];
    let type = document.getElementsByName("type")[0];
    let submit = document.getElementsByName("submit")[0]; // or getElementById("submit");

    if (submit) {
        submit.addEventListener("click", function (event) {
            event.preventDefault();
            // Logging to check the values

            if (regexNameSurname.test(fname.value)) {
                let errorContainer = document.getElementById("errorContName");
                if (errorContainer != null) {
                    errorContainer.innerHTML = "";
                }
            }
            else {
                let errorContainer = document.getElementById("errorContName");

                // Optional: Clear any previous messages
                errorContainer.innerHTML = "";

                // Create a <p> element
                let errorMsg = document.createElement("p");
                errorMsg.innerHTML = "Name can only contain letters of the alphabet.<br>Capitalization is important!";
                errorMsg.style.fontSize = "12px";
                errorMsg.style.color = "red"; // You can style it however you want

                // Append the <p> to the container
                errorContainer.appendChild(errorMsg);
            }

            if (regexNameSurname.test(surname.value)) {
                let errorContainer = document.getElementById("errorContSurname");
                if (errorContainer != null) {
                    errorContainer.innerHTML = "";
                }
            }
            else {
                let errorContainer = document.getElementById("errorContSurname");

                // Optional: Clear any previous messages
                errorContainer.innerHTML = "";

                // Create a <p> element
                let errorMsg = document.createElement("p");
                errorMsg.innerHTML = "Surname can only contain letters of the alphabet<br>and certain characters like ' or -.<br>Capitalization is important!";
                errorMsg.style.fontSize = "12px";
                errorMsg.style.color = "red"; // You can style it however you want

                // Append the <p> to the container
                errorContainer.appendChild(errorMsg);
            }


            if (regexEmail.test(email.value)) {
                let errorContainer = document.getElementById("errorContEmail");
                if (errorContainer != null) {
                    errorContainer.innerHTML = "";
                }
            }
            else {
                let errorContainer = document.getElementById("errorContEmail");

                // Optional: Clear any previous messages
                errorContainer.innerHTML = "";

                // Create a <p> element
                let errorMsg = document.createElement("p");
                errorMsg.innerHTML = "Please enter a valid email address!";
                errorMsg.style.fontSize = "12px";
                errorMsg.style.color = "red"; // You can style it however you want

                // Append the <p> to the container
                errorContainer.appendChild(errorMsg);
            }

            if (regexPassword.test(password.value)) {
                let errorContainer = document.getElementById("errorContPwd");
                if (errorContainer != null) {
                    errorContainer.innerHTML = "";
                }
            }
            else {
                let errorContainer = document.getElementById("errorContPwd");

                // Optional: Clear any previous messages
                errorContainer.innerHTML = "";

                // Create a <p> element
                let errorMsg = document.createElement("p");
                errorMsg.innerHTML = "Password must conform to the following:<br>8 characters or more<br>Contain both upper and lowercase letters of the alphabet<br>Contain atleast one number or special character(!@#$%^&*()_+-=[]{};':\"|,.<>\\\/?)";
                errorMsg.style.fontSize = "12px";
                errorMsg.style.color = "red"; // You can style it however you want

                // Append the <p> to the container
                errorContainer.appendChild(errorMsg);
            }


            if (password.value == passwordconf.value) {
                let errorContainer = document.getElementById("error-container");
                if (errorContainer != null) {
                    errorContainer.innerHTML = "";
                }
            }
            else {
                let errorContainer = document.getElementById("error-container");

                // Optional: Clear any previous messages
                errorContainer.innerHTML = "";

                // Create a <p> element
                let errorMsg = document.createElement("p");
                errorMsg.textContent = "Passwords don't match!";
                errorMsg.style.fontSize = "12px";
                errorMsg.style.color = "red"; // You can style it however you want

                // Append the <p> to the container
                errorContainer.appendChild(errorMsg);
            }

            if ((password.value == passwordconf.value) && (regexNameSurname.test(fname.value) && regexNameSurname.test(surname.value) && regexEmail.test(email.value) && regexPassword.test(password.value))) {
                //console.log("true");

                const form = document.getElementById("signupForm"); // assuming your form has this ID
                const formData = new FormData(form);
                const json = Object.fromEntries(formData.entries());
                json.type = "Register";
                console.log(json); // To check if form data is correctly formatted

                fetch("../../api.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(json), // This is the form data in JSON
                })
                .then(res => {
                    if (res.ok) {
                        console.log("Submitted successfully.");
                    } else {
                        console.error("API error:", res.status);
                    }
                })
                .catch(err => console.error("Network error:", err));
                // .then(async (res) => {
                //     const contentType = res.headers.get("content-type");
                //     if (contentType && contentType.includes("application/json")) {
                //         return res.json();
                //     } else {
                //         throw new Error("Invalid response format. Expected JSON.");
                //     }
                // })
                // .then((data) => console.log("Response:", data))
                // .catch((err) => console.error("Error:", err));
                
                
            }
        });
    } else {
        console.error("Submit button not found!");
    }

       const themeToggleSelect = document.getElementById("theme-toggle");
    const body = document.body; // Get the body element

    // Define the class name for dark mode
    const darkModeClass = 'dark-mode';
    const localStorageKey = 'themePreference'; // Key for localStorage (renamed for clarity)

    // 2. Function to apply the theme state
    function applyThemePreference(theme) {
        if (theme === 'Dark') {
            body.classList.add(darkModeClass);
            console.log("Dark theme applied.");
        } else { // Assuming 'Light' is the other option
            body.classList.remove(darkModeClass);
             console.log("Light theme applied.");
        }
        // Optional: Update the select dropdown value to match the applied theme
         if (themeToggleSelect) {
             themeToggleSelect.value = theme;
         }
    }

    // 3. Load the saved preference on page load
    const savedPreference = localStorage.getItem(localStorageKey);

    if (savedPreference !== null) {
        // If a preference is saved, apply it
        applyThemePreference(savedPreference); // Use the saved value ('Light' or 'Dark')
    } else {
        // Optional: Check user's system preference (prefers-color-scheme)
        // if no preference is saved yet, and no 'selected' attribute is on options.
        // If you rely on <option selected>, you might skip this system check.
        // Let's check the *initially selected* option in HTML first as a fallback.
        const initiallySelectedOption = themeToggleSelect ? themeToggleSelect.value : 'Light'; // Default to 'Light' if select not found

        if (initiallySelectedOption) {
             applyThemePreference(initiallySelectedOption);
        } else {
             // Fallback to system preference if no saved preference and no default selected option
             if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                applyThemePreference('Dark');
             } else {
                applyThemePreference('Light'); // Default to light if system preference is not dark
             }
        }
    }


    // 4. Add event listener to the select dropdown
    if (themeToggleSelect) {
        themeToggleSelect.addEventListener("change", function() {
            // Get the selected value from the dropdown
            const selectedTheme = this.value; // Will be "Light" or "Dark"

            // Apply the selected theme
            applyThemePreference(selectedTheme);

            // Save the selected preference to localStorage
            try {
                localStorage.setItem(localStorageKey, selectedTheme);
                 console.log("Theme preference saved:", selectedTheme);
            } catch (e) {
                 console.error("Failed to save theme preference to localStorage:", e);
            }
        });
    } else {
        console.warn("Theme toggle select element not found (#theme-toggle).");
    }
});

