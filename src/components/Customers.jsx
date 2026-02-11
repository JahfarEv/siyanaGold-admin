// // components/Customers.js
// import React, { useState, useEffect } from "react";
// import { Search, Mail, Phone, MapPin, User, Edit } from "lucide-react";
// import { fetchAllCustomersWithCart } from "../firebase/fetchAllCustomersWithCart";

// const Customers = () => {
//   const [customers, setCustomers] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [selectedCustomer, setSelectedCustomer] = useState(null);

//   useEffect(() => {
//     const loadCustomers = async () => {
//       setLoading(true);
//       try {
//         const data = await fetchAllCustomersWithCart();
//         setCustomers(data);
//         setSelectedCustomer(data[0]);
//       } catch (err) {
//         console.error("Error fetching customer data:", err);
//       }
//       setLoading(false);
//     };

//     loadCustomers();
//   }, []);

//   console.log(customers, "cu");
//   const filteredCustomers = customers?.filter(
//     (customer) =>
//       customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       customer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       customer?.location?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-800 to-rose-700 bg-clip-text text-transparent">
//           Clients
//         </h1>
//         <p className="text-gray-600 mt-2">
//           Manage your jewelry customers and their information
//         </p>
//       </div>
//       <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-4">
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400 h-5 w-5" />
//           <input
//             type="text"
//             placeholder="Search clients..."
//             className="w-full pl-10 pr-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50 transition-all duration-200"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//       </div>
//       <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
//         {/* Customers List */}
//         <div className="xl:col-span-1 space-y-4">
//           {/* Search */}

//           {/* Customers Cards */}
//           <div className="space-y-3 max-h-[600px] overflow-y-auto">
//             {filteredCustomers?.map((customer) => (
//               <div
//                 key={customer.id}
//                 onClick={() => setSelectedCustomer(customer)}
//                 className={`bg-white rounded-2xl p-4 shadow-lg border cursor-pointer transition-all duration-300 hover:shadow-xl ${
//                   selectedCustomer?.id === customer.id
//                     ? "border-amber-400 ring-2 ring-amber-100"
//                     : "border-amber-100"
//                 }`}
//               >
//                 <div className="flex items-center space-x-4">
//                   <div className="w-14 h-14 bg-gradient-to-r from-amber-400 to-rose-400 rounded-full flex items-center justify-center shadow-md">
//                     <span className="text-white font-bold text-base">
//                       {customer.avatar}
//                     </span>
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <div className="flex items-center justify-between">
//                       <h3 className="text-lg font-semibold text-gray-900 truncate">
//                         {customer.name}
//                       </h3>
//                     </div>
//                     <p className="text-sm text-gray-600 truncate">
//                       {customer.email}
//                     </p>
//                     <div className="flex items-center mt-1">
//                       <MapPin className="h-3 w-3 text-gray-400 mr-1" />
//                       <span className="text-xs text-gray-500">
//                         {customer.location}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Customer Details */}
//         {selectedCustomer && (
//           <div className="xl:col-span-2">
//             <div className="bg-white rounded-2xl shadow-lg border border-amber-100 overflow-hidden">
//               {/* Header */}
//               <div className="bg-gradient-to-r from-amber-500 to-rose-500 p-6">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-4">
//                     <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
//                       <span className="text-white font-bold text-2xl">
//                         {selectedCustomer.avatar}
//                       </span>
//                     </div>
//                     <div>
//                       <h2 className="text-2xl font-bold text-white">
//                         {selectedCustomer.name}
//                       </h2>
//                       <p className="text-amber-100">
//                         {selectedCustomer.gender} • {selectedCustomer.location}
//                       </p>
//                     </div>
//                   </div>
//                   <button className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
//                     <Edit className="h-5 w-5 text-white" />
//                   </button>
//                 </div>
//               </div>

