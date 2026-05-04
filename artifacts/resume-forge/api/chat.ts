import type { VercelRequest, VercelResponse } from "@vercel/node";

const MODELS = [
  "deepseek/deepseek-chat",
  "meta-llama/llama-3.1-8b-instruct:free",
  "mistralai/mistral-7b-instruct:free",
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { message } = req.body;

    for (const model of MODELS) {
      try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
            messages: [{ role: "user", content: message }],
          }),
        });

        if (!response.ok) continue;

        const data = await response.json();

        return res.status(200).json({
          reply: data.choices?.[0]?.message?.content || "No response",
        });

      } catch (err) {
        continue; // fallback to next model
      }
    }

    return res.status(500).json({
      error: "All AI models failed. Try again later.",
    });

  } catch (err) {
    return res.status(500).json({
      error: "Something went wrong.",
    });
  }
}
