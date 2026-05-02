const MODEL = "gemini-2.5-flash";

function getPuterText(response: unknown): string {
  if (typeof response === "string") return response;
  const r = response as { message?: { content?: Array<{ text?: string }> } };
  return r?.message?.content?.[0]?.text ?? String(response);
}

export async function optimizeResume(resume: string, jobDescription: string): Promise<string> {
  const prompt = `You are a professional ATS resume optimizer.

TASK:
- Rewrite the resume professionally
- Improve ATS keywords
- Improve bullet points
- Increase recruiter readability
- Add stronger impact metrics
- Tailor resume for the job description

RESUME:
${resume}

JOB DESCRIPTION:
${jobDescription || "General professional role"}

Return a polished ATS-optimized resume. Format it cleanly with clear sections.`;

  const response = await window.puter.ai.chat(prompt, { model: MODEL });
  return getPuterText(response);
}

export async function roastResume(resume: string, jobDescription: string): Promise<string> {
  const prompt = `Brutally analyze this resume like a senior recruiter and ATS expert.

RESUME:
${resume}

JOB DESCRIPTION:
${jobDescription || "General professional role"}

Return a detailed analysis with:
- ATS Score out of 100 (be specific)
- Biggest weaknesses (be blunt)
- Missing keywords for this role
- Weak bullet points that need fixing
- Recruiter red flags and concerns
- Formatting issues
- Top 5 specific improvements to make immediately

Be direct, specific, and actionable. No fluff.`;

  const response = await window.puter.ai.chat(prompt, { model: MODEL });
  return getPuterText(response);
}

export async function generateCoverLetter(resume: string, jobDescription: string): Promise<string> {
  const prompt = `Generate a professional, compelling cover letter using the information below.

RESUME:
${resume}

JOB DESCRIPTION:
${jobDescription || "General professional role"}

Requirements:
- Professional and confident tone
- Short, punchy, and impactful (3-4 paragraphs)
- Tailored specifically to the job role
- Highlight the most relevant experience
- Strong opening hook
- Clear value proposition
- Compelling closing with call to action

Write the full cover letter ready to send.`;

  const response = await window.puter.ai.chat(prompt, { model: MODEL });
  return getPuterText(response);
}
