
import { Link } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../../context/CartContextValue";
import { WishlistContext } from "../../context/WishlistContextValue";

function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);
  const { wishlistItems, addToWishlist, removeFromWishlist } =
    useContext(WishlistContext);
  const isWishlisted = wishlistItems.some((item) => item.id === product.id);

  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-rose-200 hover:shadow-lg">
      <Link
        to={`/products/${product.id}`}
        className="block overflow-hidden bg-slate-100"
      >
        <img
          src={product.image}
          alt={product.name}
          className="h-[236px] w-full bg-slate-100 object-contain p-3.5 transition duration-300 group-hover:scale-[1.035] max-[640px]:h-[250px]"
        />
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <Link to={`/products/${product.id}`}>
          <h2 className="min-h-[1.4em] text-base font-bold tracking-tight text-slate-800 transition-colors hover:text-rose-800">
            {product.name}
          </h2>
        </Link>

        <p className="mt-1 text-sm text-slate-500">
          {product.category}
        </p>

        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-lg font-bold tracking-tight text-slate-900">
            ₹{product.price}
          </p>

          <p className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-sm font-semibold text-amber-800">
            ⭐ {product.rating}
          </p>
        </div>

        <button
          type="button"
          onClick={() => addToCart(product)}
          aria-label={`Add ${product.name} to cart`}
          className="mt-auto min-h-12 w-full rounded-xl border border-indigo-600 bg-gradient-to-br from-indigo-600 to-indigo-700 px-4 py-3 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-500 hover:from-indigo-700 hover:to-indigo-800 hover:shadow-md"
        >
          Add to Cart
        </button>

        <button
          onClick={() =>
            isWishlisted
              ? removeFromWishlist(product.id)
              : addToWishlist(product)
          }
          className={`mt-2.5 min-h-11 w-full rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors ${
            isWishlisted
              ? "border-rose-800 bg-rose-800 text-white hover:bg-rose-900"
              : "border-rose-200 bg-white text-rose-800 hover:bg-rose-50"
          }`}
        >
          {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        </button>
      </div>
    </article>
  );
}

export default ProductCard;
