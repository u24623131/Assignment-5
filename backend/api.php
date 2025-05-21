<?php
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
            echo json_encode([
                "status" => "error",
                "message" => "Missing JSON input",
                "json_error" => json_last_error_msg()
            ]);
            exit;
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
            case "Register":
                $this->handleRegister($input);
                break;

            case "GetAllProducts":
                $this->getAllProducts();
                break;

            case "Login":
                $this->handleLogin($input);
                break;
            
            case "DeleteAccount":
                $this->deleteAccount($input);
                break; 
                
            case "ProductByRetailer":
                $this->handleProductByRetailer($input);
                break;

            case "ProductsByCustomerId":
                $this->handleProductsByCustomerId($input);
                break;
            
            case "AddToFavourite":
                $this->AddFavourite($input);
                break;

            case "getUserFavourite":
                $this->getUserFavourite($input);
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
        $name = trim($input['Name']);
        $surname = trim($input['Surname']);
        $email = trim($input['Email']);
        $pass = trim($input['Password']);
        $userType = trim($input['User_Type']);

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
        $hash = password_hash($pass . $salt, PASSWORD_ARGON2ID);

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
                                "apiKey" => $apiKey
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
        $stmt = $this->DB_Connection->prepare("SELECT Password, Salt, API_Key from Users where Email = ?");

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
                $this->response("200 OK", "success", ["API_Key" => $user["API_Key"]]);
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
        
    // Query the products
    $result = $this->DB_Connection->query("SELECT * FROM Products");

    // Check if the query was successful
    if ($result) {
        if ($result && $result->num_rows > 0) {

            // Fetch all rows 
            $products = [];
            while ($row = $result->fetch_assoc()) {
                $products[] = $row;
            }

            http_response_code(200);
            $this->response("200 OK", "success", ["Products" => $products]);

        }
        else {
            http_response_code(200);
            $this->response("200 OK", "success", ["Products" => []]);
        }
    }
    else {
        http_response_code(500);
        $this->response("500 Internal Server Error", "error", "Query failed in getAllProducts");
    }
    }
    //Delete Account: deleteAccount param = input
    private function deleteAccount($input){

        if(!isset($input['API_Key'])|| empty($input['API_Key'])){
            http_response_code(400);
                $this->response("400 Bad Request","error","API_Key is Missing");
                return;
        }
        // find find that user via API key

        $api = $input['API_Key'];
         //find the user and ensure they exist
        $stmt = $this->DB_Connection->prepare("DELETE FROM Users where API_Key = ?");

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
    }
    private function handleProductByRetailer($input){ // called when you click a button
        $required = ['retailer', 'productNum'];
        forEach($required as $field){
            if(empty($input[$field])){
                http_response_code(400); // Bad Request
                $this->response("400 Bad Request","error","$field is required");
                return;
            }
        }

        $retailer = $input['retailer'];
        $productNum = $input['productNum'];

        // check if retailer actualy exists in comparison table (avoid db errors early)
        // get product details using productID
        // get price using both
        $getSql = "SELECT Price FROM Prices WHERE Retailer_ID = ? AND Product_No = ?";
        $getStmt = $this->DB_Connection->prepare($getSql);
        $getStmt->bind_param("ii", $retailer, $productNum);
        $getStmt->execute();
        $resultPrice = $getStmt->get_result();
        $getStmt->close();

        if ($resultPrice && $price = $resultPrice->fetch_assoc()) {
            //Fetch other product data
            $sql = "SELECT * FROM Products WHERE Product_No = ?";
            $stmt = $this->DB_Connection->prepare($sql);
            $stmt->bind_param("i", $productNum);
            $stmt->execute();
            $resProductData = $stmt->get_result();
            if ($resProductData && $productData = $resProductData->fetch_assoc()) {
                http_response_code(200);
                $this->response("200 OK","success",[
                    "ProductNo" => $productData['Product_No'],
                    "Title" => $productData['Title'],
                    "Category" => $productData['Category'],
                    "Description" => $productData['Description'],
                    "Brand" => $productData['Brand'],
                    "ImageUrl" => $productData['Image_UTL'],
                    "Price" => $price['Price']
                ]);
            }else{
                http_response_code(500);
                $this->response("500 Internal Server Error","error",["Could not fetch product data"]);
            }
            $stmt->close();
        }else{
            // Return error
            http_response_code(500);
            $this->response("500 Internal Server Error","error",["Could not get price of desired item"]);
        }

    }
    private function handleProductsByCustomerId($input){
        $required = ['customerID'];
        // do the whole string concatination thing per product associated with the customer id (Apparently the product numbers are in an array?)
    }
    private function AddFavourite($input) {
    // Required keys
    $req = ['apiKey', 'Product_No'];

    // Check for missing parameters
    foreach ($req as $r) {
        if (!isset($input[$r]) || empty($input[$r])) {
            http_response_code(response_code: 404);
            $this->response("400 Bad Request", "error", "$r is missing");
            return;
        }
    }

    // Get user from API key
    $userInfo = $this->getUserByApiKey($input['apiKey']);
    if (!$userInfo || !isset($userInfo['User_ID'])) {
        http_response_code(response_code: 404);
        $this->response("404 Not Found", "error", "User not found");
        return;
    }

    $userID = $userInfo['User_ID'];
    $productNo = $input['Product_No'];

    // Check if product exists
    $stmt = $this->DB_Connection->prepare("SELECT Product_No FROM Products WHERE Product_No = ?");
    if (!$stmt) {
        error_log("Prepare Failed: " . $this->DB_Connection->error);
        http_response_code(500);
        $this->response("500 Internal Server Error", "error", "Database Error: " . $this->DB_Connection->error);
        return;
    }

    $stmt->bind_param("i", $productNo);

    if (!$stmt->execute()) {
        error_log("MySQL Error: " . $stmt->error);
        http_response_code(500);
        $this->response("500 Internal Server Error", "error", "Product check failed");
        return;
    }

    $result = $stmt->get_result();
    if ($result->num_rows === 0) {
        http_response_code(response_code: 404);
        $this->response("404 Not Found", "error", "Product not found");
        return;
    }

    // check if it alr exists 
    $check = $this->DB_Connection->prepare("SELECT * FROM favourites WHERE user_id = ? AND product_id = ?");
    $check->bind_param("ii", $userID,$productNo);

    if (!$check->execute()) {
        if ($this->DB_Connection->errno === 1062) { // Duplicate entry
            http_response_code(409);
            $this->response("409 Conflict", "error", "This product is already in your favourites.");
        } else {
            http_response_code(500);
            error_log("Insert Failed: " . $stmt->error);
            $this->response("500 Internal Server Error", "error", "Failed to add to favourites");
        }
        return;
    }

    if ($result = $check->get_result()->num_rows>0){
            http_response_code(401);
            error_log("Insert Failed: " . $stmt->error);
            $this->response("401 Unauthorised Action", "error", "User_ID And Product_No Already in table");
    }
    // Insert into favourites
    $stmt = $this->DB_Connection->prepare("INSERT INTO favourites(user_id, product_no) VALUES (?, ?)");
    if (!$stmt) {
        error_log("Prepare Failed (Insert): " . $this->DB_Connection->error);
        $this->response("500 Internal Server Error", "error", "Failed to prepare insert statement");
        return;
    }

    $stmt->bind_param("ii", $userID, $productNo);
    if (!$stmt->execute()) {
        if ($this->DB_Connection->errno === 1062) { // Duplicate entry
            $this->response("409 Conflict", "error", "This product is already in your favourites.");
        } else {
            error_log("Insert Failed: " . $stmt->error);
            $this->response("500 Internal Server Error", "error", "Failed to add to favourites");
        }
        return;
    }

    // Success response
    $this->response("200 OK", "success", "Product added to favourites");
    }
    private function getUserFavourite($input) {
        // Validate input
        if (!isset($input['apiKey']) || empty($input['apiKey'])) {
            http_response_code(400);
            $this->response("400 Bad Request", "error", "apiKey is missing");
            return;
        }

        // Get user from API key
        $userInfo = $this->getUserByApiKey($input['apiKey']);
        if (!$userInfo || !isset($userInfo['User_ID'])) {
            http_response_code(404);
            $this->response("404 Not Found", "error", "User not found");
            return;
        }

        $userId = $userInfo['User_ID'];

        // SQL query to get favourite products of the user
        $sql = "
            SELECT Products.* 
            FROM favourites 
            JOIN Users ON favourites.user_id = Users.User_ID 
            JOIN Products ON favourites.product_id = Products.Product_No 
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
        $favourites = [];

        while ($row = $result->fetch_assoc()) {
            $favourites[] = $row;
        }

        http_response_code(200);
        $this->response("200 OK", "success", $favourites);
    }

    private function response($codeAndMessage, $status, $data){
        // code and message is in the form "200 OK"
        $headerText = "HTTP/1.1 ".$codeAndMessage;
        header($headerText);
		header("Content-Type: application/json");

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
    private function getUserByApiKey($apiKey) {
    $stmt = $this->DB_Connection->prepare("SELECT * FROM Users WHERE API_Key = ?");
    $stmt->bind_param("s", $apiKey);
    $stmt->execute();
    return $stmt->get_result()->fetch_assoc();
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
}

//Already included on top:
// header("Access-Control-Allow-Origin: *"); // Allows any website (any “origin”) to make requests to this endpoint
// header("Access-Control-Allow-Methods: POST"); // Tells the browser that only POST requests are permitted from cross‑origin callers.
// header("Access-Control-Allow-Headers: Content-Type"); // Declares which custom headers the client is allowed to send.
// //Sending HTTP headers that enable Cross-Origin Resource Sharing(CORS) so that browsers will let web pages on other domains talk to the API

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

