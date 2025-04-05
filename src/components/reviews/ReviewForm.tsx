
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { addReview } from "@/services/reviewService";
import { toast } from "sonner";

interface ReviewFormProps {
  listingId: string;
  listingTitle: string;
  onReviewSubmitted?: () => void;
}

const ReviewForm = ({ listingId, listingTitle, onReviewSubmitted }: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error("You must be logged in to leave a review");
      return;
    }
    
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    
    if (!comment.trim()) {
      toast.error("Please enter a comment");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await addReview(
        listingId,
        currentUser.uid,
        currentUser.displayName || "Anonymous",
        currentUser.photoURL || undefined,
        rating,
        comment.trim()
      );
      
      toast.success("Review submitted successfully");
      setRating(0);
      setComment("");
      
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Write a Review</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <p className="mb-2 text-sm font-medium">Rating</p>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  className="p-1"
                  onClick={() => setRating(value)}
                  onMouseEnter={() => setHoverRating(value)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  <Star 
                    className={`h-6 w-6 ${
                      (hoverRating ? value <= hoverRating : value <= rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`} 
                  />
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="review-comment" className="block mb-2 text-sm font-medium">
              Your Review
            </label>
            <Textarea
              id="review-comment"
              placeholder={`Tell others what you thought about ${listingTitle}...`}
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReviewForm;
