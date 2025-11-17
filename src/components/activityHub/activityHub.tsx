import React, { useState } from "react";

const categories = [
  "Gym",
  "Basketball Coaching",
  "Football Coaching",
  "Boxing",
  "Swimming",
  "Yoga",
  "Zumba",
  "Dance",
];

export default function ActivityHub() {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleCategory = (category: string) => {
    setSelected((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="w-full min-h-screen p-6 bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Activity Hub</h1>
      </div>

      {/* Filter Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Filter Activities</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className={`px-4 py-2 rounded-2xl border text-sm font-medium transition-all shadow-sm hover:shadow-md
              ${
                selected.includes(cat)
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300"
              }
              `}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Selected Activities</h2>
        {selected.length === 0 ? (
          <p className="text-gray-500">No activities selected.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selected.map((item) => (
              <span
                key={item}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-2xl shadow"
              >
                {item}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
