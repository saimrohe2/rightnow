document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Element Selection ---
    const navItems = document.querySelectorAll('.dashboard-nav-item');
    const views = document.querySelectorAll('.dashboard-view');
    // REMOVED: savedResultsContainer = document.getElementById('saved-results-container');
    
    // Modal Elements
    const shareModal = document.getElementById('share-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const copyLinkBtn = document.getElementById('copy-link-btn');

    // Form Elements
    const changePasswordForm = document.getElementById('change-password-form');
    const deleteAccountBtn = document.getElementById('delete-account-btn');

    // --- Tab Switching Logic ---
    navItems.forEach(navItem => {
        navItem.addEventListener('click', (e) => {
            e.preventDefault();

            // Remove active class from all nav items and views
            navItems.forEach(item => item.classList.remove('active'));
            views.forEach(view => view.classList.remove('active'));

            // Add active class to the clicked item and corresponding view
            navItem.classList.add('active');
            const viewId = navItem.dataset.view;
            document.getElementById(viewId)?.classList.add('active');
        });
    });

    // --- Modal Handling ---
    const openShareModal = (shareLink) => {
        const linkInput = document.getElementById('share-link-input');
        linkInput.value = shareLink || "https://yoursite.com/shared/xyz123"; // Use the real link
        shareModal?.classList.remove('hidden');
    };

    const closeShareModal = () => {
        shareModal?.classList.add('hidden');
    };

    // Event listeners to close the modal
    closeModalBtn?.addEventListener('click', closeShareModal);
    shareModal?.addEventListener('click', (e) => {
        // Only close if the click is on the overlay itself, not the content
        if (e.target === shareModal) {
            closeShareModal();
        }
    });

    // Handle copy button click
    copyLinkBtn?.addEventListener('click', () => {
        const linkInput = document.getElementById('share-link-input');
        navigator.clipboard.writeText(linkInput.value).then(() => {
            alert('Link copied to clipboard! ✅'); // A simple confirmation
        });
    });


    // --- Data Loading & Rendering (Removed 'loadMockSavedResults' and related logic) ---

    // --- Event Delegation for Dynamic Content (Removed 'savedResultsContainer' listener) ---
    // The previous listener for savedResultsContainer has been entirely removed.


    // --- Form Handling ---
    changePasswordForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Password change functionality is not yet implemented. 🚧');
        // TODO: Add logic to call your API to change the password
    });

    deleteAccountBtn?.addEventListener('click', () => {
        if (confirm('ARE YOU SURE you want to delete your account? This action is permanent and cannot be undone.')) {
            alert('Account deletion functionality is not yet implemented. 🚧');
            // TODO: Add logic to call your API to delete the user's account
        }
    });


    // --- Initial Load ---
    // No initial load for saved results anymore, as the section is removed.

    // Set initial view to 'settings-view' directly since 'saved-view' is gone
    // This assumes 'settings-view' is now the first (or only) view in the dashboard-nav.
    const initialViewNavItem = document.querySelector('.dashboard-nav-item[data-view="settings-view"]');
    if (initialViewNavItem) {
        initialViewNavItem.classList.add('active');
        const initialView = document.getElementById(initialViewNavItem.dataset.view);
        if (initialView) {
            initialView.classList.add('active');
        }
    }
});