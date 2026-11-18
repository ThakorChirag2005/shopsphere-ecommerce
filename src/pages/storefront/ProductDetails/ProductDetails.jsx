
import { useState, useContext } from "react";
import { useParams } from "react-router-dom";

import { products } from "../../../data/products";
import { CartContext } from "../../../context/CartContextValue";

function ProductDetails() {
  const { id } = useParams();

  const product = products.find(
    (item) => item.id === Number(id)
  );

  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useContext(CartContext);

  if (!product) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold">
          Product Not Found
        </h1>
      </div>
    );
  }

  return (
    <div className="px-8 py-10 product-details">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 product-details__layout">

        {/* Product Image */}
        <div className="product-details__media">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-96 object-cover rounded-2xl product-details__image"
          />
        </div>

        {/* Product Information */}
        <div className="product-details__info">

          <p className="text-rose-800 font-semibold product-details__category">
            {product.category}
          </p>

          <h1 className="text-3xl font-bold mt-3 product-details__title">
            {product.name}
          </h1>

          <p className="text-yellow-500 mt-3 product-details__rating">
            ⭐ {product.rating} / 5
          </p>

          <p className="text-2xl font-bold text-rose-800 mt-5 product-details__price">
            ₹{product.price}
          </p>

          <p className="text-gray-600 mt-5 product-details__description">
            Explore this amazing product from ShopSphere.
            Get the best quality at an affordable price.
          </p>

          {/* Quantity */}
          <div className="flex items-center gap-4 mt-8 product-details__quantity">

            <span className="font-semibold">
              Quantity:
            </span>

            <button
              onClick={() =>
                setQuantity(Math.max(1, quantity - 1))
              }
              className="px-4 py-2 bg-gray-200 rounded-lg product-details__quantity-button"
            >
              -
            </button>

            <span className="font-bold product-details__quantity-value">
              {quantity}
            </span>

            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-4 py-2 bg-gray-200 rounded-lg product-details__quantity-button"
            >
              +
            </button>

          </div>

          {/* Add to Cart */}
          <button
            onClick={() => addToCart(product, quantity)}
            className="mt-8 w-full bg-rose-900 text-white py-3 rounded-lg font-semibold hover:bg-rose-950 product-details__add-button"
          >
            Add to Cart
          </button>

        </div>

      </div>

    </div>
  );
}

export default ProductDetails;
