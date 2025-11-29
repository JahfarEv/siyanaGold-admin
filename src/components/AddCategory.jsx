import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Image as ImageIcon, Plus } from "lucide-react";
import Swal from "sweetalert2";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase/firebase";
import { uploadToCloudinary } from "../cloudinary/upload";

const AddCategory = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [errors, setErrors] = useState({ name: "", image: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type))
      return setErrors((prev) => ({
        ...prev,
        image: "Please select a valid image file",
      }));

    if (file.size > 5 * 1024 * 1024)
      return setErrors((prev) => ({
        ...prev,
        image: "Image size must be less than 5MB",
      }));

    setImageFile(file);
    setErrors((prev) => ({ ...prev, image: "" }));

    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  };


  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Category name is required";
    if (!imageFile) newErrors.image = "Category image is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm())
      return Swal.fire("Validation Error", "Fix the errors", "error");

    setLoading(true);

    try {
      // 1️⃣ Upload image to Cloudinary
      const imageUrl = await uploadToCloudinary(
        imageFile,
        `categories/${formData.name || "others"}`
      );

      // 2️⃣ Add category to Firestore
      const refDoc = await addDoc(collection(db, "categories"), {
        name: formData.name.trim(),
        description: formData.description.trim(),
        image: imageUrl,
        productCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // 3️⃣ Store categoryId in the same document
      await updateDoc(doc(db, "categories", refDoc.id), {
        categoryId: refDoc.id,
      });

      Swal.fire({
        icon: "success",
        title: "Category Created",
        text: `"${formData.name}" category added successfully`,
      }).then(() => navigate("/categories"));
    } catch (error) {
      console.error("Error:", error);
      Swal.fire("Error", "Failed to create category!", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You have unsaved changes that will be lost.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, discard changes",
      cancelButtonText: "Continue editing",
      background: "#fff",
      color: "#333",
      customClass: {
        popup: "rounded-2xl",
        confirmButton: "rounded-xl",
        cancelButton: "rounded-xl",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/categories");
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <button
            onClick={handleCancel}
            className="p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-colors"
            title="Back to Categories"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-800 to-rose-700 bg-clip-text text-transparent">
            Add New Category
          </h1>
        </div>
        <p className="text-gray-600 ml-12">
          Create a new jewelry category for your collection
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Category Image *
            </label>

            <div className="flex flex-col items-center justify-center">
              {/* Image Preview */}
              {imagePreview ? (
                <div className="relative mb-4">
                  <img
                    src={imagePreview}
                    alt="Category preview"
                    className="w-64 h-48 object-cover rounded-2xl shadow-md border border-amber-200"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setImageFile(null);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="w-64 h-48 border-2 border-dashed border-amber-300 rounded-2xl flex flex-col items-center justify-center bg-amber-50 mb-4 hover:bg-amber-100 transition-colors">
                  <ImageIcon className="h-12 w-12 text-amber-400 mb-2" />
                  <p className="text-sm text-gray-600 text-center px-4">
                    Upload category image
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    JPEG, PNG, WebP (max 5MB)
                  </p>
                </div>
              )}

              {/* File Input */}
              <label className="bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white px-6 py-3 rounded-xl flex items-center shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer">
                <Upload className="h-5 w-5 mr-2" />
                {imagePreview ? "Change Image" : "Select Image"}
                <input
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            {errors.image && (
              <p className="text-red-500 text-sm mt-2 flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {errors.image}
              </p>
            )}
          </div>

          {/* Category Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Category Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50 transition-all duration-200 ${
                errors.name ? "border-red-300" : "border-amber-200"
              }`}
              placeholder="e.g., Rings, Necklaces, Earrings"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-2 flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {errors.name}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50 transition-all duration-200"
              placeholder="Describe this category..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-amber-100">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white px-8 py-3 rounded-xl flex items-center shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5 mr-2" />
                  Create Category
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Quick Tips */}
      <div className="mt-8 bg-amber-50 border border-amber-200 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-amber-800 mb-3">
          💡 Quick Tips
        </h3>
        <ul className="text-sm text-amber-700 space-y-2">
          <li>• Use clear, descriptive names for categories</li>
          <li>• Choose high-quality images that represent the category well</li>
          <li>• Keep descriptions concise but informative</li>
          <li>
            • Consider how categories will help customers navigate your
            collection
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AddCategory;
