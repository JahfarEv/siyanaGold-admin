
// import React, { useState, useEffect } from "react";
// import {
//   Search,
//   Mail,
//   Phone,
//   MapPin,
//   User,
//   Edit,
//   ShoppingBag,
//   Calendar,
//   DollarSign,
// } from "lucide-react";
// import { fetchAllCustomersWithCart } from "../firebase/fetchAllCustomersWithCart";

// // Utility function to serialize Firestore timestamps
// const serializeFirestoreData = (data) => {
//   if (!data) return data;
  
//   if (Array.isArray(data)) {
//     return data.map(item => serializeFirestoreData(item));
//   }
  
//   if (data && typeof data === 'object') {
//     // Handle Firestore Timestamp
//     if (data.seconds !== undefined && data.nanoseconds !== undefined) {
//       return data.toDate ? data.toDate().toISOString() : new Date(data.seconds * 1000).toISOString();
//     }
    
//     const serialized = {};
//     for (const key in data) {
//       serialized[key] = serializeFirestoreData(data[key]);
//     }
//     return serialized;
//   }
  
//   return data;
// };

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
        
//         // Serialize the entire data structure
//         const serializedData = data.map(customer => ({
//           ...customer,
//           cartItems: serializeFirestoreData(customer.cartItems || []),
//           orders: (customer.orders || []).map(order => ({
//             ...order,
//             createdAt: serializeFirestoreData(order.createdAt),
//             updatedAt: serializeFirestoreData(order.updatedAt),
//             items: serializeFirestoreData(order.items || [])
//           })),
//           createdAt: serializeFirestoreData(customer.createdAt),
//           updatedAt: serializeFirestoreData(customer.updatedAt)
//         }));
        
//         setCustomers(serializedData);
//         // Don't auto-select first customer
//         setSelectedCustomer(null);
//       } catch (err) {
//         console.error("Error fetching customer data:", err);
//       }
//       setLoading(false);
//     };

//     loadCustomers();
//   }, []);

//   // Single search function that searches across all fields
//   const filteredCustomers = customers?.filter((customer) => {
//     if (!searchTerm.trim()) return true;
    
//     const searchLower = searchTerm.toLowerCase().trim();
    
//     // Search in customer details
//     const customerMatch = 
//       (customer?.name?.toLowerCase().includes(searchLower)) ||
//       (customer?.email?.toLowerCase().includes(searchLower)) ||
//       (customer?.mobile?.toLowerCase().includes(searchLower)) ||
//       (customer?.location?.toLowerCase().includes(searchLower)) ||
//       (customer?.id?.toLowerCase().includes(searchLower));
    
//     // Search in order IDs
//     const orderMatch = customer.orders?.some((order) => 
//       order.orderId?.toLowerCase().includes(searchLower) ||
//       order.id?.toLowerCase().includes(searchLower)
//     );
    
//     return customerMatch || orderMatch;
//   });

//   // Format date helper
//   const formatDate = (dateString) => {
//     if (!dateString) return "Date not available";
//     try {
//       return new Date(dateString).toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "short",
//         day: "numeric",
//         hour: "2-digit",
//         minute: "2-digit",
//       });
//     } catch {
//       return "Date not available";
//     }
//   };

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

//       {/* Single Search Section */}
//       <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-4">
//         <div className="flex flex-col md:flex-row gap-4">
//           {/* Search Input - Single box for everything */}
//           <div className="flex-1 relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400 h-5 w-5" />
//             <input
//               type="text"
//               placeholder="Search by customer name, email, phone, order ID..."
//               className="w-full pl-10 pr-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50 transition-all duration-200"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             {searchTerm && (
//               <button
//                 onClick={() => setSearchTerm("")}
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//               >
//                 ✕
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Search Info */}
//         {searchTerm && (
//           <div className="mt-3 text-sm text-gray-600">
//             <p>
//               Found {filteredCustomers.length} customer
//               {filteredCustomers.length !== 1 ? "s" : ""} matching "{searchTerm}"
//             </p>
//           </div>
//         )}
//       </div>

