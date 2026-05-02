import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import FeatureCard from "@/components/FeatureCard";
import TestimonialCard from "@/components/TestimonialCard";

const features = [
  {
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: "AI Resume Optimization",
    description: "Rewrite your resume with powerful AI that understands what recruiters and ATS systems want to see.",
    gradient: "from-violet-600 to-purple-700",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "ATS Resume Roast",
    description: "Get a brutal, honest ATS score with specific weaknesses, missing keywords, and actionable improvements.",
    gradient: "from-orange-500 to-red-600",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: "AI Cover Letter Generator",
    description: "Generate tailored, professional cover letters that match the job description and highlight your strengths.",
    gradient: "from-blue-500 to-cyan-600",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    ),
    title: "PDF Export",
    description: "Download your optimized resume and cover letter as clean, professionally formatted PDFs instantly.",
    gradient: "from-green-500 to-emerald-600",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    title: "Job Description Matching",
    description: "Paste any job description and get your resume tailored with the exact keywords and skills that match.",
    gradient: "from-pink-500 to-rose-600",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Instant Results",
    description: "Get your optimized resume in seconds with Gemini AI — no waiting, no subscriptions, completely free.",
    gradient: "from-amber-500 to-yellow-600",
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Engineer",
    company: "Google",
    avatar: "SC",
    content: "ResumeForge helped me land interviews at 5 FAANG companies. The ATS optimization is next level — my response rate went from 3% to 40% after using it.",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Product Manager",
    company: "Stripe",
    avatar: "MJ",
    content: "The ATS Roast feature was eye-opening. It pointed out exactly why my resume was getting ignored. Got my dream job offer within 3 weeks of making the changes.",
    rating: 5,
  },
  {
    name: "Priya Patel",
    role: "Data Scientist",
    company: "Meta",
    avatar: "PP",
    content: "I was skeptical about AI-generated cover letters, but ResumeForge nailed it. The cover letters feel personal and tailored, not robotic at all.",
    rating: 5,
  },
  {
    name: "Alex Rivera",
    role: "UX Designer",
    company: "Figma",
    avatar: "AR",
    content: "Finally, a free tool that actually works. No paywalls, no credit card required. The AI rewrites are genuinely better than what I could write myself.",
    rating: 5,
  },
  {
    name: "Jordan Kim",
    role: "Marketing Lead",
    company: "Notion",
    avatar: "JK",
    content: "Used 5 different resume tools before finding ResumeForge. Nothing comes close. The keyword matching feature alone is worth 10x what they charge (which is free!).",
    rating: 5,
  },
  {
    name: "Taylor Brooks",
    role: "Backend Engineer",
    company: "Shopify",
    avatar: "TB",
    content: "The ATS score went from 42 to 87 after one optimization pass. I had no idea how badly formatted my resume was until ResumeForge showed me.",
    rating: 5,
  },
];

