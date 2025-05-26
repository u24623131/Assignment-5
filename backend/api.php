<?php

use GrahamCampbell\ResultType\Result;
// Clear any output BOM chars / whitespace
if (ob_get_level()) ob_end_clean();

// use function PHPSTORM_META\type;

require_once(__DIR__."/config.php"); //feel free to change accordingly // no need
header("Content-Type: application/json"); // specifies that json data is outputted
header("Access-Control-Allow-Origin: *"); // allows any origin to access api
header("Access-Control-Allow-Methods: POST"); // ensures that only post-method requests can be  to access api

class API {
    private $DB_Connection;
    public static function instance() {
		static $instance = null; // remember this only ever gets called once
		if($instance === null)
			$instance = new API();
		return $instance; 
	}
    private function __construct() {
        $this->DB_Connection = Database::getInstance()->getConnection();
        // error checking
        if($this->DB_Connection->connect_error){
            error_log("DB Connection Error: " . $this->DB_Connection->connect_error);
        }
    }
	public function __destruct() {
        $this->DB_Connection = null;
    }

    public function handleRequest() {

        if($_SERVER['REQUEST_METHOD'] !== 'POST'){
            http_response_code(405);
            $this->response("405 Method Not Allowed","error","Method not allowed");
            error_log("REQUEST_METHOD: " . $_SERVER['REQUEST_METHOD']);
            return;
        }

        if(!isset($_SERVER['CONTENT_TYPE']) || strpos($_SERVER['CONTENT_TYPE'],'application/json') === false){ // ensures only JSON content is checked and prevents non-JSON payload attacks
            http_response_code(415);
            $this->response("415 Unsupported Media Type","error","JSON expected");
            return;
        }

        $input = json_decode(file_get_contents("php://input"), true); //noted

        //ensuring blank JSON data does not get try to get processed (waste of resources)
        if (!$input) {
            http_response_code(400);
            $this->response("400 Bad Request","success",[
                "status" => "error",
                "message" => "Missing JSON input",
                "json_error" => json_last_error_msg()
            ]);
            return;
        }

        if (json_last_error() !== JSON_ERROR_NONE) {
            http_response_code(400);
            $this->response("400 Bad Request","error","Invalid JSON syntax");
            return;
        }

        if(!isset($input["type"])){
            http_response_code(400);
            $this->response("400 Bad Request","error","Invalid/Missing type");
            return;
        }

        switch ($input["type"]) {
            //Account Management
            case "Register":
                $this->handleRegister($input);
                break;

            case "Login":
                $this->handleLogin($input);
                break;
            
            case "DeleteAccount":
                $this->deleteAccount($input);
                break;

            case "GetUserDetails"://for client page
                $this->getUserDetails($input);
                break;

            case "UpdateUserDetails":
                $this->updateUserDetails($input);
                break;

            case "MakeUserAdmin":
                $this->makeUserAdmin($input);
                break;

            //Product manipulation    
            case "ProductByRetailer":
                $this->handleProductByRetailer($input);
                break;

            case "ProductsByCustomerId":
                // $this->handleProductsByCustomerId($input);
                break;

            case "UpdateProductDetails":
                $this->handleUpdateProductDetails($input);
                break;

            case "UpdateProductPrices":
                $this->handleUpdateProductPrices($input);
                break;

            case "DeleteProduct":
                $this->deleteProduct($input);
                break;

            case "AddProduct":
                $this->addProduct($input);
                break;

            case "GetAllProducts":
                $this->getAllProducts();
                break;

            case "ProductCompare":
                $this->handleProductCompare($input);
                break;

            // Favourites manipulation
            case "AddToFavourite":
                $this->AddFavourite($input);
                break;

            case "RemoveFromFavourite":
                $this->RemoveFromFavourite($input);
                break;
                
            case "GetUserFavourite":
                $this->getUserFavourite($input);
                break;

            //Retailer Manipulation
            case "AddRetailer":
                $this->AddRetailer($input);
                break;

            case "RemoveRetailer":
                $this->RemoveRetailer($input);
                break;
            
            case "UpdateRetailer":
                $this->UpdateRetailer($input);
                break;

            //Review Manpulation
            case "AddReview":
                $this->AddReview($input);
                break;

            case "RemoveReview":
                $this->RemoveReview($input);
                break;

            case "UpdateReview":
                $this->UpdateReview($input);
                break;
            
            case "GetProductReviews":
                $this->getProductReviews($input);
                break;

            //Manipulation 
            case "Filter":
                $this->handleFilter($input); 
                break;

            case "Search":
                $this->Search($input); 
                break;

            default:
                http_response_code(400);
                $this->response("400 Bad Request","error","Invalid request type");
                break;
        }

    }

    //Register: name = handleRegister, param = input
    private function handleRegister($input){
        // required = Name Surname Email 
        $required = ['Name','Surname','Email', 'Password', 'User_Type'];

        foreach($required as $req){
            if(empty($input[$req]) || !isset($input[$req])){
                http_response_code(400);
                $this->response("400 Bad Request","error",$req." is Missing");
                return;
            } 
        }

        // assign values
        $name = htmlspecialchars(trim($input['Name']), ENT_QUOTES, 'UTF-8');
        $surname = htmlspecialchars(trim($input['Surname']), ENT_QUOTES, 'UTF-8');
        $email = filter_var(trim($input['Email']), FILTER_SANITIZE_EMAIL);
        $pass = htmlspecialchars(trim($input['Password']), ENT_QUOTES, 'UTF-8');
        $userType = htmlspecialchars(trim($input['User_Type']), ENT_QUOTES, 'UTF-8');

        // Optional: Cell_num 
        $cellNo = NULL;
        // check if it exists
        if(isset($input['Cell_No']) &&  strlen(trim($input['Cell_No'])) > 0){
            if($this->isValidCellNo($input['Cell_No'])){
                $cellNo = trim($input['Cell_No']);
            }
            else{
                http_response_code(400);
                $this->response("400","error","Invalid Cell_No: must be 10 digits and numeric (eg. 0123456789)");
                return;
            }
        }
            
        // validate 

        // email
        if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
            http_response_code(400);
            $this->response("400 Bad Request","error",  "Incorrect Email Structure (according to API)");
            return;
        }
        else if($this->emailUsed($email)){
            http_response_code(400);
            $this->response("400 Bad Request","error",  "Email was already used");
            return;
        }

        // Password
        if(!$this->isValidPassword($pass)){
            http_response_code(400);
            $this->response("400 Bad Request", "error","Password must be at least 8 characters long, include uppercase and lowercase letters, a number, and a symbol.");
            return;
        }

        // UserType 
        if(!$this->isValidUserType($userType)){
            http_response_code(400);
            $this->response("400 Bad Request", "error","Incorrect user type, only 'normal' or Admin");
            return;
        }

        // Data is now Valid

        // generate salt (16 random chars and Letters) 
        $salt = bin2hex(random_bytes(16));

        // hash password (using Argon2ID)
        $hash = password_hash($pass . $salt, PASSWORD_ARGON2ID,[
            'memory_cost' => 65536, // Uses 64mb RAM per hash which slows down brute force attacks
            'time_cost' => 4, // increased number of iterations means that hashing occurs more slowly but also means that the result would be harder to crack
            'threads' => 2 // 2 CPU threads to balance speed and security
        ]);

        // generate ApiKey and ensure that it is unique
        do {
            $apiKey = $this->generateApiKey();
            $stmt = $this->DB_Connection->prepare("SELECT User_ID FROM Users WHERE API_Key = ?");
            $stmt->bind_param("s", $apiKey);
            $stmt->execute();
            $stmt->store_result();
        } while ($stmt->num_rows > 0);

        // insert into DB
        
        $stmt = $this->DB_Connection->prepare("INSERT INTO Users(Name, Surname, Email, Cell_No, User_Type, Password, Salt, API_Key) VALUES(?,?,?,?,?,?,?,?)");
        $stmt->bind_param("ssssssss",
        $name,
        $surname,
        $email,
        $cellNo,
        $userType,
        $hash,
        $salt,
        $apiKey);

