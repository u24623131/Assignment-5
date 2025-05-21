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

function createProductCard(productName, initialPrice, finalPrice, imageSource, countryOfOrigin, brandName, retailerName) {
    // 1. Create the main product card container
    const productCardElement = document.createElement("div");
    productCardElement.className = "col-4";

    //Create and append
    // image
    const productImage = document.createElement("img");
    productImage.src = imageSource;
    productCardElement.appendChild(productImage);

    // product title
    const productTitle = document.createElement("h4");
    productTitle.textContent = productName;
    
    productTitle.id = "Title"; 
    productCardElement.appendChild(productTitle);

    // retailer 
    const retailerInfoElement = document.createElement("div");
    retailerInfoElement.className = "retail";

    const retailerPrevIcon = document.createElement("i");
    retailerPrevIcon.classList.add("fas", "fa-chevron-left");
    retailerInfoElement.appendChild(retailerPrevIcon);

    const retailerNameElement = document.createElement("p");
    retailerNameElement.textContent = retailerName;
    retailerInfoElement.appendChild(retailerNameElement);

    const retailerNextIcon = document.createElement("i");
    retailerNextIcon.classList.add("fas", "fa-chevron-right");
    retailerInfoElement.appendChild(retailerNextIcon);

    productCardElement.appendChild(retailerInfoElement);

    //  brand name
    const brandElement = document.createElement("p");
    brandElement.textContent = brandName;
    brandElement.className = "brand";
    productCardElement.appendChild(brandElement);

    // price section
    const priceContainer = document.createElement("div");
    priceContainer.className = "prices";

    const initialPriceElement = document.createElement("p");
    initialPriceElement.classList.add("Price-Cross", "Iprice");
    initialPriceElement.textContent = `R${initialPrice.toFixed(2)}`; 
    priceContainer.appendChild(initialPriceElement);

    const finalPriceElement = document.createElement("p");
    finalPriceElement.className = "Aprice";
    finalPriceElement.textContent = `R${finalPrice.toFixed(2)}`; 
    priceContainer.appendChild(finalPriceElement);

    productCardElement.appendChild(priceContainer);

    // country of origin
    const countryOriginElement = document.createElement("p");
    countryOriginElement.textContent = `Made in ${countryOfOrigin}`;
    productCardElement.appendChild(countryOriginElement);

    //button group
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

