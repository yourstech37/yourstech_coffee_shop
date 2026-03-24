import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

// ─── Email validation regex ────────────────────────────────────────────────────
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignIn() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to the page the user tried to visit, or "/" by default
  const redirectTo = location.state?.from || "/";

  // ── Form field values ──────────────────────────────────────────────────────
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ── Show/hide password toggle ──────────────────────────────────────────────
  const [showPassword, setShowPassword] = useState(false);

  // ── "Touched" tracks whether the user has interacted with each field.
  //    Errors are only shown after the user has touched a field.
  const [touched, setTouched] = useState({ email: false, password: false });

  // ── Loading & server-level error ───────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  // ── Per-field validation messages (computed on every render) ────────────────
  const errors = {
    email: !email
      ? "Email is required"
      : !EMAIL_REGEX.test(email)
      ? "Please enter a valid email address"
      : "",
    password: !password
      ? "Password is required"
      : password.length < 6
      ? "Password must be at least 6 characters"
      : "",
  };

  const isFormValid = !errors.email && !errors.password;

  /** Mark a field as touched when the user leaves it (onBlur) */
  function handleBlur(field) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  /** Clear the server error as soon as the user starts typing again */
  function handleEmailChange(e) {
    setEmail(e.target.value);
    setServerError("");
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
    setServerError("");
  }

  /**
   * handleSubmit - validates and submits the form.
   * Uses a simulated async delay to demonstrate loading states.
   */
  async function handleSubmit(e) {
    e.preventDefault();

    // Touch all fields so validation errors are visible on submit
    setTouched({ email: true, password: true });
    if (!isFormValid) return;

    setLoading(true);
    setServerError("");

    // Simulate a brief async call (replace with real API when ready)
    await new Promise((resolve) => setTimeout(resolve, 600));

    const success = signIn(email, password);
    setLoading(false);

    if (!success) {
      setServerError("Invalid email or password. Please try again.");
      return;
    }

    navigate(redirectTo);
  }

  // ── Reusable helper: show error only when field is touched ─────────────────
  function fieldError(field) {
    return touched[field] && errors[field] ? errors[field] : "";
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20">
      {/* Page heading */}
      <h1 className="text-3xl font-bold mb-2 text-coffee-brown">Welcome back</h1>
      <p className="text-coffee-brown/60 mb-8">Sign in to your account to continue</p>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">

        {/* ── Server-level error alert ──────────────────────────────────────── */}
        {serverError && (
          <div className="rounded-xl bg-red-50 border border-red-300 px-4 py-3 text-sm text-red-700">
            {serverError}
          </div>
        )}

        {/* ── Email field ───────────────────────────────────────────────────── */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-coffee-brown mb-1">
            Email address
          </label>
          <div className="relative">
            {/* Left icon */}
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-coffee-brown/40 pointer-events-none">
              <FiMail size={18} />
            </span>

            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={handleEmailChange}
              onBlur={() => handleBlur("email")}
              aria-invalid={!!fieldError("email")}
              aria-describedby={fieldError("email") ? "email-error" : undefined}
              className={`w-full rounded-xl border py-3 pl-10 pr-4 text-coffee-brown placeholder-coffee-brown/30 outline-none transition
                focus:ring-2 focus:ring-coffee-orange
                ${fieldError("email") ? "border-red-400 bg-red-50" : "border-coffee-caramel bg-white"}`}
            />
          </div>

          {/* Inline validation message */}
          {fieldError("email") && (
            <p id="email-error" className="mt-1 text-xs text-red-600">
              {fieldError("email")}
            </p>
          )}
        </div>

        {/* ── Password field ────────────────────────────────────────────────── */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="password" className="block text-sm font-medium text-coffee-brown">
              Password
            </label>
            {/* Forgot password link */}
            <Link
              to="/forgot-password"
              className="text-xs text-coffee-orange hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <div className="relative">
            {/* Left icon */}
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-coffee-brown/40 pointer-events-none">
              <FiLock size={18} />
            </span>

            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={handlePasswordChange}
              onBlur={() => handleBlur("password")}
              aria-invalid={!!fieldError("password")}
              aria-describedby={fieldError("password") ? "password-error" : undefined}
              className={`w-full rounded-xl border py-3 pl-10 pr-12 text-coffee-brown placeholder-coffee-brown/30 outline-none transition
                focus:ring-2 focus:ring-coffee-orange
                ${fieldError("password") ? "border-red-400 bg-red-50" : "border-coffee-caramel bg-white"}`}
            />

            {/* Eye toggle button */}
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-coffee-brown/40 hover:text-coffee-brown transition"
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>

          {fieldError("password") && (
            <p id="password-error" className="mt-1 text-xs text-red-600">
              {fieldError("password")}
            </p>
          )}
        </div>

        {/* ── Submit button ─────────────────────────────────────────────────── */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-coffee-orange py-3 text-white font-semibold
            hover:bg-coffee-brown transition disabled:opacity-60 disabled:cursor-not-allowed
            flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              {/* Simple CSS spinner */}
              <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              Signing in&hellip;
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      {/* ── Sign up link ──────────────────────────────────────────────────────── */}
      <p className="mt-6 text-center text-sm text-coffee-brown/70">
        Don&apos;t have an account?{" "}
        <Link to="/signup" className="text-coffee-orange font-semibold hover:underline">
          Sign Up
        </Link>
      </p>
    </div>
  );
}
