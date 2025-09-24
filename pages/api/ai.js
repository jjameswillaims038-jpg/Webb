// pages/api/ai.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { task, input, instructions } = req.body;

    const HF_MODEL = "tiiuae/falcon-7b-instruct"; // better model than gpt2
    const HF_TOKEN = process.env.HF_API_KEY;

    if (!HF_TOKEN) {
      return res.status(500).json({ error: "Hugging Face API key not set" });
    }

    // Build the prompt to "force" structured output
    const prompt = `
Task: ${task}
Input: ${input}
Instructions: ${instructions}

Respond ONLY in JSON with keys: "html", "css", "js".
Example:
{
  "html": "<h1>Hello</h1>",
  "css": "body{color:red}",
  "js": "console.log('hi')"
}
`;

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

    let resultText = "";
    if (Array.isArray(data)) {
      resultText = data[0]?.generated_text || "";
    } else if (data.generated_text) {
      resultText = data.generated_text;
    } else {
      resultText = JSON.stringify(data);
    }

    // Try to extract JSON safely
    let jsonMatch = resultText.match(/\{[\s\S]*\}/);
    let cleanResult = {};

    if (jsonMatch) {
      try {
        cleanResult = JSON.parse(jsonMatch[0]);
      } catch (e) {
        console.error("JSON parse error:", e);
        cleanResult = {
          html: `<h1>⚠️ AI Error</h1><p>Could not parse response.</p>`,
          css: "body{font-family:sans-serif;color:red}",
          js: "",
        };
      }
    } else {
      cleanResult = {
        html: `<pre>${resultText}</pre>`,
        css: "body{font-family:monospace;color:#0f0}",
        js: "",
      };
    }

    res.status(200).json(cleanResult);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI generation failed" });
  }
}
