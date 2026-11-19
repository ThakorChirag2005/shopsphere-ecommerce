
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/layout/Navbar";

import AdminLayout from "./pages/admin/AdminLayout/AdminLayout";
import Dashboard from "./pages/admin/Dashboard/Dashboard";
import Categories from "./pages/admin/Categories/Categories";
import Inventory from "./pages/admin/Inventory/Inventory";
import Home from "./pages/storefront/Home/Home";
import StorefrontProducts from "./pages/admin/Products/Products";
import ProductDetails from "./pages/storefront/ProductDetails/ProductDetails";
import Cart from "./pages/storefront/Cart/Cart";
import Checkout from "./pages/storefront/Checkout/Checkout";
import StorefrontOrders from "./pages/storefront/Orders/Orders";
import Wishlist from "./pages/storefront/Wishlist/Wishlist";
import Login from "./pages/storefront/Account/Login";
import Register from "./pages/storefront/Account/Register";
import ForgotPassword from "./pages/storefront/Account/ForgotPassword";
import MyAccount from "./pages/storefront/Account/MyAccount";
import Contact from "./pages/storefront/Contact/Contact";
import AdminProducts from "./pages/admin/Products/AdminProducts";
import AdminOrders from "./pages/admin/Orders/Orders";
import Customers from "./pages/admin/Customers/Customers";
import Coupons from "./pages/admin/Coupons/Coupons";
import Reviews from "./pages/admin/Reviews/Reviews";
import Banners from "./pages/admin/Banners/Banners";
import Reports from "./pages/admin/Products/Reports/Reports";
import Settings from "./pages/admin/Settings/Settings";


import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

function ProtectedAdminRoute({ children }) {
  const isAdmin = (() => {
    try {
      const savedUser = localStorage.getItem("currentUser");
      const currentUser = savedUser ? JSON.parse(savedUser) : null;
      return Boolean(
        currentUser &&
          typeof currentUser.role === "string" &&
          currentUser.role.trim().toLowerCase() === "admin"
      );
    } catch {
      return false;
    }
  })();

  return isAdmin ? children : <Navigate to="/login" replace />;
}

function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-5 text-center">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-rose-700">
        404
      </p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">
        Page Not Found
      </h1>
      <a
        href="/"
        className="mt-6 rounded-xl bg-rose-900 px-6 py-3 font-semibold text-white"
      >
        Go to Homepage
      </a>
    </div>
  );
}

function AppContent() {
  const location = useLocation();

  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <div className={isAdminPage ? undefined : "storefront"}>
      {!isAdminPage && <Navbar />}

      <Routes>
        {/* Storefront Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<StorefrontProducts />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<StorefrontOrders />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/account" element={<MyAccount />} />
        <Route path="/contact" element={<Contact />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<Categories />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="customers" element={<Customers />} />
          <Route path="coupons" element={<Coupons />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="banners" element={<Banners />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <WishlistProvider>
          <AppContent />
        </WishlistProvider>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
