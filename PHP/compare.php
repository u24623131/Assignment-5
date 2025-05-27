    <?php
    include 'header.php';
    $currentPage = 'comparison';
    ?>
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
                <div class="Maincol-4">
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
                <div class="product-details">
                    <h4 class="product-title">Toaster</h4>
                    <div class="product-rating">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star-half-alt"></i>
                        <i class="far fa-star"></i>
                    </div>

                    <div class="product-description">
                        <h4>Description</h4>
                        <p>
                            Enjoy perfect toast every time with this compact toaster. Features wide slots for thick
                            bread, 6 browning levels, and easy-clean crumb tray—all in a sleek, modern design.
                        </p>
                    </div>

                    <div class="reviews-section">
                        <h4>Reviews</h4>
                        <div class="review-item">
                            <label class="review-rating" for="Rating">3</label>
                            <p>
                                Works well and fits thick bread slices. Only wish the cord was a bit longer.
                            </p>
                        </div>
                        <div class="review-item">
                            <div class="review-header">
                                <label class="review-name" for="Rating">Mutombo Kabau</label>
                                <label class="review-rating" for="Rating">4.5</label>
                                <label class="review-date" for="Rating">2025/05/27</label>
                            </div>
                            <p>
                                Heats evenly and looks great on my kitchen counter. Super easy to clean too!
                            </p>
                        </div>
                        <div class="review-buttons-group">
                            <button class="btn-review">
                                <i class="fas fa-chevron-down"></i> More
                            </button>
                            <button class="btn-review">
                                <i class="fas fa-plus-square"></i> Add Review
                            </button>
                            <button class="btn-review">
                                <i class="fas fa-heart"></i> Lik
                            </button>
                            <button class="btn-review">
                                <i class="fas fa-remove"></i> remove
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="compared-products-column">
            
            <div class="product-card">
                <div class="product-card-header">
                    <img src="..\image\toaster.jpg" alt="Toaster">
                    <div class="alternate-prices-box">
                        <h3>Alternate Prices:</h3>
                        <div class="price-item">
                            <h4 class="retailer-name">RetailerName</h4>
                            <h4 class="product-price">R10</h4>
                        </div>
                        <div class="price-item">
                            <h4 class="retailer-name">RetailerName</h4>
                            <h4 class="product-price">R20</h4>
                        </div>
                        <div class="price-item">
                            <h4 class="retailer-name">RetailerName</h4>
                            <h4 class="product-price">R30</h4>
                        </div>
                    </div>
                </div>
                <div class="product-details">
                    <h4 class="product-title">Toaster</h4>
                    <div class="product-rating">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star-half-alt"></i>
                        <i class="far fa-star"></i>
                    </div>

                    <div class="product-description">
                        <h4>Description</h4>
                        <p>
                            Enjoy perfect toast every time with this compact toaster. Features wide slots for thick
                            bread, 6 browning levels, and easy-clean crumb tray—all in a sleek, modern design.
                        </p>
                    </div>

                    <div class="reviews-section">
                        <h4>Reviews</h4>
                        <div class="review-item">
                            <label class="review-rating" for="Rating">3</label>
                            <p>
                                Works well and fits thick bread slices. Only wish the cord was a bit longer.
                            </p>
                        </div>
                        <div class="review-item">
                            <label class="review-rating" for="Rating">4.5</label>
                            <p>
                                Heats evenly and looks great on my kitchen counter. Super easy to clean too!
                            </p>
                        </div>
                        <div class="review-buttons-group">
                            <button class="btn-review">
                                <i class="fas fa-chevron-down"></i> More
                            </button>
                            <button class="btn-review">
                                <i class="fas fa-plus-square"></i> Add Review
                            </button>
                            <button class="btn-review">
                                <i class="fas fa-heart"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="product-card">
                <div class="product-card-header">
                    <img src="..\image\toaster.jpg" alt="Toaster">
                    <div class="alternate-prices-box">
                        <h3>Alternate Prices:</h3>
                        <div class="price-item">
                            <h4 class="retailer-name">RetailerName</h4>
                            <h4 class="product-price">R10</h4>
                        </div>
                        <div class="price-item">
                            <h4 class="retailer-name">RetailerName</h4>
                            <h4 class="product-price">R20</h4>
                        </div>
                        <div class="price-item">
                            <h4 class="retailer-name">RetailerName</h4>
                            <h4 class="product-price">R30</h4>
                        </div>
                    </div>
                </div>
                <div class="product-details">
                    <h4 class="product-title">Toaster</h4>
                    <div class="product-rating">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star-half-alt"></i>
                        <i class="far fa-star"></i>
                    </div>

                    <div class="product-description">
                        <h4>Description</h4>
                        <p>
                            Enjoy perfect toast every time with this compact toaster. Features wide slots for thick
                            bread, 6 browning levels, and easy-clean crumb tray—all in a sleek, modern design.
                        </p>
                    </div>

                    <div class="reviews-section">
                        <h4>Reviews</h4>
                        <div class="review-item">
                            <label class="review-rating" for="Rating">3</label>
                            <p>
                                Works well and fits thick bread slices. Only wish the cord was a bit longer.
                            </p>
                        </div>
                        <div class="review-item">
                            <label class="review-rating" for="Rating">4.5</label>
                            <p>
                                Heats evenly and looks great on my kitchen counter. Super easy to clean too!
                            </p>
                        </div>
                        <div class="review-buttons-group">
                            <button class="btn-review">
                                <i class="fas fa-chevron-down"></i> More
                            </button>
                            <button class="btn-review">
                                <i class="fas fa-plus-square"></i> Add Review
                            </button>
                            <button class="btn-review">
                                <i class="fas fa-heart"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="product-card">
                <div class="product-card-header">
                    <img src="..\image\toaster.jpg" alt="Toaster">
                    <div class="alternate-prices-box">
                        <h3>Alternate Prices:</h3>
                        <div class="price-item">
                            <h4 class="retailer-name">RetailerName</h4>
                            <h4 class="product-price">R10</h4>
                        </div>
                        <div class="price-item">
                            <h4 class="retailer-name">RetailerName</h4>
                            <h4 class="product-price">R20</h4>
                        </div>
                        <div class="price-item">
                            <h4 class="retailer-name">RetailerName</h4>
                            <h4 class="product-price">R30</h4>
                        </div>
                    </div>
                </div>
                <div class="product-details">
                    <h4 class="product-title">Toaster</h4>
                    <div class="product-rating">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star-half-alt"></i>
                        <i class="far fa-star"></i>
                    </div>

                    <div class="product-description">
                        <h4>Description</h4>
                        <p>
                            Enjoy perfect toast every time with this compact toaster. Features wide slots for thick
                            bread, 6 browning levels, and easy-clean crumb tray—all in a sleek, modern design.
                        </p>
                    </div>

                    <div class="reviews-section">
                        <h4>Reviews</h4>
                        <div class="review-item">
                            <label class="review-rating" for="Rating">3</label>
                            <p>
                                Works well and fits thick bread slices. Only wish the cord was a bit longer.
                            </p>
                        </div>
                        <div class="review-item">
                            <label class="review-rating" for="Rating">4.5</label>
                            <p>
                                Heats evenly and looks great on my kitchen counter. Super easy to clean too!
                            </p>
                        </div>
                        <div class="review-buttons-group">
                            <button class="btn-review">
                                <i class="fas fa-chevron-down"></i> More
                            </button>
                            <button class="btn-review">
                                <i class="fas fa-plus-square"></i> Add Review
                            </button>
                            <button class="btn-review">
                                <i class="fas fa-heart"></i>
                            </button>
                        </div>
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