
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/layout/Navbar";

import Home from "./pages/storefront/Home/Home";
import Products from "./pages/admin/Products/Products";
import ProductDetails from "./pages/storefront/ProductDetails/ProductDetails";
import Cart from "./pages/storefront/Cart/Cart";
import Checkout from "./pages/storefront/Checkout/Checkout";
import Orders from "./pages/admin/Orders/Orders";
import Wishlist from "./pages/storefront/Wishlist/Wishlist";
import Login from "./pages/storefront/Account/Login";
import Register from "./pages/storefront/Account/Register";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import ForgotPassword from "./pages/storefront/Account/ForgotPassword";
import MyAccount from "./pages/storefront/Account/MyAccount";
import Contact from "./pages/storefront/Contact/Contact";

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <WishlistProvider>
          <Navbar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register/>}/>
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/account" element={<MyAccount />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </WishlistProvider>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
