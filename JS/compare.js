let allProducts = [];

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) == 0) {
            return c.substring(nameEQ.length, c.length);
        }
    }
    return null;
}

const api_key = getCookie('api_key');


// New DOM elements for the modal
const reviewModal = document.getElementById('reviewModal');
const reviewModalHeader = document.getElementById('reviewModalHeader');
const reviewForm = document.getElementById('reviewForm');
const reviewDescriptionInput = document.getElementById('reviewDescription');
const reviewRatingInput = document.getElementById('reviewRating');
const submitReviewButton = document.getElementById('submitReviewButton');
const closeButton = document.querySelector('.close-button');
const reviewFormMessage = document.getElementById('reviewFormMessage');

let initialProductsRequest = {
    type: "ProductCompare",
    apikey: api_key
};


// Requests:
function getCsrfToken() {
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    return metaTag ? metaTag.content : null;
}

async function sendRequest(requestData) {
    const csrfToken = getCsrfToken();
    if (!csrfToken) {
        throw new Error("Security error: CSRF token missing. Please refresh the page.");
    }

    const reqURL = '../api.php';

    try {
        const response = await fetch(reqURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "X-CSRF-Token": csrfToken
            },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            try {
                const errorJson = JSON.parse(errorText);
                throw new Error(`API error! Status: ${response.status}, Message: ${errorJson.message || JSON.stringify(errorJson)}`);
            } catch (e) {
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
            }
        }

        const result = await response.json();
        console.dir(result, {
            depth: null
        });


        if (requestData.type === "ProductCompare") {
            return (result && result.data && Array.isArray(result.data.products)) ? result.data.products : [];
        } else if (requestData.type === "GetProductReviews") {
            return (result && result.data && Array.isArray(result.data)) ? result.data : [];
        } else if (requestData.type === "RemoveFromCompare") {
            if (result ) {
                console.log(`Product '${requestData.Product_Name}' removed successfully from comparison.`);
                return true; 
            } else {
                
                console.error(`Failed to remove product '${requestData.Product_Name}':`, result);
                return false; 
            }
        } else {
            return result;
        }

    } catch (error) {
        console.error("Request failed:", error);
        throw error;
    }
}


function moveProductInArray(arr, fromIndex, toIndex) {
    if (toIndex < 0 || toIndex >= arr.length) {
        return false; // Invalid target index
    }
    const element = arr.splice(fromIndex, 1)[0]; 
    arr.splice(toIndex, 0, element);
    return true;
}


async function displayProducts() {
    ClearDisplay()
    const mainProductColumn = document.querySelector(".main-product-column");
    const comparedProductsColumn = document.querySelector(".compared-products-column");
    try {

        if (allProducts.length === 0) {
            allProducts = await sendRequest(initialProductsRequest);
        }

        if (!allProducts || allProducts.length === 0) {
            const noProductsMessage = document.createElement('p');
            noProductsMessage.textContent = "No products available for comparison.";
            if (comparedProductsColumn) comparedProductsColumn.appendChild(noProductsMessage);
            return;
        }

        const mainProductData = { ...allProducts[0] }; // Shallow copy

        if (mainProductColumn && mainProductData) {
            const mainProductReviewRequest = {
                type: "GetProductReviews",
                Title: mainProductData.Title
            };
            try {
                mainProductData.Reviews = await sendRequest(mainProductReviewRequest);
            } catch (error) {
                console.error(`Failed to fetch reviews for main product ${mainProductData.Title}:`, error);
                mainProductData.Reviews = [];
            }
            const mainCard = createProductCard(mainProductData, 0);
            mainProductColumn.appendChild(mainCard);
        }

        for (let i = 1; i < allProducts.length; i++) {
            const product = allProducts[i];
            const reviewRequest = {
                type: "GetProductReviews",
                Title: product.Title
            };

            try {
                product.Reviews = await sendRequest(reviewRequest);
            } catch (error) {
                console.error(`Failed to fetch reviews for ${product.Title}:`, error);
                product.Reviews = [];
            }
            const comparedCard = createProductCard(product, i);
            if (comparedProductsColumn) comparedProductsColumn.appendChild(comparedCard);
        }
    } catch (error) {
        console.error("An error occurred during product display:", error);
        const errorMessage = document.createElement('p');
        errorMessage.textContent = "Error loading products. Please try again later.";
        if (comparedProductsColumn) comparedProductsColumn.appendChild(errorMessage);
    }
}
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

