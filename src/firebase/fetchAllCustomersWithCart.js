import { collection, getDocs, query ,where } from "firebase/firestore";
import { db } from "./firebase";

export const fetchAllCustomersWithCart = async () => {
  const usersQuery = query(
    collection(db, "users"),
    where("role", "==", "customer") // <-- Only customers
  );

  const userSnapshot = await getDocs(usersQuery);
  const customerList= [];

  for (const userDoc of userSnapshot.docs) {
    const userData = userDoc.data();
    const cartRef = collection(db, "users", userDoc.id, "cart");
    const cartSnapshot = await getDocs(cartRef);

    const cartItems= [];
    cartSnapshot.forEach((doc) => {
      cartItems.push({ id: doc.id, ...doc.data() });
    });

    customerList.push({
      id: userDoc.id,
      ...userData,
      cartItems,
    });
  }

  return customerList;
};

