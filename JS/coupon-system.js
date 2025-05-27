window.updateUserLevel = updateUserLevel;
window.checkForLevelUpdates = checkForLevelUpdates;

// Optional: Check for level updates periodically (every 30 seconds)
setInterval(checkForLevelUpdates, 30000);

// coupon-system.js - Level-based coupon modal system (DEBUG VERSION)
// Integrates with existing timer architecture from header.js
function checkForLevelUpdates() {
    const cookieLevel = getCookie('temp_user_level');
    if (cookieLevel !== null) {
        const newLevel = parseInt(cookieLevel);
        if (newLevel !== couponUserLevel) {
            debugLog(`Level change detected via cookie: ${couponUserLevel} → ${newLevel}`);
            updateUserLevel(newLevel);
        }
    }
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) === 0) {
            return c.substring(nameEQ.length, c.length);
        }
    }
    return null;
}

// Coupon configuration - hardcoded coupons by level (0 gets no coupons)
const COUPON_CONFIG = {
    1: [
        {
            code: 'LEVEL1-WELCOME',
            discount: '10% OFF',
            description: 'Welcome to Level 1!',
            expires: '30 days'
        },
        {
            code: 'STARTER5',
            discount: '$5 OFF',
            description: 'Starter Member Bonus',
            expires: '15 days'
        },
        {
            code: 'LEVEL1-BOOST',
            discount: '5% OFF',
            description: 'Level 1 Special Boost',
            expires: '20 days'
        },
        {
            code: 'FIRSTBUY10',
            discount: '$10 OFF',
            description: 'First Purchase Reward',
            expires: '25 days'
        },
        {
            code: 'LEVEL1-SAVE3',
            discount: '$3 OFF',
            description: 'Level 1 Savings Deal',
            expires: '10 days'
        }
    ],
    2: [
        {
            code: 'LEVEL2-BRONZE',
            discount: '15% OFF',
            description: 'Bronze Member Exclusive',
            expires: '45 days'
        },
        {
            code: 'BRONZE20',
            discount: '$20 OFF',
            description: 'Bronze Tier Reward',
            expires: '30 days'
        },
        {
            code: 'BRONZE-BONUS10',
            discount: '$10 OFF',
            description: 'Bronze Level Bonus',
            expires: '20 days'
        },
        {
            code: 'LEVEL2-REWARD',
            discount: '12% OFF',
            description: 'Bronze Loyalty Reward',
            expires: '35 days'
        },
        {
            code: 'SAVE15BRNZ',
            discount: '$15 OFF',
            description: 'Bronze Saver Special',
            expires: '25 days'
        }
    ],
    3: [
        {
            code: 'LEVEL3-GOLD',
            discount: '25% OFF',
            description: 'Gold Member VIP Discount',
            expires: '60 days'
        },
        {
            code: 'PREMIUM50',
            discount: '$50 OFF',
            description: 'Premium Member Bonus',
            expires: '45 days'
        },
        {
            code: 'GOLD-SPECIAL30',
            discount: '$30 OFF',
            description: 'Gold Tier Limited Deal',
            expires: '40 days'
        },
        {
            code: 'LEVEL3-VIP20',
            discount: '20% OFF',
            description: 'VIP Gold Level Discount',
            expires: '50 days'
        },
        {
            code: 'GOLD-SAVE40',
            discount: '$40 OFF',
            description: 'Gold Exclusive Savings',
            expires: '35 days'
        }
    ]
};

// Timer variables for coupon system
let couponTimerTimeoutId;
let couponModalTimeoutId;

// Constants for coupon timer - SHORTENED FOR TESTING
const COUPON_TIMER_DURATION = 10* 60 * 1000; // 10 seconds for testing (was 1 * 60 * 1000)
const COUPON_MODAL_DISPLAY_DURATION = 30 * 1000; // 30 seconds to view coupon

// Local storage key for coupon persistence
const COUPON_STORAGE_KEY = 'couponTimerState';

// State variables for coupon persistence
let couponTimerStartTime = null;
let couponModalEndTime = null;
let currentCouponPhase = null; // 'waiting', 'modal_visible'
let couponUserLevel = 0; // Will be set from PHP (renamed to avoid conflicts)

/**
 * DEBUG: Add console logging wrapper
 */
function debugLog(message, data = null) {
    //console.log(`[COUPON DEBUG] ${message}`, data ? data : '');
}

/**
 * Initialize user level from PHP session
 */
