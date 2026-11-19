
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function SalesChart() {
  const orders = (() => {
    try {
      const parsed = JSON.parse(localStorage.getItem("orders") || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  })();

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const monthlyRevenue = Array(12).fill(0);

  orders.forEach((order) => {
    const date = new Date(order.createdAt || order.date);
    if (!Number.isNaN(date.getTime())) {
      monthlyRevenue[date.getMonth()] += Number(order.total || 0);
    }
  });

  const salesData = months.map((month, index) => ({
    month,
    revenue: monthlyRevenue[index],
  }));

  return (
    <section className="w-full min-w-0 rounded-2xl border border-rose-100/80 bg-white/90 p-4 shadow-sm shadow-rose-100/70 backdrop-blur sm:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-rose-950">Sales Overview</h2>
          <p className="mt-1 text-sm text-slate-400">Monthly revenue performance</p>
        </div>

        <select
          defaultValue="2026"
          aria-label="Sales chart year"
          className="min-h-10 rounded-lg border-rose-200 bg-white px-3 text-sm text-slate-600 shadow-none focus:border-rose-400 focus:ring-rose-200"
        >
          <option value="2026">2026</option>
          <option value="2025">2025</option>
        </select>
      </div>

      <div className="h-64 min-w-0 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={salesData}>
            <defs>
              <linearGradient
                id="revenueGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#9f1239"
                  stopOpacity={0.35}
                />
                <stop
                  offset="100%"
                  stopColor="#9f1239"
                  stopOpacity={0.02}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1d5dc"
            />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `₹${value / 1000}k`}
            />

            <Tooltip
              formatter={(value) => [
                `₹${Number(value).toLocaleString("en-IN")}`,
                "Revenue",
              ]}
            />

            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#9f1239"
              strokeWidth={3}
              fill="url(#revenueGradient)"
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default SalesChart;
