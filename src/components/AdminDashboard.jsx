// components/AdminDashboard.js
// import React, { useState } from "react";
// import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
// import {
//   Menu,
//   X,
//   Gem,
//   Users,
//   BarChart3,
//   Settings,
//   ChevronRight,
//   Home,
//   Crown,
//   Sparkles,
//   Package,
//   LogOut,
// } from "lucide-react";
// import Swal from "sweetalert2";

// const AdminDashboard = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const location = useLocation();
//   const navigate = useNavigate();

//   const navigation = [
//     { name: "Dashboard", href: "/", icon: Home },
//     { name: "Jewelry", href: "/products", icon: Gem },
//     { name: "Customers", href: "/customers", icon: Users },
//     { name: "Settings", href: "/settings", icon: Settings },
//   ];

//   const isActiveLink = (href) => {
//     if (href === "/") {
//       return location.pathname === "/";
//     }
//     return location.pathname.startsWith(href);
//   };

//   const handleLogout = () => {
//     Swal.fire({
//       title: 'Are you sure?',
//       text: 'You will be logged out from the admin panel.',
//       icon: 'question',
//       showCancelButton: true,
//       confirmButtonColor: '#d33',
//       cancelButtonColor: '#3085d6',
//       confirmButtonText: 'Yes, Logout!',
//       cancelButtonText: 'Cancel',
//       background: '#fff',
//       color: '#333',
//       iconColor: '#eab308',
//       customClass: {
//         popup: 'rounded-2xl',
//         confirmButton: 'rounded-xl',
//         cancelButton: 'rounded-xl'
//       }
//     }).then((result) => {
//       if (result.isConfirmed) {
//         // Simulate logout process
//         // In a real app, you would clear tokens, cookies, etc.

//         Swal.fire({
//           title: 'Logged Out!',
//           text: 'You have been successfully logged out.',
//           icon: 'success',
//           confirmButtonColor: '#10b981',
//           background: '#fff',
//           color: '#333',
//           iconColor: '#10b981',
//           customClass: {
//             popup: 'rounded-2xl',
//             confirmButton: 'rounded-xl'
//           }
//         }).then(() => {
//           // Redirect to login page or home page
//           navigate('/login');
//           // For demo purposes, we'll just reload the page
//           // window.location.reload();
//         });
//       }
//     });
//   };

//   return (
//     <div className="flex h-screen bg-gradient-to-br from-amber-50 to-rose-50">
//       {/* Sidebar for mobile */}
//       <div
//         className={`fixed inset-0 flex z-50 lg:hidden ${
//           sidebarOpen ? "" : "hidden"
//         }`}
//       >
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
//           onClick={() => setSidebarOpen(false)}
//         ></div>

//         <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gradient-to-b from-amber-900 to-rose-900 transform transition-transform duration-300 ease-in-out">
//           <div className="flex-1 h-0 pt-8 pb-4 overflow-y-auto">
//             <div className="flex items-center justify-between px-6 mb-8">
//               <div className="flex items-center">
//                 <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-rose-500 rounded-xl flex items-center justify-center shadow-lg">
//                   <Sparkles className="h-6 w-6 text-white" />
//                 </div>
//                 <h1 className="ml-3 text-xl font-bold text-white">
//                   Siyana Gold
//                 </h1>
//               </div>
//               <button
//                 className="p-2 rounded-lg hover:bg-amber-800 transition-colors duration-200"
//                 onClick={() => setSidebarOpen(false)}
//               >
//                 <X className="h-5 w-5 text-amber-100" />
//               </button>
//             </div>

//             <nav className="px-4 space-y-2">
//               {navigation.map((item) => {
//                 const Icon = item.icon;
//                 const active = isActiveLink(item.href);
//                 return (
//                   <Link
//                     key={item.name}
//                     to={item.href}
//                     className={`group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
//                       active
//                         ? "bg-gradient-to-r from-amber-400 to-rose-500 text-white shadow-lg shadow-amber-500/25"
//                         : "text-amber-100 hover:bg-amber-800 hover:text-white"
//                     }`}
//                     onClick={() => setSidebarOpen(false)}
//                   >
//                     <Icon
//                       className={`mr-3 h-5 w-5 ${
//                         active ? "text-white" : "text-amber-300"
//                       }`}
//                     />
//                     {item.name}
//                     {active && <ChevronRight className="ml-auto h-4 w-4" />}
//                   </Link>
//                 );
//               })}
//             </nav>
//           </div>

