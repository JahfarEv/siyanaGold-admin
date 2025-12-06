// components/Customers.js
import React, { useState, useEffect } from "react";
import { Search, Mail, Phone, MapPin, User, Edit } from "lucide-react";
import { fetchAllCustomersWithCart } from "../firebase/fetchAllCustomersWithCart";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    const loadCustomers = async () => {
      setLoading(true);
      try {
        const data = await fetchAllCustomersWithCart();
        setCustomers(data);
        setSelectedCustomer(data[0]);
      } catch (err) {
        console.error("Error fetching customer data:", err);
      }
      setLoading(false);
    };

    loadCustomers();
  }, []);

  console.log(customers, "cu");
  const filteredCustomers = customers?.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-800 to-rose-700 bg-clip-text text-transparent">
          Clients
        </h1>
        <p className="text-gray-600 mt-2">
          Manage your jewelry customers and their information
        </p>
      </div>
      <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search clients..."
            className="w-full pl-10 pr-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50 transition-all duration-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Customers List */}
        <div className="xl:col-span-1 space-y-4">
          {/* Search */}

          {/* Customers Cards */}
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {filteredCustomers?.map((customer) => (
              <div
                key={customer.id}
                onClick={() => setSelectedCustomer(customer)}
                className={`bg-white rounded-2xl p-4 shadow-lg border cursor-pointer transition-all duration-300 hover:shadow-xl ${
                  selectedCustomer?.id === customer.id
                    ? "border-amber-400 ring-2 ring-amber-100"
                    : "border-amber-100"
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-r from-amber-400 to-rose-400 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-base">
                      {customer.avatar}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {customer.name}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {customer.email}
                    </p>
                    <div className="flex items-center mt-1">
                      <MapPin className="h-3 w-3 text-gray-400 mr-1" />
                      <span className="text-xs text-gray-500">
                        {customer.location}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Details */}
        {selectedCustomer && (
          <div className="xl:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-amber-100 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-amber-500 to-rose-500 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <span className="text-white font-bold text-2xl">
                        {selectedCustomer.avatar}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        {selectedCustomer.name}
                      </h2>
                      <p className="text-amber-100">
                        {selectedCustomer.gender} • {selectedCustomer.location}
                      </p>
                    </div>
                  </div>
                  <button className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
                    <Edit className="h-5 w-5 text-white" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                  {/* Personal Information */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <User className="h-5 w-5 text-amber-600 mr-2" />
                        Personal Information
                      </h3>
                      <div className="bg-amber-50 rounded-xl p-4 space-y-4">
                        <div className="flex items-center space-x-3">
                          <Mail className="h-4 w-4 text-amber-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-600">
                              Email
                            </p>
                            <p className="text-sm text-gray-900">
                              {selectedCustomer.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Phone className="h-4 w-4 text-amber-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-600">
                              Phone
                            </p>
                            <p className="text-sm text-gray-900">
                              {selectedCustomer.mobile}
                            </p>
                          </div>
                        </div>
                        {/* <div className="flex items-center space-x-3">
                          <MapPin className="h-4 w-4 text-amber-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-600">
                              Address
                            </p>
                            <p className="text-sm text-gray-900">
                              {selectedCustomer.address}
                            </p>
                          </div>
                        </div> */}
                      </div>
                    </div>
                  </div>

                  {/* Cart Items */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Cart Items
                      </h3>
                      <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                        {selectedCustomer.cartItems.length > 0 ? (
                          selectedCustomer.cartItems.map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between py-3 px-4 bg-rose-50 rounded-xl border border-rose-100"
                            >
                              {/* Product Info */}
                              <div className="flex items-center space-x-3">
                                {/* Product Image */}
                                {item.images && item.images.length > 0 && (
                                  <img
                                    src={item.images[0].url}
                                    alt={item.name}
                                    className="w-12 h-12 object-cover rounded-lg"
                                  />
                                )}
                                {/* Name and Price */}
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium text-gray-900">
                                    {item.name}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    ${item.price} x {item.quantity}
                                  </span>
                                </div>
                              </div>

                              {/* Cart Tag */}
                              <span className="text-xs text-rose-600 bg-rose-100 px-2 py-1 rounded-full">
                                In Cart
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            No items in cart
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Customers;
