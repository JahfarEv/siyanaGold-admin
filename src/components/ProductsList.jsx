// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { Plus, Edit, Trash2, Search } from "lucide-react";
// import Swal from "sweetalert2";
// import {
//   collection,
//   getDocs,
//   query,
//   orderBy,
//   deleteDoc,
//   doc,
//   onSnapshot,
//   updateDoc,
//   increment,
//   serverTimestamp,
// } from "firebase/firestore";
// import { db } from "../firebase/firebase";

// const ProductsList = () => {
//   const [products, setProducts] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState("all");
//   const [categories, setCategories] = useState([]);
//   const [selectedCategoryId, setSelectedCategoryId] = useState("");
//   useEffect(() => {
//     const q = query(collection(db, "categories"), orderBy("createdAt", "asc"));
//     const unsub = onSnapshot(q, (snap) => {
//       setCategories(snap.docs.map((d) => ({ id: d.id, ...(d.data() || {}) })));
//     });
//     return () => unsub();
//   }, []);
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const q = query(
//           collection(db, "products"),
//           orderBy("createdAt", "desc")
//         );
//         const querySnapshot = await getDocs(q);

//         const fetchedProducts = querySnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));

//         setProducts(fetchedProducts);
//         console.log(fetchedProducts);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   const handleDelete = async (productId) => {
//     try {
//       // Fetch the product name (optional if you already have it)
//       const product = products.find((p) => p.id === productId);

//       Swal.fire({
//         title: "Are you sure?",
//         text: `You are about to delete "${
//           product?.name || "this product"
//         }". This action cannot be undone!`,
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonColor: "#d33",
//         cancelButtonColor: "#3085d6",
//         confirmButtonText: "Yes, delete it!",
//         cancelButtonText: "Cancel",
//         background: "#fff",
//         color: "#333",
//         iconColor: "#eab308",
//         customClass: {
//           popup: "rounded-2xl",
//           confirmButton: "rounded-xl",
//           cancelButton: "rounded-xl",
//         },
//       }).then(async (result) => {
//         if (result.isConfirmed) {
//           try {
//             await deleteDoc(doc(db, "products", productId));

//             // ↓ Decrement category product count
//             const categoryRef = doc(db, "categories", product.category.id);
//             await updateDoc(categoryRef, {
//               productCount: increment(-1),
//               updatedAt: serverTimestamp(),
//             });

//             setProducts(products.filter((p) => p.id !== productId));

//             Swal.fire({
//               title: "Deleted!",
//               text: `"${
//                 product?.name || "Product"
//               }" has been deleted successfully.`,
//               icon: "success",
//             });
//           } catch (error) {
//             console.error("Delete error:", error);
//           }
//         }
//       });
//     } catch (error) {
//       console.error("Error in delete handler:", error);
//     }
//   };
//   const filteredProducts = products.filter((product) => {
//     const term = searchTerm.toLowerCase().trim();
//     const name = (product.name || "").toLowerCase();
//     const categoryName = (product.category.name || "").toLowerCase();
//     const gemstone = (product.gemstone || "").toLowerCase();
//     const material = (product.material || "").toLowerCase();
//     const price = product.price ? product.price.toString().toLowerCase() : "";

//     const matchesSearch =
//       name.includes(term) ||
//       categoryName.includes(term) ||
//       gemstone.includes(term) ||
//       material.includes(term) ||
//       price.includes(term);

//     const matchesFilter = filter === "all" || product.status === filter;

//     const selectedCat = categories.find((c) => c.id === selectedCategoryId);
//     const matchesCategory =
//       !selectedCategoryId ||
//       product.categoryId === selectedCategoryId ||
//       (selectedCat && categoryName === (selectedCat.name || "").toLowerCase());

//     return matchesSearch && matchesFilter && matchesCategory;
//   });

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
//     {/* Header */}
// <div className="mb-8">
//   <div className="flex items-center gap-3 mb-2">
//     <div className="w-1 h-10 rounded-full bg-gradient-to-b from-amber-500 to-rose-600 shrink-0" />
//     <div>
//       <p className="text-xs font-semibold tracking-widest text-amber-600 uppercase mb-0.5">
//         Products
//       </p>
//       <h1 className="text-3xl font-bold text-gray-900 leading-tight flex items-center gap-2">
//         Jewelry Collection
//         <span className="inline-block w-2 h-2 rounded-full bg-amber-500 mb-1" />
//       </h1>
//     </div>
//   </div>
//   <p className="text-sm text-gray-500 ml-4 pl-3 border-l border-gray-200">
//     Manage your exquisite jewelry pieces
//   </p>
// </div>



// <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-4 mb-6">
//   <div className="flex items-center gap-3">
    
//     {/* 🔍 Search */}
//     <div className="relative flex-1">
//       <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400 h-4 w-4" />
//       <input
//         type="text"
//         placeholder="Search..."
//         className="w-full pl-9 pr-3 py-2.5 text-sm border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 bg-amber-50"
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//       />
//     </div>

//     {/* 📂 Category */}
//     <div className="w-32 sm:w-40">
//       <select
//         value={selectedCategoryId}
//         onChange={(e) => setSelectedCategoryId(e.target.value)}
//         className="w-full px-3 py-2.5 text-sm border border-amber-200 rounded-xl bg-amber-50 focus:ring-2 focus:ring-amber-500"
//       >
//         <option value="">All</option>
//         {categories.map((cat) => (
//           <option key={cat.id} value={cat.id}>
//             {cat.name}
//           </option>
//         ))}
//       </select>
//     </div>

//   </div>
// </div>
//       {/* Products Grid - Minimal Design */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//         {filteredProducts.map((product) => (
//           <div
//             key={product.id}
//             className="bg-white rounded-2xl shadow-lg border border-amber-100 hover:shadow-xl transition-all duration-300 overflow-hidden group"
//           >
//             <div
//               className={`h-40 bg-gradient-to-br ${getGemstoneColor(
//                 product.gemstone
//               )} flex items-center justify-center relative`}
//             >
//               <div className="h-40 w-full flex items-center justify-center bg-white">
//                 <img
//                   src={product.images[0].url}
//                   alt={product.images[0].name}
//                   className="h-32 w-32 object-contain transition-transform duration-300 group-hover:scale-110"
//                 />
//               </div>
//             </div>

//             <div className="p-4">
//               <h3 className="text-base font-semibold text-gray-900 text-center line-clamp-2 group-hover:text-amber-600 transition-colors mb-2">
//                 {product.name}
//               </h3>

//               <div className="flex items-center justify-center space-x-2 mb-3">
//                 <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded">
//                   {product.category.name}
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

//               <div className="flex items-center justify-center space-x-2">
//                 <Link
//                   to={`/products/edit/${product.id}`}
//                   className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
//                   title="Edit Product"
//                 >
//                   <Edit className="h-4 w-4" />
//                 </Link>
//                 <button
//                   onClick={() => handleDelete(product.id)}
//                   className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                   title="Delete Product"
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



//       <Link
//   to="/products/add"
//   className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 bg-amber-600 hover:bg-amber-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50"
// >
//   <Plus className="h-6 w-6" />
// </Link>
//     </div>
//   );
// };

// export default ProductsList;


import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import Swal from "sweetalert2";
import {
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  useEffect(() => {
    const q = query(collection(db, "categories"), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      setCategories(snap.docs.map((d) => ({ id: d.id, ...(d.data() || {}) })));
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(
          collection(db, "products"),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);

        const fetchedProducts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProducts(fetchedProducts);
        console.log(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    try {
      const product = products.find((p) => p.id === productId);

      Swal.fire({
        title: "Are you sure?",
        text: `You are about to delete "${
          product?.name || "this product"
        }". This action cannot be undone!`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
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
            await deleteDoc(doc(db, "products", productId));

            const categoryRef = doc(db, "categories", product.category.id);
            await updateDoc(categoryRef, {
              productCount: increment(-1),
              updatedAt: serverTimestamp(),
            });

            setProducts(products.filter((p) => p.id !== productId));

            Swal.fire({
              title: "Deleted!",
              text: `"${
                product?.name || "Product"
              }" has been deleted successfully.`,
              icon: "success",
            });
          } catch (error) {
            console.error("Delete error:", error);
          }
        }
      });
    } catch (error) {
      console.error("Error in delete handler:", error);
    }
  };

  const filteredProducts = products.filter((product) => {
    const term = searchTerm.toLowerCase().trim();
    const name = (product.name || "").toLowerCase();
    const categoryName = (product.category.name || "").toLowerCase();
    const gemstone = (product.gemstone || "").toLowerCase();
    const material = (product.material || "").toLowerCase();
    const price = product.price ? product.price.toString().toLowerCase() : "";

    const matchesSearch =
      name.includes(term) ||
      categoryName.includes(term) ||
      gemstone.includes(term) ||
      material.includes(term) ||
      price.includes(term);

    const matchesFilter = filter === "all" || product.status === filter;

    const selectedCat = categories.find((c) => c.id === selectedCategoryId);
    const matchesCategory =
      !selectedCategoryId ||
      product.categoryId === selectedCategoryId ||
      (selectedCat && categoryName === (selectedCat.name || "").toLowerCase());

    return matchesSearch && matchesFilter && matchesCategory;
  });

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
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1 h-10 rounded-full bg-gradient-to-b from-amber-500 to-rose-600 shrink-0" />
          <div>
            <p className="text-xs font-semibold tracking-widest text-amber-600 uppercase mb-0.5">
              Products
            </p>
            <h1 className="text-3xl font-bold text-gray-900 leading-tight flex items-center gap-2">
              Jewelry Collection
              <span className="inline-block w-2 h-2 rounded-full bg-amber-500 mb-1" />
            </h1>
          </div>
        </div>
        <p className="text-sm text-gray-500 ml-4 pl-3 border-l border-gray-200">
          Manage your exquisite jewelry pieces
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-9 pr-3 py-2.5 text-sm border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 bg-amber-50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="w-32 sm:w-40">
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-amber-200 rounded-xl bg-amber-50 focus:ring-2 focus:ring-amber-500"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Table View - Single Row */}
      <div className="bg-white rounded-2xl shadow-lg border border-amber-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Table Header */}
            <thead className="bg-gradient-to-r from-amber-50 to-rose-50 border-b border-amber-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Gemstone
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Material
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            
            {/* Table Body */}
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-amber-50/30 transition-colors duration-150"
                >
                  {/* Image */}
                  <td className="px-4 py-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={product.images?.[0]?.url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>
                  
                  {/* Name */}
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900 line-clamp-2">
                      {product.name}
                    </p>
                  </td>
                  
                  {/* Category */}
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-700">
                      {product.category?.name}
                    </span>
                  </td>
                  
                  {/* Gemstone */}
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-700">
                      {product.gemstone || "-"}
                    </span>
                  </td>
                  
                  {/* Material & Weight */}
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-700">
                        {product.material || "-"}
                      </span>
                      {product.weight && (
                        <span className="text-xs text-gray-400">
                          {product.weight}g
                        </span>
                      )}
                    </div>
                  </td>
                  
                  {/* Price */}
                  <td className="px-4 py-3">
                    <span className="text-sm font-bold text-amber-700">
                      ₹{product.price?.toLocaleString()}
                    </span>
                  </td>
                  
                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        to={`/products/edit/${product.id}`}
                        className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit Product"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
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

      {/* Add Product Button */}
      <Link
        to="/products/add"
        className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 bg-amber-600 hover:bg-amber-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50"
      >
        <Plus className="h-6 w-6" />
      </Link>
    </div>
  );
};

export default ProductsList;