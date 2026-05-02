const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const QUOTA_MSG = "AI is currently busy. Please try again in a minute.";
const NETWORK_MSG = "Could not reach the server. Check your connection and try again.";
const GENERIC_MSG = "Something went wrong. Please try again.";

async function post(path: string, body: Record<string, string>): Promise<string> {
  let res: Response;

  try {
    res = await fetch(`${BASE}/api${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error(NETWORK_MSG);
  }

  let data: { result?: string; error?: string } = {};
  try {
    data = await res.json() as typeof data;
  } catch {
    throw new Error(GENERIC_MSG);
  }

  if (res.status === 429) {
    throw new Error(data.error ?? QUOTA_MSG);
  }

  if (!res.ok || data.error) {
    throw new Error(data.error ?? `Request failed (${res.status}). Please try again.`);
  }

  return data.result ?? "";
}

export function optimizeResume(resume: string, jobDescription: string): Promise<string> {
  return post("/optimize", { resume, jobDescription });
}

export function roastResume(resume: string, jobDescription: string): Promise<string> {
  return post("/roast", { resume, jobDescription });
}

export function generateCoverLetter(resume: string, jobDescription: string): Promise<string> {
  return post("/cover-letter", { resume, jobDescription });
}