//       <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
//         {/* Customers List */}
//         <div className="xl:col-span-1 space-y-4">
//           {/* Customers Cards */}
//           <div className="space-y-3 max-h-[600px] overflow-y-auto">
//             {filteredCustomers?.map((customer) => {
//               // Check if this customer has matching orders for highlighting
//               const hasMatchingOrder = searchTerm && customer.orders?.some((order) => 
//                 order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 order.id?.toLowerCase().includes(searchTerm.toLowerCase())
//               );
              
//               return (
//                 <div
//                   key={customer.id}
//                   onClick={() => setSelectedCustomer(customer)}
//                   className={`bg-white rounded-2xl p-4 shadow-lg border cursor-pointer transition-all duration-300 hover:shadow-xl ${
//                     selectedCustomer?.id === customer.id
//                       ? "border-amber-400 ring-2 ring-amber-100"
//                       : "border-amber-100 hover:border-amber-300"
//                   }`}
//                 >
//                   <div className="flex items-center space-x-4">
//                     <div className="w-14 h-14 bg-gradient-to-r from-amber-400 to-rose-400 rounded-full flex items-center justify-center shadow-md">
//                       <span className="text-white font-bold text-base">
//                         {customer.avatar || (customer.name && customer.name.charAt(0)) || "U"}
//                       </span>
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center justify-between">
//                         <h3 className="text-lg font-semibold text-gray-900 truncate">
//                           {customer.name}
//                         </h3>
//                         {customer.orders?.length > 0 && (
//                           <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
//                             {customer.orders.length} order
//                             {customer.orders.length !== 1 ? "s" : ""}
//                           </span>
//                         )}
//                       </div>
//                       <p className="text-sm text-gray-600 truncate">
//                         {customer.email}
//                       </p>
//                       <div className="flex items-center justify-between mt-1">
//                         <div className="flex items-center">
//                           <MapPin className="h-3 w-3 text-gray-400 mr-1" />
//                           <span className="text-xs text-gray-500">
//                             {customer.location || "No location"}
//                           </span>
//                         </div>
//                         {hasMatchingOrder && (
//                           <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
//                             Order match
//                           </span>
//                         )}
//                         {customer.mobile && (
//                           <span className="text-xs text-gray-500">
//                             {customer.mobile}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}

//             {!loading && customers.length === 0 && (
//               <div className="text-center py-8 text-gray-500 bg-white rounded-2xl p-4">
//                 <User className="h-12 w-12 text-gray-300 mx-auto mb-3" />
//                 <p>No customers found</p>
//               </div>
//             )}

