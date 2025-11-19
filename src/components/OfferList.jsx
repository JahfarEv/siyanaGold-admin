import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit, Trash2, Search, Tag } from "lucide-react";
import Swal from "sweetalert2";
import { collection, getDocs, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebase";

const OffersList = () => {
  const [offers, setOffers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Dummy offers data - simplified
  const dummyOffers = [
    {
      id: "1",
      productName: "Diamond Ring",
      discountPercentage: 20,
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=300&fit=crop",
      createdAt: new Date()
    },
    {
      id: "2",
      productName: "Pearl Necklace",
      discountPercentage: 30,
      image: "https://images.unsplash.com/photo-1599643478510-a34935077415?w=400&h=300&fit=crop",
      createdAt: new Date()
    },
    {
      id: "3",
      productName: "Gold Bracelet",
      discountPercentage: 15,
      image: "https://images.unsplash.com/photo-1588444650700-6c7f0c89d36b?w=400&h=300&fit=crop",
      createdAt: new Date()
    }
  ];

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        // First, try to fetch from Firebase
        const q = query(
          collection(db, "offers"),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const fetchedOffers = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setOffers(fetchedOffers);
        } else {
          // If no offers in Firebase, use dummy data
          setOffers(dummyOffers);
        }
      } catch (error) {
        console.error("Error fetching offers:", error);
        setOffers(dummyOffers);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  const handleDelete = async (offerId, productName) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: `You are about to delete the offer for "${productName}". This action cannot be undone!`,
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
            await deleteDoc(doc(db, "offers", offerId));
            setOffers(offers.filter((offer) => offer.id !== offerId));

            Swal.fire({
              title: "Deleted!",
              text: `Offer for "${productName}" has been deleted successfully.`,
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
            console.error("Error deleting offer:", error);
            setOffers(offers.filter((offer) => offer.id !== offerId));
            
            Swal.fire({
              title: "Deleted!",
              text: `Offer for "${productName}" has been removed.`,
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

  const filteredOffers = offers.filter((offer) => {
    const term = searchTerm.toLowerCase().trim();
    const productName = (offer.productName || "").toLowerCase();
    
    return productName.includes(term);
  });

  const getDiscountColor = (percentage) => {
    if (percentage >= 30) return "bg-red-500";
    if (percentage >= 20) return "bg-orange-500";
    return "bg-green-500";
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
          Special Offers
        </h1>
        <p className="text-gray-600 mt-2">
          Manage product offers and discounts
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50 transition-all duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/offers/add"
              className="bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white px-6 py-3 rounded-xl flex items-center shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Offer
            </Link>
          </div>
        </div>
      </div>

      {/* Offers Grid - Simplified */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOffers.map((offer) => (
          <div
            key={offer.id}
            className="bg-white rounded-2xl shadow-lg border border-amber-100 hover:shadow-xl transition-all duration-300 overflow-hidden group"
          >
            {/* Product Image */}
            <div className="h-48 bg-gray-100 flex items-center justify-center relative overflow-hidden">
              <img
                src={offer.image}
                alt={offer.productName}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              
              {/* Discount Badge */}
              <div className={`absolute top-4 right-4 ${getDiscountColor(offer.discountPercentage)} text-white px-3 py-2 rounded-full shadow-lg`}>
                <div className="flex items-center">
                  <Tag className="h-4 w-4 mr-1" />
                  <span className="font-bold text-sm">{offer.discountPercentage}% OFF</span>
                </div>
              </div>
            </div>

            {/* Product Information */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 text-center group-hover:text-amber-600 transition-colors mb-4">
                {offer.productName}
              </h3>

              {/* Action Buttons */}
              <div className="flex items-center justify-center space-x-3">
                <Link
                  to={`/offers/edit/${offer.id}`}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl flex items-center justify-center transition-colors duration-200 text-sm font-medium"
                  title="Edit Offer"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(offer.id, offer.productName)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl flex items-center justify-center transition-colors duration-200 text-sm font-medium"
                  title="Delete Offer"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredOffers.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Tag className="h-8 w-8 text-amber-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No offers found
          </h3>
          <p className="text-gray-500">
            Try adjusting your search or add a new offer
          </p>
        </div>
      )}
    </div>
  );
};

export default OffersList;