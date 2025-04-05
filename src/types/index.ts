
export interface User {
  id: string;
  displayName: string;
  email: string;
  photoURL?: string;
  bio?: string;
  skills?: string[];
  averageRating?: number;
  createdAt: Date;
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
  createdAt: Date;
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
  createdAt: Date;
}

export interface Order {
  id: string;
  buyerId: string;
  sellerId: string;
  listingId: string;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
  completedAt?: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: Date;
  read: boolean;
}
