// Global variables for pagination
let allProducts = [];
const productsPerPage = 15;
let currentPage = 1;
const PPlace = document.getElementById("PPlace");
const pageButtonContainer = document.querySelector(".page-btn");
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';'); // Split the cookie string into an array of individual cookies
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') { // Remove leading spaces (e.g., " my_cookie=value" -> "my_cookie=value")
            c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) == 0) { // If this cookie starts with the name we're looking for
            return c.substring(nameEQ.length, c.length); // Return the value
        }
    }
    return null; // Cookie not found
}

function getCsrfToken() {
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    return metaTag ? metaTag.content : null;
}

const api_key = getCookie('api_key');

// fliters 
var btnFliter = document.getElementById("BtnFliter");
btnFliter.addEventListener("click", function () {
    var filterMenu = document.getElementById("filterMenu");
    if (filterMenu.style.display === "none" || filterMenu.style.display === "") {
        filterMenu.style.display = "block"; // Show sidebar
    } else {
        filterMenu.style.display = "none"; // Hide sidebar
    }
});
var btnClose = document.getElementById("btnClose");
btnClose.addEventListener("click", function () {
    filterMenu.style.display = "none";
});
document.addEventListener("DOMContentLoaded", function () {
    let priceRange = document.getElementById("priceRange");
    let priceValue = document.getElementById("priceValue");
    priceRange.addEventListener("input", function () {
        priceValue.value = priceRange.value;
    });
});


function createProductCard(product) {
    //  Create the main product card container
    const productCardElement = document.createElement("div");
    productCardElement.className = "col-4";
    productCardElement.dataset.productId = product.Product_No;
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
    const productTitle = document.createElement("h4");
    productTitle.id = "Title";
    productTitle.textContent = productName;
    CompareListElement.appendChild(productTitle);


    // remove message 
    const removeMessageDiv = document.createElement("div");
    removeMessageDiv.className = "remove-message";
    removeMessageDiv.textContent = "Click to remove";
    CompareListElement.appendChild(removeMessageDiv);

    return CompareListElement;
}

//Listing if an add to campare list button pressed ;
document.addEventListener("click", function (event) {
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
        const AddRequest = {
            type: "AddToCompare",
            apikey: api_key,
            Product_Name: titleElement.textContent
        };
        sendAddRequest(AddRequest)

    }
})

// Fetch Data from the database
var getAllProducts = {
    type: "GetAllProducts"
};

sendRequest();

//Request ----
async function sendRequest() {
    //console.log("SENDING REQUEST");
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
        } else if (getAllProducts.type === "ProductCompare") {
            return allProducts;
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
    //console.log("SENDING REQUEST");
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
    return result.data.products;
}

async function sendCompRequest(dataToSend) {
    console.log("SENDING REQUEST");

    const csrfToken = getCsrfToken();

    if (!csrfToken) {
        console.error("CSRF token not found. Aborting request.");
        alert("Security error: CSRF token missing. Please refresh the page.");
        return;
    }

    const reqURL = '../api.php';

    try {
        const response = await fetch(reqURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken
            },
            body: JSON.stringify(dataToSend)
        });

        const result = await response.json();
        console.dir(result, { depth: null });

        // Check if the result has the expected structure
        if (result && result.data && result.data.products) {
            return result.data.products;
        } else {
            console.warn("Unexpected response structure:", result);
            return []; // fallback if structure is not as expected
        }

    } catch (error) {
        console.error("Request failed", error);
        return []; // fallback if request fails
    }
}