function createProductCard(product, currentIndex) {
    const productCardElement = document.createElement("div");
    productCardElement.className = "product-card";
    productCardElement.dataset.productId = product.Product_No;
    productCardElement.dataset.productIndex = currentIndex; 

    // creating product img
    const productCardHeader = document.createElement("div");
    productCardHeader.classList.add("product-card-header");

    const productImage = document.createElement("img");
    productImage.src = product.ImageUrl ;
    productImage.alt = product.Title ;
    productCardHeader.appendChild(productImage);

    // creating alternate prices
    const alternatePricesBox = document.createElement("div");
    alternatePricesBox.classList.add("alternate-prices-box");

    const alternatePricesTitle = document.createElement("h3");
    alternatePricesTitle.textContent = "Alternate Prices:";
    alternatePricesBox.appendChild(alternatePricesTitle);

    if (product.retailers && Array.isArray(product.retailers) &&
        product.prices && Array.isArray(product.prices) &&
        product.retailers.length > 0) {

        product.retailers.forEach((retailer, index) => {
            if (retailer !== undefined && product.prices[index] !== undefined) {
                const priceItem = document.createElement("div");
                priceItem.classList.add("price-item");

                const retailerName = document.createElement("h4");
                retailerName.classList.add("retailer-name");
                retailerName.textContent = retailer;
                priceItem.appendChild(retailerName);

                const productPrice = document.createElement("h4");
                productPrice.classList.add("product-price");
                productPrice.textContent = `R${parseFloat(product.prices[index]).toFixed(2)}`;
                priceItem.appendChild(productPrice);

                alternatePricesBox.appendChild(priceItem);
            }
        });
    } else {
        const noPricesMessage = document.createElement("p");
        noPricesMessage.textContent = "No alternate prices available.";
        alternatePricesBox.appendChild(noPricesMessage);
    }
    productCardHeader.appendChild(alternatePricesBox);
    productCardElement.appendChild(productCardHeader);

    // creating product details
    const productDetails = document.createElement("div");
    productDetails.classList.add("product-details");

    const productTitle = document.createElement("h4");
    productTitle.classList.add("product-title");
    productTitle.textContent = product.Title || 'Unknown Product';
    productDetails.appendChild(productTitle);

    // creating rating
    const productRatingDiv = document.createElement("div");
    productRatingDiv.classList.add("product-rating");
    const averageRating = (product.Reviews && Array.isArray(product.Reviews) && product.Reviews.length > 0)
        ? product.Reviews.reduce((sum, rev) => sum + (rev.Rating || 0), 0) / product.Reviews.length
        : 0;
    productRatingDiv.appendChild(createStarRating(averageRating));
    productDetails.appendChild(productRatingDiv);

    // creating description
    const productDescriptionDiv = document.createElement("div");
    productDescriptionDiv.classList.add("product-description");
    const descriptionHeading = document.createElement("h4");
    descriptionHeading.textContent = "Description";
    productDescriptionDiv.appendChild(descriptionHeading);
    const descriptionParagraph = document.createElement("p");
    descriptionParagraph.textContent = product.Description || 'No description provided for this product.';
    productDescriptionDiv.appendChild(descriptionParagraph);
    productDetails.appendChild(productDescriptionDiv);

    // creating reviews section
    const reviewsSection = document.createElement("div");
    reviewsSection.classList.add("reviews-section");
    const reviewsHeading = document.createElement("h4");
    reviewsHeading.textContent = "Reviews";
    reviewsSection.appendChild(reviewsHeading);

    // creating review buttons
    const reviewButtonGroup = document.createElement("div");
    reviewButtonGroup.classList.add("review-buttons-group");

    const moreReviewsButton = document.createElement("button");
    moreReviewsButton.classList.add("btn-review", "more-reviews-btn");
    reviewButtonGroup.appendChild(moreReviewsButton);

    const addReviewButton = document.createElement("button");
    addReviewButton.classList.add("btn-review","add-review-btn");
    addReviewButton.innerHTML = '<i class="fas fa-plus-square"></i> ';
    reviewButtonGroup.appendChild(addReviewButton);

    const likeButton = document.createElement("button");
    likeButton.classList.add("btn-review","add-to-favourite-btn");
    likeButton.innerHTML = '<i class="fas fa-heart"></i> ';
    reviewButtonGroup.appendChild(likeButton);

    const removeButton = document.createElement("button");
    removeButton.classList.add("btn-review", "remove-product-btn");
    removeButton.innerHTML = '<i class="fas fa-times-circle"></i> '; 
    reviewButtonGroup.appendChild(removeButton);

    // Position Changer Elements
    const positionChangerDiv = document.createElement("div");
    positionChangerDiv.classList.add("position-changer");

    const positionInput = document.createElement("input");
    positionInput.classList.add("position-input");
    positionInput.type = "number";
    positionInput.min = "1";
    positionInput.max = allProducts.length.toString();
    positionInput.value = (currentIndex + 1).toString(); 
    positionInput.title = `Enter new position (1-${allProducts.length})`;

    const positionButton = document.createElement("button");
    positionButton.classList.add("btn-review","position-button");
    positionButton.innerHTML = '<i class="fas fa-arrows-alt-h"></i> '; 

    positionChangerDiv.appendChild(positionButton);
    positionChangerDiv.appendChild(positionInput);
    reviewButtonGroup.appendChild(positionChangerDiv); 


    reviewsSection.appendChild(reviewButtonGroup);

    //handling review logic
    const allReviews = product.Reviews || [];
    if (Array.isArray(allReviews)) {
        // console.log(allReviews[0]) // Removed for cleaner console
    } else {
        // console.log(product.Reviews); // Removed for cleaner console
    }
    let reviewsDisplayedCount = 0;
    const reviewsToLoadPerClick = 2;

    function updateMoreButton(isEndOfReviews) {
        if (isEndOfReviews) {
            moreReviewsButton.innerHTML = '<i class="fas fa-undo-alt"></i> Back';
        } else {
            moreReviewsButton.innerHTML = '<i class="fas fa-chevron-down"></i> ';
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

        let reviewsToRender = allReviews.slice(startIndex, startIndex + count);

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
            reviewNameLabel.textContent = review.name || (review.U_ID ? ("Review ID " + review.U_ID) : 'Anonymous'); // Use review.name or U_ID
            reviewHeader.appendChild(reviewNameLabel);

            const reviewRatingLabel = document.createElement("label");
            reviewRatingLabel.classList.add("review-rating");
            reviewRatingLabel.setAttribute("for", "Rating");
            reviewRatingLabel.textContent = review.Rating;
            reviewHeader.appendChild(reviewRatingLabel);

            const reviewDateLabel = document.createElement("label");
            reviewDateLabel.classList.add("review-date");
            reviewDateLabel.setAttribute("for", "Rating");
            reviewDateLabel.textContent = review.Date; // Corrected to review.Date based on previous assumption
            reviewHeader.appendChild(reviewDateLabel);

            reviewItem.appendChild(reviewHeader);

            const reviewParagraph = document.createElement("p");
            reviewParagraph.textContent = review.review_text;
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

// --- DELEGATED EVENT LISTENER FOR REMOVE BUTTONS ---
document.addEventListener("click", function (event) {
    const btn = event.target.closest(".remove-product-btn");
    if (btn) {
        const productCardElement = btn.closest(".product-card");
        if (productCardElement) {
            const titleElement = productCardElement.querySelector(".product-title");
            if (titleElement) {
                const productTitle = titleElement.textContent;
                removeProduct(productTitle, productCardElement);
            } else {
                console.warn("Could not find product title element within the product card.", productCardElement);
            }
        } else {
            console.warn("Could not find parent .product-card for the remove button.", btn);
        }
    }
});

// --- NEW: DELEGATED EVENT LISTENER FOR POSITION BUTTONS ---
document.addEventListener("click", function (event) {
    const btn = event.target.closest(".position-button");

    if (btn) {
        const productCardElement = btn.closest(".product-card");
        if (productCardElement) {
            const currentProductIndex = parseInt(productCardElement.dataset.productIndex);
            const positionInput = productCardElement.querySelector(".position-input");
            const newPosition = parseInt(positionInput.value); 

            if (isNaN(newPosition) || newPosition < 1 || newPosition > allProducts.length) {
                alert(`Invalid position. Please enter a number between 1 and ${allProducts.length}.`);
                return;
            }
            const newIndex = newPosition - 1;

            if (currentProductIndex !== newIndex) { 
                const moved = moveProductInArray(allProducts, currentProductIndex, newIndex);
                if (moved) {
                    console.log(`Moved product from index ${currentProductIndex} to ${newIndex}.`);
                    displayProducts(); 
                } else {
                    console.error("Failed to move product in array (should not happen with valid input).");
                }
            } else {
                 console.log("Product is already in the desired position.");
            }
        } else {
            console.warn("Could not find parent .product-card for the position button.", btn);
        }
    }
});

async function removeProduct(productTitle, productCardElement) {
   
    try {
        const removeRequest = {
            type: "RemoveFromCompare",
            apikey: api_key,
            Product_Name: productTitle 
        };
        const success = await sendRequest(removeRequest);

        if (success) {
            allProducts = allProducts.filter(p => p.Title !== productTitle);
            console.log(`Product "${productTitle}" removed. Remaining products:`, allProducts);
            displayProducts();
        } else {
            alert(`Failed to remove "${productTitle}". Please try again.`);
        }
    } catch (error) {
        console.error("Error during product removal:", error);
        alert(`An error occurred while trying to remove "${productTitle}". Check console for details.`);
    }
}

// --- Call displayProducts to initiate the process when the DOM is ready ---
function ClearDisplay(){
    const mainProductColumn = document.querySelector(".main-product-column");
    const comparedProductsColumn = document.querySelector(".compared-products-column");
    if (mainProductColumn) {
        console.log("here");
        mainProductColumn.innerHTML = "";
    }
    if (comparedProductsColumn) comparedProductsColumn.innerHTML = "";
}


// Variable to store the title of the product being reviewed
let currentProductTitleForReview = '';

// Function to open the review modal
function openReviewModal(productTitle) {
    currentProductTitleForReview = productTitle;
    reviewModalHeader.textContent = `Add Review for "${productTitle}"`;
    reviewDescriptionInput.value = ''; 
    reviewRatingInput.value = ''; 
    reviewFormMessage.textContent = ''; 
    reviewFormMessage.classList.remove('success', 'error');
    reviewModal.style.display = 'flex'; 
}

// Function to close the review modal
function closeReviewModal() {
    reviewModal.style.display = 'none';
}

// Event listener for opening the modal (delegated to document)
document.addEventListener('click', function(event) {
    const addReviewBtn = event.target.closest('.add-review-btn'); 

    if (addReviewBtn) {
        const productCardElement = addReviewBtn.closest('.product-card');
        if (productCardElement) {
            const titleElement = productCardElement.querySelector('.product-title');
            if (titleElement) {
                const productTitle = titleElement.textContent;
                openReviewModal(productTitle);
            } else {
                console.warn("Could not find product title for review modal.");
            }
        }
    }
});

// Event listeners for closing the modal
closeButton.addEventListener('click', closeReviewModal);
// Close modal if user clicks outside of the modal content
window.addEventListener('click', function(event) {
    if (event.target === reviewModal) {
        closeReviewModal();
    }
});

// Event listener for submitting the review form inside the modal
reviewForm.addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission

    const description = reviewDescriptionInput.value.trim();
    const rating = parseFloat(reviewRatingInput.value);

    // Basic validation
    if (!description || description.length < 5) {
        reviewFormMessage.textContent = 'Please enter a description (at least 5 characters).';
        reviewFormMessage.className = 'form-message error';
        return;
    }
    if (isNaN(rating) || rating < 1 || rating > 5) {
        reviewFormMessage.textContent = 'Please enter a rating between 1 and 5.';
        reviewFormMessage.className = 'form-message error';
        return;
    }

    const reviewData = {
        type: "AddReview", 
        apikey: api_key,
        Title: currentProductTitleForReview, 
        Rating: rating, 
        Review : description 
    };

    try {
       
        submitReviewButton.disabled = true;
        submitReviewButton.textContent = 'Submitting...';

        const response = await sendRequest(reviewData); 
        if (response ) { 
            reviewFormMessage.textContent = 'Review added successfully!';
            reviewFormMessage.className = 'form-message success';
            setTimeout(() => {
                closeReviewModal();
                displayProducts(); 
            }, 1000); 
        } 
    } catch (error) {
        console.error("Error adding review:", error);
        reviewFormMessage.textContent = 'An error occurred while adding review.';
        reviewFormMessage.className = 'form-message error';
    } finally {
        submitReviewButton.disabled = false;
        submitReviewButton.textContent = 'Add Review';
    }
});

document.addEventListener("click", async function(event) {
    const addToFavouriteBtn = event.target.closest(".add-to-favourite-btn");

    if (addToFavouriteBtn) {
        const productCardElement = addToFavouriteBtn.closest(".product-card");
        if (productCardElement) {
            const titleElement = productCardElement.querySelector(".product-title");
            if (titleElement) {
                const productTitle = titleElement.textContent;

                try {
                    const addToFavouriteRequest = {
                        type: "AddToFavourite",
                        apikey: api_key,
                        Product_Name: productTitle
                    };
                    addToFavouriteBtn.disabled = true;
                    addToFavouriteBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';

                    const success = await sendRequest(addToFavouriteRequest);

                    if (success) {
                        alert(`"${productTitle}" added to your favourites!`);
                        addToFavouriteBtn.innerHTML = '<i class="fas fa-heart" style="color: red;"></i> Liked';
                        addToFavouriteBtn.style.cursor = 'default';
                    } else {
                        alert(`Failed to add "${productTitle}" to favourites. Please try again.`);
                        addToFavouriteBtn.innerHTML = '<i class="fas fa-heart"></i> Like'; 
                    }
                } catch (error) {
                    console.error("Error adding to favourites:", error);
                    alert(`An error occurred while adding "${productTitle}" to favourites.`);
                    addToFavouriteBtn.innerHTML = '<i class="fas fa-heart"></i> Like'; 
                    addToFavouriteBtn.disabled = false;
                }
            } else {
                console.warn("Could not find product title for add to favourite.", productCardElement);
            }
        } else {
            console.warn("Could not find parent .product-card for the add to favourite button.", addToFavouriteBtn);
        }
    }
});



document.addEventListener('DOMContentLoaded', displayProducts);