function initializeUserLevel(level) {
    couponUserLevel = parseInt(level);
    debugLog(`User level initialized: ${couponUserLevel}`);
    
    if (couponUserLevel > 0) {
        debugLog('Initializing coupon system...');
        initializeCouponSystem();
    } else {
        debugLog('User level 0 - no coupons available');
    }
}

/**
 * Clear coupon-related timeouts
 */
function clearCouponTimeouts() {
    if (couponTimerTimeoutId) {
        clearTimeout(couponTimerTimeoutId);
        debugLog('Cleared coupon timer timeout');
    }
    if (couponModalTimeoutId) {
        clearTimeout(couponModalTimeoutId);
        debugLog('Cleared coupon modal timeout');
    }
}

/**
 * Save coupon timer state to localStorage
 */
function saveCouponState() {
    try {
        const state = {
            couponTimerStartTime: couponTimerStartTime,
            couponModalEndTime: couponModalEndTime,
            currentCouponPhase: currentCouponPhase,
            userLevel: couponUserLevel
        };
        localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(state));
        debugLog('Coupon state saved', state);
    } catch (e) {
        console.error("Failed to save coupon state:", e);
    }
}

/**
 * Load coupon timer state from localStorage
 */
function loadCouponState() {
    try {
        const storedState = localStorage.getItem(COUPON_STORAGE_KEY);
        if (storedState) {
            const state = JSON.parse(storedState);
            debugLog('Loaded coupon state', state);
            if (state && typeof state.currentCouponPhase === 'string') {
                couponTimerStartTime = state.couponTimerStartTime || null;
                couponModalEndTime = state.couponModalEndTime || null;
                currentCouponPhase = state.currentCouponPhase;
                return state;
            }
        } else {
            debugLog('No stored coupon state found');
        }
    } catch (e) {
        console.error("Failed to load coupon state:", e);
    }
    return null;
}

/**
 * Get available coupons for user level (current + previous levels)
 */
function getAvailableCoupons(level) {
    let availableCoupons = [];
    for (let i = 1; i <= level; i++) {
        if (COUPON_CONFIG[i]) {
            availableCoupons = availableCoupons.concat(COUPON_CONFIG[i]);
        }
    }
    debugLog(`Available coupons for level ${level}:`, availableCoupons);
    return availableCoupons;
}

/**
 * Get random coupon from available coupons
 */
function getRandomCoupon(level) {
    const availableCoupons = getAvailableCoupons(level);
    if (availableCoupons.length === 0) {
        debugLog('No coupons available');
        return null;
    }
    
    const randomIndex = Math.floor(Math.random() * availableCoupons.length);
    const selectedCoupon = availableCoupons[randomIndex];
    debugLog('Selected random coupon:', selectedCoupon);
    return selectedCoupon;
}

/**
 * Create and inject modal styles if not already present
 */
function injectModalStyles() {
    if (document.getElementById('couponModalStyles')) {
        debugLog('Modal styles already injected');
        return;
    }
    
    debugLog('Injecting modal styles');
    const styles = document.createElement('style');
    styles.id = 'couponModalStyles';
    styles.textContent = `
        .coupon-modal {
            display: flex;
            position: fixed;
            z-index: 10000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.6);
            animation: couponFadeIn 0.3s ease-in-out;
            align-items: center;
            justify-content: center;
        }

        .coupon-modal-content {
           background-color: #1a1a1a;
            border-radius: 15px;
            width: 90%;
            max-width: 450px;
            box-shadow: 0 15px 40px rgba(0,0,0,0.8);
            animation: couponSlideIn 0.4s ease-out;
            overflow: hidden;
            position: relative;
            border: 1px solid #333;
        }

        .coupon-modal-header {
            background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%);
            color: white;
            padding: 20px;
            text-align: center;
            position: relative;
        }

        .coupon-modal-header h2 {
            margin: 0;
            font-size: 22px;
            font-weight: bold;
        }

        .coupon-close {
            position: absolute;
            right: 15px;
            top: 15px;
            color: white;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background-color 0.3s;
        }

        .coupon-close:hover {
            background-color: rgba(255,255,255,0.2);
        }

        .coupon-modal-body {
            padding: 30px;
            text-align: center;
        }

        .coupon-level-badge {
            display: inline-block;
            background: #ffc107;
            color: #000;
            padding: 6px 15px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 15px;
        }

        .coupon-discount {
            font-size: 36px;
            font-weight: bold;
            color: white;
            margin: 10px 0;
        }

        .coupon-description {
            font-size: 18px;
            margin: 15px 0;
            color: #666;
        }

        .coupon-code {
            background: rgb(50, 50, 50);
            border: 2px dashed white;
            padding: 15px;
            margin: 20px 0;
            font-family: 'Courier New', monospace;
            font-size: 20px;
            font-weight: bold;
            color: white;
            border-radius: 8px;
            letter-spacing: 1px;
            cursor: pointer;
            transition: background-color 0.3s;
        }

        .coupon-code:hover {
            background-color: #e3f2fd;
        }

        .coupon-copy-btn {
            background: #007bff;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            margin-top: 10px;
            transition: background-color 0.3s;
        }

        .coupon-copy-btn:hover {
            background: #0056b3;
        }

        .coupon-expires {
            font-size: 14px;
            color: #999;
            margin-top: 20px;
        }

        @keyframes couponFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes couponSlideIn {
            from { 
                opacity: 0;
                transform: translateY(-50px) scale(0.9);
            }
            to { 
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }

        @keyframes couponFadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }

        .coupon-modal.closing {
            animation: couponFadeOut 0.3s ease-in-out;
        }
    `;
    document.head.appendChild(styles);
}

