// pages/api/ai.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { task, input, instructions } = req.body;

    // Hugging Face API endpoint for a text-generation model
    const HF_MODEL = "gpt2"; // or "EleutherAI/gpt-neo-2.7B" for better results
    const HF_TOKEN = process.env.HF_API_KEY; // your Hugging Face free token

    if (!HF_TOKEN) {
      return res.status(500).json({ error: "Hugging Face API key not set" });
    }

    // Send the prompt + instructions to Hugging Face model
    const prompt = `Task: ${task}\nInput: ${input}\nInstructions: ${instructions}\nOutput (JSON only):`;

    const response = await fetch(`https://api-inference.huggingface.co/models/${HF_MODEL}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: prompt }),
    });

    const data = await response.json();

    // Hugging Face sometimes returns an array of generated text
    let resultText = "";
    if (Array.isArray(data)) {
      resultText = data[0]?.generated_text || "";
    } else if (data.generated_text) {
      resultText = data.generated_text;
    } else {
      resultText = JSON.stringify(data);
    }

    res.status(200).json({ result: resultText });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI generation failed" });
  }
}
