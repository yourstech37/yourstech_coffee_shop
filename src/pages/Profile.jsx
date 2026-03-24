import { useState, useRef } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrderContext";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiEdit2,
  FiSave,
  FiX,
  FiCamera,
  FiLogOut,
} from "react-icons/fi";

// ─── Helper: format a date string into "Month YYYY" ───────────────────────────
function formatMemberSince(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

// ─── StatCard sub-component ────────────────────────────────────────────────────
function StatCard({ label, value }) {
  return (
    <div className="flex-1 rounded-2xl border border-coffee-caramel bg-white p-4 text-center">
      <p className="text-2xl font-bold text-coffee-orange">{value}</p>
      <p className="mt-1 text-xs text-coffee-brown/60 font-medium uppercase tracking-wide">
        {label}
      </p>
    </div>
  );
}

export default function Profile() {
  const { user, signOut, updateProfile } = useAuth();
  const { cartItems } = useCart();
  const { getOrdersByEmail } = useOrders();
  const navigate = useNavigate();

  // ── All hooks must be declared before any early returns ───────────────────
  const [profileImage, setProfileImage] = useState(user?.profileImage || null);
  const [imageError, setImageError] = useState("");
  const fileInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "",
    address: user?.address || "",
    city: user?.city || "",
    bio: user?.bio || "",
  });
  const [savedForm, setSavedForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "",
    address: user?.address || "",
    city: user?.city || "",
    bio: user?.bio || "",
  });
  const [saving, setSaving] = useState(false);

  // ── Guard: redirect to sign-in if not logged in ────────────────────────────
  if (!user) {
    return <Navigate to="/signin" />;
  }

  // ── Stats (safe to compute after guard) ───────────────────────────────────
  const userOrders = getOrdersByEmail(user.email);
  const totalOrders = userOrders.length;
  const totalSpent = userOrders.reduce((sum, o) => sum + (o.total || 0), 0);

  // ── Handle image file selection ────────────────────────────────────────────
  function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImageError("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageError("Image must be smaller than 5 MB.");
      return;
    }

    setImageError("");

    // FileReader converts the file to a Base64 data-URL for instant preview
    const reader = new FileReader();
    reader.onload = (ev) => setProfileImage(ev.target.result);
    reader.readAsDataURL(file);
  }

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleEdit() {
    setSavedForm({ ...form });
    setIsEditing(true);
  }

  function handleCancel() {
    setForm({ ...savedForm });
    setProfileImage(user.profileImage || null);
    setImageError("");
    setIsEditing(false);
  }

  async function handleSave() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    updateProfile({ ...form, profileImage });
    setSavedForm({ ...form });
    setSaving(false);
    setIsEditing(false);
  }

  function handleSignOut() {
    signOut();
    navigate("/");
  }

  function inputClass(extra = "") {
    return `w-full rounded-xl border border-coffee-caramel bg-white py-3 pl-10 pr-4
      text-coffee-brown placeholder-coffee-brown/30 outline-none transition
      focus:ring-2 focus:ring-coffee-orange
      disabled:bg-coffee-cream disabled:cursor-default disabled:opacity-70 ${extra}`;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">

      {/* ── Profile banner ──────────────────────────────────────────────────── */}
      <div className="relative rounded-2xl bg-gradient-to-r from-coffee-brown to-coffee-orange p-6 text-white mb-8">
        <div className="flex items-end gap-5">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="h-24 w-24 rounded-full border-4 border-white overflow-hidden bg-coffee-caramel flex items-center justify-center">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <FiUser size={40} className="text-coffee-brown/60" />
              )}
            </div>

            {/* Camera button - only in edit mode */}
            {isEditing && (
              <>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Upload profile photo"
                  className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-white text-coffee-brown
                    flex items-center justify-center shadow hover:bg-coffee-cream transition"
                >
                  <FiCamera size={15} />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </>
            )}
          </div>

          {/* Name + email */}
          <div>
            <h1 className="text-2xl font-bold">
              {[user.firstName, user.lastName].filter(Boolean).join(" ") || "My Profile"}
            </h1>
            <p className="text-white/70 text-sm mt-0.5">{user.email}</p>
          </div>
        </div>

        {imageError && (
          <p className="mt-3 rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700">
            {imageError}
          </p>
        )}
      </div>

      {/* ── Stats row ───────────────────────────────────────────────────────── */}
      <div className="flex gap-4 mb-8">
        <StatCard label="Total Orders" value={totalOrders} />
        <StatCard label="Total Spent" value={`$${totalSpent.toFixed(2)}`} />
        <StatCard label="Member Since" value={formatMemberSince(user.createdAt)} />
      </div>

      {/* ── Profile form card ────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-coffee-caramel bg-white p-6 space-y-5">

        {/* Card header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-coffee-brown">Profile Information</h2>

          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="inline-flex items-center gap-2 rounded-xl border border-coffee-caramel px-4 py-2
                text-sm font-medium text-coffee-brown hover:bg-coffee-cream transition"
            >
              <FiEdit2 size={15} />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="inline-flex items-center gap-2 rounded-xl border border-coffee-caramel px-4 py-2
                  text-sm font-medium text-coffee-brown hover:bg-coffee-cream transition"
              >
                <FiX size={15} />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-coffee-orange px-4 py-2
                  text-sm font-medium text-white hover:bg-coffee-brown transition
                  disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <span className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Saving&hellip;
                  </>
                ) : (
                  <>
                    <FiSave size={15} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* ── Name row ─────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                value={form.firstName}
                onChange={handleChange}
                disabled={!isEditing}
                className={inputClass()}
              />
            </div>
          </div>

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
                value={form.lastName}
                onChange={handleChange}
                disabled={!isEditing}
                className={inputClass()}
              />
            </div>
          </div>
        </div>

        {/* ── Email (read-only) ────────────────────────────────────────────── */}
        <div>
          <label htmlFor="profile-email" className="block text-sm font-medium text-coffee-brown mb-1">
            Email address{" "}
            <span className="text-coffee-brown/40 font-normal text-xs">(read-only)</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-coffee-brown/40 pointer-events-none">
              <FiMail size={18} />
            </span>
            <input
              id="profile-email"
              type="email"
              value={user.email}
              readOnly
              className={inputClass("cursor-default")}
            />
          </div>
        </div>

        {/* ── Phone ────────────────────────────────────────────────────────── */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-coffee-brown mb-1">
            Phone Number
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-coffee-brown/40 pointer-events-none">
              <FiPhone size={18} />
            </span>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder={isEditing ? "+1 (555) 000-0000" : "—"}
              value={form.phone}
              onChange={handleChange}
              disabled={!isEditing}
              className={inputClass()}
            />
          </div>
        </div>

        {/* ── Address & City ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-coffee-brown mb-1">
              Address
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-coffee-brown/40 pointer-events-none">
                <FiMapPin size={16} />
              </span>
              <input
                id="address"
                name="address"
                type="text"
                placeholder={isEditing ? "123 Main St" : "—"}
                value={form.address}
                onChange={handleChange}
                disabled={!isEditing}
                className={inputClass()}
              />
            </div>
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium text-coffee-brown mb-1">
              City
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-coffee-brown/40 pointer-events-none">
                <FiMapPin size={16} />
              </span>
              <input
                id="city"
                name="city"
                type="text"
                placeholder={isEditing ? "New York" : "—"}
                value={form.city}
                onChange={handleChange}
                disabled={!isEditing}
                className={inputClass()}
              />
            </div>
          </div>
        </div>

        {/* ── Bio ──────────────────────────────────────────────────────────── */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-coffee-brown mb-1">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={3}
            placeholder={isEditing ? "Tell us a little about yourself…" : "—"}
            value={form.bio}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full rounded-xl border border-coffee-caramel bg-white px-4 py-3
              text-coffee-brown placeholder-coffee-brown/30 outline-none transition
              focus:ring-2 focus:ring-coffee-orange resize-none
              disabled:bg-coffee-cream disabled:cursor-default disabled:opacity-70"
          />
        </div>

        {/* ── Cart items hint ───────────────────────────────────────────────── */}
        {cartItems.length > 0 && (
          <p className="text-sm text-coffee-brown/60">
            You have {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in your cart.
          </p>
        )}

        {/* ── Sign Out ─────────────────────────────────────────────────────── */}
        <div className="pt-4 border-t border-coffee-caramel/40">
          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 rounded-xl border border-red-300 px-5 py-2.5
              text-sm font-medium text-red-600 hover:bg-red-50 transition"
          >
            <FiLogOut size={16} />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
