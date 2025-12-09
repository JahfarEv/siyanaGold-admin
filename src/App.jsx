// // App.js
// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import AdminDashboard from "./components/AdminDashboard";
// import ProductsList from "./components/ProductsList";
// import AddProduct from "./components/AddProduct";
// import EditProduct from "./components/EditProduct";
// import Customers from "./components/Customers";
// import Orders from "./components/Ordes";
// import Settings from "./components/Settings";

// function App() {
//   return (
//     <Router>
//       <div className="App">
//         <Routes>
//           <Route path="/" element={<AdminDashboard />}>
//             <Route index element={<ProductsList />} />
//             <Route path="products" element={<ProductsList />} />
//             <Route path="products/add" element={<AddProduct />} />
//             <Route path="products/edit/:id" element={<EditProduct />} />
//             <Route path="customers" element={<Customers />} />
//             <Route path="orders" element={<Orders />} />
//             <Route path="settings" element={<Settings />} />
//           </Route>
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;

// App.js
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AdminDashboard from "./components/AdminDashboard";
import ProductsList from "./components/ProductsList";
import AddProduct from "./components/AddProduct";
import EditProduct from "./components/EditProduct";
import Customers from "./components/Customers";
// import Orders from './components/Orders';
import Settings from "./components/Settings";
import Login from "./components/Login";
import HomeCustomization from './components/HomeCustomization';
// import BannerManagement from "./components/Banners";
import CategoriesList from "./components/CategoryList";
import AddCategory from "./components/AddCategory";
import OffersList from "./components/OfferList";
import AddOffer from "./components/AddOffer";
import EditOffer from "./components/EditOffer";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial check
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsAuthenticated(loggedIn);
    setLoading(false);

    // Listen for changes in localStorage (for logout/login)
    const handleStorageChange = () => {
      const updatedLogin = localStorage.getItem('isLoggedIn') === 'true';
      setIsAuthenticated(updatedLogin);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    if (loading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-rose-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
        </div>
      );
    }
    return isAuthenticated ? children : <Navigate to="/login" replace />;
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Route */}
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/" /> : <Login />}
          />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<ProductsList />} />
            <Route path="products" element={<ProductsList />} />
            <Route path="products/add" element={<AddProduct />} />
            <Route path="products/edit/:id" element={<EditProduct />} />
            <Route path="customers" element={<Customers />} />
            {/* <Route path="orders" element={<Orders />} /> */}
            <Route path="homecustomization" element={<HomeCustomization />} />
            <Route path="settings" element={<Settings />} />
            {/* <Route path="banners" element={<BannerManagement />} /> */}
            <Route path="category" element={<CategoriesList />} />
            <Route path="categories/add" element={<AddCategory />} />
            <Route path="offers" element={<OffersList />} />
            <Route path="offers/edit/:id" element={<EditOffer />} />
          </Route>

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
