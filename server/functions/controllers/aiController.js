const fetch = require("node-fetch");

exports.explainText = async (req, res) => {
  try {
    const { textToExplain } = req.body;
    if (!textToExplain) {
      return res.status(400).json({ message: "Text to explain is required." });
    }

    const prompt = `
      Explain the following legal text in very simple, easy-to-understand terms, as if you were explaining it to a 10-year-old.
      Legal Text: "${textToExplain}"
      Simple Explanation:
    `;

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      throw new Error("Gemini API key is not configured.");
    }

    const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

    const apiResponse = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });

    if (!apiResponse.ok) {
        const errorBody = await apiResponse.text();
        console.error("(Explain) AI API Error:", errorBody);
        throw new Error("AI service failed to respond.");
    }
    
    const aiResponse = await apiResponse.json();
    const simpleExplanation = aiResponse.candidates[0].content.parts[0].text;

    res.status(200).json({ explanation: simpleExplanation });
  } catch (error) {
    console.error("Error in explainText:", error.message);
    res.status(500).json({ message: "Server error during explanation.", error: error.message });
  }
};
