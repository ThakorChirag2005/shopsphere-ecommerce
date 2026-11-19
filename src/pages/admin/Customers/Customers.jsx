
import { useEffect, useMemo, useState } from "react";
import {
  Users,
  Search,
  Eye,
  X,
  ShoppingBag,
  IndianRupee,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

function getOrders() {
  try {
    const savedOrders = localStorage.getItem("orders");
    const parsedOrders = savedOrders ? JSON.parse(savedOrders) : [];

    return Array.isArray(parsedOrders) ? parsedOrders : [];
  } catch (error) {
    console.error("Unable to load customer orders:", error);
    return [];
  }
}

function Customers() {
  const [orders, setOrders] = useState(getOrders);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Load latest orders when page opens
  useEffect(() => {
    const refreshOrders = () => {
      setOrders(getOrders());
    };

    window.addEventListener("focus", refreshOrders);
    window.addEventListener("storage", refreshOrders);

    return () => {
      window.removeEventListener("focus", refreshOrders);
      window.removeEventListener("storage", refreshOrders);
    };
  }, []);

  // Create unique customer list from orders
  const customers = useMemo(() => {
    const customerMap = new Map();

    orders.forEach((order) => {
      const customer = order.customer || {};

      const email = customer.email?.trim().toLowerCase();
      const phone = customer.phone?.trim();

      if (!email && !phone) return;

      const customerKey = email || phone;

      if (!customerMap.has(customerKey)) {
        customerMap.set(customerKey, {
          id: customerKey,
          name: customer.name || "Unknown Customer",
          email: customer.email || "Not available",
          phone: customer.phone || "Not available",
          address: customer.address || "",
          city: customer.city || "",
          state: customer.state || "",
          pincode: customer.pincode || "",
          orders: [],
          totalSpent: 0,
        });
      }

      const existingCustomer = customerMap.get(customerKey);

      existingCustomer.orders.push(order);
      existingCustomer.totalSpent += Number(order.total || 0);

      // Keep latest available customer details
      existingCustomer.name =
        customer.name || existingCustomer.name;

      existingCustomer.phone =
        customer.phone || existingCustomer.phone;

      existingCustomer.address =
        customer.address || existingCustomer.address;

      existingCustomer.city =
        customer.city || existingCustomer.city;

      existingCustomer.state =
        customer.state || existingCustomer.state;

      existingCustomer.pincode =
        customer.pincode || existingCustomer.pincode;
    });

    return Array.from(customerMap.values()).sort(
      (a, b) => b.orders.length - a.orders.length
    );
  }, [orders]);

  // Search Customers
  const filteredCustomers = customers.filter((customer) => {
    const searchValue = search.toLowerCase();

    return (
      customer.name.toLowerCase().includes(searchValue) ||
      customer.email.toLowerCase().includes(searchValue) ||
      customer.phone.includes(searchValue)
    );
  });

  // Summary
  const totalCustomers = customers.length;

  const totalOrders = orders.length;

  const totalRevenue = orders.reduce(
    (total, order) => total + Number(order.total || 0),
    0
  );

  const getLatestOrder = (customerOrders) => {
    return [...customerOrders].sort(
      (a, b) => Number(b.id) - Number(a.id)
    )[0];
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Customers Management
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage customers who purchase from your ShopSphere store.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Customers</p>
              <h2 className="mt-2 text-2xl font-bold text-gray-800">
                {totalCustomers}
              </h2>
            </div>

            <Users size={28} className="text-blue-500" />
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <h2 className="mt-2 text-2xl font-bold text-gray-800">
                {totalOrders}
              </h2>
            </div>

            <ShoppingBag size={28} className="text-purple-500" />
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Order Value</p>
              <h2 className="mt-2 text-2xl font-bold text-gray-800">
                ₹{totalRevenue.toLocaleString("en-IN")}
              </h2>
            </div>

            <IndianRupee size={28} className="text-green-500" />
          </div>
        </div>

      </div>

      {/* Search */}
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <div className="relative w-full sm:max-w-sm">

          <Search
            size={19}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500"
          />

        </div>
      </div>

      {/* Customers Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">

        <div className="border-b border-gray-100 p-5">
          <h2 className="font-semibold text-gray-800">
            All Customers
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">

            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-5 py-4 font-medium">Customer</th>
                <th className="px-5 py-4 font-medium">Phone</th>
                <th className="px-5 py-4 font-medium">Total Orders</th>
                <th className="px-5 py-4 font-medium">Total Spending</th>
                <th className="px-5 py-4 font-medium">Last Order</th>
                <th className="px-5 py-4 font-medium">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">

              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => {
                  const latestOrder = getLatestOrder(customer.orders);

                  return (
                    <tr
                      key={customer.id}
                      className="hover:bg-gray-50"
                    >

                      <td className="px-5 py-4">
                        <p className="font-semibold text-gray-800">
                          {customer.name}
                        </p>

                        <p className="text-xs text-gray-400">
                          {customer.email}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {customer.phone}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {customer.orders.length}
                      </td>

                      <td className="px-5 py-4 font-semibold text-gray-800">
                        ₹{customer.totalSpent.toLocaleString("en-IN")}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {latestOrder?.date || "-"}
                      </td>

                      <td className="px-5 py-4">
                        <button
                          onClick={() => setSelectedCustomer(customer)}
                          className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                          title="View Customer"
                        >
                          <Eye size={18} />
                        </button>
                      </td>

                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-5 py-12 text-center text-gray-500"
                  >
                    {customers.length === 0
                      ? "No customers found. Place an order from your ShopSphere website first."
                      : "No customers match your search."}
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl">

            <div className="mb-5 flex items-center justify-between">

              <h2 className="text-xl font-bold text-gray-800">
                Customer Profile
              </h2>

              <button
                onClick={() => setSelectedCustomer(null)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>

            </div>

            {/* Profile */}
            <div className="mb-6 flex items-center gap-4 rounded-xl bg-blue-50 p-4">

              <div className="flex size-14 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
                {selectedCustomer.name.charAt(0).toUpperCase()}
              </div>

              <div>
                <h3 className="font-bold text-gray-800">
                  {selectedCustomer.name}
                </h3>

                <p className="text-sm text-gray-500">
                  Customer
                </p>
              </div>

            </div>

            {/* Contact Information */}
            <h3 className="mb-4 font-semibold text-gray-800">
              Contact Information
            </h3>

            <div className="space-y-4 text-sm">

              <div className="flex items-center gap-3">
                <Mail size={18} className="text-blue-500" />
                <span className="text-gray-600">
                  {selectedCustomer.email}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Phone size={18} className="text-blue-500" />
                <span className="text-gray-600">
                  {selectedCustomer.phone}
                </span>
              </div>

              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 text-blue-500" />

                <span className="text-gray-600">
                  {selectedCustomer.address},{" "}
                  {selectedCustomer.city},{" "}
                  {selectedCustomer.state} -{" "}
                  {selectedCustomer.pincode}
                </span>
              </div>

            </div>

            {/* Customer Summary */}
            <div className="mt-6 grid grid-cols-2 gap-3">

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs text-gray-500">
                  Total Orders
                </p>

                <h3 className="mt-2 text-xl font-bold text-gray-800">
                  {selectedCustomer.orders.length}
                </h3>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs text-gray-500">
                  Total Spending
                </p>

                <h3 className="mt-2 text-xl font-bold text-gray-800">
                  ₹{selectedCustomer.totalSpent.toLocaleString("en-IN")}
                </h3>
              </div>

            </div>

            {/* Order History */}
            <div className="mt-6">

              <h3 className="mb-3 font-semibold text-gray-800">
                Order History
              </h3>

              <div className="space-y-3">

                {selectedCustomer.orders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 p-3"
                  >

                    <div>
                      <p className="font-medium text-gray-800">
                        #{order.id}
                      </p>

                      <p className="text-xs text-gray-500">
                        {order.date}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-gray-800">
                        ₹{Number(order.total || 0).toLocaleString("en-IN")}
                      </p>

                      <p className="text-xs text-gray-500">
                        {order.status}
                      </p>
                    </div>

                  </div>
                ))}

              </div>

            </div>

            <button
              onClick={() => setSelectedCustomer(null)}
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

export default Customers;
