// fliters
    var btnFliter = document.getElementById("BtnFliter");
    btnFliter.addEventListener("click",function(){
        var filterMenu = document.getElementById("filterMenu");
        if (filterMenu.style.display === "none" || filterMenu.style.display === "") {
            filterMenu.style.display = "block"; // Show sidebar
        } else {
            filterMenu.style.display = "none"; // Hide sidebar
        }
    })
    var btnClose = document.getElementById("btnClose");
    btnClose.addEventListener("click",function(){
        filterMenu.style.display = "none";
    })
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


function createCompareListCard(productName , imageSource){
    
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

    CompareListElement.appendChild(productTitle );
    
    return CompareListElement ;
}

//Listing if an add to campare list button pressed ;
document.addEventListener("click" ,function(event){
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
  type : "GetAllProducts"
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
        //  if (!response.ok) {
        //     // Read the response body in the case of an error
        //     const errorText = await response.text();
        //     // Throw a new error containing the status code and the error from the server
        //     throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
        // }
        // const responseData = await response.text();
        // console.log(responseData);
        const result = await response.json();
        console.dir(result, { depth: null }); 
        displayProduct(JSON.stringify(result));
    } catch (error) {
        console.error("Request failed", error);
    }
}

function displayProduct(data) {
    // hideLoading();
    const ProductContainer = document.querySelector('.ProductPlace');
    while (ProductContainer.firstChild) {
        ProductContainer.removeChild(ProductContainer.firstChild);
    }
    const parsedData = JSON.parse(data);
    const products = parsedData.data.Products;
    
    if (!Array.isArray(products) || products.length === 0) {
        const noResultsMessage = document.createElement('p');
        noResultsMessage.textContent = "No products found.";
        noResultsMessage.classList.add('no-results-message');
        ProductContainer.appendChild(noResultsMessage);
    }  else {
        console.log("Display Product...");
        // const filterPrice = document.getElementById("priceValue").value ;

        // const filteredProducts = parsedData.data.filter(product => {
        // const productPrice = parseFloat(product.final_price);
        // return productPrice <= filterPrice ;
        // });

        // if (filteredProducts.length === 0) {
        // const noResultsMessage2 = document.createElement('p');
        // noResultsMessage2.textContent = "No products found.";
        // noResultsMessage2.classList.add('no-results-message');
        // ProductContainer.appendChild(noResultsMessage2);
        // return;}
        
        console.log("Parsed data: " + products);
        products.forEach(Product => {
            console.log(Product.Image_URL)
            var productToAdd = createProductCard(Product);
            PPlace.appendChild(productToAdd)
            
            } )
        }
        
        // setFilters(data);
    }