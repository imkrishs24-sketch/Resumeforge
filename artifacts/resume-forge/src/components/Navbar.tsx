import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";

const NAV_LINKS = [
  { label: "Features", id: "features" },
  { label: "Templates", id: "templates" },
  { label: "Examples", id: "examples" },
  { label: "How it Works", id: "how-it-works" },
  { label: "FAQ", id: "faq" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [, navigate] = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#0B0F19]/90 backdrop-blur-xl border-b border-white/[0.05]" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 sm:gap-2.5 group flex-shrink-0"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 2h10v2H3V2zM3 6h10v2H3V6zM3 10h6v2H3v-2z" fill="white" />
              </svg>
            </div>
            <span className="font-bold text-sm sm:text-base text-white tracking-tight whitespace-nowrap">
              Resume<span className="gradient-text-purple">Forge</span>
            </span>
          </button>

          {/* Desktop nav — only show on lg+ to prevent overflow at tablet */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {NAV_LINKS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="text-sm text-white/40 hover:text-white transition-colors duration-200 whitespace-nowrap"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-sm font-medium bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:scale-[1.02] whitespace-nowrap"
            >
              Get Started
            </button>
          </div>

          {/* Tablet CTA (sm–lg range: show button but no nav links) */}
          <div className="hidden sm:flex lg:hidden items-center gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-sm font-medium bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap"
            >
              Get Started
            </button>
            <button
              className="text-white/60 hover:text-white p-1.5 transition-colors rounded-md hover:bg-white/5"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <AnimatePresence mode="wait" initial={false}>
                  {menuOpen
                    ? <motion.path key="x" initial={{ opacity: 0 }} animate={{ opacity: 1 }} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    : <motion.path key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  }
                </AnimatePresence>
              </svg>
            </button>
          </div>

          {/* Mobile hamburger only */}
          <button
            className="sm:hidden text-white/60 hover:text-white p-1.5 transition-colors rounded-md hover:bg-white/5"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile / tablet dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden bg-[#0B0F19]/97 backdrop-blur-xl border-t border-white/[0.05] overflow-hidden"
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 space-y-1">
              {NAV_LINKS.map((item, i) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.04 }}
                  onClick={() => scrollTo(item.id)}
                  className="flex items-center gap-3 w-full text-left text-sm text-white/60 hover:text-white py-3 px-3 rounded-xl hover:bg-white/[0.04] transition-all duration-200"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500/50 flex-shrink-0" />
                  {item.label}
                </motion.button>
              ))}
              <div className="pt-3 mt-2 border-t border-white/[0.05]">
                <button
                  onClick={() => { setMenuOpen(false); navigate("/dashboard"); }}
                  className="w-full text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white px-4 py-3 rounded-xl transition-all duration-200 active:scale-[0.98]"
                >
                  Get Started →
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
