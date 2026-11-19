
import { useEffect, useState } from "react";
import {
  Search,
  ShoppingCart,
  Eye,
  X,
  Package,
  IndianRupee,
} from "lucide-react";

function getSavedOrders() {
  try {
    const savedOrders = localStorage.getItem("orders");
    const parsedOrders = savedOrders ? JSON.parse(savedOrders) : [];

    return Array.isArray(parsedOrders) ? parsedOrders : [];
  } catch (error) {
    console.error("Unable to load orders:", error);
    return [];
  }
}

function Orders() {
  const [orders, setOrders] = useState(getSavedOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Save updated orders
  useEffect(() => {
    try {
      localStorage.setItem("orders", JSON.stringify(orders));
    } catch (error) {
      console.error("Unable to save orders:", error);
    }
  }, [orders]);

  // Search and Filter
  const filteredOrders = orders.filter((order) => {
    const customerName = order.customer?.name || "";
    const customerEmail = order.customer?.email || "";

    const matchesSearch =
      String(order.id).toLowerCase().includes(search.toLowerCase()) ||
      customerName.toLowerCase().includes(search.toLowerCase()) ||
      customerEmail.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Update Order Status
  const updateStatus = (id, newStatus) => {
    setOrders((previousOrders) =>
      previousOrders.map((order) =>
        order.id === id
          ? { ...order, status: newStatus }
          : order
      )
    );

    setSelectedOrder((previous) =>
      previous?.id === id
        ? { ...previous, status: newStatus }
        : previous
    );
  };

  // Status Colors
  const getStatusStyle = (status) => {
    const styles = {
      Delivered: "bg-green-100 text-green-700",
      Processing: "bg-blue-100 text-blue-700",
      Shipped: "bg-purple-100 text-purple-700",
      Pending: "bg-yellow-100 text-yellow-700",
      Cancelled: "bg-red-100 text-red-700",
    };

    return styles[status] || "bg-gray-100 text-gray-700";
  };

  // Summary
  const totalOrderValue = orders.reduce(
    (total, order) => total + Number(order.total || 0),
    0
  );

  const pendingOrders = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered"
  ).length;

  const getTotalItems = (items = []) =>
    items.reduce(
      (total, item) => total + Number(item.quantity || 1),
      0
    );

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Orders Management
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage customer orders from your ShopSphere website.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <h2 className="mt-2 text-2xl font-bold text-gray-800">
                {orders.length}
              </h2>
            </div>
            <ShoppingCart className="text-blue-500" size={28} />
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Order Value</p>
              <h2 className="mt-2 text-2xl font-bold text-gray-800">
                ₹{totalOrderValue.toLocaleString("en-IN")}
              </h2>
            </div>
            <IndianRupee className="text-green-500" size={28} />
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Orders</p>
              <h2 className="mt-2 text-2xl font-bold text-gray-800">
                {pendingOrders}
              </h2>
            </div>
            <Package className="text-yellow-500" size={28} />
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Delivered Orders</p>
              <h2 className="mt-2 text-2xl font-bold text-gray-800">
                {deliveredOrders}
              </h2>
            </div>
            <Package className="text-purple-500" size={28} />
          </div>
        </div>

      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">

        <div className="relative w-full sm:max-w-sm">
          <Search
            size={19}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search order, customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
        >
          <option value="All">All Orders</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>

      </div>

      {/* Orders Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">

        <div className="border-b border-gray-100 p-5">
          <h2 className="font-semibold text-gray-800">
            Website Customer Orders
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left text-sm">

            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-5 py-4 font-medium">Order ID</th>
                <th className="px-5 py-4 font-medium">Customer</th>
                <th className="px-5 py-4 font-medium">Date</th>
                <th className="px-5 py-4 font-medium">Items</th>
                <th className="px-5 py-4 font-medium">Total</th>
                <th className="px-5 py-4 font-medium">Payment</th>
                <th className="px-5 py-4 font-medium">Status</th>
                <th className="px-5 py-4 font-medium">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">

              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">

                    <td className="px-5 py-4 font-semibold text-blue-600">
                      #{order.id}
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-800">
                        {order.customer?.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {order.customer?.email}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {order.date}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {getTotalItems(order.items)}
                    </td>

                    <td className="px-5 py-4 font-semibold text-gray-800">
                      ₹{Number(order.total || 0).toLocaleString("en-IN")}
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                        Not Recorded
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateStatus(order.id, e.target.value)
                        }
                        className={`rounded-full border-0 px-3 py-1.5 text-xs font-medium outline-none ${getStatusStyle(
                          order.status
                        )}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="px-5 py-4">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                        title="View Order"
                      >
                        <Eye size={18} />
                      </button>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="px-5 py-12 text-center text-gray-500"
                  >
                    {orders.length === 0
                      ? "No customer orders found. Place an order from your website first."
                      : "No orders match your search."}
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl">

            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                Order Details
              </h2>

              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Customer Details */}
            <h3 className="mb-3 font-semibold text-gray-800">
              Customer Information
            </h3>

            <div className="space-y-3 text-sm">

              <div className="flex justify-between gap-3">
                <span className="text-gray-500">Order ID</span>
                <span className="font-semibold text-gray-800">
                  #{selectedOrder.id}
                </span>
              </div>

              <div className="flex justify-between gap-3">
                <span className="text-gray-500">Customer</span>
                <span className="font-medium text-gray-800">
                  {selectedOrder.customer?.name}
                </span>
              </div>

              <div className="flex justify-between gap-3">
                <span className="text-gray-500">Email</span>
                <span className="text-gray-800">
                  {selectedOrder.customer?.email}
                </span>
              </div>

              <div className="flex justify-between gap-3">
                <span className="text-gray-500">Phone</span>
                <span className="text-gray-800">
                  {selectedOrder.customer?.phone}
                </span>
              </div>

              <div className="flex justify-between gap-3">
                <span className="text-gray-500">Order Date</span>
                <span className="text-gray-800">
                  {selectedOrder.date}
                </span>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <p className="mb-2 font-semibold text-gray-800">
                  Delivery Address
                </p>

                <p className="text-gray-600">
                  {selectedOrder.customer?.address}
                </p>
                <p className="text-gray-600">
                  {selectedOrder.customer?.city},{" "}
                  {selectedOrder.customer?.state} -{" "}
                  {selectedOrder.customer?.pincode}
                </p>
              </div>

            </div>

            {/* Ordered Products */}
            <div className="mt-6 border-t border-gray-100 pt-4">

              <h3 className="mb-3 font-semibold text-gray-800">
                Ordered Products
              </h3>

              <div className="space-y-3">
                {selectedOrder.items?.map((item, index) => (
                  <div
                    key={`${item.id}-${index}`}
                    className="flex items-center justify-between gap-3 rounded-lg bg-gray-50 p-3"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                    </div>

                    <p className="font-semibold text-gray-800">
                      ₹{(
                        Number(item.price || 0) *
                        Number(item.quantity || 1)
                      ).toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
              </div>

            </div>

            {/* Order Summary */}
            <div className="mt-5 space-y-3 border-t border-gray-100 pt-4 text-sm">

              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span>₹{Number(selectedOrder.subtotal || 0).toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span>₹{Number(selectedOrder.shipping || 0).toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Tax</span>
                <span>₹{Number(selectedOrder.tax || 0).toFixed(2)}</span>
              </div>

              <div className="flex justify-between border-t border-gray-100 pt-3 text-lg font-bold">
                <span>Total Amount</span>
                <span className="text-blue-600">
                  ₹{Number(selectedOrder.total || 0).toLocaleString("en-IN")}
                </span>
              </div>

            </div>

            {/* Update Status */}
            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Update Order Status
              </label>

              <select
                value={selectedOrder.status}
                onChange={(e) =>
                  updateStatus(selectedOrder.id, e.target.value)
                }
                className={`w-full rounded-lg border-0 px-4 py-3 text-sm font-medium outline-none ${getStatusStyle(
                  selectedOrder.status
                )}`}
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="mt-5 w-full rounded-lg bg-blue-600 py-3 font-medium text-white hover:bg-blue-700"
            >
              Close
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

export default Orders;
