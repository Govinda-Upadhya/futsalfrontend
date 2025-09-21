import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface ConfirmationProps {
  redirectTo: string;
  message: string;
}

const Confirmation: React.FC<ConfirmationProps> = ({ redirectTo, message }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(redirectTo);
    }, 5000);
    return () => clearTimeout(timer);
  }, [redirectTo, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      {/* Circle with tick animation */}
      <motion.div
        className="flex items-center justify-center w-24 h-24 rounded-full bg-green-100 border-4 border-green-500"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={3}
          stroke="green"
          className="w-12 h-12"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </motion.svg>
      </motion.div>

      {/* Message */}
      <motion.p
        className="mt-6 text-xl font-semibold text-gray-800"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        {message}
      </motion.p>

      {/* Redirect note */}
      <motion.p
        className="mt-2 text-sm text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        Redirecting in 3 seconds...
      </motion.p>
    </div>
  );
};

export default Confirmation;
