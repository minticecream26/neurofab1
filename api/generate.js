// File: /api/generate.js
import { NextResponse } from "next/server";

// Use environment variable for Gemini API key
const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("GEMINI_API_KEY is not set in environment variables");
}

export async function POST(req) {
  try {
    const { prompt, speed, skipCAD } = await req.json();

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json({ error: "Prompt is empty" }, { status: 400 });
    }

    // Gemini API URL for text generation
    const url = "https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generate";

    // Prepare request body
    const body = {
      prompt: {
        text: prompt
      },
      // You can adjust these parameters if needed
      temperature: 0.7,
      candidateCount: 1,
      maxOutputTokens: 1024
    };

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Gemini API error:", text);
      return NextResponse.json({ error: "Gemini API request failed", details: text }, { status: res.status });
    }

    const data = await res.json();
    // Gemini returns content under data.candidates[0].content
    const generatedText = data?.candidates?.[0]?.content || "";

    // Optionally split into sections if you want
    const response = {
      id: Date.now(),
      projectName: "Generated Project",
      plan: generatedText,
      bom: "",      // leave blank for now or parse if you structure prompts
      code: "",
      cad: skipCAD ? "" : "",
      assembly: "",
      tips: ""
    };

    return NextResponse.json(response);

  } catch (err) {
    console.error("Error in /api/generate:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

