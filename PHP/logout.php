<?php
session_start();

// Remove all session variables
session_unset();

if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(
        session_name(),
        '',
        time() - (24 * 60 * 60 * 1000),
        $params["path"],
        $params["domain"],
        $params["secure"],
        $params["httponly"]
    );
}


// Destroy the session
session_destroy();
setcookie("api_key", "", time() - (24 * 60 * 60 * 1000), "/");
setcookie("user_email", "", time() - (24 * 60 * 60 * 1000), "/");
// Redirect to login or home page
header("Location: login.php");
exit();
