
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
    <article className="product-card group">
      <Link
        to={`/products/${product.id}`}
        className="product-card__image-link"
      >
        <img
          src={product.image}
          alt={product.name}
          className="product-card__image"
        />
      </Link>

      <div className="product-card__content">
        <p className="product-card__category">{product.category}</p>
        <Link to={`/products/${product.id}`}>
          <h2 className="product-card__name">{product.name}</h2>
        </Link>

        <div className="product-card__details">
          <p className="product-card__price">₹{product.price}</p>
          <p className="product-card__rating" aria-label={`Rated ${product.rating} out of 5`}>
            <span aria-hidden="true">★</span> {product.rating}
          </p>
        </div>

        <button
          type="button"
          onClick={() => addToCart(product)}
          aria-label={`Add ${product.name} to cart`}
          className="product-card__add"
        >
          Add to bag
        </button>

        <button
          type="button"
          onClick={() =>
            isWishlisted
              ? removeFromWishlist(product.id)
              : addToWishlist(product)
          }
          aria-pressed={isWishlisted}
          className={`product-card__wishlist ${
            isWishlisted
              ? "product-card__wishlist--active"
              : ""
          }`}
        >
          {isWishlisted ? "Saved to wishlist" : "Save to wishlist"}
        </button>
      </div>
    </article>
  );
}

export default ProductCard;
