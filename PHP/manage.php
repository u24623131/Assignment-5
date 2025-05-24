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
            <!-- <div id="FormSpace">
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
            </div> -->

            <!-- <div id="FormSpace">
                <label class="LblPA" id="delAcc">Delete Account:</label>
                <form id="addRet" class="Main_Form">
                    <label class="LblPA" class="lbl"> Account's API Key:</label>
                    <input class="curVal delAccAPIInput" type="text" name="retailName" required placeholder="Account To Delete's API Key:">
                    <button class="btn btnDelAcc" type="button" id="btnDelAcc">Delete Account</button>
                </form>

                <br>
                <label class="LblPA" id="upRet">Remove User's Review:</label>
                <form id="updateRet" class="Main_Form">
                    <label class="LblPA" class="lbl"> Account's API Key:</label>
                    <input class="curVal delAccAPIInput" type="text" name="retailName" required placeholder="Account To Delete's API Key:">
                    <label class="LblPA" class="lbl"> Product Title:</label>
                    <input class="curVal prodTitleInput" type="text" name="retailName" required placeholder="Product's Title:">
                    <button class="btn btnDelRev" type="button" id="btnDelRev">Remove Review</button>
                </form>
                <br>
            </div> -->

            <div id="FormSpace">
                <label class="LblPA" id="delProd">Delete Product:</label>
                <form id="addRet" class="Main_Form">
                    <label class="LblPA" class="lbl"> Product's Title:</label>
                    <input class="curVal delProdTitleInput" type="text" name="retailName" required placeholder="Product's Title:">
                    <button class="btn btnDelProd" type="button" id="btnDelProd">Delete Product</button>
                </form>

                <br>
                <label class="LblPA" id="upProd">Update Product's Price:</label>
                <form id="updateRet" class="Main_Form">
                    <label class="LblPA" class="lbl"> Product's Title:</label>
                    <input class="curVal upProdTitleInput" type="text" name="retailName" required placeholder="Product's Title:">
                    <label class="LblPA" class="lbl"> Retailer's Name:</label>
                    <input class="curVal upProdRetNameInput" type="text" name="retailName" required placeholder="Retailer's Name:">
                    <label class="LblPA" class="lbl"> New Price:</label>
                    <input class="curVal upPriceInput" type="text" name="retailName" required placeholder="New Price:">
                    <button class="btn btnUpProdPrice" type="button" id="btnUpProdPrice">Update Price</button>
                </form>
                <br>

                <label class="LblPA" id="upProd">Add Product:</label>
                <form id="updateRet" class="Main_Form">
                    <label class="LblPA" class="lbl"> Product's Title:</label>
                    <input class="curVal addProdTitleInput" type="text" name="retailName" required placeholder="Product's Title:">
                    <label class="LblPA" class="lbl"> Product's Category:</label>
                    <input class="curVal addProdCatInput" type="text" name="retailName" required placeholder="Product's Category:">
                    <label class="LblPA" class="lbl"> Product's Description:</label>
                    <input class="curVal addProdDescInput" type="text" name="retailName" required placeholder="Products's Description:">
                    <label class="LblPA" class="lbl"> Product's Brand:</label>
                    <input class="curVal addProdBrandInput" type="text" name="retailName" required placeholder="Product's Brand:">
                    <label class="LblPA" class="lbl"> Image's URL:</label>
                    <input class="curVal addImgUrlInput" type="text" name="retailName" required placeholder="Product's Image's Url:">
                    <label class="LblPA" class="lbl"> Retailers That Sell The Product:</label>
                    <input class="curVal addProdRetailersInput" type="text" name="retailName" required placeholder="Retailers Selling Product:">
                    <label class="LblPA" class="lbl"> Prices of Product At Corresponding Retailers:</label>
                    <input class="curVal addProdPricesInput" type="text" name="retailName" required placeholder="Product's Prices Corresponding To Retailers:">
                    <button class="btn btnAddProd" type="button" id="btnAddProd">Add Product</button>
                </form>
                <br>
            </div>
        </div>
        <script src="../JS/profile.js"></script>
</body>

</html>