
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/layout/Layout";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart, Edit, MessageSquare, ShoppingBag, Star } from "lucide-react";
import { Link } from "react-router-dom";

// Mock user data
const user = {
  displayName: "Alex Johnson",
  email: "alex@example.com",
  photoURL: "https://gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50",
  bio: "Computer Science student at Stanford University. Passionate about web development and teaching others to code.",
  skills: ["JavaScript", "React", "Node.js", "Python"],
  averageRating: 4.8,
};

// Mock listings data
const myListings = [
  {
    id: "1",
    title: "Modern React with Hooks - Code Review & Mentoring",
    description: "I'll review your React code and provide personalized feedback.",
    price: 25,
    deliveryType: "live",
    createdAt: new Date("2023-01-15"),
    reviewCount: 12,
    averageRating: 4.9,
  },
  {
    id: "2",
    title: "Data Structures & Algorithms for Interviews",
    description: "Complete guide to ace technical interviews at FAANG companies.",
    price: 35,
    deliveryType: "instant",
    createdAt: new Date("2023-02-20"),
    reviewCount: 8,
    averageRating: 4.7,
  },
];

// Mock purchases data
const myPurchases = [
  {
    id: "101",
    title: "Advanced Python for Machine Learning",
    sellerName: "Emma Wilson",
    price: 30,
    purchaseDate: new Date("2023-03-05"),
    status: "completed",
  },
  {
    id: "102",
    title: "AWS Cloud Architecture Tutorial",
    sellerName: "Michael Brown",
    price: 45,
    purchaseDate: new Date("2023-04-10"),
    status: "pending",
  },
];

// Mock reviews data
const reviews = [
  {
    id: "r1",
    listingTitle: "Modern React with Hooks - Code Review & Mentoring",
    userName: "Sarah Lee",
    rating: 5,
    comment: "Alex was extremely thorough and helped me understand complex React concepts. Highly recommended!",
    createdAt: new Date("2023-02-15"),
  },
  {
    id: "r2",
    listingTitle: "Data Structures & Algorithms for Interviews",
    userName: "David Chen",
    rating: 4,
    comment: "Great content and explanations. The practice problems were very helpful for my interview prep.",
    createdAt: new Date("2023-03-22"),
  },
];

