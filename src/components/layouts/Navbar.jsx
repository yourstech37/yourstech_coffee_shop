import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  FiShoppingCart,
  FiMenu,
  FiX,
  FiUser,
  FiChevronDown,
} from "react-icons/fi";

import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const { cartItems } = useCart();
  const { user, signOut } = useAuth();

  // Sum all item quantities for the cart badge (e.g. 3× Cappuccino = 3, not 1)
  const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const fullName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Account";

  const linkClass = ({ isActive }) =>
    isActive
      ? "text-coffee-orange font-semibold"
      : "text-coffee-brown/80 hover:text-coffee-orange";

  useEffect(() => {
    if (!profileOpen) return;

    function handleOutsideClick(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [profileOpen]);

  return (
    <header className="sticky top-0 z-50 bg-coffee-cream/90 backdrop-blur border-b border-coffee-caramel">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">☕</span>
            <span className="font-bold text-lg text-coffee-brown tracking-tight">
              Enu <span className="text-coffee-orange">Coffee Shop</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLink to="/" className={linkClass}>
              Home
            </NavLink>
            <NavLink to="/menu" className={linkClass}>
              Menu
            </NavLink>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative text-coffee-brown hover:text-coffee-orange"
              aria-label="Cart"
            >
              <FiShoppingCart size={24} />

              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 h-5 min-w-[20px] px-1 rounded-full bg-coffee-orange text-white text-xs flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen((prev) => !prev)}
                  className="inline-flex items-center gap-2 rounded-xl bg-coffee-cream px-2 py-1 text-coffee-brown hover:border-coffee-orange"
                  aria-haspopup="menu"
                  aria-expanded={profileOpen}
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-coffee-caramel/50">
                    <FiUser size={17} />
                  </span>
                  <FiChevronDown
                    size={16}
                    className={`transition-transform ${profileOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-coffee-caramel bg-white p-4 shadow-lg">
                    <Link
                      to="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="block rounded-xl px-2 py-2 hover:bg-coffee-cream"
                    >
                      <p className="font-semibold text-coffee-brown">{fullName}</p>
                      <p className="mt-1 text-sm text-coffee-brown/70 break-all">
                        {user.email}
                      </p>
                    </Link>

                    <div className="mt-4 border-t border-coffee-caramel/40 pt-3">
                      <button
                        onClick={() => {
                          signOut();
                          setProfileOpen(false);
                        }}
                        className="w-full rounded-xl border border-red-400 px-3 py-2 text-red-600 hover:bg-red-50"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/signin"
                className="px-4 py-2 rounded-xl bg-coffee-orange text-white hover:bg-coffee-brown"
              >
                Sign in
              </Link>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="md:hidden flex items-center gap-2">
            {user && (
              <Link
                to="/profile"
                onClick={() => {
                  setOpen(false);
                  setProfileOpen(false);
                }}
                className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-coffee-caramel text-coffee-brown"
                aria-label="Profile"
              >
                <FiUser size={18} />
              </Link>
            )}

            <button
              onClick={() => setOpen(!open)}
              className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-coffee-caramel text-coffee-brown"
              aria-label="Toggle menu"
            >
              {open ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden pb-4">
            <nav className="flex flex-col gap-3 pt-3">
              <NavLink
                to="/"
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                Home
              </NavLink>

              <NavLink
                to="/menu"
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                Menu
              </NavLink>

              <Link
                to="/cart"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between px-3 py-2 rounded-xl border border-coffee-caramel text-coffee-brown"
              >
                <span className="flex items-center gap-2">
                  <FiShoppingCart />
                  Cart
                </span>

                {cartCount > 0 && (
                  <span className="h-5 min-w-[20px] px-1 rounded-full bg-coffee-orange text-white text-xs flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile Auth */}
              {user ? (
                <>
                  <div className="rounded-xl border border-coffee-caramel bg-white px-3 py-3">
                     <Link
                      to="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="block rounded-xl px-2 py-2 hover:bg-coffee-cream"
                    >
                      <p className="font-semibold text-coffee-brown">{fullName}</p>
                      <p className="mt-1 text-sm text-coffee-brown/70 break-all">
                        {user.email}
                      </p>
                    </Link>
                  </div>

                  <button
                    onClick={() => {
                      signOut();
                      setProfileOpen(false);
                      setOpen(false);
                    }}
                    className="px-3 py-2 rounded-xl border border-red-400 text-red-600"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <Link
                  to="/signin"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded-xl bg-coffee-orange text-white text-center"
                >
                  Sign in
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
