
import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  TicketPercent,
  Pencil,
  Trash2,
  X,
  Tag,
} from "lucide-react";

const defaultCoupons = [
  {
    id: 1,
    code: "WELCOME10",
    type: "Percentage",
    discount: 10,
    minOrder: 500,
    expiry: "2026-12-31",
    status: "Active",
  },
  {
    id: 2,
    code: "SAVE200",
    type: "Fixed",
    discount: 200,
    minOrder: 1000,
    expiry: "2026-12-20",
    status: "Active",
  },
  {
    id: 3,
    code: "FESTIVE25",
    type: "Percentage",
    discount: 25,
    minOrder: 1500,
    expiry: "2026-11-10",
    status: "Inactive",
  },
];

function Coupons() {
  const [coupons, setCoupons] = useState(() => {
    try {
      const saved = localStorage.getItem("adminCoupons");
      return saved ? JSON.parse(saved) : defaultCoupons;
    } catch {
      return defaultCoupons;
    }
  });

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const [formData, setFormData] = useState({
    code: "",
    type: "Percentage",
    discount: "",
    minOrder: "",
    expiry: "",
    status: "Active",
  });

  useEffect(() => {
    try {
      localStorage.setItem("adminCoupons", JSON.stringify(coupons));
    } catch (error) {
      console.error("Unable to save coupons:", error);
    }
  }, [coupons]);

  const openAddModal = () => {
    setEditingCoupon(null);
    setFormData({
      code: "",
      type: "Percentage",
      discount: "",
      minOrder: "",
      expiry: "",
      status: "Active",
    });
    setShowModal(true);
  };

  const openEditModal = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      type: coupon.type,
      discount: coupon.discount,
      minOrder: coupon.minOrder,
      expiry: coupon.expiry,
      status: coupon.status,
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const code = formData.code.trim().toUpperCase();

    if (!code || !formData.discount || !formData.expiry) {
      alert("Please fill all required fields.");
      return;
    }

    const duplicate = coupons.some(
      (coupon) =>
        coupon.code.toLowerCase() === code.toLowerCase() &&
        coupon.id !== editingCoupon?.id
    );

    if (duplicate) {
      alert("This coupon code already exists.");
      return;
    }

    const discount = Number(formData.discount);
    const minOrder = Number(formData.minOrder);

    if (
      !Number.isFinite(discount) ||
      discount <= 0 ||
      !Number.isFinite(minOrder) ||
      minOrder < 0
    ) {
      alert("Please enter valid discount and minimum order values.");
      return;
    }

    if (formData.type === "Percentage" && discount > 100) {
      alert("Percentage discount cannot be more than 100%.");
      return;
    }

    const couponData = {
      ...formData,
      code,
      discount,
      minOrder,
    };

    if (editingCoupon) {
      setCoupons((prev) =>
        prev.map((coupon) =>
          coupon.id === editingCoupon.id
            ? { ...couponData, id: editingCoupon.id }
            : coupon
        )
      );
    } else {
      setCoupons((prev) => [
        ...prev,
        { ...couponData, id: Date.now() },
      ]);
    }

    setShowModal(false);
  };

  const deleteCoupon = (id) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      setCoupons((prev) => prev.filter((coupon) => coupon.id !== id));
    }
  };

  const filteredCoupons = coupons.filter((coupon) =>
    coupon.code.toLowerCase().includes(search.toLowerCase())
  );

  const activeCoupons = coupons.filter(
    (coupon) => coupon.status === "Active"
  ).length;

  const inactiveCoupons = coupons.filter(
    (coupon) => coupon.status === "Inactive"
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Coupons & Offers
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Create and manage discount coupons for your store.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
        >
          <Plus size={19} />
          Add Coupon
        </button>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Coupons</p>
              <h2 className="mt-2 text-2xl font-bold text-gray-800">
                {coupons.length}
              </h2>
            </div>
            <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
              <TicketPercent size={24} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Coupons</p>
              <h2 className="mt-2 text-2xl font-bold text-green-600">
                {activeCoupons}
              </h2>
            </div>
            <div className="rounded-lg bg-green-100 p-3 text-green-600">
              <Tag size={24} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Inactive Coupons</p>
              <h2 className="mt-2 text-2xl font-bold text-red-500">
                {inactiveCoupons}
              </h2>
            </div>
            <div className="rounded-lg bg-red-100 p-3 text-red-500">
              <TicketPercent size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Coupon Table */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-semibold text-gray-800">All Coupons</h2>

          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search coupon..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border py-2 pl-10 pr-4 outline-none focus:border-blue-500 sm:w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left">
            <thead className="bg-gray-50 text-sm text-gray-500">
              <tr>
                <th className="px-5 py-4">Coupon Code</th>
                <th className="px-5 py-4">Discount</th>
                <th className="px-5 py-4">Minimum Order</th>
                <th className="px-5 py-4">Expiry Date</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {filteredCoupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 font-semibold text-gray-800">
                    {coupon.code}
                  </td>

                  <td className="px-5 py-4 text-gray-700">
                    {coupon.type === "Percentage"
                      ? `${coupon.discount}%`
                      : `₹${coupon.discount}`}
                  </td>

                  <td className="px-5 py-4 text-gray-700">
                    ₹{coupon.minOrder}
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {coupon.expiry}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        coupon.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {coupon.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(coupon)}
                        className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                        title="Edit Coupon"
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        onClick={() => deleteCoupon(coupon.id)}
                        className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"
                        title="Delete Coupon"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredCoupons.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-5 py-10 text-center text-gray-500"
                  >
                    No coupons found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b p-5">
              <h2 className="text-xl font-bold text-gray-800">
                {editingCoupon ? "Edit Coupon" : "Add New Coupon"}
              </h2>

              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={21} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-5">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="Example: SAVE20"
                  required
                  className="w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Discount Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-500"
                  >
                    <option value="Percentage">Percentage</option>
                    <option value="Fixed">Fixed Amount</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleChange}
                    min="1"
                    max={formData.type === "Percentage" ? "100" : undefined}
                    placeholder={formData.type === "Percentage" ? "10" : "200"}
                    required
                    className="w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Minimum Order Amount (₹)
                </label>
                <input
                  type="number"
                  name="minOrder"
                  value={formData.minOrder}
                  onChange={handleChange}
                  min="0"
                  placeholder="500"
                  className="w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Expiry Date *
                </label>
                <input
                  type="date"
                  name="expiry"
                  value={formData.expiry}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Coupon Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 border-t pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border px-5 py-2 text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700"
                >
                  {editingCoupon ? "Update Coupon" : "Save Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Coupons;
