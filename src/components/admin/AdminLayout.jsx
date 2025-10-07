// src/components/admin/AdminLayout.jsx
import React from 'react';
import { Link, Outlet } from 'react-router-dom'; // Assuming you're using React Router

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-amber-800 text-white shadow-lg flex flex-col">
        <div className="p-6 text-2xl font-bold font-serif text-center border-b border-amber-700">
          Admin Panel
        </div>
        <nav className="flex-grow">
          <ul className="space-y-2 p-4">
            <li>
              <Link
                to="/admin/products"
                className="flex items-center p-3 rounded-md text-amber-100 hover:bg-amber-700 hover:text-white transition duration-200"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                Products
              </Link>
            </li>
            <li>
              <Link
                to="/admin/customers"
                className="flex items-center p-3 rounded-md text-amber-100 hover:bg-amber-700 hover:text-white transition duration-200"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.13-1.292-.387-1.884M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.13-1.292.387-1.884m0 0a9 9 0 118.226 0M9 13.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm7.5 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path></svg>
                Customers
              </Link>
            </li>
            {/* Add more links here */}
          </ul>
        </nav>
        <div className="p-4 border-t border-amber-700">
          <button className="flex items-center w-full p-3 rounded-md text-amber-100 hover:bg-amber-700 hover:text-white transition duration-200">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-white shadow-sm">
          <h1 className="text-2xl font-serif text-gray-800">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Admin User</span>
            {/* User Avatar/Icon */}
            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet /> {/* This is where nested routes (Products, Customers) will render */}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;