//             {searchTerm && filteredCustomers.length === 0 && customers.length > 0 && (
//               <div className="text-center py-8 text-gray-500 bg-white rounded-2xl p-4">
//                 <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
//                 <p>No customers or orders found matching "{searchTerm}"</p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Customer Details - Only show when a customer is selected */}
//         {selectedCustomer ? (
//           <div className="xl:col-span-2">
//             <div className="bg-white rounded-2xl shadow-lg border border-amber-100 overflow-hidden">
//               {/* Header */}
//               <div className="bg-gradient-to-r from-amber-500 to-rose-500 p-6">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-4">
//                     <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
//                       <span className="text-white font-bold text-2xl">
//                         {selectedCustomer.avatar || (selectedCustomer.name && selectedCustomer.name.charAt(0)) || "U"}
//                       </span>
//                     </div>
//                     <div>
//                       <h2 className="text-2xl font-bold text-white">
//                         {selectedCustomer.name}
//                       </h2>
//                       <p className="text-amber-100">
//                         {selectedCustomer.gender || "Customer"} • {selectedCustomer.location || "No location"}
//                       </p>
//                       {selectedCustomer.mobile && (
//                         <p className="text-amber-100 text-sm mt-1">
//                           <Phone className="h-3 w-3 inline mr-1" />
//                           {selectedCustomer.mobile}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <span className="text-white/80 text-sm">
//                       {selectedCustomer.orders?.length || 0} orders
//                     </span>
//                     <button className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
//                       <Edit className="h-5 w-5 text-white" />
//                     </button>
//                   </div>
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
//                               {selectedCustomer.mobile || "Not provided"}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Cart Items */}
//                   <div className="space-y-6">
//                     <div>
//                       <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
//                         <ShoppingBag className="h-5 w-5 text-amber-600 mr-2" />
//                         Cart Items ({selectedCustomer.cartItems?.length || 0})
//                       </h3>
//                       <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
//                         {selectedCustomer.cartItems?.length > 0 ? (
//                           selectedCustomer.cartItems.map((item, index) => (
//                             <div
//                               key={index}
//                               className="flex items-center justify-between py-3 px-4 bg-rose-50 rounded-xl border border-rose-100 hover:shadow-md transition-shadow"
//                             >
//                               <div className="flex items-center space-x-4">
//                                 {item.images && item.images.length > 0 && (
//                                   <img
//                                     src={item.images[0].url}
//                                     alt={item.name}
//                                     className="w-16 h-16 object-cover rounded-lg border border-rose-200"
//                                   />
//                                 )}
//                                 <div className="flex flex-col">
//                                   <span className="text-sm font-semibold text-gray-900">
//                                     {item.name}
//                                   </span>
//                                   <div className="flex items-center space-x-2 mt-1">
//                                     <span className="text-xs bg-rose-100 text-rose-800 px-2 py-1 rounded-full">
//                                       ₹{parseFloat(item.price).toLocaleString()} × {item.quantity || 1}
//                                     </span>
//                                     {item.material && (
//                                       <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
//                                         {item.material}
//                                       </span>
//                                     )}
//                                     {item.weight && (
//                                       <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
//                                         {item.weight}g
//                                       </span>
//                                     )}
//                                   </div>
//                                   {item.gemstone && (
//                                     <span className="text-xs text-gray-500 mt-1">
//                                       Gemstone: {item.gemstone}
//                                     </span>
//                                   )}
//                                   {item.category?.name && (
//                                     <span className="text-xs text-gray-500 mt-1">
//                                       Category: {item.category.name}
//                                     </span>
//                                   )}
//                                   {item.addedAt && (
//                                     <span className="text-xs text-gray-400 mt-1">
//                                       Added: {formatDate(item.addedAt)}
//                                     </span>
//                                   )}
//                                 </div>
//                               </div>
//                               <div className="text-right">
//                                 <span className="text-sm font-bold text-gray-900 block">
//                                   ₹{(parseFloat(item.price) * (item.quantity || 1)).toLocaleString()}
//                                 </span>
//                                 <span className="text-xs text-rose-600 bg-rose-100 px-2 py-1 rounded-full mt-1 block">
//                                   In Cart
//                                 </span>
//                               </div>
//                             </div>
//                           ))
//                         ) : (
//                           <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl">
//                             <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-3" />
//                             <p>No items in cart</p>
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     {/* User Orders */}
//                     <div className="mt-6">
//                       <div className="flex items-center justify-between mb-4">
//                         <h3 className="text-lg font-semibold text-gray-900 flex items-center">
//                           <Calendar className="h-5 w-5 text-amber-600 mr-2" />
//                           Order History
//                         </h3>
//                         <div className="flex items-center space-x-2">
//                           <span className="text-sm bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
//                             Total Orders: {selectedCustomer.orders?.length || 0}
//                           </span>
//                         </div>
//                       </div>

