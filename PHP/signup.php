<?php
include("header.php");
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Signup</title>
    <link rel="stylesheet" href="../css/signup.css">
    <link rel="stylesheet" href="../css/main.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Dancing+Script&display=swap" rel="stylesheet">
</head>

<body class="signup-page">
    <div class="MainDiv">
        <div class="Top-Header">
            <h2>Safari</h2>
            <h2>Speed</h2>
        </div>
        <p class="Slogan">Shop Fast. Live Wild. Delivered Quick</p>

        <div class="MainContainer">
            <div class="Containerdots">
                <div class="divdot"></div>
                <div class="divdot"></div>
                <div class="divdot"></div>
            </div>
            <label class="LblPA"> SIGN UP</label>
            <hr>
            <form id="register-form" class="Main_Form">

                <div class="input-group">
                    <div class="input-container" id="name-container">
                        <i class="fas fa-user icon"></i>
                        <input type="text" name="Name" placeholder="Name:" required>
                    </div>
                    <div class="error-message-container">
                        <div class="error-message" id="errContName"></div>
                    </div>
                </div>

                <div class="input-group">
                    <div class="input-container" id="surname-container">
                        <i class="fas fa-user icon"></i>
                        <input type="text" name="Surname" placeholder="Surname:" required>
                    </div>
                    <div class="error-message-container">
                        <div class="error-message" id="errContSurname"></div>
                    </div>
                </div>

                <div class="input-group">
                    <div class="input-container" id="email-container">
                        <i class="fas fa-envelope icon"></i>
                        <input type="email" name="Email" placeholder="Email:" required>
                    </div>
                    <div class="error-message-container">
                        <div class="error-message" id="email-error"></div>
                    </div>
                </div>

                <div class="input-group">
                    <div class="input-container" id="phone-container">
                        <i class="fas fa-phone icon"></i>
                        <input type="tel" name="Cell_No" placeholder="Phone Number: (Optional)">
                    </div>
                    <div class="error-message-container">
                        <div class="error-message" id="phone-error"></div>
                    </div>
                </div>

                <div class="input-group">
                    <div class="input-container" id="password-container">
                        <i class="fas fa-lock icon"></i>
                        <input type="password" name="Password" placeholder="Password:" required>
                    </div>
                    <div class="error-message-container">
                        <div class="error-message" id="password-error"></div>
                    </div>
                </div>
                <div class="input-group">
                    <div class="input-container" id="userType-container">
                        <i class="fa fa-user-tag"></i>
                        <select id="type" name="User_Type" class="Select_Type" required>
                            <option value="Normal">Normal</option>
                        </select>
                        <!-- <label class="error-label" id="type-error"></label> -->
                    </div>
                </div>
                <button class="btn btnSignUp" name="btnSignUp" type="button" id="btnSignUp">Sign Up</button>
            </form>

        </div>
    </div>
    <script src="../JS/signup.js"></script>
</body>

</html>