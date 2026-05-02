import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";

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
  const [profileOpen, setProfileOpen] = useState(false);
  const [, navigate] = useLocation();
  const { user, signOut, loading } = useAuth();
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleSignOut = async () => {
    setProfileOpen(false);
    setMenuOpen(false);
    await signOut();
    navigate("/");
  };

  const avatarLetter = user?.email?.[0]?.toUpperCase() ?? "U";
  const displayName = user?.user_metadata?.full_name ?? user?.email ?? "User";
  const shortEmail = user?.email
    ? user.email.length > 24 ? user.email.slice(0, 24) + "…" : user.email
    : "";

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0B0F19]/90 backdrop-blur-xl border-b border-white/[0.05]"
          : "bg-transparent"
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

          {/* Desktop nav links — lg+ only */}
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

          {/* Desktop right side */}
          <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
            {!loading && (
              user ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="text-sm text-white/50 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/[0.04]"
                  >
                    Dashboard
                  </button>
                  <div className="relative" ref={profileRef}>
                    <button
                      onClick={() => setProfileOpen(s => !s)}
                      className="flex items-center gap-1.5 pl-1 pr-2.5 py-1 rounded-xl hover:bg-white/[0.06] border border-transparent hover:border-white/10 transition-all duration-200"
                    >
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                        {avatarLetter}
                      </div>
                      <svg
                        className={`w-3.5 h-3.5 text-white/40 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <AnimatePresence>
                      {profileOpen && (
                        <ProfileDropdown
                          avatarLetter={avatarLetter}
                          displayName={displayName}
                          shortEmail={shortEmail}
                          onDashboard={() => { setProfileOpen(false); navigate("/dashboard"); }}
                          onSignOut={handleSignOut}
                        />
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate("/auth")}
                    className="text-sm text-white/50 hover:text-white transition-colors px-3 py-2 rounded-lg"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => navigate("/auth")}
                    className="text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:scale-[1.02] whitespace-nowrap"
                  >
                    Get Started
                  </button>
                </div>
              )
            )}
          </div>

          {/* Tablet (sm–lg): compact avatar or CTA + hamburger */}
          <div className="hidden sm:flex lg:hidden items-center gap-2 flex-shrink-0">
            {!loading && (
              user ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(s => !s)}
                    className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white"
                  >
                    {avatarLetter}
                  </button>
                  <AnimatePresence>
                    {profileOpen && (
                      <ProfileDropdown
                        avatarLetter={avatarLetter}
                        displayName={displayName}
                        shortEmail={shortEmail}
                        onDashboard={() => { setProfileOpen(false); navigate("/dashboard"); }}
                        onSignOut={handleSignOut}
                      />
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  onClick={() => navigate("/auth")}
                  className="text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap"
                >
                  Get Started
                </button>
              )
            )}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white/60 hover:text-white p-1.5 transition-colors rounded-md hover:bg-white/5"
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

          {/* Mobile: hamburger only */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="sm:hidden text-white/60 hover:text-white p-1.5 transition-colors rounded-md hover:bg-white/5"
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

              <div className="pt-3 mt-2 border-t border-white/[0.05] space-y-2">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-3 py-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                        {avatarLetter}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-white truncate">{displayName}</p>
                        <p className="text-xs text-white/40 truncate">{shortEmail}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => { setMenuOpen(false); navigate("/dashboard"); }}
                      className="w-full text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white px-4 py-3 rounded-xl transition-all duration-200 active:scale-[0.98]"
                    >
                      Go to Dashboard
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-sm text-white/50 hover:text-white px-4 py-2.5 rounded-xl hover:bg-white/[0.04] transition-all duration-200"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => { setMenuOpen(false); navigate("/auth"); }}
                      className="w-full text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white px-4 py-3 rounded-xl transition-all duration-200 active:scale-[0.98]"
                    >
                      Get Started →
                    </button>
                    <button
                      onClick={() => { setMenuOpen(false); navigate("/auth"); }}
                      className="w-full text-sm text-white/50 hover:text-white px-4 py-2.5 rounded-xl hover:bg-white/[0.04] transition-all duration-200"
                    >
                      Sign In
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

function ProfileDropdown({
  avatarLetter, displayName, shortEmail, onDashboard, onSignOut,
}: {
  avatarLetter: string; displayName: string; shortEmail: string;
  onDashboard: () => void; onSignOut: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.95 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="absolute top-full right-0 mt-2 w-56 bg-[#13172a] border border-white/10 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden z-50"
    >
      {/* User info */}
      <div className="px-4 py-3.5 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
            {avatarLetter}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{displayName}</p>
            <p className="text-xs text-white/40 truncate">{shortEmail}</p>
          </div>
        </div>
      </div>

      {/* Dashboard link */}
      <div className="p-1.5">
        <button
          onClick={onDashboard}
          className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/[0.06] transition-all duration-150"
        >
          <svg className="w-4 h-4 text-violet-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          Dashboard
        </button>
      </div>

      {/* Sign out */}
      <div className="p-1.5 pt-0 border-t border-white/[0.05]">
        <button
          onClick={onSignOut}
          className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm text-red-400/80 hover:text-red-400 hover:bg-red-500/[0.08] transition-all duration-150"
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>
      </div>
    </motion.div>
  );
}