//               <div className="p-6">
//                 <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
//                   {/* Personal Information */}
//                   <div className="space-y-6">
//                     <div>
//                       <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
//                         <User className="h-5 w-5 text-amber-600 mr-2" />
//                         Personal Information
//                       </h3>
//                       <div className="bg-amber-50 rounded-xl p-4 space-y-4">
//                         <div className="flex items-center space-x-3">
//                           <Mail className="h-4 w-4 text-amber-600" />
//                           <div>
//                             <p className="text-sm font-medium text-gray-600">
//                               Email
//                             </p>
//                             <p className="text-sm text-gray-900">
//                               {selectedCustomer.email}
//                             </p>
//                           </div>
//                         </div>
//                         <div className="flex items-center space-x-3">
//                           <Phone className="h-4 w-4 text-amber-600" />
//                           <div>
//                             <p className="text-sm font-medium text-gray-600">
//                               Phone
//                             </p>
//                             <p className="text-sm text-gray-900">
//                               {selectedCustomer.mobile}
//                             </p>
//                           </div>
//                         </div>
//                         {/* <div className="flex items-center space-x-3">
//                           <MapPin className="h-4 w-4 text-amber-600" />
//                           <div>
//                             <p className="text-sm font-medium text-gray-600">
//                               Address
//                             </p>
//                             <p className="text-sm text-gray-900">
//                               {selectedCustomer.address}
//                             </p>
//                           </div>
//                         </div> */}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Cart Items */}
//                   <div className="space-y-6">
//                     <div>
//                       <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                         Cart Items
//                       </h3>
//                       <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
//                         {selectedCustomer.cartItems.length > 0 ? (
//                           selectedCustomer.cartItems.map((item, index) => (
//                             <div
//                               key={index}
//                               className="flex items-center justify-between py-3 px-4 bg-rose-50 rounded-xl border border-rose-100"
//                             >
//                               {/* Product Info */}
//                               <div className="flex items-center space-x-3">
//                                 {/* Product Image */}
//                                 {item.images && item.images.length > 0 && (
//                                   <img
//                                     src={item.images[0].url}
//                                     alt={item.name}
//                                     className="w-12 h-12 object-cover rounded-lg"
//                                   />
//                                 )}
//                                 {/* Name and Price */}
//                                 <div className="flex flex-col">
//                                   <span className="text-sm font-medium text-gray-900">
//                                     {item.name}
//                                   </span>
//                                   <span className="text-xs text-gray-500">
//                                     ${item.price} x {item.quantity}
//                                   </span>
//                                 </div>
//                               </div>

//                               {/* Cart Tag */}
//                               <span className="text-xs text-rose-600 bg-rose-100 px-2 py-1 rounded-full">
//                                 In Cart
//                               </span>
//                             </div>
//                           ))
//                         ) : (
//                           <div className="text-center py-8 text-gray-500">
//                             No items in cart
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     {/* User Orders */}
//                     <div className="mt-6">
//                       <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                         Order History
//                       </h3>
//                       <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
//                         {selectedCustomer.orders && selectedCustomer.orders.length > 0 ? (
//                           selectedCustomer.orders.map((order, orderIndex) => (
//                             <div
//                               key={orderIndex}
//                               className="bg-green-50 rounded-xl border border-green-100 p-4"
//                             >
//                               {/* Order Header */}
//                               <div className="flex items-center justify-between mb-3 pb-2 border-b border-green-200">
//                                 <div>
//                                   <span className="text-sm font-semibold text-gray-900">
//                                     Order #{order.orderId || order.id}
//                                   </span>
//                                   <span className="text-xs text-gray-500 ml-2">
//                                     {order.createdAt?.toDate ? 
//                                       new Date(order.createdAt.toDate()).toLocaleDateString() : 
//                                       'N/A'}
//                                   </span>
//                                 </div>
//                                 <span className={`text-xs px-2 py-1 rounded-full ${
//                                   order.status === 'completed' ? 'text-green-600 bg-green-100' :
//                                   order.status === 'pending' ? 'text-amber-600 bg-amber-100' :
//                                   'text-gray-600 bg-gray-100'
//                                 }`}>
//                                   {order.status || 'Pending'}
//                                 </span>
//                               </div>

//                               {/* Order Items */}
//                               <div className="space-y-2">
//                                 {order.items && order.items.length > 0 ? (
//                                   order.items.map((item, itemIndex) => (
//                                     <div
//                                       key={itemIndex}
//                                       className="flex items-center space-x-3 bg-white rounded-lg p-2"
//                                     >
//                                       {/* Product Image */}
//                                       {item.images && item.images.length > 0 && (
//                                         <img
//                                           src={item.images[0].url}
//                                           alt={item.name}
//                                           className="w-12 h-12 object-cover rounded-lg"
//                                         />
//                                       )}
//                                       {/* Product Details */}
//                                       <div className="flex-1">
//                                         <span className="text-sm font-medium text-gray-900 block">
//                                           {item.name}
//                                         </span>
//                                         <span className="text-xs text-gray-500">
//                                           ${item.price} x {item.quantity}
//                                         </span>
//                                       </div>
//                                       {/* Item Total */}
//                                       <span className="text-sm font-semibold text-gray-900">
//                                         ${(item.price * item.quantity).toFixed(2)}
//                                       </span>
//                                     </div>
//                                   ))
//                                 ) : (
//                                   <div className="text-center py-2 text-gray-500 text-sm">
//                                     No items in this order
//                                   </div>
//                                 )}
//                               </div>

