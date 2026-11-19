
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { getStoreProducts } from "../../../data/products";
import ProductCard from "../../../components/common/ProductCard";
import { useDebounce } from "../../../hooks/useDebounce";


function Products() {
  const products = getStoreProducts();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [searchParams, setSearchParams] = useSearchParams();
  const categories = [...new Set(products.map((product) => product.category))];
  const requestedCategory = searchParams.get("category") || "All";
  const category = categories.includes(requestedCategory)
    ? requestedCategory
    : "All";
  const [sortBy, setSortBy] = useState("default");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(3000);

  // Pagination State
  const [pagination, setPagination] = useState({ category: "All", page: 1 });
  const currentPage =
    pagination.category === category ? pagination.page : 1;
  const setCurrentPage = (page) => setPagination({ category, page });
  const productsPerPage = 3;

  const handleCategoryChange = (nextCategory) => {
    const nextSearchParams = new URLSearchParams(searchParams);

    if (nextCategory === "All") {
      nextSearchParams.delete("category");
    } else {
      nextSearchParams.set("category", nextCategory);
    }

    setSearchParams(nextSearchParams);
    setCurrentPage(1);
  };

  // Filter Products
  const filteredProducts = products.filter((product) => {
    const matchSearch = product.name
      .toLowerCase()
      .includes(debouncedSearch.toLowerCase());

    const matchCategory =
      category === "All" || product.category === category;

    const matchPrice =
      product.price >= minPrice && product.price <= maxPrice;

    return matchSearch && matchCategory && matchPrice;
  });

  // Sort Products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "low-high") {
      return a.price - b.price;
    }

    if (sortBy === "high-low") {
      return b.price - a.price;
    }

    return 0;
  });

  // Pagination Calculation
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  const currentProducts = sortedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(
    sortedProducts.length / productsPerPage
  );

  return (
    <div className="mx-auto grid w-full max-w-[1240px] grid-cols-1 content-start gap-x-4 gap-y-4 px-5 py-9 sm:px-8 sm:py-12 md:grid-cols-2 lg:grid-cols-3">
      <h1 className="col-span-full mb-0 text-3xl font-bold tracking-tight text-slate-900">
        Our Products
      </h1>

      <p className="col-span-full -mt-2 mb-2 text-base text-slate-500">
        Explore our latest products
      </p>

      <label className="relative col-span-full block">
        <Search
          size={20}
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          placeholder="Search products..."
          aria-label="Search products"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="h-[52px] min-h-0 w-full rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-800 shadow-sm outline-none transition focus:border-rose-300 focus:ring-4 focus:ring-rose-900/10"
        />
      </label>

      {/* Category Filter */}
      <select
        value={category}
        onChange={(e) => handleCategoryChange(e.target.value)}
        aria-label="Filter by category"
        className="col-span-full h-[52px] min-h-0 w-full min-w-0 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm outline-none transition focus:border-rose-300 focus:ring-4 focus:ring-rose-900/10"
      >
        <option value="All">All Categories</option>
        {categories.map((productCategory) => (
          <option key={productCategory} value={productCategory}>
            {productCategory}
          </option>
        ))}
      </select>

      {/* Price Filter */}
      <div className="flex min-w-0 gap-2">
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => {
            setMinPrice(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="h-[52px] min-h-0 w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-rose-300 focus:ring-4 focus:ring-rose-900/10 sm:px-4"
        />

        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => {
            setMaxPrice(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="h-[52px] min-h-0 w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-rose-300 focus:ring-4 focus:ring-rose-900/10 sm:px-4"
        />
      </div>

      {/* Sorting */}
      <select
        value={sortBy}
        onChange={(e) => {
          setSortBy(e.target.value);
          setCurrentPage(1);
        }}
        aria-label="Sort products"
        className="h-[52px] min-h-0 w-full min-w-0 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm outline-none transition focus:border-rose-300 focus:ring-4 focus:ring-rose-900/10"
      >
        <option value="default">Default Sorting</option>
        <option value="low-high">Price: Low to High</option>
        <option value="high-low">Price: High to Low</option>
      </select>

      {/* Product List */}
      <div className="col-span-full grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {sortedProducts.length === 0 ? (
          <p className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white p-7 text-center text-slate-500">
            No products found.
          </p>
        ) : (
          currentProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="col-span-full mt-3 flex items-center justify-center gap-3">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="min-h-11 min-w-[78px] rounded-xl bg-rose-900 px-2 py-2 text-xs font-semibold text-white transition hover:bg-rose-950 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 sm:min-w-[104px] sm:px-4 sm:text-sm"
          >
            Previous
          </button>

          <span className="min-w-[85px] text-center text-xs font-semibold text-slate-600 sm:min-w-[108px] sm:text-sm">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="min-h-11 min-w-[78px] rounded-xl bg-rose-900 px-2 py-2 text-xs font-semibold text-white transition hover:bg-rose-950 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 sm:min-w-[104px] sm:px-4 sm:text-sm"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Products;
