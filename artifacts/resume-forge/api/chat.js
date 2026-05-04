export default async function handler(req) {
  try {
    const body = await req.json();
    const message = body.message;

    const MODELS = [
      "deepseek/deepseek-chat",
      "meta-llama/llama-3.1-8b-instruct:free",
      "mistralai/mistral-7b-instruct:free",
    ];

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

        return new Response(
          JSON.stringify({
            reply: data.choices?.[0]?.message?.content || "No response",
          }),
          { status: 200 }
        );
      } catch {
        continue;
      }
    }

    return new Response(
      JSON.stringify({ error: "All AI models failed. Try again." }),
      { status: 500 }
    );

  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid request" }),
      { status: 400 }
    );
  }
}
