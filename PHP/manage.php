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

            <div id="retailerForms" style="display: none;"> <label class="LblPA" id="addRet">Add Retailer:</label>
                <form id="addRetForm" class="Main_Form"> <label class="LblPA lbl"> Retailer Name:</label>
                    <input class="curVal retNameInput" type="text" name="retailName" required placeholder="Retailer Name:">
                    <label class="LblPA lbl"> Retailer Address: (Optional)</label>
                    <input class="curVal retAddressInput" type="text" name="retailAddress"  placeholder="Retailer Address:">
                    <button class="btn btnAddRet" type="button" id="btnAddRet">Add Retailer</button>
                </form>

                <br>
                <label class="LblPA" id="upRet">Update Retailer:</label>
                <form id="updateRetForm" class="Main_Form"> <label class="LblPA lbl"> Current Retailer Name:</label>
                    <input class="curVal retNameInput" type="text" name="retailName" required placeholder="Current Retailer Name:">
                    <label class="LblPA lbl"> New Retailer Name: (Optional)</label>
                    <input class="curVal retNameInput" type="text" name="newRetailName" placeholder="New Retailer Name:">
                    <label class="LblPA lbl"> New Retailer Address: (Optional)</label>
                    <input class="curVal retAddressInput" type="text" name="retailAddress" placeholder="New Retailer Address:">
                    <button class="btn btnUpdateRet" type="button" id="btnUpdateRet">Update Retailer</button>
                </form>
                <br>
            </div>

            <div id="userForms" style="display: none;"> <label class="LblPA" id="delAcc">Delete Account:</label>
                <form id="delAccForm" class="Main_Form"> <label class="LblPA lbl"> Account's API Key:</label>
                    <input class="curVal delAccAPIInput" type="text" name="accToDeleteAPIKey" required placeholder="Account To Delete's API Key:">
                    <button class="btn btnDelAcc" type="button" id="btnDelAcc">Delete Account</button>
                </form>

                <br><label class="LblPA" id="remRev">Change User's Account Type:</label>
                <form id="changeAccTypeForm" class="Main_Form"> <label class="LblPA lbl"> Account's API Key:</label>
                    <input class="curVal changeAccTypeAPIInput" type="text" name="accToChangeAPIKey" required placeholder="Account To Change's API Key:">
                    <button class="btn btnChangeAcc" type="button" id="btnChangeAcc">Change Account</button>
                </form>

                <br>
                <label class="LblPA" id="remRev">Remove User's Review:</label> <form id="remRevForm" class="Main_Form"> <label class="LblPA lbl"> Account's API Key:</label>
                    <input class="curVal delAccAPIInput" type="text" name="reviewerAPIKey" required placeholder="APIKey of Reviewer Account:">
                    <label class="LblPA lbl"> Product Title:</label>
                    <input class="curVal prodTitleInput" type="text" name="prodTitle" required placeholder="Product's Title:">
                    <button class="btn btnDelRev" type="button" id="btnDelRev">Remove Review</button>
                </form>
                <br>
            </div>

            <div id="productForms"> <label class="LblPA" id="delProd">Delete Product:</label>
                <form id="delProdForm" class="Main_Form"> <label class="LblPA lbl"> Product's Title:</label>
                    <input class="curVal delProdTitleInput" type="text" name="retailName" required placeholder="Product's Title:">
                    <button class="btn btnDelProd" type="button" id="btnDelProd">Delete Product</button>
                </form>

                <br>
                <label class="LblPA" id="upProd">Update Product's Price:</label>
                <form id="updateProdPriceForm" class="Main_Form"> <label class="LblPA lbl"> Product's Title:</label>
                    <input class="curVal upProdTitleInput" type="text" name="retailName" required placeholder="Product's Title:">
                    <label class="LblPA lbl"> Retailer's Name:</label>
                    <input class="curVal upProdRetNameInput" type="text" name="retailName" required placeholder="Retailer's Name:">
                    <label class="LblPA lbl"> New Price:</label>
                    <input class="curVal upPriceInput" type="text" name="retailName" required placeholder="New Price:">
                    <button class="btn btnUpProdPrice" type="button" id="btnUpProdPrice">Update Price</button>
                </form>
                <br>

                <label class="LblPA" id="addProd">Add Product:</label>
                <form id="addProdForm" class="Main_Form"> <label class="LblPA lbl"> Product's Title:</label>
                    <input class="curVal addProdTitleInput" type="text" name="retailName" required placeholder="Product's Title:">
                    <label class="LblPA lbl"> Product's Category:</label>
                    <input class="curVal addProdCatInput" type="text" name="retailName" required placeholder="Product's Category:">
                    <label class="LblPA lbl"> Product's Description:</label>
                    <input class="curVal addProdDescInput" type="text" name="retailName" required placeholder="Products's Description:">
                    <label class="LblPA lbl"> Product's Brand:</label>
                    <input class="curVal addProdBrandInput" type="text" name="retailName" required placeholder="Product's Brand:">
                    <label class="LblPA lbl"> Image's URL:</label>
                    <input class="curVal addImgUrlInput" type="text" name="retailName" required placeholder="Product's Image's Url:">
                    <label class="LblPA lbl"> Retailers That Sell The Product:</label>
                    <input class="curVal addProdRetailersInput" type="text" name="retailName" required placeholder="Retailers Selling Product:">
                    <label class="LblPA lbl"> Prices of Product At Corresponding Retailers:</label>
                    <input class="curVal addProdPricesInput" type="text" name="retailName" required placeholder="Product's Prices Corresponding To Retailers:">
                    <button class="btn btnAddProd" type="button" id="btnAddProd">Add Product</button>
                </form>
                <br>
            </div>
           
        </div>
        <script src="../JS/manage.js"></script>
</body>

</html>