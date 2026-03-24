import { useEffect, useState } from "react";
import { FiShoppingCart, FiCheck } from "react-icons/fi";
import { useCart } from "../context/CartContext";

/**
 * AddToCartButton
 *
 * Props:
 * - product   (required) – product object to add
 * - iconOnly  (optional) – when true, renders a compact icon button
 *                          suitable for product cards; defaults to false
 *                          which renders a full-width text button for pages
 */
export default function AddToCartButton({ product, iconOnly = false }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  function handleClick() {
    addToCart(product);
    setAdded(true);
  }

  useEffect(() => {
    if (!added) return;

    const timer = setTimeout(() => {
      setAdded(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [added]);

  if (iconOnly) {
    return (
      <button
        onClick={handleClick}
        aria-label={added ? "Added to cart" : "Add to cart"}
        className={`flex items-center justify-center rounded-xl p-2 text-white transition
          ${added ? "bg-green-600" : "bg-coffee-orange hover:bg-coffee-brown"}`}
      >
        {added ? <FiCheck size={18} /> : <FiShoppingCart size={18} />}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`mt-4 w-full py-2 rounded-xl text-white transition
        ${added ? "bg-green-600" : "bg-coffee-orange hover:bg-coffee-brown"}`}
    >
      {added ? "Added ✓" : "Add to Cart"}
    </button>
  );
}
