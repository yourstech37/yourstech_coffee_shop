import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { FiShoppingCart, FiCheck } from "react-icons/fi";

/**
 * AddToCartButton
 *
 * Props:
 *  - product  (required)  Product object to add to cart
 *  - variant  (optional)  "icon" | "text"  (default: "text")
 *
 * Usage on cards:  <AddToCartButton product={p} variant="icon" />
 * Usage on pages:  <AddToCartButton product={p} />
 */
export default function AddToCartButton({ product, variant = "text" }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  function handleClick() {
    addToCart(product);
    setAdded(true);
  }

  // Reset the "added" indicator after 800 ms
  useEffect(() => {
    if (!added) return;
    const timer = setTimeout(() => setAdded(false), 800);
    return () => clearTimeout(timer);
  }, [added]);

  // ── ICON VARIANT (compact, used on product cards) ────────────────────────
  if (variant === "icon") {
    return (
      <button
        onClick={handleClick}
        title={added ? "Added to cart" : "Add to cart"}
        aria-label={added ? "Added to cart" : "Add to cart"}
        className={`p-2 rounded-lg transition-all
          ${added
            ? "bg-green-600 text-white"
            : "bg-coffee-orange text-white hover:bg-coffee-brown"
          }`}
      >
        {added ? <FiCheck size={20} /> : <FiShoppingCart size={20} />}
      </button>
    );
  }

  // ── TEXT VARIANT (full-width, used on detail/cart pages) ────────────────
  return (
    <button
      onClick={handleClick}
      className={`mt-4 w-full py-2 rounded-xl text-white font-semibold transition
        ${added ? "bg-green-600" : "bg-coffee-orange hover:bg-coffee-brown"}`}
    >
      {added ? "Added ✓" : "Add to Cart"}
    </button>
  );
}
