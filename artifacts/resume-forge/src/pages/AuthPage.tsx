import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";

type Tab = "signin" | "signup" | "phone";
type PhoneStep = "input" | "otp";

const COUNTRY_CODES = [
  { code: "+1", flag: "🇺🇸", name: "US" },
  { code: "+44", flag: "🇬🇧", name: "UK" },
  { code: "+91", flag: "🇮🇳", name: "IN" },
  { code: "+61", flag: "🇦🇺", name: "AU" },
  { code: "+49", flag: "🇩🇪", name: "DE" },
  { code: "+33", flag: "🇫🇷", name: "FR" },
  { code: "+55", flag: "🇧🇷", name: "BR" },
  { code: "+81", flag: "🇯🇵", name: "JP" },
  { code: "+86", flag: "🇨🇳", name: "CN" },
  { code: "+7", flag: "🇷🇺", name: "RU" },
  { code: "+82", flag: "🇰🇷", name: "KR" },
  { code: "+34", flag: "🇪🇸", name: "ES" },
  { code: "+39", flag: "🇮🇹", name: "IT" },
  { code: "+31", flag: "🇳🇱", name: "NL" },
  { code: "+46", flag: "🇸🇪", name: "SE" },
  { code: "+971", flag: "🇦🇪", name: "AE" },
  { code: "+966", flag: "🇸🇦", name: "SA" },
  { code: "+20", flag: "🇪🇬", name: "EG" },
  { code: "+234", flag: "🇳🇬", name: "NG" },
  { code: "+27", flag: "🇿🇦", name: "ZA" },
];

const OTP_RESEND_SECONDS = 60;

