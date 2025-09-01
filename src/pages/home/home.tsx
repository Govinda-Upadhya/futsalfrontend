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
  const [searchDate, setSearchDate] = useState("");
  const [availableGroundIds, setAvailableGroundIds] = useState<string[]>([]);
  const [searchName, setSearchName] = useState("");
  const [searchType, setSearchType] = useState("");
  const [grounds, setGrounds] = useState<Ground[]>([]);
  const [activeTab, setActiveTab] = useState<"grounds" | "rivals">("grounds");
  const [challenges, setChallenges] = useState<
    {
      _id?: string;
      teamName: string;
      teamImage: string;
      availability: [{ date: string; start: string; end: string }] | string;
      members: string;
      sport: string;
      email: string;
      description: string;
    }[]
  >([]);

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
        // assuming API returns a list of ground IDs
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
        setChallenges(res.data.challenges);
      } catch (error) {
        console.error("Error fetching challenges:", error);
      }
    }
    fetchGrounds();
    fetchChallenges();
  }, []);

  const handleSearch = (name: string, type: string, date: string) => {
    setSearchName(name);
    setSearchType(type);
    setSearchDate(date);
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

      const matchesDate =
        !searchDate || availableGroundIds.includes(ground._id);

      return matchesName && matchesType && matchesDate;
    });
  }, [grounds, searchName, searchType, searchDate, availableGroundIds]);

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
      <div className="relative bg-gradient-to-br from-primary/20 via-background to-secondary/20 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Book Your Perfect
              <span className="block text-primary">Sports Ground</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
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
            className={`px-6 py-3 text-lg font-semibold transition ${
              activeTab === "grounds"
                ? "border-b-4 border-primary text-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Grounds
          </button>
          <button
            onClick={() => setActiveTab("rivals")}
            className={`px-6 py-3 text-lg font-semibold transition ${
              activeTab === "rivals"
                ? "border-b-4 border-primary text-primary"
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
              <h2 className="text-2xl font-bold text-foreground">Challenges</h2>
              <button
                onClick={handleAddChallenge}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition"
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
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="date"
                value={challengeDateSearch}
                onChange={(e) => setChallengeDateSearch(e.target.value)}
                className="w-full sm:w-1/3 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
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
                    .map(
                      (slot: any) =>
                        `${slot.date} (${slot.start} - ${slot.end})`
                    )
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
