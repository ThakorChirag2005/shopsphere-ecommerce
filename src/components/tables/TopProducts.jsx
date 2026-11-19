
function TopProducts() {
  const savedOrders = (() => {
    try {
      const parsed = JSON.parse(localStorage.getItem("orders") || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  })();

  const productMap = new Map();
  savedOrders.forEach((order) => {
    (order.items || []).forEach((item) => {
      const quantity = Number(item.quantity || 1);
      const current = productMap.get(item.name) || {
        id: item.id,
        name: item.name || "Unknown Product",
        category: item.category || "General",
        sold: 0,
        revenue: 0,
      };
      current.sold += quantity;
      current.revenue += Number(item.price || 0) * quantity;
      productMap.set(item.name, current);
    });
  });

  const products = Array.from(productMap.values())
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5);

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-rose-100/80 bg-white/90 p-4 shadow-sm shadow-rose-100/70 sm:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-rose-950">
          Top Products
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Best selling products
        </p>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[500px] text-left">
          <thead>
            <tr className="border-b border-rose-100 text-xs text-slate-400">
              <th className="px-3 py-3 font-semibold">Product</th>
              <th className="px-3 py-3 font-semibold">Category</th>
              <th className="px-3 py-3 font-semibold">Sold</th>
              <th className="px-3 py-3 font-semibold">Revenue</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b border-rose-50 last:border-0 hover:bg-rose-50/60"
              >
                <td className="px-3 py-4 text-sm font-semibold text-rose-900">
                  {product.name}
                </td>
                <td className="px-3 py-4 text-sm text-slate-500">
                  {product.category}
                </td>
                <td className="px-3 py-4 text-sm text-slate-600">
                  {product.sold}
                </td>
                <td className="px-3 py-4 text-sm font-semibold text-slate-800">
                  ₹{product.revenue.toLocaleString("en-IN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TopProducts;
