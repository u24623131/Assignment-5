const sampleProductData = {
    Product_No: "TOAST001",
    Image_URL: "../image/toaster.jpg",
    Title: "Compact Smart Toaster",
    Brand: "BakePro",
    Category: "Kitchen Appliances",
    Retailer_Names: ["AmazingDeals", "ElectroMart", "HomeGadgets"],
    Prices: [499.99, 529.00, 485.50],
    Description: "Enjoy perfect toast every time with this compact toaster. Features wide slots for thick bread, 6 browning levels, and easy-clean crumb tray—all in a sleek, modern design. It's built for durability and convenience, ensuring a great start to your day.",
    Reviews: [
        { name: "Nomusa Dlamini", rating: 4.0, date: "2024/01/15", text: "Works well and fits thick bread slices. Only wish the cord was a bit longer. Otherwise, a solid buy!" },
        { name: "Sipho Khumalo", rating: 4.5, date: "2024/02/20", text: "Heats evenly and looks great on my kitchen counter. Super easy to clean too! Highly recommended." },
        { name: "Lerato Modise", rating: 5.0, date: "2024/03/10", text: "This toaster is a game changer! Perfect crisp every time. No more burnt edges. Love it!" },
        { name: "Thabo Mokoena", rating: 3.5, date: "2024/04/01", text: "It's decent for the price. The browning levels are a bit inconsistent, but generally satisfactory." },
        { name: "Zinhle Ngcobo", rating: 4.8, date: "2024/04/25", text: "Fantastic toaster! Quick and efficient. The design is sleek and doesn't take up too much space." },
        { name: "Andile Nkosi", rating: 4.2, date: "2024/05/18", text: "Good basic toaster. Does what it's supposed to. No fancy features but reliable." },
        { name: "Palesa Kunene", rating: 3.0, date: "2024/05/20", text: "Got stuck a couple of times with thicker bagels. Otherwise, it functions. Average product." },
        { name: "Kabelo Maleka", rating: 4.7, date: "2024/05/25", text: "Absolutely thrilled with this toaster! The crumb tray slides out effortlessly. A joy to use." }
    ]
};

//creating star rating
function createStarRating(rating) {
    const fragment = document.createDocumentFragment();
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
        const starIcon = document.createElement("i");
        if (i < fullStars) {
            starIcon.classList.add("fas", "fa-star");
        } else if (hasHalfStar && i === fullStars) {
            starIcon.classList.add("fas", "fa-star-half-alt");
        } else {
            starIcon.classList.add("far", "fa-star");
        }
        fragment.appendChild(starIcon);
    }
    return fragment;
}

