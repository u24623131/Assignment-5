document.getElementById("btnLogout").addEventListener("click", function () {
    window.location.href = "logout.php";
});


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
    let fname = document.getElementsByName("curName")[0];
    let surname = document.getElementsByName("curSurname")[0]; 
    let email = document.getElementsByName("curEmail")[0];   
    let phoneNr = document.getElementsByName("curPhoneNr")[0];
    let password = document.getElementsByName("curPwd")[0];
    let type = document.getElementsByName("curAcc")[0];
    let submit = document.getElementById("btnSave");

}