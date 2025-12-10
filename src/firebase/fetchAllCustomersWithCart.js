import { collection, getDocs, query, where } from "firebase/firestore";
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
    
    // Fetch cart items
    const cartRef = collection(db, "users", userDoc.id, "cart");
    const cartSnapshot = await getDocs(cartRef);

    const cartItems= [];
    cartSnapshot.forEach((doc) => {
      cartItems.push({ id: doc.id, ...doc.data() });
    });

    // Fetch user orders
    let orders = [];
    try {
      const ordersQuery = query(
        collection(db, "orders"),
        where("userId", "==", userDoc.id)
      );
      const ordersSnapshot = await getDocs(ordersQuery);
      
      ordersSnapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() });
      });
      
      // Sort orders by createdAt in JavaScript instead of Firestore
      orders.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
        return dateB - dateA; // Descending order
      });
    } catch (error) {
      console.error("Error fetching orders for user:", userDoc.id, error);
      // Continue with empty orders array
    }

    customerList.push({
      id: userDoc.id,
      ...userData,
      cartItems,
      orders,
    });
  }

  return customerList;
};

