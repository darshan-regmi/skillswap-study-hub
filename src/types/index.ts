
import { Timestamp } from "firebase/firestore";

export interface User {
  id: string;
  uid?: string;
  displayName: string;
  email: string;
  photoURL?: string;
  bio?: string;
  skills?: string[];
  averageRating?: number;
  createdAt: Date | Timestamp;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  deliveryType: 'instant' | 'live';
  tags: string[];
  fileURL?: string;
  imageURL?: string;
  sellerId: string;
  sellerName: string;
  sellerPhotoURL?: string;
  createdAt: Date | Timestamp;
  averageRating?: number;
  reviewCount?: number;
}

export interface Review {
  id: string;
  listingId: string;
  userId: string;
  rating: number;
  comment: string;
  userName: string;
  userPhotoURL?: string;
  createdAt: Date | Timestamp;
}

export interface Order {
  id: string;
  buyerId: string;
  sellerId: string;
  listingId: string;
  listingTitle: string;
  price: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date | Timestamp;
  completedAt?: Date | Timestamp;
  cancelledAt?: Date | Timestamp;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId?: string;
  content: string;
  createdAt: Date | Timestamp;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: string;
  lastMessageTime?: Date | Timestamp;
  createdAt: Date | Timestamp;
}
