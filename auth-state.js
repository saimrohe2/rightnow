// Import the central auth instance and necessary functions
import { auth } from './firebase-init.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

// --- DOM Elements ---
const loggedInView = document.getElementById('logged-in-view');
const loggedOutView = document.getElementById('logged-out-view');
const profileBtn = document.getElementById('profile-btn');
const profileDropdown = document.getElementById('profile-dropdown');
const logoutBtn = document.getElementById('logout-btn');
const userEmailEl = document.getElementById('user-email');

/**
 * Toggles the visibility of UI elements based on user's login state.
 * @param {boolean} isSignedIn - True if the user is logged in.
 */
function updateUserUI(isSignedIn) {
  // Use classList to toggle visibility, keeping styles in CSS.
  // The second argument of toggle forces the class to be added (true) or removed (false).
  loggedInView?.classList.toggle('hidden', !isSignedIn);
  loggedOutView?.classList.toggle('hidden', isSignedIn);
}

// --- Firebase Auth State Listener ---
// This function runs whenever the user's login state changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    updateUserUI(true);
    if (userEmailEl) {
      userEmailEl.textContent = user.email;
    }
  } else {
    // User is signed out
    updateUserUI(false);
  }
});

// --- Event Listeners ---

// Handle Logout
if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    try {
      await signOut(auth);
      // No alert needed. Redirecting is enough feedback.
      window.location.href = 'login.html';
    } catch (error) {
      console.error('Logout Error:', error);
      // Optionally, show an error message to the user in a less intrusive way
    }
  });
}

// Handle Profile Dropdown Toggle
if (profileBtn && profileDropdown) {
  profileBtn.addEventListener('click', (e) => {
    // Stop the click from bubbling up to the window listener and closing the menu immediately
    e.stopPropagation();
    const isVisible = profileDropdown.classList.toggle('show');
    profileBtn.classList.toggle('active', isVisible); // For styling the button when dropdown is open
  });
}

// Close the dropdown if the user clicks anywhere outside of it
window.addEventListener('click', () => {
  if (profileDropdown?.classList.contains('show')) {
    profileDropdown.classList.remove('show');
    profileBtn?.classList.remove('active');
  }
});

// Prevent the dropdown from closing when clicking inside it
if (profileDropdown) {
    profileDropdown.addEventListener('click', (e) => e.stopPropagation());
}