//                       <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
//                         {selectedCustomer.orders &&
//                         selectedCustomer.orders.length > 0 ? (
//                           selectedCustomer.orders.map((order, orderIndex) => {
//                             const isMatchingOrder =
//                               searchTerm &&
//                               (order.orderId
//                                 ?.toLowerCase()
//                                 .includes(searchTerm.toLowerCase()) ||
//                                 order.id
//                                   ?.toLowerCase()
//                                   .includes(searchTerm.toLowerCase()));

//                             // Calculate total if not provided
//                             const orderTotal = order.totalAmount 
//                               ? parseFloat(order.totalAmount)
//                               : order.items?.reduce((sum, item) => 
//                                   sum + (parseFloat(item.price) * (item.quantity || 1)), 0);

//                             return (
//                               <div
//                                 key={orderIndex}
//                                 className={`rounded-xl border p-4 transition-all ${
//                                   isMatchingOrder
//                                     ? "bg-yellow-50 border-yellow-200 ring-2 ring-yellow-100"
//                                     : "bg-green-50 border-green-100"
//                                 }`}
//                               >
//                                 {/* Order Header */}
//                                 <div className="flex items-center justify-between mb-3 pb-2 border-b border-green-200">
//                                   <div className="flex flex-col">
//                                     <span className="text-sm font-semibold text-gray-900 flex items-center">
//                                       <ShoppingBag className="h-4 w-4 mr-2 text-green-600" />
//                                       Order #{order.orderId || (order.id && order.id.slice(-8))}
//                                       {isMatchingOrder && (
//                                         <span className="ml-2 text-xs bg-yellow-500 text-white px-2 py-1 rounded-full">
//                                           Match
//                                         </span>
//                                       )}
//                                     </span>
//                                     <div className="flex items-center text-xs text-gray-500 mt-1">
//                                       <Calendar className="h-3 w-3 mr-1" />
//                                       {formatDate(order.createdAt)}
//                                     </div>
//                                   </div>
//                                   <span
//                                     className={`text-xs px-3 py-1.5 rounded-full font-medium ${
//                                       order.status === "completed" || order.status === "delivered"
//                                         ? "text-green-600 bg-green-100"
//                                         : order.status === "pending"
//                                           ? "text-amber-600 bg-amber-100"
//                                           : order.status === "processing"
//                                             ? "text-blue-600 bg-blue-100"
//                                             : order.status === "cancelled"
//                                               ? "text-red-600 bg-red-100"
//                                               : "text-gray-600 bg-gray-100"
//                                     }`}
//                                   >
//                                     {order.status || "Pending"}
//                                   </span>
//                                 </div>

//                                 {/* Order Items */}
//                                 <div className="space-y-2">
//                                   {order.items && order.items.length > 0 ? (
//                                     order.items.map((item, itemIndex) => (
//                                       <div
//                                         key={itemIndex}
//                                         className="flex items-center space-x-3 bg-white rounded-lg p-3 hover:bg-gray-50"
//                                       >
//                                         {item.images && item.images.length > 0 && (
//                                           <img
//                                             src={item.images[0].url}
//                                             alt={item.name}
//                                             className="w-14 h-14 object-cover rounded-lg border border-gray-200"
//                                           />
//                                         )}
//                                         <div className="flex-1">
//                                           <span className="text-sm font-medium text-gray-900 block">
//                                             {item.name}
//                                           </span>
//                                           <div className="flex items-center space-x-2 mt-1">
//                                             <span className="text-xs text-gray-600">
//                                               ₹{parseFloat(item.price).toLocaleString()} × {item.quantity}
//                                             </span>
//                                             {item.material && (
//                                               <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
//                                                 {item.material}
//                                               </span>
//                                             )}
//                                             {item.weight && (
//                                               <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
//                                                 {item.weight}g
//                                               </span>
//                                             )}
//                                           </div>
//                                         </div>
//                                         <span className="text-sm font-semibold text-gray-900">
//                                           ₹{(parseFloat(item.price) * (item.quantity || 1)).toLocaleString()}
//                                         </span>
//                                       </div>
//                                     ))
//                                   ) : (
//                                     <div className="text-center py-2 text-gray-500 text-sm bg-white rounded-lg">
//                                       No items in this order
//                                     </div>
//                                   )}
//                                 </div>

