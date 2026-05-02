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
    content: "The AI rewrites are genuinely better than what I could produce on my own. Clean output, fast, and the quality is consistently impressive.",
    rating: 5,
  },
  {
    name: "Jordan Kim",
    role: "Marketing Lead",
    company: "Notion",
    avatar: "JK",
    content: "Used five different resume tools before finding ResumeForge. Nothing comes close. The keyword matching feature alone transformed my application results.",
    rating: 5,
  },
  {
    name: "Taylor Brooks",
    role: "Backend Engineer",
    company: "Shopify",
    avatar: "TB",
    content: "My ATS score went from 42 to 87 after one optimization pass. I had no idea how badly formatted my resume was until ResumeForge showed me.",
    rating: 5,
  },
];

const faqs = [
  {
    q: "How does resume optimization work?",
    a: "You paste your resume and optionally a job description. Our AI analyzes the content, restructures it for ATS compatibility, inserts relevant keywords, and rewrites impact statements to be more compelling.",
  },
  {
    q: "What is an ATS Roast?",
    a: "An ATS Roast is a detailed analysis of your resume from the perspective of an Applicant Tracking System. You receive a score, a breakdown of weaknesses, missing keywords, and specific actions to improve your chances.",
  },
  {
    q: "Is my resume data private?",
    a: "Your resume is processed securely on our backend and is not stored on our servers after processing. We recommend omitting sensitive personal details such as your SSN or financial information.",
  },
  {
    q: "How accurate is the ATS scoring?",
    a: "Our ATS analysis is grounded in real ATS evaluation patterns and keyword matching logic. While it is an AI estimate, it closely mirrors how major ATS platforms score resumes in practice.",
  },
  {
    q: "Can I download my optimized resume as a PDF?",
    a: "Yes. Any AI-generated output can be downloaded as a formatted PDF instantly with one click using the built-in export feature.",
  },
  {
    q: "Can I use ResumeForge for multiple job applications?",
    a: "Absolutely. You can run as many optimizations as you need — each tailored to a different job description. There are no limits.",
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
      className="border border-white/[0.06] rounded-xl overflow-hidden bg-white/[0.02]"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-6 py-5 flex items-center justify-between group"
      >
        <span className="font-medium text-white text-sm pr-4 leading-relaxed">{q}</span>
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-violet-400"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <p className="px-6 pb-5 text-muted-foreground text-sm leading-relaxed border-t border-white/[0.05] pt-4">
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
      <section className="relative pt-36 pb-28 sm:pt-44 sm:pb-36 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-violet-600/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-[10%] w-80 h-80 bg-purple-800/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-[10%] w-64 h-64 bg-indigo-800/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] mb-7"
          >
            <span className="text-white">Land More Interviews</span>
            <br />
            <span className="gradient-text">With AI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto mb-12 leading-relaxed"
          >
            AI-powered resume optimization built for modern job seekers.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full sm:w-auto px-8 py-3.5 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-[1.02] glow-purple text-base"
            >
              Start Optimizing
            </button>
            <button
              onClick={() => navigate("/dashboard?mode=roast")}
              className="w-full sm:w-auto px-8 py-3.5 border border-white/10 hover:border-white/20 bg-white/[0.03] hover:bg-white/[0.06] text-white font-semibold rounded-xl transition-all duration-200 hover:scale-[1.02] text-base"
            >
              ATS Resume Roast
            </button>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-white/[0.05] bg-white/[0.015]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {[
              { stat: "50,000+", label: "Resumes Optimized" },
              { stat: "87%", label: "Interview Rate Increase" },
              { stat: "4.9 / 5", label: "User Rating" },
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
      <section id="features" className="py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <span className="inline-block text-violet-400 text-xs font-semibold mb-4 tracking-widest uppercase">What's included</span>
            <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">Everything you need to get hired</h2>
            <p className="text-muted-foreground max-w-md mx-auto text-base">Precision tools that transform your job search from passive to unstoppable.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <FeatureCard key={i} {...f} delay={i * 0.07} />
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-28 bg-white/[0.02] border-y border-white/[0.05]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="inline-block text-violet-400 text-xs font-semibold mb-4 tracking-widest uppercase">Process</span>
            <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">Three steps to your dream job</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Paste Your Resume",
                desc: "Copy and paste your existing resume into the dashboard. Any format works — plain text is best.",
              },
              {
                step: "02",
                title: "Add the Job Description",
                desc: "Paste the listing you're applying for so the AI can tailor your resume to that specific role.",
              },
              {
                step: "03",
                title: "Get Optimized Instantly",
                desc: "Click optimize and receive your ATS-ready, recruiter-approved resume in seconds.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="relative"
              >
                <div className="border border-white/[0.06] bg-white/[0.02] rounded-2xl p-8">
                  <div className="text-6xl font-black text-violet-600/10 absolute top-5 right-6 select-none leading-none">{item.step}</div>
                  <h3 className="text-base font-semibold text-white mb-3 leading-snug">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 -translate-y-1/2 text-white/10 text-xl z-10">→</div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border border-white/[0.06] bg-white/[0.015] rounded-3xl p-8 sm:p-14 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/8 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="relative grid md:grid-cols-2 gap-14 items-center">
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-block text-violet-400 text-xs font-semibold mb-4 tracking-widest uppercase">Intelligence</span>
                <h2 className="text-4xl font-bold text-white mb-5 leading-tight tracking-tight">
                  Built to beat<br />every ATS filter
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-10 text-base">
                  ResumeForge analyzes your resume against real recruiter expectations and ATS scoring patterns — so your application actually gets seen.
                </p>
                <ul className="space-y-4">
                  {[
                    "Deep ATS keyword analysis and insertion",
                    "Industry-specific language and tone calibration",
                    "Quantified impact statement generation",
                    "Job description semantic matching",
                    "Professional cover letter composition",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="w-5 h-5 rounded-full bg-violet-600/15 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
                        <svg className="w-2.5 h-2.5 text-violet-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Score card visual */}
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="border border-white/[0.06] bg-[#0d1121] rounded-2xl p-6 space-y-5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white/40 uppercase tracking-widest">ATS Report</span>
                  <span className="text-xs text-violet-400 font-medium">Just now</span>
                </div>

                <div className="flex items-end gap-4">
                  <div>
                    <p className="text-5xl font-black text-white leading-none">87</p>
                    <p className="text-xs text-muted-foreground mt-1">ATS Score</p>
                  </div>
                  <div className="flex-1 mb-1">
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "87%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/[0.05] pt-4 space-y-3">
                  {[
                    { label: "Keyword Match", value: "94%", color: "text-green-400" },
                    { label: "Formatting", value: "92%", color: "text-green-400" },
                    { label: "Impact Statements", value: "81%", color: "text-amber-400" },
                    { label: "Skills Alignment", value: "88%", color: "text-green-400" },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{row.label}</span>
                      <span className={`font-semibold ${row.color}`}>{row.value}</span>
                    </div>
                  ))}
                </div>

                <div className="border border-violet-500/20 bg-violet-600/5 rounded-xl px-4 py-3">
                  <p className="text-xs text-violet-300 leading-relaxed">
                    Strong keyword density detected. Consider quantifying 2 additional impact statements for maximum score.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-28 bg-white/[0.02] border-y border-white/[0.05]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="inline-block text-violet-400 text-xs font-semibold mb-4 tracking-widest uppercase">Social Proof</span>
            <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">Loved by job seekers</h2>
            <p className="text-muted-foreground text-base">Real results from real people who landed their dream jobs.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {testimonials.map((t, i) => (
              <TestimonialCard key={i} {...t} delay={i * 0.07} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-28">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="inline-block text-violet-400 text-xs font-semibold mb-4 tracking-widest uppercase">FAQ</span>
            <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">Common questions</h2>
          </motion.div>
          <div className="space-y-2">
            {faqs.map((f, i) => (
              <FAQItem key={i} q={f.q} a={f.a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="border border-white/[0.06] bg-white/[0.015] rounded-3xl p-16 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/6 to-purple-800/6 pointer-events-none" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative">
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
                Ready to land your <span className="gradient-text">dream job?</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-10 max-w-md mx-auto">
                Join thousands of job seekers who transformed their resumes and interviews.
              </p>
              <button
                onClick={() => navigate("/dashboard")}
                className="px-10 py-4 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl transition-all duration-200 hover:scale-[1.02] glow-purple text-base"
              >
                Start Optimizing
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.05] py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 2h10v2H3V2zM3 6h10v2H3V6zM3 10h6v2H3v-2z" fill="white" />
              </svg>
            </div>
            <span className="font-bold text-white">ResumeForge AI</span>
          </div>
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} ResumeForge AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
