import { GoogleGenerativeAI } from "@google/generative-ai";

const MODEL = "gemini-2.0-flash";

/** Hard caps to keep token usage low */
const MAX_RESUME_CHARS = 2500;
const MAX_JD_CHARS = 1000;

/** Retry config for 429 / RESOURCE_EXHAUSTED */
const MAX_RETRIES = 2;
const RETRY_DELAYS_MS = [8000, 20000]; // 8 s, then 20 s

function getClient(): GoogleGenerativeAI {
  const apiKey = process.env["GEMINI_API_KEY"];
  if (!apiKey) throw new Error("GEMINI_API_KEY environment variable is not set.");
  return new GoogleGenerativeAI(apiKey);
}

function isRateLimit(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  const m = err.message.toLowerCase();
  return (
    m.includes("429") ||
    m.includes("quota") ||
    m.includes("resource_exhausted") ||
    m.includes("rate limit") ||
    m.includes("too many requests")
  );
}

function trim(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars) + "\n[truncated for length]";
}

async function generate(prompt: string): Promise<string> {
  const model = getClient().getGenerativeModel({
    model: MODEL,
    generationConfig: {
      maxOutputTokens: 800,
      temperature: 0.7,
    },
  });

  let lastErr: unknown;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err) {
      lastErr = err;
      if (isRateLimit(err) && attempt < MAX_RETRIES) {
        await new Promise((r) => setTimeout(r, RETRY_DELAYS_MS[attempt]));
        continue;
      }
      break;
    }
  }

  if (isRateLimit(lastErr)) {
    throw new Error("QUOTA_EXCEEDED");
  }
  throw lastErr;
}

export async function optimizeResume(resume: string, jobDescription: string): Promise<string> {
  const r = trim(resume, MAX_RESUME_CHARS);
  const j = trim(jobDescription, MAX_JD_CHARS) || "General professional role";

  const prompt = `You are an expert ATS resume optimizer. Rewrite the resume below to:
- Use strong action verbs and quantified achievements
- Insert relevant keywords for the job description
- Improve scannability with clear section headers
- Be concise and recruiter-ready

RESUME:
${r}

JOB DESCRIPTION:
${j}

Return only the rewritten resume text. No commentary.`;

  return generate(prompt);
}

export async function roastResume(resume: string, jobDescription: string): Promise<string> {
  const r = trim(resume, MAX_RESUME_CHARS);
  const j = trim(jobDescription, MAX_JD_CHARS) || "General professional role";

  const prompt = `You are a senior recruiter and ATS expert. Analyze this resume brutally and concisely.

RESUME:
${r}

JOB DESCRIPTION:
${j}

Reply with these sections only — keep each section brief:

**ATS SCORE: [X/100]**
One sentence reason.

**TOP 3 WEAKNESSES**
- [weakness]

**MISSING KEYWORDS**
- [keyword]

**WEAK BULLET POINTS**
Quote the worst 2 bullets and explain why.

**TOP 5 FIXES (Priority Order)**
1. [fix]
2. [fix]
3. [fix]
4. [fix]
5. [fix]

Be direct and specific. No filler.`;

  return generate(prompt);
}

export async function generateCoverLetter(resume: string, jobDescription: string): Promise<string> {
  const r = trim(resume, MAX_RESUME_CHARS);
  const j = trim(jobDescription, MAX_JD_CHARS) || "General professional role";

  const prompt = `Write a concise, compelling cover letter based on the resume and job below.

RESUME:
${r}

JOB DESCRIPTION:
${j}

Requirements:
- 3 tight paragraphs, no filler
- Strong opening hook (not "I am writing to apply")
- Highlight 2 relevant experiences with impact
- Clear value proposition and confident closing
- Use context from the resume — no placeholders

Return only the cover letter text.`;

  return generate(prompt);
}
