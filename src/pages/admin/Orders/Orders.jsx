
import { useState } from "react";

function Orders() {
  const [orders] = useState(() =>
    JSON.parse(localStorage.getItem("orders") || "[]")
  );

  const [selectedOrder, setSelectedOrder] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case "Processing":
        return "bg-yellow-100 text-yellow-700";
      case "Shipped":
        return "bg-blue-100 text-blue-700";
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const orderStatuses = [
    "Processing",
    "Shipped",
    "Delivered",
  ];

  return (
    <div className="px-4 md:px-8 py-10 bg-gray-50 min-h-screen">

      <h1 className="text-3xl font-bold mb-8">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow text-center">
          <h2 className="text-xl font-semibold">
            No Orders Found
          </h2>

          <p className="text-gray-500 mt-2">
            You have not placed any orders yet.
          </p>
        </div>
      ) : (
        <div className="space-y-6">

          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-6 rounded-xl shadow-md"
            >

              <div className="flex flex-col sm:flex-row justify-between gap-4 border-b pb-4">

                <div>
                  <h2 className="text-lg font-bold">
                    Order #{order.id}
                  </h2>

                  <p className="text-gray-500 mt-1">
                    Date: {order.date}
                  </p>
                </div>

                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold w-fit ${getStatusColor(order.status)}`}
                >
                  {order.status}
                </span>

              </div>

              {/* Products */}
              <div className="py-4 space-y-3">

                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4"
                  >

                    <div className="flex items-center gap-3">

                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />

                      <div>
                        <p className="font-semibold">
                          {item.name}
                        </p>

                        <p className="text-gray-500 text-sm">
                          Quantity: {item.quantity}
                        </p>
                      </div>

                    </div>

                    <p className="font-semibold">
                      ₹{item.price * item.quantity}
                    </p>

                  </div>
                ))}

              </div>

              {/* Total and View Details */}
              <div className="border-t pt-4 flex justify-between items-center gap-3">

                <button
                  onClick={() =>
                    setSelectedOrder(
                      selectedOrder === order.id
                        ? null
                        : order.id
                    )
                  }
                  className="text-rose-800 font-semibold hover:underline"
                >
                  {selectedOrder === order.id
                    ? "Hide Details"
                    : "View Details"}
                </button>

                <div className="text-right">
                  <span className="font-semibold block">
                    Total Amount
                  </span>

                  <span className="text-xl font-bold text-rose-800">
                    ₹{order.total}
                  </span>
                </div>

              </div>

              {/* Order Details */}
              {selectedOrder === order.id && (
                <div className="mt-6 border-t pt-5">

                  <h3 className="text-lg font-bold mb-5">
                    Order Details
                  </h3>

                  {/* Customer Information */}
                  <div className="bg-gray-50 p-5 rounded-lg mb-5">

                    <h4 className="font-bold text-lg mb-3">
                      Customer Information
                    </h4>

                    <p className="mb-2">
                      <strong>Name:</strong>{" "}
                      {order.customer?.name || "Not available"}
                    </p>

                    <p className="mb-2">
                      <strong>Email:</strong>{" "}
                      {order.customer?.email || "Not available"}
                    </p>

                    <p className="mb-2">
                      <strong>Phone:</strong>{" "}
                      {order.customer?.phone || "Not available"}
                    </p>

                  </div>

                  {/* Delivery Address */}
                  <div className="bg-gray-50 p-5 rounded-lg mb-5">

                    <h4 className="font-bold text-lg mb-3">
                      Delivery Address
                    </h4>

                    <p>
                      {order.customer?.address || "Not available"}
                    </p>

                    <p>
                      {order.customer?.city},{" "}
                      {order.customer?.state}
                    </p>

                    <p>
                      <strong>Pincode:</strong>{" "}
                      {order.customer?.pincode || "Not available"}
                    </p>

                  </div>

                  {/* Payment Summary */}
                  <div className="bg-gray-50 p-5 rounded-lg mb-5">

                    <h4 className="font-bold text-lg mb-3">
                      Order Summary
                    </h4>

                    <div className="flex justify-between mb-2">
                      <span>Subtotal</span>
                      <span>₹{order.subtotal}</span>
                    </div>

                    <div className="flex justify-between mb-2">
                      <span>Delivery</span>
                      <span>₹{order.shipping}</span>
                    </div>

                    <div className="flex justify-between font-bold border-t pt-3 mt-3">
                      <span>Total</span>
                      <span className="text-rose-800">
                        ₹{order.total}
                      </span>
                    </div>

                    <p className="mt-3 text-gray-600 text-sm">
                      Delivery Option:{" "}
                      {order.deliveryOption || "Standard"}
                    </p>

                  </div>

                  {/* Order Status Timeline */}
                  <h4 className="font-semibold mb-4">
                    Order Status Timeline
                  </h4>

                  {order.status === "Cancelled" ? (
                    <p className="text-red-600 font-semibold">
                      This order has been cancelled.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-3">

                      {orderStatuses.map((status, index) => {
                        const currentIndex =
                          orderStatuses.indexOf(order.status);

                        const completed =
                          currentIndex >= index;

                        return (
                          <div
                            key={status}
                            className={`px-4 py-3 rounded-lg text-sm font-semibold ${
                              completed
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {completed ? "✓ " : ""}
                            {status}
                          </div>
                        );
                      })}

                    </div>
                  )}

                </div>
              )}

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default Orders;
