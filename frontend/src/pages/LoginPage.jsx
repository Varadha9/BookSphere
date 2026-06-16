import { useState, useEffect, useRef } from "react";
import { useStore } from "../store/useStore";
import { supabase } from "../lib/supabase";

const DSA_FEATURES = [
  { icon: "🔎", label: "O(1) Search", sub: "HashMap indexed by tag" },
  { icon: "↩️", label: "Undo Remove", sub: "Stack — LIFO in O(1)" },
  { icon: "🏆", label: "Priority Queue", sub: "Premium orders first" },
  { icon: "🚚", label: "Dijkstra Routes", sub: "Shortest delivery path" },
  { icon: "💸", label: "Knapsack DP", sub: "Best coupon combo" },
];

const DEMO_ACCOUNTS = [
  { label: "Demo Standard", email: "demo@books.com", password: "demo123", isPremium: false, name: "Demo User" },
  { label: "Demo Premium ⭐", email: "premium@books.com", password: "demo123", isPremium: true, name: "Premium User" },
];

function passwordStrength(pw) {
  if (!pw) return null;
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

const STRENGTH_META = [
  null,
  { label: "Weak", color: "var(--red)" },
  { label: "Fair", color: "var(--amber)" },
  { label: "Good", color: "var(--blue)" },
  { label: "Strong", color: "var(--green)" },
];

function validate(mode, form) {
  const errs = {};
  if (mode === "register" && !form.name.trim()) errs.name = "Full name is required";
  if (!form.email.match(/^[^@]+@[^@]+\.[^@]+$/)) errs.email = "Enter a valid email address";
  if (mode === "register" && form.password.length < 6) errs.password = "Minimum 6 characters";
  if (mode === "login" && !form.password) errs.password = "Password is required";
  return errs;
}

export default function LoginPage() {
  const { state, dispatch } = useStore();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", isPremium: false, remember: false });
  const [showPass, setShowPass] = useState(false);
  const [registered, setRegistered] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fieldErrs, setFieldErrs] = useState({});
  const [touched, setTouched] = useState({});
  const [forgotSent, setForgotSent] = useState(false);
  const firstInputRef = useRef(null);

  useEffect(() => {
    firstInputRef.current?.focus();
    setFieldErrs({});
    setTouched({});
    setForgotSent(false);
  }, [mode]);

  function touch(key) {
    setTouched(t => ({ ...t, [key]: true }));
  }

  async function submit(e) {
    e.preventDefault();
    const allTouched = mode === "register"
      ? { name: true, email: true, password: true }
      : { email: true, password: true };
    setTouched(allTouched);
    const errs = validate(mode, form);
    setFieldErrs(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);

    if (mode === "register") {
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { name: form.name, isPremium: form.isPremium } },
      });
      if (error) {
        dispatch({ type: "SET_ERROR", payload: error.message });
        setLoading(false);
      } else {
        setRegistered("done");
        setTimeout(() => { setMode("login"); setRegistered(null); setLoading(false); }, 1600);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });
      if (error) {
        dispatch({ type: "SET_ERROR", payload: error.message });
      }
      setLoading(false);
    }
  }

  function handleChange(key, value) {
    const updated = { ...form, [key]: value };
    setForm(updated);
    if (touched[key]) {
      const errs = validate(mode, updated);
      setFieldErrs(prev => ({ ...prev, [key]: errs[key] }));
    }
  }

  function switchMode(m) {
    setMode(m);
    setRegistered(null);
    setLoading(false);
  }

  function fillDemo(account) {
    setForm({ ...form, email: account.email, password: account.password });
    setFieldErrs({});
    setTouched({});
  }

  function handleForgotPassword(e) {
    e.preventDefault();
    if (!form.email.match(/^[^@]+@[^@]+\.[^@]+$/)) {
      setTouched(t => ({ ...t, email: true }));
      setFieldErrs(prev => ({ ...prev, email: "Enter your email first" }));
      return;
    }
    setForgotSent(true);
  }

  const strength = mode === "register" ? passwordStrength(form.password) : null;
  const strengthMeta = strength !== null ? STRENGTH_META[strength] : null;

  return (
    <div className="auth-page">
      <div className="auth-split">
        <div className="auth-brand">
          <div className="auth-brand-inner">
            <div className="auth-logo">B</div>
            <span className="eyebrow">BookSphere studio</span>
            <h1 className="auth-brand-title">BookSphere</h1>
            <p className="auth-brand-sub">A polished bookstore interface with quick search, premium queues, smart delivery routes, and curated recommendations.</p>
            <div className="auth-features">
              {DSA_FEATURES.map(f => (
                <div key={f.label} className="auth-feature-row">
                  <span className="auth-feature-icon">{f.icon}</span>
                  <div>
                    <div className="auth-feature-label">{f.label}</div>
                    <div className="auth-feature-sub">{f.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="auth-showcase" aria-hidden="true">
            <div className="showcase-book">📖</div>
            <span>New drops</span>
            <strong>12 handpicked reads</strong>
          </div>
        </div>

        <div className="auth-form-panel">
          <div className="auth-card">
            <div className="auth-tabs">
              <button className={mode === "login" ? "active" : ""} onClick={() => switchMode("login")}>Sign In</button>
              <button className={mode === "register" ? "active" : ""} onClick={() => switchMode("register")}>Sign Up</button>
            </div>

            <div className="auth-card-header">
              <h2>{mode === "login" ? "Welcome back" : "Create account"}</h2>
              <p>{mode === "login" ? "Sign in to your BookSphere account" : "Start your reading journey today"}</p>
            </div>

            {mode === "login" && (
              <div className="auth-demo-bar">
                <span className="auth-demo-label">Quick demo:</span>
                {DEMO_ACCOUNTS.map(a => (
                  <button key={a.email} type="button" className="auth-demo-btn" onClick={() => fillDemo(a)}>{a.label}</button>
                ))}
              </div>
            )}

            <form onSubmit={submit} noValidate>
              {mode === "register" && (
                <div className={`auth-field${touched.name && fieldErrs.name ? " field-error" : ""}`}>
                  <label htmlFor="inp-name">Full Name</label>
                  <input
                    id="inp-name"
                    ref={mode === "register" ? firstInputRef : undefined}
                    type="text"
                    placeholder="Varad Sharma"
                    value={form.name}
                    onChange={e => handleChange("name", e.target.value)}
                    onBlur={() => touch("name")}
                    autoComplete="name"
                  />
                  {touched.name && fieldErrs.name && <span className="field-err-msg">{fieldErrs.name}</span>}
                </div>
              )}

              <div className={`auth-field${touched.email && fieldErrs.email ? " field-error" : ""}`}>
                <label htmlFor="inp-email">Email Address</label>
                <input
                  id="inp-email"
                  ref={mode === "login" ? firstInputRef : undefined}
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => handleChange("email", e.target.value)}
                  onBlur={() => touch("email")}
                  autoComplete="email"
                />
                {touched.email && fieldErrs.email && <span className="field-err-msg">{fieldErrs.email}</span>}
              </div>

              <div className={`auth-field${touched.password && fieldErrs.password ? " field-error" : ""}`}>
                <div className="auth-field-labelrow">
                  <label htmlFor="inp-pass">Password</label>
                  {mode === "login" && !forgotSent && (
                    <button type="button" className="auth-forgot" onClick={handleForgotPassword}>Forgot password?</button>
                  )}
                </div>
                <div className="pass-wrap">
                  <input
                    id="inp-pass"
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={e => handleChange("password", e.target.value)}
                    onBlur={() => touch("password")}
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                  />
                  <button type="button" className="pass-toggle" onClick={() => setShowPass(s => !s)} aria-label={showPass ? "Hide password" : "Show password"}>
                    {showPass ? "🙈" : "👁️"}
                  </button>
                </div>
                {touched.password && fieldErrs.password && <span className="field-err-msg">{fieldErrs.password}</span>}
                {mode === "register" && form.password && (
                  <div className="strength-bar-wrap">
                    <div className="strength-bar">
                      {[1,2,3,4].map(i => (
                        <div
                          key={i}
                          className="strength-segment"
                          style={{ background: i <= strength ? strengthMeta?.color : undefined }}
                        />
                      ))}
                    </div>
                    {strengthMeta && <span className="strength-label" style={{ color: strengthMeta.color }}>{strengthMeta.label}</span>}
                  </div>
                )}
              </div>

              {mode === "register" && (
                <label className="premium-label">
                  <input type="checkbox" checked={form.isPremium} onChange={e => setForm({ ...form, isPremium: e.target.checked })} />
                  <span>⭐ Premium member — priority order processing</span>
                </label>
              )}

              {mode === "login" && (
                <label className="auth-remember">
                  <input type="checkbox" checked={form.remember} onChange={e => setForm({ ...form, remember: e.target.checked })} />
                  <span>Remember me on this device</span>
                </label>
              )}

              {forgotSent && <p className="auth-success">✓ Reset link sent to {form.email} (demo only)</p>}
              {state.error && registered !== "done" && <p className="auth-error">⚠ {state.error}</p>}
              {registered === "done" && <p className="auth-success">✓ Account created! Redirecting to sign in…</p>}

              <button type="submit" className="btn-primary auth-submit" disabled={loading}>
                {loading
                  ? <span className="auth-spinner" />
                  : mode === "login" ? "Enter BookSphere" : "Create Account"
                }
              </button>
            </form>

            <p className="auth-switch">
              {mode === "login" ? "Don't have an account? " : "Already have an account? "}
              <span onClick={() => switchMode(mode === "login" ? "register" : "login")}>
                {mode === "login" ? "Sign up" : "Sign in"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
