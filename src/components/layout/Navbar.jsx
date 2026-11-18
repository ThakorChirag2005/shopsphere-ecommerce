
import { Link } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../../context/CartContextValue";

function Navbar() {
  const { cartItems } = useContext(CartContext);

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <nav className="flex flex-wrap items-center justify-between gap-4 px-8 py-4 bg-white shadow-sm">

      {/* Logo */}
      <Link to="/" className="text-2xl font-bold">
        <span className="text-pink-600">Shop</span>
        <span className="text-yellow-500">Sphere</span>
      </Link>

      {/* Navigation Links */}
      <div className="flex flex-wrap gap-5 text-gray-700">

        <Link to="/">Home</Link>

        <Link to="/products">Products</Link>

        <Link to="/wishlist">Wishlist</Link>

        <Link to="/orders">My Orders</Link>

        <Link to="/account">My Account</Link>

        <Link to="/contact">Contact</Link>

      </div>

      {/* Cart and Authentication */}
      <div className="flex items-center gap-4">

        <Link to="/cart">
          Cart ({totalItems})
        </Link>

        <Link
          to="/login"
          className="bg-rose-900 text-white px-4 py-2 rounded-lg"
        >
          Login
        </Link>

        

      </div>

    </nav>
  );
}

export default Navbar;
