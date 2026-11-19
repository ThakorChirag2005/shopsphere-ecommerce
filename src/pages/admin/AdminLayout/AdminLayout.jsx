
import { Outlet } from "react-router-dom";

import Sidebar from "../Sidebar/Sidebar";
import AdminNavbar from "../AdminNavbar/AdminNavbar";

function AdminLayout() {
  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-hidden bg-gradient-to-br from-rose-50 via-slate-50 to-amber-50/70 md:h-screen md:flex-row md:overflow-hidden">

      <Sidebar />

      <main className="min-h-0 min-w-0 flex-1 overflow-x-hidden md:h-screen md:overflow-y-auto">

        <AdminNavbar />

        <div className="w-full min-w-0 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>

      </main>
    </div>
  );
}

export default AdminLayout;
