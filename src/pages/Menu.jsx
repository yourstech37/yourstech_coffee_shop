import products from "../data/products";
import AddToCartButton from "../components/AddToCartButton";

export default function Menu() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold text-coffee-brown">Menu</h1>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <div
            key={p.id}
            className="rounded-2xl border border-coffee-caramel bg-white p-6"
          >
            {/* Product Image */}
            <img
              src={p.image}
              alt={p.name}
              className="h-40 w-full object-cover rounded-xl"
            />

            <h3 className="mt-3 font-semibold text-coffee-brown">
              {p.name}
            </h3>

            <p className="text-sm text-coffee-brown/70">
              {p.description}
            </p>

            <div className="mt-2 flex items-center justify-between">
              <p className="font-bold text-coffee-brown">${p.price}</p>
              <AddToCartButton product={p} iconOnly />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
