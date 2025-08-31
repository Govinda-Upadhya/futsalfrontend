import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base_url } from "../../types/ground";
const Groundcard = ({ ground }) => {
  const navigate = useNavigate();

  // Function to handle the deletion of a ground
  const handleDelete = async (e) => {
    // Prevent the card's navigation event from firing
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this ground?")) {
      try {
        await axios.delete(`${base_url}/admin/deleteground/${ground._id}`, {
          withCredentials: true,
        });

        window.location.reload();
      } catch (error) {
        console.error("Error deleting ground:", error);
        alert("Failed to delete ground. Please try again.");
      }
    }
  };

  // Function to handle editing the ground
  const handleEdit = (e) => {
    // Prevent the card's navigation event from firing
    e.stopPropagation();
    navigate(`/admin/ground/${ground._id}`);
  };

  return (
    <div
      onClick={() => navigate(`/admin/ground/${ground._id}`)}
      className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform transform hover:scale-105 relative w-full max-w-xs mx-auto sm:max-w-full mb-4"
    >
      {/* Placeholder image for the futsal ground */}
      <img
        src={ground.image[0]}
        alt={ground.name}
        className="w-full h-40 sm:h-48 object-cover"
      />
      {/* Edit and Delete button container */}
  <div className="absolute top-2 right-2 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        {/* Edit button with pencil icon */}
        <button
          type="button"
          onClick={handleEdit}
          className="p-2 bg-blue-600 text-white rounded-full shadow-lg transition-transform transform hover:scale-110"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>

        {/* Delete button with trash icon */}
        <button
          type="button"
          onClick={handleDelete}
          className="p-2 bg-red-600 text-white rounded-full shadow-lg transition-transform transform hover:scale-110"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800">{ground.name}</h3>
        <p className="mt-2 text-sm text-gray-600">{ground.address}</p>
        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-green-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M5.5 12.5a.5.5 0 100 1h9a.5.5 0 100-1h-9z" />
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v6a1 1 0 102 0v-6z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-gray-700 font-medium">
              {ground.capacity} Players
            </span>
          </div>
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full ${
              ground.status === "Available"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {ground.status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Groundcard;
