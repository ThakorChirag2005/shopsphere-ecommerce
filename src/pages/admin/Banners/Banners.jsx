
import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Image as ImageIcon,
  X,
  Upload,
  Eye,
  EyeOff,
} from "lucide-react";

const defaultBanners = [
  {
    id: 1,
    title: "Summer Sale",
    description: "Get amazing discounts on summer products.",
    buttonText: "Shop Now",
    link: "/products",
    image: "",
    status: "Active",
  },
  {
    id: 2,
    title: "New Arrivals",
    description: "Explore our latest collection.",
    buttonText: "Explore",
    link: "/products",
    image: "",
    status: "Active",
  },
];

function Banners() {
  const [banners, setBanners] = useState(() => {
    try {
      const savedBanners = localStorage.getItem("adminBanners");
      return savedBanners ? JSON.parse(savedBanners) : defaultBanners;
    } catch (error) {
      console.error("Unable to load banners:", error);
      return defaultBanners;
    }
  });

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    buttonText: "",
    link: "",
    image: "",
    status: "Active",
  });

  useEffect(() => {
    try {
      localStorage.setItem("adminBanners", JSON.stringify(banners));
    } catch (error) {
      console.error("Banner storage error:", error);
      alert("Storage full! Please use a smaller image or remove old banners.");
    }
  }, [banners]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Upload and compress banner image
  const handleImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5 MB.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const image = new window.Image();

      image.onload = () => {
        const canvas = document.createElement("canvas");

        const maxWidth = 700;
        const scale = Math.min(1, maxWidth / image.width);

        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);

        const context = canvas.getContext("2d");

        if (!context) {
          alert("Unable to process image.");
          return;
        }

        context.drawImage(
          image,
          0,
          0,
          canvas.width,
          canvas.height
        );

        const compressedImage = canvas.toDataURL(
          "image/jpeg",
          0.45
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

    reader.onerror = () => {
      alert("Unable to read image file.");
    };

    reader.readAsDataURL(file);
  };

  const openAddModal = () => {
    setEditingId(null);

    setFormData({
      title: "",
      description: "",
      buttonText: "",
      link: "",
      image: "",
      status: "Active",
    });

    setShowModal(true);
  };

  const openEditModal = (banner) => {
    setEditingId(banner.id);

    setFormData({
      title: banner.title,
      description: banner.description,
      buttonText: banner.buttonText,
      link: banner.link,
      image: banner.image || "",
      status: banner.status,
    });

    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Please enter banner title.");
      return;
    }

    if (editingId) {
      setBanners((prev) =>
        prev.map((banner) =>
          banner.id === editingId
            ? { ...banner, ...formData }
            : banner
        )
      );
    } else {
      const newBanner = {
        id: Date.now(),
        ...formData,
      };

      setBanners((prev) => [...prev, newBanner]);
    }

    setShowModal(false);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this banner?"
    );

    if (confirmDelete) {
      setBanners((prev) =>
        prev.filter((banner) => banner.id !== id)
      );
    }
  };

  const toggleStatus = (id) => {
    setBanners((prev) =>
      prev.map((banner) =>
        banner.id === id
          ? {
              ...banner,
              status:
                banner.status === "Active" ? "Inactive" : "Active",
            }
          : banner
      )
    );
  };

  const filteredBanners = banners.filter((banner) =>
    banner.title.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = banners.filter(
    (banner) => banner.status === "Active"
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">

      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Banner Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your store banners and promotional images.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
        >
          <Plus size={20} />
          Add Banner
        </button>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Banners</p>
              <h2 className="mt-2 text-2xl font-bold text-gray-800">
                {banners.length}
              </h2>
            </div>

            <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
              <ImageIcon size={25} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Banners</p>
              <h2 className="mt-2 text-2xl font-bold text-gray-800">
                {activeCount}
              </h2>
            </div>

            <div className="rounded-lg bg-green-100 p-3 text-green-600">
              <Eye size={25} />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-5 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="relative max-w-md">
          <Search
            size={19}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search banner..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Banner Table */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                  Image
                </th>
                <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                  Banner Details
                </th>
                <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                  Button
                </th>
                <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                  Status
                </th>
                <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredBanners.length > 0 ? (
                filteredBanners.map((banner) => (
                  <tr key={banner.id} className="hover:bg-gray-50">

                    <td className="px-5 py-4">
                      {banner.image ? (
                        <img
                          src={banner.image}
                          alt={banner.title}
                          className="h-16 w-28 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-16 w-28 items-center justify-center rounded-lg bg-gray-100 text-gray-400">
                          <ImageIcon size={25} />
                        </div>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-800">
                        {banner.title}
                      </p>
                      <p className="mt-1 max-w-xs text-sm text-gray-500">
                        {banner.description}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-700">
                        {banner.buttonText || "-"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {banner.link || "-"}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          banner.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {banner.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleStatus(banner.id)}
                          title="Toggle Status"
                          className="rounded-lg bg-gray-100 p-2 text-gray-600 hover:bg-gray-200"
                        >
                          {banner.status === "Active" ? (
                            <EyeOff size={17} />
                          ) : (
                            <Eye size={17} />
                          )}
                        </button>

                        <button
                          onClick={() => openEditModal(banner)}
                          title="Edit Banner"
                          className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          onClick={() => handleDelete(banner.id)}
                          title="Delete Banner"
                          className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-5 py-12 text-center text-gray-500"
                  >
                    No banners found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">

          <div className="my-6 w-full max-w-xl rounded-2xl bg-white shadow-xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b p-5">
              <h2 className="text-xl font-bold text-gray-800">
                {editingId ? "Edit Banner" : "Add New Banner"}
              </h2>

              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={21} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 p-5">

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Banner Title *
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter banner title"
                  required
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-blue-500"
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
                  placeholder="Enter banner description"
                  rows="3"
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Banner Image
                </label>

                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 transition hover:border-blue-500 hover:bg-blue-50">
                  <Upload size={28} className="mb-2 text-blue-600" />

                  <span className="text-sm font-medium text-gray-700">
                    Click to upload image
                  </span>

                  <span className="mt-1 text-xs text-gray-400">
                    PNG, JPG or JPEG (Maximum 5 MB)
                  </span>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImage}
                    className="hidden"
                  />
                </label>

                {formData.image && (
                  <div className="mt-3">
                    <p className="mb-2 text-sm font-medium text-gray-600">
                      Image Preview
                    </p>

                    <img
                      src={formData.image}
                      alt="Banner preview"
                      className="h-40 w-full rounded-lg object-cover"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          image: "",
                        }))
                      }
                      className="mt-2 text-sm font-medium text-red-600 hover:text-red-700"
                    >
                      Remove Image
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Button Text
                  </label>

                  <input
                    type="text"
                    name="buttonText"
                    value={formData.buttonText}
                    onChange={handleChange}
                    placeholder="Shop Now"
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Button Link
                  </label>

                  <input
                    type="text"
                    name="link"
                    value={formData.link}
                    onChange={handleChange}
                    placeholder="/products"
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Modal Buttons */}
              <div className="flex justify-end gap-3 border-t pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
                >
                  {editingId ? "Update Banner" : "Save Banner"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default Banners;
