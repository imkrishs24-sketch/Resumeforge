import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";

type Tab = "signin" | "signup" | "forgot";

function friendlyError(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("invalid login") || m.includes("invalid credentials") || m.includes("wrong password"))
    return "Incorrect email or password. Please try again.";
  if (m.includes("email not confirmed"))
    return "Please confirm your email address before signing in.";
  if (m.includes("user already registered") || m.includes("already registered"))
    return "An account with this email already exists. Try signing in.";
  if (m.includes("password should be at least") || m.includes("weak password"))
    return "Password must be at least 6 characters.";
  if (m.includes("unable to validate email") || m.includes("invalid email"))
    return "Please enter a valid email address.";
  if (m.includes("rate limit") || m.includes("too many"))
    return "Too many attempts. Please wait a moment and try again.";
  if (m.includes("network") || m.includes("fetch"))
    return "Connection error. Please check your internet and try again.";
  return msg;
}

export default function AuthPage() {
  const [tab, setTab] = useState<Tab>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const { signInWithEmail, signUpWithEmail, forgotPassword, user } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  const clearMessages = () => { setError(""); setSuccessMsg(""); };

  const switchTab = (t: Tab) => {
    setTab(t);
    clearMessages();
    setPassword("");
    setConfirmPassword("");
    setShowPass(false);
    setShowConfirmPass(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    if (!email.trim()) { setError("Please enter your email address."); return; }
    if (!password) { setError("Please enter your password."); return; }
    setLoading(true);
    const { error } = await signInWithEmail(email.trim(), password);
    if (error) setError(friendlyError(error.message));
    else navigate("/dashboard");
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    if (!email.trim()) { setError("Please enter your email address."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    setLoading(true);
    const { error } = await signUpWithEmail(email.trim(), password);
    if (error) setError(friendlyError(error.message));
    else setSuccessMsg("Account created! Check your email to confirm, then sign in.");
    setLoading(false);
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    if (!email.trim()) { setError("Please enter your email address."); return; }
    setLoading(true);
    const { error } = await forgotPassword(email.trim());
    if (error) setError(friendlyError(error.message));
    else setSuccessMsg("Password reset link sent! Check your inbox.");
    setLoading(false);
  };

  const inputBase =
    "w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-violet-500/60 focus:bg-white/[0.06] transition-all duration-200 autofill:bg-white/[0.04]";

  return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-purple-600/8 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 2h10v2H3V2zM3 6h10v2H3V6zM3 10h6v2H3v-2z" fill="white" />
            </svg>
          </div>
          <span className="font-bold text-lg text-white tracking-tight">
            Resume<span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">Forge</span>
          </span>
        </div>

        {/* Card */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-7 backdrop-blur-xl shadow-2xl">

          {/* Heading */}
          <div className="text-center mb-6">
            <h1 className="text-xl font-semibold text-white mb-1">
              {tab === "signin" ? "Welcome back" : tab === "signup" ? "Create your account" : "Reset your password"}
            </h1>
            <p className="text-sm text-white/40">
              {tab === "signin" ? "Sign in to continue to ResumeForge" :
               tab === "signup" ? "Start building your perfect resume" :
               "Enter your email and we'll send a reset link"}
            </p>
          </div>

          {/* Tab switcher — only for signin/signup */}
          {tab !== "forgot" && (
            <div className="flex gap-1 p-1 bg-white/[0.04] rounded-xl mb-6">
              {(["signin", "signup"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => switchTab(t)}
                  className={`flex-1 text-sm py-2 rounded-lg font-medium transition-all duration-200 ${
                    tab === t
                      ? "bg-violet-600 text-white shadow-lg shadow-violet-900/40"
                      : "text-white/40 hover:text-white/70"
                  }`}
                >
                  {t === "signin" ? "Sign In" : "Sign Up"}
                </button>
              ))}
            </div>
          )}

          {/* Feedback messages */}
          <AnimatePresence>
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-2.5"
              >
                <svg className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
                <span className="text-red-400 text-sm">{error}</span>
              </motion.div>
            )}
            {successMsg && (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 flex items-start gap-2.5"
              >
                <svg className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-green-400 text-sm">{successMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Forms */}
          <AnimatePresence mode="wait">
            {/* ── Sign In ── */}
            {tab === "signin" && (
              <motion.form
                key="signin"
                onSubmit={handleSignIn}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
                noValidate
              >
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Email address"
                  className={inputBase}
                />
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Password"
                    className={`${inputBase} pr-11`}
                  />
                  <EyeToggle show={showPass} onToggle={() => setShowPass(s => !s)} />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => switchTab("forgot")}
                    className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                <SubmitButton loading={loading} label="Sign In" />
              </motion.form>
            )}

            {/* ── Sign Up ── */}
            {tab === "signup" && (
              <motion.form
                key="signup"
                onSubmit={handleSignUp}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
                noValidate
              >
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Email address"
                  className={inputBase}
                />
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    autoComplete="new-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Password (min. 6 characters)"
                    className={`${inputBase} pr-11`}
                  />
                  <EyeToggle show={showPass} onToggle={() => setShowPass(s => !s)} />
                </div>
                <div className="relative">
                  <input
                    type={showConfirmPass ? "text" : "password"}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className={`${inputBase} pr-11 ${
                      confirmPassword && confirmPassword !== password
                        ? "border-red-500/40 focus:border-red-500/60"
                        : confirmPassword && confirmPassword === password
                        ? "border-green-500/40 focus:border-green-500/60"
                        : ""
                    }`}
                  />
                  <EyeToggle show={showConfirmPass} onToggle={() => setShowConfirmPass(s => !s)} />
                </div>
                {confirmPassword && confirmPassword !== password && (
                  <p className="text-xs text-red-400/80 -mt-1 pl-1">Passwords do not match</p>
                )}

                <SubmitButton loading={loading} label="Create Account" />

                <p className="text-xs text-white/30 text-center pt-1">
                  By signing up you agree to our{" "}
                  <span className="text-white/50">Terms of Service</span>
                </p>
              </motion.form>
            )}

            {/* ── Forgot Password ── */}
            {tab === "forgot" && (
              <motion.form
                key="forgot"
                onSubmit={handleForgot}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
                noValidate
              >
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Email address"
                  className={inputBase}
                />
                <SubmitButton loading={loading} label="Send Reset Link" />
                <button
                  type="button"
                  onClick={() => switchTab("signin")}
                  className="w-full text-sm text-white/40 hover:text-white/70 py-2 transition-colors"
                >
                  ← Back to sign in
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Footer link */}
          {tab !== "forgot" && (
            <p className="text-xs text-white/30 text-center mt-5">
              {tab === "signin" ? (
                <>
                  Don't have an account?{" "}
                  <button onClick={() => switchTab("signup")} className="text-violet-400 hover:text-violet-300 transition-colors font-medium">
                    Sign up free
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button onClick={() => switchTab("signin")} className="text-violet-400 hover:text-violet-300 transition-colors font-medium">
                    Sign in
                  </button>
                </>
              )}
            </p>
          )}
        </div>

        {/* Back to landing */}
        <div className="text-center mt-5">
          <a href="/" className="text-xs text-white/25 hover:text-white/50 transition-colors">
            ← Back to home
          </a>
        </div>
      </motion.div>
    </div>
  );
}

function EyeToggle({ show, onToggle }: { show: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors p-0.5"
      tabIndex={-1}
    >
      {show ? (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )}
    </button>
  );
}

function SubmitButton({ loading, label }: { loading: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-violet-900/40 active:scale-[0.98] mt-1"
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          {label === "Sign In" ? "Signing in…" : label === "Create Account" ? "Creating account…" : "Sending…"}
        </span>
      ) : label}
    </button>
  );
}