//           {/* Mobile Footer with Logout */}
//           <div className="flex-shrink-0 border-t border-amber-700 p-4 space-y-4">
//             {/* User Info */}
//             <div className="flex items-center">
//               <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-rose-400 rounded-full flex items-center justify-center shadow-md">
//                 <span className="text-white font-bold text-sm">JR</span>
//               </div>
//               <div className="ml-3">
//                 <p className="text-sm font-medium text-white">Jahfar</p>
//                 <p className="text-xs text-amber-200">Jewelry Manager</p>
//               </div>
//             </div>

//             {/* Logout Button */}
//             <button
//               onClick={handleLogout}
//               className="w-full flex items-center px-3 py-2 text-sm font-medium text-amber-100 hover:bg-amber-800 hover:text-white rounded-xl transition-all duration-200 group"
//             >
//               <LogOut className="mr-3 h-5 w-5 text-amber-300 group-hover:text-white" />
//               Logout
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Sidebar for desktop */}
//       <div className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0">
//         <div className="flex-1 flex flex-col min-h-0 bg-gradient-to-b from-amber-900 to-rose-900 shadow-2xl">
//           <div className="flex-1 flex flex-col pt-8 pb-4 overflow-y-auto">
//             <div className="flex items-center px-6 mb-8">
//               <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-rose-500 rounded-xl flex items-center justify-center shadow-lg">
//                 <Sparkles className="h-7 w-7 text-white" />
//               </div>
//               <h1 className="ml-3 text-2xl font-bold text-white">
//                 Siyana Gold
//               </h1>
//             </div>

//             <nav className="flex-1 px-4 space-y-2">
//               {navigation.map((item) => {
//                 const Icon = item.icon;
//                 const active = isActiveLink(item.href);
//                 return (
//                   <Link
//                     key={item.name}
//                     to={item.href}
//                     className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
//                       active
//                         ? "bg-gradient-to-r from-amber-400 to-rose-500 text-white shadow-lg shadow-amber-500/25"
//                         : "text-amber-100 hover:bg-amber-800 hover:text-white"
//                     }`}
//                   >
//                     <Icon
//                       className={`mr-3 h-5 w-5 ${
//                         active ? "text-white" : "text-amber-300"
//                       }`}
//                     />
//                     {item.name}
//                     {active && <ChevronRight className="ml-auto h-4 w-4" />}
//                   </Link>
//                 );
//               })}
//             </nav>
//           </div>

//           {/* Desktop Footer with Logout */}
//           <div className="flex-shrink-0 border-t border-amber-700 p-6 space-y-4">
//             {/* User Info */}
//             <div className="flex items-center">
//               <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-rose-400 rounded-full flex items-center justify-center shadow-md">
//                 <span className="text-white font-bold text-sm">JR</span>
//               </div>
//               <div className="ml-3">
//                 <p className="text-sm font-medium text-white">Jahfar</p>
//                 <p className="text-xs text-amber-200">Jewelry Manager</p>
//               </div>
//             </div>

//             {/* Logout Button */}
//             <button
//               onClick={handleLogout}
//               className="w-full flex items-center px-4 py-3 text-sm font-medium text-amber-100 hover:bg-amber-800 hover:text-white rounded-xl transition-all duration-200 group border border-amber-600 hover:border-amber-500"
//             >
//               <LogOut className="mr-3 h-5 w-5 text-amber-300 group-hover:text-white" />
//               Logout
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Main content */}
//       <div className="lg:pl-72 flex flex-col flex-1">
//         <div className="sticky top-0 z-10 lg:hidden pl-4 pt-4 bg-gradient-to-r from-amber-100 to-rose-100">
//           <button
//             className="p-2 rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow duration-200 border border-amber-200"
//             onClick={() => setSidebarOpen(true)}
//           >
//             <Menu className="h-5 w-5 text-amber-600" />
//           </button>
//         </div>

//         <main className="flex-1">
//           <div className="py-6">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//               <Outlet />
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

