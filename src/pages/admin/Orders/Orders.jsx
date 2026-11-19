
import { useEffect, useState } from "react";
import {
  Search,
  ShoppingCart,
  Eye,
  X,
  Package,
  IndianRupee,
} from "lucide-react";

function Orders() {
  const [orders, setOrders] = useState(() => {
    try {
      const savedOrders = localStorage.getItem("orders");
      const parsedOrders = savedOrders ? JSON.parse(savedOrders) : [];
      return Array.isArray(parsedOrders) ? parsedOrders : [];
    } catch (error) {
      console.error("Unable to load storefront orders:", error);
      return [];
    }
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  const filteredOrders = orders.filter((order) => {
    const customer =
      typeof order.customer === "object" ? order.customer : {};
    const customerName = customer.name || order.customer || "";
    const customerEmail = customer.email || order.email || "";
    const matchesSearch =
      String(order.id).toLowerCase().includes(search.toLowerCase()) ||
      String(customerName).toLowerCase().includes(search.toLowerCase()) ||
      String(customerEmail).toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const updateStatus = (id, newStatus) => {
    setOrders((previousOrders) =>
      previousOrders.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );

    if (selectedOrder?.id === id) {
      setSelectedOrder((previous) => ({
        ...previous,
        status: newStatus,
      }));
    }
  };

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

  const getPaymentStyle = (payment) => {
    const styles = {
      Paid: "bg-green-100 text-green-700",
      Pending: "bg-yellow-100 text-yellow-700",
      Failed: "bg-red-100 text-red-700",
    };

    return styles[payment] || "bg-gray-100 text-gray-700";
  };

  const totalRevenue = orders.reduce(
    (total, order) =>
      order.payment === "Paid" ? total + order.total : total,
    0
  );

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered"
  ).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Orders Management
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage and track all customer orders.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <h2 className="mt-2 text-2xl font-bold text-gray-800">
                {totalOrders}
              </h2>
            </div>
            <ShoppingCart className="text-blue-500" size={28} />
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <h2 className="mt-2 text-2xl font-bold text-gray-800">
                ₹{totalRevenue.toLocaleString("en-IN")}
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
          <h2 className="font-semibold text-gray-800">All Orders</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
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
                      {order.id}
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-800">
                        {typeof order.customer === "object"
                          ? order.customer?.name
                          : order.customer}
                      </p>
                      <p className="text-xs text-gray-400">
                        {typeof order.customer === "object"
                          ? order.customer?.email
                          : order.email}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {order.date}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {Array.isArray(order.items)
                        ? order.items.reduce(
                            (total, item) =>
                              total + Number(item.quantity || 1),
                            0
                          )
                        : Number(order.items || 0)}
                    </td>

                    <td className="px-5 py-4 font-semibold text-gray-800">
                      ₹{Number(order.total || 0).toLocaleString("en-IN")}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getPaymentStyle(
                          order.payment || "Not Recorded"
                        )}`}
                      >
                        {order.payment || "Not Recorded"}
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
                    className="px-5 py-10 text-center text-gray-500"
                  >
                    No orders found.
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
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
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

            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Order ID</span>
                <span className="font-semibold text-gray-800">
                  {selectedOrder.id}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Customer</span>
                <span className="font-medium text-gray-800">
                  {typeof selectedOrder.customer === "object"
                    ? selectedOrder.customer?.name
                    : selectedOrder.customer}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Email</span>
                <span className="text-gray-800">
                  {typeof selectedOrder.customer === "object"
                    ? selectedOrder.customer?.email
                    : selectedOrder.email}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Order Date</span>
                <span className="text-gray-800">
                  {selectedOrder.date}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Total Items</span>
                <span className="text-gray-800">
                  {Array.isArray(selectedOrder.items)
                    ? selectedOrder.items.reduce(
                        (total, item) =>
                          total + Number(item.quantity || 1),
                        0
                      )
                    : Number(selectedOrder.items || 0)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Payment</span>
                <span
                  className={`rounded-full px-3 py-1 text-xs ${getPaymentStyle(
                    selectedOrder.payment || "Not Recorded"
                  )}`}
                >
                  {selectedOrder.payment || "Not Recorded"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500">Order Status</span>
                <select
                  value={selectedOrder.status}
                  onChange={(e) =>
                    updateStatus(selectedOrder.id, e.target.value)
                  }
                  className={`rounded-full border-0 px-3 py-1.5 text-xs outline-none ${getStatusStyle(
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

              <div className="flex justify-between border-t border-gray-100 pt-4">
                <span className="font-semibold text-gray-700">
                  Total Amount
                </span>
                <span className="text-lg font-bold text-blue-600">
                  ₹{selectedOrder.total.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="mt-6 w-full rounded-lg bg-blue-600 py-3 font-medium text-white hover:bg-blue-700"
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
