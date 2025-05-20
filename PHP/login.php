<?php
    include("header.php");
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>All Products - ArtStore  </title>
    <link rel="stylesheet" href="../CSS/main.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel= "stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Dancing+Script&display=swap" rel="stylesheet">
</head>
<body class="signup-page">
    <img class = "ImgAnimal" src="images\SSvector3.png" width="700" height="700">
    <div class = "MainDiv">
        <div class="Top-Header">
            <h2 >Safari</h2> 
            <img src="images\Logo.png" width="125">
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
                    <i class="fa fa-id-card"></i>
                    <input type="text" id="email" name="email" required placeholder="Email:">
                    <label class="error-label" id="email-error"></label>
                </div>

                <div class="input-group">
                    <i class="fa fa-lock"></i>
                    <input type="password" id="password" name="password" required placeholder="Password:">
                    <label class="error-label" id="password-error"></label>
                </div>
                <button class="btn btnSignUp" type="button" id="btnLogin">Login</button>
                <p id="login-result" style="margin-top: 10px;"></p>
            </form>

        </div>
    </div>
    <button class="btn btnSignUp" type="button" id="btnLogout">Log Out</button>
    <script src="js\login.js"></script> 
</body>
</html>