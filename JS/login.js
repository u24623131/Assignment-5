const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

document.addEventListener("DOMContentLoaded", function () {
    let email = document.getElementsByName("Email")[0];
    let password = document.getElementsByName("Password")[0];
    let submit = document.getElementById("btnLogin"); // or getElementById("submit");

    if (submit) {
        submit.addEventListener("click", function (event) {
            event.preventDefault();
            // Logging to check the values
            if (regexEmail.test(email.value)) {
                let errorContainer = document.getElementById("email-error");
                if (errorContainer != null) {
                    errorContainer.innerHTML = "";
                }
            }
            else {
                let errorContainer = document.getElementById("email-error");

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
                let errorContainer = document.getElementById("password-error");
                if (errorContainer != null) {
                    errorContainer.innerHTML = "";
                }
            }
            else {
                let errorContainer = document.getElementById("password-error");

                // Optional: Clear any previous messages
                errorContainer.innerHTML = "";

                // Create a <p> element
                let errorMsg = document.createElement("p");
                errorMsg.innerHTML = "Password must be 8+ characters with upper/lowercase letters and numbers/symbols!";
                errorMsg.style.fontSize = "12px";
                errorMsg.style.color = "red"; // You can style it however you want

                // Append the <p> to the container
                errorContainer.appendChild(errorMsg);
            }


            if (regexEmail.test(email.value) && regexPassword.test(password.value)) {
                fetch("../api.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        type: "Login",
                        Email: email.value,
                        Password: password.value
                    })
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === "success") {

                            console.log(data);
                            const apiKey = data.data.apikey;

                            const d = new Date();
                            d.setTime(d.getTime() + (24 * 60 * 60 * 1000));
                            let expires = "expires=" + d.toUTCString();

                            document.cookie = `api_key=${apiKey}; ${expires}; path=/; Secure; SameSite=Lax`;
                            window.location.href = "home.php";
                        } else {
                            // Show error
                            alert("The credentials you entered are invalid!");
                            console.error(data.data);
                        }
                    });
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
});

//     // 4. Add event listener to the select dropdown
//     if (themeToggleSelect) {
//         themeToggleSelect.addEventListener("change", function() {
//             // Get the selected value from the dropdown
//             const selectedTheme = this.value; // Will be "Light" or "Dark"

//             // Apply the selected theme
//             applyThemePreference(selectedTheme);

//             // Save the selected preference to localStorage
//             try {
//                 localStorage.setItem(localStorageKey, selectedTheme);
//                  console.log("Theme preference saved:", selectedTheme);
//             } catch (e) {
//                  console.error("Failed to save theme preference to localStorage:", e);
//             }
//         });
//     } else {
//         console.warn("Theme toggle select element not found (#theme-toggle).");
//     }
// });

