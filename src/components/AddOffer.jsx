import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, ImageIcon, Plus } from "lucide-react";
import Swal from "sweetalert2";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase/firebase";

const AddOffer = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    productName: "",
    discountPercentage: ""
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          image: "Please select a valid image file (JPEG, PNG, WebP)"
        }));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          image: "Image size should be less than 5MB"
        }));
        return;
      }

      setImageFile(file);
      setErrors(prev => ({ ...prev, image: "" }));

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.productName.trim()) {
      newErrors.productName = "Product name is required";
    }

    if (!formData.discountPercentage || formData.discountPercentage <= 0 || formData.discountPercentage > 100) {
      newErrors.discountPercentage = "Discount percentage must be between 1 and 100";
    }

    if (!imageFile) {
      newErrors.image = "Product image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      Swal.fire({
        title: "Validation Error",
        text: "Please fix the errors in the form",
        icon: "error",
        confirmButtonColor: "#ef4444",
        background: "#fff",
        color: "#333",
        customClass: {
          popup: "rounded-2xl",
          confirmButton: "rounded-xl",
        },
      });
      return;
    }

    setLoading(true);

    try {
      let imageUrl = "";

      if (imageFile) {
        const fileName = `offers/${Date.now()}_${imageFile.name}`;
        const storageRef = ref(storage, fileName);
        const snapshot = await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      const offerData = {
        productName: formData.productName.trim(),
        discountPercentage: parseFloat(formData.discountPercentage),
        image: imageUrl,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await addDoc(collection(db, "offers"), offerData);

      Swal.fire({
        title: "Success!",
        text: `Offer for "${formData.productName}" has been created successfully.`,
        icon: "success",
        confirmButtonColor: "#10b981",
        background: "#fff",
        color: "#333",
        iconColor: "#10b981",
        customClass: {
          popup: "rounded-2xl",
          confirmButton: "rounded-xl",
        },
      }).then(() => {
        navigate("/offers");
      });

    } catch (error) {
      console.error("Error adding offer:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to create offer. Please try again.",
        icon: "error",
        confirmButtonColor: "#ef4444",
        background: "#fff",
        color: "#333",
        customClass: {
          popup: "rounded-2xl",
          confirmButton: "rounded-xl",
        },
      });
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
        navigate("/offers");
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <button
            onClick={handleCancel}
            className="p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-colors"
            title="Back to Offers"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-800 to-rose-700 bg-clip-text text-transparent">
            Add New Offer
          </h1>
        </div>
        <p className="text-gray-600 ml-12">
          Create a new product offer
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Product Image *
            </label>
            
            <div className="flex flex-col items-center justify-center">
              {imagePreview ? (
                <div className="relative mb-4">
                  <img
                    src={imagePreview}
                    alt="Product preview"
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
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="w-64 h-48 border-2 border-dashed border-amber-300 rounded-2xl flex flex-col items-center justify-center bg-amber-50 mb-4 hover:bg-amber-100 transition-colors">
                  <ImageIcon className="h-12 w-12 text-amber-400 mb-2" />
                  <p className="text-sm text-gray-600 text-center px-4">
                    Upload product image
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    JPEG, PNG, WebP (max 5MB)
                  </p>
                </div>
              )}

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
              <p className="text-red-500 text-sm mt-2 text-center">{errors.image}</p>
            )}
          </div>

          {/* Product Name */}
          <div>
            <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              id="productName"
              name="productName"
              value={formData.productName}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50 transition-all duration-200 ${
                errors.productName ? "border-red-300" : "border-amber-200"
              }`}
              placeholder="e.g., Diamond Ring, Pearl Necklace"
            />
            {errors.productName && <p className="text-red-500 text-sm mt-2">{errors.productName}</p>}
          </div>

          {/* Discount Percentage */}
          <div>
            <label htmlFor="discountPercentage" className="block text-sm font-medium text-gray-700 mb-2">
              Discount Percentage *
            </label>
            <input
              type="number"
              id="discountPercentage"
              name="discountPercentage"
              value={formData.discountPercentage}
              onChange={handleInputChange}
              min="1"
              max="100"
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50 transition-all duration-200 ${
                errors.discountPercentage ? "border-red-300" : "border-amber-200"
              }`}
              placeholder="Enter discount percentage (1-100)"
            />
            {errors.discountPercentage && <p className="text-red-500 text-sm mt-2">{errors.discountPercentage}</p>}
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
                  Create Offer
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOffer;