<?php
include 'header.php';
$currentPage = 'comparison';
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Product Comparison Page</title>
    <link id="themeStylesheet" rel="stylesheet" href="..\css\main.css">
    <link id="themeStylesheet" rel="stylesheet" href="..\css\compare.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
        rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Dancing+Script&display=swap" rel="stylesheet">
    <meta name="csrf-token" content="<?php echo htmlspecialchars($csrf_token); ?>">
</head>

<body>

    <div class="product-comparison-container">
        <div class="main-product-column">
        </div>

        <div class="compared-products-column">
        </div>
    </div>

    <div id="reviewModal" class="modal">
        <div class="modal-content">
            <span class="close-button">&times;</span>
            <h3 id="reviewModalHeader">Add Review for "Product Title"</h3>
            <form id="reviewForm">
                <div class="form-group">
                    <label for="reviewDescription">Description:</label>
                    <textarea id="reviewDescription" rows="5" required></textarea>
                </div>
                <div class="form-group">
                    <label for="reviewRating">Rating:</label>
                    <input type="number" id="reviewRating" min="1" max="5" required>
                </div>
                <button type="submit" id="submitReviewButton">Add Review</button>
            </form>
            <p id="reviewFormMessage" class="form-message"></p>
        </div>
    </div>

    <script src="../JS/compare.js"></script>

    <?php
    include 'footer.php';
    ?>

</body>

</html>