//                               {/* Order Total */}
//                               <div className="flex justify-between items-center mt-3 pt-2 border-t border-green-200">
//                                 <span className="text-sm font-medium text-gray-600">Total:</span>
//                                 <span className="text-base font-bold text-gray-900">
//                                   ${order.totalAmount || 0}
//                                 </span>
//                               </div>
//                             </div>
//                           ))
//                         ) : (
//                           <div className="text-center py-8 text-gray-500">
//                             No orders yet
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Customers;


// components/Customers.js
import React, { useState, useEffect } from "react";
import { Search, Mail, Phone, MapPin, User, Edit, ShoppingBag, Calendar, DollarSign } from "lucide-react";
import { fetchAllCustomersWithCart } from "../firebase/fetchAllCustomersWithCart";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchType, setSearchType] = useState("customer"); // "customer" or "order"

  useEffect(() => {
    const loadCustomers = async () => {
      setLoading(true);
      try {
        const data = await fetchAllCustomersWithCart();
        setCustomers(data);
        if (data.length > 0) {
          setSelectedCustomer(data[0]);
        }
      } catch (err) {
        console.error("Error fetching customer data:", err);
      }
      setLoading(false);
    };

    loadCustomers();
  }, []);

  const filteredCustomers = customers?.filter((customer) => {
    if (searchType === "customer") {
      // Search in customer details
      return (
        customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer?.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer?.mobile?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else {
      // Search for order ID in customer's orders
      return customer.orders?.some(order => 
        order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  });

  // Find customers with matching orders when searching by order ID
  const customersWithMatchingOrders = searchType === "order" && searchTerm 
    ? customers.filter(customer => 
        customer.orders?.some(order => 
          order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.id?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : [];

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

      {/* Search Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Type Toggle */}
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setSearchType("customer");
                setSearchTerm("");
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                searchType === "customer"
                  ? "bg-amber-500 text-white"
                  : "bg-amber-100 text-amber-700 hover:bg-amber-200"
              }`}
            >
              Search Customer
            </button>
            <button
              onClick={() => {
                setSearchType("order");
                setSearchTerm("");
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                searchType === "order"
                  ? "bg-amber-500 text-white"
                  : "bg-amber-100 text-amber-700 hover:bg-amber-200"
              }`}
            >
              Search Order ID
            </button>
          </div>

          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400 h-5 w-5" />
            <input
              type="text"
              placeholder={
                searchType === "customer" 
                  ? "Search by name, email, phone, or location..." 
                  : "Search by order ID..."
              }
              className="w-full pl-10 pr-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50 transition-all duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Search Info */}
        {searchTerm && (
          <div className="mt-3 text-sm text-gray-600">
            {searchType === "order" ? (
              <p>
                Found {customersWithMatchingOrders.length} customer{customersWithMatchingOrders.length !== 1 ? 's' : ''} with matching orders
              </p>
            ) : (
              <p>
                Showing {filteredCustomers.length} of {customers.length} customer{filteredCustomers.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Customers List */}
        <div className="xl:col-span-1 space-y-4">
          {/* Customers Cards */}
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {(searchType === "order" && searchTerm 
              ? customersWithMatchingOrders 
              : filteredCustomers
            )?.map((customer) => (
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
                      {customer.orders?.length > 0 && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          {customer.orders.length} order{customer.orders.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {customer.email}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 text-gray-400 mr-1" />
                        <span className="text-xs text-gray-500">
                          {customer.location}
                        </span>
                      </div>
                      {searchType === "order" && customer.orders && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          Order found
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {(searchType === "order" && searchTerm && customersWithMatchingOrders.length === 0) && (
              <div className="text-center py-8 text-gray-500 bg-white rounded-2xl p-4">
                <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p>No orders found with ID: "{searchTerm}"</p>
              </div>
            )}
          </div>
        </div>

        {/* Customer Details */}
        {selectedCustomer ? (
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
                  <div className="flex items-center space-x-2">
                    <span className="text-white/80 text-sm">
                      {selectedCustomer.orders?.length || 0} orders
                    </span>
                    <button className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
                      <Edit className="h-5 w-5 text-white" />
                    </button>
                  </div>
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
                              {selectedCustomer.mobile || "Not provided"}
                            </p>
                          </div>
                        </div>
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
                        {selectedCustomer.cartItems?.length > 0 ? (
                          selectedCustomer.cartItems.map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between py-3 px-4 bg-rose-50 rounded-xl border border-rose-100"
                            >
                              <div className="flex items-center space-x-3">
                                {item.images && item.images.length > 0 && (
                                  <img
                                    src={item.images[0].url}
                                    alt={item.name}
                                    className="w-12 h-12 object-cover rounded-lg"
                                  />
                                )}
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium text-gray-900">
                                    {item.name}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    ${item.price} x {item.quantity}
                                  </span>
                                </div>
                              </div>
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

                    {/* User Orders */}
                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order History
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">
                            Total Orders: {selectedCustomer.orders?.length || 0}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                        {selectedCustomer.orders && selectedCustomer.orders.length > 0 ? (
                          selectedCustomer.orders.map((order, orderIndex) => {
                            // Highlight if this order matches search
                            const isMatchingOrder = searchType === "order" && searchTerm && 
                              (order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                               order.id?.toLowerCase().includes(searchTerm.toLowerCase()));

                            return (
                              <div
                                key={orderIndex}
                                className={`rounded-xl border p-4 transition-all ${
                                  isMatchingOrder
                                    ? "bg-yellow-50 border-yellow-200 ring-2 ring-yellow-100"
                                    : "bg-green-50 border-green-100"
                                }`}
                              >
                                {/* Order Header */}
                                <div className="flex items-center justify-between mb-3 pb-2 border-b border-green-200">
                                  <div className="flex items-center space-x-3">
                                    <div className="flex flex-col">
                                      <span className="text-sm font-semibold text-gray-900 flex items-center">
                                        <ShoppingBag className="h-4 w-4 mr-2" />
                                        Order ID: {order.orderId || order.id}
                                        {isMatchingOrder && (
                                          <span className="ml-2 text-xs bg-yellow-500 text-white px-2 py-1 rounded-full">
                                            Match
                                          </span>
                                        )}
                                      </span>
                                      <div className="flex items-center text-xs text-gray-500 mt-1">
                                        <Calendar className="h-3 w-3 mr-1" />
                                        {order.createdAt?.toDate ? 
                                          new Date(order.createdAt.toDate()).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                          }) : 
                                          'Date not available'}
                                      </div>
                                    </div>
                                  </div>
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    order.status === 'completed' ? 'text-green-600 bg-green-100' :
                                    order.status === 'pending' ? 'text-amber-600 bg-amber-100' :
                                    'text-gray-600 bg-gray-100'
                                  }`}>
                                    {order.status || 'Pending'}
                                  </span>
                                </div>

                                {/* Order Items */}
                                <div className="space-y-2">
                                  {order.items && order.items.length > 0 ? (
                                    order.items.map((item, itemIndex) => (
                                      <div
                                        key={itemIndex}
                                        className="flex items-center space-x-3 bg-white rounded-lg p-2"
                                      >
                                        {item.images && item.images.length > 0 && (
                                          <img
                                            src={item.images[0].url}
                                            alt={item.name}
                                            className="w-12 h-12 object-cover rounded-lg"
                                          />
                                        )}
                                        <div className="flex-1">
                                          <span className="text-sm font-medium text-gray-900 block">
                                            {item.name}
                                          </span>
                                          <span className="text-xs text-gray-500">
                                            ${item.price} x {item.quantity}
                                          </span>
                                        </div>
                                        <span className="text-sm font-semibold text-gray-900">
                                          ${(item.price * item.quantity).toFixed(2)}
                                        </span>
                                      </div>
                                    ))
                                  ) : (
                                    <div className="text-center py-2 text-gray-500 text-sm">
                                      No items in this order
                                    </div>
                                  )}
                                </div>

                                {/* Order Total */}
                                <div className="flex justify-between items-center mt-3 pt-2 border-t border-green-200">
                                  <div className="flex items-center space-x-2">
                                    <DollarSign className="h-4 w-4 text-gray-600" />
                                    <span className="text-sm font-medium text-gray-600">Total:</span>
                                  </div>
                                  <span className="text-base font-bold text-gray-900">
                                    ${order.totalAmount ? parseFloat(order.totalAmount).toFixed(2) : '0.00'}
                                  </span>
                                </div>

                                {/* Branch Info if available */}
                                {order.branchName && (
                                  <div className="mt-2 text-xs text-gray-500">
                                    Branch: {order.branchName}
                                  </div>
                                )}
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                            <p>No orders yet</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="xl:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-8 text-center">
              <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Select a Customer
              </h3>
              <p className="text-gray-500">
                Choose a customer from the list to view their details
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Customers;