import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";

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
        scrolled ? "glass border-b border-white/5" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center glow-purple-sm">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 2h10v2H3V2zM3 6h10v2H3V6zM3 10h6v2H3v-2z" fill="white" />
              </svg>
            </div>
            <span className="font-bold text-lg text-white tracking-tight">
              Resume<span className="gradient-text-purple">Forge</span>
            </span>
          </button>

          <div className="hidden md:flex items-center gap-8">
            {[
              { label: "Features", id: "features" },
              { label: "How it Works", id: "how-it-works" },
              { label: "Testimonials", id: "testimonials" },
              { label: "FAQ", id: "faq" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="text-sm text-muted-foreground hover:text-white transition-colors duration-200"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-sm text-muted-foreground hover:text-white transition-colors px-4 py-2"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="text-sm font-medium bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg transition-all duration-200 glow-purple-sm hover:scale-105"
            >
              Start Free
            </button>
          </div>

          <button
            className="md:hidden text-white p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className="w-5 h-0.5 bg-white mb-1 transition-all" />
            <div className="w-5 h-0.5 bg-white mb-1 transition-all" />
            <div className="w-5 h-0.5 bg-white transition-all" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-white/5"
          >
            <div className="px-4 py-4 space-y-3">
              {[
                { label: "Features", id: "features" },
                { label: "How it Works", id: "how-it-works" },
                { label: "Testimonials", id: "testimonials" },
                { label: "FAQ", id: "faq" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="block w-full text-left text-sm text-muted-foreground hover:text-white py-2 transition-colors"
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => { setMenuOpen(false); navigate("/dashboard"); }}
                className="w-full text-sm font-medium bg-violet-600 hover:bg-violet-500 text-white px-4 py-2.5 rounded-lg transition-all duration-200 mt-2"
              >
                Start Free
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
