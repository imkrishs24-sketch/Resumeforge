import { Router } from "express";
import { optimizeResume, roastResume, generateCoverLetter } from "../lib/gemini";

const router = Router();

function getBody(req: { body: unknown }): { resume?: string; jobDescription?: string } {
  if (req.body && typeof req.body === "object") {
    return req.body as { resume?: string; jobDescription?: string };
  }
  return {};
}

router.post("/optimize", async (req, res) => {
  const { resume, jobDescription } = getBody(req);

  if (!resume || !resume.trim()) {
    res.status(400).json({ error: "Resume text is required." });
    return;
  }

  try {
    const result = await optimizeResume(resume.trim(), (jobDescription ?? "").trim());
    res.json({ result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "AI generation failed";
    req.log.error({ err }, "optimize error");
    res.status(500).json({ error: message });
  }
});

router.post("/roast", async (req, res) => {
  const { resume, jobDescription } = getBody(req);

  if (!resume || !resume.trim()) {
    res.status(400).json({ error: "Resume text is required." });
    return;
  }

  try {
    const result = await roastResume(resume.trim(), (jobDescription ?? "").trim());
    res.json({ result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "AI generation failed";
    req.log.error({ err }, "roast error");
    res.status(500).json({ error: message });
  }
});

router.post("/cover-letter", async (req, res) => {
  const { resume, jobDescription } = getBody(req);

  if (!resume || !resume.trim()) {
    res.status(400).json({ error: "Resume text is required." });
    return;
  }

  try {
    const result = await generateCoverLetter(resume.trim(), (jobDescription ?? "").trim());
    res.json({ result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "AI generation failed";
    req.log.error({ err }, "cover-letter error");
    res.status(500).json({ error: message });
  }
});

export default router;