// components/AdminDashboard.js
// components/AdminDashboard.js
import React, { useEffect, useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Gem,
  Users,
  Settings,
  ChevronRight,
  Home,
  Sparkles,
  LogOut,
  Edit2Icon,
} from "lucide-react";
import { getAuth, signOut } from "firebase/auth";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Jewelry", href: "/products", icon: Gem },
    { name: "Customers", href: "/customers", icon: Users },
    { name: "Home", href: "/homecustomization", icon: Edit2Icon },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const isActiveLink = (href) => {
    if (href === "/") {
      return location.pathname === "/";
    }
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
    <div className="flex min-h-screen bg-gradient-to-br from-amber-50 to-rose-50">
      {/* Sidebar for mobile */}
      <div
        className={`fixed inset-0 flex z-50 lg:hidden ${
          sidebarOpen ? "" : "hidden"
        }`}
      >
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        ></div>

        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gradient-to-b from-amber-900 to-rose-900 transform transition-transform duration-300 ease-in-out">
          <div className="flex-1 h-0 pt-8 pb-4 overflow-y-auto">
            <div className="flex items-center justify-between px-6 mb-8">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-rose-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h1 className="ml-3 text-xl font-bold text-white">
                  Siyana Gold
                </h1>
              </div>
              <button
                className="p-2 rounded-lg hover:bg-amber-800 transition-colors duration-200"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5 text-amber-100" />
              </button>
            </div>

            <nav className="px-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActiveLink(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      active
                        ? "bg-gradient-to-r from-amber-400 to-rose-500 text-white shadow-lg shadow-amber-500/25"
                        : "text-amber-100 hover:bg-amber-800 hover:text-white"
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon
                      className={`mr-3 h-5 w-5 ${
                        active ? "text-white" : "text-amber-300"
                      }`}
                    />
                    {item.name}
                    {active && <ChevronRight className="ml-auto h-4 w-4" />}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Mobile Footer with Logout */}
          <div className="flex-shrink-0 border-t border-amber-700 p-4 space-y-4">
            {/* User Info */}
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-rose-400 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-sm">JR</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">Jahfar</p>
                <p className="text-xs text-amber-200">Jewelry Manager</p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-amber-100 hover:bg-amber-800 hover:text-white rounded-xl transition-all duration-200 group"
            >
              <LogOut className="mr-3 h-5 w-5 text-amber-300 group-hover:text-white" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar for desktop */}
      <div className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-gradient-to-b from-amber-900 to-rose-900 shadow-2xl">
          <div className="flex-1 flex flex-col pt-8 pb-4 overflow-y-auto">
            <div className="flex items-center px-6 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-rose-500 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="h-7 w-7 text-white" />
              </div>
              <h1 className="ml-3 text-2xl font-bold text-white">
                Siyana Gold
              </h1>
            </div>

            <nav className="flex-1 px-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActiveLink(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      active
                        ? "bg-gradient-to-r from-amber-400 to-rose-500 text-white shadow-lg shadow-amber-500/25"
                        : "text-amber-100 hover:bg-amber-800 hover:text-white"
                    }`}
                  >
                    <Icon
                      className={`mr-3 h-5 w-5 ${
                        active ? "text-white" : "text-amber-300"
                      }`}
                    />
                    {item.name}
                    {active && <ChevronRight className="ml-auto h-4 w-4" />}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Desktop Footer with Logout */}
          <div className="flex-shrink-0 border-t border-amber-700 p-6 space-y-4">
            {/* User Info */}
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-rose-400 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-sm">JR</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">Jahfar</p>
                <p className="text-xs text-amber-200">Jewelry Manager</p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-sm font-medium text-amber-100 hover:bg-amber-800 hover:text-white rounded-xl transition-all duration-200 group border border-amber-600 hover:border-amber-500"
            >
              <LogOut className="mr-3 h-5 w-5 text-amber-300 group-hover:text-white" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72 flex flex-col flex-1">
        <div className="sticky top-0 z-10 lg:hidden pl-4 pt-4 bg-gradient-to-r from-amber-100 to-rose-100">
          <button
            className="p-2 rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow duration-200 border border-amber-200"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5 text-amber-600" />
          </button>
        </div>

        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
