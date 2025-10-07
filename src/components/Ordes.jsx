// components/Orders.js
import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, CheckCircle, XCircle, Clock, MoreVertical, Package, DollarSign, User, Phone } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    const mockOrders = [
      {
        id: 'ORD-001',
        customer: {
          name: 'Emma Wilson',
          phone: '+1 (555) 123-4567',
          email: 'emma.wilson@example.com'
        },
        product: {
          name: 'Infinity Diamond Ring',
          category: 'Rings',
          material: 'Platinum',
          gemstone: 'Diamond',
          weight: '2.5g',
          price: 5200.00
        },
        orderDate: '2024-01-15',
        deliveryDate: '2024-01-25',
        status: 'completed',
        totalAmount: 5200.00,
        quantity: 1,
        shippingAddress: '123 Diamond St, Manhattan, NY 10001',
        paymentMethod: 'Credit Card',
        orderNotes: 'Engagement ring - handle with care'
      },
      {
        id: 'ORD-002',
        customer: {
          name: 'James Rodriguez',
          phone: '+1 (555) 987-6543',
          email: 'james.r@example.com'
        },
        product: {
          name: 'Sapphire Royal Bracelet',
          category: 'Bracelets',
          material: 'Rose Gold',
          gemstone: 'Sapphire',
          weight: '12.2g',
          price: 7800.00
        },
        orderDate: '2024-01-18',
        deliveryDate: '2024-01-28',
        status: 'pending',
        totalAmount: 7800.00,
        quantity: 1,
        shippingAddress: '456 Gold Ave, Beverly Hills, CA 90210',
        paymentMethod: 'Bank Transfer',
        orderNotes: 'Birthday gift - expedite shipping'
      },
      {
        id: 'ORD-003',
        customer: {
          name: 'Sophia Chen',
          phone: '+1 (555) 456-7890',
          email: 'sophia.chen@example.com'
        },
        product: {
          name: 'Pearl Elegance Necklace',
          category: 'Necklaces',
          material: 'White Gold',
          gemstone: 'Pearl',
          weight: '18.5g',
          price: 3200.00
        },
        orderDate: '2024-01-20',
        deliveryDate: '2024-01-30',
        status: 'pending',
        totalAmount: 3200.00,
        quantity: 1,
        shippingAddress: '789 Pearl St, San Francisco, CA 94102',
        paymentMethod: 'Credit Card',
        orderNotes: 'Anniversary gift - include gift wrapping'
      },
      {
        id: 'ORD-004',
        customer: {
          name: 'Michael Brown',
          phone: '+1 (555) 234-5678',
          email: 'michael.b@example.com'
        },
        product: {
          name: 'Diamond Tennis Bracelet',
          category: 'Bracelets',
          material: 'Platinum',
          gemstone: 'Diamond',
          weight: '25.8g',
          price: 12500.00
        },
        orderDate: '2024-01-10',
        deliveryDate: '2024-01-20',
        status: 'cancelled',
        totalAmount: 12500.00,
        quantity: 1,
        shippingAddress: '321 Ocean Dr, Miami Beach, FL 33139',
        paymentMethod: 'Credit Card',
        orderNotes: 'Customer requested cancellation'
      },
      {
        id: 'ORD-005',
        customer: {
          name: 'Olivia Martinez',
          phone: '+1 (555) 345-6789',
          email: 'olivia.m@example.com'
        },
        product: {
          name: 'Emerald Drop Earrings',
          category: 'Earrings',
          material: 'Yellow Gold',
          gemstone: 'Emerald',
          weight: '8.7g',
          price: 4500.00
        },
        orderDate: '2024-01-22',
        deliveryDate: '2024-02-01',
        status: 'completed',
        totalAmount: 4500.00,
        quantity: 2,
        shippingAddress: '654 Ruby Lane, Chicago, IL 60601',
        paymentMethod: 'PayPal',
        orderNotes: 'Bridesmaid gifts - ship together'
      }
    ];
    setOrders(mockOrders);
    setLoading(false);
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-amber-100 text-amber-800 border-amber-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    const icons = {
      completed: CheckCircle,
      pending: Clock,
      cancelled: XCircle
    };
    return icons[status] || Clock;
  };

  const handleStatusUpdate = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

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
          Orders Management
        </h1>
        <p className="text-gray-600 mt-2">Manage jewelry orders and track their status</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-amber-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-amber-700 mt-1">{orders.length}</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <Package className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {orders.filter(o => o.status === 'completed').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-amber-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-amber-600 mt-1">
                {orders.filter(o => o.status === 'pending').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">
                {formatCurrency(orders.reduce((sum, order) => sum + order.totalAmount, 0))}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search orders by customer, ID, or product..."
              className="w-full pl-10 pr-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50 transition-all duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-amber-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-amber-50 to-rose-50 border-b border-amber-100">
                <th className="px-6 py-4 text-left text-xs font-semibold text-amber-800 uppercase tracking-wider">
                  Order Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-amber-800 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-amber-800 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-amber-800 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-amber-800 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-amber-800 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100">
              {filteredOrders.map((order) => {
                const StatusIcon = getStatusIcon(order.status);
                return (
                  <tr key={order.id} className="hover:bg-amber-50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{order.id}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(order.orderDate).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-400">
                          Delivery: {new Date(order.deliveryDate).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 flex items-center">
                          <User className="h-4 w-4 text-amber-600 mr-2" />
                          {order.customer.name}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <Phone className="h-3 w-3 text-gray-400 mr-2" />
                          {order.customer.phone}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {order.customer.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.product.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.product.category} • {order.product.material}
                        </div>
                        <div className="text-xs text-gray-400">
                          {order.product.gemstone} • {order.product.weight}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-amber-700">
                        {formatCurrency(order.totalAmount)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Qty: {order.quantity}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewOrder(order)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        
                        {order.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(order.id, 'completed')}
                              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Mark as Completed"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Cancel Order"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="h-8 w-8 text-amber-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-amber-500 to-rose-500 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Order Details</h2>
                  <p className="text-amber-100">{selectedOrder.id}</p>
                </div>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Customer Information */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <User className="h-5 w-5 text-amber-600 mr-2" />
                      Customer Information
                    </h3>
                    <div className="bg-amber-50 rounded-xl p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-600">Name:</span>
                        <span className="text-sm text-gray-900">{selectedOrder.customer.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-600">Phone:</span>
                        <span className="text-sm text-gray-900">{selectedOrder.customer.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-600">Email:</span>
                        <span className="text-sm text-gray-900">{selectedOrder.customer.email}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Package className="h-5 w-5 text-amber-600 mr-2" />
                      Shipping Information
                    </h3>
                    <div className="bg-amber-50 rounded-xl p-4">
                      <p className="text-sm text-gray-900">{selectedOrder.shippingAddress}</p>
                      <div className="mt-3 grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-xs font-medium text-amber-600">Order Date:</span>
                          <p className="text-sm text-gray-900">{new Date(selectedOrder.orderDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-amber-600">Delivery Date:</span>
                          <p className="text-sm text-gray-900">{new Date(selectedOrder.deliveryDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <DollarSign className="h-5 w-5 text-amber-600 mr-2" />
                      Order Summary
                    </h3>
                    <div className="bg-amber-50 rounded-xl p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-600">Product:</span>
                        <span className="text-sm text-gray-900">{selectedOrder.product.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-600">Category:</span>
                        <span className="text-sm text-gray-900">{selectedOrder.product.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-600">Material:</span>
                        <span className="text-sm text-gray-900">{selectedOrder.product.material}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-600">Gemstone:</span>
                        <span className="text-sm text-gray-900">{selectedOrder.product.gemstone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-600">Weight:</span>
                        <span className="text-sm text-gray-900">{selectedOrder.product.weight}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-600">Quantity:</span>
                        <span className="text-sm text-gray-900">{selectedOrder.quantity}</span>
                      </div>
                      <div className="flex justify-between border-t border-amber-200 pt-3">
                        <span className="text-lg font-bold text-gray-900">Total Amount:</span>
                        <span className="text-lg font-bold text-amber-700">
                          {formatCurrency(selectedOrder.totalAmount)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Clock className="h-5 w-5 text-amber-600 mr-2" />
                      Order Status & Notes
                    </h3>
                    <div className="bg-amber-50 rounded-xl p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">Status:</span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedOrder.status)}`}>
                          {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-600">Payment:</span>
                        <span className="text-sm text-gray-900">{selectedOrder.paymentMethod}</span>
                      </div>
                      {selectedOrder.orderNotes && (
                        <div>
                          <span className="text-sm font-medium text-gray-600">Notes:</span>
                          <p className="text-sm text-gray-900 mt-1">{selectedOrder.orderNotes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex justify-end space-x-4">
                {selectedOrder.status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        handleStatusUpdate(selectedOrder.id, 'completed');
                        setShowOrderModal(false);
                      }}
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl flex items-center shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
                    >
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Mark as Completed
                    </button>
                    <button
                      onClick={() => {
                        handleStatusUpdate(selectedOrder.id, 'cancelled');
                        setShowOrderModal(false);
                      }}
                      className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl flex items-center shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
                    >
                      <XCircle className="h-5 w-5 mr-2" />
                      Cancel Order
                    </button>
                  </>
                )}
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="px-6 py-3 border border-amber-300 text-amber-700 rounded-xl hover:bg-amber-50 transition-colors duration-200 font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;