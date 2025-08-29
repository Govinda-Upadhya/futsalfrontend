import React from "react";

interface ChallengeCardProps {
  teamName: string;
  teamImage: string;
  availability: string;
  playersCount: number;
  sport: string;
  email: string; // NEW
  description: string;
  onAccept: () => void;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({
  teamName,
  teamImage,
  availability,
  playersCount,
  sport,
  email,
  onAccept,
  description,
}) => {
  const getSportColor = (sport: string) => {
    const colors = {
      Football: "bg-green-100 text-green-800",
      Basketball: "bg-orange-100 text-orange-800",
      Cricket: "bg-blue-100 text-blue-800",
      Tennis: "bg-purple-100 text-purple-800",
      Badminton: "bg-red-100 text-red-800",
    };
    return colors[sport as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex flex-col">
      {/* Team Image */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={teamImage}
          alt={teamName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getSportColor(
              sport
            )}`}
          >
            {sport}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{teamName}</h3>

          <p className="text-gray-600 text-sm mb-1">
            Available: <span className="font-medium">{availability}</span>
          </p>
          <p className="text-gray-600 text-sm mb-1">
            Players: <span className="font-medium">{playersCount}</span>
          </p>
          <p className="text-gray-600 text-sm mb-2">
            Email: <span className="font-medium">{email}</span>
          </p>
        </div>

        {/* Accept Button */}
        <div className="flex justify-center mt-4">
          <button
            onClick={onAccept}
            className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-lg font-semibold hover:from-emerald-700 hover:to-emerald-600 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Accept Challenge
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChallengeCard;
