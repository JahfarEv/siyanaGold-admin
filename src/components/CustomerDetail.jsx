import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  User,
  Edit,
  ShoppingBag,
  Calendar,
  DollarSign,
  Package,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { fetchAllCustomersWithCart } from "../firebase/fetchAllCustomersWithCart";

const serializeFirestoreData = (data) => {
  if (!data) return data;
  if (Array.isArray(data)) {
    return data.map(item => serializeFirestoreData(item));
  }
  if (data && typeof data === 'object') {
    if (data.seconds !== undefined && data.nanoseconds !== undefined) {
      return data.toDate ? data.toDate().toISOString() : new Date(data.seconds * 1000).toISOString();
    }
    const serialized = {};
    for (const key in data) {
      serialized[key] = serializeFirestoreData(data[key]);
    }
    return serialized;
  }
  return data;
};

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const loadCustomer = async () => {
      setLoading(true);
      try {
        const data = await fetchAllCustomersWithCart();
        const serializedData = data.map(c => ({
          ...c,
          cartItems: serializeFirestoreData(c.cartItems || []),
          orders: (c.orders || []).map(order => ({
            ...order,
            createdAt: serializeFirestoreData(order.createdAt),
            updatedAt: serializeFirestoreData(order.updatedAt),
            items: serializeFirestoreData(order.items || [])
          })),
          createdAt: serializeFirestoreData(c.createdAt),
          updatedAt: serializeFirestoreData(c.updatedAt),
          totalSpent: (c.orders || []).reduce((sum, order) => 
            sum + (parseFloat(order.totalAmount) || 0), 0)
        }));
        
        const foundCustomer = serializedData.find(c => c.id === id);
        setCustomer(foundCustomer);
      } catch (err) {
        console.error("Error fetching customer:", err);
      }
      setLoading(false);
    };

    loadCustomer();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "Date not available";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Date not available";
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return "₹0";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Customer not found</h2>
        <button
          onClick={() => navigate("/customers")}
          className="bg-amber-500 text-white px-6 py-2 rounded-lg"
        >
          Back to Customers
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate("/customers")}
        className="flex items-center gap-2 text-gray-600 hover:text-amber-600 transition-colors mb-4"
      >
        <ArrowLeft className="h-5 w-5" />
        Back to Customers
      </button>

      {/* Customer Header */}
      <div className="bg-gradient-to-r from-amber-500 to-rose-500 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <span className="text-white font-bold text-3xl">
                {customer.name?.charAt(0) || "U"}
              </span>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2">{customer.name}</h2>
              <div className="flex items-center gap-4 flex-wrap">
                {customer.location && (
                  <span className="text-amber-100 text-sm flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {customer.location}
                  </span>
                )}
                {customer.mobile && (
                  <span className="text-amber-100 text-sm flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {customer.mobile}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
            <Edit className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-amber-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{customer.orders?.length || 0}</p>
            </div>
            <Package className="h-8 w-8 text-amber-500" />
          </div>
        </div>
        {/* <div className="bg-white rounded-xl p-4 shadow-sm border border-amber-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(customer.totalSpent)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </div> */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-amber-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Cart Items</p>
              <p className="text-2xl font-bold text-gray-900">{customer.cartItems?.length || 0}</p>
            </div>
            <ShoppingBag className="h-8 w-8 text-rose-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Information */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-amber-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="h-5 w-5 text-amber-600 mr-2" />
              Contact Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                <Mail className="h-4 w-4 text-amber-600" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm text-gray-900">{customer.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                <Phone className="h-4 w-4 text-amber-600" />
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm text-gray-900">{customer.mobile || "Not provided"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                <MapPin className="h-4 w-4 text-amber-600" />
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="text-sm text-gray-900">{customer.location || "Not provided"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                <Calendar className="h-4 w-4 text-amber-600" />
                <div>
                  <p className="text-xs text-gray-500">Joined Date</p>
                  <p className="text-sm text-gray-900">{formatDate(customer.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cart Items & Orders */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cart Items */}
          {customer.cartItems?.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-amber-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <ShoppingBag className="h-5 w-5 text-amber-600 mr-2" />
                Active Cart ({customer.cartItems.length})
              </h3>
              <div className="space-y-3">
                {customer.cartItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-rose-50 rounded-lg">
                    {item.images?.[0]?.url && (
                      <img src={item.images[0].url} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        ₹{parseFloat(item.price).toLocaleString()} × {item.quantity || 1}
                      </p>
                      {item.material && (
                        <p className="text-xs text-gray-500 mt-1">Material: {item.material}</p>
                      )}
                    </div>
                    <p className="font-bold text-gray-900">
                      ₹{(parseFloat(item.price) * (item.quantity || 1)).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Order History */}
          {customer.orders?.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-amber-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 text-amber-600 mr-2" />
                Order History ({customer.orders.length})
              </h3>
              <div className="space-y-3">
                {customer.orders.map((order, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div 
                      className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100"
                      onClick={() => setExpandedOrder(expandedOrder === idx ? null : idx)}
                    >
                      <div>
                        <p className="font-semibold text-gray-900">
                          Order #{order.orderId?.slice(-8) || idx + 1}
                        </p>
                        <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          order.status === "delivered" ? "bg-green-100 text-green-700" :
                          order.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                          "bg-gray-100 text-gray-700"
                        }`}>
                          {order.status || "Pending"}
                        </span>
                        <p className="font-bold text-gray-900">{formatCurrency(order.totalAmount)}</p>
                        {expandedOrder === idx ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </div>
                    </div>
                    {expandedOrder === idx && (
                      <div className="p-4 space-y-3 border-t">
                        <h4 className="font-medium text-gray-700 mb-2">Items</h4>
                        {order.items?.map((item, itemIdx) => (
                          <div key={itemIdx} className="flex items-center gap-3">
                            {item.images?.[0]?.url && (
                              <img src={item.images[0].url} alt={item.name} className="w-12 h-12 object-cover rounded" />
                            )}
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{item.name}</p>
                              <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                            </div>
                            <p className="text-sm font-semibold">₹{parseFloat(item.price).toLocaleString()}</p>
                          </div>
                        ))}
                        {order.paymentMethod && (
                          <div className="mt-3 pt-3 border-t text-sm">
                            <span className="text-gray-500">Payment Method: </span>
                            <span className="font-medium">{order.paymentMethod}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {customer.cartItems?.length === 0 && customer.orders?.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-amber-100 p-12 text-center">
              <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700">No Activity Yet</h3>
              <p className="text-gray-400">This customer has no orders or cart items</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail;