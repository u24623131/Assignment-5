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

// UPDATED: Check for cookie level first, then session, then default to 0
$userLevel = 0; // Default level

// First, check if there's a cookie with updated level
if (isset($_COOKIE['temp_user_level'])) {
    $userLevel = (int)$_COOKIE['temp_user_level'];
    // Also update the session to keep them in sync
    $_SESSION['user_level'] = $userLevel;
} elseif (isset($_SESSION['user_level'])) {
    // Fallback to session value if no cookie
    $userLevel = (int)$_SESSION['user_level'];
}
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
                    echo "";
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

<?php if($isLoggedIn){ ?>
<button id="actionButton" class="action-button">Click Me!</button>

    <script>
        const csrfToken = "<?php echo htmlspecialchars($csrf_token); ?>";
        const userLevel = <?php echo $userLevel; ?>; // Pass user level to JavaScript
        
        // DEBUG: Log the user level being passed
        console.log('[HEADER DEBUG] User level from PHP:', <?php echo $userLevel; ?>);
    </script>

    <!-- Load the original header.js -->
    <script src="..\JS\header.js"></script>
    
    <!-- Load the coupon system -->
    <script src="..\JS\coupon-system.js"></script>
    
    <script>
        // Initialize coupon system after page loads
        window.addEventListener('load', function() {
            console.log('[HEADER DEBUG] Initializing coupon system with level:', userLevel);
            // Initialize user level and start coupon system
            if (typeof initializeUserLevel === 'function') {
                initializeUserLevel(userLevel);
            }
        });
    </script>
<?php }?>