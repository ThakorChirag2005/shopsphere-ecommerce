
import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  FolderOpen,
  Package,
} from "lucide-react";

const defaultCategories = [
  {
    id: 1,
    name: "Electronics",
    description: "Electronic devices and gadgets",
    status: "Active",
  },
  {
    id: 2,
    name: "Fashion",
    description: "Clothing and fashion products",
    status: "Active",
  },
  {
    id: 3,
    name: "Accessories",
    description: "Daily use accessories",
    status: "Active",
  },
  {
    id: 4,
    name: "Bags",
    description: "Travel and shopping bags",
    status: "Active",
  },
];

const emptyForm = {
  name: "",
  description: "",
  status: "Active",
};

function Categories() {
  const [categories, setCategories] = useState(() => {
    try {
      const savedCategories = localStorage.getItem("adminCategories");

      return savedCategories
        ? JSON.parse(savedCategories)
        : defaultCategories;
    } catch {
      return defaultCategories;
    }
  });

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  // Save categories in LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        "adminCategories",
        JSON.stringify(categories)
      );
    } catch (error) {
      console.error("Category storage error:", error);
      alert("Unable to save categories in browser storage.");
    }
  }, [categories]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Open Add Category Modal
  const handleAdd = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setShowModal(true);
  };

  // Open Edit Category Modal
  const handleEdit = (category) => {
    setFormData({
      name: category.name,
      description: category.description,
      status: category.status,
    });

    setEditingId(category.id);
    setShowModal(true);
  };

  // Add or Update Category
  const handleSubmit = (e) => {
    e.preventDefault();

    const categoryName = formData.name.trim();

    if (!categoryName) {
      alert("Please enter category name.");
      return;
    }

    const alreadyExists = categories.some(
      (category) =>
        category.name.toLowerCase() === categoryName.toLowerCase() &&
        category.id !== editingId
    );

    if (alreadyExists) {
      alert("This category already exists.");
      return;
    }

    if (editingId !== null) {
      setCategories((prev) =>
        prev.map((category) =>
          category.id === editingId
            ? {
                ...category,
                ...formData,
                name: categoryName,
              }
            : category
        )
      );
    } else {
      const newCategory = {
        id: Date.now(),
        ...formData,
        name: categoryName,
      };

      setCategories((prev) => [newCategory, ...prev]);
    }

    setShowModal(false);
    setFormData(emptyForm);
    setEditingId(null);
  };

  // Delete Category
  const handleDelete = () => {
    setCategories((prev) =>
      prev.filter((category) => category.id !== deleteId)
    );

    setDeleteId(null);
  };

  // Search Categories
  const filteredCategories = categories.filter((category) => {
    return (
      category.name.toLowerCase().includes(search.toLowerCase()) ||
      category.description.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Categories
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your product categories
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 font-medium text-white transition hover:bg-indigo-700"
        >
          <Plus size={19} />
          Add Category
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Categories
              </p>

              <h2 className="mt-2 text-2xl font-bold text-gray-800">
                {categories.length}
              </h2>
            </div>

            <div className="rounded-lg bg-indigo-50 p-3 text-indigo-600">
              <FolderOpen size={24} />
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Active Categories
              </p>

              <h2 className="mt-2 text-2xl font-bold text-green-600">
                {categories.filter(
                  (category) => category.status === "Active"
                ).length}
              </h2>
            </div>

            <div className="rounded-lg bg-green-50 p-3 text-green-600">
              <Package size={24} />
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Inactive Categories
              </p>

              <h2 className="mt-2 text-2xl font-bold text-red-500">
                {categories.filter(
                  (category) => category.status === "Inactive"
                ).length}
              </h2>
            </div>

            <div className="rounded-lg bg-red-50 p-3 text-red-500">
              <FolderOpen size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <div className="relative">
          <Search
            size={19}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search category name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Categories Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left">
            <thead className="bg-gray-50">
              <tr className="text-sm text-gray-500">
                <th className="px-5 py-4">Category Name</th>
                <th className="px-5 py-4">Description</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <tr
                    key={category.id}
                    className="transition hover:bg-gray-50"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                          <FolderOpen size={20} />
                        </div>

                        <span className="font-medium text-gray-800">
                          {category.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {category.description || "No description"}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          category.status === "Active"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {category.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleEdit(category)}
                          title="Edit Category"
                          className="text-green-600 hover:text-green-800"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          onClick={() => setDeleteId(category.id)}
                          title="Delete Category"
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
                    colSpan="4"
                    className="py-10 text-center text-gray-500"
                  >
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-gray-100 px-5 py-4">
          <p className="text-sm text-gray-500">
            Showing {filteredCategories.length} of {categories.length} categories
          </p>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                {editingId !== null
                  ? "Edit Category"
                  : "Add New Category"}
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
                  Category Name *
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter category name"
                  required
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter category description"
                  rows="3"
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-indigo-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
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
                  {editingId !== null
                    ? "Update Category"
                    : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
              <Trash2 size={23} />
            </div>

            <h2 className="text-lg font-bold text-gray-800">
              Delete Category?
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Are you sure you want to delete this category?
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 rounded-lg border border-gray-200 px-4 py-3 font-medium text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
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

export default Categories;
