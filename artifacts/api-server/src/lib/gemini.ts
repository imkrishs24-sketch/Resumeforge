import { GoogleGenerativeAI } from "@google/generative-ai";

const MODEL = "gemini-2.0-flash";

function getClient(): GoogleGenerativeAI {
  const apiKey = process.env["GEMINI_API_KEY"];
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set.");
  }
  return new GoogleGenerativeAI(apiKey);
}

async function generate(prompt: string): Promise<string> {
  const genAI = getClient();
  const model = genAI.getGenerativeModel({ model: MODEL });
  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text();
}

export async function optimizeResume(resume: string, jobDescription: string): Promise<string> {
  const prompt = `You are a professional ATS resume optimizer.

TASK:
- Rewrite the resume professionally
- Improve ATS keywords relevant to the job description
- Rewrite bullet points with strong action verbs and quantified achievements
- Increase recruiter readability and scannability
- Add stronger impact metrics and results
- Tailor the resume specifically for the provided job description

RESUME:
${resume}

JOB DESCRIPTION:
${jobDescription || "General professional role — optimize for broad ATS compatibility"}

Return a complete, polished ATS-optimized resume. Use clear section headers, consistent formatting, and strong professional language. Do not include any commentary — return only the resume text.`;

  return generate(prompt);
}

export async function roastResume(resume: string, jobDescription: string): Promise<string> {
  const prompt = `You are a brutally honest senior recruiter and ATS expert with 15 years of experience.

Analyze this resume like you're deciding in 10 seconds whether to move forward.

RESUME:
${resume}

JOB DESCRIPTION:
${jobDescription || "General professional role"}

Provide a detailed, no-fluff analysis with these exact sections:

**ATS SCORE: [X/100]**
[One sentence explaining the score]

**BIGGEST WEAKNESSES**
[List the top 3-5 critical problems]

**MISSING KEYWORDS**
[List specific keywords missing for this role]

**WEAK BULLET POINTS**
[Quote the weakest bullets and explain why they fail]

**RECRUITER RED FLAGS**
[List specific concerns a recruiter would have]

**FORMATTING ISSUES**
[List any structural or formatting problems]

**TOP 5 IMPROVEMENTS (Priority Order)**
1. [Most impactful fix]
2. [Second fix]
3. [Third fix]
4. [Fourth fix]
5. [Fifth fix]

Be specific, direct, and actionable. No fluff.`;

  return generate(prompt);
}

export async function generateCoverLetter(resume: string, jobDescription: string): Promise<string> {
  const prompt = `You are a professional career coach and expert cover letter writer.

Generate a compelling, tailored cover letter using the information below.

RESUME:
${resume}

JOB DESCRIPTION:
${jobDescription || "General professional role"}

Requirements:
- Strong, attention-grabbing opening hook (not "I am writing to apply for...")
- Professional and confident tone throughout
- 3-4 focused paragraphs — short and punchy, not verbose
- Highlight the most relevant 2-3 experiences from the resume
- Clear value proposition: what you bring to the company
- Specific reference to the company/role (not generic)
- Compelling closing with a clear call to action
- Ready to send — no placeholders like [Your Name] — use context from the resume

Return only the cover letter text, no commentary.`;

  return generate(prompt);
}
