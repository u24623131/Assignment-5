const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

function getCsrfToken() {
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    return metaTag ? metaTag.content : null;
}

document.addEventListener("DOMContentLoaded", function () {
    let email = document.getElementsByName("Email")[0];
    let password = document.getElementsByName("Password")[0];
    let submit = document.getElementById("btnLogin"); // or getElementById("submit");

    if (submit) {
        submit.addEventListener("click", function (event) {
            event.preventDefault();

            const csrfToken = getCsrfToken();

            if (!csrfToken) {
                console.error("CSRF token not found. Aborting DeleteAccount request.");
                alert("Security error: CSRF token missing. Please refresh the page.");
                return;
            }

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
                        "Content-Type": "application/json",
                        "X-CSRF-Token": csrfToken
                    },
                    body: JSON.stringify({
                        type: "Login",
                        Email: email.value,
                        Password: password.value
                    })
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === "success") {1

                            //console.log(data);
                            const apiKey = data.data.apikey;
                            const email = data.data.email;
                            const d = new Date();
                            d.setTime(d.getTime() + (24 * 60 * 60 * 1000));
                            let expires = "expires=" + d.toUTCString();

                            document.cookie = `api_key=${apiKey}; ${expires}; path=/; Secure; SameSite=Lax`;
                            document.cookie = `user_email=${encodeURIComponent(email)}; ${expires}; path=/; Secure; SameSite=Lax`;

                            // Fetch Experience
                            fetch("../api.php", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    "X-CSRF-Token": csrfToken
                                },
                                body: JSON.stringify({
                                    type: "AddUserXP",
                                    apikey: apiKey,
                                    xp: 15
                                })
                            })
                                .then(response => response.json())
                                .then(data => {
                                    if (data.status === "success") {
                                        console.log("+15xp")
                                    } else {
                                        console.error("Failed to add user experience:", data.data);
                                    }
                                })
                                .catch(error => {
                                    console.error("Network error adding user experience:", error);
                                });
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
});