function renderProductsPage(page) {
    currentPage = page;
    PPlace.innerHTML = '';
    //console.log("Current page--------- : " + currentPage)
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToDisplay = allProducts.slice(startIndex, endIndex);
    if (!Array.isArray(productsToDisplay) || productsToDisplay.length === 0) {
        const noResultsMessage = document.createElement('p');
        noResultsMessage.textContent = "No products found on this page.";
        noResultsMessage.classList.add('no-results-message');
        PPlace.appendChild(noResultsMessage);
    } else {
        //console.log(`Displaying products for page ${currentPage}...`);
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


//Setting the filter items(not the filtered product just yet)
function setFilterItems(data) {

    if (window.filtersInitialized) {
        return;
    }
    window.filtersInitialized = true;
    var categories = [];
    var Retailer = [];
    var brands = [];

    data.forEach(product => {
        if (product.Retailer_Names && product.Retailer_Names.length > 0) {
            for (let i = 0; i < product.Retailer_Names.length; i++) {
                if (product.Retailer_Names[i] && !Retailer.includes(product.Retailer_Names[i])) {
                    Retailer.push(product.Retailer_Names[i]);
                }
            }
        }
        if (product.Brand && !brands.includes(product.Brand)) {
            brands.push(product.Brand);
        }

        if (product.Category && !categories.includes(product.Category)) {
            categories.push(product.Category);
        }
    });
    //console.log("Collected Retailers:", Retailer);
    const categorySelect = document.getElementById("Dropdown_Category");
    const RetailerSelect = document.getElementById("Dropdown_Retailer");
    const brandSelect = document.getElementById("Dropdown_brand");


    categories.forEach(category => {
        var option = document.createElement("option");
        option.value = category;
        option.text = category;
        categorySelect.appendChild(option);
    });

    Retailer.forEach(retail => {
        var option = document.createElement("option");
        option.value = retail;
        option.text = retail;
        RetailerSelect.appendChild(option);
    });

    brands.forEach(brand => {
        var option = document.createElement("option");
        option.value = brand;
        option.text = brand;
        brandSelect.appendChild(option);
    });
}

// setting filters when the page loads 

document.addEventListener('DOMContentLoaded', (event) => {

    var btnSearch = document.getElementById("btnSearch");
    btnSearch.addEventListener("click", function () {
        getAllProducts = {
            type: "Search",
            apikey: api_key,
            search: {
                "Title": "",
                "Category": "",
                "Description": "",
                "Brand": ""
            }
        };
        var input_search = document.querySelector('input[name="search"]');
        getAllProducts.search.Title = input_search.value;
        sendRequest();
    })

    // const sortSelect = document.querySelector(".filters-btn");
    // sortSelect.addEventListener("change", function () {
    //     var selectedSort = this.value;

    //     if (selectedSort === "price_asc") {
    //         getAllProducts.sort = "final_price";
    //         getAllProducts.order = "ASC";
    //     } else if (selectedSort === "price_desc") {
    //         getAllProducts.sort = "final_price";
    //         getAllProducts.order = "DESC";
    //     } else if (selectedSort === "Title") {
    //         getAllProducts.sort = "title";
    //         getAllProducts.order = "ASC";
    //     } else if (selectedSort === "Latest") {
    //         getAllProducts.sort = "date_first_available";
    //         getAllProducts.order = "DESC";
    //     } else if (selectedSort === "Country") {
    //         getAllProducts.sort = "country_of_origin";
    //         getAllProducts.order = "ASC";
    //     }

    //     sendRequest(); // Refresh products after sorting
    // });

    // var priceRange = document.querySelectorAll('input[id="priceRange"]');
    // priceRange.forEach(input => {
    // input.addEventListener("input", function () {
    //         sendRequest();
    //     });
    // });

    // var priceRange = document.querySelectorAll('input[id="priceValue"]');
    // priceRange.forEach(input => {
    // input.addEventListener("input", function () {
    //         sendRequest();
    //     });
    // });

    const categorySelect = document.getElementById("Dropdown_Category");
    // const countrySelect = document.getElementById("Dropdown_country");
    const brandSelect = document.getElementById("Dropdown_brand");

    categorySelect.addEventListener("change", function () {
        getAllProducts = {
            type: "Filter",
            apikey: api_key,
            filter: {
                "byCategory": categorySelect.value
            }
        };
        sendRequest();
    });

    // countrySelect.addEventListener("change", function () {
    //     getAllProducts.search.country_of_origin = countrySelect.value;
    //     sendRequest();
    // });

    brandSelect.addEventListener("change", function () {

        getAllProducts = {
            type: "Filter",
            apikey: api_key,
            filter: {
                "byBrand": brandSelect.value
            }
        };
        sendRequest();


    });
    ///////////////////////////////////////////////////////////////////////////
    // const btnClear = document.getElementById(btnClear)
    // btnClear.addEventListener("click",function(){

    //     getAllProducts.search.title ="";
    //     getAllProducts.search.categories = "";
    //     getAllProducts.search.country_of_origin ="";
    //     getAllProducts.search.brand ="";
    //     fetchProducts() ;
    // });
});


//Adding to the  ADD TO FAVOURITES

document.addEventListener("click", async function (event) {
    if (event.target.closest(".add-fav")) {
        var btn = event.target.closest(".add-fav");
        var productCard = btn.closest(".col-4");


        if (productCard) {
            var titleElement = productCard.querySelector("#Title");
            //console.log("Product ID to add to Favourites :", titleElement.textContent);

            const addToFavPayload = {
                type: "AddToFavourite",
                apikey: api_key,
                Product_Name: titleElement.textContent
            };
            const heartIcon = btn.querySelector('.fa-heart');

            if (heartIcon) {
                btn.classList.add('animate-bg-and-heart');
                heartIcon.classList.add('animate-favorite');

                try {
                    await sendAddRequest(addToFavPayload);
                    setTimeout(() => {
                        btn.classList.remove('animate-bg-and-heart');
                        heartIcon.classList.remove('animate-favorite');
                    }, 2000);

                } catch (error) {
                    console.error("Failed to add to favorites:", error);
                    btn.classList.remove('animate-bg-and-heart');
                    heartIcon.classList.remove('animate-favorite');
                    alert("Failed to add to favorites. Please try again.");
                }
            } else {
                console.warn("Heart icon not found inside .add-fav button.");
            }
        }
    }
});

// Listener for removing compare items
document.addEventListener("click", function (event) {
    const clickedCompareItem = event.target.closest(".compareitem");

    if (clickedCompareItem) {
        var titleElement = clickedCompareItem.querySelector("#Title");
        if (titleElement) {
            //console.log("Removing product ID:", titleElement);
            // Remove item from DOM
            clickedCompareItem.remove();
            const AddRequest = {
                type: "RemoveFromCompare",
                apikey: api_key,
                Product_Name: titleElement.textContent
            };
            sendAddRequest(AddRequest)
        } else {
            console.warn("Missing data-product-id on:", clickedCompareItem);
        }
    }
});

//Listing if an add to campare list button pressed ;
async function displayCompare() {
    let compareList = document.getElementById("compareList");

    const AddRequest = {
        type: "ProductCompare",
        apikey: api_key
    };

    let allProducts = await sendCompRequest(AddRequest);

    for (let i = 0; i < allProducts.length; i++) {
        const product = allProducts[i];

        // Assuming the product object has Title and ImageURL fields
        const title = product.Title;
        const image = product.ImageUrl; // or whatever the correct field is

        let newItem = createCompareListCard(title, image);
        compareList.insertBefore(newItem, compareList.lastElementChild);
    }
}
document.addEventListener("click", function (event) {
    if (event.target.closest(".btn-compare2")) {
        const csrfToken = getCsrfToken();

        if (!csrfToken) {
            console.error("CSRF token not found. Aborting DeleteAccount request.");
            alert("Security error: CSRF token missing. Please refresh the page.");
            return;
        }
        fetch("../api.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-Token": csrfToken
            },
            body: JSON.stringify({
                type: "AddUserXP",
                apikey: api_key,
                xp: 15
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    console.log("+15xp")
                } else {
                    console.error("Failed to add user experience:", data.data);
                }
            })
            .catch(error => {
                console.error("Network error adding user experience:", error);
            });
        window.location.href = "compare.php";
    }
});
document.addEventListener('DOMContentLoaded', displayCompare);