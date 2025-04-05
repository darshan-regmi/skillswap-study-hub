
import { collection, addDoc, serverTimestamp, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Review } from "@/types";

export const addReview = async (
  listingId: string,
  userId: string,
  userName: string,
  userPhotoURL: string | undefined,
  rating: number,
  comment: string
): Promise<void> => {
  try {
    await addDoc(collection(db, "reviews"), {
      listingId,
      userId,
      userName,
      userPhotoURL,
      rating,
      comment,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error adding review:", error);
    throw new Error("Failed to add review");
  }
};

export const getReviewsForListing = async (listingId: string): Promise<Review[]> => {
  try {
    const q = query(
      collection(db, "reviews"),
      where("listingId", "==", listingId),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Review));
  } catch (error) {
    console.error("Error getting reviews:", error);
    throw new Error("Failed to get reviews");
  }
};

export const getReviewsByUser = async (userId: string): Promise<Review[]> => {
  try {
    const q = query(
      collection(db, "reviews"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Review));
  } catch (error) {
    console.error("Error getting user reviews:", error);
    throw new Error("Failed to get user reviews");
  }
};
