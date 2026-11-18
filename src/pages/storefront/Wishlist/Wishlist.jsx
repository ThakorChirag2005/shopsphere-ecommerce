import { useContext } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../../../components/common/ProductCard";
import { WishlistContext } from "../../../context/WishlistContextValue";

function Wishlist() {
  const { wishlistItems } = useContext(WishlistContext);

  return (
    <main className="px-8 py-10 wishlist-page">
      <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
      <p className="text-gray-500 mb-8">
        Your saved products, all in one place.
      </p>

      {wishlistItems.length === 0 ? (
        <section className="wishlist-page__empty">
          <h2>Your wishlist is empty</h2>
          <p>Save products you love and find them here later.</p>
          <Link to="/products" className="wishlist-page__browse">
            Browse products
          </Link>
        </section>
      ) : (
        <div className="products-page__grid">
          {wishlistItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}

export default Wishlist;
