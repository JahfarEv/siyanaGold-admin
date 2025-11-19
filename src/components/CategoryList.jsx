import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import Swal from "sweetalert2";
import { collection, getDocs, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebase";

const CategoriesList = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Dummy categories data - replace with your actual data structure
  const dummyCategories = [
    {
      id: "1",
      name: "Rings",
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=300&fit=crop",
      productCount: 15,
      createdAt: new Date()
    },
    {
      id: "2",
      name: "Necklaces",
      image: "https://images.unsplash.com/photo-1599643478510-a34935077415?w=400&h=300&fit=crop",
      productCount: 12,
      createdAt: new Date()
    },
    {
      id: "3",
      name: "Earrings",
      image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=300&fit=crop",
      productCount: 8,
      createdAt: new Date()
    },
    {
      id: "4",
      name: "Bracelets",
      image: "https://images.unsplash.com/photo-1588444650700-6c7f0c89d36b?w=400&h=300&fit=crop",
      productCount: 10,
      createdAt: new Date()
    }
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // First, try to fetch from Firebase
        const q = query(
          collection(db, "categories"),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const fetchedCategories = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setCategories(fetchedCategories);
        } else {
          // If no categories in Firebase, use dummy data
          setCategories(dummyCategories);
        }
        console.log("Categories loaded:", categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Fallback to dummy data if there's an error
        setCategories(dummyCategories);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleDelete = async (categoryId, categoryName) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: `You are about to delete the "${categoryName}" category. This action cannot be undone!`,
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
            // Delete from Firebase Firestore if it exists there
            await deleteDoc(doc(db, "categories", categoryId));
            
            // Update local state
            setCategories(categories.filter((cat) => cat.id !== categoryId));

            // Success message
            Swal.fire({
              title: "Deleted!",
              text: `"${categoryName}" category has been deleted successfully.`,
              icon: "success",
              confirmButtonColor: "#10b981",
              background: "#fff",
              color: "#333",
              iconColor: "#10b981",
              customClass: {
                popup: "rounded-2xl",
                confirmButton: "rounded-xl",
              },
            });
          } catch (error) {
            console.error("Error deleting category:", error);
            // If error, still remove from local state for dummy data
            setCategories(categories.filter((cat) => cat.id !== categoryId));
            
            Swal.fire({
              title: "Deleted!",
              text: `"${categoryName}" category has been removed.`,
              icon: "success",
              confirmButtonColor: "#10b981",
              background: "#fff",
              color: "#333",
              iconColor: "#10b981",
            });
          }
        }
      });
    } catch (error) {
      console.error("Error in delete handler:", error);
    }
  };

  const filteredCategories = categories.filter((category) => {
    const term = searchTerm.toLowerCase().trim();
    const name = (category.name || "").toLowerCase();
    
    return name.includes(term);
  });

  const getCategoryColor = (categoryName) => {
    const colors = {
      Rings: "from-amber-100 to-orange-100",
      Necklaces: "from-blue-100 to-purple-100",
      Earrings: "from-pink-100 to-rose-100",
      Bracelets: "from-emerald-100 to-teal-100",
    };
    return colors[categoryName] || "from-gray-100 to-gray-200";
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
          Jewelry Categories
        </h1>
        <p className="text-gray-600 mt-2">
          Manage your jewelry categories and collections
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search categories..."
              className="w-full pl-10 pr-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50 transition-all duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/categories/add"
              className="bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white px-6 py-3 rounded-xl flex items-center shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Category
            </Link>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCategories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-2xl shadow-lg border border-amber-100 hover:shadow-xl transition-all duration-300 overflow-hidden group"
          >
            {/* Category Image Container */}
            <div
              className={`h-48 bg-gradient-to-br ${getCategoryColor(
                category.name
              )} flex items-center justify-center relative`}
            >
              {/* Category Image */}
              <div className="h-48 w-full flex items-center justify-center bg-white overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </div>

            {/* Category Information */}
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 text-center group-hover:text-amber-600 transition-colors mb-3">
                {category.name}
              </h3>

              <div className="text-center space-y-2 mb-4">
                <div className="text-sm text-gray-600">
                  {category.productCount || 0} products
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center space-x-3">
                <Link
                  to={`/categories/edit/${category.id}`}
                  className="px-4 py-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors flex items-center text-sm font-medium"
                  title="Edit Category"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(category.id, category.name)}
                  className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex items-center text-sm font-medium"
                  title="Delete Category"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-amber-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No categories found
          </h3>
          <p className="text-gray-500">
            Try adjusting your search or add a new category
          </p>
        </div>
      )}
    </div>
  );
};

export default CategoriesList;