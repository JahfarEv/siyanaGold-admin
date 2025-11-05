import React, { useEffect, useState } from "react";
import { Save, Image, Gem } from "lucide-react";
import { db } from "../firebase/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
  limit,
} from "firebase/firestore";
import LoadingOverlay from "./ui/LoadingOverlay";
import moment from "moment";

const HomeCustomization = () => {
  // 🔹 States
  const [carouselItems, setCarouselItems] = useState([]);
  const [goldRate, setGoldRate] = useState({ perGram: "", perPavan: "", date: "", id: "" });
  const [loading, setLoading] = useState(false);

  // 📅 Today’s date
  const todayDate = moment().format("YYYY-MM-DD");

  // 🔹 Load existing data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Carousel Items
        const carouselSnapshot = await getDocs(collection(db, "homeCarousel"));
        const carouselData = carouselSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCarouselItems(carouselData);

        // Fetch Gold Rate for today
        const goldQuery = query(
          collection(db, "goldRates"),
          where("date", "==", todayDate),
          limit(1)
        );
        const goldSnapshot = await getDocs(goldQuery);
        if (!goldSnapshot.empty) {
          const docData = goldSnapshot.docs[0].data();
          setGoldRate({
            perGram: docData.perGram,
            perPavan: docData.perPavan,
            date: docData.date,
            id: goldSnapshot.docs[0].id,
          });
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 🔹 Update Carousel Fields
  const handleCarouselChange = (id, field, value) => {
    setCarouselItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  // 🔹 Handle Gold Rate Input
  const handleGoldRateChange = (e) => {
    const { name, value } = e.target;
    setGoldRate((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Update Carousel Data
  const handleUpdateCarousel = async () => {
    setLoading(true);
    try {
      for (const item of carouselItems) {
        const ref = doc(db, "homeCarousel", item.id);
        await updateDoc(ref, {
          title: item.title,
          description: item.description,
        });
      }
      alert("Carousel updated successfully!");
    } catch (error) {
      console.error("Error updating carousel:", error);
      alert("Failed to update carousel.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Update Gold Rate
  const handleUpdateGoldRate = async () => {
    if (!goldRate.id) return alert("Gold rate entry not found for today!");
    if (!goldRate.perGram || !goldRate.perPavan)
      return alert("Please fill both gold rate values.");

    setLoading(true);
    try {
      await updateDoc(doc(db, "goldRates", goldRate.id), {
        perGram: goldRate.perGram,
        perPavan: goldRate.perPavan,
        updatedAt: new Date(),
      });
      alert("Gold rate updated successfully!");
    } catch (error) {
      console.error("Error updating gold rate:", error);
      alert("Failed to update gold rate.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {loading && <LoadingOverlay />}

      {/* 🟡 Carousel Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-amber-100 mb-10">
        <div className="bg-gradient-to-r from-amber-500 to-rose-500 p-6 flex items-center space-x-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <Image className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Home Carousel</h2>
            <p className="text-amber-100">Edit carousel titles and descriptions only</p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {carouselItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {carouselItems.map((item) => (
                <div
                  key={item.id}
                  className="relative bg-amber-50 rounded-xl p-3 border border-amber-200"
                >
                  <img
                    src={item.url}
                    alt={item.title || "Carousel"}
                    className="w-full h-28 object-cover rounded-lg mb-3"
                  />
                  <input
                    type="text"
                    placeholder="Title"
                    value={item.title}
                    onChange={(e) => handleCarouselChange(item.id, "title", e.target.value)}
                    className="w-full mb-2 px-3 py-2 text-sm border border-amber-200 rounded-lg bg-white"
                  />
                  <textarea
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) =>
                      handleCarouselChange(item.id, "description", e.target.value)
                    }
                    className="w-full px-3 py-2 text-sm border border-amber-200 rounded-lg bg-white"
                    rows={2}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center">No carousel items found.</p>
          )}

          <button
            onClick={handleUpdateCarousel}
            className="bg-gradient-to-r from-amber-500 to-rose-600 text-white px-6 py-3 rounded-xl flex items-center ml-auto hover:shadow-lg transition"
          >
            <Save className="h-5 w-5 mr-2" /> Update Carousel
          </button>
        </div>
      </div>

      {/* 🪙 Gold Rate Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-amber-100">
        <div className="bg-gradient-to-r from-amber-500 to-rose-500 p-6 flex items-center space-x-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <Gem className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Gold Rate</h2>
            <p className="text-amber-100">Edit today’s gold rate</p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="text"
                value={todayDate}
                readOnly
                className="w-full px-4 py-3 bg-gray-100 border border-amber-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price per Gram (₹)
              </label>
              <input
                type="number"
                name="perGram"
                value={goldRate.perGram}
                onChange={handleGoldRateChange}
                className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 bg-amber-50 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price per 8 Gram (₹)
              </label>
              <input
                type="number"
                name="perPavan"
                value={goldRate.perPavan}
                onChange={handleGoldRateChange}
                className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 bg-amber-50 transition"
              />
            </div>
          </div>

          <button
            onClick={handleUpdateGoldRate}
            className="bg-gradient-to-r from-amber-500 to-rose-600 text-white px-6 py-3 rounded-xl flex items-center ml-auto hover:shadow-lg transition"
          >
            <Save className="h-5 w-5 mr-2" /> Update Gold Rate
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeCustomization;
