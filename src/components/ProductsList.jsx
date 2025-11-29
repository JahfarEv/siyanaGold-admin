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
      // Fetch the product name (optional if you already have it)
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

            // ↓ Decrement category product count
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
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="px-4 py-3 border border-amber-200 rounded-xl bg-amber-50"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
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
              <div className="h-40 w-full flex items-center justify-center bg-white">
                <img
                  src={product.images[0].url}
                  alt={product.images[0].name}
                  className="h-32 w-32 object-contain transition-transform duration-300 group-hover:scale-110"
                />
              </div>
            </div>

            {/* Product Information - Minimal */}
            <div className="p-4">
              <h3 className="text-base font-semibold text-gray-900 text-center line-clamp-2 group-hover:text-amber-600 transition-colors mb-2">
                {product.name}
              </h3>

              <div className="flex items-center justify-center space-x-2 mb-3">
                <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded">
                  {product.category.name}
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
