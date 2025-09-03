import React from "react";
import { MapPin, Star, Clock, Users } from "lucide-react";
import { Ground } from "../../types/ground";

interface GroundCardProps {
  ground: Ground;
  onBook: (groundId: number) => void;
}

const GroundCard: React.FC<GroundCardProps> = ({ ground, onBook }) => {
  const getTypeColor = (type: string) => {
    const colors = {
      Football: "bg-green-100 text-green-800",
      Cricket: "bg-blue-100 text-blue-800",
      Basketball: "bg-orange-100 text-orange-800",
      Tennis: "bg-purple-100 text-purple-800",
      Badminton: "bg-red-100 text-red-800",
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group mb-4">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={ground.image[0]}
          alt={ground.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <span
            className={`px-3 py-1 rounded-full  text-sm font-medium text-black bg-white`}
          >
            {ground.type}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{ground.name}</h3>

        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{ground.location}</span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {ground.description}
        </p>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-4">
          {ground.features.slice(0, 3).map((feature, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
            >
              {feature}
            </span>
          ))}
          {ground.features.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
              +{ground.features.length - 3} more
            </span>
          )}
        </div>

        {/* Available Hours */}
        <div className="flex items-center text-gray-600 mb-4">
          <span className="text-sm">{ground.capacity} players</span>
        </div>

        {/* Price and Book Button */}
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold  text-green-700">
            Nu.{ground.pricePerHour}
            <span className="text-sm text-green-700 font-normal">/hour</span>
          </div>
          <button
            onClick={() => onBook(ground._id)}
            className="  bg-[#1AA148] text-white px-6 py-2 rounded-lg font-semibold  transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroundCard;
