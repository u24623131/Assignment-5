<?php
require_once (__DIR__.'/envloader.php');
if (!class_exists('Database')) { // prevent case of double parsing config.php
    class Database{
    private static $instance = null;
    private $mysqli;
    
    private $host;
    private $dbname;
    private $username;
    private $password;
    private function __construct(){
        // for security purposes use a .env file NB. DO NOT COMMIT .ENV

        $this->host = $_ENV['HOST_NAME']; 
        $this->dbname = $_ENV['DB_NAME'];
        $this->username = $_ENV['USERNAME'];
        $this->password = $_ENV['PASSWORD'];
        

        $this->mysqli = new mysqli($this->host, $this->username, $this->password, $this->dbname);
        if ($this->mysqli->connect_error) {
            die("Connection error". $this->mysqli->connect_error);
        }
        $this->mysqli->options(MYSQLI_OPT_INT_AND_FLOAT_NATIVE, true); // to ensure that numbers stay numbers and are not output as text
    }

    public static function getInstance(): Database{
        if (!self::$instance) {
            self::$instance = new Database();
        }
        return self::$instance;
    }

    public function getConnection():mysqli{
        return $this->mysqli;
    }
}
}
?>
