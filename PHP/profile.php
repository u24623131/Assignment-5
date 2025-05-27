<?php
include("header.php");
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Profile</title>
    <link rel="stylesheet" href="../css/profile.css">
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
            <label class="LblPA"> PROFILE - UPDATE details</label>
            <br>
            <label class="LblPA" id="curDet"> Current details:</label>
            <label class="LblPA" id="newDet"> New details:</label>
            <hr>
            <form id="register-form" class="Main_Form">

                <div class="input-group">
                    <label class="LblPA"> Name:</label>
                    <input type="text" class="CurVal" name="curName" disabled required placeholder="Current Name Val:">
                    <i id="nameIcon" class="fa fa-user"></i>
                    <input type="text" id="name" class="NewVal" name="name" required placeholder="Name:">
                    <label class="error-label" id="name-error"></label>
                </div>

                <div class="input-group">
                    <label class="LblPA"> Surname:</label>
                    <input type="text" class="CurVal" name="curSurname" disabled required placeholder="Current Surname Val:">
                    <i class="fa fa-user"></i>
                    <input type="text" id="surname" class="NewVal" name="surname" required placeholder="Surname:">
                    <label class="error-label" id="surname-error"></label>
                </div>

                <div class="input-group">
                    <label class="LblPA"> Email:</label>
                    <input type="text" class="CurVal" name="curEmail" disabled required placeholder="Current Email Val:">
                    <i class="fa fa-envelope"></i>
                    <input type="email" id="email" class="NewVal" name="email" required placeholder="Email:">
                    <label class="error-label" id="email-error"></label>
                </div>
                
                <div class="input-group">
                    <label class="LblPA"> Phone Number:</label>
                    <input type="text" class="CurVal" name="curPhoneNr"disabled required placeholder="Current Phone Number Val:">
                    <i id="pIcon" class="fa fa-phone"></i>
                    <input type="text" id="phoneNumber" class="NewVal" name="phoneNumber" required placeholder="Phone Number:">
                    <label class="error-label" id="phoneNumber-error"></label>
                </div>

                <div class="input-group">
                    <label class="LblPA"> Password:</label>
                    <input type="password" class="CurVal" name="curPasswordInput" id="curPasswordInput" required placeholder="Enter Current Password:">
                    <i class="fa fa-lock"></i>
                    <input type="password" id="newPasswordInput" class="NewVal" name="newPasswordInput" required placeholder="Password:">
                    <label class="error-label" id="password-error"></label>
                </div>
                <div class="input-group">
                    <label class="LblPA"> Account Type:</label>
                    <input type="text" class="CurVal" id="curAcc" disabled required placeholder="Current Account Type Val:">
                    <label class="error-label" id="type-error"></label>
                </div>
                <button class="btn btnSignUp" type="button" id="btnSave">Save</button>
            </form>
            <button class="btn btnSignUp" type="button" id="btnLogout">Log Out</button>
            <button class="btn btnSignUp" type="button" id="btnDeleteAccount">Delete Account</button>

        </div>
    </div>
    <script src="../JS/profile.js"></script>
</body>

</html>