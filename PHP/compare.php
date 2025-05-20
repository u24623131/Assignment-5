<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>All Products - ArtStore</title>
    <link id="themeStylesheet" rel="stylesheet" href="..\css\main.css">
    <link id="themeStylesheet" rel="stylesheet" href="..\css\compare.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
        rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Dancing+Script&display=swap" rel="stylesheet">

</head>

<body>
    <?php
    $currentPage = 'product';
    include 'header.php';
    ?>

        <div class="ProductPlace" id="PPlace">

            <div class="prod-container">
                <div class="col-4">
                    <img src="..\image\toaster.jpg">
                    <h4 id="Title">Toaster</h4>
                    <div class="retail">
                        <i class="fas fa-chevron-left"></i>
                        <p>Game</p>
                        <i class="fas fa-chevron-right"></i>
                    </div>
                    <p class="brand">Russell Hobbs</p>
                    <div class="prices">
                        <p class="Price-Cross Iprice">R499.99</p>
                        <p class="Aprice">R299.99</p>
                    </div>
                    <p>Made in China</p>
                    <div class="btn-group">
                        <button class="btn add-fav">
                            <i class="fas fa-heart"></i>
                        </button>
                        <button class="btn btn-compare">
                            <i class="fas fa-plus-square"></i> Compare
                        </button>
                    </div>
                </div>
                <div class="compareBox">
                    <h3> Alternate Prices: </h3>

                    <div class="compareitem">
                        <h4 class="Retailer">RetailerName</h4>
                        <h4 class="Price">R10</h4>
                    </div>

                    <div class="compareitem">
                        <h4 class="Retailer">RetailerName</h4>
                        <h4 class="Price">R20</h4>
                    </div>

                    <div class="compareitem">
                        <h4 class="Retailer">RetailerName</h4>
                        <h4 class="Price">R30</h4>
                    </div>

                </div>
            </div>
            <div class="prod-container">
                <div class="col-4">
                    <img src="..\image\toaster.jpg">
                    <h4 id="Title">Toaster</h4>
                    <div class="retail">
                        <i class="fas fa-chevron-left"></i>
                        <p>Game</p>
                        <i class="fas fa-chevron-right"></i>
                    </div>
                    <p class="brand">Russell Hobbs</p>
                    <div class="prices">
                        <p class="Price-Cross Iprice">R499.99</p>
                        <p class="Aprice">R299.99</p>
                    </div>
                    <p>Made in China</p>
                    <div class="btn-group">
                        <button class="btn add-fav">
                            <i class="fas fa-heart"></i>
                        </button>
                        <button class="btn btn-compare">
                            <i class="fas fa-plus-square"></i> Compare
                        </button>
                    </div>
                </div>
                <div class="compareBox">
                    <h3> Alternate Prices: </h3>

                    <div class="compareitem">
                        <h4 class="Retailer">RetailerName</h4>
                        <h4 class="Price">R10</h4>
                    </div>

                    <div class="compareitem">
                        <h4 class="Retailer">RetailerName</h4>
                        <h4 class="Price">R20</h4>
                    </div>

                    <div class="compareitem">
                        <h4 class="Retailer">RetailerName</h4>
                        <h4 class="Price">R30</h4>
                    </div>
                </div>
            </div>
            <div class="prod-container">
                <div class="col-4">
                    <img src="..\image\toaster.jpg">
                    <h4 id="Title">Toaster</h4>
                    <div class="retail">
                        <i class="fas fa-chevron-left"></i>
                        <p>Game</p>
                        <i class="fas fa-chevron-right"></i>
                    </div>
                    <p class="brand">Russell Hobbs</p>
                    <div class="prices">
                        <p class="Price-Cross Iprice">R499.99</p>
                        <p class="Aprice">R299.99</p>
                    </div>
                    <p>Made in China</p>
                    <div class="btn-group">
                        <button class="btn add-fav">
                            <i class="fas fa-heart"></i>
                        </button>
                        <button class="btn btn-compare">
                            <i class="fas fa-plus-square"></i> Compare
                        </button>
                    </div>
                </div>
                <div class="compareBox">
                    <h3> Alternate Prices: </h3>

                    <div class="compareitem">
                        <h4 class="Retailer">RetailerName</h4>
                        <h4 class="Price">R10</h4>
                    </div>

                    <div class="compareitem">
                        <h4 class="Retailer">RetailerName</h4>
                        <h4 class="Price">R20</h4>
                    </div>

                    <div class="compareitem">
                        <h4 class="Retailer">RetailerName</h4>
                        <h4 class="Price">R30</h4>
                    </div>

                </div>
            </div>
        </div>


    </div>
    <div class="page-btn">
        <span>1</span>
        <span>2</span>
        <span>3</span>
        <span>4</span>
        <span>&#8594;</span>
    </div>

    <?php
    include 'footer.php';
    ?>

</body>

</html>