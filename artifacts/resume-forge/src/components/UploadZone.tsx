import { useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ACCEPTED = ".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.webp,.xlsx,.csv";
const MAX_BYTES = 10 * 1024 * 1024;

type UploadState = "idle" | "uploading" | "extracting" | "done" | "error";

interface Props {
  onExtracted: (text: string) => void;
  accent: "violet" | "blue";
}

const ACCENT = {
  violet: {
    border: "border-violet-500/50",
    bg: "bg-violet-500/5",
    icon: "text-violet-400",
    badge: "bg-violet-600/20 text-violet-300",
    btn: "bg-violet-600/20 hover:bg-violet-600/30 text-violet-300",
    dot: "bg-violet-500",
  },
  blue: {
    border: "border-blue-500/50",
    bg: "bg-blue-500/5",
    icon: "text-blue-400",
    badge: "bg-blue-600/20 text-blue-300",
    btn: "bg-blue-600/20 hover:bg-blue-600/30 text-blue-300",
    dot: "bg-blue-500",
  },
} as const;

export default function UploadZone({ onExtracted, accent }: Props) {
  const a = ACCENT[accent];
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<UploadState>("idle");
  const [filename, setFilename] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [dragging, setDragging] = useState(false);

  const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

  const processFile = useCallback(
    async (file: File) => {
      if (file.size > MAX_BYTES) {
        setErrorMsg("File is too large. Maximum size is 10 MB.");
        setState("error");
        return;
      }

      setFilename(file.name);
      setState("uploading");
      setErrorMsg("");

      const formData = new FormData();
      formData.append("file", file);

      let res: Response;
      try {
        setState("extracting");
        res = await fetch(`${BASE}/api/parse`, {
          method: "POST",
          body: formData,
        });
      } catch {
        setErrorMsg("Could not reach the server. Check your connection.");
        setState("error");
        return;
      }

      let data: { text?: string; error?: string } = {};
      try {
        data = (await res.json()) as typeof data;
      } catch {
        setErrorMsg("Unexpected server response. Please try again.");
        setState("error");
        return;
      }

      if (!res.ok || data.error) {
        setErrorMsg(data.error ?? "Failed to extract text. Please try again.");
        setState("error");
        return;
      }

      if (!data.text?.trim()) {
        setErrorMsg("No text could be extracted from this file.");
        setState("error");
        return;
      }

      onExtracted(data.text.trim());
      setState("done");
    },
    [BASE, onExtracted],
  );

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      processFile(files[0]).catch(() => {
        setState("error");
        setErrorMsg("Unexpected error. Please try again.");
      });
    },
    [processFile],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles],
  );

  const reset = () => {
    setState("idle");
    setFilename("");
    setErrorMsg("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const isActive = state === "uploading" || state === "extracting";

  return (
    <div className="mb-3">
      <AnimatePresence mode="wait">
        {state === "idle" || state === "error" ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={`relative rounded-xl border border-dashed transition-all duration-200 px-4 py-3 cursor-pointer ${
              dragging ? `${a.border} ${a.bg}` : "border-white/10 hover:border-white/20"
            }`}
            onClick={() => inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPTED}
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center flex-shrink-0 ${a.icon}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                {state === "error" ? (
                  <p className="text-xs text-red-400 leading-snug">{errorMsg}</p>
                ) : (
                  <p className="text-xs text-muted-foreground leading-snug">
                    <span className={`font-medium ${a.icon}`}>Upload file</span>
                    <span className="hidden sm:inline"> or drag & drop</span>
                    <span className="sm:hidden"> </span>
                    <span className="text-white/20 mx-1 hidden sm:inline">—</span>
                    <span className="hidden sm:inline">PDF, DOCX, TXT, image, XLSX, CSV</span>
                    <span className="sm:hidden text-white/40">PDF, DOCX, TXT…</span>
                  </p>
                )}
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-md flex-shrink-0 ${a.badge}`}>
                Upload
              </span>
            </div>
          </motion.div>
        ) : isActive ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="rounded-xl border border-white/10 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center flex-shrink-0">
                <div className={`w-4 h-4 rounded-full border-2 border-white/10 border-t-current animate-spin ${a.icon}`} />
              </div>
              <div className="flex-1 min-w-0">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={state}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="text-xs text-white font-medium"
                  >
                    {state === "uploading" ? "Uploading..." : "Extracting text..."}
                  </motion.p>
                </AnimatePresence>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{filename}</p>
              </div>
            </div>
            <div className="mt-2.5 h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${a.dot}`}
                initial={{ width: "0%" }}
                animate={{ width: state === "uploading" ? "40%" : "85%" }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        ) : (
          // done
          <motion.div
            key="done"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-green-400 font-medium">Text extracted</p>
                <p className="text-xs text-muted-foreground truncate mt-0.5">{filename}</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); reset(); }}
                className="text-xs text-muted-foreground hover:text-white transition-colors flex-shrink-0 px-2 py-1 rounded-lg hover:bg-white/5"
              >
                Replace
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
