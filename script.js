document.addEventListener('DOMContentLoaded', () => {
    // 1. Configuration & Constants
    const config = {
        API_BASE_URL: 'http://localhost:5000/api',
    };

    const constants = {
        BUTTON_TEXT: {
            DEFAULT: 'Find My Rights',
            LOADING: 'Searching...',
            EXPLAIN_DEFAULT: 'Explain Simply',
            EXPLAIN_LOADING: 'Thinking...'
        }
    };

    // 2. DOM Element Selection
    const elements = {
        homeView: document.getElementById('home-view'),
        resultsView: document.getElementById('results-view'),
        queryInput: document.getElementById('query-input'),
        submitBtn: document.getElementById('submit-btn'),
        backBtn: document.getElementById('back-btn'),
        resultsContent: document.getElementById('results-content'),
        menuToggleBtn: document.getElementById('menu-toggle-btn'),
        body: document.body,
        overlay: document.querySelector('.overlay'),
        animatedHeadline: document.getElementById('headline-animated'),
        micBtn: document.getElementById('mic-btn'),
        
        // New: Contact Form elements
        contactForm: document.getElementById('contact-form-id'), // Assuming your contact form has this ID
    };

    // 3. API Communication
    async function apiPost(endpoint, body) {
        try {
            const response = await fetch(`${config.API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || `HTTP error! Status: ${response.status}`);
            }
            return { success: true, data };
        } catch (error) {
            console.error(`API Error on ${endpoint}:`, error);
            return { success: false, message: error.message };
        }
    }

    // 4. UI & Core Functions
    function runTypingAnimation() {
        if (!elements.animatedHeadline) return;
        const text = "Illuminated.";
        elements.animatedHeadline.textContent = '';
        let i = 0;
        const type = () => {
            if (i < text.length) {
                elements.animatedHeadline.textContent += text.charAt(i);
                i++;
                setTimeout(type, 100);
            }
        };
        type();
    }

    function switchView(viewToShow) {
        elements.homeView.classList.remove('active');
        elements.resultsView.classList.add('hidden');
        if (viewToShow === 'results') {
            elements.resultsView.classList.remove('hidden');
            elements.resultsView.classList.add('active');
        } else {
            elements.homeView.classList.add('active');
            elements.resultsView.classList.remove('active');
            elements.resultsView.classList.add('hidden');
        }
    }

    function renderResults(data) {
        if (!elements.resultsContent) return;
        elements.resultsContent.innerHTML = '';
        const scenarioData = [
            { icon: '🛡️', heading: 'Your Rights', text: data.rights_text },
            { icon: '⚖️', heading: 'The Law', text: data.law_reference, explainable: true },
            { icon: '➡️', heading: 'Your Next Step', text: data.script },
        ];
        scenarioData.forEach(item => {
            if (!item.text) return;
            const itemWrapper = document.createElement('div');
            itemWrapper.className = 'result-item';
            const h3 = document.createElement('h3');
            h3.innerHTML = `<span class="icon">${item.icon}</span> ${item.heading}`;
            const p = document.createElement('p');
            p.textContent = item.text;
            itemWrapper.append(h3, p);
            if (item.explainable) {
                const explainBtn = document.createElement('button');
                explainBtn.className = 'explain-btn';
                explainBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.5A4.5 4.5 0 0 0 17.5 5c-1.5 0-2.75 1.06-4 1.06-3 0-6-8-6-12.5A4.5 4.5 0 0 0 3.5 5c-1.5 0-2.75 1.06-4 1.06-3 0-6-8-6-12.5"/></svg> <span>${constants.BUTTON_TEXT.EXPLAIN_DEFAULT}</span>`;
                explainBtn.dataset.text = `${item.heading}: ${item.text}`;
                itemWrapper.appendChild(explainBtn);
            }
            elements.resultsContent.appendChild(itemWrapper);
        });

        const resultActions = document.createElement('div');
        resultActions.className = 'result-actions';
        resultActions.innerHTML = `
            <button id="download-result-btn" class="action-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                <span>Download</span>
            </button>
            <button id="share-result-btn" class="action-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                <span>Share</span>
            </button>
        `;
        elements.resultsContent.appendChild(resultActions);
    }

    function renderError(message) {
        if (!elements.resultsContent) return;
        elements.resultsContent.innerHTML = '';
        const errorWrapper = document.createElement('div');
        errorWrapper.className = 'result-item';
        const h3 = document.createElement('h3');
        const p = document.createElement('p');
        h3.textContent = '⚠️ An Error Occurred';
        p.textContent = message;
        errorWrapper.append(h3, p);
        elements.resultsContent.appendChild(errorWrapper);
    }
    
    // 5. Event Handlers (for index.html functionality)
    const handleSubmit = async (event) => {
        event.preventDefault();
        const query = elements.queryInput.value.trim();
        if (!query) {
            elements.queryInput.focus();
            return;
        }
        elements.submitBtn.textContent = constants.BUTTON_TEXT.LOADING;
        elements.submitBtn.disabled = true;
        try {
            const result = await apiPost('/query', { message: query });
            if (result.success) {
                renderResults(result.data);
            } else {
                renderError(result.message);
            }
            switchView('results');
        } catch (error) {
            console.error('Submit Error:', error);
            renderError('A network error occurred. Please try again.');
            switchView('results');
        } finally {
            elements.submitBtn.textContent = constants.BUTTON_TEXT.DEFAULT;
            elements.submitBtn.disabled = false;
        }
    };

    const handleBack = () => {
        elements.queryInput.value = '';
        switchView('home');
    };

    const handleMenuToggle = () => {
        const isExpanded = elements.menuToggleBtn.getAttribute('aria-expanded') === 'true';
        elements.menuToggleBtn.setAttribute('aria-expanded', String(!isExpanded));
        elements.body.classList.toggle('menu-open');
    };

    const handleDownloadResult = () => {
        const downloadBtn = document.getElementById('download-result-btn');
        const resultsContainer = document.getElementById('results-content');
        if (downloadBtn) downloadBtn.querySelector('span').textContent = 'Downloading...';
        if (typeof window.jspdf === 'undefined' || typeof window.jspdf.jsPDF === 'undefined') {
            console.error("jsPDF library is not loaded.");
            alert("Could not start download. Please try again later.");
            if (downloadBtn) downloadBtn.querySelector('span').textContent = 'Download';
            return;
        }
        if (!resultsContainer) {
            console.error("Results container not found.");
            if (downloadBtn) downloadBtn.querySelector('span').textContent = 'Download';
            return;
        }
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        try {
            doc.html(resultsContainer, {
                callback: function (doc) {
                    doc.save('RightNow-Results.pdf');
                },
                x: 15,
                y: 15,
                width: 170,
                windowWidth: 650
            });
        } catch (error) {
            console.error("PDF Generation Error:", error);
            alert("Sorry, an error occurred while creating the PDF.");
        } finally {
            if (downloadBtn) downloadBtn.querySelector('span').textContent = 'Download';
        }
    };
    
    const handleShareResult = async () => {
        const resultsContainer = document.getElementById('results-content');
        const textToShare = resultsContainer?.innerText;

        // Check if the Web Share API is available in the browser
        if (navigator.share && textToShare) {
            try {
                await navigator.share({
                    title: 'My Legal Rights Summary',
                    text: `Here is the summary of my rights from RightNow:\n\n${textToShare}`,
                });
                console.log('Content shared successfully!');
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            // Fallback for browsers that do not support it (or if there's no text)
            alert('Web Share is not supported by your browser, or there is no content to share.');
        }
    };

    const handleResultsClick = async (e) => {
        const explainBtn = e.target.closest('.explain-btn');
        const downloadBtn = e.target.closest('#download-result-btn');
        const shareBtn = e.target.closest('#share-result-btn');

        if (explainBtn) {
            if (explainBtn.disabled) return;
            const textToExplain = explainBtn.dataset.text;
            explainBtn.querySelector('span').textContent = constants.BUTTON_TEXT.EXPLAIN_LOADING;
            explainBtn.disabled = true;
            const result = await apiPost('/ai/explain', { textToExplain });
            const itemWrapper = explainBtn.parentElement;
            explainBtn.remove();
            if (result.success) {
                const explanationBox = document.createElement('div');
                explanationBox.className = 'explanation-box';
                explanationBox.textContent = result.data.explanation;
                itemWrapper.appendChild(explanationBox);
            } else {
                alert('Sorry, the AI could not provide an explanation at this time.');
            }
        } else if (downloadBtn) {
            handleDownloadResult();
        } else if (shareBtn) {
            handleShareResult();
        }
    };

    // 6. Voice Recognition
    function setupVoiceRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            elements.micBtn?.classList.add('hidden');
            console.log("Speech Recognition not supported by this browser.");
            return;
        }
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'en-IN';
        recognition.interimResults = false;
        recognition.onresult = (event) => {
            elements.queryInput.value = event.results[0][0].transcript;
            handleSubmit(new Event('submit'));
        };
        recognition.onerror = (event) => console.error('Speech recognition error:', event.error);
        recognition.onstart = () => elements.micBtn.classList.add('is-listening');
        recognition.onend = () => elements.micBtn.classList.remove('is-listening');
        elements.micBtn.addEventListener('click', () => {
            try {
                recognition.start();
            } catch (e) {
                console.error("Recognition could not be started:", e);
            }
        });
    }

    // 7. EmailJS Contact Form Handling (New Section)
    if (elements.contactForm) {
        elements.contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent default form submission (page reload)

            const submitButton = this.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            // Your EmailJS IDs
            const serviceID = 'service_kcr3th7';   // Your Service ID
            const templateID = 'template_a7z8mpk'; // Your Template ID

            emailjs.sendForm(serviceID, templateID, this)
                .then(() => {
                    alert('Message sent successfully! Thank you for contacting us. ✅');
                    elements.contactForm.reset(); // Clear the form fields
                }, (error) => {
                    console.error('FAILED to send message:', error);
                    alert('Failed to send message. Please try again later. ❌');
                })
                .finally(() => {
                    submitButton.textContent = originalButtonText;
                    submitButton.disabled = false;
                });
        });
    }

    // 8. Initialization
    function init() {
        // Event Listeners for index.html related functionalities
        elements.submitBtn?.addEventListener('click', handleSubmit);
        elements.backBtn?.addEventListener('click', handleBack);
        elements.menuToggleBtn?.addEventListener('click', handleMenuToggle);
        elements.overlay?.addEventListener('click', handleMenuToggle);
        elements.resultsContent?.addEventListener('click', handleResultsClick);
        
        runTypingAnimation();
        setupVoiceRecognition();
    }

    init();
});