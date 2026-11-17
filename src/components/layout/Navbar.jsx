
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-sm">

      <h1 className="text-2xl font-bold text-indigo-600">
        ShopSphere
      </h1>

      <div className="flex gap-6 text-gray-700">
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/categories">Categories</Link>
      </div>

      <div className="flex items-center gap-4">
        <Link to="/cart">Cart</Link>
        <Link
          to="/login"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
        >
          Login
        </Link>
      </div>

    </nav>
  );
}

export default Navbar;
