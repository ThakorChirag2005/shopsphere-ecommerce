import { useEffect, useState } from "react";
import {
  Boxes,
  ChartNoAxesCombined,
  Image,
  LayoutDashboard,
  Menu,
  MessageSquare,
  Package,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  ShoppingBag,
  Store,
  Tags,
  TicketPercent,
  Users,
  X,
} from "lucide-react";
import { Link, NavLink } from "react-router-dom";

const menuGroups = [
  {
    name: "OVERVIEW",
    labelColor: "text-amber-200",
    ruleColor: "bg-amber-300",
    items: [
      {
        name: "Dashboard",
        icon: LayoutDashboard,
        path: "/admin/dashboard",
        iconColor: "text-amber-300",
      },
    ],
  },
  {
    name: "CATALOG",
    labelColor: "text-rose-200",
    ruleColor: "bg-rose-400",
    items: [
      {
        name: "Products",
        icon: Package,
        path: "/admin/products",
        iconColor: "text-amber-300",
      },
      {
        name: "Categories",
        icon: Tags,
        path: "/admin/categories",
        iconColor: "text-fuchsia-300",
      },
      {
        name: "Inventory",
        icon: Boxes,
        path: "/admin/inventory",
        iconColor: "text-amber-300",
      },
    ],
  },
  {
    name: "SALES",
    labelColor: "text-emerald-300",
    ruleColor: "bg-emerald-400",
    items: [
      {
        name: "Orders",
        icon: ShoppingBag,
        path: "/admin/orders",
        iconColor: "text-emerald-300",
      },
      {
        name: "Customers",
        icon: Users,
        path: "/admin/customers",
        iconColor: "text-sky-300",
      },
      {
        name: "Coupons",
        icon: TicketPercent,
        path: "/admin/coupons",
        iconColor: "text-orange-300",
      },
      {
        name: "Reviews",
        icon: MessageSquare,
        path: "/admin/reviews",
        iconColor: "text-pink-300",
      },
    ],
  },
  {
    name: "MARKETING",
    labelColor: "text-fuchsia-200",
    ruleColor: "bg-fuchsia-400",
    items: [
      {
        name: "Banners",
        icon: Image,
        path: "/admin/banners",
        iconColor: "text-pink-300",
      },
    ],
  },
  {
    name: "ANALYTICS",
    labelColor: "text-yellow-200",
    ruleColor: "bg-yellow-400",
    items: [
      {
        name: "Reports",
        icon: ChartNoAxesCombined,
        path: "/admin/reports",
        iconColor: "text-amber-300",
      },
    ],
  },
  {
    name: "PREFERENCES",
    labelColor: "text-rose-200",
    ruleColor: "bg-rose-400",
    items: [
      {
        name: "Settings",
        icon: Settings,
        path: "/admin/settings",
        iconColor: "text-indigo-300",
      },
    ],
  },
];

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const renderNavigation = (collapsed = false) => (
    <nav
      aria-label="Admin navigation"
      className="space-y-5 px-3 py-4"
    >
      {menuGroups.map((group) => (
        <section key={group.name}>
          <h2
            className={`mb-2 px-3 text-[10px] font-bold tracking-[0.16em] ${group.labelColor} ${
              collapsed ? "md:px-0 md:text-center" : ""
            }`}
          >
            {collapsed ? (
              <span className="md:hidden">{group.name}</span>
            ) : (
              group.name
            )}
            {collapsed && (
              <span
                className={`mx-auto hidden h-px w-6 ${group.ruleColor} md:block`}
              />
            )}
          </h2>
          <div className="space-y-1">
            {group.items.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  to={item.path}
                  key={item.name}
                  title={collapsed ? item.name : undefined}
                  aria-label={collapsed ? item.name : undefined}
                  onClick={() => setIsMobileOpen(false)}
                  className={({ isActive }) =>
                    `group relative flex min-h-10 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                      collapsed ? "md:justify-center md:px-2" : ""
                    } ${
                      isActive
                        ? "bg-gradient-to-r from-rose-700 via-red-800 to-rose-700 text-white shadow-lg shadow-rose-950/40"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  <Icon
                    size={19}
                    className={`shrink-0 ${item.iconColor}`}
                  />
                  <span
                    className={`truncate ${
                      collapsed ? "md:hidden" : ""
                    }`}
                  >
                    {item.name}
                  </span>
                </NavLink>
              );
            })}
          </div>
        </section>
      ))}
    </nav>
  );

  const renderBackToStore = (collapsed = false, onClick) => (
    <div className="border-t border-white/10 p-3">
      <Link
        to="/"
        title={collapsed ? "Back to Store" : undefined}
        onClick={onClick}
        className={`flex min-h-10 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-rose-100/80 transition hover:bg-amber-400/10 hover:text-amber-200 ${
          collapsed ? "md:justify-center md:px-2" : ""
        }`}
      >
        <Store size={19} className="shrink-0" />
        <span className={collapsed ? "md:hidden" : ""}>Back to Store</span>
      </Link>
    </div>
  );

  return (
    <>
      <div className="flex min-h-16 w-full items-center justify-between border-b border-white/10 bg-gradient-to-r from-rose-950 via-red-950 to-rose-900 px-4 shadow-lg md:hidden">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-amber-300 via-rose-300 to-orange-300 text-lg font-extrabold text-rose-950 shadow-md shadow-black/20">
            S
          </span>
          <span className="text-base font-bold tracking-tight text-white">
            ShopSphere
            <span className="ml-1.5 text-xs font-medium text-rose-100/70">
              Admin
            </span>
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setIsMobileOpen(true)}
          aria-label="Open admin menu"
          aria-expanded={isMobileOpen}
          className="grid size-10 place-items-center rounded-xl text-rose-100 transition hover:bg-white/10 hover:text-white"
        >
          <Menu size={21} />
        </button>
      </div>

      {isMobileOpen && (
        <>
          <button
            type="button"
            aria-label="Close admin menu"
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-sm md:hidden"
          />
          <aside
            aria-label="Mobile admin menu"
            className="fixed inset-y-0 left-0 z-50 flex w-[min(19rem,88vw)] flex-col border-r border-white/10 bg-gradient-to-b from-rose-950 via-red-950 to-rose-900 text-white shadow-2xl md:hidden"
          >
            <div className="flex min-h-16 items-center justify-between border-b border-white/10 px-4">
              <Link
                to="/"
                onClick={() => setIsMobileOpen(false)}
                className="flex items-center gap-2.5"
              >
                <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-amber-300 via-rose-300 to-orange-300 text-lg font-extrabold text-rose-950">
                  S
                </span>
                <span className="text-base font-bold text-white">
                  ShopSphere
                </span>
              </Link>
              <button
                type="button"
                onClick={() => setIsMobileOpen(false)}
                aria-label="Close admin menu"
                className="grid size-9 place-items-center rounded-lg text-rose-100 transition hover:bg-white/10 hover:text-white"
              >
                <X size={19} />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">
              {renderNavigation()}
            </div>
            {renderBackToStore(false, () => setIsMobileOpen(false))}
          </aside>
        </>
      )}

      <aside
        aria-label="Admin sidebar"
        style={{ "--sidebar-width": isCollapsed ? "84px" : "264px" }}
        className="sticky top-0 hidden h-screen shrink-0 flex-col border-r border-white/10 bg-gradient-to-b from-rose-950 via-red-950 to-rose-900 text-white shadow-xl shadow-rose-950/15 transition-[width] duration-300 md:flex md:w-[var(--sidebar-width)]"
      >
        <div
          className={`flex min-h-[76px] items-center justify-between border-b border-white/10 ${
            isCollapsed ? "px-2" : "px-4"
          }`}
        >
          <Link
            to="/"
            aria-label="ShopSphere home"
            className="flex min-w-0 items-center gap-3"
          >
            <span
              className={`grid shrink-0 place-items-center rounded-xl bg-gradient-to-br from-amber-300 via-rose-300 to-orange-300 font-extrabold text-rose-950 shadow-md shadow-black/20 ${
                isCollapsed ? "size-9 text-lg" : "size-10 text-xl"
              }`}
            >
              S
            </span>
            <span
              className={`truncate text-lg font-bold tracking-tight text-white ${
                isCollapsed ? "hidden" : ""
              }`}
            >
              ShopSphere
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setIsCollapsed((collapsed) => !collapsed)}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!isCollapsed}
            className={`grid shrink-0 place-items-center rounded-lg text-rose-100 transition hover:bg-white/10 hover:text-white ${
              isCollapsed ? "size-8" : "size-9"
            }`}
          >
            {isCollapsed ? (
              <PanelLeftOpen size={18} />
            ) : (
              <PanelLeftClose size={18} />
            )}
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {renderNavigation(isCollapsed)}
        </div>
        {renderBackToStore(isCollapsed)}
      </aside>
    </>
  );
}

export default Sidebar;
