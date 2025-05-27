    <?php
    include 'header.php';
    $currentPage = 'home';
    ?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>All Products - ArtStore</title>
    <link id="themeStylesheet" rel="stylesheet" href="..\css\main.css">
    <link id="themeStylesheet" rel="stylesheet" href="..\css\home.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
        rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Dancing+Script&display=swap" rel="stylesheet">
    <meta name="csrf-token" content="<?php echo htmlspecialchars($csrf_token); ?>">
</head>

<body>
    <div id="filterMenu" class="filter-sidebar">
        <a class="close-btn" id="btnClose">✖</a>
        <h2>Filters</h2>
        <div class="filter-section">
            <label class="Label-filter">Price Range:</label>
            <input class="Input_range" type="range" id="priceRange" min="0" max="10000" value="10000" step="50">
            <label>Max Price: $<input type="number" class="inputPrice" id="priceValue" value="10000"></label>
        </div>

        <div class="filter-section">
            <label class="Label-filter">Category</label>
            <select id="Dropdown_Category">
            </select>
        </div>

        <div class="filter-section">
            <label class="Label-filter"><b>Retailer:</b></label>
            <select id="Dropdown_Retailer">
            </select>
        </div>

        <div class="filter-section">
            <label class="Label-filter"><b>Brand:</b></label>
            <select id="Dropdown_brand">
            </select>
        </div>

        <button class="clear-btn" id="btnClear"> Clear Filters</button>
    </div>

    <div class="small-container">
        <div class="row row-2">
            <h2> All Products</h2>
            <div class="fliters-group">
                <select class="btn filters-btn">
                    <option value="" selected disabled><b>SORT</b></option>
                    <i class="fas fa-chevron-down"></i>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="Title">Title</option>
                    <option value="Latest"> Latest</option>
                    <option value="Country"> Country </option>
                </select>

                <button class=" btn fliters-btn" id="BtnFliter">
                    FILTERS
                    <i class="fas fa-chevron-down"></i>
                </button>
            </div>
        </div>

        <div class="compareBox" id="compareList">
            <h2> Compare Items </h2>
            <button class="btn btn-compare btn-compare2">
                <i class="fas fa-exchange-alt"></i> Compare
            </button>
        </div>

        <div class="page-btn">
        </div>

        <div class="ProductPlace" id="PPlace">

        </div>

    </div>
    <script src="..\JS\home.js"></script>
    <?php
    include 'footer.php';
    ?>
</body>

</html>
