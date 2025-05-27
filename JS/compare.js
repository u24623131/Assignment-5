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
