// Import the central auth instance from our secure init file
import { auth } from './firebase-init.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

// --- DOM Elements ---
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const googleLoginBtn = document.getElementById('google-login-btn');
const formErrorDiv = document.getElementById('form-error');

// --- UI Helper Functions ---

/**
 * Shows an error message in the form's error container.
 * @param {string} message The error message to display.
 */
function showFormError(message) {
  if (formErrorDiv) {
    formErrorDiv.textContent = message;
    formErrorDiv.style.display = 'block'; // Or add a class to make it visible
  }
}

/**
 * Toggles the loading state of a button.
 * @param {HTMLButtonElement} button The button element.
 * @param {boolean} isLoading Whether to show the loading state.
 * @param {string} defaultText The button's default text.
 * @param {string} [loadingText='Loading...'] The button's text during loading.
 */
function setLoadingState(button, isLoading, defaultText, loadingText = 'Loading...') {
  if (button) {
    button.disabled = isLoading;
    button.textContent = isLoading ? loadingText : defaultText;
  }
}

// --- Event Listeners ---

// Handle Email/Password Signup
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const signupButton = signupForm.querySelector('button[type="submit"]');
    const email = signupForm.email.value;
    const password = signupForm.password.value;
    
    setLoadingState(signupButton, true, 'Sign Up', 'Creating Account...');
    showFormError(''); // Clear previous errors

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // On success, Firebase's auth state listener in auth-state.js will handle redirection.
      // For now, we can redirect manually after a success message.
      alert('Account created successfully! You will now be redirected.'); // Use alert only for this temporary success feedback
      window.location.href = 'index.html';
    } catch (error) {
      showFormError(error.message);
    } finally {
      setLoadingState(signupButton, false, 'Sign Up');
    }
  });
}

// Handle Email/Password Login
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const loginButton = loginForm.querySelector('button[type="submit"]');
    const email = loginForm.email.value;
    const password = loginForm.password.value;

    setLoadingState(loginButton, true, 'Login', 'Logging in...');
    showFormError(''); // Clear previous errors

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Success! Redirection will be handled by the auth state listener.
      // If not, you can redirect here.
      window.location.href = 'index.html';
    } catch (error) {
      // Handle specific error codes for better messages
      let friendlyMessage = 'An error occurred. Please try again.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        friendlyMessage = 'Invalid email or password. Please try again.';
      }
      showFormError(friendlyMessage);
    } finally {
      setLoadingState(loginButton, false, 'Login');
    }
  });
}

// Handle Google Sign-In
if (googleLoginBtn) {
  googleLoginBtn.addEventListener('click', async () => {
    const googleProvider = new GoogleAuthProvider();
    setLoadingState(googleLoginBtn, true, 'Sign in with Google', 'Redirecting...');
    showFormError('');

    try {
      await signInWithPopup(auth, googleProvider);
      // Success! Redirection will be handled by the auth state listener.
      window.location.href = 'index.html';
    } catch (error) {
      showFormError('Could not sign in with Google. Please try again.');
    } finally {
      // The page will redirect on success, so this only runs on failure.
      setLoadingState(googleLoginBtn, false, 'Sign in with Google');
    }
  });
}