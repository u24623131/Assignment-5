<?php
include("header.php");
$currentPage = 'profile';


if (isset($_COOKIE['temp_user_level'])) {
    $_SESSION['user_level'] = (int)$_COOKIE['temp_user_level']; // Cast to int for safety
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Profile</title>
    <link rel="stylesheet" href="../css/profile.css">
    <link rel="stylesheet" href="../css/main.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Dancing+Script&display=swap" rel="stylesheet">
    <meta name="csrf-token" content="<?php echo htmlspecialchars($csrf_token); ?>">
</head>

<body class="signup-page">
    <div class="MainDiv">
        <div class="Top-Header">
            <h2>Compare</h2>
            <h2>It</h2>
        </div>
        <p class="Slogan">Compare Fast. Get Coupons. Quick & Convenient</p>

        <div class="MainContainer">
            <div class="Containerdots">
                <div class="divdot"></div>
                <div class="divdot"></div>
                <div class="divdot"></div>
            </div>
            <label class="LblPA"> PROFILE - UPDATE details</label>
            <br>
            <label class="LblPA" id="curDet"> Current details:</label>
            <label class="LblPA" id="newDet"> New details:</label>
            <hr>
            <form id="register-form" class="Main_Form">

                <div class="input-group">
                    <label class="LblPA"> Name:</label>
                    <input type="text" class="CurVal" name="curName" disabled required placeholder="Current Name Val:">
                    <i id="nameIcon" class="fa fa-user"></i>
                    <input type="text" id="name" class="NewVal" name="name" required placeholder="Name:">
                    <label class="error-label" id="name-error"></label>
                </div>

                <div class="input-group">
                    <label class="LblPA"> Surname:</label>
                    <input type="text" class="CurVal" name="curSurname" disabled required placeholder="Current Surname Val:">
                    <i class="fa fa-user"></i>
                    <input type="text" id="surname" class="NewVal" name="surname" required placeholder="Surname:">
                    <label class="error-label" id="surname-error"></label>
                </div>

                <div class="input-group">
                    <label class="LblPA"> Email:</label>
                    <input type="text" class="CurVal" name="curEmail" disabled required placeholder="Current Email Val:">
                    <i class="fa fa-envelope"></i>
                    <input type="email" id="email" class="NewVal" name="email" required placeholder="Email:">
                    <label class="error-label" id="email-error"></label>
                </div>

                <div class="input-group">
                    <label class="LblPA"> Phone Number:</label>
                    <input type="text" class="CurVal" name="curPhoneNr" disabled required placeholder="Current Phone Number Val:">
                    <i id="pIcon" class="fa fa-phone"></i>
                    <input type="text" id="phoneNumber" class="NewVal" name="phoneNumber" required placeholder="Phone Number:">
                    <label class="error-label" id="phoneNumber-error"></label>
                </div>

                <div class="input-group">
                    <label class="LblPA"> Password:</label>
                    <input type="password" class="CurVal" name="curPasswordInput" id="curPasswordInput" required placeholder="Enter Current Password:">
                    <i class="fa fa-lock"></i>
                    <input type="password" id="newPasswordInput" class="NewVal" name="newPasswordInput" required placeholder="Password:">
                    <label class="error-label" id="password-error"></label>
                </div>
                <div class="input-group">
                    <label class="LblPA"> Account Type:</label>
                    <input type="text" class="CurVal" id="curAcc" disabled required placeholder="Current Account Type Val:">
                    <label class="error-label" id="type-error"></label>
                </div>
                <button class="btn btnSignUp" type="button" id="btnSave">Save</button>
                <input type="hidden" name="csrf_token" value="<?php echo htmlspecialchars($csrf_token); ?>">
            </form>
            <button class="btn btnSignUp" type="button" id="btnLogout">Log Out</button>
            <button class="btn btnSignUp" type="button" id="btnDeleteAccount">Delete Account</button>
            <h4 id="expDisplay">Experience: </h4>
            <h4 id="lvlDisplay">Level: </h4>
            <button class="btn btnSignUp" type="button" id="btnExpHelp">Experience Info</button>

            <div id="expHelpModal" style="display: none; position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgba(0,0,0,0.7);">
                <div style="background-color: #1a1a1a; margin: 10% auto; padding: 30px; border: 1px solid #ff523b; border-radius: 15px; width: 80%; max-width: 600px; box-shadow: 0 5px 15px rgba(0,0,0,0.5); text-align: center; color: white;">
                    <span class="close-button" id="closeExpHelpModal" style="color: #aaa; float: right; font-size: 28px; font-weight: bold; cursor: pointer;">&times;</span>
                    <h2 style="color: #ff523b; margin-bottom: 20px;">Experience & Level System</h2>
                    <p style="margin-bottom: 15px;">
                        Welcome to the Compare It loyalty program! Earn experience points (XP) as you interact with the platform.
                    </p>
                    <p style="margin-bottom: 15px;">
                        Your level reflects your engagement and unlocks exclusive benefits and features.
                    </p>
                    <h3 style="color: #ff523b; margin-top: 25px; margin-bottom: 10px;">How to Earn XP:</h3>
                    <ul style="list-style-type: none; padding: 0; margin-bottom: 20px;">
                        <li style="margin-bottom: 8px;"><strong>Making Comparisons:</strong> Earn XP for every comparison made.</li>
                        <li style="margin-bottom: 8px;"><strong>Leaving Reviews:</strong> Share your thoughts on products to gain XP.</li>
                        <li style="margin-bottom: 8px;"><strong>Interactive Games:</strong> Whilst using the platform interactive games will appear in which you can gain experience points!</li>
                        <li style="margin-bottom: 8px;"><strong>Daily Logins:</strong> Consistent visits reward you with bonus XP.</li>
                    </ul>
                    <h3 style="color: #ff523b; margin-top: 25px; margin-bottom: 10px;">Level Tiers:</h3>
                    <ul style="list-style-type: none; padding: 0;">
                        <li style="margin-bottom: 8px;"><strong>Level 0:</strong> 0 - 99 XP (Deal Dabbler)</li>
                        <li style="margin-bottom: 8px;"><strong>Level 1:</strong> 100 - 199 XP (Deal Detective)</li>
                        <li style="margin-bottom: 8px;"><strong>Level 2:</strong> 200 - 299 XP (Savvy Sorter)</li>
                        <li style="margin-bottom: 8px;"><strong>Level 3:</strong> 300+ XP (Elite Evaluator)</li>
                    </ul>
                    <p style="margin-top: 25px; font-style: italic; color: #ccc;">
                        Keep comparing and exploring to reach higher levels and unlock exciting rewards!
                    </p>
                </div>
            </div>


        </div>
    </div>
    <script src="../JS/profile.js"></script>
</body>

</html>

<?php
include 'footer.php';
?>