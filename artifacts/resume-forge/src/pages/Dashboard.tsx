import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { optimizeResume, roastResume, generateCoverLetter } from "@/lib/api";
import { downloadAsPDF } from "@/lib/pdf";
import UploadZone from "@/components/UploadZone";
import ResumePreview from "@/components/ResumePreview";
import TemplateMiniPreview from "@/components/TemplateMiniPreview";
import { TEMPLATES } from "@/data/templates";
import { EXAMPLES } from "@/data/examples";
import { scoreResume } from "@/lib/ats";

type Mode = "optimize" | "roast" | "cover-letter" | null;
type RightTab = "output" | "preview";

const QUOTA_MSG = "AI is currently busy. Please try again in a minute.";
function isQuotaError(msg: string) {
  return msg.toLowerCase().includes("busy") || msg.toLowerCase().includes("quota") || msg.toLowerCase().includes("rate");
}

const LOADING_SEQUENCES: Record<NonNullable<Mode>, string[]> = {
  optimize: ["Analyzing your resume...","Identifying improvement areas...","Inserting ATS keywords...","Polishing action verbs...","Finalizing optimized resume...","Almost there..."],
  roast: ["Scanning your resume...","Running ATS analysis...","Identifying weaknesses...","Scoring your resume...","Compiling feedback...","Almost there..."],
  "cover-letter": ["Reading your experience...","Crafting your opening...","Highlighting key achievements...","Writing closing statement...","Polishing cover letter...","Almost there..."],
};

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

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className={`font-semibold ${color}`}>{value}%</span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${value >= 65 ? "bg-green-500" : value >= 40 ? "bg-amber-500" : "bg-red-500"}`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [, navigate] = useLocation();
  const { user, signOut } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeMode, setActiveMode] = useState<Mode>(null);
  const [error, setError] = useState("");
  const [resultTitle, setResultTitle] = useState("");
  const [loadingStatus, setLoadingStatus] = useState("");
  const [loadingStep, setLoadingStep] = useState(0);
  const [rightTab, setRightTab] = useState<RightTab>("output");
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);

  const atsScore = useMemo(() => scoreResume(resume), [resume]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("mode") === "roast") setActiveMode("roast");

    const templateId = params.get("template");
    if (templateId) {
      const tpl = TEMPLATES.find(t => t.id === templateId);
      if (tpl) {
        setResume(tpl.sampleText);
        setActiveTemplateId(tpl.id);
        setShowTemplates(true);
      }
    }

    const exampleId = params.get("example");
    if (exampleId) {
      const ex = EXAMPLES.find(e => e.id === exampleId);
      if (ex) setResume(ex.content);
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
    setRightTab("output");

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

  const handleOptimize = () => runAction("optimize", () => optimizeResume(resume, jobDescription), "Optimized Resume");
  const handleRoast = () => runAction("roast", () => roastResume(resume, jobDescription), "ATS Roast Analysis");
  const handleCoverLetter = () => runAction("cover-letter", () => generateCoverLetter(resume, jobDescription), "Cover Letter");
  const handleDownloadPDF = () => {
    if (!result) return;
    const filename = activeMode === "cover-letter" ? "cover-letter.pdf" : activeMode === "roast" ? "ats-roast-analysis.pdf" : "optimized-resume.pdf";
    downloadAsPDF(result, filename);
  };
  const handleCopy = () => { if (!result) return; navigator.clipboard.writeText(result).catch(() => {}); };

  const modeButtons = [
    {
      mode: "optimize" as Mode, label: "Optimize Resume", gradient: "from-violet-600 to-purple-700", onClick: handleOptimize,
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
    },
    {
      mode: "roast" as Mode, label: "ATS Roast 🔥", gradient: "from-orange-500 to-red-600", onClick: handleRoast,
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
    },
    {
      mode: "cover-letter" as Mode, label: "Cover Letter", gradient: "from-blue-500 to-cyan-600", onClick: handleCoverLetter,
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
    },
  ];

  const avatarLetter = user?.email?.[0]?.toUpperCase() ?? user?.phone?.[0] ?? "U";
  const displayName = user?.user_metadata?.full_name ?? user?.email ?? user?.phone ?? "User";
  const shortEmail = user?.email
    ? user.email.length > 22 ? user.email.slice(0, 22) + "…" : user.email
    : user?.phone ?? "";

  const handleSignOut = async () => {
    setProfileOpen(false);
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">
      {/* Top Bar */}
      <div className="glass border-b border-white/5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center">
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M3 2h10v2H3V2zM3 6h10v2H3V6zM3 10h6v2H3v-2z" fill="white" /></svg>
            </div>
            <span className="font-bold text-base text-white">Resume<span className="gradient-text-purple">Forge</span></span>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-1.5 ${showTemplates ? "bg-violet-600/20 text-violet-300 border border-violet-500/30" : "bg-white/[0.04] text-muted-foreground hover:text-white border border-white/[0.06]"}`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" /></svg>
              Templates
            </button>

            {/* User profile */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(s => !s)}
                className="flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-xl hover:bg-white/[0.06] border border-transparent hover:border-white/10 transition-all duration-200"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                  {avatarLetter}
                </div>
                <svg className={`w-3 h-3 text-white/30 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute top-full right-0 mt-2 w-52 bg-[#13172a] border border-white/10 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden z-50"
                  >
                    <div className="px-4 py-3 border-b border-white/[0.06]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                          {avatarLetter}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-white truncate">{displayName}</p>
                          <p className="text-xs text-white/40 truncate">{shortEmail}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-1.5 border-t border-white/[0.05]">
                      <button onClick={handleSignOut}
                        className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm text-red-400/80 hover:text-red-400 hover:bg-red-500/[0.08] transition-all duration-150">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">AI Resume Dashboard</h1>
          <p className="text-muted-foreground text-sm">Paste your resume, optionally add a job description, then choose an action.</p>
        </motion.div>

        {/* Template Picker Panel */}
        <AnimatePresence>
          {showTemplates && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mb-6"
            >
              <div className="glass rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" /></svg>
                    Resume Templates
                  </h3>
                  <span className="text-xs text-muted-foreground">Click to load sample content</span>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                  {TEMPLATES.map(tpl => (
                    <button
                      key={tpl.id}
                      onClick={() => { setResume(tpl.sampleText); setActiveTemplateId(tpl.id); }}
                      className={`group relative flex-shrink-0 flex flex-col items-center gap-1.5 p-1.5 rounded-xl transition-all duration-200 w-[88px] ${
                        activeTemplateId === tpl.id
                          ? "bg-violet-600/20 ring-1 ring-violet-500/50"
                          : "hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className="w-full">
                        <TemplateMiniPreview template={tpl} selected={activeTemplateId === tpl.id} />
                      </div>
                      <span className="text-[10px] text-center text-muted-foreground group-hover:text-white transition-colors leading-tight">{tpl.name}</span>
                      {tpl.atsOptimized && (
                        <span className="absolute top-1 right-1 text-[8px] px-1 rounded bg-green-500/20 text-green-400">ATS</span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Examples row */}
                <div className="mt-4 pt-4 border-t border-white/[0.05]">
                  <p className="text-xs text-muted-foreground mb-2 font-medium">Load by role example:</p>
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                    {EXAMPLES.map(ex => (
                      <button
                        key={ex.id}
                        onClick={() => { setResume(ex.content); setActiveTemplateId(null); }}
                        className="flex-shrink-0 text-xs px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-violet-600/15 text-muted-foreground hover:text-violet-300 border border-white/[0.06] hover:border-violet-500/30 transition-all duration-200 whitespace-nowrap"
                      >
                        {ex.role}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        <AnimatePresence>
          {error && (() => {
            const isQuota = isQuotaError(error);
            return (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`mb-6 flex items-start gap-3 rounded-xl px-4 py-3 ${isQuota ? "bg-amber-500/10 border border-amber-500/30" : "bg-red-500/10 border border-red-500/30"}`}
              >
                {isQuota ? (
                  <svg className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                ) : (
                  <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                )}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${isQuota ? "text-amber-300" : "text-red-300"}`}>{error}</p>
                  {isQuota && (
                    <button onClick={() => { setError(""); if (activeMode) document.getElementById(`btn-${activeMode}`)?.click(); }}
                      className="mt-2 text-xs text-amber-400 hover:text-amber-300 underline underline-offset-2 transition-colors">
                      Try again
                    </button>
                  )}
                </div>
                <button onClick={() => setError("")} className={`flex-shrink-0 ${isQuota ? "text-amber-400 hover:text-amber-300" : "text-red-400 hover:text-red-300"} transition-colors`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </motion.div>
            );
          })()}
        </AnimatePresence>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Left: Inputs */}
          <div className="space-y-5">
            {/* Resume Input */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="glass rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-white flex items-center gap-2">
                  <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  Your Resume <span className="text-red-400">*</span>
                </label>
                <button onClick={() => setResume(SAMPLE_RESUME)}
                  className="text-xs text-violet-400 hover:text-violet-300 transition-colors bg-violet-600/10 hover:bg-violet-600/20 px-2.5 py-1 rounded-lg">
                  Load Sample
                </button>
              </div>
              <UploadZone accent="violet" onExtracted={(text) => setResume(text)} />
              <textarea
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                placeholder="Paste your resume here, or upload a file above..."
                rows={12}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all scrollbar-thin"
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-muted-foreground">{resume.length} characters</p>
                {resume.length > 50 && (
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold ${atsScore.color}`}>{atsScore.label}</span>
                    <div className="flex items-center gap-1">
                      <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${atsScore.overall >= 65 ? "bg-green-500" : atsScore.overall >= 40 ? "bg-amber-500" : "bg-red-500"}`}
                          animate={{ width: `${atsScore.overall}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      <span className={`text-xs font-bold ${atsScore.color}`}>{atsScore.overall}</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Job Description */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }} className="glass rounded-2xl p-5">
              <label className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                Job Description
                <span className="text-xs text-muted-foreground font-normal">(optional but recommended)</span>
              </label>
              <UploadZone accent="blue" onExtracted={(text) => setJobDescription(text)} />
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here, or upload a file above..."
                rows={6}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all scrollbar-thin"
              />
            </motion.div>

            {/* Action Buttons */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="grid grid-cols-3 gap-3">
              {modeButtons.map((btn) => (
                <button
                  key={btn.mode}
                  id={`btn-${btn.mode}`}
                  onClick={btn.onClick}
                  disabled={loading}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 px-3 py-3 rounded-xl text-white text-xs sm:text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-br ${btn.gradient} hover:scale-105 hover:shadow-lg active:scale-95 ${activeMode === btn.mode && loading ? "animate-pulse-glow" : ""}`}
                >
                  {btn.icon}
                  <span className="text-center leading-tight">{btn.label}</span>
                </button>
              ))}
            </motion.div>

            {/* ATS Score Panel */}
            <AnimatePresence>
              {resume.length > 100 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="glass rounded-2xl p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-semibold text-white flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                      Quick ATS Analysis
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-black ${atsScore.color}`}>{atsScore.overall}</span>
                      <span className="text-xs text-muted-foreground">/ 100</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        atsScore.overall >= 65 ? "bg-green-500/10 text-green-400" :
                        atsScore.overall >= 40 ? "bg-amber-500/10 text-amber-400" : "bg-red-500/10 text-red-400"
                      }`}>{atsScore.label}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <ScoreBar label="Keyword Density" value={atsScore.keywordDensity} color={atsScore.keywordDensity >= 65 ? "text-green-400" : "text-amber-400"} />
                    <ScoreBar label="Sections" value={atsScore.sections} color={atsScore.sections >= 65 ? "text-green-400" : "text-amber-400"} />
                    <ScoreBar label="Impact Statements" value={atsScore.impactStatements} color={atsScore.impactStatements >= 65 ? "text-green-400" : "text-amber-400"} />
                    <ScoreBar label="Formatting" value={atsScore.formatting} color={atsScore.formatting >= 65 ? "text-green-400" : "text-amber-400"} />
                  </div>
                  {atsScore.overall < 65 && (
                    <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-white/[0.05]">
                      💡 Use <span className="text-violet-400 font-medium">Optimize Resume</span> to improve your ATS score automatically.
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Output */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }} className="glass rounded-2xl flex flex-col min-h-[500px]">
            {/* Tab bar */}
            <div className="flex items-center justify-between px-5 pt-4 pb-0 border-b border-white/[0.05] mb-0">
              <div className="flex gap-1">
                <button
                  onClick={() => setRightTab("output")}
                  className={`flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-t-lg transition-all -mb-px border-b-2 ${rightTab === "output" ? "text-white border-violet-500 bg-violet-500/5" : "text-muted-foreground border-transparent hover:text-white"}`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  {resultTitle || "AI Output"}
                </button>
                <button
                  onClick={() => setRightTab("preview")}
                  className={`flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-t-lg transition-all -mb-px border-b-2 ${rightTab === "preview" ? "text-white border-violet-500 bg-violet-500/5" : "text-muted-foreground border-transparent hover:text-white"}`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  Live Preview
                </button>
              </div>
              {result && !loading && rightTab === "output" && (
                <div className="flex items-center gap-2 pb-1">
                  <button onClick={handleCopy} className="text-xs text-muted-foreground hover:text-white transition-colors flex items-center gap-1 px-2.5 py-1.5 glass-light rounded-lg">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    Copy
                  </button>
                  <button onClick={handleDownloadPDF} className="text-xs text-white font-medium flex items-center gap-1 px-3 py-1.5 bg-violet-600 hover:bg-violet-500 rounded-lg transition-all">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    PDF
                  </button>
                </div>
              )}
            </div>

            {/* Panel body */}
            <div className="flex-1 relative p-5">
              <AnimatePresence mode="wait">
                {rightTab === "preview" ? (
                  <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="h-full min-h-[420px]">
                    <ResumePreview text={resume} accentColor={activeTemplateId ? TEMPLATES.find(t => t.id === activeTemplateId)?.accentColor : "#7c3aed"} />
                  </motion.div>
                ) : loading ? (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full border-2 border-violet-600/20 border-t-violet-500 animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full border-2 border-purple-600/20 border-t-purple-400 animate-spin" style={{ animationDirection: "reverse", animationDuration: "0.6s" }} />
                      </div>
                    </div>
                    <div className="text-center">
                      <AnimatePresence mode="wait">
                        <motion.p key={loadingStatus} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }} className="text-white font-medium mb-1">
                          {loadingStatus}
                        </motion.p>
                      </AnimatePresence>
                      <p className="text-muted-foreground text-sm">Usually 10–30 seconds</p>
                    </div>
                    <div className="flex gap-2 mt-2 items-center">
                      {(activeMode ? LOADING_SEQUENCES[activeMode] : []).map((_, i) => (
                        <div key={i} className={`rounded-full transition-all duration-500 ${i <= loadingStep ? "w-2 h-2 bg-violet-500" : "w-1.5 h-1.5 bg-violet-500/20"}`} />
                      ))}
                    </div>
                  </motion.div>
                ) : result ? (
                  <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="h-full">
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
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center p-8">
                    <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center mb-2">
                      <svg className="w-8 h-8 text-violet-400/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <p className="text-muted-foreground text-sm font-medium">Your AI output will appear here</p>
                    <p className="text-muted-foreground/60 text-xs max-w-xs">Paste your resume on the left, then click one of the action buttons to get started.</p>
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="mt-6 glass rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
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
