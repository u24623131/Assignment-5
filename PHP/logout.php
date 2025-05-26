<?php 
session_start();

// Remove all session variables
session_unset();

// Destroy the session
session_destroy();

// Redirect to login or home page
header("Location: login.php");
exit();
?>