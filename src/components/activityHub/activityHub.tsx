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
  const [selected, setSelected] = useState<string>("");

  return (
    <div className="w-full min-h-screen p-6 bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Activity Hub</h1>
      </div>

      {/* Dropdown Filter */}
      <div className="mb-6 max-w-xs">
        <label className="block text-lg font-semibold mb-2">
          Select Activity
        </label>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
        >
          <option value="">-- Choose an activity --</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Selected Result */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Selected Activity</h2>
        {selected ? (
          <span className="px-4 py-2 bg-emerald-600 text-white rounded-2xl shadow text-sm">
            {selected}
          </span>
        ) : (
          <p className="text-gray-500">No activity selected.</p>
        )}
      </div>
    </div>
  );
}
