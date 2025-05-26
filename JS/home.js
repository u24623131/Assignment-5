// Global variables for pagination
let allProducts = []; 
const productsPerPage = 15;
let currentPage = 1;
const PPlace = document.getElementById("PPlace");
const pageButtonContainer = document.querySelector(".page-btn"); 

// fliters (Keep your existing filter logic)
var btnFliter = document.getElementById("BtnFliter");
btnFliter.addEventListener("click", function() {
    var filterMenu = document.getElementById("filterMenu");
    if (filterMenu.style.display === "none" || filterMenu.style.display === "") {
        filterMenu.style.display = "block"; // Show sidebar
    } else {
        filterMenu.style.display = "none"; // Hide sidebar
    }
});
var btnClose = document.getElementById("btnClose");
btnClose.addEventListener("click", function() {
    filterMenu.style.display = "none";
});
document.addEventListener("DOMContentLoaded", function() {
    let priceRange = document.getElementById("priceRange");
    let priceValue = document.getElementById("priceValue");
    priceRange.addEventListener("input", function() {
        priceValue.value = priceRange.value;
    });
});

function createProductCard(product) {
    // 1. Create the main product card container
    const productCardElement = document.createElement("div");
    productCardElement.className = "col-4";

    // Create and append
    // image
    const productImage = document.createElement("img");
    productImage.src = product.Image_URL;
    productCardElement.appendChild(productImage);

    // product title
    const productTitle = document.createElement("h4");
    productTitle.textContent = product.Title;
    productTitle.id = "Title";
    productCardElement.appendChild(productTitle);

    // Retailer and Price display with navigation
    const retailerInfoElement = document.createElement("div");
    retailerInfoElement.className = "retail";

    const retailerPrevIcon = document.createElement("i");
    retailerPrevIcon.classList.add("fas", "fa-chevron-left");
    retailerInfoElement.appendChild(retailerPrevIcon);

    const retailerNameElement = document.createElement("p");
    retailerNameElement.className = "current-retailer";
    retailerInfoElement.appendChild(retailerNameElement);

    const retailerNextIcon = document.createElement("i");
    retailerNextIcon.classList.add("fas", "fa-chevron-right");
    retailerInfoElement.appendChild(retailerNextIcon);

    productCardElement.appendChild(retailerInfoElement);

    // Brand name
    const brandElement = document.createElement("p");
    brandElement.textContent = product.Brand;
    brandElement.className = "brand";
    productCardElement.appendChild(brandElement);

    // Price section
    const priceContainer = document.createElement("div");
    priceContainer.className = "prices";

    // Display the number of retailers in the "Iprice" slot
    const retailerCountElement = document.createElement("p");
    retailerCountElement.classList.add("Iprice");
    const retailerCount = product.Retailer_Names ? product.Retailer_Names.length : 0;
    retailerCountElement.textContent = `${retailerCount} Retailers`;
    priceContainer.appendChild(retailerCountElement);


    // Display the current price
    const currentPriceElement = document.createElement("p");
    currentPriceElement.className = "Aprice current-price";
    priceContainer.appendChild(currentPriceElement);

    productCardElement.appendChild(priceContainer);

    // Category
    const categoryElement = document.createElement("p");
    categoryElement.textContent = product.Category;
    productCardElement.appendChild(categoryElement);

    // Button group
    const buttonGroup = document.createElement("div");
    buttonGroup.className = "btn-group";

    // Add to Favorites Button
    const addToFavoritesButton = document.createElement("button");
    addToFavoritesButton.classList.add("btn", "add-fav");
    const heartIcon = document.createElement("i");
    heartIcon.classList.add("fas", "fa-heart");
    addToFavoritesButton.appendChild(heartIcon);
    buttonGroup.appendChild(addToFavoritesButton);

    // Compare Button
    const compareButton = document.createElement("button");
    compareButton.classList.add("btn", "btn-compare");
    const compareIcon = document.createElement("i");
    compareIcon.classList.add("fas", "fa-plus-square");
    compareButton.appendChild(compareIcon);
    compareButton.appendChild(document.createTextNode(" Compare"));
    buttonGroup.appendChild(compareButton);

    productCardElement.appendChild(buttonGroup);

    // --- Dynamic Retailer/Price Logic ---
    let currentRetailerIndex = 0;

    function updateRetailerAndPrice() {
        if (product.Retailer_Names && product.Retailer_Names.length > 0) {
            retailerNameElement.textContent = product.Retailer_Names[currentRetailerIndex];
            currentPriceElement.textContent = `R${parseFloat(product.Prices[currentRetailerIndex]).toFixed(2)}`;
        } else {
            retailerNameElement.textContent = "N/A";
            currentPriceElement.textContent = "R0.00";
        }
    }

    updateRetailerAndPrice();

    // Event listeners for navigation
    retailerPrevIcon.addEventListener('click', () => {
        currentRetailerIndex = (currentRetailerIndex - 1 + product.Retailer_Names.length) % product.Retailer_Names.length;
        updateRetailerAndPrice();
    });

    retailerNextIcon.addEventListener('click', () => {
        currentRetailerIndex = (currentRetailerIndex + 1) % product.Retailer_Names.length;
        updateRetailerAndPrice();
    });

    return productCardElement;
}


