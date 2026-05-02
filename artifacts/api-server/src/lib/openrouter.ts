const API_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "deepseek/deepseek-chat";

const MAX_RESUME_CHARS = 2500;
const MAX_JD_CHARS = 1000;

const MAX_RETRIES = 2;
const RETRY_DELAYS_MS = [8000, 20000];

function getApiKey(): string {
  const key = process.env["OPENROUTER_API_KEY"];
  if (!key) throw new Error("OPENROUTER_API_KEY environment variable is not set.");
  return key;
}

function isRateLimit(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  const m = err.message.toLowerCase();
  return (
    m.includes("429") ||
    m.includes("quota") ||
    m.includes("rate limit") ||
    m.includes("too many requests") ||
    m.includes("resource_exhausted")
  );
}

function trim(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars) + "\n[truncated for length]";
}

interface OpenRouterMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface OpenRouterResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message?: string;
    code?: number;
  };
}

async function generate(messages: OpenRouterMessage[]): Promise<string> {
  const apiKey = getApiKey();
  let lastErr: unknown;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    let res: Response;
    try {
      res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://resumeforge.app",
          "X-Title": "ResumeForge AI",
        },
        body: JSON.stringify({
          model: MODEL,
          messages,
          max_tokens: 1200,
          temperature: 0.7,
        }),
      });
    } catch (err) {
      lastErr = err;
      if (attempt < MAX_RETRIES) {
        await new Promise((r) => setTimeout(r, RETRY_DELAYS_MS[attempt]));
        continue;
      }
      break;
    }

    if (res.status === 429 || res.status === 503) {
      lastErr = new Error(`429`);
      if (attempt < MAX_RETRIES) {
        await new Promise((r) => setTimeout(r, RETRY_DELAYS_MS[attempt]));
        continue;
      }
      break;
    }

    let data: OpenRouterResponse;
    try {
      data = (await res.json()) as OpenRouterResponse;
    } catch {
      throw new Error("Invalid response from AI service.");
    }

    if (!res.ok || data.error) {
      const code = data.error?.code ?? res.status;
      if (code === 429) {
        lastErr = new Error("429");
        if (attempt < MAX_RETRIES) {
          await new Promise((r) => setTimeout(r, RETRY_DELAYS_MS[attempt]));
          continue;
        }
        break;
      }
      throw new Error("AI service returned an error.");
    }

    const text = data.choices?.[0]?.message?.content;
    if (!text) throw new Error("AI returned an empty response.");
    return text.trim();
  }

  if (isRateLimit(lastErr)) {
    throw new Error("QUOTA_EXCEEDED");
  }
  throw lastErr instanceof Error ? lastErr : new Error("AI request failed.");
}

export async function optimizeResume(resume: string, jobDescription: string): Promise<string> {
  const r = trim(resume, MAX_RESUME_CHARS);
  const j = trim(jobDescription, MAX_JD_CHARS) || "General professional role";

  return generate([
    {
      role: "system",
      content:
        "You are an expert ATS resume optimizer. Rewrite resumes to use strong action verbs, quantified achievements, relevant keywords, and clear section headers. Return only the rewritten resume text. No commentary.",
    },
    {
      role: "user",
      content: `RESUME:\n${r}\n\nJOB DESCRIPTION:\n${j}`,
    },
  ]);
}

export async function roastResume(resume: string, jobDescription: string): Promise<string> {
  const r = trim(resume, MAX_RESUME_CHARS);
  const j = trim(jobDescription, MAX_JD_CHARS) || "General professional role";

  return generate([
    {
      role: "system",
      content:
        "You are a senior recruiter and ATS expert. Analyze resumes brutally and concisely. Reply with exactly these sections:\n\n**ATS SCORE: [X/100]**\nOne sentence reason.\n\n**TOP 3 WEAKNESSES**\n- [weakness]\n\n**MISSING KEYWORDS**\n- [keyword]\n\n**WEAK BULLET POINTS**\nQuote the worst 2 bullets and explain why.\n\n**TOP 5 FIXES (Priority Order)**\n1. [fix]\n\nBe direct and specific. No filler.",
    },
    {
      role: "user",
      content: `RESUME:\n${r}\n\nJOB DESCRIPTION:\n${j}`,
    },
  ]);
}

export async function generateCoverLetter(resume: string, jobDescription: string): Promise<string> {
  const r = trim(resume, MAX_RESUME_CHARS);
  const j = trim(jobDescription, MAX_JD_CHARS) || "General professional role";

  return generate([
    {
      role: "system",
      content:
        "Write a concise, compelling cover letter. Requirements: 3 tight paragraphs, no filler, strong opening hook (not 'I am writing to apply'), highlight 2 relevant experiences with impact, clear value proposition and confident closing. Use context from the resume — no placeholders. Return only the cover letter text.",
    },
    {
      role: "user",
      content: `RESUME:\n${r}\n\nJOB DESCRIPTION:\n${j}`,
    },
  ]);
}
