import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { base_url, Ground } from "../../types/ground";

import SearchBar from "../../components/search/SearchBar";
import GroundCard from "../../components/ground/GroundCard";
import axios from "axios";
import ChallengeCard from "../../components/challenge/challengeCard";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchDate, setSearchDate] = useState("");
  const [availableGroundIds, setAvailableGroundIds] = useState<string[]>([]);
  const [searchName, setSearchName] = useState("");
  const [searchType, setSearchType] = useState("");
  const [searchLocation, setSearchLocation] = useState(""); // NEW state
  const [grounds, setGrounds] = useState<Ground[]>([]);
  const [activeTab, setActiveTab] = useState<"grounds" | "rivals">("grounds");
  const [challenges, setChallenges] = useState<any[]>([]);
  const [challengeSearch, setChallengeSearch] = useState("");
  const [challengeDateSearch, setChallengeDateSearch] = useState("");

  function handleAccept(id: string) {
    navigate(`/acceptChallenge/${id}`);
  }

  useEffect(() => {
    async function getAvailable() {
      if (!searchDate) {
        setAvailableGroundIds([]);
        return;
      }
      try {
        const res = await axios.post(`${base_url}/users/searchDate`, {
          searchDate,
        });
        console.log("date", res.data.availableGroundIds);
        setAvailableGroundIds(res.data.availableGroundIds || []);
      } catch (err) {
        console.error("Error fetching available grounds:", err);
        setAvailableGroundIds([]);
      }
    }
    getAvailable();
  }, [searchDate]);

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
        console.log(res.data.challenges);
        setChallenges(res.data.challenges);
      } catch (error) {
        console.error("Error fetching challenges:", error);
      }
    }
    fetchGrounds();
    fetchChallenges();
  }, []);

  // ✅ Updated to include location
  const handleSearch = (
    name: string,
    type: string,
    date: string,
    location: string
  ) => {
    setSearchName(name);
    setSearchType(type);
    setSearchDate(date);
    setSearchLocation(location.trim());
  };

  const handleBookGround = (groundId: number) => {
    navigate(`/booking/${groundId}`);
  };

  // ✅ Updated filter logic
  const filteredGrounds = useMemo(() => {
    return grounds.filter((ground) => {
      const matchesName = ground.name
        .toLowerCase()
        .includes(searchName.toLowerCase());
      const matchesType =
        !searchType ||
        ground.type.trim().toLowerCase() === searchType.trim().toLowerCase();
      const matchesDate =
        !searchDate || availableGroundIds.includes(ground._id);
      const matchesLocation =
        !searchLocation ||
        ground.location?.toLowerCase().includes(searchLocation.toLowerCase());

      return matchesName && matchesType && matchesDate && matchesLocation;
    });
  }, [
    grounds,
    searchName,
    searchType,
    searchDate,
    searchLocation,
    availableGroundIds,
  ]);

  const handleAddChallenge = () => {
    navigate("/addChallenge");
  };

  const filteredChallenges = useMemo(() => {
    return challenges.filter((challenge) => {
      const query = challengeSearch.toLowerCase();
      const dateQuery = challengeDateSearch;

      let availabilityData: any[] = [];
      if (typeof challenge.availability === "string") {
        try {
          availabilityData = JSON.parse(challenge.availability);
        } catch {
          availabilityData = [];
        }
      } else {
        availabilityData = challenge.availability;
      }

      const matchesName = challenge.teamName?.toLowerCase().includes(query);
      const matchesEmail = challenge.email?.toLowerCase().includes(query);
      const matchesDescription = challenge.description
        ?.toLowerCase()
        .includes(query);
      const matchesSport = challenge.sport?.toLowerCase().includes(query);

      const textMatches =
        matchesName || matchesEmail || matchesDescription || matchesSport;

      const dateMatches =
        !dateQuery ||
        availabilityData.some((slot: any) => slot.date === dateQuery);

      return textMatches && dateMatches;
    });
  }, [challenges, challengeSearch, challengeDateSearch]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-[#1AA148] overflow-hidden text-white">
        <div className="absolute inset-0 bg-[#1AA148]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Book Your Perfect
              <span className="block">Sports Ground</span>
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Play Smarter – Book Your Ground Faster. ThangGO at your service 😉
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex justify-center gap-6 border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab("grounds")}
            className={`px-6 py-3 text-lg font-semibold transition ${
              activeTab === "grounds"
                ? "border-b-4 border-emerald-600 text-emerald-700"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Grounds
          </button>
          <button
            onClick={() => setActiveTab("rivals")}
            className={`px-6 py-3 text-lg font-semibold transition ${
              activeTab === "rivals"
                ? "border-b-4 border-emerald-600 text-emerald-700"
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
              {/* ✅ Pass searchLocation into SearchBar */}
              <SearchBar onSearch={handleSearch} className="mb-12" />

              {(searchName || searchType || searchLocation) && (
                <p className="text-gray-600 mb-6">
                  Found {filteredGrounds.length} ground
                  {filteredGrounds.length !== 1 ? "s" : ""}
                  {searchName && ` matching "${searchName}"`}
                  {searchType && ` in ${searchType}`}
                  {searchLocation && ` near "${searchLocation}"`}
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

            {filteredGrounds.length === 0 &&
              (searchName || searchType || searchLocation) && (
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
              <h2 className="text-2xl font-bold">Challenges</h2>
              <button
                onClick={handleAddChallenge}
                className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
              >
                <Plus size={20} />
                Add Challenge
              </button>
            </div>

            {/* Search Bar for Challenges */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Search by team name, email, or sport..."
                value={challengeSearch}
                onChange={(e) => setChallengeSearch(e.target.value)}
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <input
                type="date"
                value={challengeDateSearch}
                onChange={(e) => setChallengeDateSearch(e.target.value)}
                className="w-full sm:w-1/3 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {filteredChallenges.length === 0 ? (
              <p className="text-gray-500">
                No challenges found. Try a different search.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredChallenges.map((challenge, index) => {
                  let availabilityData: any[] = [];
                  if (typeof challenge.availability === "string") {
                    try {
                      availabilityData = JSON.parse(challenge.availability);
                    } catch {
                      availabilityData = [];
                    }
                  } else {
                    availabilityData = challenge.availability;
                  }

                  const availabilityText = availabilityData
                    .map((slot: any) => `${slot.date} ${challenge.description}`)
                    .join(", ");

                  return (
                    <ChallengeCard
                      key={challenge._id || index}
                      teamName={challenge.teamName}
                      teamImage={challenge.teamImage}
                      availability={availabilityText}
                      playersCount={challenge.members}
                      sport={challenge.sport}
                      email={challenge.email}
                      description={challenge.description}
                      onAccept={() => handleAccept(challenge._id!)}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
