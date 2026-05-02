import { Router } from "express";
import multer from "multer";
import os from "os";
import path from "path";
import { parseUploadedFile, friendlyParseError, ACCEPT_MIME } from "../lib/parser";

const router = Router();

const upload = multer({
  dest: os.tmpdir(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter(_req, file, cb) {
    if (ACCEPT_MIME.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("UNSUPPORTED_TYPE"));
    }
  },
});

router.post("/parse", upload.single("file"), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded." });
    return;
  }

  const filePath = req.file.path;
  const originalName = req.file.originalname;

  try {
    const text = await parseUploadedFile(filePath, originalName);
    if (!text || text.trim().length < 5) {
      res.status(422).json({ error: "Could not extract any text from this file." });
      return;
    }
    res.json({ text: text.trim() });
  } catch (err) {
    req.log.error({ err }, "parse error");
    const msg = friendlyParseError(err);
    res.status(422).json({ error: msg });
  }
});

// Multer error handler
router.use((err: unknown, _req: unknown, res: { status: (c: number) => { json: (b: unknown) => void } }, next: (e?: unknown) => void) => {
  if (err && typeof err === "object" && "code" in err) {
    const code = (err as { code: string }).code;
    if (code === "LIMIT_FILE_SIZE") {
      res.status(413).json({ error: "File is too large. Maximum size is 10 MB." });
      return;
    }
  }
  if (err instanceof Error && err.message === "UNSUPPORTED_TYPE") {
    res.status(415).json({ error: "This file type is not supported." });
    return;
  }
  next(err);
});

export default router;
