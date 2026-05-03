import { readFile, unlink } from "fs/promises";
import path from "path";

export const SUPPORTED_TYPES = [
  ".pdf", ".doc", ".docx", ".txt", ".csv", ".xlsx", ".jpg", ".jpeg", ".png", ".webp",
];

export const ACCEPT_MIME = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "text/csv",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "image/jpeg",
  "image/png",
  "image/webp",
];

async function cleanup(filePath: string): Promise<void> {
  try { await unlink(filePath); } catch { /* ignore */ }
}

export async function parseUploadedFile(
  filePath: string,
  originalName: string,
): Promise<string> {
  const ext = path.extname(originalName).toLowerCase();

  try {
    if (ext === ".txt" || ext === ".csv") {
      const buf = await readFile(filePath);
      return buf.toString("utf-8").trim();
    }

    if (ext === ".pdf") {
      import * as pdf from "pdf-parse";
      const buf = await readFile(filePath);
      const data = await pdf(buffer);
      const text = data.text?.trim();
      if (!text) throw new Error("PDF_EMPTY");
      return text;
    }

    if (ext === ".docx" || ext === ".doc") {
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ path: filePath });
      const text = result.value?.trim();
      if (!text) throw new Error("DOC_EMPTY");
      return text;
    }

    if (ext === ".xlsx") {
      const XLSX = await import("xlsx");
      const workbook = XLSX.readFile(filePath);
      const rows: string[] = [];
      for (const name of workbook.SheetNames) {
        const sheet = workbook.Sheets[name];
        rows.push(XLSX.utils.sheet_to_csv(sheet));
      }
      const text = rows.join("\n\n").trim();
      if (!text) throw new Error("XLSX_EMPTY");
      return text;
    }

    if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
      const { createWorker } = await import("tesseract.js");
      const worker = await createWorker("eng");
      try {
        const { data } = await worker.recognize(filePath);
        const text = data.text?.trim();
        if (!text || text.length < 10) throw new Error("OCR_EMPTY");
        return text;
      } finally {
        await worker.terminate();
      }
    }

    throw new Error("UNSUPPORTED_TYPE");
  } finally {
    await cleanup(filePath);
  }
}

export function friendlyParseError(err: unknown): string {
  const msg = err instanceof Error ? err.message : "";
  if (msg === "UNSUPPORTED_TYPE") return "This file type is not supported.";
  if (msg === "PDF_EMPTY" || msg === "DOC_EMPTY" || msg === "XLSX_EMPTY" || msg === "OCR_EMPTY")
    return "Could not extract text from this file. Try a different format.";
  if (msg.includes("password") || msg.includes("encrypted"))
    return "This file is password-protected. Please remove the password and try again.";
  return "Failed to read this file. Please check it's not corrupted and try again.";
}
