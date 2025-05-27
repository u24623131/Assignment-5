// Get reference to the action button DOM element
const actionButton = document.getElementById('actionButton');

// Variables to manage timer state
let primaryTimerTimeoutId; // ID for the 5-minute timer timeout
let randomDelayTimeoutId; // ID for the random delay timeout
let buttonVisibilityTimeoutId; // ID for the 30-second button visibility timeout

// Constants for timer durations in milliseconds
const PRIMARY_TIMER_DURATION = 5 * 60 * 1000; // 5 minutes
const MAX_RANDOM_DELAY = 1 * 60 * 1000; // 1 minute
const BUTTON_VISIBILITY_DURATION = 30 * 1000; // 30 seconds

// Local storage key for persistence
const LOCAL_STORAGE_KEY = 'randomButtonTimerState';

// State variables for persistence
let primaryTimerStartTime = null; // Timestamp when primary timer began
let randomDelayTriggerTime = null; // Timestamp when random delay should finish
let buttonDisplayFinishTime = null; // Timestamp when button display should finish
let currentTimerPhase = null; // 'primary', 'random_delay', 'button_visible'

/**
 * Clears all active JavaScript timers to prevent conflicts or memory leaks.
 */
function clearAllTimeouts() {
    if (primaryTimerTimeoutId) clearTimeout(primaryTimerTimeoutId);
    if (randomDelayTimeoutId) clearTimeout(randomDelayTimeoutId);
    if (buttonVisibilityTimeoutId) clearTimeout(buttonVisibilityTimeoutId);
}

/**
 * Saves the current timer state to localStorage.
 */
function saveTimerState() {
    try {
        const state = {
            primaryTimerStartTime: primaryTimerStartTime,
            randomDelayTriggerTime: randomDelayTriggerTime,
            buttonDisplayFinishTime: buttonDisplayFinishTime,
            currentTimerPhase: currentTimerPhase
        };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
        // console.log("Timer state saved:", state);
    } catch (e) {
        console.error("Failed to save timer state to localStorage:", e);
    }
}

/**
 * Loads the timer state from localStorage.
 * @returns {object|null} The loaded state or null if not found/error.
 */
function loadTimerState() {
    try {
        const storedState = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedState) {
            const state = JSON.parse(storedState);
            // Basic validation
            if (state && typeof state.currentTimerPhase === 'string') {
                primaryTimerStartTime = state.primaryTimerStartTime || null;
                randomDelayTriggerTime = state.randomDelayTriggerTime || null;
                buttonDisplayFinishTime = state.buttonDisplayFinishTime || null;
                currentTimerPhase = state.currentTimerPhase;
                // console.log("Timer state loaded:", state);
                return state;
            }
        }
    } catch (e) {
        console.error("Failed to load timer state from localStorage:", e);
    }
    return null;
}

/**
 * Clears the timer state from localStorage.
 */
function clearTimerState() {
    try {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        // console.log("Timer state cleared from localStorage.");
    } catch (e) {
        console.error("Failed to clear timer state from localStorage:", e);
    }
}

/**
 * Initiates the primary 5-minute timer.
 * This timer runs in the background.
 */
function startPrimaryTimer() {
    clearAllTimeouts(); // Clear any existing timers before starting new ones
    hideButton(); // Ensure button is hidden when starting

    primaryTimerStartTime = Date.now();
    randomDelayTriggerTime = null; // Clear previous phase times
    buttonDisplayFinishTime = null;
    currentTimerPhase = 'primary';
    saveTimerState();

    console.log("Primary timer started. Next event in 5 minutes (persisted).");

    primaryTimerTimeoutId = setTimeout(() => {
        console.log("Primary timer finished. Triggering random event (persisted).");
        triggerRandomEvent();
    }, PRIMARY_TIMER_DURATION);
}

/**
 * Triggers a random delay after the primary timer completes, then shows the button.
 */
function triggerRandomEvent() {
    clearAllTimeouts(); // Clear any existing timeouts for this phase

    const randomDelay = Math.random() * MAX_RANDOM_DELAY; // Generate a random delay
    randomDelayTriggerTime = Date.now() + randomDelay;
    currentTimerPhase = 'random_delay';
    saveTimerState();

    console.log(`Random delay of ${randomDelay / 1000} seconds before button appears (persisted).`);

    randomDelayTimeoutId = setTimeout(() => {
        console.log("Random delay finished. Showing button (persisted).");
        showButton();
    }, randomDelay);
}

/**
 * Displays the action button at a random position on the screen.
 * Sets a timeout for the button to disappear after 30 seconds.
 */
