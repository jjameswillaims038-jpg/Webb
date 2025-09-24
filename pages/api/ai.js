// pages/api/ai.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { task, input, instructions } = req.body;

    const HF_MODEL = "gpt2"; // try "EleutherAI/gpt-neo-2.7B" for better quality
    const HF_TOKEN = process.env.HF_API_KEY;

    if (!HF_TOKEN) {
      return res.status(500).json({ error: "Hugging Face API key not set" });
    }

    const prompt = `Task: ${task}\nInput: ${input}\nInstructions: ${instructions}\nOutput:`;

    const response = await fetch(
      `https://api-inference.huggingface.co/models/${HF_MODEL}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    const data = await response.json();

    let text = "";
    if (Array.isArray(data)) {
      text = data[0]?.generated_text || "";
    } else if (data.generated_text) {
      text = data.generated_text;
    } else {
      text = JSON.stringify(data);
    }

    // Normalize response so frontend always gets { code: "...code..." }
    res.status(200).json({ code: text.trim() });
  } catch (err) {
    console.error("AI error:", err);
    res.status(500).json({ error: "AI generation failed" });
  }
}
