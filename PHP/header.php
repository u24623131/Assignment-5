<?php
session_start();
//include 'config.php';

// Optionally set current page dynamically to highlight nav (if used)
// $currentPage = basename($_SERVER['PHP_SELF'], ".php");
$_SESSION['login'] = true;
$isLoggedIn = isset($_SESSION['login']) && $_SESSION['login'] === true;
?>

<div class="container">
    <div class="navbar">
        <div class="logo">
            <img src="../image/toaster.jpg" width="100px">
        </div>

        <div class="Nav-container">
            <nav>
                <ul style="list-style: none;" id="\">
                    <li><a class="<?= ($currentPage == 'home') ? 'active' : '' ?>" href="<?= $isLoggedIn ? 'home.php' : 'login.php' ?>"><i class="fas fa-home"></i> Home</a></li>
                    <li><a class="<?= ($currentPage == 'comparison') ? 'active' : '' ?>" href="<?= $isLoggedIn ? 'compare.php' : 'login.php' ?>"> <i class="fas fa-exchange-alt"></i>Comparison</a></li>
                    <li><a class="<?= ($currentPage == 'favorites') ? 'active' : '' ?>" href="<?= $isLoggedIn ? 'favorites.php' : 'login.php' ?>"><i class="fas fa-heart nav-icons"></i> Favorites</a></li>
                    <li><a class="<?= ($currentPage == 'profile') ? 'active' : '' ?>" href="<?= $isLoggedIn ? 'profile.php' : 'login.php' ?>"><i class="fas fa-user"></i> Profile</a></li>


                    <?php if ($_SESSION['login'] == false) { ?>
                        <li><a class="<?= ($currentPage == 'login') ? 'active' : '' ?>" href="login.php"><i class="fas fa-sign-in-alt"></i></i> Login</a></li>
                        <li><a class="<?= ($currentPage == 'signup') ? 'active' : '' ?>" href="signup.php"><i class="fas fa-user-plus"></i></i> Signup</a></li><?php } ?>
                </ul>
            </nav>

            <div class="search-box">
                <input type="text" placeholder="Search..." class="search-input" name="search">
                <button class="btn search-btn" id="btnSearch">
                    <i class="fas fa-search"></i>
                </button>
            </div>
        </div>
    </div>

    <!-- Right Side: Login/Signup or Logged-in User -->
    <button id="modeToggle" class="toggle-btn">
        <i class="fas fa-moon" id="modeIcon"></i>
    </button>
</div>


<script src="..\JS\header.js"></script>