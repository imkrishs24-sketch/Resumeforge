const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

async function post(path: string, body: Record<string, string>): Promise<string> {
  const res = await fetch(`${BASE}/api${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json() as { result?: string; error?: string };

  if (!res.ok || data.error) {
    throw new Error(data.error ?? `Request failed with status ${res.status}`);
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
