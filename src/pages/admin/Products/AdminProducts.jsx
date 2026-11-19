
import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Package,
  X,
  Pencil,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  ImagePlus,
} from "lucide-react";

const defaultProducts = [
  {
    id: 1,
    name: "Wireless Headphones",
    sku: "WHP-001",
    category: "Electronics",
    price: 2500,
    stock: 25,
    image: "",
  },
  {
    id: 2,
    name: "Smart Watch",
    sku: "SW-002",
    category: "Accessories",
    price: 3500,
    stock: 12,
    image: "",
  },
  {
    id: 3,
    name: "Running Shoes",
    sku: "RS-003",
    category: "Fashion",
    price: 1800,
    stock: 5,
    image: "",
  },
  {
    id: 4,
    name: "Bluetooth Speaker",
    sku: "BS-004",
    category: "Electronics",
    price: 1999,
    stock: 30,
    image: "",
  },
  {
    id: 5,
    name: "Men's Casual T-Shirt",
    sku: "MCT-005",
    category: "Fashion",
    price: 799,
    stock: 4,
    image: "",
  },
  {
    id: 6,
    name: "Travel Backpack",
    sku: "TB-006",
    category: "Bags",
    price: 1499,
    stock: 18,
    image: "",
  },
  {
    id: 7,
    name: "Wireless Mouse",
    sku: "WM-007",
    category: "Electronics",
    price: 599,
    stock: 40,
    image: "",
  },
];

const emptyForm = {
  name: "",
  sku: "",
  category: "Electronics",
  price: "",
  stock: "",
  image: "",
};

