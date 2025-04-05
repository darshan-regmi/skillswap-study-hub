
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import ReviewForm from "@/components/reviews/ReviewForm";
import { 
  Calendar, 
  Download, 
  MessageSquare, 
  Star, 
  Clock, 
  ShoppingCart,
  AlertCircle,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Listing } from "@/types";
import { getReviewsForListing } from "@/services/reviewService";
import { createCheckoutSession } from "@/services/paymentService";

// Mock listing data for initial render before real data loads
const mockListing = {
  id: "1",
  title: "Advanced React Hooks and Context API Tutorial",
  description: "Learn how to effectively use React's advanced hooks (useCallback, useMemo, useRef) and the Context API to build scalable React applications. This comprehensive guide includes code examples, best practices, and a complete project walkthrough.",
  price: 25,
  deliveryType: "instant",
  tags: ["react", "javascript", "web-development", "hooks", "context"],
  imageURL: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
  sellerId: "user123",
  sellerName: "Alex Johnson",
  sellerPhotoURL: "https://gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50",
  createdAt: new Date("2023-02-15"),
  averageRating: 4.8,
  reviewCount: 24,
};

const ListingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<Listing | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Fetch listing data
  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return;
      
      try {
        const docRef = doc(db, "listings", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setListing({
            id: docSnap.id,
            ...docSnap.data(),
          } as Listing);
        } else {
          console.log("No such listing!");
          // For demo purposes, use mock data if no listing found
          setListing(mockListing as unknown as Listing);
        }
      } catch (error) {
        console.error("Error fetching listing:", error);
        toast.error("Failed to load listing");
        // For demo purposes, use mock data on error
        setListing(mockListing as unknown as Listing);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchListing();
  }, [id]);
  
  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      if (!id) return;
      
      try {
        const fetchedReviews = await getReviewsForListing(id);
        setReviews(fetchedReviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    
    fetchReviews();
  }, [id]);

  const handlePurchase = async () => {
    if (!currentUser) {
      toast.error("Please log in to make a purchase");
      navigate("/login");
      return;
    }
    
    if (!listing) return;
    
    setIsPurchasing(true);
    
    try {
      // In a real app, this would create a Stripe checkout session
      const checkoutUrl = await createCheckoutSession(currentUser.uid, listing);
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast.error("Failed to initiate checkout");
      setIsPurchasing(false);
    }
  };

  const handleContactSeller = () => {
    // In a real app, this would create or navigate to a conversation with the seller
    if (!currentUser) {
      toast.error("Please log in to contact the seller");
      navigate("/login");
      return;
    }
    
    if (!listing) return;
    
    toast.success("Message request sent to seller!");
    // Navigate to messages in a real implementation
    // navigate(`/messages/${conversationId}`);
  };
  
  const handleReviewSubmitted = async () => {
    // Refresh reviews after a new one is submitted
    if (!id) return;
    try {
      const updatedReviews = await getReviewsForListing(id);
      setReviews(updatedReviews);
    } catch (error) {
      console.error("Error refreshing reviews:", error);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-16 px-4 text-center">
          <Loader2 className="mx-auto h-16 w-16 animate-spin text-primary" />
          <h2 className="mt-4 text-xl font-medium">Loading listing...</h2>
        </div>
      </Layout>
    );
  }

  if (!listing) {
    return (
      <Layout>
        <div className="container mx-auto py-16 px-4 text-center">
          <AlertCircle className="mx-auto h-16 w-16 text-gray-400" />
          <h2 className="mt-4 text-2xl font-bold">Listing Not Found</h2>
          <p className="mt-2 text-gray-600">The listing you're looking for doesn't exist or has been removed.</p>
          <Button asChild className="mt-6">
            <Link to="/listings">Browse Listings</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="w-full lg:w-2/3 space-y-6">
            {/* Listing Image and Title */}
            <div className="relative rounded-lg overflow-hidden">
              <img 
                src={listing.imageURL} 
                alt={listing.title} 
                className="w-full h-64 sm:h-80 object-cover"
              />
              <div className="absolute top-4 right-4">
                <Badge className="bg-primary text-white">
                  {listing.deliveryType === "instant" ? "Instant Download" : "Live Session"}
                </Badge>
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-bold">{listing.title}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-2">
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="font-medium">{listing.averageRating || "New"}</span>
                  <span className="text-gray-500 text-sm ml-1">
                    ({listing.reviewCount || reviews.length} reviews)
                  </span>
                </div>
                <div className="flex items-center text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="text-sm">
                    Listed on {listing.createdAt instanceof Date
                      ? listing.createdAt.toLocaleDateString()
                      : new Date(listing.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {listing.tags?.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Tabs for Description and Reviews */}
            <Tabs 
              defaultValue="description" 
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="reviews">
                  Reviews ({reviews.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="mt-6">
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-line">
                    {listing.description}
                  </p>

                  {listing.deliveryType === "instant" ? (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium flex items-center">
                        <Download className="h-5 w-5 mr-2 text-primary" />
                        What you'll get
                      </h3>
                      <ul className="mt-2 space-y-2 text-sm">
                        <li>✓ Comprehensive PDF guide (45 pages)</li>
                        <li>✓ Complete code examples with comments</li>
                        <li>✓ Sample project repository</li>
                        <li>✓ Lifetime access and updates</li>
                      </ul>
                    </div>
                  ) : (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-primary" />
                        What to expect
                      </h3>
                      <ul className="mt-2 space-y-2 text-sm">
                        <li>✓ 60-minute video call session</li>
                        <li>✓ Personalized instruction and Q&A</li>
                        <li>✓ Screen sharing and live coding</li>
                        <li>✓ Follow-up email with resources</li>
                      </ul>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-6">
                <div className="space-y-6">
                  {reviews.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No reviews yet.</p>
                    </div>
                  ) : (
                    <div>
                      {/* Review summary */}
                      <div className="bg-gray-50 rounded-lg p-6 mb-6">
                        <h3 className="text-lg font-medium">Review Summary</h3>
                        <div className="flex items-center gap-4 mt-3">
                          <div className="text-center">
                            <div className="text-3xl font-bold">
                              {listing.averageRating || 
                                (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)}
                            </div>
                            <div className="flex mt-1">
                              {Array(5).fill(0).map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-4 w-4 ${
                                    i < Math.round(listing.averageRating || 
                                      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length) 
                                      ? "fill-yellow-400 text-yellow-400" 
                                      : "text-gray-300"
                                  }`} 
                                />
                              ))}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              {reviews.length} reviews
                            </div>
                          </div>
                          <div className="flex-1 space-y-2">
                            {[5, 4, 3, 2, 1].map((rating) => {
                              const count = reviews.filter(r => r.rating === rating).length;
                              const percentage = (count / reviews.length) * 100;
                              return (
                                <div key={rating} className="flex items-center text-sm">
                                  <span className="w-12">{rating} stars</span>
                                  <div className="flex-1 h-2 mx-2 bg-gray-200 rounded-full">
                                    <div 
                                      className="h-2 bg-yellow-400 rounded-full"
                                      style={{ width: `${percentage}%` }}
                                    ></div>
                                  </div>
                                  <span className="w-8 text-right">{count}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Review list */}
                      <div className="space-y-4">
                        {reviews.map((review) => (
                          <Card key={review.id}>
                            <CardContent className="p-4">
                              <div className="flex items-start gap-4">
                                <Avatar>
                                  {review.userPhotoURL ? (
                                    <img src={review.userPhotoURL} alt={review.userName} />
                                  ) : (
                                    <div className="bg-primary text-primary-foreground w-full h-full flex items-center justify-center text-xl font-medium">
                                      {review.userName?.charAt(0)}
                                    </div>
                                  )}
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex justify-between">
                                    <h4 className="font-medium">{review.userName}</h4>
                                    <span className="text-sm text-gray-500">
                                      {review.createdAt instanceof Date 
                                        ? review.createdAt.toLocaleDateString()
                                        : new Date(review.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <div className="flex mt-1">
                                    {Array(5).fill(0).map((_, i) => (
                                      <Star 
                                        key={i} 
                                        className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} 
                                      />
                                    ))}
                                  </div>
                                  <p className="mt-2 text-gray-700">{review.comment}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Add review form */}
                  {currentUser && currentUser.uid !== listing.sellerId && (
                    <div className="mt-8">
                      <ReviewForm 
                        listingId={listing.id} 
                        listingTitle={listing.title} 
                        onReviewSubmitted={handleReviewSubmitted}
                      />
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-1/3 space-y-6">
            {/* Purchase Card */}
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="text-3xl font-bold">${listing.price}</div>
                
                <Button 
                  className="w-full mt-4" 
                  onClick={handlePurchase}
                  disabled={isPurchasing || (currentUser?.uid === listing.sellerId)}
                >
                  {isPurchasing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : currentUser?.uid === listing.sellerId ? (
                    "You own this listing"
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Purchase Now
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full mt-3"
                  onClick={handleContactSeller}
                  disabled={currentUser?.uid === listing.sellerId}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Contact Seller
                </Button>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      {listing.sellerPhotoURL ? (
                        <img src={listing.sellerPhotoURL} alt={listing.sellerName} />
                      ) : (
                        <div className="bg-primary text-primary-foreground w-full h-full flex items-center justify-center text-xl font-medium">
                          {listing.sellerName?.charAt(0)}
                        </div>
                      )}
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{listing.sellerName}</h4>
                      <Link to={`/profile/${listing.sellerId}`} className="text-primary text-sm hover:underline">
                        View Profile
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ListingDetail;
