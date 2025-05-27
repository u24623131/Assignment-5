<?php
// session_start();
include '..\config.php';

// Start the session if it's not already started
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Function to generate and get the CSRF token
function generateCsrfToken()
{
    if (empty($_SESSION['csrf_token'])) {
        // Generate a new token if one doesn't exist in the session
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32)); // Generates a 64-character hex string
    }
    return $_SESSION['csrf_token'];
}

// Call this function on pages where you need a token
// Example: In profile.php and manage.php
$csrf_token = generateCsrfToken();

// Optionally set current page dynamically to highlight nav (if used)
// $currentPage = basename($_SERVER['PHP_SELF'], ".php");
// $_SESSION['login'] = false; // Example: Set to false for testing login/signup display
// $_SESSION['admin'] = true;

$isLoggedIn = isset($_SESSION['login']) && $_SESSION['login'] === true;
?>

<div class="container">
    <div class="navbar">
        <div class="navLS">
            <ul>
                <?php if (!$isLoggedIn) {  ?>
                    <li><a href="login.php"><i class="fas fa-sign-in-alt"></i> Login</a></li>
                    <li><a id="asignup" href="signup.php"><i class="fas fa-user-plus"></i>Signup</a></li>
                <?php } else { ?>
                    <li><a class="btn" href="logout.php"><i class="fas fa-sign-out-alt"></i>Logout</a></li>
                <?php }
                if (isset($_COOKIE['user_email'])) {
                    $userEmail = $_COOKIE['user_email'];
                    // If you used encodeURIComponent in JavaScript, you should decode it here
                    $userEmail = urldecode($userEmail);
                    echo "<h6 id='emailHeader'>" . htmlspecialchars($userEmail) . "</h6>";
                } else {
                    echo "User Email cookie not found.<br>";
                } ?>
            </ul>
        </div>
        <div class="logo">
            <img src="../image/Logo.png" width="60px" alt="Company Logo">
        </div>

        <div class="Nav-container">
            <nav>
                <ul id="MenuItems">
                    <li><a class="<?= ($currentPage == 'home') ? 'active' : '' ?>"
                            href="<?= $isLoggedIn ? 'home.php' : 'login.php' ?>"> <i class="fas fa-home"></i> Home</a></li>
                    <li><a class="<?= ($currentPage == 'comparison') ? 'active' : '' ?>"
                            href="<?= $isLoggedIn ? 'compare.php' : 'login.php' ?>"><i class="fas fa-exchange-alt"></i> Comparison</a></li>
                    <li><a class="<?= ($currentPage == 'favorites') ? 'active' : '' ?>"
                            href="<?= $isLoggedIn ? 'favorites.php' : 'login.php' ?>"> <i class="fas fa-heart"></i> Favorites</a></li>
                    <li><a class="<?= ($currentPage == 'profile') ? 'active' : '' ?>"
                            href="<?= $isLoggedIn ? 'profile.php' : 'login.php' ?>"><i class="fas fa-user"></i> Profile</a></li>

                    <?php if (isset($_SESSION['admin']) && $_SESSION['admin'] == true) { ?>
                        <li><a class="<?= ($currentPage == 'manage') ? 'active' : '' ?>" href="manage.php"><i
                                    class="fas fa-user-plus"></i> Manager </a></li>
                    <?php } ?>
                </ul>
            </nav>
        </div>

        <div class="search-box">
            <input type="text" placeholder="Search..." class="search-input" name="search">
            <button class="btn search-btn" id="btnSearch">
                <i class="fas fa-search"></i>
            </button>
        </div>
    </div>
</div>

<script src="..\JS\header.js"></script>