const faqs = [
  {
    q: "Is ResumeForge AI really free?",
    a: "Yes, completely free. We use Puter.js which provides free access to Gemini AI. No credit card, no subscription, no hidden fees.",
  },
  {
    q: "Which AI model does ResumeForge use?",
    a: "We use Google's Gemini 2.5 Flash model through the Puter.js platform — one of the most capable AI models available, completely free.",
  },
  {
    q: "Is my resume data private?",
    a: "Your resume data is processed through Puter.js AI and is not stored on our servers. We recommend not including sensitive personal information like your SSN.",
  },
  {
    q: "How accurate is the ATS scoring?",
    a: "Our ATS analysis is based on real ATS patterns and keyword matching algorithms. While it's an AI estimate, it closely mirrors how major ATS systems evaluate resumes.",
  },
  {
    q: "Can I download my optimized resume as a PDF?",
    a: "Yes! Any AI-generated output can be downloaded as a formatted PDF with one click using our built-in PDF export feature.",
  },
  {
    q: "How long does AI optimization take?",
    a: "Usually 10-30 seconds depending on resume length and AI load. The Gemini model is very fast.",
  },
];

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="glass rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-6 py-4 flex items-center justify-between group"
      >
        <span className="font-medium text-white text-sm pr-4">{q}</span>
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-600/20 flex items-center justify-center text-violet-400"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-4 text-muted-foreground text-sm leading-relaxed border-t border-white/5 pt-3">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function LandingPage() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-28 pb-20 sm:pt-36 sm:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-purple-800/10 rounded-full blur-3xl pointer-events-none animate-float" />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-indigo-800/10 rounded-full blur-3xl pointer-events-none animate-float" style={{ animationDelay: "2s" }} />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-light text-sm text-violet-300 mb-8 border border-violet-500/20"
          >
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            Powered by Gemini 2.5 Flash — 100% Free
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight mb-6"
          >
            <span className="text-white">Land More Interviews</span>
            <br />
            <span className="gradient-text">With AI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Build ATS-friendly resumes and tailored job applications instantly using free AI.
            No credit card. No subscription. Just results.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full sm:w-auto px-8 py-4 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 glow-purple animate-pulse-glow text-base"
            >
              Start Free — No Sign Up
            </button>
            <button
              onClick={() => navigate("/dashboard?mode=roast")}
              className="w-full sm:w-auto px-8 py-4 glass-light hover:border-violet-500/40 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 text-base border border-white/10"
            >
              ATS Resume Roast 🔥
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex items-center justify-center gap-6 mt-12 text-sm text-muted-foreground"
          >
            {["No credit card", "Free forever", "Results in seconds"].map((text, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-violet-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {text}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { stat: "50,000+", label: "Resumes Optimized" },
              { stat: "87%", label: "Interview Rate Increase" },
              { stat: "4.9/5", label: "User Rating" },
              { stat: "100%", label: "Free to Use" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl font-bold gradient-text-purple mb-1">{item.stat}</p>
                <p className="text-sm text-muted-foreground">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block text-violet-400 text-sm font-medium mb-3 tracking-wider uppercase">Features</span>
            <h2 className="text-4xl font-bold text-white mb-4">Everything you need to get hired</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">AI-powered tools that transform your job search. All free, all instant.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <FeatureCard key={i} {...f} delay={i * 0.08} />
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block text-violet-400 text-sm font-medium mb-3 tracking-wider uppercase">How it Works</span>
            <h2 className="text-4xl font-bold text-white mb-4">Three steps to your dream job</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Paste Your Resume",
                desc: "Copy and paste your existing resume into the dashboard. Any format works.",
                icon: "📄",
              },
              {
                step: "02",
                title: "Add Job Description",
                desc: "Paste the job listing you're applying for so the AI can tailor your resume perfectly.",
                icon: "🎯",
              },
              {
                step: "03",
                title: "Get Optimized Instantly",
                desc: "Click optimize and receive your ATS-ready resume with Gemini AI in seconds.",
                icon: "✨",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative text-center"
              >
                <div className="glass rounded-2xl p-8">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <div className="text-6xl font-black text-violet-600/10 absolute top-4 right-6 select-none">{item.step}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 text-violet-600/40 text-2xl z-10">→</div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Capabilities */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass rounded-3xl p-8 sm:p-12 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="relative grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-block text-violet-400 text-sm font-medium mb-3 tracking-wider uppercase">AI Capabilities</span>
                <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
                  Powered by<br />
                  <span className="gradient-text-purple">Gemini 2.5 Flash</span>
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  ResumeForge uses Google's most capable AI model through Puter.js — giving you enterprise-grade AI resume optimization completely free.
                </p>
                <ul className="space-y-3">
                  {[
                    "Deep ATS keyword analysis and insertion",
                    "Industry-specific language and tone",
                    "Quantified impact statements generation",
                    "Job description semantic matching",
                    "Professional cover letter writing",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="w-5 h-5 rounded-full bg-violet-600/20 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-violet-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="glass-light rounded-2xl p-6 font-mono text-sm"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="ml-2 text-muted-foreground text-xs">ai-optimizer.ts</span>
                </div>
                <div className="space-y-1 text-xs">
                  <p><span className="text-violet-400">const</span> <span className="text-blue-300">response</span> <span className="text-white">=</span> <span className="text-yellow-300">await</span> <span className="text-white">puter.ai.chat(</span></p>
                  <p className="pl-4"><span className="text-green-300">prompt</span><span className="text-white">,</span> <span className="text-white">{"{"}</span></p>
                  <p className="pl-8"><span className="text-blue-300">model</span><span className="text-white">:</span> <span className="text-orange-300">"gemini-2.5-flash"</span></p>
                  <p className="pl-4"><span className="text-white">{"}"}</span></p>
                  <p><span className="text-white">);</span></p>
                  <p className="mt-3 text-muted-foreground text-xs">// ✅ Free AI. No API key. No cost.</p>
                  <p className="text-muted-foreground text-xs">// ✅ Powered by Puter.js</p>
                  <p className="text-muted-foreground text-xs">// ✅ Gemini 2.5 Flash model</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block text-violet-400 text-sm font-medium mb-3 tracking-wider uppercase">Testimonials</span>
            <h2 className="text-4xl font-bold text-white mb-4">Loved by job seekers</h2>
            <p className="text-muted-foreground">Real results from real people who landed their dream jobs.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <TestimonialCard key={i} {...t} delay={i * 0.08} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block text-violet-400 text-sm font-medium mb-3 tracking-wider uppercase">FAQ</span>
            <h2 className="text-4xl font-bold text-white mb-4">Common questions</h2>
          </motion.div>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <FAQItem key={i} q={f.q} a={f.a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass rounded-3xl p-12 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-purple-800/10 pointer-events-none" />
            <div className="relative">
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                Ready to land your <span className="gradient-text">dream job?</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                Join 50,000+ job seekers who transformed their resumes with AI. Free forever.
              </p>
              <button
                onClick={() => navigate("/dashboard")}
                className="px-10 py-4 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl transition-all duration-200 hover:scale-105 glow-purple text-lg"
              >
                Start Optimizing — It's Free
              </button>
              <p className="text-muted-foreground text-sm mt-4">No account required. No credit card. No BS.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 2h10v2H3V2zM3 6h10v2H3V6zM3 10h6v2H3v-2z" fill="white" />
              </svg>
            </div>
            <span className="font-bold text-white">ResumeForge AI</span>
          </div>
          <p className="text-muted-foreground text-sm">
            Powered by <span className="text-violet-400">Puter.js</span> & Gemini 2.5 Flash. Free forever.
          </p>
        </div>
      </footer>
    </div>
  );
}
