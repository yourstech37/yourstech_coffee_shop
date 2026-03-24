import { Link } from "react-router-dom";
import products from "../../data/products";
import AddToCartButton from "../AddToCartButton";

export default function ProductsPreview() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-coffee-brown">
          Popular Picks
        </h2>
        <Link to="/menu" className="text-coffee-orange">
          View Menu →
        </Link>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 md:grid-cols-4">
        {products.slice(0, 12).map((p) => (
          <div
            key={p.id}
            className="rounded-2xl border border-coffee-caramel bg-white p-5"
          >
            <img
                src={p.image}
                alt={p.name}
                className="h-32 w-full object-cover rounded-lg"
              />

            <h3 className="mt-2 font-semibold">{p.name}</h3>
            <p className="text-sm">${p.price}</p>

            <div className="mt-4 flex gap-2">
              <Link
                to={`/product/${p.id}`}
                className="flex-1 px-3 py-2 rounded-xl border text-center"
              >
                View
              </Link>

              <AddToCartButton product={p} variant="icon" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
