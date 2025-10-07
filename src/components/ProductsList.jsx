import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import Swal from "sweetalert2";

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const mockProducts = [
      {
        id: 1,
        name: "Infinity Diamond Ring",
        category: "Rings",
        price: 5200.0,
        material: "Platinum",
        gemstone: "Diamond",
        weight: 2.5,
        image: "💍",
      },
      {
        id: 2,
        name: "Pearl Elegance Necklace",
        category: "Necklaces",
        price: 3200.0,
        material: "White Gold",
        gemstone: "Pearl",
        weight: 18.5,
        image: "📿",
      },
      {
        id: 3,
        name: "Sapphire Royal Bracelet",
        category: "Bracelets",
        price: 7800.0,
        material: "Rose Gold",
        gemstone: "Sapphire",
        weight: 12.2,
        image: "📿",
      },
      {
        id: 4,
        name: "Emerald Drop Earrings",
        category: "Earrings",
        price: 4500.0,
        material: "Yellow Gold",
        gemstone: "Emerald",
        weight: 8.7,
        image: "💎",
      },
      {
        id: 5,
        name: "Diamond Tennis Bracelet",
        category: "Bracelets",
        price: 12500.0,
        material: "Platinum",
        gemstone: "Diamond",
        weight: 25.8,
        image: "📿",
      },
      {
        id: 6,
        name: "Ruby Cluster Ring",
        category: "Rings",
        price: 6800.0,
        material: "Rose Gold",
        gemstone: "Ruby",
        weight: 3.2,
        image: "💍",
      },
    ];
    setProducts(mockProducts);
    setLoading(false);
  }, []);

  const handleDelete = (productId) => {
    const product = products.find(p => p.id === productId);
    
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete "${product.name}". This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      background: '#fff',
      color: '#333',
      iconColor: '#eab308',
      customClass: {
        popup: 'rounded-2xl',
        confirmButton: 'rounded-xl',
        cancelButton: 'rounded-xl'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        // Delete the product
        setProducts(products.filter((product) => product.id !== productId));
        
        // Show success message
        Swal.fire({
          title: 'Deleted!',
          text: `"${product.name}" has been deleted successfully.`,
          icon: 'success',
          confirmButtonColor: '#10b981',
          background: '#fff',
          color: '#333',
          iconColor: '#10b981',
          customClass: {
            popup: 'rounded-2xl',
            confirmButton: 'rounded-xl'
          }
        });
      }
    });
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.gemstone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || product.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getGemstoneColor = (gemstone) => {
    const colors = {
      Diamond: "from-blue-100 to-purple-100",
      Pearl: "from-amber-100 to-rose-100",
      Sapphire: "from-blue-100 to-indigo-100",
      Emerald: "from-green-100 to-emerald-100",
      Ruby: "from-red-100 to-pink-100",
    };
    return colors[gemstone] || "from-gray-100 to-gray-200";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-800 to-rose-700 bg-clip-text text-transparent">
          Jewelry Collection
        </h1>
        <p className="text-gray-600 mt-2">
          Manage your exquisite jewelry pieces
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search jewelry pieces..."
              className="w-full pl-10 pr-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50 transition-all duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/products/add"
              className="bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white px-6 py-3 rounded-xl flex items-center shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Jewelry
            </Link>
          </div>
        </div>
      </div>

      {/* Products Grid - Minimal Design */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl shadow-lg border border-amber-100 hover:shadow-xl transition-all duration-300 overflow-hidden group"
          >
            {/* Large Image Container */}
            <div
              className={`h-40 bg-gradient-to-br ${getGemstoneColor(
                product.gemstone
              )} flex items-center justify-center relative`}
            >
              {/* Product Image - Large */}
              <div className="text-5xl transform group-hover:scale-110 transition-transform duration-300">
                {product.image}
              </div>
            </div>

            {/* Product Information - Minimal */}
            <div className="p-4">
              <h3 className="text-base font-semibold text-gray-900 text-center line-clamp-2 group-hover:text-amber-600 transition-colors mb-2">
                {product.name}
              </h3>

              <div className="flex items-center justify-center space-x-2 mb-3">
                <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded">
                  {product.category}
                </span>
                <span className="text-xs font-medium text-gray-600 bg-gray-50 px-2 py-1 rounded">
                  {product.gemstone}
                </span>
              </div>

              <div className="text-center space-y-1 mb-3">
                <div className="text-sm text-gray-600">
                  {product.material} • {product.weight}g
                </div>
                <div className="text-lg font-bold text-amber-700">
                  ${product.price.toLocaleString()}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center space-x-2">
                <Link
                  to={`/products/edit/${product.id}`}
                  className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Edit Product"
                >
                  <Edit className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Product"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-amber-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No jewelry pieces found
          </h3>
          <p className="text-gray-500">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductsList;

// components/ProductsList.js
// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { Plus, Edit, Trash2, Search } from "lucide-react";

// const ProductsList = () => {
//   const [products, setProducts] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState("all");

//   useEffect(() => {
//     const mockProducts = [
//       {
//         id: 1,
//         name: "Infinity Diamond Ring",
//         category: "Rings",
//         price: 5200.0,
//         // status: 'active',
//         material: "Platinum",
//         gemstone: "Diamond",
//         weight: 2.5,
//         image: "💍",
//       },
//       {
//         id: 2,
//         name: "Pearl Elegance Necklace",
//         category: "Necklaces",
//         price: 3200.0,
//         // status: 'active',
//         material: "White Gold",
//         gemstone: "Pearl",
//         weight: 18.5,
//         image: "📿",
//       },
//       {
//         id: 3,
//         name: "Sapphire Royal Bracelet",
//         category: "Bracelets",
//         price: 7800.0,
//         // status: 'out-of-stock',
//         material: "Rose Gold",
//         gemstone: "Sapphire",
//         weight: 12.2,
//         image: "📿",
//       },
//       {
//         id: 4,
//         name: "Emerald Drop Earrings",
//         category: "Earrings",
//         price: 4500.0,
//         // status: 'active',
//         material: "Yellow Gold",
//         gemstone: "Emerald",
//         weight: 8.7,
//         image: "💎",
//       },
//       {
//         id: 5,
//         name: "Diamond Tennis Bracelet",
//         category: "Bracelets",
//         price: 12500.0,
//         // status: 'active',
//         material: "Platinum",
//         gemstone: "Diamond",
//         weight: 25.8,
//         image: "📿",
//       },
//       {
//         id: 6,
//         name: "Ruby Cluster Ring",
//         category: "Rings",
//         price: 6800.0,
//         // status: 'active',
//         material: "Rose Gold",
//         gemstone: "Ruby",
//         weight: 3.2,
//         image: "💍",
//       },
//     ];
//     setProducts(mockProducts);
//     setLoading(false);
//   }, []);

//   const handleDelete = (productId) => {
//     if (window.confirm("Are you sure you want to delete this jewelry piece?")) {
//       setProducts(products.filter((product) => product.id !== productId));
//     }
//   };

//   const filteredProducts = products.filter((product) => {
//     const matchesSearch =
//       product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       product.gemstone.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesFilter = filter === "all" || product.status === filter;
//     return matchesSearch && matchesFilter;
//   });

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "active":
//         return "bg-green-100 text-green-800";
//       case "out-of-stock":
//         return "bg-red-100 text-red-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const getGemstoneColor = (gemstone) => {
//     const colors = {
//       Diamond: "from-blue-100 to-purple-100",
//       Pearl: "from-amber-100 to-rose-100",
//       Sapphire: "from-blue-100 to-indigo-100",
//       Emerald: "from-green-100 to-emerald-100",
//       Ruby: "from-red-100 to-pink-100",
//     };
//     return colors[gemstone] || "from-gray-100 to-gray-200";
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-800 to-rose-700 bg-clip-text text-transparent">
//           Jewelry Collection
//         </h1>
//         <p className="text-gray-600 mt-2">
//           Manage your exquisite jewelry pieces
//         </p>
//       </div>

//       {/* Controls */}
//       <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6 mb-6">
//         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//           <div className="relative flex-1 max-w-md">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400 h-5 w-5" />
//             <input
//               type="text"
//               placeholder="Search jewelry pieces..."
//               className="w-full pl-10 pr-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50 transition-all duration-200"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>

//           <div className="flex items-center space-x-4">
//             <Link
//               to="/products/add"
//               className="bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white px-6 py-3 rounded-xl flex items-center shadow-lg hover:shadow-xl transition-all duration-200"
//             >
//               <Plus className="h-5 w-5 mr-2" />
//               Add Jewelry
//             </Link>
//           </div>
//         </div>
//       </div>

//       {/* Products Grid - Minimal Design */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//         {filteredProducts.map((product) => (
//           <div
//             key={product.id}
//             className="bg-white rounded-2xl shadow-lg border border-amber-100 hover:shadow-xl transition-all duration-300 overflow-hidden group"
//           >
//             {/* Large Image Container */}
//             <div
//               className={`h-40 bg-gradient-to-br ${getGemstoneColor(
//                 product.gemstone
//               )} flex items-center justify-center relative`}
//             >
//               {/* Product Image - Large */}
//               <div className="text-5xl transform group-hover:scale-110 transition-transform duration-300">
//                 {product.image}
//               </div>
//             </div>

//             {/* Product Information - Minimal */}
//             <div className="p-4">
//               <h3 className="text-base font-semibold text-gray-900 text-center line-clamp-2 group-hover:text-amber-600 transition-colors mb-2">
//                 {product.name}
//               </h3>

//               <div className="flex items-center justify-center space-x-2 mb-3">
//                 <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded">
//                   {product.category}
//                 </span>
//                 <span className="text-xs font-medium text-gray-600 bg-gray-50 px-2 py-1 rounded">
//                   {product.gemstone}
//                 </span>
//               </div>

//               <div className="text-center space-y-1 mb-3">
//                 <div className="text-sm text-gray-600">
//                   {product.material} • {product.weight}g
//                 </div>
//                 <div className="text-lg font-bold text-amber-700">
//                   ${product.price.toLocaleString()}
//                 </div>
//               </div>

//               {/* Action Buttons */}
//               <div className="flex items-center justify-center space-x-2">
//                 <Link
//                   to={`/products/edit/${product.id}`}
//                   className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
//                 >
//                   <Edit className="h-4 w-4" />
//                 </Link>
//                 <button
//                   onClick={() => handleDelete(product.id)}
//                   className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                 >
//                   <Trash2 className="h-4 w-4" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {filteredProducts.length === 0 && (
//         <div className="text-center py-12">
//           <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <Search className="h-8 w-8 text-amber-400" />
//           </div>
//           <h3 className="text-lg font-medium text-gray-900 mb-2">
//             No jewelry pieces found
//           </h3>
//           <p className="text-gray-500">
//             Try adjusting your search or filter criteria
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductsList;
