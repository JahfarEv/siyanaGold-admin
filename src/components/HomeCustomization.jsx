import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
  limit,
  addDoc,
} from "firebase/firestore";
import moment from "moment";
import { Gem, Image, Save } from "lucide-react";
import LoadingOverlay from "./ui/LoadingOverlay";
import { uploadToR2 } from "../r2/upload";

const HomeCustomization = () => {
  const [carouselItems, setCarouselItems] = useState([]);
  const [goldRate, setGoldRate] = useState({
    Gold_22_1g: "",
    Gold_22_8g: "",
    Gold_18_1g: "",
    Gold_9_1g: "",
  });
  const [goldRateId, setGoldRateId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pendingImages, setPendingImages] = useState({});
  const todayDate = moment().format("YYYY-MM-DD");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Load Carousel Items
        const snapshot = await getDocs(collection(db, "homeCarousel"));
        setCarouselItems(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));

        // Load Gold Rate
        const q = query(
          collection(db, "goldRates"),
          where("date", "==", todayDate),
          limit(1)
        );
        const goldSnapshot = await getDocs(q);
        if (!goldSnapshot.empty) {
          const goldRateDoc = goldSnapshot.docs[0];
          const data = goldRateDoc.data();
          setGoldRate({
            Gold_22_1g: data.Gold_22_1g ?? "",
            Gold_22_8g: data.Gold_22_8g ?? "",
            Gold_18_1g: data.Gold_18_1g ?? "",
            Gold_9_1g: data.Gold_9_1g ?? "",
          });
          setGoldRateId(goldRateDoc.id);
        }
      } catch (err) {
        console.log("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [todayDate]);

  // 🔹 On Change carousel fields
  const handleCarouselChange = (id, field, value) => {
    setCarouselItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleImageChange = (id, file) => {
    if (!file) return;

    // Live preview
    const previewUrl = URL.createObjectURL(file);
    setCarouselItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, previewUrl } : item))
    );

    // Store file to upload later
    setPendingImages((prev) => ({ ...prev, [id]: file }));
  };

  // 🔹 Update all carousel text fields
  const handleUpdateCarousel = async () => {
    setLoading(true);
    try {
      for (const item of carouselItems) {
        let finalImageUrl = item.url;

        // Upload the replacement image when one was selected.
        if (pendingImages[item.id]) {
          finalImageUrl = await uploadToR2(
            pendingImages[item.id],
            "home-carousel"
          );
        }

        await updateDoc(doc(db, "homeCarousel", item.id), {
          title: item.title,
          description: item.description,
          Button: item.Button || "",
          route: item.route || "",
          url: finalImageUrl,
          updatedAt: new Date(),
        });
      }

      alert("Carousel updated successfully");
      setPendingImages({});
    } catch (err) {
      console.error(err);
      alert(`Update failed: ${err.message || "Please try again."}`);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Gold rate updates
  const handleGoldRateChange = (e) => {
    setGoldRate({ ...goldRate, [e.target.name]: e.target.value });
  };

  const handleUpdateGoldRate = async () => {
    if (
      !goldRate.Gold_22_1g ||
      !goldRate.Gold_22_8g ||
      !goldRate.Gold_18_1g ||
      !goldRate.Gold_9_1g
    ) {
      return alert("Please enter all gold rates!");
    }

    setLoading(true);

    try {
      const rateData = {
        ...goldRate,
        date: todayDate,
        updatedAt: new Date(),
      };

      if (goldRateId) {
        await updateDoc(doc(db, "goldRates", goldRateId), rateData);
      } else {
        const newGoldRate = await addDoc(collection(db, "goldRates"), {
          ...rateData,
          createdAt: new Date(),
        });
        setGoldRateId(newGoldRate.id);
      }

      alert("Gold rate updated successfully");
    } catch (err) {
      console.error("Error creating gold rate:", err);
      alert("Failed to create gold rate");
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
            <p className="text-amber-100">
              Edit carousel titles and descriptions only
            </p>
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
                    src={item.previewUrl || item.url}
                    alt={item.title}
                    className="w-full h-28 object-cover rounded-lg mb-3 border cursor-pointer"
                    onClick={() =>
                      document.getElementById(`file-${item.id}`).click()
                    }
                  />

                  <input
                    id={`file-${item.id}`}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleImageChange(item.id, e.target.files[0])
                    }
                  />

                  <input
                    type="text"
                    placeholder="Title"
                    value={item.title}
                    onChange={(e) =>
                      handleCarouselChange(item.id, "title", e.target.value)
                    }
                    className="w-full mb-2 px-3 py-2 text-sm border border-amber-200 rounded-lg bg-white"
                  />
                  <textarea
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) =>
                      handleCarouselChange(
                        item.id,
                        "description",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 text-sm border border-amber-200 rounded-lg bg-white"
                    rows={2}
                  />
                  <input
                    type="text"
                    placeholder="Button"
                    value={item.Button}
                    onChange={(e) =>
                      handleCarouselChange(item.id, "Button", e.target.value)
                    }
                    className="w-full mb-2 px-3 py-2 text-sm border border-amber-200 rounded-lg bg-white"
                  />
                  <input
                    type="text"
                    placeholder="route"
                    value={item.route}
                    onChange={(e) =>
                      handleCarouselChange(item.id, "route", e.target.value)
                    }
                    className="w-full mb-2 px-3 py-2 text-sm border border-amber-200 rounded-lg bg-white"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center">
              No carousel items found.
            </p>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="text"
                value={todayDate}
                readOnly
                className="w-full px-4 py-3 bg-gray-100 border border-amber-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                22K - 1g (₹)
              </label>
              <input
                type="number"
                name="Gold_22_1g"
                value={goldRate.Gold_22_1g}
                onChange={handleGoldRateChange}
                className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 bg-amber-50 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                22K - 8g (₹)
              </label>
              <input
                type="number"
                name="Gold_22_8g"
                value={goldRate.Gold_22_8g}
                onChange={handleGoldRateChange}
                className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 bg-amber-50 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                18K - 1g (₹)
              </label>
              <input
                type="number"
                name="Gold_18_1g"
                onChange={handleGoldRateChange}
                value={goldRate.Gold_18_1g}
                className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 bg-amber-50 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                9K - 1g (₹)
              </label>
              <input
                type="number"
                name="Gold_9_1g"
                value={goldRate.Gold_9_1g}
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
