import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bell,
  Check,
  ChevronDown,
  CircleUserRound,
  LogOut,
  Search,
  Settings,
  ShoppingBag,
  UserRound,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const adminPages = [
  { name: "Dashboard", path: "/admin/dashboard", keywords: "overview home" },
  { name: "Products", path: "/admin/products", keywords: "catalog items" },
  { name: "Categories", path: "/admin/categories", keywords: "catalog groups" },
  { name: "Inventory", path: "/admin/inventory", keywords: "stock catalog" },
  { name: "Orders", path: "/admin/orders", keywords: "sales purchases" },
  { name: "Customers", path: "/admin/customers", keywords: "sales users" },
  { name: "Coupons", path: "/admin/coupons", keywords: "sales discounts" },
  { name: "Reviews", path: "/admin/reviews", keywords: "sales feedback" },
  { name: "Banners", path: "/admin/banners", keywords: "marketing" },
  { name: "Reports", path: "/admin/reports", keywords: "analytics" },
  { name: "Settings", path: "/admin/settings", keywords: "preferences" },
];

function readCurrentUser() {
  try {
    const savedUser = localStorage.getItem("currentUser");
    const user = savedUser ? JSON.parse(savedUser) : null;
    return user && typeof user === "object" && !Array.isArray(user)
      ? user
      : null;
  } catch (error) {
    console.error("Unable to load the signed-in user.", error);
    return null;
  }
}

function readOrderNotifications() {
  const notifications = [];

  ["adminOrders", "orders"].forEach((storageKey) => {
    try {
      const savedOrders = localStorage.getItem(storageKey);

      if (!savedOrders) {
        return;
      }

      const orders = JSON.parse(savedOrders);

      if (!Array.isArray(orders)) {
        throw new Error(`${storageKey} must contain an array.`);
      }

      orders.forEach((order, index) => {
        if (!order || typeof order !== "object") {
          return;
        }

        const orderId = order.id ?? order.orderId ?? `${storageKey}-${index}`;
        const customer =
          typeof order.customer === "string"
            ? order.customer
            : order.customer?.name || "A customer";
        const timestamp = new Date(
          order.date || order.createdAt || 0
        ).getTime();

        notifications.push({
          id: `${storageKey}-${orderId}`,
          orderId,
          customer,
          status: order.status || "New order",
          total: Number(order.total),
          date: order.date || order.createdAt || "",
          timestamp: Number.isNaN(timestamp) ? 0 : timestamp,
        });
      });
    } catch (error) {
      console.error(`Unable to load ${storageKey} notifications.`, error);
    }
  });

  return notifications
    .sort((first, second) => second.timestamp - first.timestamp)
    .slice(0, 8);
}

function formatNotificationDate(date) {
  if (!date) {
    return "Recent order";
  }

  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.getTime())
    ? String(date)
    : parsedDate.toLocaleString();
}

