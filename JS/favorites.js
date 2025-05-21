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

function createProductCard(productName, initialPrice, finalPrice, imageSource, countryOfOrigin, brandName, retailerName, discountPercentage) {
    // Create and append

    // Create the main product card container
    const productCardElement = document.createElement("div");
    productCardElement.className = "col-4";

    // Create the product-left-section (contains image and discount tag)
    const productLeftSection = document.createElement("div");
    productLeftSection.className = "product-left-section";

    //discount tag
    const discountTag = document.createElement("div");
    discountTag.className = "discount-tag";
    discountTag.textContent = discountPercentage; 
    productLeftSection.appendChild(discountTag);

    // product image
    const productImage = document.createElement("img");
    productImage.src = imageSource;
    productLeftSection.appendChild(productImage);

    // main card
    productCardElement.appendChild(productLeftSection);

    // product-right-section 
    const productRightSection = document.createElement("div");
    productRightSection.className = "product-right-section";

    //  title-price-row 
    const titlePriceRow = document.createElement("div");
    titlePriceRow.className = "title-price-row";

    // product title
    const productTitle = document.createElement("h4");
    productTitle.textContent = productName;
    productTitle.id = "Title"; 
    titlePriceRow.appendChild(productTitle);

    //  price section
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

    // Append price container to the title-price-row
    titlePriceRow.appendChild(priceContainer);

    // Append the title-price-row to the right section
    productRightSection.appendChild(titlePriceRow);


    //information section
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

    productRightSection.appendChild(retailerInfoElement);

    //  brand name
    const brandElement = document.createElement("p");
    brandElement.textContent = brandName;
    brandElement.className = "brand";
    productRightSection.appendChild(brandElement);

    // country of origin
    const countryOriginElement = document.createElement("p");
    countryOriginElement.textContent = `Made in ${countryOfOrigin}`;
    countryOriginElement.className = "country-origin"; // Ensure class is applied
    productRightSection.appendChild(countryOriginElement);

    //the button group
    const buttonGroup = document.createElement("div");
    buttonGroup.className = "btn-group";

    // Remove Button 
    const addRemoveButton = document.createElement("button");
    addRemoveButton.classList.add("btn", "add-romove"); 
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

    // Append the button group to the right section
    productRightSection.appendChild(buttonGroup);

    // Append the right section to the main card
    productCardElement.appendChild(productRightSection);

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
        let compareList = document.getElementById("compareList"); 
        var btn = event.target.closest(".btn-compare");
        var productDiv = btn.closest(".col-4");
        var titleElement = productDiv.querySelector("#Title");
        var imgElement = productDiv.querySelector("img");
        let newItem = createCompareListCard(titleElement.textContent, imgElement.src);
        compareList.insertBefore(newItem, compareList.lastElementChild);
    }
})

