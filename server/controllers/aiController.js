const fetch = require('node-fetch');

// Helper function to sleep for a certain time
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

exports.explainText = async (req, res) => {
  try {
    const { textToExplain } = req.body;
    if (!textToExplain) {
      return res.status(400).json({ message: 'Text to explain is required.' });
    }

    // This prompt is specifically designed to simplify text
    const prompt = `
      Explain the following legal text in very simple, easy-to-understand terms, as if you were explaining it to a 10-year-old.
      
      Legal Text: "${textToExplain}"

      Simple Explanation:
    `;

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API key is not configured.');
    }

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
    
    let aiResponse;
    const maxRetries = 3;

    for (let i = 0; i < maxRetries; i++) {
        const apiResponse = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        if (apiResponse.ok) {
            aiResponse = await apiResponse.json();
            break; // Success, exit the loop
        }

        if (apiResponse.status === 503 && i < maxRetries - 1) {
            console.log(`(Explain) AI model is overloaded. Retrying in ${i + 1} second(s)...`);
            await sleep((i + 1) * 1000);
        } else {
            const errorBody = await apiResponse.text();
            console.error("(Explain) AI API Error:", errorBody);
            throw new Error('AI service failed to respond after retries.');
        }
    }

    if (!aiResponse) {
        throw new Error('AI did not provide a response for the explanation.');
    }

    const simpleExplanation = aiResponse.candidates[0].content.parts[0].text;

    res.status(200).json({ explanation: simpleExplanation });

  } catch (error) {
    console.error("Error in explainText:", error.message);
    res.status(500).json({ message: 'Server error during explanation.', error: error.message });
  }
};