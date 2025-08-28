import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react"; // For + button
import { base_url } from "../../types/ground";

import SearchBar from "../../components/search/SearchBar";
import GroundCard from "../../components/ground/GroundCard";
import axios from "axios";
import { Ground } from "../../types/ground";
import ChallengeCard from "../../components/challenge/challengeCard";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchName, setSearchName] = useState("");
  const [searchType, setSearchType] = useState("");
  const [grounds, setGrounds] = useState<Ground[]>([]);
  const [activeTab, setActiveTab] = useState<"grounds" | "rivals">("grounds"); // NEW
  const [challenges, setChallenges] = useState<
    {
      teamName: string;
      teamImage: string;
      availability: [{ date: string; start: string; end: string }];
      memebers: number;
      sport: string;
      email: string;
    }[]
  >([]);
  function handleAccept(id: string) {
    navigate(`/acceptChallenge/${id}`);
  }
  useEffect(() => {
    async function fetchGrounds() {
      try {
        const res = await axios.get(`${base_url}/users/getgrounds`, {
          withCredentials: true,
        });
        setGrounds(res.data.ground);
      } catch (error) {
        console.error("Error fetching grounds:", error);
      }
    }
    async function fetchChallenges() {
      try {
        const res = await axios.get(`${base_url}/users/getChallenge`);
        setChallenges(res.data.challenges);
        console.log(res.data.challenges);
      } catch (error) {
        console.error("Error fetching grounds:", error);
      }
    }
    fetchGrounds();
    fetchChallenges();
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

  // --- New handler for rivals ---
  const handleAddChallenge = () => {
    navigate("/addChallenge");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section (unchanged) */}
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
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex justify-center gap-6 border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab("grounds")}
            className={`px-6 py-3 text-lg font-semibold ${
              activeTab === "grounds"
                ? "border-b-4 border-emerald-600 text-emerald-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Grounds
          </button>
          <button
            onClick={() => setActiveTab("rivals")}
            className={`px-6 py-3 text-lg font-semibold ${
              activeTab === "rivals"
                ? "border-b-4 border-emerald-600 text-emerald-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Challenges
          </button>
        </div>

        {/* Grounds Section */}
        {activeTab === "grounds" && (
          <>
            <div id="search-section" className="py-8">
              <SearchBar onSearch={handleSearch} className="mb-12" />

              {(searchName || searchType) && (
                <p className="text-gray-600 mb-6">
                  Found {filteredGrounds.length} ground
                  {filteredGrounds.length !== 1 ? "s" : ""}
                  {searchName && ` matching "${searchName}"`}
                  {searchType && ` in ${searchType}`}
                </p>
              )}
            </div>

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
              <div className="text-center py-12 text-gray-500">
                No grounds found matching your criteria. Try adjusting your
                search.
              </div>
            )}
          </>
        )}

        {/* Rivals Section */}
        {activeTab === "rivals" && (
          <div className="py-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Challenges</h2>
              <button
                onClick={handleAddChallenge}
                className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
              >
                <Plus size={20} />
                Add Challenge
              </button>
            </div>

            {challenges.length === 0 ? (
              <p className="text-gray-500">
                No challenges yet. Add one to get started!
              </p>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {challenges.map((challenge, index) => {
                    // Parse availability string if it's a string
                    let availabilityData = [];
                    if (typeof challenge.availability === "string") {
                      try {
                        availabilityData = JSON.parse(challenge.availability);
                      } catch (err) {
                        console.error("Invalid availability format", err);
                      }
                    } else {
                      availabilityData = challenge.availability;
                    }

                    // Format availability display
                    const availabilityText = availabilityData
                      .map(
                        (slot: any) =>
                          `${slot.date} | ${slot.start} - ${slot.end}`
                      )
                      .join(", ");

                    return (
                      <ChallengeCard
                        key={challenge._id || index}
                        teamName={challenge.teamName}
                        teamImage={challenge.teamImage}
                        availability={availabilityText}
                        playersCount={challenge.memebers || challenge.memebers}
                        sport={challenge.sport}
                        email={challenge.email}
                        onAccept={() => handleAccept(challenge._id)}
                      />
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
