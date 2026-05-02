interface Props {
  text: string;
  accentColor?: string;
}

interface ParsedLine {
  type: "name" | "contact" | "section" | "job-header" | "bullet" | "body" | "blank";
  content: string;
}

function parseLine(line: string, index: number): ParsedLine {
  const trimmed = line.trim();
  if (!trimmed) return { type: "blank", content: "" };

  // First non-blank line = name
  if (index === 0) return { type: "name", content: trimmed };

  // Contact line (email/phone/url pattern)
  if (/[@|·•]/.test(trimmed) && trimmed.length < 120 && index <= 3)
    return { type: "contact", content: trimmed };

  // Section headers: all caps line, or known header words
  const knownHeaders = ["summary","objective","experience","education","skills","certifications","projects","awards","publications","volunteering","languages"];
  const isAllCaps = trimmed === trimmed.toUpperCase() && trimmed.length > 2 && trimmed.length < 40 && /[A-Z]/.test(trimmed);
  const isKnownHeader = knownHeaders.some(h => trimmed.toLowerCase().startsWith(h));
  const isBoldHeader = /^\*{2}.+\*{2}$/.test(trimmed);
  if (isAllCaps || isKnownHeader || isBoldHeader)
    return { type: "section", content: trimmed.replace(/\*+/g, "").trim() };

  // Bullet
  if (/^[-•*◦▸►]/.test(trimmed))
    return { type: "bullet", content: trimmed.replace(/^[-•*◦▸►]\s*/, "") };

  // Job header: "Title | Company | Date" or "Title  Company  2020–Present"
  if (/[|·–—]/.test(trimmed) && trimmed.length < 120)
    return { type: "job-header", content: trimmed };

  return { type: "body", content: trimmed };
}

export default function ResumePreview({ text, accentColor = "#7c3aed" }: Props) {
  if (!text.trim()) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-center p-8">
        <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center mb-2">
          <svg className="w-8 h-8 text-violet-400/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-muted-foreground text-sm font-medium">Live preview will appear here</p>
        <p className="text-muted-foreground/60 text-xs max-w-xs">Paste or upload your resume on the left to see a formatted preview.</p>
      </div>
    );
  }

  const rawLines = text.split("\n");
  let firstContentIdx = -1;
  const parsed: ParsedLine[] = rawLines.map((line, i) => {
    if (firstContentIdx === -1 && line.trim()) firstContentIdx = i;
    const relIdx = firstContentIdx === -1 ? i : i - firstContentIdx;
    return parseLine(line, relIdx);
  });

  return (
    <div className="h-full overflow-y-auto scrollbar-thin">
      <div
        className="bg-white rounded-xl shadow-xl mx-auto p-6 text-gray-900 font-sans"
        style={{ minHeight: "600px", maxWidth: "640px", fontSize: "11px", lineHeight: "1.5" }}
      >
        {parsed.map((line, i) => {
          if (line.type === "blank") return <div key={i} className="h-2" />;

          if (line.type === "name") return (
            <h1 key={i} style={{ fontSize: "20px", fontWeight: 700, color: "#111827", marginBottom: "4px" }}>
              {line.content}
            </h1>
          );

          if (line.type === "contact") return (
            <p key={i} style={{ fontSize: "9.5px", color: "#6b7280", marginBottom: "2px" }}>
              {line.content}
            </p>
          );

          if (line.type === "section") return (
            <div key={i} style={{ marginTop: "12px", marginBottom: "4px" }}>
              <p style={{ fontSize: "9px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: accentColor }}>
                {line.content}
              </p>
              <div style={{ height: "1px", background: accentColor, opacity: 0.3, marginTop: "2px" }} />
            </div>
          );

          if (line.type === "job-header") return (
            <p key={i} style={{ fontSize: "10.5px", fontWeight: 600, color: "#1f2937", marginTop: "6px", marginBottom: "2px" }}>
              {line.content}
            </p>
          );

          if (line.type === "bullet") return (
            <div key={i} style={{ display: "flex", gap: "6px", marginBottom: "2px", paddingLeft: "4px" }}>
              <span style={{ color: accentColor, flexShrink: 0, marginTop: "1px" }}>•</span>
              <p style={{ color: "#374151", fontSize: "10.5px" }}>{line.content}</p>
            </div>
          );

          return (
            <p key={i} style={{ fontSize: "10.5px", color: "#374151", marginBottom: "2px" }}>
              {line.content}
            </p>
          );
        })}
      </div>
    </div>
  );
}
