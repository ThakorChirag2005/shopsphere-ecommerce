import { useContext } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../../../components/common/ProductCard";
import { WishlistContext } from "../../../context/WishlistContextValue";

function Wishlist() {
  const { wishlistItems } = useContext(WishlistContext);

  return (
    <main className="mx-auto min-h-screen w-full max-w-[1280px] px-5 py-9 sm:px-8 sm:py-12">
      <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-900">My Wishlist</h1>
      <p className="mb-8 text-slate-500">
        Your saved products, all in one place.
      </p>

      {wishlistItems.length === 0 ? (
        <section className="rounded-2xl border border-slate-100 bg-white px-6 py-10 text-center shadow-sm sm:px-10">
          <h2 className="text-xl font-bold text-slate-800">Your wishlist is empty</h2>
          <p className="mt-2 text-slate-500">Save products you love and find them here later.</p>
          <Link
            to="/products"
            className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-rose-900 px-5 py-2.5 font-semibold text-white transition hover:bg-rose-950"
          >
            Browse products
          </Link>
        </section>
      ) : (
        <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {wishlistItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}

export default Wishlist;