function showButton() {
    clearAllTimeouts(); // Clear any existing timeouts for this phase

    // Calculate random position within the viewport, ensuring button is fully visible
    const buttonWidth = actionButton.offsetWidth;
    const buttonHeight = actionButton.offsetHeight;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const maxX = viewportWidth - buttonWidth;
    const maxY = viewportHeight - buttonHeight;

    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;

    actionButton.style.left = `${randomX}px`;
    actionButton.style.top = `${randomY}px`;

    actionButton.classList.add('visible');

    buttonDisplayFinishTime = Date.now() + BUTTON_VISIBILITY_DURATION;
    currentTimerPhase = 'button_visible';
    saveTimerState();

    console.log("Button is now visible. It will disappear in 30 seconds (persisted).");

    buttonVisibilityTimeoutId = setTimeout(handleButtonTimeout, BUTTON_VISIBILITY_DURATION);
}

/**
 * Handles the event when the button's visibility time elapses.
 */
function handleButtonTimeout() {
    console.log("Button visibility time elapsed. Restarting timer (persisted).");
    hideButton();
    startPrimaryTimer(); // Restart the entire process
}

/**
 * Hides the action button.
 */
function hideButton() {
    actionButton.classList.remove('visible');
    if (buttonVisibilityTimeoutId) {
        clearTimeout(buttonVisibilityTimeoutId);
        buttonVisibilityTimeoutId = null;
    }
    // console.log("Button hidden.");
    // We don't clear state here directly as it's either transitioning to primary or restarting
}

// Event listener for the action button click
actionButton.addEventListener('click', () => {
    console.log("Button clicked! Restarting timer (persisted).");
    hideButton(); // Hide the button immediately
    makeApiCall(); // Call your API function here
    startPrimaryTimer(); // Restart the entire process
});

/**
 * Main initialization function on page load.
 * Attempts to load previous state and resume, otherwise starts a new timer.
 */
function initializeTimer() {
    clearAllTimeouts(); // Ensure no previous timeouts are running on page load
    hideButton(); // Ensure button is hidden initially

    loadTimerState(); // Load state into global variables

    const now = Date.now();

    if (currentTimerPhase === 'primary' && primaryTimerStartTime !== null) {
        const remainingTime = PRIMARY_TIMER_DURATION - (now - primaryTimerStartTime);
        if (remainingTime > 0) {
            console.log(`Resuming primary timer. Remaining: ${remainingTime / 1000}s`);
            primaryTimerTimeoutId = setTimeout(() => {
                console.log("Primary timer resumed & finished. Triggering random event.");
                triggerRandomEvent();
            }, remainingTime);
        } else {
            console.log("Primary timer already expired, moving to random event phase.");
            triggerRandomEvent();
        }
    } else if (currentTimerPhase === 'random_delay' && randomDelayTriggerTime !== null) {
        const remainingDelay = randomDelayTriggerTime - now;
        if (remainingDelay > 0) {
            console.log(`Resuming random delay. Remaining: ${remainingDelay / 1000}s`);
            randomDelayTimeoutId = setTimeout(() => {
                console.log("Random delay resumed & finished. Showing button.");
                showButton();
            }, remainingDelay);
        } else {
            console.log("Random delay already expired, moving to button visible phase.");
            showButton();
        }
    } else if (currentTimerPhase === 'button_visible' && buttonDisplayFinishTime !== null) {
        const remainingVisibility = buttonDisplayFinishTime - now;
        if (remainingVisibility > 0) {
            console.log(`Resuming button visibility. Remaining: ${remainingVisibility / 1000}s`);
            showButton(); // Make button visible and positioned
            buttonVisibilityTimeoutId = setTimeout(handleButtonTimeout, remainingVisibility);
        } else {
            console.log("Button visibility already expired. Restarting timer.");
            handleButtonTimeout(); // This will hide button and start primary timer
        }
    } else {
        // No saved state or state is invalid/completed, start fresh
        console.log("No valid timer state found. Starting new primary timer.");
        startPrimaryTimer();
    }
}

// Initialize the timer when the page loads
window.addEventListener('load', initializeTimer);

// Optional: Handle window resize to ensure button stays within bounds if visible
window.addEventListener('resize', () => {
    if (actionButton.classList.contains('visible')) {
        showButton(); // Re-position the button if it's currently visible
    }
});

function makeApiCall() {
    fetch('../api.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken // Include the CSRF token in a custom header
        },
        body: JSON.stringify({
            type: "AddUserXP",
            apikey: apiKey,
            xp: 5
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                console.log("+5xp")
                if (window.location.pathname.includes('profile.php')) {
                    window.location.reload();
                }
            } else {
                console.error("Failed to add user experience:", data.data);
            }
        })
        .catch(error => {
            console.error("Network error adding user experience:", error);
        });
}