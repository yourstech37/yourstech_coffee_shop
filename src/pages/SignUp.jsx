import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

// ─── Validation helpers ────────────────────────────────────────────────────────
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * getPasswordStrength - rates a password 0-4 based on:
 *   length >= 8, uppercase letter, digit, special character
 * Returns: { score: 0-4, label: string, color: string }
 */
function getPasswordStrength(password) {
  if (!password) return { score: 0, label: "", color: "" };

  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "bg-red-500", "bg-yellow-400", "bg-yellow-500", "bg-green-500"];
  const textColors = ["", "text-red-600", "text-yellow-600", "text-yellow-700", "text-green-600"];

  return { score, label: labels[score], barColor: colors[score], textColor: textColors[score] };
}

export default function SignUp() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  // ── Form state ────────────────────────────────────────────────────────────
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // ── Password visibility toggles ───────────────────────────────────────────
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // ── Touched state: only show errors after user has interacted ─────────────
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  // ── Loading state ─────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(false);

  // ── Per-field validation (computed every render) ──────────────────────────
  const errors = {
    firstName: !form.firstName ? "First name is required" : "",
    lastName: !form.lastName ? "Last name is required" : "",
    email: !form.email
      ? "Email is required"
      : !EMAIL_REGEX.test(form.email)
      ? "Please enter a valid email address"
      : "",
    password: !form.password
      ? "Password is required"
      : form.password.length < 6
      ? "Password must be at least 6 characters"
      : "",
    confirmPassword: !form.confirmPassword
      ? "Please confirm your password"
      : form.confirmPassword !== form.password
      ? "Passwords do not match"
      : "",
  };

  const isFormValid = Object.values(errors).every((e) => !e);

  /** Update a single field and clear its touched-error on change */
  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleBlur(field) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  function fieldError(field) {
    return touched[field] && errors[field] ? errors[field] : "";
  }

  // ── Password strength ─────────────────────────────────────────────────────
  const strength = getPasswordStrength(form.password);

  /**
   * handleSubmit - registers a new user and redirects to sign-in.
   */
  async function handleSubmit(e) {
    e.preventDefault();

    // Touch all fields to reveal any remaining validation errors
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    if (!isFormValid) return;

    setLoading(true);

    // Simulate async registration (replace with real API when ready)
    await new Promise((resolve) => setTimeout(resolve, 600));

    signUp(form);
    setLoading(false);
    navigate("/signin");
  }

  // ── Input class helper ────────────────────────────────────────────────────
  function inputClass(field) {
    return `w-full rounded-xl border py-3 pl-10 pr-4 text-coffee-brown placeholder-coffee-brown/30
      outline-none transition focus:ring-2 focus:ring-coffee-orange
      ${fieldError(field) ? "border-red-400 bg-red-50" : "border-coffee-caramel bg-white"}`;
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl font-bold mb-2 text-coffee-brown">Create account</h1>
      <p className="text-coffee-brown/60 mb-8">Join us and start your coffee journey</p>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">

        {/* ── Name row ─────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-4">
          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-coffee-brown mb-1">
              First Name
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-coffee-brown/40 pointer-events-none">
                <FiUser size={16} />
              </span>
              <input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                placeholder="Jane"
                value={form.firstName}
                onChange={handleChange}
                onBlur={() => handleBlur("firstName")}
                className={inputClass("firstName")}
              />
            </div>
            {fieldError("firstName") && (
              <p className="mt-1 text-xs text-red-600">{fieldError("firstName")}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-coffee-brown mb-1">
              Last Name
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-coffee-brown/40 pointer-events-none">
                <FiUser size={16} />
              </span>
              <input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                placeholder="Doe"
                value={form.lastName}
                onChange={handleChange}
                onBlur={() => handleBlur("lastName")}
                className={inputClass("lastName")}
              />
            </div>
            {fieldError("lastName") && (
              <p className="mt-1 text-xs text-red-600">{fieldError("lastName")}</p>
            )}
          </div>
        </div>

        {/* ── Email ────────────────────────────────────────────────────────── */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-coffee-brown mb-1">
            Email address
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-coffee-brown/40 pointer-events-none">
              <FiMail size={18} />
            </span>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              onBlur={() => handleBlur("email")}
              className={inputClass("email")}
            />
          </div>
          {fieldError("email") && (
            <p className="mt-1 text-xs text-red-600">{fieldError("email")}</p>
          )}
        </div>

        {/* ── Password ─────────────────────────────────────────────────────── */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-coffee-brown mb-1">
            Password
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-coffee-brown/40 pointer-events-none">
              <FiLock size={18} />
            </span>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              onBlur={() => handleBlur("password")}
              className={`w-full rounded-xl border py-3 pl-10 pr-12 text-coffee-brown placeholder-coffee-brown/30
                outline-none transition focus:ring-2 focus:ring-coffee-orange
                ${fieldError("password") ? "border-red-400 bg-red-50" : "border-coffee-caramel bg-white"}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-coffee-brown/40 hover:text-coffee-brown transition"
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>

          {/* Password strength bar */}
          {form.password && (
            <div className="mt-2">
              <div className="flex gap-1 h-1.5">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`flex-1 rounded-full transition-all ${
                      strength.score >= step ? strength.barColor : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
              {strength.label && (
                <p className={`mt-1 text-xs font-medium ${strength.textColor}`}>
                  {strength.label}
                </p>
              )}
            </div>
          )}

          {fieldError("password") && (
            <p className="mt-1 text-xs text-red-600">{fieldError("password")}</p>
          )}
        </div>

        {/* ── Confirm Password ─────────────────────────────────────────────── */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-coffee-brown mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-coffee-brown/40 pointer-events-none">
              <FiLock size={18} />
            </span>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={handleChange}
              onBlur={() => handleBlur("confirmPassword")}
              className={`w-full rounded-xl border py-3 pl-10 pr-12 text-coffee-brown placeholder-coffee-brown/30
                outline-none transition focus:ring-2 focus:ring-coffee-orange
                ${fieldError("confirmPassword") ? "border-red-400 bg-red-50" : "border-coffee-caramel bg-white"}`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((p) => !p)}
              aria-label={showConfirm ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-coffee-brown/40 hover:text-coffee-brown transition"
            >
              {showConfirm ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
          {fieldError("confirmPassword") && (
            <p className="mt-1 text-xs text-red-600">{fieldError("confirmPassword")}</p>
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
              <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              Creating account&hellip;
            </>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      {/* ── Sign in link ─────────────────────────────────────────────────────── */}
      <p className="mt-6 text-center text-sm text-coffee-brown/70">
        Already have an account?{" "}
        <Link to="/signin" className="text-coffee-orange font-semibold hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}
