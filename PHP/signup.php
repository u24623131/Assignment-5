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
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel= "stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Dancing+Script&display=swap" rel="stylesheet">
</head>
<body class="signup-page">
    <div class = "MainDiv">
        <div class="Top-Header">
            <h2 >Safari</h2> 
            <h2>Speed</h2>
        </div>
        <p class = "Slogan">Shop Fast. Live Wild. Delivered Quick</p>

        <div class="MainContainer">
            <div class="Containerdots">
                <div class="divdot"></div>
                <div class="divdot"></div>
                <div class="divdot"></div>
            </div>
            <label class="LblPA" > SIGN UP</label>
            <hr>
            <form id="register-form" class="Main_Form">
                <div class="input-group">
                    <i class="fa fa-user"></i>
                    <input type="text" id="name" name="name" required placeholder="Name:">
                    <label class="error-label" id="name-error"></label>
                </div>

                <div class="input-group">
                    <i class="fa fa-user"></i>
                    <input type="text" id="surname" name="surname" required placeholder="Surname:">
                    <label class="error-label" id="surname-error"></label>
                </div>

                <div class="input-group">
                    <i class="fa fa-envelope"></i>
                    <input type="email" id="email" name="email" required placeholder="Email:">
                    <label class="error-label" id="email-error"></label>
                </div>
                
                <div class="input-group">
                    <i class="fa fa-phone"></i>
                    <input type="phoneNr" id="phoneNr" name="phoneNr" required placeholder="Phone Number: (Optional)">
                    <label class="error-label" id="phoneNr-error"></label>
                </div>
                <div class="input-group">
                    <i class="fa fa-lock"></i>
                    <input type="password" id="password" name="password" required placeholder="Password:">
                    <label class="error-label" id="password-error"></label>
                </div>
                <div class="input-group">
                    <i class="fa fa-user-tag"></i>
                    <select id="type" name="type" class="Select_Type" required>
                        <option value="Customer">Customer</option> 
                        <option value="Courier">Courier</option>
                        <option value="Inventory Manager">Inventory Manager</option>
                    </select>
                    <label class="error-label" id="type-error"></label>
                </div>
                <button class="btn btnSignUp" type="button" id="btnSignUp">Sign Up</button>
            </form>

        </div>
    </div>
    <script src="js\signup.js"></script> 
</body>
</html>