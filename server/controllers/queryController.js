const Scenario = require('../models/Scenario');
const fetch = require('node-fetch');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

exports.findScenario = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: 'A message is required.' });
    }

    // --- 1. Keyword Search (Kept your original commented-out code) ---
    /*
    const stopWords = new Set(['i', 'me', 'my', 'a', 'an', 'the', 'in', 'is', 'it', 'of', 'for', 'to']);
    const userKeywords = message.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(word => !stopWords.has(word) && word.length > 2);

    if (userKeywords.length > 0) {
      const potentialMatches = await Scenario.find({ keywords: { $in: userKeywords } });
      // ... (Add your relevance logic here if needed) ...
    }
    */

    // --- 2. AI Query ---
    console.log("Querying AI...");
    const prompt = `
      Analyze the user's situation in India and respond as a raw JSON object with keys: "rights_text", "law_reference", "script".
      - "rights_text": Explain the user's main legal right.
      - "law_reference": State the specific Indian law or IPC section.
      - "script": Provide a polite statement the user can say. IMPORTANT: End this script with the disclaimer: "(Note: This information is for guidance and not a substitute for professional legal advice.)"
      User's situation: "${message}"
      JSON Response:
    `;
    
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API key is not configured.');
    }
    
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
    
    const apiResponse = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        // *** THIS IS THE FIX: Adding safety settings to prevent blocking ***
        safetySettings: [
            {
                "category": "HARM_CATEGORY_HARASSMENT",
                "threshold": "BLOCK_NONE"
            },
            {
                "category": "HARM_CATEGORY_HATE_SPEECH",
                "threshold": "BLOCK_NONE"
            },
            {
                "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                "threshold": "BLOCK_NONE"
            },
            {
                "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                "threshold": "BLOCK_NONE"
            }
        ]
      })
    });

    if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        console.error("Gemini API Error Response:", errorText);
        throw new Error(`Gemini API responded with status: ${apiResponse.status}`);
    }

    const aiResponse = await apiResponse.json();

    if (!aiResponse.candidates || aiResponse.candidates.length === 0 || !aiResponse.candidates[0].content) {
        console.error("Gemini Response Blocked or Invalid:", JSON.stringify(aiResponse, null, 2));
        throw new Error('AI response was blocked or empty, likely due to safety filters.');
    }

    const aiText = aiResponse.candidates[0].content.parts[0].text;
    
    // Clean the text just in case the AI adds markdown
    const cleanedText = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedJson = JSON.parse(cleanedText);

    // --- 3. Save to DB ---
    const newScenario = new Scenario({
      title: message,
      // keywords: userKeywords, // Add back if you use the keyword feature
      rights_text: parsedJson.rights_text,
      law_reference: parsedJson.law_reference,
      script: parsedJson.script
    });
    
    await newScenario.save();

    res.status(200).json(parsedJson);

  } catch (error) {
    console.error("!!! FATAL ERROR in findScenario:", error); 
    res.status(500).json({ message: 'A server error occurred. Please try again.' });
  }
};