
import Layout from "@/components/layout/Layout";
import ListingCard from "@/components/listings/ListingCard";
import { Button } from "@/components/ui/button";
import { Listing } from "@/types";
import { ArrowRight, BookOpen, Clock, Code, Users } from "lucide-react";
import { Link } from "react-router-dom";

// Mock data for now
const featuredListings: Listing[] = [
  {
    id: "1",
    title: "Introduction to React Hooks - Complete Guide",
    description: "Master React Hooks with practical examples and projects. Learn useState, useEffect, and custom hooks.",
    price: 24.99,
    deliveryType: "instant",
    tags: ["React", "JavaScript", "Frontend"],
    imageURL: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    sellerId: "user1",
    sellerName: "Alex Johnson",
    sellerPhotoURL: "https://randomuser.me/api/portraits/men/32.jpg",
    createdAt: new Date(),
    averageRating: 4.8,
    reviewCount: 24
  },
  {
    id: "2",
    title: "Calculus Tutoring - One-on-One Sessions",
    description: "Get help with Calculus I, II, or III. Personalized tutoring sessions to help you master derivatives, integrals, and more.",
    price: 35.00,
    deliveryType: "live",
    tags: ["Math", "Calculus", "Tutoring"],
    imageURL: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    sellerId: "user2",
    sellerName: "Maria Lopez",
    sellerPhotoURL: "https://randomuser.me/api/portraits/women/68.jpg",
    createdAt: new Date(),
    averageRating: 4.9,
    reviewCount: 32
  },
  {
    id: "3",
    title: "Python Data Analysis Project Starter Pack",
    description: "Complete data analysis project templates with Pandas, NumPy and Matplotlib. Ready-to-use Jupyter notebooks.",
    price: 19.99,
    deliveryType: "instant",
    tags: ["Python", "Data Science", "Projects"],
    imageURL: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    sellerId: "user3",
    sellerName: "David Chen",
    sellerPhotoURL: "https://randomuser.me/api/portraits/men/44.jpg",
    createdAt: new Date(),
    averageRating: 4.6,
    reviewCount: 18
  },
  {
    id: "4",
    title: "Essay Writing & Research Methodology",
    description: "Learn how to structure academic essays, conduct research and cite sources properly. Includes templates and examples.",
    price: 22.50,
    deliveryType: "instant",
    tags: ["Writing", "Research", "Academic"],
    imageURL: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    sellerId: "user4",
    sellerName: "Emma Wilson",
    sellerPhotoURL: "https://randomuser.me/api/portraits/women/32.jpg",
    createdAt: new Date(),
    averageRating: 4.7,
    reviewCount: 15
  }
];

const categories = [
  { 
    name: "Programming", 
    icon: <Code className="w-12 h-12 text-primary" />,
    description: "Coding tutorials, projects, and code reviews",
    count: 245
  },
  { 
    name: "Tutoring", 
    icon: <Users className="w-12 h-12 text-primary" />,
    description: "One-on-one help with difficult subjects",
    count: 189
  },
  { 
    name: "Course Materials", 
    icon: <BookOpen className="w-12 h-12 text-primary" />,
    description: "Study guides, notes, and practice exams",
    count: 316
  },
  { 
    name: "Quick Help", 
    icon: <Clock className="w-12 h-12 text-primary" />,
    description: "Fast assistance with assignments and problems",
    count: 142
  }
];

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-50 to-primary-100 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                Learn from peers.<br />
                <span className="text-primary">Earn by teaching.</span>
              </h1>
              <p className="text-xl text-gray-700 mb-8">
                The student marketplace for skills, knowledge, and academic help. 
                Buy courses, get tutoring, or sell what you know.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link to="/signup">Get Started</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/listings">Browse Skills</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7" 
                alt="Students collaborating"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How SkillSwap Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Find Skills & Expertise</h3>
              <p className="text-gray-600">
                Browse through our marketplace for study resources, tutoring, or code help.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect & Learn</h3>
              <p className="text-gray-600">
                Purchase instant downloads or schedule tutoring sessions with skilled peers.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Share Your Knowledge</h3>
              <p className="text-gray-600">
                Create your own listings to earn money by helping others with your expertise.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Popular Categories</h2>
            <Link to="/categories" className="text-primary flex items-center gap-1 hover:underline">
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-4">{category.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                <p className="text-gray-600 mb-3">{category.description}</p>
                <p className="text-sm text-gray-500">{category.count} listings</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Listings</h2>
            <Link to="/listings" className="text-primary flex items-center gap-1 hover:underline">
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to share your knowledge?
          </h2>
          <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of students who are earning while helping others succeed in their academic journey.
          </p>
          <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100" asChild>
            <Link to="/signup">Start Selling Today</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
