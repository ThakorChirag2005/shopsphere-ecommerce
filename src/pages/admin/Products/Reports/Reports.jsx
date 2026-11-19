
import {
  IndianRupee,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  FileText,
} from "lucide-react";

function Reports() {
  const orders = JSON.parse(localStorage.getItem("orders") || "[]");
  const products = JSON.parse(localStorage.getItem("adminProducts") || "[]");

  const totalRevenue = orders.reduce(
    (total, order) => total + Number(order.total || 0),
    0
  );

  const totalOrders = orders.length;

  const customers = new Set(
    orders.map((order) =>
      order.customer?.email || order.customer?.phone
    ).filter(Boolean)
  );

  const totalCustomers = customers.size;

  const totalProducts = products.length;

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const sales = Array(12).fill(0);

  orders.forEach((order) => {
    const date = new Date(order.createdAt || order.date);
    if (!Number.isNaN(date.getTime())) {
      sales[date.getMonth()] += Number(order.total || 0);
    }
  });

  const monthlySales = months.map((month, index) => ({
    month,
    amount: sales[index],
  }));

  const statusCounts = {
    Processing: 0,
    Shipped: 0,
    Delivered: 0,
    Cancelled: 0,
  };

  orders.forEach((order) => {
    const status = order.status || "Processing";

    if (statusCounts[status] !== undefined) {
      statusCounts[status]++;
    }
  });

  const topProducts = {};

  orders.forEach((order) => {
    (order.items || []).forEach((item) => {
      const name = item.name || item.title || "Unknown Product";
      const quantity = Number(item.quantity || 1);

      if (!topProducts[name]) {
        topProducts[name] = {
          name,
          quantity: 0,
          revenue: 0,
        };
      }

      topProducts[name].quantity += quantity;
      topProducts[name].revenue +=
        Number(item.price || 0) * quantity;
    });
  });

  const bestSellingProducts = Object.values(topProducts)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  const maxSales = Math.max(
    ...monthlySales.map((item) => item.amount),
    1
  );

  const statCards = [
    {
      title: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString("en-IN")}`,
      icon: IndianRupee,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Total Orders",
      value: totalOrders,
      icon: ShoppingCart,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Total Customers",
      value: totalCustomers,
      icon: Users,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Total Products",
      value: totalProducts,
      icon: Package,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Reports & Analytics
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Track your store performance and sales reports.
        </p>
      </div>

      {/* Statistics */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    {card.title}
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-gray-800">
                    {card.value}
                  </h2>
                </div>

                <div className={`rounded-lg p-3 ${card.color}`}>
                  <Icon size={25} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Monthly Sales */}
      <div className="mb-6 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-6 flex items-center gap-2">
          <TrendingUp className="text-blue-600" size={22} />
          <h2 className="text-lg font-bold text-gray-800">
            Monthly Sales Report
          </h2>
        </div>

        <div className="flex h-64 items-end justify-around gap-2 border-b border-gray-200 px-2">
          {monthlySales.map((item) => (
            <div
              key={item.month}
              className="flex h-full flex-1 flex-col items-center justify-end"
            >
              <span className="mb-2 text-center text-[10px] text-gray-500 sm:text-xs">
                {item.amount > 0
                  ? `₹${item.amount.toLocaleString("en-IN")}`
                  : ""}
              </span>

              <div
                title={`${item.month}: ₹${item.amount}`}
                style={{
                  height: `${(item.amount / maxSales) * 65}%`,
                  minHeight: item.amount > 0 ? "8px" : "0px",
                }}
                className="w-full max-w-10 rounded-t-md bg-blue-500 transition-all hover:bg-blue-700"
              />

              <span className="mt-2 text-xs text-gray-500">
                {item.month}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Order Status */}
      <div className="mb-6 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <h2 className="mb-5 text-lg font-bold text-gray-800">
          Order Status Report
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Object.entries(statusCounts).map(([status, count]) => (
            <div
              key={status}
              className="rounded-lg border border-gray-100 bg-gray-50 p-4"
            >
              <p className="text-sm text-gray-500">{status}</p>
              <h3 className="mt-2 text-2xl font-bold text-gray-800">
                {count}
              </h3>
            </div>
          ))}
        </div>
      </div>

      {/* Best Selling Products */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b p-5">
          <FileText size={22} className="text-blue-600" />
          <h2 className="text-lg font-bold text-gray-800">
            Best Selling Products
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px] text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                  Product Name
                </th>
                <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                  Quantity Sold
                </th>
                <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                  Revenue
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {bestSellingProducts.length > 0 ? (
                bestSellingProducts.map((product) => (
                  <tr key={product.name} className="hover:bg-gray-50">
                    <td className="px-5 py-4 font-medium text-gray-800">
                      {product.name}
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {product.quantity}
                    </td>
                    <td className="px-5 py-4 font-semibold text-gray-800">
                      ₹{product.revenue.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="px-5 py-10 text-center text-gray-500"
                  >
                    No sales data available yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default Reports;
