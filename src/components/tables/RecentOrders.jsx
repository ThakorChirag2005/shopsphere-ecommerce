
import { useEffect, useState } from "react";
import { Eye, X } from "lucide-react";
import { Link } from "react-router-dom";

function RecentOrders() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const savedOrders = (() => {
    try {
      const parsed = JSON.parse(localStorage.getItem("orders") || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  })();

  const orders = [...savedOrders]
    .sort((a, b) => Number(b.id) - Number(a.id))
    .slice(0, 6)
    .map((order) => ({
      id: `#${order.id}`,
      customer:
        typeof order.customer === "object"
          ? order.customer?.name || "Unknown Customer"
          : order.customer || "Unknown Customer",
      date: order.date || "Recent",
      amount: `₹${Number(order.total || 0).toLocaleString("en-IN")}`,
      payment: order.payment || "Pending",
      status: order.status || "Processing",
    }));

  const paymentColors = {
    Paid: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Failed: "bg-red-100 text-red-700",
  };

  const statusColors = {
    Delivered: "bg-green-100 text-green-700",
    Processing: "bg-blue-100 text-blue-700",
    Shipped: "bg-purple-100 text-purple-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  useEffect(() => {
    if (!selectedOrder) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSelectedOrder(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedOrder]);

  return (
    <div className="mt-8 w-full overflow-hidden rounded-2xl border border-rose-100/80 bg-white/90 p-6 shadow-sm shadow-rose-100/70">

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-rose-950">
            Recent Orders
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Latest customer orders
          </p>
        </div>

        <Link
          to="/admin/orders"
          className="rounded-lg bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
        >
          View All
        </Link>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[750px] text-left">
          <thead>
            <tr className="border-b border-rose-100 text-sm text-slate-400">
              <th className="px-4 py-4 font-medium">Order ID</th>
              <th className="px-4 py-4 font-medium">Customer</th>
              <th className="px-4 py-4 font-medium">Date</th>
              <th className="px-4 py-4 font-medium">Amount</th>
              <th className="px-4 py-4 font-medium">Payment</th>
              <th className="px-4 py-4 font-medium">Status</th>
              <th className="px-4 py-4 font-medium">Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-rose-50 transition hover:bg-rose-50/60"
              >
                <td className="px-4 py-4 text-sm font-semibold text-rose-700">
                  {order.id}
                </td>

                <td className="px-4 py-4 text-sm font-medium text-gray-700">
                  {order.customer}
                </td>

                <td className="px-4 py-4 text-sm text-gray-500">
                  {order.date}
                </td>

                <td className="px-4 py-4 text-sm font-semibold text-gray-800">
                  {order.amount}
                </td>

                <td className="px-4 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${paymentColors[order.payment]}`}
                  >
                    {order.payment}
                  </span>
                </td>

                <td className="px-4 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[order.status]}`}
                  >
                    {order.status}
                  </span>
                </td>

                <td className="px-4 py-4">
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(order)}
                    aria-label={`View ${order.id}`}
                    className="rounded-lg p-2 text-slate-500 transition hover:bg-rose-100 hover:text-rose-700"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedOrder(null);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="recent-order-details-title"
            className="w-full max-w-lg rounded-2xl border border-rose-100 bg-white p-5 shadow-2xl shadow-rose-950/20 sm:p-7"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-rose-600">
                  Order details
                </p>
                <h2
                  id="recent-order-details-title"
                  className="mt-1 text-xl font-bold text-rose-950"
                >
                  {selectedOrder.id}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                aria-label="Close order details"
                className="grid size-9 shrink-0 place-items-center rounded-lg text-slate-500 transition hover:bg-rose-50 hover:text-rose-700"
              >
                <X size={19} />
              </button>
            </div>

            <dl className="space-y-4">
              <div className="flex items-center justify-between gap-4 border-b border-rose-50 pb-3">
                <dt className="text-sm text-slate-500">Customer</dt>
                <dd className="text-right text-sm font-semibold text-slate-800">
                  {selectedOrder.customer}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-rose-50 pb-3">
                <dt className="text-sm text-slate-500">Order date</dt>
                <dd className="text-right text-sm font-medium text-slate-700">
                  {selectedOrder.date}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-rose-50 pb-3">
                <dt className="text-sm text-slate-500">Payment</dt>
                <dd>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${paymentColors[selectedOrder.payment]}`}
                  >
                    {selectedOrder.payment}
                  </span>
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-rose-50 pb-3">
                <dt className="text-sm text-slate-500">Order status</dt>
                <dd>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[selectedOrder.status]}`}
                  >
                    {selectedOrder.status}
                  </span>
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 pt-1">
                <dt className="text-sm font-semibold text-slate-600">
                  Total amount
                </dt>
                <dd className="text-lg font-bold text-rose-800">
                  {selectedOrder.amount}
                </dd>
              </div>
            </dl>

            <button
              type="button"
              onClick={() => setSelectedOrder(null)}
              className="mt-7 min-h-11 w-full rounded-xl bg-gradient-to-r from-rose-700 to-red-800 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-rose-200 transition hover:from-rose-800 hover:to-red-900"
            >
              Close details
            </button>
          </section>
        </div>
      )}
    </div>
  );
}

export default RecentOrders;