export default function AuthPage() {
  const [tab, setTab] = useState<Tab>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [countryCode, setCountryCode] = useState("+1");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [phoneStep, setPhoneStep] = useState<PhoneStep>("input");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const countryPickerRef = useRef<HTMLDivElement>(null);

  const { signInWithEmail, signUpWithEmail, signInWithGoogle, signInWithFacebook, signInWithTwitter, signInWithPhone, verifyOtp, user } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  useEffect(() => {
    if (resendCountdown <= 0) return;
    const t = setTimeout(() => setResendCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCountdown]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (countryPickerRef.current && !countryPickerRef.current.contains(e.target as Node)) {
        setShowCountryPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const clearMessages = () => { setError(""); setSuccessMsg(""); };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);
    if (tab === "signin") {
      const { error } = await signInWithEmail(email, password);
      if (error) setError(error.message);
      else navigate("/dashboard");
    } else {
      const { error } = await signUpWithEmail(email, password);
      if (error) setError(error.message);
      else setSuccessMsg("Check your email to confirm your account, then sign in.");
    }
    setLoading(false);
  };

  const handleOAuth = async (provider: "google" | "facebook" | "twitter") => {
    clearMessages();
    setLoading(true);
    const fn = provider === "google" ? signInWithGoogle : provider === "facebook" ? signInWithFacebook : signInWithTwitter;
    const { error } = await fn();
    if (error) { setError(error.message); setLoading(false); }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    if (!phone.trim()) { setError("Please enter your phone number."); return; }
    setLoading(true);
    const fullPhone = `${countryCode}${phone.replace(/\D/g, "")}`;
    const { error } = await signInWithPhone(fullPhone);
    if (error) { setError(error.message); setLoading(false); }
    else {
      setPhoneStep("otp");
      setResendCountdown(OTP_RESEND_SECONDS);
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    const token = otp.join("");
    if (token.length < 6) { setError("Please enter the full 6-digit code."); return; }
    setLoading(true);
    const fullPhone = `${countryCode}${phone.replace(/\D/g, "")}`;
    const { error } = await verifyOtp(fullPhone, token);
    if (error) { setError(error.message); setLoading(false); }
    else navigate("/dashboard");
  };

  const handleOtpInput = (idx: number, val: string) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[idx] = digit;
    setOtp(next);
    if (digit && idx < 5) otpRefs.current[idx + 1]?.focus();
  };

  const handleOtpKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length > 0) {
      setOtp(pasted.padEnd(6, "").split("").slice(0, 6));
      otpRefs.current[Math.min(pasted.length, 5)]?.focus();
    }
    e.preventDefault();
  };

  const handleResend = async () => {
    if (resendCountdown > 0) return;
    clearMessages();
    const fullPhone = `${countryCode}${phone.replace(/\D/g, "")}`;
    const { error } = await signInWithPhone(fullPhone);
    if (error) setError(error.message);
    else { setResendCountdown(OTP_RESEND_SECONDS); setOtp(["", "", "", "", "", ""]); }
  };

  const inputClass = "w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-violet-500/60 focus:bg-white/[0.06] transition-all duration-200";

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
          <h1 className="text-xl font-semibold text-white text-center mb-1">
            {tab === "signin" ? "Welcome back" : tab === "signup" ? "Create your account" : "Sign in with phone"}
          </h1>
          <p className="text-sm text-white/40 text-center mb-6">
            {tab === "signin" ? "Sign in to continue to ResumeForge" : tab === "signup" ? "Start building your perfect resume" : "We'll send you a verification code"}
          </p>

          {/* Tab switcher */}
          <div className="flex gap-1 p-1 bg-white/[0.04] rounded-xl mb-6">
            {(["signin", "signup", "phone"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); clearMessages(); setPhoneStep("input"); setOtp(["","","","","",""]); }}
                className={`flex-1 text-xs py-2 px-1 rounded-lg font-medium transition-all duration-200 ${tab === t ? "bg-violet-600 text-white shadow-lg shadow-violet-900/40" : "text-white/40 hover:text-white/70"}`}
              >
                {t === "signin" ? "Sign In" : t === "signup" ? "Sign Up" : "Phone"}
              </button>
            ))}
          </div>

          {/* Error / Success messages */}
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </motion.div>
            )}
            {successMsg && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
                {successMsg}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {/* Email/Password forms */}
            {(tab === "signin" || tab === "signup") && (
              <motion.div key={tab} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2 }}>
                {/* OAuth buttons */}
                <div className="grid grid-cols-3 gap-2 mb-5">
                  <OAuthButton onClick={() => handleOAuth("google")} disabled={loading} label="Google" icon={
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  } />
                  <OAuthButton onClick={() => handleOAuth("facebook")} disabled={loading} label="Facebook" icon={
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#1877F2">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  } />
                  <OAuthButton onClick={() => handleOAuth("twitter")} disabled={loading} label="X" icon={
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="white">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  } />
                </div>

                <div className="flex items-center gap-3 mb-5">
                  <div className="flex-1 h-px bg-white/[0.07]" />
                  <span className="text-xs text-white/25">or continue with email</span>
                  <div className="flex-1 h-px bg-white/[0.07]" />
                </div>

                <form onSubmit={handleEmailAuth} className="space-y-3">
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="Email address" required className={inputClass}
                  />
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                      placeholder="Password" required minLength={6} className={`${inputClass} pr-11`}
                    />
                    <button type="button" onClick={() => setShowPass(s => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                      {showPass
                        ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                        : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      }
                    </button>
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-violet-900/40 active:scale-[0.98]">
                    {loading ? <LoadingSpinner /> : tab === "signin" ? "Sign In" : "Create Account"}
                  </button>
                </form>
              </motion.div>
            )}

            {/* Phone tab */}
            {tab === "phone" && (
              <motion.div key="phone" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
                {phoneStep === "input" ? (
                  <form onSubmit={handleSendOtp} className="space-y-3">
                    <div className="flex gap-2">
                      {/* Country code picker */}
                      <div className="relative" ref={countryPickerRef}>
                        <button type="button" onClick={() => setShowCountryPicker(s => !s)}
                          className="flex items-center gap-1.5 bg-white/[0.04] border border-white/10 rounded-xl px-3 py-3 text-sm text-white whitespace-nowrap hover:border-white/20 transition-colors">
                          <span>{COUNTRY_CODES.find(c => c.code === countryCode)?.flag}</span>
                          <span className="text-white/70 text-xs">{countryCode}</span>
                          <svg className="w-3 h-3 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        <AnimatePresence>
                          {showCountryPicker && (
                            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                              className="absolute top-full left-0 mt-1 z-50 w-40 bg-[#13172a] border border-white/10 rounded-xl shadow-2xl overflow-hidden max-h-52 overflow-y-auto scrollbar-thin">
                              {COUNTRY_CODES.map((c) => (
                                <button key={c.code} type="button"
                                  onClick={() => { setCountryCode(c.code); setShowCountryPicker(false); }}
                                  className={`flex items-center gap-2.5 w-full px-3 py-2.5 text-xs text-left transition-colors hover:bg-white/[0.06] ${countryCode === c.code ? "bg-violet-600/20 text-violet-300" : "text-white/70"}`}>
                                  <span>{c.flag}</span>
                                  <span>{c.name}</span>
                                  <span className="ml-auto text-white/40">{c.code}</span>
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <input
                        type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                        placeholder="Phone number" className={`${inputClass} flex-1`}
                      />
                    </div>
                    <button type="submit" disabled={loading}
                      className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-violet-900/40 active:scale-[0.98]">
                      {loading ? <LoadingSpinner /> : "Send Code"}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <p className="text-sm text-white/50 text-center">
                      Code sent to <span className="text-white/80">{countryCode} {phone}</span>
                    </p>
                    {/* OTP boxes */}
                    <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
                      {otp.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={el => { otpRefs.current[idx] = el; }}
                          type="text" inputMode="numeric" maxLength={1} value={digit}
                          onChange={e => handleOtpInput(idx, e.target.value)}
                          onKeyDown={e => handleOtpKeyDown(idx, e)}
                          className="w-11 h-12 text-center text-lg font-bold bg-white/[0.04] border border-white/10 rounded-xl text-white focus:outline-none focus:border-violet-500/60 focus:bg-white/[0.06] transition-all duration-200"
                        />
                      ))}
                    </div>
                    <button type="submit" disabled={loading}
                      className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-violet-900/40 active:scale-[0.98]">
                      {loading ? <LoadingSpinner /> : "Verify Code"}
                    </button>
                    <div className="flex items-center justify-between text-xs">
                      <button type="button" onClick={() => { setPhoneStep("input"); setOtp(["","","","","",""]); clearMessages(); }}
                        className="text-white/40 hover:text-white/70 transition-colors">
                        ← Change number
                      </button>
                      <button type="button" onClick={handleResend} disabled={resendCountdown > 0}
                        className={`transition-colors ${resendCountdown > 0 ? "text-white/25 cursor-not-allowed" : "text-violet-400 hover:text-violet-300"}`}>
                        {resendCountdown > 0 ? `Resend in ${resendCountdown}s` : "Resend code"}
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer link */}
          <p className="text-xs text-white/30 text-center mt-5">
            {tab === "signin" ? (
              <>Don't have an account?{" "}
                <button onClick={() => { setTab("signup"); clearMessages(); }} className="text-violet-400 hover:text-violet-300 transition-colors">Sign up free</button>
              </>
            ) : tab === "signup" ? (
              <>Already have an account?{" "}
                <button onClick={() => { setTab("signin"); clearMessages(); }} className="text-violet-400 hover:text-violet-300 transition-colors">Sign in</button>
              </>
            ) : (
              <>Back to{" "}
                <button onClick={() => { setTab("signin"); clearMessages(); }} className="text-violet-400 hover:text-violet-300 transition-colors">email sign in</button>
              </>
            )}
          </p>
        </div>

        {/* Back to landing */}
        <div className="text-center mt-5">
          <button onClick={() => navigate("/")} className="text-xs text-white/25 hover:text-white/50 transition-colors">
            ← Back to home
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function OAuthButton({ onClick, disabled, label, icon }: { onClick: () => void; disabled: boolean; label: string; icon: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled}
      className="flex items-center justify-center gap-2 py-2.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 rounded-xl text-xs text-white/70 hover:text-white font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.97]">
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function LoadingSpinner() {
  return (
    <span className="flex items-center justify-center gap-2">
      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
      Loading...
    </span>
  );
}