        //execute() returns bool
        if($stmt->execute()){
            http_response_code(200);
            $this->response("200 OK", "success",  [
                                "message" => "$name was added",
                                "apikey" => $apiKey
                                ]);
            return;
        } 
        else{
            error_log("MySQL Error: " . $stmt->error); // for extra error checking
            http_response_code(500);
            $this->response("500 Internal Server Error", "error", $name." was Not added onto the the database, Execute Error in handleRegistration");
            return;
        }

    }
    //Login: name = handleLogin param =input
    private function handleLogin($input){
        // requires email and password
        $required = ['Email', 'Password'];

        //ensure that they're Not empty
        foreach($required as $req){
            if(empty($input[$req]) || !isset($input[$req])){
                http_response_code(400);
                $this->response("400 Bad Request","error",$req." is Missing");
                return;
            } 
        }

        //assign email and password to vars
        $email = trim($input['Email']);
        $pass = trim($input['Password']);
        
        //find the user and ensure they exist
        $stmt = $this->DB_Connection->prepare("SELECT Password, Salt, API_Key FROM Users WHERE Email = ?");

        // if prepare didn't prep
        if(!$stmt){
            http_response_code(500);
            error_log("Prepare Failed". $this->DB_Connection->error);
            $this->response("500 Internal Server Error", "error","Database Error:".$this->DB_Connection->error);
            return;
        }
        // binding
        $stmt->bind_param("s", $email);
        //execute
        if($stmt->execute()){
            // store the results tbl
            $result = $stmt->get_result();

            if($result->num_rows === 0){
            http_response_code(401);
            $this->response	("401 Unauthorized ","error", "User does not exist! Register first");
            return;
            }

            // store as an associatve arr
            $user = $result->fetch_assoc();
            $saltedPass = $pass.$user["Salt"];

            if (password_verify($saltedPass, $user["Password"])) {
                http_response_code(200);
                $this->response("200 OK", "success", ["apikey" => $user["API_Key"]]);
            } 
            else {
                http_response_code(401);
                $this->response("401 Unauthorized", "error", "Incorrect password.");
            }

    }
    else{
            error_log("MySQL Error: " . $stmt->error); // for extra error checking
            http_response_code(500);
            $this->response("500 Internal Server Error", "error", "Statement was not executed in HandleLogin");
            return;
        }

    }
    //GAP: name = getAllProducts param = input ... change as you see fit
    private function getAllProducts() {

    $result = $this->DB_Connection->query("
        SELECT 
            Products.Product_No, 
            Products.Title,
            Prices.Price,
            Retailers.Name AS Retailer_Name
        FROM Products
        JOIN Prices ON Products.Product_No = Prices.Product_No
        JOIN Retailers ON Prices.Retailer_ID = Retailers.Retailer_ID
    ");

    if ($result) {
        if ($result->num_rows > 0) {
            $groupedProducts = [];

            while ($row = $result->fetch_assoc()) {
                $productNo = $row['Product_No'];

                $title = htmlspecialchars($row['Title'], ENT_QUOTES, 'UTF-8');
                $retailerName = htmlspecialchars($row['Retailer_Name'], ENT_QUOTES, 'UTF-8');

                if (!isset($groupedProducts[$productNo])) {
                    $groupedProducts[$productNo] = [
                        "Product_No" => $row['Product_No'],
                        "Title" => $title,
                        "Retailer_Names" => [],
                        "Prices" => []
                    ];
                }

                $groupedProducts[$productNo]["Retailer_Names"][] = $retailerName;
                $groupedProducts[$productNo]["Prices"][] = (float)$row['Price'];
            }

            http_response_code(200);
            $this->response("200 OK", "success", ["Products" => array_values($groupedProducts)]);
        } else {
            http_response_code(200);
            $this->response("200 OK", "success", ["Products" => []]);
        }
    } else {
        http_response_code(500);
        $this->response("500 Internal Server Error", "error", "Query failed in getAllProducts");
    }
    }

    //Delete Account: deleteAccount param = input
    private function deleteAccount($input){

        if(!isset($input['apikey'])|| empty($input['apikey'])){
            http_response_code(400);
                $this->response("400 Bad Request","error","API_Key is Missing");
                return;
        }
        // find find that user via API key

        $api = $input['apikey'];
         //find the user and ensure they exist
        $stmt = $this->DB_Connection->prepare("DELETE FROM Users WHERE API_Key = ?");

        // if prepare didn't prep
        if(!$stmt){
            http_response_code(500);
            error_log("Prepare Failed". $this->DB_Connection->error);
            $this->response("500 Internal Server Error", "error","Database Error:".$this->DB_Connection->error);
            return;
        }
        // binding
        $stmt->bind_param("s", $api );
        //execute
        if ($stmt->execute()) {
            if ($stmt->affected_rows > 0) {
                http_response_code(200);
                $this->response("200 OK", "success", "User was deleted");
            } else {
                http_response_code(404);
                $this->response("404 Not Found", "error", "User not found, cannot delete");
            }
            return;
        }
        else {
        http_response_code(500);
        $this->response("500 Internal Server Error", "error", "Execution failed during deleteAccount");
}
    } // if we return deleted user's name (later modification) remember to sanitise using htmlspecialchars before returning (XXS Protection)
    private function handleProductByRetailer($input){ // called when you click a button?
        $required = ['apikey','retailer', 'productTitle'];
        forEach($required as $field){
            if(empty($input[$field])){
                http_response_code(400); // Bad Request
                $this->response("400 Bad Request","error","$field is required");
                return;
            }
        }

        $retailer = $input['retailer'];
        if (!$this->isValidRetailer($retailer)) {
            http_response_code(400); // Bad Request
            $this->response("400 Bad Request","error","Invalid retailer");
            return;
        }
        $retailerId = $this->getRetailerInfo($retailer)['Retailer_ID'];

        $productTitle = $input['productTitle'];

        //fetch product number using title
        $checkSql ="SELECT Product_No FROM Products WHERE Title = ?";
        $checkStmt = $this->DB_Connection->prepare($checkSql);
        $checkStmt->bind_param("s",$productTitle);
        $checkStmt->execute();
        $res = $checkStmt->get_result();
        $checkStmt->close();
        if ($res && $res->num_rows > 0) {
            // get price using both the retailer_id and product number
            $productNum = $res->fetch_assoc();
            $getSql = "SELECT Price FROM Prices WHERE Retailer_ID = ? AND Product_No = ?";
            $getStmt = $this->DB_Connection->prepare($getSql);
            $getStmt->bind_param("ii", $retailerId, $productNum['Product_No']);
            $getStmt->execute();
            $resultPrice = $getStmt->get_result();
            $getStmt->close();

            if ($resultPrice && $resultPrice->num_rows > 0) {
                $price = $resultPrice->fetch_assoc();
                //Fetch other product data
                $sql = "SELECT * FROM Products WHERE Product_No = ?";
                $stmt = $this->DB_Connection->prepare($sql);
                $stmt->bind_param("i", $productNum['Product_No']);
                $stmt->execute();
                $resProductData = $stmt->get_result();
                $stmt->close();
                if ($resProductData && $productData = $resProductData->fetch_assoc()) {
                    http_response_code(200);
                    $this->response("200 OK","success",[
                        "ProductNo" => (int)$productData['Product_No'],
                        "Title" => htmlspecialchars($productData['Title'], ENT_QUOTES, 'UTF-8'),
                        "Category" => htmlspecialchars($productData['Category'], ENT_QUOTES, 'UTF-8'),
                        "Description" => htmlspecialchars($productData['Description'], ENT_QUOTES, 'UTF-8'),
                        "Brand" => htmlspecialchars($productData['Brand'], ENT_QUOTES, 'UTF-8'),
                        "ImageUrl" => filter_var($productData['Image_URL'], FILTER_VALIDATE_URL) ? htmlspecialchars($productData['Image_URL'], ENT_QUOTES, 'UTF-8') : null,
                        "Price" => (float)$price['Price']
                    ]);
                }else{
                    http_response_code(500);
                    $this->response("500 Internal Server Error","error","Could not fetch product data");
                }
            }else{
                // Return error
                http_response_code(500);
                $this->response("500 Internal Server Error","error","Price for product from specified retailer does not exst");
            }
        }else{
            http_response_code(500);
            $this->response("500 Internal Server Error","error","$productTitle does not exist in the database");
        }
    }
    private function handleProductsByCustomerId($input){
        $required = ['apikey','customerID'];
        // do the whole string concatination thing per product associated with the customer id (Apparently the product numbers are in an array?)
    }
    private function AddFavourite($input) {
    // Required keys
    $req = ['apikey', 'Product_Name'];

    // Check for missing parameters
    foreach ($req as $r) {
        if (!isset($input[$r]) || empty($input[$r])) {
            http_response_code(400);
            $this->response("400 Bad Request", "error", "$r is missing");
            return;
        }
    }

    // Get user from API key
    $userInfo = $this->getUserByApiKey($input['apikey']);
    if (!$userInfo || !isset($userInfo['User_ID'])) {
        http_response_code(404);
        $this->response("404 Not Found", "error", "User not found");
        return;
    }

    $userID = intval($userInfo['User_ID']);

    // Get product by title using helper
    $productName = htmlspecialchars(trim($input['Product_Name']), ENT_QUOTES,'UTF-8');
    $productInfo = $this->getProductInfo($productName);
    if (!$productInfo || !isset($productInfo['Product_No'])) {
        http_response_code(404);
        $this->response("404 Not Found", "error", "Product not found");
        return;
    }

    $productNo = intval($productInfo['Product_No']);

    // Check if it already exists in favourites
    $check = $this->DB_Connection->prepare("SELECT * FROM favourites WHERE user_id = ? AND product_id = ?");
    if (!$check) {
        error_log("Prepare Failed (Check): " . $this->DB_Connection->error);
        http_response_code(500);
        $this->response("500 Internal Server Error", "error", "Database Error");
        return;
    }

    $check->bind_param("ii", $userID, $productNo);
    if (!$check->execute()) {
        error_log("Check Execution Failed: " . $check->error);
        http_response_code(500);
        $this->response("500 Internal Server Error", "error", "Failed to check existing favourites");
        return;
    }

    $result = $check->get_result();
    if ($result && $result->num_rows > 0) {
        http_response_code(409);
        $this->response("409 Conflict", "error", "This product is already in your favourites.");
        return;
    }

    // Insert into favourites
    $stmt = $this->DB_Connection->prepare("INSERT INTO favourites(user_id, product_id) VALUES (?, ?)");
    if (!$stmt) {
        error_log("Prepare Failed (Insert): " . $this->DB_Connection->error);
        http_response_code(500);
        $this->response("500 Internal Server Error", "error", "Failed to prepare insert statement");
        return;
    }

    $stmt->bind_param("ii", $userID, $productNo);
    if (!$stmt->execute()) {
        error_log("Insert Failed: " . $stmt->error);
        http_response_code(500);
        $this->response("500 Internal Server Error", "error", "Failed to add to favourites");
        return;
    }

    // Success
    http_response_code(200);
    $this->response("200 OK", "success", "Product added to favourites");
    }
    private function getUserFavourite($input) {
    // Validate input
    if (!isset($input['apikey']) || empty($input['apikey'])) {
        http_response_code(400);
        $this->response("400 Bad Request", "error", "apikey is missing");
        return;
    }

    // Get user from API key
    $userInfo = $this->getUserByApiKey($input['apikey']);
    if (!$userInfo || !isset($userInfo['User_ID'])) {
        http_response_code(404);
        $this->response("404 Not Found", "error", "User not found");
        return;
    }

    $userId = $userInfo['User_ID'];

    // SQL query to get favourite products and associated retailers/prices
    $sql = "
        SELECT 
            Products.Product_No,
            Products.Title,
            Products.Category,
            Products.Description,
            Products.Brand,
            Products.Image_URL,
            Prices.Price,
            Retailers.Name AS Retailer_Name
        FROM favourites 
        JOIN Users ON favourites.user_id = Users.User_ID 
        JOIN Products ON favourites.product_id = Products.Product_No
        JOIN Prices ON favourites.product_id = Prices.Product_No
        JOIN Retailers ON Prices.Retailer_ID = Retailers.Retailer_ID
        WHERE Users.User_ID = ?
    ";

    $stmt = $this->DB_Connection->prepare($sql);
    if (!$stmt) {
        http_response_code(500);
        error_log("Prepare failed: " . $this->DB_Connection->error);
        $this->response("500 Internal Server Error", "error", "Database error: " . $this->DB_Connection->error);
        return;
    }

    $stmt->bind_param("i", $userId);

    if (!$stmt->execute()) {
        http_response_code(500);
        error_log("Execution failed: " . $stmt->error);
        $this->response("500 Internal Server Error", "error", "Query execution failed");
        return;
    }

    $result = $stmt->get_result();
    $groupedFavourites = [];

    while ($row = $result->fetch_assoc()) {
        $productNo = $row['Product_No'];

        if (!isset($groupedFavourites[$productNo])) {
            $groupedFavourites[$productNo] = [
                "Product_No" => (int)$row['Product_No'],
                "Title" => htmlspecialchars($row['Title'], ENT_QUOTES, 'UTF-8'),
                "Category" => htmlspecialchars($row['Category'], ENT_QUOTES, 'UTF-8'),
                "Description" => htmlspecialchars($row['Description'], ENT_QUOTES, 'UTF-8'),
                "Brand" => htmlspecialchars($row['Brand'], ENT_QUOTES, 'UTF-8'),
                "Image_URL" => filter_var($row['Image_URL'], FILTER_VALIDATE_URL) ? htmlspecialchars($row['Image_URL'], ENT_QUOTES, 'UTF-8') : null,
                "Retailer_Names" => [],
                "Prices" => []
            ];
        }

        $groupedFavourites[$productNo]["Retailer_Names"][] = htmlspecialchars($row['Retailer_Name'], ENT_QUOTES,'UTF-8');
        $groupedFavourites[$productNo]["Prices"][] = (float)$row['Price'];
    }

    http_response_code(200);
    $this->response("200 OK", "success", array_values($groupedFavourites));
    }
    private function addProduct($input){
        // ensure apiKey is NOT NULL
        if(empty($input['apikey'])|| !isset($input['apikey'])){
            http_response_code(400);
            $this->response("400 Bad Request","error",$input['apikey']." is Missing");
            return;
        }

        // assign Apikey to var
        $apiK = $input['apikey'];

        //check if user is an admin
        if(!$this->isAdmin($apiK)){
            http_response_code(400);
            $this->response("400 Bad Request","error","User is not an admin");
            return;
        }

        // insert into both products && prices
 
        $required = ['Title', 'Category', 'Description','Brand', 'Image_URL'];
        foreach ($required as $r){
            if(empty($input[$r])|| !isset($input[$r])){
            http_response_code(400);
            $this->response("400 Bad Request","error",$r." is Missing");
            return;
            }
        }
        if(!is_array($input['Retailers'])){
            http_response_code(400);
            $this->response("400 Bad Request","error"," Retail_ID must be an array");
            return;
        }
        //validate each retailer
        $retArr = $input['Retailers'];


        foreach($retArr as $r){
            if(!$this->isValidRetailer($r)){
            http_response_code(400);
            $this->response("400 Bad Request","error",$r." is not a verified retailer");
            return;
            }
        }

         if(!is_array($input['Prices'])){
            http_response_code(400);
            $this->response("400 Bad Request","error"," Retail_ID must be an array");
            return;
        }
        $priceArr = $input['Prices'];

        foreach($retArr as $r){
            if(!$this->isValidRetailer($r)){
            http_response_code(400);
            $this->response("400 Bad Request","error",$r."is not a retailer in the system");
            return;
            }
        }

        if(count($retArr)!== count($priceArr)){
            http_response_code(400);
            $this->response("400 Bad Request","error"," Number of Retailers must be the same as number of Prices");
            return;
        }

        // Insert into Table products to obtain product Num
        $title = htmlspecialchars(trim($input['Title']), ENT_QUOTES,'UTF-8');
        $cat = htmlspecialchars(trim($input['Category']), ENT_QUOTES,'UTF-8');
        $brand= htmlspecialchars(trim($input['Brand']), ENT_QUOTES,'UTF-8');
        $url = filter_var(trim($input['Image_URL']), FILTER_VALIDATE_URL) ? htmlspecialchars(trim($input['Image_URL']), ENT_QUOTES,'UTF-8'):null;
        $desc = htmlspecialchars(trim($input['Description']), ENT_QUOTES,'UTF-8');

        // ensure that product does NOT already Exist
        $firstStep = $this->DB_Connection->prepare("SELECT * FROM Products WHERE Title =?");
        if(!$firstStep){
            http_response_code(500);
            $this->response("500 Bad Request","error"," Could not prepare");
            return;
        }
        $firstStep->bind_param("s",$title);
        $firstStep->execute();

        if($firstStep->get_result()->num_rows>0){
                http_response_code(400);
                $this->response("400 Bad Request","error","Product already Exists in Products Table");
                return;
        }

        // insert into product once
        $secondStep = $this->DB_Connection->prepare("INSERT INTO Products(Title, Category, Description, Brand, Image_URL) VALUES(?, ?, ?, ?,?)");
        if(!$secondStep){
            http_response_code(500);
            $this->response("500 Internal Server Error","error"," Could not prepare");
            return;
        }
        $secondStep->bind_param("sssss",$title,$cat,$desc, $brand,$url);
        $secondStep->execute();

        $finalStep = $this->DB_Connection->prepare("SELECT Product_No FROM Products WHERE Title = ? ");
        if(!$finalStep){
            http_response_code(500);
            $this->response("500 Internal Server Error","error"," Could not prepare");
            return;
        }
        $finalStep->bind_param("s",$title);
        $finalStep->execute();

        $p_id =$finalStep->get_result()->fetch_assoc()['Product_No'];
        
       foreach($retArr as  $name){
        $i=0; 
        $id =$this->getRetailerInfo($name)['Retailer_ID']; 
        $fin = $this->DB_Connection->prepare("INSERT INTO Prices(Retailer_ID, Product_No, Price) VALUES(?,?,?)");
        if(!$fin){
            http_response_code(500);
            $this->response("500 Internal Server Error","error"," Could not prepare");
            return;
        }     
        $fin->bind_param("iid",$id,$p_id, $priceArr[$i]);
        $fin->execute();
        $i++;
    }
    http_response_code(200);
    $this->response("200 OK","success","product(s) & prices added");
                return;
        
    }
    private function handleUpdateProductDetails($input){ //assuming that titles are unique
        $required = ['apikey', 'productTitle'];
        forEach($required as $field){
            if(empty($input[$field])){
                http_response_code(400); // Bad Request
                $this->response("400 Bad Request","error","$field is required");
                return;
            }
        }
        if(!$this->isAdmin($input['apikey'])){
            http_response_code(400);
            $this->response("400 Bad Request","error","User is not an admin");
            return;
        }

        // find product id of product to be updated
        $searchSql = "SELECT * FROM Products WHERE Title = ?";
        $searchStm = $this->DB_Connection->prepare($searchSql);
        $searchStm->bind_param("s", $input['productTitle']);
        $searchStm->execute();
        $searchResult = $searchStm->get_result();
        $searchStm->close();
        if ($searchResult && $productDetails = $searchResult->fetch_assoc()) {
            // check which parameters are available to change
            $newTitle = isset($input['newTitle']) ? 
            htmlspecialchars(trim($input['newTitle']), ENT_QUOTES, 'UTF-8') 
            : htmlspecialchars(trim($productDetails['Title']), ENT_QUOTES, 'UTF-8');
            $newCategory = isset($input['newCategory']) ? 
            htmlspecialchars(trim($input['newCategory']), ENT_QUOTES, 'UTF-8') 
            : htmlspecialchars(trim($productDetails['Category']), ENT_QUOTES, 'UTF-8');
            $newDescryption = isset($input['newDescription']) ? 
            htmlspecialchars(trim($input['newDescription']), ENT_QUOTES, 'UTF-8') 
            : htmlspecialchars(trim($productDetails['Description']), ENT_QUOTES, 'UTF-8');
            $newBrand = isset($input['newBrand']) ? 
            htmlspecialchars(trim($input['newBrand']), ENT_QUOTES, 'UTF-8') 
            : htmlspecialchars(trim($productDetails['Brand']), ENT_QUOTES, 'UTF-8');
            $newImgUrl = isset($input['newImageUrl']) ? 
            (filter_var(trim($input['newImageUrl']), FILTER_VALIDATE_URL) ?
            htmlspecialchars(trim($input['newImageUrl']), ENT_QUOTES, 'UTF-8') : null)
            : htmlspecialchars(trim($productDetails['Image_URL']), ENT_QUOTES, 'UTF-8');

            $updateSql = "UPDATE Products SET Title = ?, Category = ?, Description = ?, Brand = ?, Image_URL = ?  WHERE Product_No = ?";
            $updateStmt = $this->DB_Connection->prepare($updateSql);
            $updateStmt->bind_param("sssssi", $newTitle, $newCategory, $newDescryption, $newBrand,$newImgUrl, $productDetails['Product_No']);
            if ($updateStmt->execute()) {
                http_response_code(200);
                $this->response("200 OK","success","Product successfully updated" );
            }else{
                http_response_code(500);
                $this->response("500 Internal Server Error","error","Product update failed");
            }
            $updateStmt->close();
        }else{
            http_response_code(500);
            $this->response("500 Internal Server Error","error","Could not fetch product details");
        }

    }
    private function handleUpdateProductPrices($input){
        $required = ['apikey', 'retailer','productTitle','newPrice'];
        forEach($required as $field){
            if(empty($input[$field])){
                http_response_code(400); // Bad Request
                $this->response("400 Bad Request","error","$field is required");
                return;
            }
        }
        if(!$this->isAdmin($input['apikey'])){
            http_response_code(400);
            $this->response("400 Bad Request","error","User is not an admin");
            return;
        }
        // get retailer id
        $retailer = $this->getRetailerInfo($input['retailer']);
        if (!$retailer) {
            http_response_code(400);
            $this->response("400 Bad Request","error","Retailer does not exist");
            return;
        }
        // get product id
        $stmt = $this->DB_Connection->prepare("SELECT * FROM Products WHERE Title = ?");
        $stmt->bind_param("s", $input['productTitle']);
        $stmt->execute();
        $product = $stmt->get_result();
        $stmt->close();
        if (!$product)  {
            http_response_code(400);
            $this->response("400 Bad Request","error","Product does not exist");
            return;
        }
        $productID = $product->fetch_assoc();

        $newPrice = (float)$input['newPrice'];

        // update price
        $updateSql = "UPDATE Prices SET Price = ? WHERE Retailer_ID = ? AND Product_No =?";
        $updateStmt = $this->DB_Connection->prepare($updateSql);
        $updateStmt->bind_param("dii", $newPrice,$retailer['Retailer_ID'], $productID['Product_No']);
        if ($updateStmt->execute()) {
            http_response_code(200);
            $this->response("200 OK","success","Product price has been updated: $newPrice" );
        }else{
            http_response_code(500);
            $this->response("500 Internal Server Error","error","Prices update error");
        }
        $updateStmt->close();
    }
    private function deleteProduct($input){
        $required = ['apikey', 'productTitle'];
        forEach($required as $field){
            if(empty($input[$field])){
                http_response_code(400); // Bad Request
                $this->response("400 Bad Request","error","$field is required");
                return;
            }
        }
        if(!$this->isAdmin($input['apikey'])){
            http_response_code(400);
            $this->response("400 Bad Request","error","User is not an admin");
            return;
        }

        $productTitle = htmlspecialchars(trim($input['productTitle']), ENT_QUOTES, 'UTF-8');

        $deleteSql = "DELETE FROM Products WHERE Title = ?";
        $deleteStmt = $this->DB_Connection->prepare($deleteSql);
        $deleteStmt->bind_param("s", $productTitle);
        if ($deleteStmt->execute()) {
            http_response_code(500);
            $this->response("200 OK","success",["message" => "Product '".$productTitle."' has been deleted."]);
        }else{
            http_response_code(500);
            $this->response("500 Internal Server Error","error",["message" => "Could not delete product: $productTitle"]);
        }
        $deleteStmt->close();
    }
    private function handleProductCompare($input){
        $required = ['apikey', 'productTitle1', 'productTitle2'];
        forEach($required as $field){
            if(empty($input[$field])){
                http_response_code(400); // Bad Request
                $this->response("400 Bad Request","error","$field is required");
                return;
            }
        }

        $productTitle1 = $input['productTitle1'];
        $productTitle2 = $input['productTitle2'];

        // fetch product with prices + retailsers in 1 query!!! (Joins?)
        $product1Data = $this->fetchProductData($productTitle1);
        $product2Data = $this->fetchProductData($productTitle2);

        $product1Result = $this->formatResponseData($product1Data);
        $product2Result = $this->formatResponseData($product2Data);

        $this->response("200 OK", "success", ["product1" => $product1Result, "product2" => $product2Result]);
    }
    private function handleFilter($input){
        $required = ['apikey', 'filter']; // rn it's 1 filterAt a time -- // UPDATE: can now handle multiple
        forEach($required as $field){
            if(empty($input[$field])){
                http_response_code(400); // Bad Request
                $this->response("400 Bad Request","error","$field is required");
                return;
            }
        }

        $all = isset($input['filter']['All']) ? $input['filter']['All']: '';
        $byTitle = isset($input['filter']['byTitle']) ? $input['filter']['byTitle']: '';
        $byCategory = isset($input['filter']['byCategory']) ? $input['filter']['byCategory']: '';
        $byDescription = isset($input['filter']['byDescription']) ? $input['filter']['byDescription']: '';
        $byBrand = isset($input['filter']['byBrand']) ? $input['filter']['byBrand']: '';
        // $byPrice = isset($input['filter']['byPrice']) ? $input['filter']['byPrice']: ''; // price needs to be a [min, max] array

        $whereClauses = [];
        $params = [];
        $types = "";

        if(!empty($byTitle)){
            $whereClauses[] = "Title = ?";
            $params[] = $byTitle;
            $types .= "s";
        }
        if(!empty($byCategory)){
            $whereClauses[] = "Category = ?";
            $params[] = $byCategory;
            $types .= "s";
        }
        if(!empty($byDescription)){
            $whereClauses[] = "Description = ?";
            $params[] = $byDescription;
            $types .= "s";
        }
        if(!empty($byBrand)){
            $whereClauses[] = "Brand = ?";
            $params[] = $byBrand;
            $types .= "s";
        }

        if (count($whereClauses) === 0) {
            $whereClauses[] = "1=1"; //return all by default
        }

        $searchSql = "SELECT * FROM Products WHERE " . implode(" AND ", $whereClauses);
        $searchStmt = $this->DB_Connection->prepare($searchSql);
        if ($searchStmt) {
            if (count($params) > 0) {
                $searchStmt->bind_param($types, ...$params);
            }
            $searchStmt->execute();
            $searchResult = $searchStmt->get_result();
            if ($searchResult) {
                http_response_code(200);
                $this->response("200 OK","success", $searchResult->fetch_all(MYSQLI_ASSOC));
                return;
            }else{
                http_response_code(400);
                $this->response("400 Bad Request","error","No result matches the filter");
                return;
            }
        }else{
            error_log("Prepare failed: ". $this->DB_Connection->error);
            http_response_code(500);
            $this->response("500 Internal Server Error","error",["message" => "Database error occured. Please try again later"]);
            return;
        }


    }
    private function AddReview($input){ // only logged in normal users can leave reviews
        // ensure apiKey is NOT NULL
        if(empty($input['apikey'])|| !isset($input['apikey'])){
            http_response_code(400);
            $this->response("400 Bad Request","error","apikey is Missing");
            return;
        }

        // assign Apikey to var
        $apiK = $input['apikey'];

        //check if user is an admin
        if($this->isAdmin($apiK)){
            http_response_code(400);
            $this->response("400 Bad Request","error","Admins may not insert reviews");
            return;
        }

        // need rating,product name and using api key to find user
        $toReview = ['Title','Rating','Review'];
        foreach($toReview as $r){
            if(empty($input[$r])|| !isset($input[$r])){
            http_response_code(400);
            $this->response("400 Bad Request","error", $r." is Empty");
            return;
            }
        }

        // ensure that rating is a number 

       if(!is_numeric($input['Rating'])){
            http_response_code(400);
            $this->response("400 Bad Request","error", "Rating must be a number");
            return;
        }
        // store data 
    $userId = $this->getUserByApiKey($input['apikey'])['User_ID'];
        
    $productInfo = $this->getProductInfo($input['Title']);

    if(!$productInfo){
        http_response_code(400);
        $this->response("400 Bad Request","error", $input['Title']." may not exist");
        return;
    }

    $prodId = $productInfo['Product_No'];

    $reveiw = htmlspecialchars(trim($input['Review']), ENT_QUOTES, 'UTF-8');
    $rating = (int) $input['Rating'];
    if($rating > 5){
        http_response_code(400);
        $this->response("400 Bad Request","error", "Rating may not be greater than 5");
        return;
    }
    if($rating < 0){
        http_response_code(400);
        $this->response("400 Bad Request","error", "Rating may not be negative");
        return;
    }
        // all data is assumed at this point to be valid 
        $stmt = $this->DB_Connection->prepare('INSERT INTO Reviews(Rating, Prod_ID, U_ID, review_text) VALUES(?,?,?,?)');
        if(!$stmt){
            http_response_code(500);
            $this->response("500 Internal Server Error","error", "Could not prepare review statement");
            return;
        }
        
        $stmt->bind_param("iiis",$rating,$prodId,$userId,$reveiw);

        if($stmt->execute()){
            http_response_code(200);
            $this->response("200 OK","success", "Review was inserted");
            return;
        }
        else{
            http_response_code(500);
            $this->response("500 Internal Server Error","error", "Review was not inserted");
            return;
        }
    }
    private function RemoveReview($input){
    if(empty($input['apikey']) || !isset($input['apikey'])){
        http_response_code(400);
        $this->response("400 Bad Request", "error", "apikey is Missing");
        return;
    }

    if(empty($input['Title']) || !isset($input['Title'])){
        http_response_code(400);
        $this->response("400 Bad Request", "error", "Title is Missing");
        return;
    }

    $apiK = $input['apikey'];
    $prodId = $this->getProductInfo($input['Title'])['Product_No'];

    if(!$this->isAdmin($apiK)){
        if($this->madeReviewOnProduct($apiK, $input['Title'])){
            if($this->userRemoveReview($apiK, $prodId)){
                http_response_code(200);
                $this->response("200 OK", "success", "Removed your review");
                return;
            } else {
                http_response_code(400);
                $this->response("400 Bad Request", "error", "Could Not remove your review");
                return;
            }
        } else {
            http_response_code(400);
            $this->response("400 Bad Request", "error", "User did not make product review");
            return;
        }
    } else {
        if(empty($input['userapikey']) || !isset($input['userapikey'])){
            http_response_code(400);
            $this->response("400 Bad Request", "error", "userapikey is Missing");
            return;
        }

        $userApi = $input['userapikey'];

        if($this->adminRemoveReview($input['Title'], $userApi)){
            http_response_code(200);
            $this->response("200 OK", "success", "Removed user's review");
            return;
        } else {
            http_response_code(400);
            $this->response("400 Bad Request", "error", "Could Not remove user's review");
            return;
        }
    }
    }
    private function UpdateReview($input){
        // ensure apiKey is NOT NULL
        if(empty($input['apikey'])|| !isset($input['apikey'])){
            http_response_code(400);
            $this->response("400 Bad Request","error","apikey is Missing");
            return;
        }

        // assign Apikey to var
        $apiK = $input['apikey'];

        //check if user is an admin
        if($this->isAdmin($apiK)){
            http_response_code(403);
            $this->response("403 Forbidden","error","Admins may not Update reviews but they may remove");
            return;
        }
        $userId = $this->getUserByApiKey($apiK)['User_ID'];
        
        $toReview = ['Title','Rating'];

        foreach($toReview as $r){
            if(empty($input[$r])|| !isset($input[$r])){
            http_response_code(404);
            $this->response("404 Not Found","error", $r." is Empty");
            return;
            }
        }
               
        $productInfo = $this->getProductInfo($input['Title']);

        if(!$productInfo){
            http_response_code(404);
            $this->response("404 Not Found","error", $input['Title']." may not exist");
            return;
        }

        $prodId = $productInfo['Product_No'];

        
       if(!is_numeric($input['Rating'])){
            http_response_code(400);
            $this->response("400 Bad Request","error", "Rating must be a number");
            return;
        }
        
        
        if(!$this->madeReviewOnProduct($apiK,$input['Title'])){
            http_response_code(400);
            $this->response("400 Bad Request","error","You did not review this product");
            return;
        }

        $rating = (int) $input['Rating'];
        if($rating > 5){
            http_response_code(400);
            $this->response("400 Bad Request","error", "Rating may not be greater than 5");
            return;
        }
        if($rating < 0){
            http_response_code(400);
            $this->response("400 Bad Request","error", "Rating may not be negative");
            return;
        }
        

        $updateSql = "UPDATE Reviews SET Rating = ? WHERE U_ID = ? AND Prod_ID =?";
        $stmt = $this->DB_Connection->prepare($updateSql);
        if (!$stmt) {
            http_response_code(500);
            $this->response("500 Internal Server Error", "error", "Failed to prepare update query");
            return;
        }
        $stmt->bind_param("iii",$rating, $userId,$prodId);

         if ($stmt->execute()) {
            http_response_code(200);
            $this->response("200 OK", "success", "Review updated successfully");
        } else {
            http_response_code(500);
            $this->response("500 Internal Server Error", "error", "Failed to update review");
        }
    }
    private function Search($input){ 
    // Ensure 'apikey' is provided
    if (empty($input['apikey']) || !isset($input['apikey'])) {
        http_response_code(400);
        $this->response("400 Bad Request", "error", "apikey is missing");
        return;
    }
     $apiKey = $input['apikey'];

    if (!$this->getUserByApiKey($apiKey)) {
        http_response_code(403);
        $this->response("403 Forbidden", "error", "Invalid API key");
        return;
    }

    if (empty($input['search']) || !isset($input['search'])) {
        http_response_code(400);
        $this->response("403 Forbidden", "error", "search is missing");
        return;
    }

    if (!is_array($input['search'])) {
        http_response_code(400);
        $this->response("400 Bad Request", "error", "search must be an array");
        return;
    }

    // Allowed columns
    $validCol = ['Title', 'Category', 'Description', 'Brand'];
    $search = $input['search'];
    $conditions = [];
    $params = [];
    $types = "";

    // Construct query dynamically
    foreach ($search as $key => $value) {
        if (!in_array($key, $validCol)) {
            http_response_code(400);
            $this->response("400 Bad Request", "error", "Invalid column name '$key'. Valid columns: " . implode(", ", $validCol));
            return;
        }

        
        $conditions[] = "$key LIKE ?";
        $params[] = "%" . $value . "%";
        $types .= "s"; 
    }

    $sql = "SELECT * FROM Products";
    if (count($conditions) > 0) {
        $sql .= " WHERE " . implode(" AND ", $conditions);
    }

    $stmt = $this->DB_Connection->prepare($sql);
    if (!$stmt) {
        http_response_code(500);
        $this->response("500 Internal Server Error", "error", "Could not prepare SQL statement");
        return;
    }

    $stmt->bind_param($types, ...$params);
    $stmt->execute();

    $result = $stmt->get_result();
    $products = [];

    while ($row = $result->fetch_assoc()) {
        $products[] = $row;
    }

    $stmt->close();

    http_response_code(200);
    $this->response("200 OK", "success", $products);
    }
    private function getUserDetails($input){
        // ensure apiKey is NOT NULL
        if(empty($input['apikey'])|| !isset($input['apikey'])){
            http_response_code(400);
            $this->response("400 Bad Request","error","apikey is Missing");
            return;
        }
        
        $api = $input['apikey'];

        if(!$this->isValidApikey($api)){
            http_response_code(404);
            $this->response("404 Not Found","error","apikey is not valid");
            return;
        }

        $query = "SELECT User_ID, Name, Surname, Email, Cell_No FROM Users WHERE API_Key = ?";
        $stmt = $this->DB_Connection->prepare($query);
        $stmt->bind_param("s", $api);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 1) {
            $user = $result->fetch_assoc();
            http_response_code(200);
            $this->response("200 OK", "success", $user);
            return;
        } else {
            http_response_code(500);
            $this->response("500 Internal Server Error", "error", "Failed to fetch user data");
            return;
        }
    }
    private function updateUserDetails($input){

         // ensure apiKey is NOT NULL
        if(empty($input['apikey'])|| !isset($input['apikey'])){
            http_response_code(400);
            $this->response("400 Bad Request","error","apikey is Missing");
            return;
        }
        
        $api = $input['apikey'];

        if(!$this->isValidApikey($api)){
            http_response_code(404);
            $this->response("404 Not Found","error","apikey is not valid");
            return;
        }

        $fields = [];
        $params = [];
        $types = "";

        if (!empty($input['name']) && isset($input['name'])) {
            $fields[] = "Name = ?";
            $params[] = $input['name'];
            $types .= "s";
        }

        if (!empty($input['surname']) && isset($input['surname'])) {
            $fields[] = "Surname = ?";
            $params[] = $input['surname'];
            $types .= "s";
        }

        if (!empty($input['email']) && isset($input['email'])) {
            if(!$this->emailUsed($input['email'])){
                $fields[] = "Email = ?";
                $params[] = $input['email'];
                $types .= "s";
            }
            else{
                http_response_code(400);
                $this->response("400 Bad Request","error","Email is already used");
                return;
            }
        }

        if (!empty($input['cell_no']) && isset($input['cell_no'])) {
            if($this->isValidCellNo($input['cell_no'])){
                $fields[] = "Cell_No = ?";
                $params[] = $input['cell_no'];
                $types .= "s";
            }else{
                http_response_code(400);
                $this->response("400 Bad Request","error","Invalid Cellphone number");
                return;
            }
    }

        if (!empty($input['password'])) {
        if (!$this->isValidPassword($input['password'])) {
            http_response_code(400);
            $this->response("400 Bad Request", "error", "Password must be at least 8 characters long, include uppercase and lowercase letters, a number, and a symbol.");
            return;
        }
            // generate salt (16 random chars and Letters) 
            $salt = bin2hex(random_bytes(16));

            // Hash password using Argon2ID (no manual salt needed)
            $hash = password_hash($input['password'].$salt, PASSWORD_ARGON2ID, [
                'memory_cost' => 65536, // Uses 64mb RAM per hash which slows down brute force attacks
                'time_cost' => 4, // increased number of iterations means that hashing occurs more slowly but also means that the result would be harder to crack
                'threads' => 2 // 2 CPU threads to balance speed and security
            ]);

            $fields[] = "Password = ?";
            $params[] = $hash;
            $types .= "s";
    }

        if (count($fields) === 0) {
            http_response_code(400);
            $this->response("400 Bad Request", "error", "No fields to update");
            return;
        }

        // Prepare the SQL query
        $query = "UPDATE Users SET " . implode(", ", $fields) . " WHERE API_Key = ?";
        $params[] = $api;
        $types .= "s";

        $stmt = $this->DB_Connection->prepare($query);
        if (!$stmt) {
            http_response_code(500);
            $this->response("500 Internal Server Error", "error", "Failed to prepare statement");
            return;
        }

        $stmt->bind_param($types, ...$params);

        if ($stmt->execute()) {
            http_response_code(200);
            $this->response("200 OK", "success", "User details updated successfully");
        } else {
            http_response_code(500);
            $this->response("500 Internal Server Error", "error", "Failed to update user details");
        }

        $stmt->close();
    }
    private function RemoveFromFavourite($input){
    if (empty($input['apikey']) || !isset($input['apikey'])) {
        http_response_code(400);
        $this->response("400 Bad Request", "error", "apikey is Missing");
        return;
    }

    if (empty($input['Title']) || !isset($input['Title'])) {
        http_response_code(400);
        $this->response("400 Bad Request", "error", "Title is Missing");
        return;
    }

    $api = htmlspecialchars(trim($input['apikey']));
    $title = htmlspecialchars(trim($input['Title']));

    $userId = $this->getUserByApiKey($api)['User_ID'];
    if (!$userId) {
        http_response_code(403);
        $this->response("403 Forbidden", "error", "Invalid API Key");
        return;
    }

    $productInfo = $this->getProductInfo($title);
    if (!$productInfo || !isset($productInfo['Product_No'])) {
        http_response_code(404);
        $this->response("404 Not Found", "error", "Product not found");
        return;
    }

    $prodId = intval($productInfo['Product_No']);

    if (!$this->userAddedToFavourites($api, $title)) {
        http_response_code(400);
        $this->response("400 Bad Request", "error", "User did not add product to favourites");
        return;
    }

    $stmt = $this->DB_Connection->prepare("DELETE FROM favourites WHERE product_id = ? AND user_id = ?");
    if (!$stmt) {
        http_response_code(500);
        $this->response("500 Internal Server Error", "error", "Failed to prepare statement");
        return;
    }

    $stmt->bind_param("ii", $prodId, $userId);
    $success = $stmt->execute();
    $stmt->close();

    if ($success) {
        http_response_code(200);
        $this->response("200 OK", "success", "Product removed from favourites");
    } else {
        http_response_code(500);
        $this->response("500 Internal Server Error", "error", "Failed to delete favourite");
    }
    }
    private function AddRetailer($input) {
    if (empty($input['apikey']) || !isset($input['apikey'])) {
        http_response_code(400);
        $this->response("400 Bad Request", "error", "apikey is Missing");
        return;
    }

    $apikey = htmlspecialchars(trim($input['apikey']));
    if (!$this->isAdmin($apikey)) {
        http_response_code(403);
        $this->response("403 Forbidden", "error", "User is not an admin");
        return;
    }

    if (empty($input['retailName']) || !isset($input['retailName'])) {
        http_response_code(400);
        $this->response("400 Bad Request", "error", "retailName is Missing");
        return;
    }

    $retailName = htmlspecialchars(trim($input['retailName']));
    $retailAddress = isset($input['retailAddress']) ? htmlspecialchars(trim($input['retailAddress'])) : '';

    if ($this->isInRetail($retailName)) {
        http_response_code(403);
        $this->response("403 Forbidden", "error", "Retailer already exists");
        return;
    }

    $stmt = $this->DB_Connection->prepare("INSERT INTO Retailers(Name, Phy_Address) VALUES(?, ?)");
    if (!$stmt) {
        http_response_code(500);
        $this->response("500 Internal Server Error", "error", "Could not prepare insert statement");
        return;
    }

    $stmt->bind_param("ss", $retailName, $retailAddress);

    if ($stmt->execute()) {
        http_response_code(200);
        $this->response("200 OK", "success", "Retailer added successfully");
    } else {
        http_response_code(500);
        $this->response("500 Internal Server Error", "error", "Failed to insert retailer");
    }

    $stmt->close();
    }
    private function RemoveRetailer($input){
        $required = ['apikey', 'retailer'];
        forEach($required as $field){
            if(empty($input[$field])){
                http_response_code(400); // Bad Request
                $this->response("400 Bad Request","error","$field is required");
                return;
            }
        }
        if(!$this->isAdmin($input['apikey'])){
            http_response_code(400);
            $this->response("400 Bad Request","error","User is not an admin");
            return;
        }

        $retailer = $input['retailer'];
        if ($this->isInRetail($retailer)) {
            $deleteSql = "DELETE FROM Retailers WHERE Name = ?";
            $deleteStmt = $this->DB_Connection->prepare($deleteSql);
            $deleteStmt->bind_param("s", $retailer);
            if ($deleteStmt->execute()) {
                http_response_code(200);
                $this->response("200 OK","success",["message" => "Retailer '$retailer' has been deleted."]);
            }else{
                http_response_code(500);
                $this->response("500 Internal Server Error","error",["message" => "Could not delete product: $retailer"]);
            }
            $deleteStmt->close();
        }else{
            http_response_code(400);
            $this->response("400 Bad Request","error",["message" => "Retailer '$retailer' not found."]);
        }
    }
    private function UpdateRetailer($input) {
    if (empty($input['apikey']) || !isset($input['apikey'])) {
        http_response_code(400);
        $this->response("400 Bad Request", "error", "apikey is Missing");
        return;
    }

    $apikey = htmlspecialchars(trim($input['apikey']));
    if (!$this->isAdmin($apikey)) {
        http_response_code(403);
        $this->response("403 Forbidden", "error", "User is not an admin");
        return;
    }

    if (empty($input['retailName']) || !isset($input['retailName'])) {
        http_response_code(400);
        $this->response("400 Bad Request", "error", "retailName is Missing");
        return;
    }

    $oldName = htmlspecialchars(trim($input['retailName']));
    if (!$this->isInRetail($oldName)) {
        http_response_code(404);
        $this->response("404 Not Found", "error", "Retailer does not exist");
        return;
    }

    $newName = isset($input['newRetailName']) ? htmlspecialchars(trim($input['newRetailName'])) : $oldName;
    $retailAddress = isset($input['retailAddress']) ? htmlspecialchars(trim($input['retailAddress'])) : '';

    $stmt = $this->DB_Connection->prepare("UPDATE Retailers SET Name = ?, Phy_Address = ? WHERE Name = ?");
    if (!$stmt) {
        http_response_code(500);
        $this->response("500 Internal Server Error", "error", "Could not prepare update statement");
        return;
    }

    $stmt->bind_param("sss", $newName, $retailAddress, $oldName);

    if ($stmt->execute()) {
        http_response_code(200);
        $this->response("200 OK", "success", "Retailer updated successfully");
    } else {
        http_response_code(500);
        $this->response("500 Internal Server Error", "error", "Failed to update retailer");
    }

    $stmt->close();
    }
    private function makeUserAdmin($input){
        $needed = ['adminkey', 'targetkey'];
         forEach($needed as $field){
            if(empty($input[$field])){
                http_response_code(400); // Bad Request
                $this->response("400 Bad Request","error","$field is required");
                return;
            }
        }
        $admin = $input['adminkey'];
        if(!$this->isValidApikey($admin)){
            http_response_code(400); 
            $this->response("400 Bad Request","error","Admin key is not recognised as a valid key");
            return;
        }
        if(!$this->isAdmin($admin)){
            http_response_code(403); 
            $this->response("403 Forbbidden","error","Non-admin user may not make users admin");
            return;
        }
        $target = $input['targetkey'];
    	if(!$this->isValidApikey($target)){
            http_response_code(400);
            $this->response("400 Bad Request","error","Target key is not recognised as a valid key");
            return;
        }
        


        if($this->isAdmin($target)){
            http_response_code(400);
            $this->response("400 Bad Request","error","Target key is already an Admin");
            return;
        }

        $stmt = $this->DB_Connection->prepare("UPDATE Users SET User_Type = 'admin' WHERE API_Key = ?");
    if (!$stmt) {
        http_response_code(500);
        $this->response("500 Internal Server Error", "error", "Could not prepare update statement");
        return;
    }

    $stmt->bind_param("s", $target);

    if ($stmt->execute()) {
        http_response_code(200);
        $this->response("200 OK", "success", "Target is now an admin");
    } else {
        http_response_code(500);
        $this->response("500 Internal Server Error", "error", "Failed to make target an admin");
    }

    $stmt->close();
    }

    //--------------------- HELPER FUNCTIONS -----------------//
    private function response($codeAndMessage, $status, $data){
        // code and message is in the form "200 OK"
        $headerText = "HTTP/1.1 ".$codeAndMessage;
        header($headerText);
		header("Content-Type: application/json; charset=UTF-8");

        $response = [
            "status" => $status,
            "timestamp" => round(microtime(true) * 1000),
            "data" => $data
        ];

        $json = json_encode($response);

        if ($json === false) {
            error_log("JSON encoding error: " . json_last_error_msg());
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Internal Server Error: JSON encoding failed"]);
            exit;
        }

        echo $json;
        exit;

    }
    private function isInRetail($name){
        $stmt= $this->DB_Connection->prepare("SELECT * FROM Retailers WHERE Name = ?");
        $stmt->bind_param("s",$name);
       if($stmt->execute()){
            if($stmt->get_result()->fetch_assoc()){
                return true;
            }
            else{
                return false;
            }
        }
        http_response_code(400);
        $this->response("400 Error", 'error',"isInRetail did Not Execute");
        exit;
    }
    private function isAdmin($apikey){
        $stmt= $this->DB_Connection->prepare("SELECT User_Type FROM Users WHERE API_Key = ?");
        $stmt->bind_param("s",$apikey);
       if($stmt->execute()){
            if($stmt->get_result()->fetch_assoc()['User_Type'] === 'admin'){
                return true;
            }
            else{
                return false;
            }
        }
        http_response_code(400);
        $this->response("400 Error", 'error',"isAdmin did Not Execute");
        exit;
    }
    private function getRetailerInfo($name){
    $stmt = $this->DB_Connection->prepare("SELECT * FROM Retailers WHERE Name = ?");
    $stmt->bind_param("s", $name);
    $stmt->execute();
    return $stmt->get_result()->fetch_assoc();
    }
    private function isValidRetailer($retailer){
        $stmt= $this->DB_Connection->prepare(query: "SELECT * FROM Retailers WHERE Name = ?");
        $stmt->bind_param("s",$retailer);
       if($stmt->execute()){
            if($stmt->get_result()->num_rows>0){
                return true;
            }
            else{
                return false;
            }
        }
        http_response_code(500);
        $this->response("500 Internal Server Error", 'error',"Database error: " . $stmt->error);
        exit;
    }
    private function getUserByApiKey($apiKey) {
    $stmt = $this->DB_Connection->prepare("SELECT * FROM Users WHERE API_Key = ?");
    if (!$stmt) return null;

        $stmt->bind_param("s", $apiKey);
        $stmt->execute();
        $result = $stmt->get_result();

        return ($result && $result->num_rows > 0) ? $result->fetch_assoc() : null;
    }   
    private function isValidPassword($password) {
       return preg_match("/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/", $password);
       //Password must be at least 8 characters long, include uppercase and lowercase letters, a number, and a symbol.
    }
    private function isValidUserType($userType){
       return in_array(strtolower($userType), ['normal', 'admin']);
    }
    private function isValidCellNo($cellNum){
     $trimmed= trim(($cellNum));
     return preg_match("/^\+?[0-9]{10,15}$/", $trimmed);
    }
    private function emailUsed($email){
        $stmt = $this->DB_Connection->prepare("SELECT User_ID FROM Users WHERE Email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            return true;
        }
        return false;
    }
    private function generateApiKey($length = 32) {
        return bin2hex(random_bytes($length / 2)); // length of 16
    }
    private function isValidApikey($apikey){
        $stmt = $this->DB_Connection->prepare("SELECT * FROM Users WHERE API_Key = ?");
        $stmt->bind_param("s", $apikey);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            return true;
        }
        return false;
    }
    private function fetchProductData($title){
        $sql = "SELECT p.Title AS productTitle, pr.Price AS Price, r.Name AS retailerName, p.Product_No, p.Category, p.Description, p.Brand, p.Image_URL FROM Products p JOIN Prices pr ON p.Product_No = pr.Product_No JOIN Retailers r ON pr.Retailer_ID = r.Retailer_ID WHERE p.Title = ?";
        $stmt = $this->DB_Connection->prepare($sql);
        $stmt->bind_param("s", $title);
        $stmt->execute();
        $result = $stmt->get_result();
        $data = $result->fetch_all(MYSQLI_ASSOC);
        $stmt->close();

        if (!$data || count($data)===0) {
            http_response_code(400);
            $this->response("400 Bad Request", "error", "Failed to retrieve data from '$title'");
            exit;
        }

        return $data;
    }
    private function getProductInfo($title) {
        $stmt = $this->DB_Connection->prepare("SELECT * FROM Products WHERE Title = ?");
        if (!$stmt) return null;

        $stmt->bind_param("s", $title);
        $stmt->execute();
        $result = $stmt->get_result();

        return ($result && $result->num_rows > 0) ? $result->fetch_assoc() : null;
    }
    private function formatResponseData($data){
        $retailers = array_map(fn($r) => htmlspecialchars($r, ENT_QUOTES, 'UTF-8'), array_column($data, 'retailerName'));
        $prices = array_column($data, 'Price');
        $title = htmlspecialchars(array_column($data, 'productTitle')[0], ENT_QUOTES, 'UTF-8');
        $productNum = array_column($data, 'Product_No')[0];
        $category = htmlspecialchars(array_column($data, 'Category')[0],ENT_QUOTES, 'UTF-8');
        $description = htmlspecialchars(array_column($data, 'Description')[0],ENT_QUOTES, 'UTF-8');
        $imgUrl = filter_var(array_column($data, 'Image_URL')[0], FILTER_VALIDATE_URL) ? htmlspecialchars(array_column($data, 'Image_URL')[0],ENT_QUOTES, 'UTF-8') : null;
        $brand = htmlspecialchars(array_column($data, 'Brand')[0],ENT_QUOTES, 'UTF-8');

        return [
            "ProductNo" => $productNum,
            "Title" => $title,
            "Category" => $category,
            "Description" => $description,
            "Brand" => $brand,
            "ImageUrl" => $imgUrl,
            "retailers" => $retailers,
            "prices" => $prices
        ];
    }
    //getProdReviews returns a table(2D array's)
    private function getProductReviews($input) {
        if (empty($input['Title'])) {
            http_response_code(400);
            $this->response("400 Bad Request", "error", "Title is Missing");
            return;
        }

        $product = $this->getProductInfo($input['Title']);
        if (!$product) {
            http_response_code(400);
            $this->response("400 Bad Request", "error", "Product not found");
            return;
        }

        $productId = $product['Product_No'];

        $sql = "
            SELECT 
            Reviews.*
            FROM Reviews
            JOIN Users ON Reviews.U_ID = Users.User_ID
            WHERE Reviews.Prod_ID = ?
        ";

        $stmt = $this->DB_Connection->prepare($sql);
        if (!$stmt) {
            http_response_code(500);
            $this->response("500 Internal Server Error", "error", "Failed to prepare SQL statement");
            return;
        }

        $stmt->bind_param("i", $productId);
        $stmt->execute();
        $result = $stmt->get_result();

        $reviews = $result->fetch_all(MYSQLI_ASSOC);

        http_response_code(200);
        $this->response("200 OK", "success", $reviews);
    }


    private function userRemoveReview($apikey, $title) {
        $user = $this->getUserByApiKey($apikey);
        $product = $this->getProductInfo($title);
        if (!$user || !$product) return false;

        $userId = $user['User_ID'];
        $productId = $product['Product_No'];

        $stmt = $this->DB_Connection->prepare("DELETE FROM Reviews WHERE Prod_ID = ? AND U_ID = ?");
        $stmt->bind_param("ii", $productId, $userId);
        return $stmt->execute();
    }
    private function madeReviewOnProduct($apikey, $title) {
        $user = $this->getUserByApiKey($apikey);
        $product = $this->getProductInfo($title);
        if (!$user || !$product) return false;

        $userId = $user['User_ID'];
        $productId = $product['Product_No'];

        $stmt = $this->DB_Connection->prepare("SELECT 1 FROM Reviews WHERE Prod_ID = ? AND U_ID = ?");
        $stmt->bind_param("ii", $productId, $userId);
        
        if (!$stmt->execute()) {
            http_response_code(500);
            $this->response("500 Internal Server Error", "error", "Failed to check for review: " . $stmt->error);
            return false;
        }

        return $stmt->get_result()->num_rows > 0;
    }
    private function userAddedToFavourites($apikey, $title) {
    $user = $this->getUserByApiKey(htmlspecialchars(trim($apikey)));
    $product = $this->getProductInfo(htmlspecialchars(trim($title)));

    if (!$user || !isset($user['User_ID']) || !$product || !isset($product['Product_No'])) {
        return false;
    }

    $userId = intval($user['User_ID']);
    $productId = intval($product['Product_No']);

    $stmt = $this->DB_Connection->prepare("SELECT 1 FROM favourites WHERE product_id = ? AND user_id = ?");
    if (!$stmt) {
        http_response_code(500);
        $this->response("500 Internal Server Error", "error", "Failed to prepare statement");
        return false;
    }

    $stmt->bind_param("ii", $productId, $userId);

    if (!$stmt->execute()) {
        http_response_code(500);
        $this->response("500 Internal Server Error", "error", "Failed to execute statement");
        $stmt->close();
        return false;
    }

    $result = $stmt->get_result();
    $exists = $result && $result->num_rows > 0;
    $stmt->close();
    return $exists;
    }
    private function adminRemoveReview($title, $apikey) {
        return $this->userRemoveReview($apikey, $title); 
    }
}
    

if (basename(__FILE__) == basename($_SERVER['SCRIPT_FILENAME'])) {
    // Only run this if api.php is called directly. Doing this prevents the double-running of handleRequest()
    try{
        $api = API::instance();
        $api->handleRequest();
    }catch(Exception $e){
        http_response_code(500);
        error_log("UNCAUGHT ERROR: " . $e->getMessage());
        echo json_encode([
            "status"=> "error",
            "timestamp" => round(microtime(true) * 1000),
            "data"=> "Internal server error",
            "debug_info" => $e->getMessage() 
        ]);    
    }
}