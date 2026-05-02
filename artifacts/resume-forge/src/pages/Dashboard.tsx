import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { optimizeResume, roastResume, generateCoverLetter } from "@/lib/api";
import { downloadAsPDF } from "@/lib/pdf";

type Mode = "optimize" | "roast" | "cover-letter" | null;

const QUOTA_MSG = "AI is currently busy. Please try again in a minute.";
function isQuotaError(msg: string) {
  return msg.toLowerCase().includes("busy") || msg.toLowerCase().includes("quota") || msg.toLowerCase().includes("rate");
}

const SAMPLE_RESUME = `John Smith
john.smith@email.com | LinkedIn: linkedin.com/in/johnsmith | GitHub: github.com/johnsmith

EXPERIENCE
Software Engineer | Tech Company Inc. | 2021 - Present
- Worked on various projects
- Used JavaScript and React
- Fixed bugs and added features
- Worked with team members on projects

Junior Developer | Startup Co. | 2019 - 2021
- Helped build web applications
- Used HTML, CSS, JavaScript
- Worked on database stuff

EDUCATION
B.S. Computer Science | State University | 2019

SKILLS
JavaScript, React, CSS, HTML, SQL, Git`;

const LOADING_SEQUENCES: Record<NonNullable<Mode>, string[]> = {
  optimize: [
    "Analyzing your resume...",
    "Identifying improvement areas...",
    "Inserting ATS keywords...",
    "Polishing action verbs...",
    "Finalizing optimized resume...",
    "Almost there...",
  ],
  roast: [
    "Scanning your resume...",
    "Running ATS analysis...",
    "Identifying weaknesses...",
    "Scoring your resume...",
    "Compiling feedback...",
    "Almost there...",
  ],
  "cover-letter": [
    "Reading your experience...",
    "Crafting your opening...",
    "Highlighting key achievements...",
    "Writing closing statement...",
    "Polishing cover letter...",
    "Almost there...",
  ],
};