function AdminNavbar() {
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const notificationsRef = useRef(null);
  const profileRef = useRef(null);

  const [query, setQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [readNotificationIds, setReadNotificationIds] = useState(
    () => new Set()
  );
  const [currentUser, setCurrentUser] = useState(readCurrentUser);

  const notifications = readOrderNotifications();
  const filteredPages = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return [];
    }

    return adminPages
      .filter((page) =>
        `${page.name} ${page.keywords}`
          .toLowerCase()
          .includes(normalizedQuery)
      )
      .slice(0, 6);
  }, [query]);

  const unreadCount = notifications.filter(
    (notification) => !readNotificationIds.has(notification.id)
  ).length;
  const displayName = currentUser?.name || "Admin User";
  const avatarLetter = displayName.trim().charAt(0).toUpperCase() || "A";

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!searchRef.current?.contains(event.target)) {
        setIsSearchOpen(false);
      }

      if (!notificationsRef.current?.contains(event.target)) {
        setIsNotificationsOpen(false);
      }

      if (!profileRef.current?.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    const handleStorageChange = (event) => {
      if (event.key === "currentUser") {
        setCurrentUser(readCurrentUser());
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const selectPage = (path) => {
    setQuery("");
    setIsSearchOpen(false);
    navigate(path);
  };

  const markNotificationAsRead = (notificationId) => {
    setReadNotificationIds((previousIds) => {
      const nextIds = new Set(previousIds);
      nextIds.add(notificationId);
      return nextIds;
    });
  };

  const markAllNotificationsAsRead = () => {
    setReadNotificationIds(
      (previousIds) =>
        new Set([
          ...previousIds,
          ...notifications.map((notification) => notification.id),
        ])
    );
  };

  const handleLogout = () => {
    if (!window.confirm("Sign out of your ShopSphere account?")) {
      return;
    }

    try {
      if (localStorage.getItem("currentUser")) {
        localStorage.removeItem("currentUser");
      }
    } catch (error) {
      console.error("Unable to sign out the current user.", error);
      window.alert("We could not sign out. Please try again.");
      return;
    }

    setCurrentUser(null);
    setIsProfileOpen(false);
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 flex min-h-[72px] w-full items-center justify-between gap-3 border-b border-rose-100/80 bg-white/95 px-3 py-3 shadow-[0_4px_20px_-18px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:gap-4 sm:px-6 lg:px-8">
      <div ref={searchRef} className="relative flex min-w-0 max-w-xl flex-1">
        <div className="flex h-11 w-full items-center gap-3 rounded-xl border border-rose-100 bg-rose-50/40 px-3 text-slate-400 transition focus-within:border-rose-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-rose-100/70 sm:px-4">
          <Search size={19} className="shrink-0 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setIsSearchOpen(false);
              }

              if (event.key === "Enter" && filteredPages[0]) {
                event.preventDefault();
                selectPage(filteredPages[0].path);
              }
            }}
            placeholder="Search pages and menus..."
            aria-label="Search admin pages and menu items"
            aria-expanded={isSearchOpen && query.trim().length > 0}
            aria-controls="admin-search-results"
            className="min-h-0 min-w-0 flex-1 border-0 bg-transparent p-0 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:ring-0"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setIsSearchOpen(true);
              }}
              aria-label="Clear search"
              className="grid size-7 shrink-0 place-items-center rounded-lg text-slate-400 transition hover:bg-rose-100 hover:text-rose-700"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {isSearchOpen && query.trim() && (
          <div
            id="admin-search-results"
            role="listbox"
            aria-label="Admin search results"
            className="absolute left-0 right-0 top-[calc(100%+0.65rem)] z-50 overflow-hidden rounded-2xl border border-rose-100 bg-white p-2 shadow-xl shadow-rose-950/10"
          >
            {filteredPages.length ? (
              filteredPages.map((page) => (
                <button
                  type="button"
                  role="option"
                  aria-selected="false"
                  key={page.path}
                  onClick={() => selectPage(page.path)}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition hover:bg-rose-50"
                >
                  <span className="flex items-center gap-3">
                    <span className="grid size-9 place-items-center rounded-xl bg-rose-100 text-rose-700">
                      <Search size={16} />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-slate-800">
                        {page.name}
                      </span>
                      <span className="block text-xs text-slate-400">
                        Admin page
                      </span>
                    </span>
                  </span>
                  <span className="text-xs font-medium text-rose-700">
                    Open
                  </span>
                </button>
              ))
            ) : (
              <p className="px-3 py-5 text-center text-sm text-slate-500">
                No admin pages match “{query.trim()}”.
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
        <div ref={notificationsRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setIsNotificationsOpen((isOpen) => !isOpen);
              setIsProfileOpen(false);
              setIsSearchOpen(false);
            }}
            className="relative grid size-10 place-items-center rounded-xl text-slate-500 transition hover:bg-rose-50 hover:text-rose-700"
            aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
            aria-expanded={isNotificationsOpen}
            aria-haspopup="true"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 grid min-h-4 min-w-4 place-items-center rounded-full border-2 border-white bg-rose-500 px-0.5 text-[9px] font-bold leading-none text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <section
              aria-label="Notifications"
              className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-80 max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-xl shadow-rose-950/10 sm:w-96"
            >
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Notifications
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {unreadCount
                      ? `${unreadCount} unread order update${unreadCount === 1 ? "" : "s"}`
                      : "You’re all caught up"}
                  </p>
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllNotificationsAsRead}
                    className="rounded-lg px-2 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-50"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-[min(60vh,24rem)] overflow-y-auto p-2">
                {notifications.length ? (
                  notifications.map((notification) => {
                    const isUnread = !readNotificationIds.has(
                      notification.id
                    );

                    return (
                      <div
                        key={notification.id}
                        className={`flex items-start gap-2 rounded-xl p-3 transition ${
                          isUnread ? "bg-rose-50/80" : "hover:bg-slate-50"
                        }`}
                      >
                        <span
                          className={`mt-1 grid size-8 shrink-0 place-items-center rounded-lg ${
                            isUnread
                              ? "bg-rose-100 text-rose-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          <ShoppingBag size={16} />
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setIsNotificationsOpen(false);
                            navigate("/admin/orders");
                          }}
                          className="min-w-0 flex-1 text-left"
                        >
                          <span className="block truncate text-sm font-semibold text-slate-800">
                            Order #{notification.orderId} · {notification.customer}
                          </span>
                          <span className="mt-1 block text-xs text-slate-500">
                            {notification.status}
                            {Number.isFinite(notification.total)
                              ? ` · ₹${notification.total.toLocaleString("en-IN")}`
                              : ""}
                          </span>
                          <span className="mt-1 block text-[11px] text-slate-400">
                            {formatNotificationDate(notification.date)}
                          </span>
                        </button>
                        {isUnread && (
                          <button
                            type="button"
                            onClick={() =>
                              markNotificationAsRead(notification.id)
                            }
                            aria-label={`Mark order ${notification.orderId} as read`}
                            title="Mark as read"
                            className="grid size-7 shrink-0 place-items-center rounded-lg text-rose-600 transition hover:bg-rose-100 hover:text-rose-800"
                          >
                            <Check size={15} />
                          </button>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="px-4 py-8 text-center">
                    <CircleUserRound
                      size={28}
                      className="mx-auto text-slate-300"
                    />
                    <p className="mt-3 text-sm font-medium text-slate-600">
                      No order updates yet
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      New orders will appear here.
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>

        <div ref={profileRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setIsProfileOpen((isOpen) => !isOpen);
              setIsNotificationsOpen(false);
              setIsSearchOpen(false);
            }}
            aria-label="Admin profile menu"
            aria-expanded={isProfileOpen}
            aria-haspopup="true"
            className="flex items-center gap-2 rounded-xl p-1.5 text-left transition hover:bg-rose-50 sm:gap-3 sm:px-2"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-rose-600 to-red-800 text-sm font-bold text-white shadow-md shadow-rose-200">
              {avatarLetter}
            </span>
            <span className="hidden min-w-0 text-left sm:block">
              <span className="block max-w-32 truncate text-sm font-semibold text-slate-800">
                {displayName}
              </span>
              <span className="mt-0.5 block text-xs text-slate-400">
                Administrator
              </span>
            </span>
            <ChevronDown
              size={16}
              className={`hidden text-slate-400 transition-transform sm:block ${
                isProfileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isProfileOpen && (
            <div
              role="menu"
              aria-label="Admin account"
              className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-64 overflow-hidden rounded-2xl border border-rose-100 bg-white p-2 shadow-xl shadow-rose-950/10"
            >
              <div className="flex items-center gap-3 rounded-xl bg-rose-50 p-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-rose-600 to-red-800 font-bold text-white">
                  {avatarLetter}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-slate-800">
                    {displayName}
                  </span>
                  <span className="block truncate text-xs text-slate-500">
                    {currentUser?.email || "Administrator"}
                  </span>
                </span>
              </div>
              <Link
                to="/account"
                role="menuitem"
                onClick={() => setIsProfileOpen(false)}
                className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-rose-50 hover:text-rose-800"
              >
                <UserRound size={17} />
                Profile
              </Link>
              <Link
                to="/admin/settings"
                role="menuitem"
                onClick={() => setIsProfileOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-rose-50 hover:text-rose-800"
              >
                <Settings size={17} />
                Account Settings
              </Link>
              <div className="my-1 border-t border-slate-100" />
              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
              >
                <LogOut size={17} />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default AdminNavbar;
