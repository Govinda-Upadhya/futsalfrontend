import React, { useState } from "react";
import { Search, Calendar, Filter } from "lucide-react";

interface SearchBarProps {
  onSearch: (name: string, type: string) => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, className = "" }) => {
  const [searchName, setSearchName] = useState("");

  const [searchType, setSearchType] = useState("");

  const handleSearch = () => {
    onSearch(searchName, searchType);
  };

  const groundTypes = [
    "Football",
    "Cricket",
    "Basketball",
    "Tennis",
    "Badminton",
  ];

  return (
    <div className={`bg-white rounded-2xl shadow-lg p-6 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Name Search */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ground Name
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
            />
          </div>
        </div>

        {/* Type Filter */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ground Type
          </label>
          <div className="relative">
            <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors appearance-none"
            >
              <option value="">All Types</option>
              {groundTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Button */}
        <div className="flex flex-col justify-end">
          <button
            onClick={handleSearch}
            className="w-full bg-black text-white py-3 px-6 rounded-lg font-semibold hover:from-emerald-700 hover:to-emerald-600 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Search Grounds
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
