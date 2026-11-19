
import { useState, useContext } from "react";
import { useParams } from "react-router-dom";

import { getStoreProducts } from "../../../data/products";
import { CartContext } from "../../../context/CartContextValue";
import { WishlistContext } from "../../../context/WishlistContextValue";

function ProductDetails() {
  const { id } = useParams();
  const products = getStoreProducts();

  const product = products.find(
    (item) => item.id === Number(id)
  );

  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useContext(CartContext);
  const { wishlistItems, addToWishlist, removeFromWishlist } =
    useContext(WishlistContext);
  const isWishlisted =
    product && wishlistItems.some((item) => item.id === product.id);

  if (!product) {
    return (
      <div className="mx-auto w-full max-w-3xl px-5 py-16 text-center sm:px-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Product Not Found
        </h1>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1240px] px-5 py-10 sm:px-8 lg:py-16">
      <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 lg:gap-16">

        {/* Product Image */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 p-3 shadow-lg">
          <img
            src={product.image}
            alt={product.name}
            className="h-[340px] w-full rounded-2xl bg-slate-100 object-contain sm:h-[420px] lg:h-[520px]"
          />
        </div>

        {/* Product Information */}
        <div className="py-2">
          <p className="inline-flex min-h-8 items-center rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-rose-800">
            {product.category}
          </p>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            {product.name}
          </h1>

          <p className="mt-5 inline-flex min-h-9 items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-800">
            ⭐ {product.rating} / 5
          </p>

          <p className="mt-6 text-3xl font-bold tracking-tight text-rose-800">
            ₹{product.price}
          </p>

          <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
            Explore this amazing product from ShopSphere.
            Get the best quality at an affordable price.
          </p>

          {/* Quantity */}
          <div className="mt-7 flex items-center gap-3">

            <span className="mr-1 text-sm font-semibold text-slate-700">
              Quantity:
            </span>

            <button
              onClick={() =>
                setQuantity(Math.max(1, quantity - 1))
              }
              type="button"
              aria-label="Decrease quantity"
              className="grid size-11 min-h-0 place-items-center rounded-xl border border-slate-200 bg-white text-lg text-slate-700 shadow-sm transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-800"
            >
              -
            </button>

            <span className="min-w-8 text-center font-semibold text-slate-800">
              {quantity}
            </span>

            <button
              onClick={() =>
                setQuantity((current) =>
                  Math.min(Math.max(Number(product.stock || 0), 1), current + 1)
                )
              }
              type="button"
              aria-label="Increase quantity"
              disabled={Number(product.stock || 0) <= quantity}
              className="grid size-11 min-h-0 place-items-center rounded-xl border border-slate-200 bg-white text-lg text-slate-700 shadow-sm transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-800"
            >
              +
            </button>

          </div>

          {/* Add to Cart */}
          <button
            onClick={() => addToCart(product, quantity)}
            disabled={Number(product.stock || 0) <= 0}
            className="mt-7 min-h-12 w-full rounded-xl bg-gradient-to-r from-[#64152b] to-[#8a1c3a] px-5 py-3 font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:from-[#7a1a36] hover:to-[#a93251] hover:shadow-lg"
          >
            {Number(product.stock || 0) <= 0 ? "Out of Stock" : "Add to Cart"}
          </button>

          <button
            type="button"
            onClick={() =>
              isWishlisted
                ? removeFromWishlist(product.id)
                : addToWishlist(product)
            }
            className="mt-3 min-h-12 w-full rounded-xl border border-rose-200 bg-white px-5 py-3 font-semibold text-rose-800 transition hover:bg-rose-50"
          >
            {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default ProductDetails;
