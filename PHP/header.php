<?php
session_start();
//include 'config.php';

// Optionally set current page dynamically to highlight nav (if used)
// $currentPage = basename($_SERVER['PHP_SELF'], ".php");
?>

<div class="container">
    <div class="navbar">
        <div class="logo">
            <img src="images/Logo.png" width="125">
        </div>

        <div class="Nav-container">
            <nav>
                <ul style="list-style: none;" id="\">
                    <li><a class="<?= ($currentPage == 'home') ? 'active' : '' ?>" href="product.php"><i class="fas fa-home"></i> Home</a></li>
                    <li><a class="<?= ($currentPage == 'comparison') ? 'active' : '' ?>" href="sales.php"> Comparison</a></li>
                    <li><a class="<?= ($currentPage == 'favorites') ? 'active' : '' ?>" href="wishlist.php"><i class="fas fa-heart nav-icons"></i> Favorites</a></li>
                    <li><a class="<?= ($currentPage == 'profile') ? 'active' : '' ?>" href="cart.php"><i class="fas fa-user"></i> Profile</a></li>
                    <li><a class="<?= ($currentPage == 'login') ? 'active' : '' ?>" href="#"><i class="fas fa-sign-in-alt"></i></i> Login</a></li>
                    <li><a class="<?= ($currentPage == 'signup') ? 'active' : '' ?>" href="#"><i class="fas fa-user-plus"></i></i> Signup</a></li>
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