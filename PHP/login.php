<?php
    include("header.php");
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - ArtStore  </title>
    <link rel="stylesheet" href="../CSS/main.css">
    <link rel="stylesheet" href="../CSS/login.css">
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
            <label class="LblPA" > LOGIN </label>
            <hr>
            <form id="Login-form" class="Main_Form">
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
                    <div class="input-container" id="password-container">
                        <i class="fas fa-lock icon"></i>
                        <input type="password" name="Password" placeholder="Password:" required>
                    </div>
                    <div class="error-message-container">
                        <div class="error-message" id="password-error"></div>
                    </div>
                </div>
                <button class="btn btnSignUp" type="button" id="btnLogin">Login</button>
                <p id="login-result" style="margin-top: 10px;"></p>
            </form>

        </div>
    </div>
    <script src="..\JS\login.js"></script>
</body>
</html>