/**
 * Create and show coupon modal
 */
function showCouponModal(coupon) {
    if (!coupon) {
        debugLog('Cannot show modal - no coupon provided');
        return;
    }

    debugLog('Showing coupon modal', coupon);

    // Inject styles if not present
    injectModalStyles();

    // Remove existing modal if any
    const existingModal = document.getElementById('couponModal');
    if (existingModal) {
        debugLog('Removing existing modal');
        existingModal.remove();
    }

    // Create modal HTML
    const modalHTML = `
        <div id="couponModal" class="coupon-modal">
            <div class="coupon-modal-content">
                <div class="coupon-modal-header">
                    <span class="coupon-close" onclick="closeCouponModal()">&times;</span>
                    <h2>🎉 Special Coupon for You!</h2>
                </div>
                <div class="coupon-modal-body">
                    <div class="coupon-level-badge">Level ${couponUserLevel} Reward</div>
                    <div class="coupon-discount">${coupon.discount}</div>
                    <div class="coupon-description">${coupon.description}</div>
                    <div class="coupon-code" onclick="copyCouponCode('${coupon.code}')">${coupon.code}</div>
                    <button class="coupon-copy-btn" onclick="copyCouponCode('${coupon.code}')">Copy Code</button>
                    <div class="coupon-expires">Expires in ${coupon.expires}</div>
                </div>
            </div>
        </div>
    `;

    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    debugLog('Modal HTML added to page');

    // Verify modal was added
    const addedModal = document.getElementById('couponModal');
    if (addedModal) {
        debugLog('Modal successfully added to DOM');
    } else {
        debugLog('ERROR: Modal not found in DOM after insertion');
    }

    // Set modal state
    couponModalEndTime = Date.now() + COUPON_MODAL_DISPLAY_DURATION;
    currentCouponPhase = 'modal_visible';
    saveCouponState();

    debugLog(`Modal will auto-close in ${COUPON_MODAL_DISPLAY_DURATION/1000} seconds`);

    // Auto-close modal after 30 seconds
    couponModalTimeoutId = setTimeout(() => {
        debugLog('Auto-closing modal after timeout');
        closeCouponModal();
        startCouponTimer(); // Restart the timer cycle
    }, COUPON_MODAL_DISPLAY_DURATION);
}

/**
 * Close coupon modal
 */
function closeCouponModal() {
    debugLog('Closing coupon modal');
    const modal = document.getElementById('couponModal');
    if (modal) {
        modal.classList.add('closing');
        setTimeout(() => {
            if (modal.parentNode) {
                modal.remove();
                debugLog('Modal removed from DOM');
            }
        }, 300);
    } else {
        debugLog('No modal found to close');
    }
    
    if (couponModalTimeoutId) {
        clearTimeout(couponModalTimeoutId);
        couponModalTimeoutId = null;
    }
    
    // If modal was closed manually, restart timer
    if (currentCouponPhase === 'modal_visible') {
        debugLog('Modal closed manually, restarting timer');
        startCouponTimer();
    }
}

/**
 * Copy coupon code to clipboard
 */
function copyCouponCode(code) {
    debugLog(`Copying coupon code: ${code}`);
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(() => {
            showCopyFeedback();
            debugLog(`Coupon code copied successfully: ${code}`);
        }).catch(err => {
            console.error('Failed to copy coupon code:', err);
            fallbackCopyMethod(code);
        });
    } else {
        fallbackCopyMethod(code);
    }
}

/**
 * Fallback copy method for older browsers
 */
