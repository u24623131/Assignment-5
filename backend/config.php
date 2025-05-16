<?php
if (!class_exists('Database')) { // prevent case of double parsing config.php
    class Database{
    private static $instance = null;
    private $mysqli;
    
    private $host = "";
    private $dbname = "";
    private $username = "";
    private $password = "";
    private function __construct(){
        $this->host = "You";
        $this->dbname = "Know";
        $this->username = "What";
        $this->password = "To Add";

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
