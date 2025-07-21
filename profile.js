import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDtUXBJPq_MPTepf3iIHjVtVHg1Y56P1jk",
  authDomain: "rightnow-app-4e5bd.firebaseapp.com",
  projectId: "rightnow-app-4e5bd",
  storageBucket: "rightnow-app-4e5bd.appspot.com",
  messagingSenderId: "60805459677",
  appId: "1:60805459677:web:0e63876925fca489e6f534",
  measurementId: "G-N9R2R0BMZR"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// DOM Elements
const profileEmailEl = document.getElementById('profile-email');
const profileStatusEl = document.getElementById('profile-status');
const savedRightsContainer = document.getElementById('saved-rights-container');

onAuthStateChanged(auth, async (user) => {
  if (user) {
    // User is signed in, fetch their data
    profileEmailEl.textContent = user.email;
    
    try {
      const token = await user.getIdToken();
      
      // Fetch subscription status
      const statusResponse = await fetch('http://localhost:5000/api/user/status', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const statusData = await statusResponse.json();
      updateSubscriptionStatus(statusData.subscriptionStatus);

      // Fetch saved rights
      const rightsResponse = await fetch('http://localhost:5000/api/user/saved-rights', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const savedRights = await rightsResponse.json();
      displaySavedRights(savedRights);

    } catch (error) {
      console.error("Error fetching user data:", error);
      savedRightsContainer.innerHTML = '<p class="empty-state">Could not load your saved rights.</p>';
    }

  } else {
    // User is not signed in, redirect to login
    window.location.href = 'login.html';
  }
});

function updateSubscriptionStatus(status) {
  profileStatusEl.textContent = status.charAt(0).toUpperCase() + status.slice(1);
  profileStatusEl.className = `status-badge ${status}`;
}

function displaySavedRights(rights) {
  savedRightsContainer.innerHTML = ''; // Clear loading text
  if (rights.length === 0) {
    savedRightsContainer.innerHTML = '<p class="empty-state">You have not saved any rights yet.</p>';
    return;
  }

  rights.forEach(item => {
    const scenario = item.scenarioId;
    if (scenario) {
      const card = document.createElement('a');
      card.href = `index.html?query=${encodeURIComponent(scenario.title)}`; // Link back to the search
      card.className = 'saved-right-card';
      card.innerHTML = `
        <h3>${scenario.title}</h3>
        <p>${scenario.rights_text}</p>
      `;
      savedRightsContainer.appendChild(card);
    }
  });
}
