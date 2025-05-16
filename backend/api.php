<?php
require_once(__DIR__."/config.php"); //feel free to change accordingly
header("Content-Type: application/json");
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
    }
	public function __destruct() {
        $this->DB_Connection = null;
    }

    public function handleRequest() {}

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
}

header("Access-Control-Allow-Origin: *"); // Allows any website (any “origin”) to make requests to this endpoint
header("Access-Control-Allow-Methods: POST"); // Tells the browser that only POST requests are permitted from cross‑origin callers.
header("Access-Control-Allow-Headers: Content-Type"); // Declares which custom headers the client is allowed to send.
//Sending HTTP headers that enable Cross-Origin Resource Sharing(CORS) so that browsers will let web pages on other domains talk to the API
if (basename(__FILE__) == basename($_SERVER['SCRIPT_FILENAME'])) {
    // Only run this if api.php is called directly. Doing this prevents the double-running of handleRequest()
    try{
        $api = API::instance();
        $api->handleRequest();
    }catch(Exception $e){
        http_response_code(500);
        error_log("UNCAUGHT ERROR: " . $e->getMessage());
        echo json_encode(["status"=> "error","timestamp" => round(microtime(true) * 1000),"data"=> "Internal server error"]); // feel free to change
    }
}

?>