//                                 {/* Order Total */}
//                                 <div className="flex justify-between items-center mt-3 pt-3 border-t border-green-200">
//                                   <span className="text-sm font-medium text-gray-600">
//                                     Order Total:
//                                   </span>
//                                   <span className="text-lg font-bold text-gray-900">
//                                     ₹{orderTotal?.toLocaleString(undefined, {
//                                       minimumFractionDigits: 2,
//                                       maximumFractionDigits: 2
//                                     })}
//                                   </span>
//                                 </div>

//                                 {/* Additional Order Info */}
//                                 <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
//                                   {order.branchName && (
//                                     <span>Branch: {order.branchName}</span>
//                                   )}
//                                   {order.paymentMethod && (
//                                     <span>Payment: {order.paymentMethod}</span>
//                                   )}
//                                 </div>
//                               </div>
//                             );
//                           })
//                         ) : (
//                           <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl">
//                             <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-3" />
//                             <p>No orders yet</p>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div className="xl:col-span-2">
//             <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-12 text-center">
//               <User className="h-20 w-20 text-gray-300 mx-auto mb-4" />
//               <h3 className="text-2xl font-semibold text-gray-700 mb-3">
//                 No Customer Selected
//               </h3>
//               <p className="text-gray-500 max-w-md mx-auto">
//                 Select a customer from the list to view their detailed information, cart items, and order history
//               </p>
//               {customers.length > 0 && (
//                 <p className="text-amber-600 mt-4 text-sm">
//                   {customers.length} customer{customers.length !== 1 ? "s" : ""} available
//                 </p>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Customers;






import React, { useState, useEffect } from "react";
import {
  Search,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  Users,
  Package,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchAllCustomersWithCart } from "../firebase/fetchAllCustomersWithCart";