function createCompareListCard(productName, imageSource) {
    //Create and append
    // Compare List Element
    const CompareListElement = document.createElement("div");
    CompareListElement.className = "compareitem";

    //image
    const productImage = document.createElement("img");
    productImage.src = imageSource;

    CompareListElement.appendChild(productImage);

    //title
    const productTitle = document.createElement("h4")
    productTitle.textContent = productName;

    CompareListElement.appendChild(productTitle);

    return CompareListElement;
}

//Listing if an add to campare list button pressed ;
document.addEventListener("click", function(event) {
    if (event.target.closest(".btn-compare")) {
        // Get compare list box
        let compareList = document.getElementById("compareList");
        // Get the button that was clicked
        var btn = event.target.closest(".btn-compare");
        // Find the nearest product container
        var productDiv = btn.closest(".col-4");
        // Find the h4 with id="Title" inside that product container
        var titleElement = productDiv.querySelector("#Title");
        // Find the img inside that product container
        var imgElement = productDiv.querySelector("img");
        // Create the new card
        let newItem = createCompareListCard(titleElement.textContent, imgElement.src);
        // Insert the new card before the last element (the button)
        compareList.insertBefore(newItem, compareList.lastElementChild);

    }
})

// Fetch Data from the database
var getAllProducts = {
    type: "GetAllProducts"
};

sendRequest();

async function sendRequest() {
    console.log("SENDING REQUEST");
    const reqURL = '../api.php';

    try {
        const response = await fetch(reqURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(getAllProducts)
        });

        const result = await response.json();
        console.dir(result, {
            depth: null
        });

        // Store all products globally
        allProducts = result.data.Products;

        // Set up pagination and render the first page
        setupPagination(allProducts.length);
        renderProductsPage(currentPage);

    } catch (error) {
        console.error("Request failed", error);
    }
}



function renderProductsPage(page) {
    currentPage = page; 
    PPlace.innerHTML = ''; 

    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToDisplay = allProducts.slice(startIndex, endIndex);

    if (!Array.isArray(productsToDisplay) || productsToDisplay.length === 0) {
        const noResultsMessage = document.createElement('p');
        noResultsMessage.textContent = "No products found on this page.";
        noResultsMessage.classList.add('no-results-message');
        PPlace.appendChild(noResultsMessage);
    } else {
        console.log(`Displaying products for page ${currentPage}...`);
        productsToDisplay.forEach(Product => {
            const productToAdd = createProductCard(Product);
            PPlace.appendChild(productToAdd);
        });
    }

    // Update active class on pagination numbers
    updatePaginationActiveButton();
}


function setupPagination(totalItems) {
    pageButtonContainer.innerHTML = ''; 
    const totalPages = Math.ceil(totalItems / productsPerPage);

    if (totalPages <= 1) {
        return; 
    }

    // Add "Previous" arrow
    const prevSpan = document.createElement('span');
    prevSpan.innerHTML = '&#8592;'; // Left arrow
    prevSpan.classList.add('page-arrow', 'prev-page');
    prevSpan.addEventListener('click', () => {
        if (currentPage > 1) {
            renderProductsPage(currentPage - 1);
        }
    });
    pageButtonContainer.appendChild(prevSpan);


    // Add page number spans
    for (let i = 1; i <= totalPages; i++) {
        const pageSpan = document.createElement('span');
        pageSpan.textContent = i;
        pageSpan.classList.add('page-number');
        if (i === currentPage) {
            pageSpan.classList.add('PActive'); 
        }
        pageSpan.addEventListener('click', () => renderProductsPage(i));
        pageButtonContainer.appendChild(pageSpan);
    }

    // Add "Next" arrow
    const nextSpan = document.createElement('span');
    nextSpan.innerHTML = '&#8594;'; // Right arrow
    nextSpan.classList.add('page-arrow', 'next-page');
    nextSpan.addEventListener('click', () => {
        if (currentPage < totalPages) {
            renderProductsPage(currentPage + 1);
        }
    });
    pageButtonContainer.appendChild(nextSpan);

    // Initial state of arrows
    updatePaginationArrowState(totalPages);
}

function updatePaginationActiveButton() {
    const pageNumbers = pageButtonContainer.querySelectorAll('.page-number');
    pageNumbers.forEach(span => {
        if (parseInt(span.textContent) === currentPage) {
            span.classList.add('PActive');
        } else {
            span.classList.remove('PActive');
        }
    });
    updatePaginationArrowState(Math.ceil(allProducts.length / productsPerPage));
}

function updatePaginationArrowState(totalPages) {
    const prevArrow = pageButtonContainer.querySelector('.prev-page');
    const nextArrow = pageButtonContainer.querySelector('.next-page');

    if (prevArrow) {
        if (currentPage === 1) {
            prevArrow.classList.add('disabled');
        } else {
            prevArrow.classList.remove('disabled');
        }
    }

    if (nextArrow) {
        if (currentPage === totalPages) {
            nextArrow.classList.add('disabled');
        } else {
            nextArrow.classList.remove('disabled');
        }
    }
}