import axios from "axios";
import React, { useState } from "react";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { base_url } from "../../types/ground";

const FeedbackPage: React.FC = () => {
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a star rating before submitting.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${base_url}/users/feedback`, {
        rating,
        comment,
      });

      if (res.status === 200) {
        toast.success("Thank you for your feedback.");
        setRating(0);
        setComment("");
      } else {
        toast.error("Feedback couldn't be submitted.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          Feedback
        </h2>

        {/* ⭐ Star Rating */}
        <div className="flex justify-center mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className="focus:outline-none"
              disabled={loading}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill={star <= (hover || rating) ? "gold" : "none"}
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-8 h-8 text-yellow-500 transition-colors duration-200"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1
                     1 0 00.95.69h4.908c.969 0 1.371 1.24.588 1.81l-3.975
                     2.888a1 1 0 00-.364 1.118l1.518 4.674c.3.921-.755
                     1.688-1.54 1.118l-3.975-2.888a1 1 0 00-1.175 0l-3.975
                     2.888c-.784.57-1.838-.197-1.539-1.118l1.518-4.674a1
                     1 0 00-.364-1.118L2.083 10.1c-.783-.57-.38-1.81.588-1.81h4.908a1
                     1 0 00.95-.69l1.518-4.674z"
                />
              </svg>
            </button>
          ))}
        </div>

        {/* 📝 Comment Section */}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your feedback here..."
            className="border rounded-lg p-3 h-28 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            disabled={loading}
          />

          {/* ✅ Submit Button */}
          <button
            type="submit"
            disabled={rating === 0 || loading}
            className={`px-4 py-2 rounded-lg font-semibold text-white transition ${
              rating === 0 || loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-yellow-500 hover:bg-yellow-600"
            }`}
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      </div>

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </div>
  );
};

export default FeedbackPage;