//creating product card
function createProductCard(product) {
    const productCardElement = document.createElement("div");
    productCardElement.className = "product-card";
    productCardElement.dataset.productId = product.Product_No;

    //creating product img
    const productCardHeader = document.createElement("div");
    productCardHeader.classList.add("product-card-header");

    const productImage = document.createElement("img");
    productImage.src = product.Image_URL;
    productImage.alt = product.Title;
    productCardHeader.appendChild(productImage);

    //creating alternate prices
    const alternatePricesBox = document.createElement("div");
    alternatePricesBox.classList.add("alternate-prices-box");

    const alternatePricesTitle = document.createElement("h3");
    alternatePricesTitle.textContent = "Alternate Prices:";
    alternatePricesBox.appendChild(alternatePricesTitle);

    if (product.Retailer_Names && product.Retailer_Names.length > 0) {
        product.Retailer_Names.forEach((retailer, index) => {
            const priceItem = document.createElement("div");
            priceItem.classList.add("price-item");

            const retailerName = document.createElement("h4");
            retailerName.classList.add("retailer-name");
            retailerName.textContent = retailer;
            priceItem.appendChild(retailerName);

            const productPrice = document.createElement("h4");
            productPrice.classList.add("product-price");
            productPrice.textContent = `R${parseFloat(product.Prices[index]).toFixed(2)}`;
            priceItem.appendChild(productPrice);

            alternatePricesBox.appendChild(priceItem);
        });
    } else {
        const noPricesMessage = document.createElement("p");
        noPricesMessage.textContent = "No alternate prices available.";
        alternatePricesBox.appendChild(noPricesMessage);
    }
    productCardHeader.appendChild(alternatePricesBox);
    productCardElement.appendChild(productCardHeader);

    //creating product details
    const productDetails = document.createElement("div");
    productDetails.classList.add("product-details");

    const productTitle = document.createElement("h4");
    productTitle.classList.add("product-title");
    productTitle.textContent = product.Title;
    productDetails.appendChild(productTitle);

    //creating rating
    const productRatingDiv = document.createElement("div");
    productRatingDiv.classList.add("product-rating");
    const averageRating = product.Reviews && product.Reviews.length > 0
        ? product.Reviews.reduce((sum, rev) => sum + rev.rating, 0) / product.Reviews.length
        : 0;
    productRatingDiv.appendChild(createStarRating(averageRating));
    productDetails.appendChild(productRatingDiv);

    //creating description
    const productDescriptionDiv = document.createElement("div");
    productDescriptionDiv.classList.add("product-description");
    const descriptionHeading = document.createElement("h4");
    descriptionHeading.textContent = "Description";
    productDescriptionDiv.appendChild(descriptionHeading);
    const descriptionParagraph = document.createElement("p");
    descriptionParagraph.textContent = product.Description;
    productDescriptionDiv.appendChild(descriptionParagraph);
    productDetails.appendChild(productDescriptionDiv);

    //creating reviews section
    const reviewsSection = document.createElement("div");
    reviewsSection.classList.add("reviews-section");
    const reviewsHeading = document.createElement("h4");
    reviewsHeading.textContent = "Reviews";
    reviewsSection.appendChild(reviewsHeading);

    //creating review buttons
    const reviewButtonGroup = document.createElement("div");
    reviewButtonGroup.classList.add("review-buttons-group");

    const moreReviewsButton = document.createElement("button");
    moreReviewsButton.classList.add("btn-review", "more-reviews-btn");
    reviewButtonGroup.appendChild(moreReviewsButton);

    const addReviewButton = document.createElement("button");
    addReviewButton.classList.add("btn-review");
    addReviewButton.innerHTML = '<i class="fas fa-plus-square"></i> Add Review';
    reviewButtonGroup.appendChild(addReviewButton);

    const likeButton = document.createElement("button");
    likeButton.classList.add("btn-review");
    likeButton.innerHTML = '<i class="fas fa-heart"></i> Like';
    reviewButtonGroup.appendChild(likeButton);

    const removeButton = document.createElement("button");
    removeButton.classList.add("btn-review");
    removeButton.innerHTML = '<i class="fas fa-remove"></i> remove';
    reviewButtonGroup.appendChild(removeButton);

    reviewsSection.appendChild(reviewButtonGroup);

    //handling review logic
    const allReviews = product.Reviews || [];
    let reviewsDisplayedCount = 0;
    const reviewsToLoadPerClick = 2;

    function updateMoreButton(isEndOfReviews) {
        if (isEndOfReviews) {
            moreReviewsButton.innerHTML = '<i class="fas fa-undo-alt"></i> Back';
        } else {
            moreReviewsButton.innerHTML = '<i class="fas fa-chevron-down"></i> More';
        }

        if (allReviews.length <= reviewsToLoadPerClick && allReviews.length > 0) {
             moreReviewsButton.style.display = "none";
        } else if (allReviews.length === 0) {
            moreReviewsButton.style.display = "none";
            const noReviewsMessage = document.createElement('p');
            noReviewsMessage.textContent = 'No reviews available yet.';
            reviewsSection.insertBefore(noReviewsMessage, reviewButtonGroup);
        } else {
            moreReviewsButton.style.display = "";
        }
    }

    function clearReviewsFromDOM() {
        const existingReviewItems = reviewsSection.querySelectorAll('.review-item');
        existingReviewItems.forEach(item => item.remove());
    }

    function displayReviews(startIndex, count) {
        clearReviewsFromDOM();

        const reviewsToRender = allReviews.slice(startIndex, startIndex + count);

        if (reviewsToRender.length === 0 && startIndex === 0 && allReviews.length > 0) {
            reviewsToRender.push(...allReviews);
            count = allReviews.length;
        } else if (reviewsToRender.length === 0 && allReviews.length > 0) {
            reviewsDisplayedCount = 0;
            displayReviews(0, reviewsToLoadPerClick);
            return;
        } else if (allReviews.length === 0) {
            reviewsDisplayedCount = 0;
            updateMoreButton(false);
            return;
        }

        reviewsToRender.forEach(review => {
            const reviewItem = document.createElement("div");
            reviewItem.classList.add("review-item");

            const reviewHeader = document.createElement("div");
            reviewHeader.classList.add("review-header");

            const reviewNameLabel = document.createElement("label");
            reviewNameLabel.classList.add("review-name");
            reviewNameLabel.setAttribute("for", "Rating");
            reviewNameLabel.textContent = review.name;
            reviewHeader.appendChild(reviewNameLabel);

            const reviewRatingLabel = document.createElement("label");
            reviewRatingLabel.classList.add("review-rating");
            reviewRatingLabel.setAttribute("for", "Rating");
            reviewRatingLabel.textContent = review.rating;
            reviewHeader.appendChild(reviewRatingLabel);

            const reviewDateLabel = document.createElement("label");
            reviewDateLabel.classList.add("review-date");
            reviewDateLabel.setAttribute("for", "Rating");
            reviewDateLabel.textContent = review.date;
            reviewHeader.appendChild(reviewDateLabel);

            reviewItem.appendChild(reviewHeader);

            const reviewParagraph = document.createElement("p");
            reviewParagraph.textContent = review.text;
            reviewItem.appendChild(reviewParagraph);

            reviewsSection.insertBefore(reviewItem, reviewButtonGroup);
        });

        reviewsDisplayedCount = startIndex + reviewsToRender.length;
        const isEndOfReviews = (reviewsDisplayedCount >= allReviews.length);
        updateMoreButton(isEndOfReviews);
    }

    moreReviewsButton.addEventListener('click', () => {
        if (reviewsDisplayedCount >= allReviews.length) {
            reviewsDisplayedCount = 0;
            displayReviews(0, reviewsToLoadPerClick);
        } else {
            displayReviews(reviewsDisplayedCount, reviewsToLoadPerClick);
        }
    });

    displayReviews(0, reviewsToLoadPerClick);

    productDetails.appendChild(reviewsSection);
    productCardElement.appendChild(productDetails);

    return productCardElement;
}

