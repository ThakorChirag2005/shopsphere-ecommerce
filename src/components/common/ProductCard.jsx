
import { Link } from "react-router-dom";

function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">

      <Link to={`/products/${product.id}`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      </Link>

      <div className="p-4">

        <Link to={`/products/${product.id}`}>
          <h2 className="text-lg font-semibold hover:text-indigo-600">
            {product.name}
          </h2>
        </Link>

        <p className="text-gray-500 mt-1">
          {product.category}
        </p>

        <div className="flex justify-between items-center mt-3">

          <p className="text-xl font-bold text-indigo-600">
            ₹{product.price}
          </p>

          <p className="text-yellow-500">
            ⭐ {product.rating}
          </p>

        </div>

        <button className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
          Add to Cart
        </button>

      </div>
    </div>
  );
}

export default ProductCard;
