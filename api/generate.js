// /api/generate.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { prompt } = req.body;

    if (!prompt || prompt.trim().length === 0) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing GEMINI_API_KEY environment variable" });
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: { text: prompt },
          temperature: 0.7,
          candidate_count: 1,
        }),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: `Gemini API error: ${text}` });
    }

    const data = await response.json();

    // Extract text from response
    const outputText =
      data?.candidates?.[0]?.output?.[0]?.content?.[0]?.text ||
      "No content returned from Gemini";

    res.status(200).json({ text: outputText });
  } catch (err) {
    console.error("Generation error:", err);
    res.status(500).json({ error: "Server error" });
  }
}

