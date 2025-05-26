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

// Example usage:
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

function initializeForm() {
    // Get form elements
    let curFname = document.getElementsByName("curName")[0];
    let curSurname = document.getElementsByName("curSurname")[0];
    let curEmail = document.getElementsByName("curEmail")[0];
    let curPhoneNr = document.getElementsByName("curPhoneNr")[0];
    let password = document.getElementsByName("curPwd")[0];
    let curType = document.getElementById("curAcc");
    let submit = document.getElementById("btnSave");

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
                console.log(data);
                if (curFname) curFname.value = data.data.Name;
                if (curSurname) curSurname.value = data.data.Surname;
                if (curEmail) curEmail.value = data.data.Email;
                if (curPhoneNr) {
                    curPhoneNr.value = data.data.Cell_No ? data.data.Cell_No : "No Phone Number Saved";
                } if (password) password.value = "********";
                if (curType) curType.value = data.data.User_Type;
            } else {
                // Show error
                console.error(data.data);
            }
        });

}