<?php
include("header.php");
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manager</title>
    <link rel="stylesheet" href="../css/manage.css">
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
            <label class="LblPA"> MANAGE - UPDATE Database Entries</label>
            <br>
            <label class="LblPA" id="curDet"> Category to Manage:</label>
            <div id="catTManage">
                <button class="btn" id="prodCat">Products<br></button>
                <button class="btn" id="retCat">Retailers<br></button>
                <button class="btn" id="userCat">Users<br></button>
            </div>
            <hr>

            <label class="LblPA" id="addRet">Add Retailer:</label>
            <form id="addRet" class="Main_Form">
                <label class="LblPA" class="lbl"> Retailer Name:</label>
                <input class="curVal retNameInput" type="text" name="retailName" required placeholder="Retailer Name:">
                <label class="LblPA" class="lbl"> Retailer Address: (Optional)</label>
                <input class="curVal retAddressInput" type="text" name="retailAddress" required placeholder="Retailer Address:">
                <button class="btn btnAddRet" type="button" id="btnAddRet">Add Retailer</button>
            </form>

            <br>
            <label class="LblPA" id="upRet">Update Retailer:</label>
            <form id="updateRet" class="Main_Form">
                <label class="LblPA" class="lbl"> Current Retailer Name:</label>
                <input class="curVal retNameInput" type="text" name="retailName" required placeholder="Current Retailer Name:">
                <label class="LblPA" class="lbl"> New Retailer Name: (Optional)</label>
                <input class="curVal retNameInput" type="text" name="retailName" required placeholder="New Retailer Name:">
                <label class="LblPA" class="lbl"> New Retailer Address: (Optional)</label>
                <input class="curVal retAddressInput" type="text" name="retailAddress" required placeholder="New Retailer Address:">
                <button class="btn btnUpdateRet" type="button" id="btnUpdateRet">Update Retailer</button>
            </form>
            <br>
            <!-- <form id="register-form" class="Main_Form">

                <div class="input-group">
                    <label class="LblPA"> Name:</label>
                    <input type="text" class="CurVal" disabled required placeholder="Current Name Val:">
                    <i id="nameIcon" class="fa fa-user"></i>
                    <input type="text" id="name" class="NewVal" name="name" required placeholder="Name:">
                    <label class="error-label" id="name-error"></label>
                </div>

                <div class="input-group">
                    <label class="LblPA"> Surname:</label>
                    <input type="text" class="CurVal" disabled required placeholder="Current Surname Val:">
                    <i class="fa fa-user"></i>
                    <input type="text" id="surname" class="NewVal" name="surname" required placeholder="Surname:">
                    <label class="error-label" id="surname-error"></label>
                </div>

                <div class="input-group">
                    <label class="LblPA"> Email:</label>
                    <input type="text" class="CurVal" disabled required placeholder="Current Email Val:">
                    <i class="fa fa-envelope"></i>
                    <input type="email" id="email" class="NewVal" name="email" required placeholder="Email:">
                    <label class="error-label" id="email-error"></label>
                </div>

                <div class="input-group">
                    <label class="LblPA"> Password:</label>
                    <input type="password" class="CurVal" disabled required placeholder="Current Password Val (***):">
                    <i class="fa fa-lock"></i>
                    <input type="password" id="password" class="NewVal" name="password" required placeholder="Password:">
                    <label class="error-label" id="password-error"></label>
                </div>
                <div class="input-group">
                    <label class="LblPA"> Account Type:</label>
                    <input type="text" class="CurVal" id="CurAcc" disabled required placeholder="Current Account Type Val:">
                    <i class="fa fa-user-tag"></i>
                    <select id="type" name="type" class="Select_Type" required>
                        <option value="Customer">Customer</option>
                        <option value="Courier">Courier</option>
                        <option value="Inventory Manager">Inventory Manager</option>
                    </select>
                    <label class="error-label" id="type-error"></label>
                </div>
                <button class="btn btnSignUp" type="button" id="btnSignUp">Save</button>
            </form>
            <button class="btn btnSignUp" type="button" id="btnLogout">Log Out</button>
-->
        </div>
    </div>
    <script src="../JS/profile.js"></script>
</body>

</html>