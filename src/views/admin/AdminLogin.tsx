import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAdminAuth } from "../../services/auth";
import BrandLogo from "../../components/BrandLogo";
import { SparklesIcon, CheckIcon, AlertTriangleIcon } from "../../components/admin/AdminIcons";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, demoAccounts } = useAdminAuth();
  const [email, setEmail] = useState("admin@nithicollection.com");
  const [password, setPassword] = useState("••••••••••••");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [show2FA, setShow2FA] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(async () => {
      // Direct login bypassing OTP requirement
      const pass = password === "••••••••••••" ? "adminpassword123" : password;
      const res = await login(email, pass);
      setLoading(false);

      if (res.success) {
        navigate("/admin");
      } else {
        setError(res.error || "Authentication failed. Please verify credentials.");
      }
    }, 300);
  };

  const handleBypassOTP = async () => {
    setError(null);
    setLoading(true);
    const res = await login("admin@nithicollection.com", "adminpassword123");
    setLoading(false);
    if (res.success) {
      navigate("/admin");
    } else {
      setError(res.error || "Failed to bypass OTP session.");
    }
  };

  const handleQuickLogin = async (userEmail: string) => {
    setEmail(userEmail);
    // Use the backend hardcoded password for the main admin
    const pass = userEmail === "admin@nithicollection.com" ? "adminpassword123" : "password";
    const res = await login(userEmail, pass);
    if (res.success) {
      navigate("/admin");
    }
  };

  return (
    <div className="min-h-screen bg-[#041D16] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-body relative overflow-hidden selection:bg-[#C9A227]/40 selection:text-white">
      {/* Dynamic ambient radial gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#064E3B]/30 to-[#C9A227]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-gradient-to-tl from-[#0B3D2E]/40 to-transparent rounded-full blur-2xl pointer-events-none" />

      {/* Decorative subtle grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#C9A227_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4 transform hover:scale-105 transition-transform">
            <BrandLogo variant="gold" size="lg" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/30 text-[10px] uppercase tracking-[0.25em] text-[#DFC15E] font-bold">
            <SparklesIcon size={12} className="text-[#DFC15E]" />
            Enterprise Merchant Console
          </div>
          <p className="text-xs text-[#A8B6B0] max-w-xs mx-auto">
            Authorized administrative gateway with active catalog synchronization.
          </p>
        </div>

        {/* Card container */}
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-[#072920]/90 backdrop-blur-xl py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-[#C9A227]/30">
            {error && (
              <div className="mb-6 p-3.5 rounded-xl bg-rose-950/80 border border-rose-800/80 text-rose-200 text-xs flex items-start gap-3">
                <AlertTriangleIcon size={16} className="text-rose-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              {!show2FA ? (
                <>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-200 uppercase tracking-wider mb-2">
                      Administrator Email / Username
                    </label>
                    <input
                      type="text"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#031711] border border-emerald-900/80 focus:border-[#C9A227] rounded-xl px-4 py-3 text-sm text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#C9A227]/30 transition-all"
                      placeholder="admin@nithicollection.com"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-[11px] font-bold text-stone-200 uppercase tracking-wider">
                        Master Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowForgotModal(true)}
                        className="text-xs text-[#DFC15E] hover:text-[#F3D068] transition-colors"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#031711] border border-emerald-900/80 focus:border-[#C9A227] rounded-xl px-4 py-3 text-sm text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#C9A227]/30 transition-all"
                      placeholder="••••••••••••"
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-[#031711] rounded-2xl border border-[#C9A227]/40 text-xs text-stone-300">
                    <p className="font-bold text-[#DFC15E] flex items-center gap-1.5 mb-1 text-sm">
                      <span>🔐</span> Two-Factor Authentication
                    </p>
                    <p className="text-[#A8B6B0]">
                      Enter the 6-digit verification code from your security token or Google Authenticator.
                    </p>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-200 uppercase tracking-wider mb-2">
                      Security Code (6 Digits)
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={twoFactorCode}
                      onChange={(e) => setTwoFactorCode(e.target.value)}
                      placeholder="849201"
                      className="w-full text-center tracking-[0.6em] font-mono text-xl bg-[#031711] border border-emerald-900/80 focus:border-[#C9A227] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A227]/30"
                    />
                  </div>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl shadow-lg text-sm font-bold text-[#041D16] bg-gradient-to-r from-[#C9A227] via-[#DFC15E] to-[#EBD58A] hover:brightness-110 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-[#C9A227] transition-all disabled:opacity-50 uppercase tracking-wider cursor-pointer"
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-[#041D16]" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Authenticating Portal...
                    </span>
                  ) : show2FA ? (
                    "Verify & Launch Dashboard"
                  ) : (
                    "Sign In to Merchant Console"
                  )}
                </button>
              </div>

              {show2FA && (
                <div className="space-y-2 pt-1">
                  <button
                    type="button"
                    onClick={handleBypassOTP}
                    className="w-full py-2.5 px-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/80 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>⚡ Bypass OTP & Login Instantly (Development Mode)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShow2FA(false)}
                    className="w-full text-center text-xs text-stone-400 hover:text-white transition-colors"
                  >
                    ← Return to password login
                  </button>
                </div>
              )}
            </form>

            {/* Quick Demo Switcher */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#DFC15E] mb-3 text-center">
                Quick Demo Switcher (Instant Evaluation)
              </div>
              <div className="grid grid-cols-1 gap-2">
                {demoAccounts.map((acc) => (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => handleQuickLogin(acc.email)}
                    className="flex items-center justify-between px-3.5 py-2.5 text-xs rounded-xl bg-[#031711]/90 hover:bg-[#031711] border border-emerald-900/60 hover:border-[#C9A227]/60 text-stone-200 transition-all text-left group"
                  >
                    <div>
                      <div className="font-bold text-white group-hover:text-[#DFC15E] transition-colors">
                        {acc.name}
                      </div>
                      <div className="text-[10px] text-stone-400">{acc.email}</div>
                    </div>
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#0B3D2E] text-[#DFC15E] border border-[#C9A227]/30 font-bold">
                      {acc.role}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Customer store return */}
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-xs text-stone-400 hover:text-[#DFC15E] transition-colors inline-flex items-center gap-2"
            >
              <span>←</span>
              <span>Return to Customer Storefront</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#072920] border border-[#C9A227]/40 rounded-3xl max-w-md w-full p-6 sm:p-8 text-stone-200 shadow-2xl">
            <h3 className="font-display text-xl font-bold text-white mb-2">Reset Portal Password</h3>
            <p className="text-xs text-[#A8B6B0] mb-5 leading-relaxed">
              Enter your authorized staff email. A secure recovery link with a temporary access token will be generated.
            </p>
            {!forgotSubmitted ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setForgotSubmitted(true);
                }}
                className="space-y-4"
              >
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="admin@nithicollection.com"
                  className="w-full bg-[#031711] border border-emerald-900/80 focus:border-[#C9A227] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#C9A227]/30"
                />
                <div className="flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotModal(false);
                      setForgotSubmitted(false);
                    }}
                    className="px-4 py-2.5 text-xs font-semibold rounded-xl border border-stone-600 text-stone-300 hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-xs font-bold rounded-xl bg-[#C9A227] text-[#041D16] hover:bg-[#DFC15E] shadow-sm transition-colors"
                  >
                    Send Recovery Token
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-4 space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-900/60 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-lg">
                  <CheckIcon size={24} />
                </div>
                <p className="text-sm font-bold text-white">Recovery Instructions Dispatched</p>
                <p className="text-xs text-stone-400">
                  Check your mail ({forgotEmail || "owner email"}) for OTP credentials.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotSubmitted(false);
                  }}
                  className="mt-3 px-5 py-2.5 text-xs font-bold rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  Close Window
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