function fallbackCopyMethod(code) {
    debugLog('Using fallback copy method');
    // Create temporary textarea
    const textArea = document.createElement('textarea');
    textArea.value = code;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showCopyFeedback();
        debugLog(`Coupon code copied (fallback): ${code}`);
    } catch (err) {
        console.error('Fallback copy failed:', err);
        alert(`Coupon code: ${code}`);
    }
    
    document.body.removeChild(textArea);
}

/**
 * Show visual feedback when code is copied
 */
function showCopyFeedback() {
    const copyBtn = document.querySelector('.coupon-copy-btn');
    if (copyBtn) {
        const originalText = copyBtn.textContent;
        const originalBg = copyBtn.style.background;
        copyBtn.textContent = 'Copied!';
        copyBtn.style.background = '#28a745';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = originalBg || '#007bff';
        }, 2000);
    }
}

/**
 * Start the coupon timer
 */
function startCouponTimer() {
    debugLog(`Starting coupon timer for ${COUPON_TIMER_DURATION/1000} seconds`);
    clearCouponTimeouts();
    
    couponTimerStartTime = Date.now();
    couponModalEndTime = null;
    currentCouponPhase = 'waiting';
    saveCouponState();
    
    couponTimerTimeoutId = setTimeout(() => {
        debugLog("Coupon timer finished - showing random coupon");
        showRandomCoupon();
    }, COUPON_TIMER_DURATION);
}

/**
 * Show random coupon for current user level
 */
function showRandomCoupon() {
    debugLog('Attempting to show random coupon');
    const coupon = getRandomCoupon(couponUserLevel);
    if (coupon) {
        showCouponModal(coupon);
    } else {
        debugLog('No coupons available for user level:', couponUserLevel);
        // Restart timer even if no coupon available
        startCouponTimer();
    }
}

/**
 * Initialize coupon system - called after user level is set
 */
function initializeCouponSystem() {
    debugLog('=== INITIALIZING COUPON SYSTEM ===');
    
    if (couponUserLevel <= 0) {
        debugLog('Coupon system not initialized - user level 0 or invalid');
        return;
    }

    clearCouponTimeouts();
    
    // Clear any existing state for testing
    localStorage.removeItem(COUPON_STORAGE_KEY);
    debugLog('Cleared existing coupon state for fresh start');
    
    const state = loadCouponState();
    const now = Date.now();
    
    if (state && currentCouponPhase === 'waiting' && couponTimerStartTime !== null) {
        const remainingTime = COUPON_TIMER_DURATION - (now - couponTimerStartTime);
        if (remainingTime > 0) {
            debugLog(`Resuming coupon timer. Remaining: ${Math.round(remainingTime / 1000)}s`);
            couponTimerTimeoutId = setTimeout(() => {
                debugLog("Coupon timer resumed & finished. Showing coupon.");
                showRandomCoupon();
            }, remainingTime);
        } else {
            debugLog("Coupon timer already expired, showing coupon now.");
            showRandomCoupon();
        }
    } else if (state && currentCouponPhase === 'modal_visible' && couponModalEndTime !== null) {
        const remainingModalTime = couponModalEndTime - now;
        if (remainingModalTime > 0) {
            debugLog(`Coupon modal should still be visible. Remaining: ${Math.round(remainingModalTime / 1000)}s`);
            // Don't re-show modal, but set timeout to close it and restart timer
            couponModalTimeoutId = setTimeout(() => {
                closeCouponModal();
                startCouponTimer();
            }, remainingModalTime);
        } else {
            debugLog("Coupon modal time already expired. Starting new timer.");
            startCouponTimer();
        }
    } else {
        // No saved state or invalid state, start fresh
        debugLog("Starting new coupon timer");
        startCouponTimer();
    }
    
    debugLog('=== INITIALIZATION COMPLETE ===');
}

// DEBUG: Add manual trigger function for testing
function triggerCouponNow() {
    debugLog('Manual coupon trigger activated');
    showRandomCoupon();
}

function updateUserLevel(newLevel) {
    const oldLevel = couponUserLevel;
    couponUserLevel = parseInt(newLevel);
    debugLog(`User level updated from ${oldLevel} to ${couponUserLevel}`);
    
    // If level increased and system wasn't running, start it
    if (couponUserLevel > 0 && oldLevel === 0) {
        debugLog('User level increased from 0 - starting coupon system');
        initializeCouponSystem();
    }
    
    // Save updated state
    saveCouponState();
}

// Make functions available globally for onclick handlers
window.closeCouponModal = closeCouponModal;
window.copyCouponCode = copyCouponCode;
window.triggerCouponNow = triggerCouponNow; // For testing

// Expose main initialization function
window.initializeUserLevel = initializeUserLevel;