function AdminProducts() {
  const [products, setProducts] = useState(() => {
    try {
      const savedProducts = localStorage.getItem("adminProducts");

      return savedProducts
        ? JSON.parse(savedProducts)
        : defaultProducts;
    } catch {
      return defaultProducts;
    }
  });

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [viewProduct, setViewProduct] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState(emptyForm);

  const productsPerPage = 5;

  // Save products in LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        "adminProducts",
        JSON.stringify(products)
      );
    } catch (error) {
      console.error("LocalStorage Error:", error);

      // If storage is full, save products without images
      const productsWithoutImages = products.map((product) => ({
        ...product,
        image: "",
      }));

      try {
        localStorage.setItem(
          "adminProducts",
          JSON.stringify(productsWithoutImages)
        );

        alert(
          "Storage was full. Product details were saved, but images were removed. Please upload smaller images."
        );
      } catch (saveError) {
        console.error("Unable to save products:", saveError);

        alert(
          "Browser storage is full. Product changes could not be saved."
        );
      }
    }
  }, [products]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Compress image before saving
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const image = new Image();

      image.onload = () => {
        const canvas = document.createElement("canvas");

        const maxWidth = 700;
        const scale = Math.min(1, maxWidth / image.width);

        canvas.width = image.width * scale;
        canvas.height = image.height * scale;

        const context = canvas.getContext("2d");

        context.drawImage(
          image,
          0,
          0,
          canvas.width,
          canvas.height
        );

        const compressedImage = canvas.toDataURL(
          "image/jpeg",
          0.6
        );

        setFormData((prev) => ({
          ...prev,
          image: compressedImage,
        }));
      };

      image.onerror = () => {
        alert("Unable to load this image.");
      };

      image.src = reader.result;
    };

    reader.readAsDataURL(file);
  };

  // Open Add Product Modal
  const handleAddProduct = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setShowModal(true);
  };

  // Open Edit Product Modal
  const handleEditProduct = (product) => {
    setFormData({
      name: product.name,
      sku: product.sku,
      category: product.category,
      price: product.price,
      stock: product.stock,
      image: product.image || "",
    });

    setEditingId(product.id);
    setShowModal(true);
    setViewProduct(null);
  };

  // Add or Update Product
  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.sku.trim() ||
      !formData.price ||
      !formData.stock
    ) {
      alert("Please fill all required fields.");
      return;
    }

    if (
      Number(formData.price) < 0 ||
      Number(formData.stock) < 0
    ) {
      alert("Price and stock cannot be negative.");
      return;
    }

    if (editingId) {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === editingId
            ? {
                ...product,
                ...formData,
                price: Number(formData.price),
                stock: Number(formData.stock),
              }
            : product
        )
      );
    } else {
      const newProduct = {
        id: Date.now(),
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
      };

      setProducts((prev) => [newProduct, ...prev]);
    }

    setShowModal(false);
    setFormData(emptyForm);
    setEditingId(null);
  };

  // Delete Product
  const handleDeleteProduct = () => {
    setProducts((prev) =>
      prev.filter((product) => product.id !== deleteId)
    );

    setDeleteId(null);
  };

  // Search and Category Filter
  let filteredProducts = products.filter((product) => {
    const searchMatch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.sku.toLowerCase().includes(search.toLowerCase());

    const categoryMatch =
      categoryFilter === "All" ||
      product.category === categoryFilter;

    return searchMatch && categoryMatch;
  });

  // Sorting
  if (sortBy === "price-low") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === "stock-low") {
    filteredProducts.sort((a, b) => a.stock - b.stock);
  } else if (sortBy === "stock-high") {
    filteredProducts.sort((a, b) => b.stock - a.stock);
  } else if (sortBy === "name") {
    filteredProducts.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }

  // Pagination
  const totalPages = Math.ceil(
    filteredProducts.length / productsPerPage
  );

  const startIndex = (currentPage - 1) * productsPerPage;

  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  // Reset page when search or filter changes
  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleCategoryFilter = (value) => {
    setCategoryFilter(value);
    setCurrentPage(1);
  };

  const handleSort = (value) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Products
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your store products
          </p>
        </div>

        <button
          onClick={handleAddProduct}
          className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 font-medium text-white transition hover:bg-indigo-700"
        >
          <Plus size={19} />
          Add Product
        </button>
      </div>

      {/* Product Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Products</p>
          <h2 className="mt-2 text-2xl font-bold text-gray-800">
            {products.length}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">In Stock</p>
          <h2 className="mt-2 text-2xl font-bold text-green-600">
            {products.filter((product) => product.stock > 5).length}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Low Stock</p>
          <h2 className="mt-2 text-2xl font-bold text-red-500">
            {products.filter((product) => product.stock <= 5).length}
          </h2>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm md:flex-row">
        <div className="relative flex-1">
          <Search
            size={19}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search product name or SKU..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 outline-none focus:border-indigo-500"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => handleCategoryFilter(e.target.value)}
          className="rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-indigo-500"
        >
          <option value="All">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Accessories">Accessories</option>
          <option value="Fashion">Fashion</option>
          <option value="Bags">Bags</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => handleSort(e.target.value)}
          className="rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-indigo-500"
        >
          <option value="default">Default Sorting</option>
          <option value="name">Name A-Z</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="stock-low">Stock: Low to High</option>
          <option value="stock-high">Stock: High to Low</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left">
            <thead className="bg-gray-50">
              <tr className="text-sm text-gray-500">
                <th className="px-5 py-4">Product</th>
                <th className="px-5 py-4">SKU</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Price</th>
                <th className="px-5 py-4">Stock</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="transition hover:bg-gray-50"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                            <Package size={22} />
                          </div>
                        )}

                        <span className="font-medium text-gray-800">
                          {product.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {product.sku}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {product.category}
                    </td>

                    <td className="px-5 py-4 font-medium text-gray-800">
                      ₹{Number(product.price).toLocaleString("en-IN")}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          product.stock <= 5
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {product.stock} units
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setViewProduct(product)}
                          title="View Product"
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Eye size={18} />
                        </button>

                        <button
                          onClick={() => handleEditProduct(product)}
                          title="Edit Product"
                          className="text-green-600 hover:text-green-800"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          onClick={() => setDeleteId(product.id)}
                          title="Delete Product"
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="py-10 text-center text-gray-500"
                  >
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row">
          <p className="text-sm text-gray-500">
            Showing {filteredProducts.length === 0 ? 0 : startIndex + 1}
            {" - "}
            {Math.min(startIndex + productsPerPage, filteredProducts.length)}
            {" of "}
            {filteredProducts.length} products
          </p>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage <= 1}
              onClick={() =>
                setCurrentPage((prev) => Math.max(1, prev - 1))
              }
              className="rounded-lg border p-2 text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={18} />
            </button>

            <span className="px-3 text-sm font-medium text-gray-700">
              {totalPages === 0 ? 0 : currentPage} / {totalPages}
            </span>

            <button
              disabled={currentPage >= totalPages}
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(totalPages, prev + 1)
                )
              }
              className="rounded-lg border p-2 text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                {editingId ? "Edit Product" : "Add New Product"}
              </h2>

              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-red-500"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Product Name *
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  required
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  SKU *
                </label>

                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  placeholder="Enter SKU"
                  required
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Category
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-indigo-500"
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Bags">Bags</option>
                </select>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Price *
                  </label>

                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    placeholder="Enter price"
                    required
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Stock *
                  </label>

                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    min="0"
                    placeholder="Enter stock"
                    required
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Product Image
                </label>

                <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-5 transition hover:border-indigo-500">
                  {formData.image ? (
                    <img
                      src={formData.image}
                      alt="Product Preview"
                      className="mb-3 h-28 w-28 rounded-lg object-cover"
                    />
                  ) : (
                    <ImagePlus
                      size={30}
                      className="mb-2 text-gray-400"
                    />
                  )}

                  <span className="text-sm text-gray-500">
                    Click to upload product image
                  </span>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-gray-200 px-5 py-3 font-medium text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-5 py-3 font-medium text-white hover:bg-indigo-700"
                >
                  {editingId ? "Update Product" : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Product Modal */}
      {viewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                Product Details
              </h2>

              <button
                onClick={() => setViewProduct(null)}
                className="text-gray-500 hover:text-red-500"
              >
                <X size={22} />
              </button>
            </div>

            {viewProduct.image ? (
              <img
                src={viewProduct.image}
                alt={viewProduct.name}
                className="mb-5 h-48 w-full rounded-xl object-cover"
              />
            ) : (
              <div className="mb-5 flex h-40 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500">
                <Package size={45} />
              </div>
            )}

            <div className="space-y-3 text-sm">
              <p>
                <span className="font-semibold text-gray-700">Name: </span>
                {viewProduct.name}
              </p>

              <p>
                <span className="font-semibold text-gray-700">SKU: </span>
                {viewProduct.sku}
              </p>

              <p>
                <span className="font-semibold text-gray-700">Category: </span>
                {viewProduct.category}
              </p>

              <p>
                <span className="font-semibold text-gray-700">Price: </span>
                ₹{Number(viewProduct.price).toLocaleString("en-IN")}
              </p>

              <p>
                <span className="font-semibold text-gray-700">Stock: </span>
                {viewProduct.stock} units
              </p>
            </div>

            <button
              onClick={() => handleEditProduct(viewProduct)}
              className="mt-6 w-full rounded-lg bg-indigo-600 px-5 py-3 font-medium text-white hover:bg-indigo-700"
            >
              Edit Product
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
              <Trash2 size={23} />
            </div>

            <h2 className="text-lg font-bold text-gray-800">
              Delete Product?
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 rounded-lg border border-gray-200 px-4 py-3 font-medium text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteProduct}
                className="flex-1 rounded-lg bg-red-600 px-4 py-3 font-medium text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;
