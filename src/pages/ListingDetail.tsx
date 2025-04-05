
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Calendar, 
  Download, 
  MessageSquare, 
  Star, 
  Clock, 
  ShoppingCart,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

// Mock listing data
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

// Mock reviews
const mockReviews = [
  {
    id: "r1",
    userId: "user456",
    rating: 5,
    comment: "Incredibly helpful tutorial! The explanations are clear and the code examples are practical. I especially appreciated the section on performance optimization with useCallback and useMemo.",
    userName: "Emma Wilson",
    userPhotoURL: "https://gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=200",
    createdAt: new Date("2023-03-10"),
  },
  {
    id: "r2",
    userId: "user789",
    rating: 4,
    comment: "Great content and well-structured. The project walkthrough helped me understand how to apply the concepts in a real-world scenario. Would have liked a bit more on testing React components with hooks.",
    userName: "Michael Brown",
    userPhotoURL: "https://gravatar.com/avatar/bc8e466a378e5f37c1b745d51581c3dc?s=200",
    createdAt: new Date("2023-02-28"),
  },
  {
    id: "r3",
    userId: "user101",
    rating: 5,
    comment: "This saved me so much time! I was struggling with context and useReducer, but this tutorial made everything click. Highly recommended for anyone building complex React apps.",
    userName: "Sarah Chen",
    userPhotoURL: "https://gravatar.com/avatar/5ebc9eec6577053048e7e9cffcb849e3?s=200",
    createdAt: new Date("2023-01-22"),
  },
];

const ListingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  
  // In a real app, we would fetch the listing based on the id
  const listing = mockListing; // Assuming this is the listing with the given id

  const handlePurchase = () => {
    setIsPurchasing(true);
    // In a real app, redirect to Stripe Checkout
    setTimeout(() => {
      toast.success("Taking you to checkout...");
      // Redirect to a mock checkout page
      setIsPurchasing(false);
    }, 1000);
  };

  const handleContactSeller = () => {
    toast.success("Message request sent to seller!");
  };

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
                  <span className="font-medium">{listing.averageRating}</span>
                  <span className="text-gray-500 text-sm ml-1">({listing.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="text-sm">
                    Listed on {listing.createdAt.toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {listing.tags.map((tag) => (
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
                  Reviews ({mockReviews.length})
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
                  {mockReviews.length === 0 ? (
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
                            <div className="text-3xl font-bold">{listing.averageRating}</div>
                            <div className="flex mt-1">
                              {Array(5).fill(0).map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-4 w-4 ${i < Math.round(listing.averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} 
                                />
                              ))}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              {listing.reviewCount} reviews
                            </div>
                          </div>
                          <div className="flex-1 space-y-2">
                            {[5, 4, 3, 2, 1].map((rating) => {
                              const count = mockReviews.filter(r => r.rating === rating).length;
                              const percentage = (count / mockReviews.length) * 100;
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
                        {mockReviews.map((review) => (
                          <Card key={review.id}>
                            <CardContent className="p-4">
                              <div className="flex items-start gap-4">
                                <Avatar>
                                  <img src={review.userPhotoURL} alt={review.userName} />
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex justify-between">
                                    <h4 className="font-medium">{review.userName}</h4>
                                    <span className="text-sm text-gray-500">
                                      {review.createdAt.toLocaleDateString()}
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
                  disabled={isPurchasing}
                >
                  {isPurchasing ? (
                    "Processing..."
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
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Contact Seller
                </Button>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <img src={listing.sellerPhotoURL} alt={listing.sellerName} />
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
