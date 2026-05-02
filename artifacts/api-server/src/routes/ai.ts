import { Router } from "express";
import { optimizeResume, roastResume, generateCoverLetter } from "../lib/gemini";

const router = Router();

const QUOTA_MSG = "AI is currently busy. Please try again in a minute.";
const GENERIC_MSG = "Something went wrong. Please try again.";

function getBody(req: { body: unknown }): { resume?: string; jobDescription?: string } {
  if (req.body && typeof req.body === "object") {
    return req.body as { resume?: string; jobDescription?: string };
  }
  return {};
}

function handleError(err: unknown, label: string, req: { log: { error: (...a: unknown[]) => void } }, res: { status: (c: number) => { json: (b: unknown) => void } }) {
  req.log.error({ err }, `${label} error`);
  if (err instanceof Error && err.message === "QUOTA_EXCEEDED") {
    res.status(429).json({ error: QUOTA_MSG });
    return;
  }
  res.status(500).json({ error: GENERIC_MSG });
}

router.post("/optimize", async (req, res) => {
  const { resume, jobDescription } = getBody(req);
  if (!resume?.trim()) {
    res.status(400).json({ error: "Resume text is required." });
    return;
  }
  try {
    const result = await optimizeResume(resume.trim(), (jobDescription ?? "").trim());
    res.json({ result });
  } catch (err) {
    handleError(err, "optimize", req, res);
  }
});

router.post("/roast", async (req, res) => {
  const { resume, jobDescription } = getBody(req);
  if (!resume?.trim()) {
    res.status(400).json({ error: "Resume text is required." });
    return;
  }
  try {
    const result = await roastResume(resume.trim(), (jobDescription ?? "").trim());
    res.json({ result });
  } catch (err) {
    handleError(err, "roast", req, res);
  }
});

router.post("/cover-letter", async (req, res) => {
  const { resume, jobDescription } = getBody(req);
  if (!resume?.trim()) {
    res.status(400).json({ error: "Resume text is required." });
    return;
  }
  try {
    const result = await generateCoverLetter(resume.trim(), (jobDescription ?? "").trim());
    res.json({ result });
  } catch (err) {
    handleError(err, "cover-letter", req, res);
  }
});

export default router;