// Mock messages data
const conversations = [
  {
    id: "c1",
    with: "Sarah Lee",
    lastMessage: "Thanks for the session today! Your explanation of React hooks was super clear.",
    unread: 0,
    updatedAt: new Date("2023-03-28"),
    photoURL: "https://gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200",
  },
  {
    id: "c2",
    with: "David Chen",
    lastMessage: "Hi Alex, I have a question about the algorithm from yesterday's session.",
    unread: 2,
    updatedAt: new Date("2023-03-30"),
    photoURL: "https://gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=200",
  },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* User Profile Section */}
          <div className="w-full md:w-1/3 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 border-2 border-primary">
                    <img src={user.photoURL} alt={user.displayName} className="object-cover" />
                  </Avatar>
                  
                  <h2 className="mt-4 text-2xl font-bold">{user.displayName}</h2>
                  <p className="text-gray-500">{user.email}</p>
                  
                  <div className="mt-2 flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{user.averageRating}</span>
                    <span className="text-gray-500 text-sm">({reviews.length} reviews)</span>
                  </div>
                  
                  <p className="mt-4 text-gray-600">{user.bio}</p>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    {user.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  
                  <Button className="mt-6 w-full" variant="outline">
                    <Edit className="mr-2 h-4 w-4" /> Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Quick Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-gray-500 text-sm">Listings</p>
                    <p className="text-2xl font-bold">{myListings.length}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-gray-500 text-sm">Purchases</p>
                    <p className="text-2xl font-bold">{myPurchases.length}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-gray-500 text-sm">Reviews</p>
                    <p className="text-2xl font-bold">{reviews.length}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-gray-500 text-sm">Unread</p>
                    <p className="text-2xl font-bold">
                      {conversations.reduce((acc, conv) => acc + conv.unread, 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Tabs Section */}
          <div className="w-full md:w-2/3">
            <Tabs 
              defaultValue="listings" 
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="mb-6 grid grid-cols-4 w-full">
                <TabsTrigger value="listings">
                  <BarChart className="h-4 w-4 mr-2" /> Listings
                </TabsTrigger>
                <TabsTrigger value="purchases">
                  <ShoppingBag className="h-4 w-4 mr-2" /> Purchases
                </TabsTrigger>
                <TabsTrigger value="reviews">
                  <Star className="h-4 w-4 mr-2" /> Reviews
                </TabsTrigger>
                <TabsTrigger value="messages">
                  <MessageSquare className="h-4 w-4 mr-2" /> Messages
                </TabsTrigger>
              </TabsList>
              
              {/* My Listings Tab */}
              <TabsContent value="listings" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold">My Listings</h3>
                  <Button asChild>
                    <Link to="/create-listing">Create New Listing</Link>
                  </Button>
                </div>
                
                {myListings.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-gray-500 mb-4">You haven't created any listings yet.</p>
                      <Button asChild>
                        <Link to="/create-listing">Create Your First Listing</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {myListings.map((listing) => (
                      <Card key={listing.id}>
                        <CardContent className="p-4">
                          <div className="flex flex-col sm:flex-row justify-between gap-4">
                            <div>
                              <h4 className="font-semibold">{listing.title}</h4>
                              <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                                {listing.description}
                              </p>
                              <div className="flex items-center gap-4 mt-2">
                                <span className="text-primary font-medium">${listing.price}</span>
                                <Badge variant={listing.deliveryType === "instant" ? "secondary" : "outline"}>
                                  {listing.deliveryType === "instant" ? "Download" : "Live Session"}
                                </Badge>
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  <span className="text-sm">{listing.averageRating}</span>
                                  <span className="text-xs text-gray-500">({listing.reviewCount})</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2 sm:flex-col">
                              <Button variant="outline" size="sm" asChild>
                                <Link to={`/listings/${listing.id}`}>View</Link>
                              </Button>
                              <Button variant="outline" size="sm" asChild>
                                <Link to={`/edit-listing/${listing.id}`}>Edit</Link>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              {/* My Purchases Tab */}
              <TabsContent value="purchases" className="space-y-6">
                <h3 className="text-xl font-bold">My Purchases</h3>
                
                {myPurchases.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-gray-500 mb-4">You haven't purchased any listings yet.</p>
                      <Button asChild>
                        <Link to="/listings">Browse Listings</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {myPurchases.map((purchase) => (
                      <Card key={purchase.id}>
                        <CardContent className="p-4">
                          <div className="flex flex-col sm:flex-row justify-between gap-4">
                            <div>
                              <h4 className="font-semibold">{purchase.title}</h4>
                              <p className="text-sm text-gray-500 mt-1">
                                Purchased from {purchase.sellerName} on {purchase.purchaseDate.toLocaleDateString()}
                              </p>
                              <div className="flex items-center gap-4 mt-2">
                                <span className="text-primary font-medium">${purchase.price}</span>
                                <Badge 
                                  variant={purchase.status === "completed" ? "secondary" : "outline"}
                                >
                                  {purchase.status === "completed" ? "Completed" : "Pending"}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex gap-2 sm:flex-col">
                              <Button variant="outline" size="sm" asChild>
                                <Link to={`/orders/${purchase.id}`}>Details</Link>
                              </Button>
                              {purchase.status === "completed" && (
                                <Button variant="outline" size="sm">
                                  Leave Review
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              {/* Reviews Tab */}
              <TabsContent value="reviews" className="space-y-6">
                <h3 className="text-xl font-bold">Reviews</h3>
                
                {reviews.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-gray-500">You haven't received any reviews yet.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <Card key={review.id}>
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <h4 className="font-semibold">{review.listingTitle}</h4>
                              <div className="flex">
                                {Array(5).fill(0).map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} 
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-gray-500">
                              From {review.userName} on {review.createdAt.toLocaleDateString()}
                            </p>
                            <p className="text-sm mt-2">{review.comment}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              {/* Messages Tab */}
              <TabsContent value="messages" className="space-y-6">
                <h3 className="text-xl font-bold">Messages</h3>
                
                {conversations.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-gray-500">You don't have any conversations yet.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {conversations.map((conversation) => (
                      <Card key={conversation.id}>
                        <CardContent className="p-4">
                          <Link to={`/messages/${conversation.id}`} className="flex items-center gap-4">
                            <Avatar>
                              <img src={conversation.photoURL} alt={conversation.with} />
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <h4 className="font-semibold">{conversation.with}</h4>
                                <span className="text-xs text-gray-500">
                                  {conversation.updatedAt.toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 line-clamp-1">
                                {conversation.lastMessage}
                              </p>
                            </div>
                            {conversation.unread > 0 && (
                              <Badge>{conversation.unread}</Badge>
                            )}
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