// Utility function to serialize Firestore timestamps
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

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCustomers = async () => {
      setLoading(true);
      try {
        const data = await fetchAllCustomersWithCart();
        
        const serializedData = data.map(customer => ({
          ...customer,
          cartItems: serializeFirestoreData(customer.cartItems || []),
          orders: (customer.orders || []).map(order => ({
            ...order,
            createdAt: serializeFirestoreData(order.createdAt),
            updatedAt: serializeFirestoreData(order.updatedAt),
            items: serializeFirestoreData(order.items || [])
          })),
          createdAt: serializeFirestoreData(customer.createdAt),
          updatedAt: serializeFirestoreData(customer.updatedAt),
          totalSpent: (customer.orders || []).reduce((sum, order) => 
            sum + (parseFloat(order.totalAmount) || 0), 0)
        }));
        
        setCustomers(serializedData);
      } catch (err) {
        console.error("Error fetching customer data:", err);
      }
      setLoading(false);
    };

    loadCustomers();
  }, []);

  const filteredAndSortedCustomers = () => {
    let filtered = [...customers];
    
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(customer => 
        (customer?.name?.toLowerCase().includes(searchLower)) ||
        (customer?.email?.toLowerCase().includes(searchLower)) ||
        (customer?.mobile?.toLowerCase().includes(searchLower)) ||
        (customer?.location?.toLowerCase().includes(searchLower)) ||
        (customer?.id?.toLowerCase().includes(searchLower)) ||
        customer.orders?.some(order => 
          order.orderId?.toLowerCase().includes(searchLower) ||
          order.id?.toLowerCase().includes(searchLower)
        )
      );
    }
    
    if (filterType === "withOrders") {
      filtered = filtered.filter(c => (c.orders?.length || 0) > 0);
    } else if (filterType === "withCart") {
      filtered = filtered.filter(c => (c.cartItems?.length || 0) > 0);
    } else if (filterType === "highSpending") {
      filtered = filtered.filter(c => (c.totalSpent || 0) > 50000);
    }
    
    if (sortBy === "name") {
      filtered.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else if (sortBy === "orders") {
      filtered.sort((a, b) => (b.orders?.length || 0) - (a.orders?.length || 0));
    }
    
    return filtered;
  };

  const filteredCustomers = filteredAndSortedCustomers();

  const getCustomerStats = (customer) => {
    const totalOrders = customer.orders?.length || 0;
    const cartItems = customer.cartItems?.length || 0;
    return { totalOrders, cartItems };
  };

  const handleViewCustomer = (customerId) => {
    navigate(`/customers/${customerId}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
        <p className="text-gray-500">Loading customers...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-800 to-rose-700 bg-clip-text text-transparent">
              Customer Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage and track your valuable customers
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-amber-100">
            <Users className="h-5 w-5 text-amber-600" />
            <span className="text-sm text-gray-600">Total Customers:</span>
            <span className="text-xl font-bold text-gray-900">{customers.length}</span>
          </div>
        </div>
      </div>

      {/* Search and Filters Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by name, email, phone, order ID..."
              className="w-full pl-10 pr-10 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50/30 transition-all duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-3 border border-amber-200 rounded-xl hover:bg-amber-50 transition-colors flex items-center gap-2"
          >
            <Filter className="h-5 w-5 text-amber-600" />
            <span>Filters</span>
            {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-amber-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Customer Type
                </label>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { value: "all", label: "All Customers" },
                    { value: "withOrders", label: "With Orders" },
                    { value: "withCart", label: "Active Cart" },
                  ].map(filter => (
                    <button
                      key={filter.value}
                      onClick={() => setFilterType(filter.value)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                        filterType === filter.value
                          ? "bg-amber-500 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Sort By
                </label>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { value: "name", label: "Name" },
                    { value: "orders", label: "Most Orders" },
                  ].map(sort => (
                    <button
                      key={sort.value}
                      onClick={() => setSortBy(sort.value)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                        sortBy === sort.value
                          ? "bg-amber-500 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {sort.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search Results Info */}
        {searchTerm && (
          <div className="mt-3 text-sm text-gray-600 bg-amber-50 p-2 rounded-lg">
            Found {filteredCustomers.length} customer{filteredCustomers.length !== 1 ? "s" : ""} matching "{searchTerm}"
          </div>
        )}
      </div>

      {/* Customers List - Compact Clickable Cards */}
      <div className="space-y-2">
        {filteredCustomers.map((customer) => {
          const stats = getCustomerStats(customer);
          
          return (
            <div
              key={customer.id}
              onClick={() => handleViewCustomer(customer.id)}
              className="bg-white rounded-xl shadow-sm border border-amber-100 hover:shadow-md hover:border-amber-300 transition-all duration-200 cursor-pointer group"
            >
              <div className="p-3 px-4">
                <div className="flex items-center justify-between gap-4">
                  {/* Name Section */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-rose-400 rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
                      <span className="text-white font-bold text-sm">
                        {customer.name?.charAt(0) || "U"}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-semibold text-gray-900 truncate">
                        {customer.name}
                      </h3>
                      {customer.mobile && (
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Phone className="h-3 w-3 flex-shrink-0" />
                          {customer.mobile}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Orders and Cart in same row */}
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="flex items-center gap-1.5">
                      <Package className="h-4 w-4 text-amber-500" />
                      <span className="text-sm font-medium text-gray-700">
                        {stats.totalOrders}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <ShoppingBag className="h-4 w-4 text-rose-500" />
                      <span className="text-sm font-medium text-gray-700">
                        {stats.cartItems}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl">
          <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-1">
            No customers found
          </h3>
          <p className="text-gray-400">
            {searchTerm ? "Try a different search term" : "No customers in the database yet"}
          </p>
        </div>
      )}
    </div>
  );
};

export default Customers;