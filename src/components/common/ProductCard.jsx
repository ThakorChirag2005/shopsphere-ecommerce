
import { Link } from "react-router-dom";
import { useContext } from "react";
import { WishlistContext } from "../../context/WishlistContextValue";

function ProductCard({ product }) {
  const { wishlistItems, addToWishlist, removeFromWishlist } =
    useContext(WishlistContext);
  const isWishlisted = wishlistItems.some((item) => item.id === product.id);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden product-card">

      <Link to={`/products/${product.id}`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-contain product-card__image"
        />
      </Link>

      <div className="p-4 product-card__content">

        <Link to={`/products/${product.id}`}>
          <h2 className="text-lg font-semibold hover:text-rose-800 product-card__name">
            {product.name}
          </h2>
        </Link>

        <p className="text-gray-500 mt-1 product-card__category">
          {product.category}
        </p>

        <div className="flex justify-between items-center mt-3">

          <p className="text-xl font-bold text-slate-900 product-card__price">
            ₹{product.price}
          </p>

          <p className="text-yellow-500 product-card__rating">
            ⭐ {product.rating}
          </p>

        </div>

        <button className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 product-card__add-button">
          Add to Cart
        </button>

        <button
          onClick={() =>
            isWishlisted
              ? removeFromWishlist(product.id)
              : addToWishlist(product)
          }
          className={`product-card__wishlist-button ${
            isWishlisted ? "product-card__wishlist-button--active" : ""
          }`}
        >
          {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        </button>

      </div>
    </div>
  );
}

export default ProductCard;
