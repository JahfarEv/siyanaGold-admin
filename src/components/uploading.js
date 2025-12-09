import { db, storage } from "../firebase/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const dummyOffers = [
  {
    id: "1",
    productName: "Diamond Ring",
    discountPercentage: 20,
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=300&fit=crop",
    route: "product/408372954",
  },
  {
    id: "2",
    productName: "Pearl Necklace",
    discountPercentage: 30,
    image:
      "https://images.unsplash.com/photo-1599643478510-a34935077415?w=400&h=300&fit=crop",
    route: "product/408372954",
  },
  {
    id: "3",
    productName: "Gold Bracelet",
    discountPercentage: 15,
    image:
      "https://images.unsplash.com/photo-1588444650700-6c7f0c89d36b?w=400&h=300&fit=crop",
    route: "product/408372954",
  },
];

export const uploadOffers = async () => {
  try {
    for (const offer of dummyOffers) {
      // Add to Firestore
      await addDoc(collection(db, "offer"), {
        productName: offer.productName,
        discountPercentage: offer.discountPercentage,
        image: "",
        route: offer.route,
        createdAt: serverTimestamp(),
      });

      console.log(`Offer ${offer.productName} uploaded successfully!`);
    }
  } catch (error) {
    console.error("Error uploading offers: ", error);
  }
};
