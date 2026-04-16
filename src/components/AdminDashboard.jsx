import React, { useEffect, useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Gem,
  Users,
  Settings,
  Sparkles,
  LogOut,
  Tv,
  ChartColumnStacked,
  TicketPercent,
} from "lucide-react";
import { getAuth, signOut } from "firebase/auth";
import Swal from "sweetalert2";

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: "Jewelry", href: "/products", icon: Gem },
    { name: "Category", href: "/category", icon: ChartColumnStacked },
    { name: "Offers", href: "/offers", icon: TicketPercent },
    { name: "Customers", href: "/customers", icon: Users },
    { name: "Banners", href: "/homecustomization", icon: Tv },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const isActiveLink = (href) => {
    return location.pathname.startsWith(href);
  };

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!loggedIn) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    const auth = getAuth();

    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out from the admin panel.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Logout!",
      cancelButtonText: "Cancel",
      background: "#fff",
      color: "#333",
      iconColor: "#eab308",
      customClass: {
        popup: "rounded-2xl",
        confirmButton: "rounded-xl",
        cancelButton: "rounded-xl",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Firebase sign out
          await signOut(auth);

          // Clear localStorage (optional)
          localStorage.clear();
          localStorage.setItem("isLoggedIn", "false");
          window.dispatchEvent(new Event("storage"));
          localStorage.removeItem("isLoggedIn");
          localStorage.removeItem("adminUser");

          Swal.fire({
            title: "Logged Out!",
            text: "You have been successfully logged out.",
            icon: "success",
            confirmButtonColor: "#10b981",
            background: "#fff",
            color: "#333",
            iconColor: "#10b981",
            customClass: {
              popup: "rounded-2xl",
              confirmButton: "rounded-xl",
            },
          }).then(() => {
            navigate("/login"); // redirect using react-router
          });
        } catch (error) {
          console.error("Logout error:", error);
          Swal.fire({
            title: "Error!",
            text: "Failed to log out. Please try again.",
            icon: "error",
            confirmButtonColor: "#ef4444",
            background: "#fff",
            color: "#333",
          });
        }
      }
    });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-amber-50 to-rose-50">
      {/* MOBILE SIDEBAR - Only icons, reduced width */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0  bg-opacity-40"
            onClick={() => setSidebarOpen(false)}
          />

          <div className="relative w-20 h-full bg-gradient-to-b from-amber-900 to-rose-900 overflow-y-auto">
            <div className="flex justify-end p-2">
              <X
                className="text-white cursor-pointer m-2"
                size={20}
                onClick={() => setSidebarOpen(false)}
              />
            </div>

            <div className="flex flex-col items-center mt-8 space-y-4">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActiveLink(item.href);

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`group relative p-2 rounded-lg transition-all duration-200 ${
                      active
                        ? "bg-amber-500 text-white"
                        : "text-amber-100 hover:bg-amber-700"
                    }`}
                    title={item.name}
                  >
                    <Icon className="h-6 w-6" />

                    {/* Tooltip on hover */}
                    <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Logout Button at Bottom on Mobile */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
              <button
                onClick={handleLogout}
                className="group relative p-2 rounded-lg bg-red-500 hover:bg-red-600 transition-all duration-200"
                title="Logout"
              >
                <LogOut className="h-6 w-6 text-white" />

                {/* Tooltip on hover */}
                <span className="absolute left-full ml-2 px-2 py-1 bg-red-600 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                  Logout
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DESKTOP SIDEBAR - Full width with text */}
      <div className="hidden lg:flex lg:w-72 lg:flex-col bg-gradient-to-b from-amber-900 to-rose-900 text-white h-full overflow-y-auto">
        <div className="p-6 text-xl font-bold flex items-center flex-shrink-0">
          <Sparkles className="mr-2" /> Admin Panel
        </div>

        <nav className="flex-1 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActiveLink(item.href);

            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center p-4 transition-all duration-200 ${
                  active ? "bg-amber-500" : "hover:bg-amber-700"
                }`}
              >
                <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button at Bottom on Desktop */}
        <div className="p-4 border-t border-amber-700 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 p-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-200"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* MOBILE HEADER */}
        <div className="lg:hidden flex justify-between items-center p-4 bg-white shadow flex-shrink-0">
          <Menu
            className="cursor-pointer"
            onClick={() => setSidebarOpen(true)}
          />
          <h1 className="font-semibold">Admin Dashboard</h1>
          <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-rose-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
            A
          </div>
        </div>

        {/* CONTENT - Scrollable only here */}
        <main className="flex-1 overflow-y-auto p-4 pb-24">
          <Outlet />
        </main>

        {/* BOTTOM NAVIGATION BAR FOR MOBILE */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 lg:hidden shadow-lg flex-shrink-0">
          {navigation.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const active = isActiveLink(item.href);

            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex flex-col items-center text-xs py-1 ${
                  active ? "text-amber-600" : "text-gray-500"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="mt-1">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
