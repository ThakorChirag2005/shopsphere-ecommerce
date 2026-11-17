
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/layout/Navbar";

import Home from "./pages/storefront/Home/Home";
import Products from "./pages/admin/Products/Products";
import ProductDetails from "./pages/storefront/ProductDetails/ProductDetails";
import Cart from "./pages/storefront/Cart/Cart";
import Checkout from "./pages/storefront/Checkout/Checkout";

import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <BrowserRouter>
      <CartProvider>

        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/products" element={<Products />} />
          

          <Route
            path="/products/:id"
            element={<ProductDetails />}
          />

          <Route path="/cart" element={<Cart />} />

        </Routes>

      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
