
import {
  Package,
  ShoppingCart,
  Users,
  IndianRupee,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

import SalesChart from "./SalesChart";
import RecentOrders from "../../../components/tables/RecentOrders";
import TopProducts from "../../../components/tables/TopProducts";
import { getStoreProducts } from "../../../data/products";

function Dashboard() {
  const orders = (() => {
    try {
      const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      return Array.isArray(savedOrders) ? savedOrders : [];
    } catch {
      return [];
    }
  })();

  const products = (() => {
    try {
      const savedProducts = JSON.parse(
        localStorage.getItem("adminProducts") || "[]"
      );
      return Array.isArray(savedProducts) && savedProducts.length
        ? savedProducts
        : getStoreProducts();
    } catch {
      return [];
    }
  })();

  const revenue = orders.reduce(
    (total, order) => total + Number(order.total || 0),
    0
  );
  const customerEmails = new Set(
    orders
      .map((order) =>
        typeof order.customer === "object"
          ? order.customer?.email
          : order.email
      )
      .filter(Boolean)
  );

  const statCards = [
    {
      title: "Total Products",
      value: String(products.length),
      change: "Live inventory",
      positive: true,
      icon: Package,
      color: "bg-rose-100 text-rose-700",
      accent: "from-rose-600 to-pink-400",
    },
    {
      title: "Total Orders",
      value: String(orders.length),
      change: "Live orders",
      positive: true,
      icon: ShoppingCart,
      color: "bg-amber-100 text-amber-700",
      accent: "from-amber-500 to-orange-400",
    },
    {
      title: "Total Customers",
      value: String(customerEmails.size),
      change: "Unique customers",
      positive: true,
      icon: Users,
      color: "bg-emerald-100 text-emerald-700",
      accent: "from-emerald-500 to-teal-400",
    },
    {
      title: "Total Revenue",
      value: `₹${revenue.toLocaleString("en-IN")}`,
      change: "Order revenue",
      positive: true,
      icon: IndianRupee,
      color: "bg-fuchsia-100 text-fuchsia-700",
      accent: "from-fuchsia-600 to-rose-400",
    },
  ];

  return (
    <div className="w-full min-w-0 space-y-6">

      {/* Dashboard Heading */}
      <div>
        <h1 className="text-2xl font-bold text-rose-950 sm:text-3xl">
          Dashboard Overview
        </h1>

        <p className="mt-1 text-sm text-rose-900/60 sm:text-base">
          Welcome to ShopSphere Admin Panel
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {statCards.map((card) => {
          const Icon = card.icon;
          const TrendIcon = card.positive ? TrendingUp : TrendingDown;

          return (
            <div
              key={card.title}
              className="relative flex min-w-0 items-center gap-4 overflow-hidden rounded-2xl border border-white/80 bg-white/90 p-5 shadow-sm shadow-rose-100/70 backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-rose-200/50"
            >
              <span
                className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${card.accent}`}
              />
              <div
                className={`grid size-12 shrink-0 place-items-center rounded-xl ${card.color}`}
              >
                <Icon size={24} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-500">
                  {card.title}
                </p>

                <h2 className="mt-1 text-2xl font-bold text-slate-800">
                  {card.value}
                </h2>

                <div
                  className={`mt-2 flex items-center gap-1 text-xs font-semibold ${
                    card.positive ? "text-green-600" : "text-red-500"
                  }`}
                >
                  <TrendIcon size={14} />
                  <span>{card.change}</span>
                </div>
              </div>
            </div>
          );
        })}

      </div>

      {/* Sales Chart */}
      <div className="w-full min-w-0">
        <SalesChart />
      </div>

      {/* Recent Orders */}
      <div className="w-full min-w-0">
        <RecentOrders />
      </div>


 {/* Top Products */}
<div className="w-full min-w-0">
  <TopProducts />
</div>
    </div>
  );
}

export default Dashboard;
