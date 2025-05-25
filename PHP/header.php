<?php
session_start();
//include 'config.php';

// Optionally set current page dynamically to highlight nav (if used)
// $currentPage = basename($_SERVER['PHP_SELF'], ".php");
$_SESSION['login'] = true; // Example: Set to false for testing login/signup display
$_SESSION['admin'] = true;
$isLoggedIn = isset($_SESSION['login']) && $_SESSION['login'] === true;
?>

<div class="container">
    <div class="navbar">
        <div class="navLS">
            <ul>
                <?php if (!$isLoggedIn) { // Use $isLoggedIn variable ?>
                    <li><a  href="login.php"><i class="fas fa-sign-in-alt"></i> Login</a></li>
                    <li><a id = "asignup" href="signup.php"><i class="fas fa-user-plus"></i>Signup</a></li>
                <?php } else { ?>
                    <li><a class = "btn" href="logout.php"><i class="fas fa-sign-out-alt"></i>Logout</a></li>
                <?php } ?>
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

                    <?php if ($_SESSION['admin'] == true) { ?>
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

    <!-- Right Side: Login/Signup or Logged-in User -->
    <button id="modeToggle" class="toggle-btn">
        <!-- <h4>Toggle Dark Mode:</h4> -->
        <i class="fas fa-moon" id="modeIcon"></i>
    </button>
</div>

<script src="..\JS\header.js"></script>