export default function Dashboard() {
  const [, navigate] = useLocation();
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeMode, setActiveMode] = useState<Mode>(null);
  const [error, setError] = useState("");
  const [resultTitle, setResultTitle] = useState("");
  const [loadingStatus, setLoadingStatus] = useState("");
  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("mode") === "roast") {
      setActiveMode("roast");
    }
  }, []);

  const runAction = async (mode: Mode, fn: () => Promise<string>, title: string) => {
    if (!resume.trim()) {
      setError("Please paste your resume first.");
      return;
    }
    setError("");
    setLoading(true);
    setActiveMode(mode);
    setResult("");
    setResultTitle(title);
    setLoadingStep(0);

    const sequence = LOADING_SEQUENCES[mode!];
    setLoadingStatus(sequence[0]);
    let step = 0;
    const interval = setInterval(() => {
      step = Math.min(step + 1, sequence.length - 1);
      setLoadingStep(step);
      setLoadingStatus(sequence[step]);
    }, 4000);

    try {
      const output = await fn();
      setResult(output);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Something went wrong. Please try again.";
      setError(msg);
    } finally {
      clearInterval(interval);
      setLoading(false);
      setLoadingStatus("");
      setLoadingStep(0);
    }
  };

  const handleOptimize = () =>
    runAction("optimize", () => optimizeResume(resume, jobDescription), "Optimized Resume");

  const handleRoast = () =>
    runAction("roast", () => roastResume(resume, jobDescription), "ATS Roast Analysis");

  const handleCoverLetter = () =>
    runAction("cover-letter", () => generateCoverLetter(resume, jobDescription), "Cover Letter");

  const handleDownloadPDF = () => {
    if (!result) return;
    const filename =
      activeMode === "cover-letter" ? "cover-letter.pdf" :
      activeMode === "roast" ? "ats-roast-analysis.pdf" :
      "optimized-resume.pdf";
    downloadAsPDF(result, filename);
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result).catch(() => {});
  };

  const modeButtons = [
    {
      mode: "optimize" as Mode,
      label: "Optimize Resume",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      gradient: "from-violet-600 to-purple-700",
      onClick: handleOptimize,
    },
    {
      mode: "roast" as Mode,
      label: "ATS Roast 🔥",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      gradient: "from-orange-500 to-red-600",
      onClick: handleRoast,
    },
    {
      mode: "cover-letter" as Mode,
      label: "Cover Letter",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      gradient: "from-blue-500 to-cyan-600",
      onClick: handleCoverLetter,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">
      {/* Top Bar */}
      <div className="glass border-b border-white/5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center">
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                <path d="M3 2h10v2H3V2zM3 6h10v2H3V6zM3 10h6v2H3v-2z" fill="white" />
              </svg>
            </div>
            <span className="font-bold text-base text-white">
              Resume<span className="gradient-text-purple">Forge</span>
            </span>
          </button>
          <div className="flex items-center gap-2" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">AI Resume Dashboard</h1>
          <p className="text-muted-foreground text-sm">Paste your resume, optionally add a job description, then choose an action.</p>
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (() => {
            const isQuota = isQuotaError(error);
            return (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`mb-6 flex items-start gap-3 rounded-xl px-4 py-3 ${
                  isQuota
                    ? "bg-amber-500/10 border border-amber-500/30"
                    : "bg-red-500/10 border border-red-500/30"
                }`}
              >
                {isQuota ? (
                  <svg className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${isQuota ? "text-amber-300" : "text-red-300"}`}>{error}</p>
                  {isQuota && (
                    <button
                      onClick={() => { setError(""); if (activeMode) document.getElementById(`btn-${activeMode}`)?.click(); }}
                      className="mt-2 text-xs text-amber-400 hover:text-amber-300 underline underline-offset-2 transition-colors"
                    >
                      Try again
                    </button>
                  )}
                </div>
                <button onClick={() => setError("")} className={`flex-shrink-0 ${isQuota ? "text-amber-400 hover:text-amber-300" : "text-red-400 hover:text-red-300"} transition-colors`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </motion.div>
            );
          })()}
        </AnimatePresence>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Left: Inputs */}
          <div className="space-y-5">
            {/* Resume Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="glass rounded-2xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-white flex items-center gap-2">
                  <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Your Resume <span className="text-red-400">*</span>
                </label>
                <button
                  onClick={() => setResume(SAMPLE_RESUME)}
                  className="text-xs text-violet-400 hover:text-violet-300 transition-colors bg-violet-600/10 hover:bg-violet-600/20 px-2.5 py-1 rounded-lg"
                >
                  Load Sample
                </button>
              </div>
              <textarea
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                placeholder="Paste your resume here... (plain text works best)"
                rows={14}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all scrollbar-thin"
              />
              <p className="text-xs text-muted-foreground mt-2">{resume.length} characters</p>
            </motion.div>

            {/* Job Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="glass rounded-2xl p-5"
            >
              <label className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Job Description
                <span className="text-xs text-muted-foreground font-normal">(optional but recommended)</span>
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here for better results..."
                rows={7}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all scrollbar-thin"
              />
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-3 gap-3"
            >
              {modeButtons.map((btn) => (
                <button
                  key={btn.mode}
                  id={`btn-${btn.mode}`}
                  onClick={btn.onClick}
                  disabled={loading}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 px-3 py-3 rounded-xl text-white text-xs sm:text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-br ${btn.gradient} hover:scale-105 hover:shadow-lg active:scale-95 ${
                    activeMode === btn.mode && loading ? "animate-pulse-glow" : ""
                  }`}
                >
                  {btn.icon}
                  <span className="text-center leading-tight">{btn.label}</span>
                </button>
              ))}
            </motion.div>
          </div>

          {/* Right: Result */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="glass rounded-2xl p-5 flex flex-col min-h-[500px]"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <h2 className="text-sm font-semibold text-white">
                  {resultTitle || "AI Output"}
                </h2>
              </div>
              {result && !loading && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="text-xs text-muted-foreground hover:text-white transition-colors flex items-center gap-1 px-2.5 py-1.5 glass-light rounded-lg"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy
                  </button>
                  <button
                    onClick={handleDownloadPDF}
                    className="text-xs text-white font-medium flex items-center gap-1 px-3 py-1.5 bg-violet-600 hover:bg-violet-500 rounded-lg transition-all"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download PDF
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 relative">
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center gap-4"
                  >
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full border-2 border-violet-600/20 border-t-violet-500 animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full border-2 border-purple-600/20 border-t-purple-400 animate-spin" style={{ animationDirection: "reverse", animationDuration: "0.6s" }} />
                      </div>
                    </div>
                    <div className="text-center">
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={loadingStatus}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.3 }}
                          className="text-white font-medium mb-1"
                        >
                          {loadingStatus}
                        </motion.p>
                      </AnimatePresence>
                      <p className="text-muted-foreground text-sm">Usually 10–30 seconds</p>
                    </div>
                    <div className="flex gap-2 mt-2 items-center">
                      {(activeMode ? LOADING_SEQUENCES[activeMode] : []).map((_, i) => (
                        <div
                          key={i}
                          className={`rounded-full transition-all duration-500 ${
                            i <= loadingStep
                              ? "w-2 h-2 bg-violet-500"
                              : "w-1.5 h-1.5 bg-violet-500/20"
                          }`}
                        />
                      ))}
                    </div>
                  </motion.div>
                ) : result ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="h-full"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-2 h-2 rounded-full bg-green-400" />
                      <span className="text-xs text-green-400 font-medium">Generated successfully</span>
                    </div>
                    <textarea
                      value={result}
                      onChange={(e) => setResult(e.target.value)}
                      className="w-full h-[calc(100%-32px)] min-h-[400px] bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white resize-none focus:outline-none focus:border-violet-500/30 transition-all scrollbar-thin font-mono leading-relaxed"
                      spellCheck={false}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center p-8"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center mb-2">
                      <svg className="w-8 h-8 text-violet-400/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <p className="text-muted-foreground text-sm font-medium">Your AI output will appear here</p>
                    <p className="text-muted-foreground/60 text-xs max-w-xs">
                      Paste your resume on the left, then click one of the action buttons to get started.
                    </p>
                    <div className="mt-4 grid grid-cols-3 gap-2 w-full max-w-xs">
                      {["Optimize", "Roast", "Cover Letter"].map((label, i) => (
                        <div key={i} className="glass-light rounded-lg px-2 py-2 text-center">
                          <p className="text-xs text-muted-foreground/70">{label}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 glass rounded-2xl p-5"
        >
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            Tips for best results
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { icon: "📋", tip: "Use plain text format — avoid tables or columns in your paste" },
              { icon: "🎯", tip: "Add the full job description for highly tailored results" },
              { icon: "🔄", tip: "Run multiple passes — optimize first, then roast to find gaps" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                <span>{item.icon}</span>
                <span>{item.tip}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