//render products
document.addEventListener('DOMContentLoaded', () => {
    const mainProductColumn = document.querySelector(".main-product-column");
    const comparedProductsColumn = document.querySelector(".compared-products-column");
    const mainProductCard = createProductCard(sampleProductData);
    mainProductColumn.appendChild(mainProductCard);

    const otherProductData = [
        { ...sampleProductData, Product_No: "TOAST002", Title: "Compact Toaster Pro", Image_URL: "../image/toaster2.jpg", Prices: [550.00, 570.00, 540.00] },
        { ...sampleProductData, Product_No: "TOAST003", Title: "Retro Toaster", Image_URL: "../image/toaster3.jpg", Prices: [400.00, 420.00, 390.00] },
        { ...sampleProductData, Product_No: "TOAST004", Title: "4-Slice Toaster", Image_URL: "../image/toaster4.jpg", Prices: [650.00, 680.00, 630.00] },
        { ...sampleProductData, Product_No: "TOAST005", Title: "Mini Toaster", Image_URL: "../image/toaster5.jpg", Prices: [300.00, 320.00, 290.00] }
    ];

    otherProductData.forEach(product => {
        const comparedCard = createProductCard(product);
        comparedProductsColumn.appendChild(comparedCard);
    });
});

function getCsrfToken() {
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    return metaTag ? metaTag.content : null;
}

async function sendRequest() {
    console.log("SENDING REQUEST");
    const csrfToken = getCsrfToken();

    if (!csrfToken) {
        console.error("CSRF token not found. Aborting DeleteAccount request.");
        alert("Security error: CSRF token missing. Please refresh the page.");
        return;
    }
    const reqURL = '../api.php';

    try {
        const response = await fetch(reqURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "X-CSRF-Token": csrfToken
            },
            body: JSON.stringify(getAllProducts)
        });

        const result = await response.json();
        console.dir(result, {
            depth: null
        });

        // Store all products globally
        if (getAllProducts.type === "GetAllProducts" || getAllProducts.type === "Search") {
            allProducts = result.data.Products;

        } else {
            allProducts = result.data;
        }

        //setting the Filter Items 
        setFilterItems(allProducts)
        // Set up pagination and render the first page
        setupPagination(allProducts.length);
        if (getAllProducts.type === "Search") {
            renderProductsPage(1);
        } else {
            renderProductsPage(currentPage);
        }

        return allProducts;

    } catch (error) {
        console.error("Request failed", error);
    }
}

//No Response Request

async function sendAddRequest(dataToSend) {
    console.log("SENDING REQUEST");
    const csrfToken = getCsrfToken();

    if (!csrfToken) {
        console.error("CSRF token not found. Aborting DeleteAccount request.");
        alert("Security error: CSRF token missing. Please refresh the page.");
        return;
    }
    const reqURL = '../api.php';

    try {
        const response = await fetch(reqURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "X-CSRF-Token": csrfToken
            },
            body: JSON.stringify(dataToSend)
        });

        const result = await response.json();
        console.dir(result, {
            depth: null
        });

    } catch (error) {
        console.error("Request failed", error);
    }
}
