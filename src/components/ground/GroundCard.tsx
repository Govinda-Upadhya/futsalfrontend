import React, { useState } from "react";
import {
  MapPin,
  Users,
  Star,
  Clock,
  Calendar,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  Heart,
  Share2,
  Map,
} from "lucide-react";
import { type Ground } from "../../types/ground.ts";

interface GroundCardProps {
  ground: Ground;
  onBook: (groundId: string) => void;
}

const GroundCard: React.FC<GroundCardProps> = ({ ground, onBook }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const getSportColor = (type: string) => {
    const colors = {
      Football: "bg-green-600 text-white",
      Basketball: "bg-orange-500 text-white",
      Tennis: "bg-blue-500 text-white",
      Badminton: "bg-red-500 text-white",
      Cricket: "bg-amber-600 text-white",
      TableTennis: "bg-purple-500 text-white",
      Volleyball: "bg-teal-500 text-white",
      Rugby: "bg-pink-500 text-white",
      Hockey: "bg-slate-600 text-white",
      Baseball: "bg-amber-700 text-white",
      Golf: "bg-emerald-600 text-white",
      Swimming: "bg-cyan-500 text-white",
    };
    return colors[type as keyof typeof colors] || "bg-green-700 text-white";
  };

  const getSportIcon = (type: string) => {
    const icons = {
      Football: "⚽",
      Basketball: "🏀",
      Tennis: "🎾",
      Badminton: "🏸",
      Cricket: "🏏",
      TableTennis: "🏓",
      Volleyball: "🏐",
      Rugby: "🏉",
      Hockey: "🏑",
      Baseball: "⚾",
      Golf: "⛳",
      Swimming: "🏊",
    };
    return icons[type as keyof typeof icons] || "🏟️";
  };

  const handleCardClick = () => {
    onBook(ground._id);
  };

  const handleViewDetailsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowGallery(true);
  };

  const handleViewMapClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Open Google Maps with the ground's location
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      ground.location
    )}`;
    window.open(mapsUrl, "_blank");
  };

  const handleGalleryClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowGallery(false);
    setCurrentImageIndex(0);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === (ground.images?.length || 1) - 1 ? 0 : prev + 1
    );
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? (ground.images?.length || 1) - 1 : prev - 1
    );
  };

  const handleThumbnailClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setCurrentImageIndex(index);
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: ground.name,
        text: `Check out ${ground.name} sports ground!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const images =
    ground.images && ground.images.length > 0
      ? ground.images
      : ["/placeholder.jpg"];

  return (
    <>
      <div
        onClick={handleCardClick}
        className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border-2 border-green-100 cursor-pointer"
      >
        {/* Image with gallery controls */}
        <div className="relative h-52 overflow-hidden">
          <img
            src={images[currentImageIndex]}
            alt={ground.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Top left section - Sport type and rating */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {/* Sport type badge */}
            <span
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md ${getSportColor(
                ground.type
              )}`}
            >
              <span className="text-xs">{getSportIcon(ground.type)}</span>
              {ground.type}
            </span>

            {/* Rating badge - positioned below sport type */}
            <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 shadow-md w-fit border border-green-100">
              <Star className="h-3 w-3 text-yellow-400 fill-current" />
              <span className="text-xs font-bold text-gray-700">
                {ground.rating || 4.8}
              </span>
            </div>
          </div>

          {/* Top right section - Favorite, share, and map buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {/* Map button - now opens Google Maps directly */}
            <button
              onClick={handleViewMapClick}
              className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-green-50 transition-colors border border-green-100"
              title="View location on Google Maps"
            >
              <Map className="h-4 w-4 text-green-600" />
            </button>

            {/* Favorite button */}
            <button
              onClick={toggleFavorite}
              className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-red-50 transition-colors border border-green-100"
            >
              <Heart
                className={`h-4 w-4 ${
                  isFavorite ? "fill-red-500 text-red-500" : "text-green-600"
                }`}
              />
            </button>

            {/* Share button */}
            <button
              onClick={handleShare}
              className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-green-50 transition-colors border border-green-100"
            >
              <Share2 className="h-4 w-4 text-green-600" />
            </button>
          </div>

          {/* Image navigation dots */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1.5">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentImageIndex
                      ? "bg-green-500 scale-125"
                      : "bg-white/70 hover:bg-white"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Price badge - bottom right */}
          <div className="absolute bottom-3 right-3 bg-green-600 text-white rounded-lg px-3 py-1.5 shadow-md border border-green-700">
            <span className="text-xs font-bold">
              Nu. {ground.pricePerHour}/hr
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title and location */}
          <div className="mb-3">
            <h3 className="text-lg font-bold text-gray-900 mb-1.5 line-clamp-1 group-hover:text-green-700 transition-colors">
              {ground.name}
            </h3>

            <div className="flex items-center text-gray-600 text-sm">
              <MapPin className="h-4 w-4 mr-1.5 text-green-500" />
              <span className="truncate">{ground.location}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
            {ground.description ||
              "A well-maintained sports ground with excellent facilities."}
          </p>

          {/* Features */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {(ground.features || []).slice(0, 3).map((feature, index) => (
              <span
                key={index}
                className="px-2.5 py-1 bg-green-100 text-green-800 text-xs rounded-md font-medium border border-green-200"
              >
                {feature}
              </span>
            ))}
            {ground.features && ground.features.length > 3 && (
              <span className="px-2.5 py-1 bg-green-100 text-green-800 text-xs rounded-md font-medium border border-green-200">
                +{ground.features.length - 3}
              </span>
            )}
          </div>

          {/* Stats row */}
          <div className="flex items-center justify-between text-xs text-gray-600 mb-3 p-2.5 bg-green-50 rounded-lg border border-green-100">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1 text-green-600" />
              <span>{ground.capacity} players</span>
            </div>

            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1 text-green-600" />
              <span>Flexible timing</span>
            </div>

            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1 text-green-600" />
              <span>Available</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-green-100">
            <div className="flex gap-2">
              <button
                onClick={handleViewDetailsClick}
                className="text-sm text-green-700 hover:text-green-800 transition-colors flex items-center px-3 py-1.5 rounded-lg hover:bg-green-50 font-medium border border-green-200"
              >
                <Eye className="h-4 w-4 mr-1" />
                View Gallery
              </button>
            </div>

            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-md hover:shadow-lg border border-green-700">
              Book Now
            </button>
          </div>
        </div>

        {/* Hover effect */}
        <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-green-400 transition-all duration-300 pointer-events-none"></div>
      </div>

      {/* Gallery Modal */}
      {showGallery && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={handleGalleryClose}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={handleGalleryClose}
              className="absolute top-4 right-4 z-10 bg-green-600 hover:bg-green-700 text-white p-2 rounded-full transition-colors shadow-md"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Main image */}
            <div className="relative">
              <img
                src={images[currentImageIndex]}
                alt={ground.name}
                className="w-full h-[70vh] object-contain rounded-lg"
              />

              {/* Navigation arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-green-600 hover:bg-green-700 text-white p-2 rounded-full transition-colors shadow-md"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-green-600 hover:bg-green-700 text-white p-2 rounded-full transition-colors shadow-md"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-4 justify-center">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={(e) => handleThumbnailClick(e, index)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex
                        ? "border-green-400 scale-110"
                        : "border-transparent hover:border-white/50"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Image counter */}
            <div className="text-white text-center mt-4">
              Image {currentImageIndex + 1} of {images.length}
            </div>

            {/* Ground info in modal */}
            <div className="mt-4 p-4 bg-green-800/90 backdrop-blur-sm rounded-lg text-white">
              <h3 className="text-xl font-bold">{ground.name}</h3>
              <p className="text-white/80">{ground.location}</p>
              <div className="flex items-center mt-2">
                <span
                  className={`px-2 py-1 rounded-md text-xs font-medium ${getSportColor(
                    ground.type
                  )}`}
                >
                  {ground.type}
                </span>
                <div className="flex items-center ml-3">
                  <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                  <span>{ground.rating || 4.8}</span>
                </div>
                <div className="ml-3">
                  <span className="font-bold">Nu. {ground.pricePerHour}</span>
                  <span className="text-sm">/hr</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GroundCard;
