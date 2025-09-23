// /pages/api/ai.js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // 🔑 Set this in .env.local
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { task, input, instructions } = req.body;

    if (!instructions) {
      return res.status(400).json({ error: "Missing instructions" });
    }

    // 🔮 Call GPT
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini", // ⚡ fast + cost-efficient
      messages: [
        {
          role: "system",
          content: "You are a senior web dev assistant. Return only raw JSON or code, no explanations.",
        },
        {
          role: "user",
          content: `Task: ${task || "general"}\nInput: ${input || ""}\nInstructions: ${instructions}`,
        },
      ],
      temperature: 0.7,
    });

    const result = response.choices[0]?.message?.content || "";

    res.status(200).json({ result });
  } catch (err) {
    console.error("AI API error:", err);
    res.status(500).json({ error: err.message || "AI request failed" });
  }
}
