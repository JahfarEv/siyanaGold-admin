import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Upload, X, Tag, Image, Route } from "lucide-react";
import { db } from "../firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import { uploadToCloudinary } from "../cloudinary/upload";
import LoadingOverlay from "./ui/LoadingOverlay";

const EditOffer = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [offer, setOffer] = useState({
    productName: "",
    discountPercentage: 0,
    image: "",
    route: "",
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [images, setImages] = useState([]); // Selected new images
  const [imageUploading, setImageUploading] = useState(false);

  // Fetch offer data
  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const docRef = doc(db, "offer", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setOffer(docSnap.data());
        } else {
          Swal.fire("Error", "Offer not found", "error");
        }
      } catch (error) {
        console.error("Error fetching offer:", error);
        Swal.fire("Error", "Failed to load offer", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchOffer();
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setOffer({ 
      ...offer, 
      [name]: name === "discountPercentage" ? Number(value) : value 
    });
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newImages = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));

    setImages(newImages);
  };

  // Remove selected image
  const removeImage = (imageId) => {
    setImages(images.filter(img => img.id !== imageId));
  };

  // Submit updated offer
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = offer.image;

      // If new images are selected, upload them
      if (images.length > 0) {
        setImageUploading(true);
        const uploadedImages = await Promise.all(
          images.map((img) =>
            uploadToCloudinary(img.file, `offers`)
          )
        );
        imageUrl = uploadedImages[0]; // Use first image URL
        setImageUploading(false);
      }

      // Update Firestore document
      const docRef = doc(db, "offer", id);
      await updateDoc(docRef, {
        ...offer,
        image: imageUrl,
        discountPercentage: Number(offer.discountPercentage),
      });

      Swal.fire("Success", "Offer updated successfully", "success");
      navigate("/offers");
    } catch (error) {
      console.error("Error updating offer:", error);
      Swal.fire("Error", "Failed to update offer", "error");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <LoadingOverlay />;

  return (
    <div>
      {(uploading || imageUploading) && <LoadingOverlay />}

      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate("/offers")}
          className="mr-4 p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-800 to-rose-700 bg-clip-text text-transparent">
            Edit Offer
          </h1>
          <p className="text-gray-600 mt-1">
            Update your special offer details
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-amber-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-rose-500 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Tag className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Offer Information
              </h2>
              <p className="text-amber-100">
                Update your special promotion details
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Image & Basic Info */}
            <div className="space-y-6">
              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Offer Image
                </label>

                {/* Image Upload Area */}
                <div className="border-2 border-dashed border-amber-200 rounded-2xl p-6 text-center bg-amber-50 hover:bg-amber-100 transition-colors duration-200">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center justify-center space-y-3"
                  >
                    <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
                      <Upload className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {imageUploading
                          ? "Uploading Image..."
                          : "Click to upload new image"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, WEBP up to 10MB
                      </p>
                    </div>
                  </label>
                </div>

                {/* Image Previews */}
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    {images.length > 0 ? "New Image Preview" : "Current Image"}
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {/* Show current image if no new selected */}
                    {images.length === 0 && offer.image && (
                      <div className="relative">
                        <img
                          src={offer.image}
                          alt="Current Offer"
                          className="w-full h-24 object-cover rounded-lg border border-amber-200"
                        />
                      </div>
                    )}

                    {/* Show preview of new images */}
                    {images.map((img) => (
                      <div key={img.id} className="relative group">
                        <img
                          src={img.preview}
                          alt="Preview"
                          className="w-full h-24 object-cover rounded-lg border border-amber-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(img.id)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="productName"
                  value={offer.productName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50 transition-all duration-200"
                  placeholder="e.g., Diamond Collection Sale"
                />
              </div>
            </div>

            {/* Right Column - Discount & Route */}
            <div className="space-y-6">
              {/* Discount Percentage */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Percentage *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="discountPercentage"
                    value={offer.discountPercentage}
                    onChange={handleChange}
                    required
                    min="0"
                    max="100"
                    className="w-full px-4 py-3 pl-12 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50 transition-all duration-200"
                    placeholder="0"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                    %
                  </div>
                </div>
              </div>

              {/* Route */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Route
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="route"
                    value={offer.route}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pl-12 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50 transition-all duration-200"
                    placeholder="/shop/collection"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <Route className="h-4 w-4" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Optional: The route where this offer will be displayed
                </p>
              </div>

              {/* Current Image Info */}
              {offer.image && images.length === 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <Image className="h-5 w-5 text-amber-600" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">
                        Current Image
                      </p>
                      <p className="text-xs text-amber-600">
                        Upload a new image to replace the current one
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate("/offers")}
              className="px-6 py-3 border border-amber-300 text-amber-700 rounded-xl hover:bg-amber-50 transition-colors duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || imageUploading}
              className="bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white px-8 py-3 rounded-xl flex items-center shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 font-medium"
            >
              <Save className="h-5 w-5 mr-2" />
              {uploading ? "Updating Offer..." : "Update Offer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditOffer;