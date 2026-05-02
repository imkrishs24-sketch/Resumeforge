import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import FeatureCard from "@/components/FeatureCard";
import TestimonialCard from "@/components/TestimonialCard";
import TemplateMiniPreview from "@/components/TemplateMiniPreview";
import { TEMPLATES } from "@/data/templates";
import { EXAMPLES } from "@/data/examples";

const features = [
  {
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: "Resume Optimization",
    description: "Intelligently rewrite your resume to highlight impact, match recruiter expectations, and pass every ATS filter.",
    gradient: "from-violet-600 to-purple-700",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "ATS Resume Roast",
    description: "Get a candid, detailed ATS score with specific weaknesses, missing keywords, and precise improvement actions.",
    gradient: "from-orange-500 to-red-600",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: "Cover Letter Generator",
    description: "Generate tailored, compelling cover letters that align with any job description and make a lasting impression.",
    gradient: "from-blue-500 to-cyan-600",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    ),
    title: "PDF Export",
    description: "Download your optimized resume and cover letter as clean, professionally formatted PDFs in one click.",
    gradient: "from-green-500 to-emerald-600",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    title: "Job Description Matching",
    description: "Paste any job listing and get your resume precisely tailored with the exact keywords and skills that match.",
    gradient: "from-pink-500 to-rose-600",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Instant Results",
    description: "Receive your fully optimized resume in seconds — no waiting, no friction, no complexity.",
    gradient: "from-amber-500 to-yellow-600",
  },
];

const testimonials = [
  { name: "Sarah Chen", role: "Software Engineer", company: "Google", avatar: "SC", content: "ResumeForge helped me land interviews at 5 FAANG companies. The ATS optimization is next level — my response rate went from 3% to 40% after using it.", rating: 5 },
  { name: "Marcus Johnson", role: "Product Manager", company: "Stripe", avatar: "MJ", content: "The ATS Roast feature was eye-opening. It pointed out exactly why my resume was getting ignored. Got my dream job offer within 3 weeks of making the changes.", rating: 5 },
  { name: "Priya Patel", role: "Data Scientist", company: "Meta", avatar: "PP", content: "I was skeptical about AI-generated cover letters, but ResumeForge nailed it. The cover letters feel personal and tailored, not robotic at all.", rating: 5 },
  { name: "Alex Rivera", role: "UX Designer", company: "Figma", avatar: "AR", content: "The AI rewrites are genuinely better than what I could produce on my own. Clean output, fast, and the quality is consistently impressive.", rating: 5 },
  { name: "Jordan Kim", role: "Marketing Lead", company: "Notion", avatar: "JK", content: "Used five different resume tools before finding ResumeForge. Nothing comes close. The keyword matching feature alone transformed my application results.", rating: 5 },
  { name: "Taylor Brooks", role: "Backend Engineer", company: "Shopify", avatar: "TB", content: "My ATS score went from 42 to 87 after one optimization pass. I had no idea how badly formatted my resume was until ResumeForge showed me.", rating: 5 },
];

const faqs = [
  { q: "How does resume optimization work?", a: "You paste your resume and optionally a job description. Our AI analyzes the content, restructures it for ATS compatibility, inserts relevant keywords, and rewrites impact statements to be more compelling." },
  { q: "What is an ATS Roast?", a: "An ATS Roast is a detailed analysis of your resume from the perspective of an Applicant Tracking System. You receive a score, a breakdown of weaknesses, missing keywords, and specific actions to improve your chances." },
  { q: "Is my resume data private?", a: "Your resume is processed securely on our backend and is not stored on our servers after processing. We recommend omitting sensitive personal details such as your SSN or financial information." },
  { q: "How accurate is the ATS scoring?", a: "Our ATS analysis is grounded in real ATS evaluation patterns and keyword matching logic. While it is an AI estimate, it closely mirrors how major ATS platforms score resumes in practice." },
  { q: "Can I download my optimized resume as a PDF?", a: "Yes. Any AI-generated output can be downloaded as a formatted PDF instantly with one click using the built-in export feature." },
  { q: "Can I use ResumeForge for multiple job applications?", a: "Absolutely. You can run as many optimizations as you need — each tailored to a different job description. There are no limits." },
];

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className="border border-white/[0.06] rounded-xl overflow-hidden bg-white/[0.02]"
    >
      <button onClick={() => setOpen(!open)} className="w-full text-left px-5 py-4 sm:px-6 sm:py-5 flex items-start justify-between gap-4 group">
        <span className="font-medium text-white text-sm leading-relaxed">{q}</span>
        <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 mt-0.5 w-5 h-5 flex items-center justify-center text-violet-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
            <p className="px-5 pb-5 sm:px-6 text-muted-foreground text-sm leading-relaxed border-t border-white/[0.05] pt-4">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const sectionPy = "py-16 sm:py-20 lg:py-28";
const sectionHeadingMb = "mb-10 sm:mb-14 lg:mb-20";
const h2Class = "text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight";

const TEMPLATE_CATEGORIES = ["All", "Modern", "Minimal", "Professional", "Executive", "ATS-Friendly", "Software Engineer", "Student", "Creative", "Corporate", "Elegant"];

export default function LandingPage() {
  const [, navigate] = useLocation();
  const [activeCategory, setActiveCategory] = useState("All");
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  const filteredTemplates = activeCategory === "All"
    ? TEMPLATES
    : TEMPLATES.filter(t => t.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white overflow-x-hidden">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative pt-28 pb-20 sm:pt-36 sm:pb-24 lg:pt-44 lg:pb-36 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(700px,100vw)] h-[min(700px,100vw)] bg-violet-600/[0.07] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-16 right-0 w-[min(320px,60vw)] h-[min(320px,60vw)] bg-purple-800/[0.07] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-0 w-[min(256px,50vw)] h-[min(256px,50vw)] bg-indigo-800/[0.07] rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] mb-5 sm:mb-7">
            <span className="text-white">Land More Interviews</span><br />
            <span className="gradient-text">With AI</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}
            className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-xl mx-auto mb-8 sm:mb-12 leading-relaxed">
            AI-powered resume optimization built for modern job seekers.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 max-w-xs sm:max-w-none mx-auto">
            <button onClick={() => navigate("/dashboard")}
              className="px-8 py-3.5 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] glow-purple text-base whitespace-nowrap">
              Start Optimizing
            </button>
            <button onClick={() => navigate("/dashboard?mode=roast")}
              className="px-8 py-3.5 border border-white/10 hover:border-white/20 bg-white/[0.03] hover:bg-white/[0.06] text-white font-semibold rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] text-base whitespace-nowrap">
              ATS Resume Roast
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="border-y border-white/[0.05] bg-white/[0.015]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="grid grid-cols-3 gap-4 sm:gap-8 lg:gap-10">
            {[
              { stat: "50,000+", label: "Resumes Optimized" },
              { stat: "87%", label: "Interview Rate Increase" },
              { stat: "4.9 / 5", label: "User Rating" },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }} className="text-center">
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold gradient-text-purple mb-1 leading-tight">{item.stat}</p>
                <p className="text-xs sm:text-sm text-muted-foreground leading-snug">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className={sectionPy}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className={`text-center ${sectionHeadingMb}`}>
            <span className="inline-block text-violet-400 text-xs font-semibold mb-3 tracking-widest uppercase">What's included</span>
            <h2 className={`${h2Class} mb-3`}>Everything you need to get hired</h2>
            <p className="text-muted-foreground max-w-sm sm:max-w-md mx-auto text-sm sm:text-base">Precision tools that transform your job search from passive to unstoppable.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {features.map((f, i) => <FeatureCard key={i} {...f} delay={i * 0.06} />)}
          </div>
        </div>
      </section>

      {/* ── How it Works ── */}
      <section id="how-it-works" className={`${sectionPy} bg-white/[0.02] border-y border-white/[0.05]`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`text-center ${sectionHeadingMb}`}>
            <span className="inline-block text-violet-400 text-xs font-semibold mb-3 tracking-widest uppercase">Process</span>
            <h2 className={h2Class}>Three steps to your dream job</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {[
              { step: "01", title: "Paste Your Resume", desc: "Copy and paste your existing resume into the dashboard. Any format works — plain text is best." },
              { step: "02", title: "Add the Job Description", desc: "Paste the listing you're applying for so the AI can tailor your resume to that specific role." },
              { step: "03", title: "Get Optimized Instantly", desc: "Click optimize and receive your ATS-ready, recruiter-approved resume in seconds." },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.1 }} className="relative">
                <div className="border border-white/[0.06] bg-white/[0.02] rounded-2xl p-6 sm:p-7 h-full">
                  <div className="text-5xl sm:text-6xl font-black text-violet-600/10 absolute top-4 right-5 select-none leading-none">{item.step}</div>
                  <h3 className="text-sm sm:text-base font-semibold text-white mb-2 sm:mb-3 leading-snug pr-8">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </div>
                {i < 2 && <div className="hidden sm:block absolute top-1/2 -right-3 -translate-y-1/2 text-white/10 text-lg z-10">→</div>}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Capabilities ── */}
      <section className={sectionPy}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border border-white/[0.06] bg-white/[0.015] rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-14 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-72 h-72 bg-violet-600/[0.07] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }}>
                <span className="inline-block text-violet-400 text-xs font-semibold mb-3 tracking-widest uppercase">Intelligence</span>
                <h2 className={`${h2Class} mb-4 sm:mb-5`}>Built to beat<br />every ATS filter</h2>
                <p className="text-muted-foreground leading-relaxed mb-8 sm:mb-10 text-sm sm:text-base">ResumeForge analyzes your resume against real recruiter expectations and ATS scoring patterns — so your application actually gets seen.</p>
                <ul className="space-y-3 sm:space-y-4">
                  {["Deep ATS keyword analysis and insertion","Industry-specific language and tone calibration","Quantified impact statement generation","Job description semantic matching","Professional cover letter composition"].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <span className="mt-0.5 w-5 h-5 rounded-full bg-violet-600/15 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
                        <svg className="w-2.5 h-2.5 text-violet-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }} className="border border-white/[0.06] bg-[#0d1121] rounded-2xl p-5 sm:p-6 space-y-4 sm:space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white/40 uppercase tracking-widest">ATS Report</span>
                  <span className="text-xs text-violet-400 font-medium">Just now</span>
                </div>
                <div className="flex items-end gap-4">
                  <div>
                    <p className="text-4xl sm:text-5xl font-black text-white leading-none">87</p>
                    <p className="text-xs text-muted-foreground mt-1">ATS Score</p>
                  </div>
                  <div className="flex-1 mb-1">
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <motion.div initial={{ width: 0 }} whileInView={{ width: "87%" }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.3, ease: "easeOut" }} className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-400" />
                    </div>
                  </div>
                </div>
                <div className="border-t border-white/[0.05] pt-3 sm:pt-4 space-y-2.5 sm:space-y-3">
                  {[{ label: "Keyword Match", value: "94%", color: "text-green-400" },{ label: "Formatting", value: "92%", color: "text-green-400" },{ label: "Impact Statements", value: "81%", color: "text-amber-400" },{ label: "Skills Alignment", value: "88%", color: "text-green-400" }].map((row, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{row.label}</span>
                      <span className={`font-semibold ${row.color}`}>{row.value}</span>
                    </div>
                  ))}
                </div>
                <div className="border border-violet-500/20 bg-violet-600/5 rounded-xl px-3 py-2.5 sm:px-4 sm:py-3">
                  <p className="text-xs text-violet-300 leading-relaxed">Strong keyword density detected. Consider quantifying 2 additional impact statements for maximum score.</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Template Gallery ── */}
      <section id="templates" className={`${sectionPy} bg-white/[0.02] border-y border-white/[0.05]`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`text-center ${sectionHeadingMb}`}>
            <span className="inline-block text-violet-400 text-xs font-semibold mb-3 tracking-widest uppercase">Templates</span>
            <h2 className={`${h2Class} mb-3`}>Professional resume templates</h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto">ATS-optimized layouts for every industry and career stage. Click any template to start using it.</p>
          </motion.div>

          {/* Category filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-thin">
            {TEMPLATE_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-violet-600 text-white"
                    : "bg-white/[0.04] text-muted-foreground hover:text-white hover:bg-white/[0.08] border border-white/[0.06]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Template grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {filteredTemplates.map((template, i) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                onMouseEnter={() => setHoveredTemplate(template.id)}
                onMouseLeave={() => setHoveredTemplate(null)}
                className="group relative"
              >
                <div className="border border-white/[0.08] hover:border-violet-500/40 bg-white/[0.02] hover:bg-white/[0.04] rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/10 hover:-translate-y-1">
                  {/* Preview */}
                  <div className="p-3 bg-white/[0.02]">
                    <TemplateMiniPreview template={template} selected={hoveredTemplate === template.id} />
                  </div>

                  {/* Card info */}
                  <div className="p-4 border-t border-white/[0.05]">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h3 className="text-sm font-semibold text-white leading-tight">{template.name}</h3>
                      {template.atsOptimized && (
                        <span className="flex-shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-green-500/15 text-green-400 border border-green-500/20">
                          ATS ✓
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{template.description}</p>
                    <button
                      onClick={() => {
                        const params = new URLSearchParams({ template: template.id });
                        navigate(`/dashboard?${params.toString()}`);
                      }}
                      className="w-full text-xs font-medium py-2 rounded-lg bg-violet-600/15 hover:bg-violet-600/30 text-violet-300 hover:text-white border border-violet-500/20 hover:border-violet-500/40 transition-all duration-200"
                    >
                      Use Template →
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Resume Examples ── */}
      <section id="examples" className={sectionPy}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`text-center ${sectionHeadingMb}`}>
            <span className="inline-block text-violet-400 text-xs font-semibold mb-3 tracking-widest uppercase">Examples</span>
            <h2 className={`${h2Class} mb-3`}>Resume examples by role</h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto">Real sample resumes for your industry. Use any as a starting point and let AI tailor it further.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {EXAMPLES.map((example, i) => (
              <motion.div
                key={example.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
              >
                <div className="border border-white/[0.06] hover:border-violet-500/30 bg-white/[0.02] hover:bg-white/[0.04] rounded-xl p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-500/5 h-full flex flex-col">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600/20 to-purple-700/20 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white leading-tight">{example.role}</p>
                      <p className="text-xs text-violet-400">{example.industry}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4 flex-1">{example.description}</p>
                  <button
                    onClick={() => {
                      const params = new URLSearchParams({ example: example.id });
                      navigate(`/dashboard?${params.toString()}`);
                    }}
                    className="w-full text-xs font-medium py-2 rounded-lg bg-white/[0.04] hover:bg-violet-600/20 text-muted-foreground hover:text-violet-300 border border-white/[0.06] hover:border-violet-500/30 transition-all duration-200"
                  >
                    Use Example →
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" className={`${sectionPy} bg-white/[0.02] border-y border-white/[0.05]`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`text-center ${sectionHeadingMb}`}>
            <span className="inline-block text-violet-400 text-xs font-semibold mb-3 tracking-widest uppercase">Social Proof</span>
            <h2 className={`${h2Class} mb-3`}>Loved by job seekers</h2>
            <p className="text-muted-foreground text-sm sm:text-base">Real results from real people who landed their dream jobs.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {testimonials.map((t, i) => <TestimonialCard key={i} {...t} delay={i * 0.06} />)}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className={sectionPy}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`text-center ${sectionHeadingMb}`}>
            <span className="inline-block text-violet-400 text-xs font-semibold mb-3 tracking-widest uppercase">FAQ</span>
            <h2 className={h2Class}>Common questions</h2>
          </motion.div>
          <div className="space-y-2">
            {faqs.map((f, i) => <FAQItem key={i} q={f.q} a={f.a} index={i} />)}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className={sectionPy}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.55 }}
            className="border border-white/[0.06] bg-white/[0.015] rounded-2xl sm:rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-purple-800/5 pointer-events-none" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-violet-600/[0.08] rounded-full blur-3xl pointer-events-none" />
            <div className="relative">
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 tracking-tight">Ready to land your <span className="gradient-text">dream job?</span></h2>
              <p className="text-muted-foreground text-sm sm:text-base lg:text-lg mb-8 sm:mb-10 max-w-md mx-auto leading-relaxed">Join thousands of job seekers who transformed their resumes and interviews.</p>
              <button onClick={() => navigate("/dashboard")}
                className="px-8 sm:px-10 py-3.5 sm:py-4 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] glow-purple text-sm sm:text-base">
                Start Optimizing
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.05] py-8 sm:py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 2h10v2H3V2zM3 6h10v2H3V6zM3 10h6v2H3v-2z" fill="white" /></svg>
            </div>
            <span className="font-bold text-white">ResumeForge AI</span>
          </div>
          <p className="text-muted-foreground text-xs sm:text-sm">© {new Date().getFullYear()} ResumeForge AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
