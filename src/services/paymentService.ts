
import { doc, addDoc, collection, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Listing, Order } from "@/types";

// This is a mock implementation for the Stripe checkout service
// In a real application, you would need to connect to a backend that handles the actual Stripe integration
export const createCheckoutSession = async (
  userId: string,
  listing: Listing
): Promise<string> => {
  try {
    // In a real implementation, this would call your backend to create a Stripe checkout session
    // For now, we'll simulate this process by creating an order document
    
    // Create a new order in the orders collection
    const orderRef = await addDoc(collection(db, "orders"), {
      buyerId: userId,
      sellerId: listing.sellerId,
      listingId: listing.id,
      listingTitle: listing.title,
      price: listing.price,
      status: "pending",
      createdAt: serverTimestamp(),
    });

    // In a real implementation, this would return a Stripe checkout URL
    // For demo purposes, we'll return a local success URL simulating checkout completion
    return `/payment-success?order=${orderRef.id}`;
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw new Error("Failed to create checkout session");
  }
};

export const completeOrder = async (orderId: string): Promise<void> => {
  try {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, {
      status: "completed",
      completedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error completing order:", error);
    throw new Error("Failed to complete order");
  }
};

export const cancelOrder = async (orderId: string): Promise<void> => {
  try {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, {
      status: "cancelled",
      cancelledAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    throw new Error("Failed to cancel order");
  }
};
