// components/EditProduct.js
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Gem, Sparkles, Upload, X } from "lucide-react";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { uploadToCloudinary } from "../cloudinary/upload";
import LoadingOverlay from "./ui/LoadingOverlay";

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    material: "",
    gemstone: "",
    weight: "",
    price: "",
    stock: "",
    status: "active",
    featured: false,
  });
  const [images, setImages] = useState([]);
  const [imageUploading, setImageUploading] = useState(false);
  const [initialCategory, setInitialCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  const materials = [
    "Platinum",
    "White Gold",
    "Yellow Gold",
    "Rose Gold",
    "Sterling Silver",
  ];
  const gemstones = [
    "Diamond",
    "Pearl",
    "Sapphire",
    "Ruby",
    "Emerald",
    "Amethyst",
    "Topaz",
    "Opal",
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnap = await getDocs(collection(db, "categories"));
        const list = querySnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(list);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchProduct = async () => {
      try {
        setInitialLoading(true);
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const normalizedCategory =
            typeof data.category === "string"
              ? { id: data.category, name: "" }
              : data.category;
          setFormData({
            ...data,
            category: normalizedCategory,
          });
          // Normalize existing images with IDs for state management
          const existingImages = (data.images || []).map((img) => ({
            ...img,
            id: Math.random().toString(36).substr(2, 9), // Assign temp ID for UI handling
            preview: img.url, // Standardize preview property
            isExisting: true, // Flag to identify existing images
          }));
          setImages(existingImages);
          setInitialCategory(normalizedCategory);
        } else {
          console.error("No such product!");
          navigate("/products");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchCategories();
    if (id) {
      fetchProduct();
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // If the field is category, store both id and name
    if (name === "category") {
      const selectedCat = categories.find((cat) => cat.id === value);
      setFormData((prev) => ({
        ...prev,
        category: {
          id: selectedCat?.id || "",
          name: selectedCat?.name || "",
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setImageUploading(true);

    try {
      const newImages = files.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
      }));

      setImages((prev) => [...prev, ...newImages]);
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Failed to add images. Check console.");
    } finally {
      setImageUploading(false);
    }
  };

  const removeImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) {
      alert("Please upload at least one image.");
      return;
    }
    setLoading(true);
    setImageUploading(true);

    try {
      // 1. Upload new images (those with 'file' property)
      const finalImages = await Promise.all(
        images.map(async (img) => {
          // Case 1: New Image (has file to upload)
          if (img.file) {
            const url = await uploadToCloudinary(
              img.file,
              `products/${formData.category.name || "others"}`
            );
            return { name: img.name, url };
          }
          // Case 2: Existing Image (preserve URL and name)
          return {
            name: img.name || "Product Image",
            url: img.url || img.preview,
          };
        })
      );

      const docRef = doc(db, "products", id);

      // 2. Check for category change
      const oldCatId =
        typeof initialCategory === "string"
          ? initialCategory
          : initialCategory?.id;

      const newCatId =
        typeof formData.category === "string"
          ? formData.category
          : formData.category?.id;

      if (oldCatId && newCatId && oldCatId !== newCatId) {
        // Decrement old category
        const oldCatRef = doc(db, "categories", oldCatId);
        await updateDoc(oldCatRef, {
          productCount: increment(-1),
          updatedAt: serverTimestamp(),
        });

        // Increment new category
        const newCatRef = doc(db, "categories", newCatId);
        await updateDoc(newCatRef, {
          productCount: increment(1),
          updatedAt: serverTimestamp(),
        });
      }

      await updateDoc(docRef, {
        ...formData,
        images: finalImages,
        updatedAt: serverTimestamp(),
      });

      console.log("Product updated:", formData);
      navigate("/products");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product.");
    } finally {
      setLoading(false);
      setImageUploading(false);
    }
  };

  return (
    <div>
      {(initialLoading || loading) && <LoadingOverlay />}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate("/products")}
          className="mr-4 p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-800 to-rose-700 bg-clip-text text-transparent">
            Edit Jewelry
          </h1>
          <p className="text-gray-600 mt-1">
            Update this exquisite jewelry piece
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-amber-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-rose-500 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Gem className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{formData.name}</h2>
              <p className="text-amber-100">
                Update the details of this jewelry piece
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information & Images */}
            <div className="space-y-6">
              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Product Images *
                </label>
                <div className="border-2 border-dashed border-amber-200 rounded-2xl p-6 text-center bg-amber-50 hover:bg-amber-100 transition-colors duration-200">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-edit-upload"
                  />
                  <label
                    htmlFor="image-edit-upload"
                    className="cursor-pointer flex flex-col items-center justify-center space-y-3"
                  >
                    <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
                      <Upload className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {imageUploading
                          ? "Uploading..."
                          : "Click to upload images"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, WEBP up to 10MB
                      </p>
                    </div>
                  </label>
                </div>

                {/* Previews */}
                {images.length > 0 && (
                  <div className="mt-4">
                    <div className="grid grid-cols-3 gap-3">
                      {images.map((image, idx) => (
                        <div key={image.id || idx} className="relative group">
                          <img
                            src={image.preview || image.url}
                            alt="Preview"
                            className="w-full h-24 object-cover rounded-lg border border-amber-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(image.id)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jewelry Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50 transition-all duration-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category?.id || formData.category || ""}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
                  >
                    <option value="">Select Category</option>
                    {categories?.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Material *
                  </label>
                  <select
                    name="material"
                    value={formData.material}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
                  >
                    {materials.map((mat) => (
                      <option key={mat} value={mat}>
                        {mat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Specifications & Pricing */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gemstone *
                  </label>
                  <select
                    name="gemstone"
                    value={formData.gemstone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
                  >
                    {gemstones.map((gem) => (
                      <option key={gem} value={gem}>
                        {gem}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight (grams) *
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.1"
                    className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
                  >
                    <option value="active">Active</option>
                    <option value="out-of-stock">Out of Stock</option>
                  </select>
                </div>

                <div className="flex items-center justify-center">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div
                        className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                          formData.featured ? "bg-amber-500" : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                            formData.featured ? "transform translate-x-6" : ""
                          }`}
                        ></div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Sparkles className="h-4 w-4 text-amber-500" />
                      <span className="text-sm font-medium text-gray-700">
                        Featured Piece
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate("/products")}
              className="px-6 py-3 border border-amber-300 text-amber-700 rounded-xl hover:bg-amber-50 transition-colors duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white px-8 py-3 rounded-xl flex items-center shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 font-medium"
            >
              <Save className="h-5 w-5 mr-2" />
              {loading ? "Updating..." : "Update Jewelry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
