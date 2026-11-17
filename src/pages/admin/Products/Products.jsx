
import { useState } from "react";
import { products } from "../../../data/products";
import ProductCard from "../../../components/common/ProductCard";


function Products() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(3000);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 3;

  // Filter Products
  const filteredProducts = products.filter((product) => {
    const matchSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

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
    <div className="px-8 py-10">
      <h1 className="text-3xl font-bold mb-2">
        Our Products
      </h1>

      <p className="text-gray-500 mb-8">
        Explore our latest products
      </p>

      {/* Search */}
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-8"
      />

      {/* Category Filter */}
      <select
        value={category}
        onChange={(e) => {
          setCategory(e.target.value);
          setCurrentPage(1);
        }}
        className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-8"
      >
        <option value="All">All Categories</option>
        <option value="Electronics">Electronics</option>
        <option value="Fashion">Fashion</option>
        <option value="Accessories">Accessories</option>
      </select>

      {/* Price Filter */}
      <div className="flex gap-4 mb-8">
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => {
            setMinPrice(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="w-full border border-gray-300 rounded-lg px-4 py-3"
        />

        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => {
            setMaxPrice(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="w-full border border-gray-300 rounded-lg px-4 py-3"
        />
      </div>

      {/* Sorting */}
      <select
        value={sortBy}
        onChange={(e) => {
          setSortBy(e.target.value);
          setCurrentPage(1);
        }}
        className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-8"
      >
        <option value="default">Default Sorting</option>
        <option value="low-high">Price: Low to High</option>
        <option value="high-low">Price: High to Low</option>
      </select>

      {/* Product List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedProducts.length === 0 ? (
          <p className="text-gray-500">
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
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:bg-gray-300"
          >
            Previous
          </button>

          <span className="font-semibold">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Products;
