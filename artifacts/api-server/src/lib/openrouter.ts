const API_URL = "https://openrouter.ai/api/v1/chat/completions";

const MODELS = [
  "deepseek/deepseek-chat",
  "mistralai/mistral-7b-instruct:free",
  "meta-llama/llama-3.1-8b-instruct:free",
  "google/gemma-2-9b-it:free",
  "qwen/qwen-2.5-7b-instruct:free",
  "microsoft/phi-3-mini-128k-instruct:free",
  "nousresearch/hermes-2-pro-llama-3-8b:free",
];

const MAX_RESUME_CHARS = 2500;
const MAX_JD_CHARS = 1000;
const REQUEST_TIMEOUT_MS = 25000;
const RETRY_DELAY_MS = 3000;

function getApiKey(): string {
  const key = process.env["OPENROUTER_API_KEY"];
  if (!key) throw new Error("OPENROUTER_API_KEY environment variable is not set.");
  return key;
}

function trim(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars) + "\n[truncated for length]";
}

function isRetryableStatus(status: number): boolean {
  return status === 429 || status === 503 || status === 502 || status === 500;
}

function sanitize(text: string): string {
  const t = text.trim();
  if (!t || t.length < 20) throw new Error("EMPTY_RESPONSE");
  return t;
}

interface Message {
  role: "system" | "user";
  content: string;
}

interface OpenRouterResponse {
  choices?: Array<{ message?: { content?: string } }>;
  error?: { message?: string; code?: number };
}

async function tryModel(apiKey: string, model: string, messages: Message[]): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://resumeforge.app",
        "X-Title": "ResumeForge AI",
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: 700,
        temperature: 0.7,
      }),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }

  if (isRetryableStatus(res.status)) {
    throw new Error(`RETRYABLE:${res.status}`);
  }

  let data: OpenRouterResponse;
  try {
    data = (await res.json()) as OpenRouterResponse;
  } catch {
    throw new Error("RETRYABLE:invalid_json");
  }

  if (!res.ok || data.error) {
    const code = data.error?.code ?? res.status;
    if (isRetryableStatus(Number(code))) throw new Error(`RETRYABLE:${code}`);
    throw new Error(`MODEL_ERROR:${data.error?.message ?? res.status}`);
  }

  const content = data.choices?.[0]?.message?.content;
  return sanitize(content ?? "");
}

async function generate(messages: Message[]): Promise<string> {
  const apiKey = getApiKey();

  for (let modelIdx = 0; modelIdx < MODELS.length; modelIdx++) {
    const model = MODELS[modelIdx];

    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const result = await tryModel(apiKey, model, messages);
        return result;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "";
        const isTimeout = msg === "AbortError" || (err instanceof Error && err.name === "AbortError");
        const isRetryable = isTimeout || msg.startsWith("RETRYABLE:") || msg === "EMPTY_RESPONSE";

        if (isRetryable) {
          if (attempt === 0) {
            await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
            continue;
          }
          break;
        }

        break;
      }
    }
  }

  throw new Error("QUOTA_EXCEEDED");
}

export async function optimizeResume(resume: string, jobDescription: string): Promise<string> {
  const r = trim(resume, MAX_RESUME_CHARS);
  const j = trim(jobDescription, MAX_JD_CHARS) || "General professional role";

  return generate([
    {
      role: "system",
      content:
        "You are an expert ATS resume optimizer. Rewrite the given resume using strong action verbs, quantified achievements, relevant keywords from the job description, and clear section headers. Return only the rewritten resume text. No commentary or preamble.",
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
        "You are a senior recruiter and ATS expert. Analyze the resume brutally and concisely. Reply with exactly these sections:\n\n**ATS SCORE: [X/100]**\nOne sentence reason.\n\n**TOP 3 WEAKNESSES**\n- weakness\n\n**MISSING KEYWORDS**\n- keyword\n\n**WEAK BULLET POINTS**\nQuote the worst 2 bullets and explain why.\n\n**TOP 5 FIXES (Priority Order)**\n1. fix\n\nBe direct and specific. No filler.",
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
        "Write a concise, compelling cover letter in 3 tight paragraphs. Requirements: strong opening hook (not 'I am writing to apply'), highlight 2 relevant experiences with impact, clear value proposition and confident closing. Use the resume context — no placeholders. Return only the cover letter text.",
    },
    {
      role: "user",
      content: `RESUME:\n${r}\n\nJOB DESCRIPTION:\n${j}`,
    },
  ]);
}
