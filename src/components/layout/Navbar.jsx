
import { useContext, useMemo, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import AdminPanelSettingsRounded from "@mui/icons-material/AdminPanelSettingsRounded";
import FavoriteBorderRounded from "@mui/icons-material/FavoriteBorderRounded";
import KeyboardArrowDownRounded from "@mui/icons-material/KeyboardArrowDownRounded";
import MenuRounded from "@mui/icons-material/MenuRounded";
import PersonOutlineRounded from "@mui/icons-material/PersonOutlineRounded";
import SearchRounded from "@mui/icons-material/SearchRounded";
import ShoppingBagOutlined from "@mui/icons-material/ShoppingBagOutlined";
import CloseRounded from "@mui/icons-material/CloseRounded";
import { getStoreProducts } from "../../data/products";
import { CartContext } from "../../context/CartContextValue";
import { WishlistContext } from "../../context/WishlistContextValue";

function Navbar() {
  const products = getStoreProducts();
  const { cartItems } = useContext(CartContext);
  const { wishlistItems } = useContext(WishlistContext);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category))].sort(),
    [products]
  );

  const selectedCategory = new URLSearchParams(location.search).get("category");

  const categoryRouteActive =
    location.pathname === "/products" &&
    categories.includes(selectedCategory);

  const accountRouteActive = [
    "/account",
    "/orders",
    "/login",
    "/register",
    "/forgot-password",
  ].includes(location.pathname);

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return [];

    return products
      .filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
      )
      .slice(0, 5);
  }, [searchQuery, products]);

  const closeMenus = () => {
    setMobileMenuOpen(false);
    setAccountMenuOpen(false);
    setCategoryMenuOpen(false);
    setSearchOpen(false);
  };

  const getNavLinkClass = ({ isActive }) =>
    `relative whitespace-nowrap py-2.5 text-sm font-semibold transition-colors after:absolute after:bottom-[3px] after:left-0 after:h-0.5 after:rounded after:bg-[#8a1c3a] after:content-[''] hover:text-[#8a1c3a] ${
      isActive
        ? "text-[#8a1c3a] after:right-0 after:w-full"
        : "text-slate-600 after:w-0"
    } max-[900px]:rounded-lg max-[900px]:px-2 max-[900px]:text-center max-[900px]:after:left-1/4 max-[900px]:after:right-1/4`;

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      navigate("/products");
      closeMenus();
      return;
    }

    if (searchResults.length > 0) {
      navigate(`/products/${searchResults[0].id}`);
      setSearchQuery("");
      closeMenus();
      return;
    }

    setSearchOpen(true);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 shadow-md backdrop-blur">
      <div className="flex w-full flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-6 xl:gap-7 xl:px-8">

        {/* Store Logo */}
        <Link
          to="/"
          className="order-0 inline-flex shrink-0 items-center gap-2.5 whitespace-nowrap max-[560px]:gap-2"
          aria-label="ShopSphere home"
          onClick={closeMenus}
        >
          <span className="grid size-[42px] place-items-center rounded-[14px] bg-gradient-to-br from-[#b4365b] to-[#741a37] font-serif text-2xl font-bold text-white shadow-lg shadow-rose-900/20 max-[560px]:size-9 max-[560px]:rounded-xl max-[560px]:text-xl">
            S
          </span>

          <span className="text-[1.32rem] font-extrabold tracking-[-0.06em] text-[#202638] max-[560px]:text-lg">
            Shop<span className="text-[#8a1c3a]">Sphere</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav
          id="primary-navigation"
          className={`order-none flex items-center justify-center gap-3 xl:gap-6 max-[900px]:order-5 max-[900px]:w-full max-[900px]:grid-cols-4 max-[900px]:gap-1 max-[900px]:border-t max-[900px]:border-slate-100 max-[900px]:pt-2 max-[560px]:grid-cols-2 ${
            mobileMenuOpen ? "max-[900px]:grid" : "max-[900px]:hidden"
          }`}
          aria-label="Primary navigation"
        >
          <NavLink to="/" end className={getNavLinkClass} onClick={closeMenus}>
            Home
          </NavLink>

          <NavLink
            to="/products"
            className={getNavLinkClass}
            onClick={closeMenus}
          >
            Products
          </NavLink>

          <div className="relative flex justify-center">
            <button
              type="button"
              id="category-menu-button"
              className={`relative inline-flex min-h-0 items-center gap-0.5 rounded-none border-0 bg-transparent px-0 py-2.5 text-sm font-semibold shadow-none transition-colors hover:text-[#8a1c3a] max-[900px]:rounded-lg max-[900px]:px-2 max-[900px]:text-center ${
                categoryRouteActive
                  ? "text-[#8a1c3a] after:absolute after:bottom-[3px] after:left-0 after:right-0 after:h-0.5 after:w-full after:rounded after:bg-[#8a1c3a] after:content-['']"
                  : "text-slate-600"
              }`}
              aria-haspopup="menu"
              aria-expanded={categoryMenuOpen}
              aria-controls="category-menu"
              onClick={() => {
                setCategoryMenuOpen((isOpen) => !isOpen);
                setAccountMenuOpen(false);
                setSearchOpen(false);
              }}
            >
              Categories
              <KeyboardArrowDownRounded
                className={`text-lg transition-transform ${
                  categoryMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {categoryMenuOpen && (
              <div
                id="category-menu"
                className="absolute left-[-14px] top-[calc(100%+8px)] z-[60] grid w-[205px] rounded-2xl border border-slate-100 bg-white p-2 shadow-xl max-[900px]:left-1/2 max-[900px]:top-[calc(100%+4px)] max-[900px]:w-[min(205px,calc(100vw-30px))] max-[900px]:-translate-x-1/2"
                role="menu"
              >
                <Link
                  to="/products"
                  className="rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-rose-50 hover:text-[#8a1c3a]"
                  role="menuitem"
                  onClick={closeMenus}
                >
                  All Categories
                </Link>

                {categories.map((category) => (
                  <Link
                    key={category}
                    to={`/products?category=${encodeURIComponent(category)}`}
                    className="rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-rose-50 hover:text-[#8a1c3a]"
                    role="menuitem"
                    onClick={closeMenus}
                  >
                    {category}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <NavLink
            to="/contact"
            className={getNavLinkClass}
            onClick={closeMenus}
          >
            Contact
          </NavLink>
        </nav>

        {/* Search */}
        <form
          className="relative order-none flex h-11 w-[clamp(220px,22vw,320px)] min-w-0 items-center rounded-full border border-[#e8e4e6] bg-[#f8f6f6] py-0 pl-3.5 pr-1.5 transition focus-within:border-[#d7a1b0] focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgb(138_28_58_/_0.08)] max-[900px]:order-4 max-[900px]:w-full"
          role="search"
          onSubmit={handleSearchSubmit}
        >
          <SearchRounded className="shrink-0 text-xl text-[#8a1c3a]" />

          <input
            type="search"
            value={searchQuery}
            placeholder="Search products..."
            aria-label="Search products"
            autoComplete="off"
            className="min-h-0 w-full min-w-0 flex-1 rounded-none border-0 bg-transparent px-2.5 text-sm shadow-none outline-none placeholder:text-slate-400"
            onFocus={() => setSearchOpen(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchOpen(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") setSearchOpen(false);
            }}
          />

          <button
            type="submit"
            className="grid size-[34px] min-h-0 shrink-0 place-items-center rounded-full border-0 bg-[#8a1c3a] p-0 text-white transition hover:scale-105 hover:bg-[#64152b]"
            aria-label="Search"
          >
            <SearchRounded />
          </button>

          {searchOpen && searchQuery.trim() && (
            <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-[60] overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl">
              {searchResults.length > 0 ? (
                <ul className="m-0 list-none divide-y divide-slate-100 p-1.5">
                  {searchResults.map((product) => (
                    <li key={product.id}>
                      <Link
                        to={`/products/${product.id}`}
                        onClick={() => {
                          setSearchQuery("");
                          closeMenus();
                        }}
                      >
                        <span>
                          <strong>{product.name}</strong>
                          <small>{product.category}</small>
                        </span>
                        <span className="whitespace-nowrap text-sm font-bold text-[#8a1c3a]">
                          ₹{product.price}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="m-0 p-4 text-sm text-slate-500">
                  No matching products found.
                </p>
              )}
            </div>
          )}
        </form>

        {/* Header Actions */}
        <div className="order-none flex items-center gap-2 max-[900px]:order-2 max-[900px]:ml-auto max-[560px]:gap-0.5">

          {/* Admin Dashboard Button */}
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `inline-flex h-[42px] items-center gap-1.5 rounded-full border px-3 text-sm font-semibold transition max-[560px]:size-[38px] max-[560px]:justify-center max-[560px]:px-0 ${
                isActive
                  ? "border-rose-200 bg-rose-50 text-[#8a1c3a]"
                  : "border-rose-100 bg-[#8a1c3a] text-white hover:bg-[#64152b]"
              }`
            }
            title="Admin Dashboard"
            onClick={closeMenus}
          >
            <AdminPanelSettingsRounded />
            <span className="max-[560px]:hidden">Dashboard</span>
          </NavLink>

          {/* Wishlist */}
          <NavLink
            to="/wishlist"
            className={({ isActive }) =>
              `relative inline-flex size-[42px] items-center justify-center rounded-full border border-transparent text-slate-600 transition hover:border-rose-100 hover:bg-rose-50 hover:text-[#8a1c3a] max-[560px]:size-[38px] ${
                isActive ? "border-rose-100 bg-rose-50 text-[#8a1c3a]" : ""
              }`
            }
            aria-label={`Wishlist, ${wishlistItems.length} items`}
            onClick={closeMenus}
          >
            <FavoriteBorderRounded />
            <span className="absolute -right-0.5 -top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full border-2 border-white bg-[#a52c4e] px-1 text-[10px] font-bold leading-none text-white">
              {wishlistItems.length}
            </span>
          </NavLink>

          {/* Cart */}
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `relative inline-flex size-[42px] items-center justify-center rounded-full border border-transparent text-slate-600 transition hover:border-rose-100 hover:bg-rose-50 hover:text-[#8a1c3a] max-[560px]:size-[38px] ${
                isActive ? "border-rose-100 bg-rose-50 text-[#8a1c3a]" : ""
              }`
            }
            aria-label={`Cart, ${totalItems} items`}
            onClick={closeMenus}
          >
            <ShoppingBagOutlined />
            <span className="absolute -right-0.5 -top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full border-2 border-white bg-[#a52c4e] px-1 text-[10px] font-bold leading-none text-white">
              {totalItems}
            </span>
          </NavLink>

          {/* Account */}
          <div className="relative">
            <button
              type="button"
              className={`relative inline-flex h-[42px] min-w-0 items-center justify-center gap-1.5 rounded-full border border-transparent px-2.5 text-sm font-bold whitespace-nowrap text-slate-600 transition hover:border-rose-100 hover:bg-rose-50 hover:text-[#8a1c3a] max-[560px]:size-[38px] max-[560px]:min-h-0 max-[560px]:p-0 ${
                accountRouteActive
                  ? "border-rose-100 bg-rose-50 text-[#8a1c3a]"
                  : ""
              }`}
              aria-label="Account options"
              aria-haspopup="menu"
              aria-expanded={accountMenuOpen}
              aria-controls="account-menu"
              onClick={() => {
                setAccountMenuOpen((isOpen) => !isOpen);
                setCategoryMenuOpen(false);
                setSearchOpen(false);
              }}
            >
              <PersonOutlineRounded className="text-xl" />
              <span className="max-[560px]:hidden">Account</span>
              <KeyboardArrowDownRounded className="text-lg max-[560px]:hidden" />
            </button>

            {accountMenuOpen && (
              <div
                id="account-menu"
                className="absolute right-0 top-[calc(100%+10px)] z-[60] grid w-[190px] rounded-2xl border border-slate-100 bg-white p-2 shadow-xl"
                role="menu"
              >
                <Link
                  to="/account"
                  className="rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-rose-50 hover:text-[#8a1c3a]"
                  role="menuitem"
                  onClick={closeMenus}
                >
                  My Account
                </Link>

                <Link
                  to="/orders"
                  className="rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-rose-50 hover:text-[#8a1c3a]"
                  role="menuitem"
                  onClick={closeMenus}
                >
                  My Orders
                </Link>

                <div className="mx-2 my-1 h-px bg-slate-100" />

                <Link
                  to="/login"
                  className="rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-rose-50 hover:text-[#8a1c3a]"
                  role="menuitem"
                  onClick={closeMenus}
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-rose-50 hover:text-[#8a1c3a]"
                  role="menuitem"
                  onClick={closeMenus}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="order-none hidden size-[42px] min-h-0 place-items-center rounded-[13px] border border-rose-100 bg-white text-[#8a1c3a] max-[900px]:order-3 max-[900px]:grid max-[560px]:size-[38px]"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
        >
          {mobileMenuOpen ? <CloseRounded /> : <MenuRounded />}
        </button>
      </div>
    </header>
  );
}

export default Navbar;
