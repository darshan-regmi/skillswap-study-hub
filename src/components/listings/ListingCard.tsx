
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Listing } from "@/types";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";

interface ListingCardProps {
  listing: Listing;
}

const ListingCard = ({ listing }: ListingCardProps) => {
  return (
    <Link to={`/listings/${listing.id}`}>
      <Card className="overflow-hidden h-full hover:shadow-md transition-shadow duration-200">
        <div className="relative h-48 overflow-hidden">
          <img
            src={listing.imageURL || "/placeholder.svg"}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-medium">
            {listing.deliveryType === "instant" ? "Instant" : "Live Session"}
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <img
              src={listing.sellerPhotoURL || "/placeholder.svg"}
              alt={listing.sellerName}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm text-gray-600">{listing.sellerName}</span>
          </div>
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{listing.title}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {listing.description}
          </p>
          <div className="flex flex-wrap gap-1 mb-2">
            {listing.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="bg-primary-50 text-primary-700 text-xs px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
            {listing.tags.length > 3 && (
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                +{listing.tags.length - 3}
              </span>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex items-center justify-between border-t border-gray-100">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">
              {listing.averageRating?.toFixed(1) || "New"}
            </span>
            {listing.reviewCount && (
              <span className="text-xs text-gray-500">({listing.reviewCount})</span>
            )}
          </div>
          <div className="text-lg font-bold text-primary">${listing.price}</div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ListingCard;
