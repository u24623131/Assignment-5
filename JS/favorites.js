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
})
var btnClose = document.getElementById("btnClose");
btnClose.addEventListener("click", function () {
    filterMenu.style.display = "none";
})

document.addEventListener("DOMContentLoaded", function () {
    let priceRange = document.getElementById("priceRange");
    let priceValue = document.getElementById("priceValue");
    priceRange.addEventListener("input", function () {
        priceValue.value = priceRange.value;
    });
});

function createProductCard(product) {
    // Create the main product card container
    const productCardElement = document.createElement("div");
    productCardElement.className = "col-4";
    productCardElement.dataset.productId = product.Product_No;

    // Left Section (Image)
    const productLeftSection = document.createElement("div");
    productLeftSection.className = "product-left-section";

    const productImage = document.createElement("img");
    productImage.src = product.Image_URL;
    productLeftSection.appendChild(productImage);

    productCardElement.appendChild(productLeftSection);

    // Right Section (Info & Buttons)
    const productRightSection = document.createElement("div");
    productRightSection.className = "product-right-section";

    // Title and Price Row
    const titlePriceRow = document.createElement("div");
    titlePriceRow.className = "title-price-row";

    // Main Title
    const productTitle = document.createElement("h4");
    productTitle.textContent = product.Title;
    titlePriceRow.appendChild(productTitle);

    // Price Display
    const priceContainer = document.createElement("div");
    priceContainer.className = "prices";

    // Retailer Count
    const retailerCountElement = document.createElement("p");
    retailerCountElement.classList.add("Iprice");
    const retailerCount = product.Retailer_Names ? product.Retailer_Names.length : 0;
    retailerCountElement.textContent = `${retailerCount} Retailers`;
    priceContainer.appendChild(retailerCountElement);

    // Current Price
    const currentPriceElement = document.createElement("p");
    currentPriceElement.className = "Aprice current-price";
    priceContainer.appendChild(currentPriceElement);

    titlePriceRow.appendChild(priceContainer);
    productRightSection.appendChild(titlePriceRow);

    // Retailer Navigation
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

    productRightSection.appendChild(retailerInfoElement);

    // Brand
    const brandElement = document.createElement("p");
    brandElement.textContent = product.Brand;
    brandElement.className = "brand";
    productRightSection.appendChild(brandElement);

    // Category
    const categoryElement = document.createElement("p");
    categoryElement.textContent = product.Category;
    categoryElement.className = "category-display";
    productRightSection.appendChild(categoryElement);

    // Description
    const descriptionElement = document.createElement("p");
    descriptionElement.textContent = product.Description;
    descriptionElement.className = "description-display";
    productRightSection.appendChild(descriptionElement);

    // Button Group
    const buttonGroup = document.createElement("div");
    buttonGroup.className = "btn-group";

    // Remove Button
    const addRemoveButton = document.createElement("button");
    addRemoveButton.classList.add("btn", "btn-remove");
    addRemoveButton.dataset.productId = product.Product_No;
    const trashIcon = document.createElement("i");
    trashIcon.classList.add("fas", "fa-trash");
    addRemoveButton.appendChild(trashIcon);
    buttonGroup.appendChild(addRemoveButton);

    // Compare Button
    const compareButton = document.createElement("button");
    compareButton.classList.add("btn", "btn-compare");
    const compareIcon = document.createElement("i");
    compareIcon.classList.add("fas", "fa-plus-square");
    compareButton.appendChild(compareIcon);
    compareButton.appendChild(document.createTextNode(" Compare"));
    buttonGroup.appendChild(compareButton);

    productRightSection.appendChild(buttonGroup);

    // Append right section to card
    productCardElement.appendChild(productRightSection);

    // Retailer and Price Logic
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

    // Initialize with first retailer
    updateRetailerAndPrice();

    // Retailer Nav Events
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
        let compareList = document.getElementById("compareList");
        var btn = event.target.closest(".btn-compare");
        var productCardElement = btn.closest(".col-4");

        if (productCardElement) {
            const productId = productCardElement.dataset.productId;
            var imgElement = productCardElement.querySelector(".product-left-section img");
            var titleElement = productCardElement.querySelector(".title-price-row h4");

            if (imgElement && titleElement && productId) {
                let newItem = createCompareListCard(titleElement.textContent, imgElement.src, productId);
                compareList.insertBefore(newItem, compareList.lastElementChild);
            } else {
                console.warn("Could not find required elements (image, title, or product ID) for comparison.", {
                    imgElement,
                    titleElement,
                    productId
                });
            }
        } else {
            console.warn("Could not find parent .col-4 for the compare button.", btn);
        }
    }
});

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
// Fetch Data from the database
var GetUserFavourite = {
    type: "GetUserFavourite",
    apikey: api_key
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
            body: JSON.stringify(GetUserFavourite)
        });

        const result = await response.json();
        console.dir(result, {
            depth: null
        });

        // Store all products globally
        allProducts = result.data;

        //setting the Filter Items 
        setFilterItems(allProducts)

        // Set up pagination and render the first page
        setupPagination(allProducts.length);
        renderProductsPage(currentPage);
        return allProducts;

    } catch (error) {
        console.error("Request failed", error);
    }
}

//No Response Request

async function sendRemoveRequest(dataToSend) {
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
    const retailerSelect = document.getElementById("Dropdown_Retailer");
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

    retailerSelect.addEventListener("change", function () {
 
        getAllProducts = {
            type: "Filter",
            apikey: api_key,
            filter: {
                "byRetailer": retailerSelect.value
            }
        };
        sendRequest();
    });

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

// Listener for removing compare items
document.addEventListener("click", function (event) {
    const clickedCompareItem = event.target.closest(".compareitem");

    if (clickedCompareItem) {
        var titleElement = clickedCompareItem.querySelector("#Title");
        if (titleElement) {
            //console.log("Removing product ID:", titleElement);
            // Remove item from DOM
            clickedCompareItem.remove();
        } else {
            console.warn("Missing data-product-id on:", clickedCompareItem);
        }
    }
});

//Removing from fravorites 

document.addEventListener("click", function (event) {
    if (event.target.closest(".btn-remove")) {
        var btn = event.target.closest(".btn-remove");
        var productCardElement = btn.closest(".col-4");

        if (productCardElement) {
            var titleElement = productCardElement.querySelector(".title-price-row h4");

            if (titleElement) {
                var RemoveFromFavourite = {
                    type: "RemoveFromFavourite",
                    "apikey": api_key,
                    "Title": titleElement.textContent
                }
                sendRemoveRequest(RemoveFromFavourite);
                productCardElement.remove();
            } else {
                console.warn("Could not find required element title", {
                    titleElement
                });
            }
        } else {
            console.warn("Could not find parent .col-4 for the compare button.", btn);
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