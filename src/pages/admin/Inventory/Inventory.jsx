
import { useEffect, useState } from "react";
import {
  Search,
  Package,
  AlertTriangle,
  XCircle,
  Pencil,
  X,
} from "lucide-react";

const defaultInventory = [
  {
    id: 1,
    name: "Wireless Headphones",
    sku: "WHP-001",
    category: "Electronics",
    stock: 25,
  },
  {
    id: 2,
    name: "Smart Watch",
    sku: "SW-002",
    category: "Accessories",
    stock: 12,
  },
  {
    id: 3,
    name: "Running Shoes",
    sku: "RS-003",
    category: "Fashion",
    stock: 5,
  },
  {
    id: 4,
    name: "Bluetooth Speaker",
    sku: "BS-004",
    category: "Electronics",
    stock: 30,
  },
  {
    id: 5,
    name: "Men's Casual T-Shirt",
    sku: "MCT-005",
    category: "Fashion",
    stock: 0,
  },
  {
    id: 6,
    name: "Travel Backpack",
    sku: "TB-006",
    category: "Bags",
    stock: 18,
  },
  {
    id: 7,
    name: "Wireless Mouse",
    sku: "WM-007",
    category: "Electronics",
    stock: 40,
  },
];

function Inventory() {
  const [inventory, setInventory] = useState(() => {
    try {
      const savedInventory = localStorage.getItem("adminInventory");

      if (savedInventory) {
        return JSON.parse(savedInventory);
      }

      const savedProducts = localStorage.getItem("adminProducts");

      if (savedProducts) {
        return JSON.parse(savedProducts).map((product) => ({
          id: product.id,
          name: product.name,
          sku: product.sku,
          category: product.category,
          stock: Number(product.stock),
        }));
      }

      return defaultInventory;
    } catch {
      return defaultInventory;
    }
  });

  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("All");
  const [editingProduct, setEditingProduct] = useState(null);
  const [newStock, setNewStock] = useState("");

  // Save Inventory
  useEffect(() => {
    try {
      localStorage.setItem(
        "adminInventory",
        JSON.stringify(inventory)
      );
    } catch (error) {
      console.error("Inventory storage error:", error);
      alert("Unable to save inventory data.");
    }
  }, [inventory]);

  // Stock Summary
  const totalProducts = inventory.length;

  const totalStock = inventory.reduce(
    (total, product) => total + Number(product.stock),
    0
  );

  const lowStock = inventory.filter(
    (product) => product.stock > 0 && product.stock <= 5
  ).length;

  const outOfStock = inventory.filter(
    (product) => product.stock === 0
  ).length;

  // Search and Filter
  const filteredInventory = inventory.filter((product) => {
    const searchMatch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.sku.toLowerCase().includes(search.toLowerCase());

    let stockMatch = true;

    if (stockFilter === "In Stock") {
      stockMatch = product.stock > 5;
    } else if (stockFilter === "Low Stock") {
      stockMatch = product.stock > 0 && product.stock <= 5;
    } else if (stockFilter === "Out of Stock") {
      stockMatch = product.stock === 0;
    }

    return searchMatch && stockMatch;
  });

  // Open Update Stock Modal
  const handleEdit = (product) => {
    setEditingProduct(product);
    setNewStock(String(product.stock));
  };

  // Update Stock
  const handleUpdateStock = (e) => {
    e.preventDefault();

    const quantity = Number(newStock);

    if (newStock === "" || !Number.isInteger(quantity) || quantity < 0) {
      alert("Please enter a valid stock quantity.");
      return;
    }

    setInventory((prev) =>
      prev.map((product) =>
        product.id === editingProduct.id
          ? { ...product, stock: quantity }
          : product
      )
    );

    try {
      const savedProducts = localStorage.getItem("adminProducts");
      if (savedProducts) {
        const products = JSON.parse(savedProducts);

        if (Array.isArray(products)) {
          localStorage.setItem(
            "adminProducts",
            JSON.stringify(
              products.map((product) =>
                product.id === editingProduct.id
                  ? { ...product, stock: quantity }
                  : product
              )
            )
          );
        }
      }
    } catch (error) {
      console.error("Unable to synchronize product stock:", error);
    }

    setEditingProduct(null);
    setNewStock("");
  };

  // Stock Status
  const getStockStatus = (stock) => {
    if (stock === 0) {
      return {
        label: "Out of Stock",
        style: "bg-red-100 text-red-600",
      };
    }

    if (stock <= 5) {
      return {
        label: "Low Stock",
        style: "bg-yellow-100 text-yellow-700",
      };
    }

    return {
      label: "In Stock",
      style: "bg-green-100 text-green-600",
    };
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Inventory Management
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Monitor and manage your product stock
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Products
              </p>

              <h2 className="mt-2 text-2xl font-bold text-gray-800">
                {totalProducts}
              </h2>
            </div>

            <div className="rounded-lg bg-indigo-50 p-3 text-indigo-600">
              <Package size={24} />
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Stock
              </p>

              <h2 className="mt-2 text-2xl font-bold text-gray-800">
                {totalStock}
              </h2>
            </div>

            <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
              <Package size={24} />
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Low Stock
              </p>

              <h2 className="mt-2 text-2xl font-bold text-yellow-600">
                {lowStock}
              </h2>
            </div>

            <div className="rounded-lg bg-yellow-50 p-3 text-yellow-600">
              <AlertTriangle size={24} />
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Out of Stock
              </p>

              <h2 className="mt-2 text-2xl font-bold text-red-600">
                {outOfStock}
              </h2>
            </div>

            <div className="rounded-lg bg-red-50 p-3 text-red-600">
              <XCircle size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Stock Alerts */}
      {(lowStock > 0 || outOfStock > 0) && (
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle
              className="mt-1 text-yellow-600"
              size={21}
            />

            <div>
              <h3 className="font-semibold text-yellow-800">
                Inventory Alert
              </h3>

              <p className="mt-1 text-sm text-yellow-700">
                {lowStock} products have low stock and {outOfStock} products are out of stock.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm md:flex-row">
        <div className="relative flex-1">
          <Search
            size={19}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search product name or SKU..."
            className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 outline-none focus:border-indigo-500"
          />
        </div>

        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
          className="rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-indigo-500"
        >
          <option value="All">All Stock</option>
          <option value="In Stock">In Stock</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>
      </div>

      {/* Inventory Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="font-semibold text-gray-800">
            Inventory List
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead className="bg-gray-50">
              <tr className="text-sm text-gray-500">
                <th className="px-5 py-4">Product</th>
                <th className="px-5 py-4">SKU</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Available Stock</th>
                <th className="px-5 py-4">Stock Status</th>
                <th className="px-5 py-4">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredInventory.length > 0 ? (
                filteredInventory.map((product) => {
                  const status = getStockStatus(product.stock);

                  return (
                    <tr
                      key={product.id}
                      className="transition hover:bg-gray-50"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                            <Package size={20} />
                          </div>

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

                      <td className="px-5 py-4 font-semibold text-gray-800">
                        {product.stock} units
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${status.style}`}
                        >
                          {status.label}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <button
                          onClick={() => handleEdit(product)}
                          className="flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-600 transition hover:bg-indigo-100"
                        >
                          <Pencil size={15} />
                          Update Stock
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="py-10 text-center text-gray-500"
                  >
                    No inventory products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-gray-100 px-5 py-4">
          <p className="text-sm text-gray-500">
            Showing {filteredInventory.length} of {inventory.length} products
          </p>
        </div>
      </div>

      {/* Update Stock Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                Update Stock
              </h2>

              <button
                onClick={() => setEditingProduct(null)}
                className="text-gray-500 hover:text-red-500"
              >
                <X size={22} />
              </button>
            </div>

            <div className="mb-5 rounded-lg bg-gray-50 p-4">
              <p className="font-semibold text-gray-800">
                {editingProduct.name}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                SKU: {editingProduct.sku}
              </p>

              <p className="mt-2 text-sm text-gray-600">
                Current Stock: {editingProduct.stock} units
              </p>
            </div>

            <form
              onSubmit={handleUpdateStock}
              className="space-y-4"
            >
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  New Stock Quantity
                </label>

                <input
                  type="number"
                  min="0"
                  step="1"
                  value={newStock}
                  onChange={(e) => setNewStock(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-indigo-500"
                  placeholder="Enter new stock quantity"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="flex-1 rounded-lg border border-gray-200 px-4 py-3 font-medium text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-indigo-600 px-4 py-3 font-medium text-white hover:bg-indigo-700"
                >
                  Save Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Inventory;
