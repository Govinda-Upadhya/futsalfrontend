import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Star, MapPin, Clock } from "lucide-react";
import { base_url } from "../../types/ground";

import SearchBar from "../../components/search/SearchBar";
import GroundCard from "../../components/ground/GroundCard";
import axios from "axios";
import { Ground } from "../../types/ground";

// Define base URL

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchName, setSearchName] = useState("");
  const [searchType, setSearchType] = useState("");
  const [grounds, setGrounds] = useState<Ground[]>([]);

  useEffect(() => {
    async function fetchGrounds() {
      try {
        const res = await axios.get(`${base_url}/users/getgrounds`, {
          withCredentials: true,
        });
        console.log(res.data.ground);
        setGrounds(res.data.ground);
      } catch (error) {
        console.error("Error fetching grounds:", error);
      }
    }
    fetchGrounds();
  }, []);

  const handleSearch = (name: string, type: string) => {
    setSearchName(name);
    setSearchType(type);
  };

  const handleBookGround = (groundId: number) => {
    navigate(`/booking/${groundId}`);
  };

  const filteredGrounds = useMemo(() => {
    return grounds.filter((ground) => {
      const matchesName = ground.name
        .toLowerCase()
        .includes(searchName.toLowerCase());
      const matchesType =
        !searchType ||
        ground.type.trim().toLowerCase() === searchType.trim().toLowerCase();

      return matchesName && matchesType;
    });
  }, [grounds, searchName, searchType]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Book Your Perfect
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                Sports Ground
              </span>
            </h1>
            <p className="text-xl text-emerald-100 mb-8 max-w-3xl mx-auto">
              Discover premium sports facilities across the city. From football
              fields to tennis courts, find and book your ideal playing ground
              with instant confirmation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() =>
                  document
                    .getElementById("search-section")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-8 py-4 rounded-xl font-semibold hover:from-yellow-300 hover:to-orange-300 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Find Grounds Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-12 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-emerald-600">50+</div>
              <div className="text-gray-600">Premium Grounds</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-600">10,000+</div>
              <div className="text-gray-600">Happy Bookings</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-600">4.8</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-600">24/7</div>
              <div className="text-gray-600">Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div
        id="search-section"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Find Your Ideal Ground
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Search through our extensive collection of sports facilities and
            book instantly
          </p>
        </div>

        <SearchBar onSearch={handleSearch} className="mb-12" />

        {/* Results Count */}
        {(searchName || searchType) && (
          <div className="mb-6">
            <p className="text-gray-600">
              Found {filteredGrounds.length} ground
              {filteredGrounds.length !== 1 ? "s" : ""}
              {searchName && ` matching "${searchName}"`}
              {searchType && ` in ${searchType}`}
            </p>
          </div>
        )}
      </div>

      {/* All Grounds / Search Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {!searchName && !searchType && (
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              All Available Grounds
            </h2>
            <p className="text-xl text-gray-600">
              Browse our complete collection of sports facilities
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredGrounds.map((ground) => (
            <GroundCard
              key={ground._id}
              ground={ground}
              onBook={() => handleBookGround(ground._id)}
            />
          ))}
        </div>

        {filteredGrounds.length === 0 && (searchName || searchType) && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              No grounds found matching your criteria. Try adjusting your
              search.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
