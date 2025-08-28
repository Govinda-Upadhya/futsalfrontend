import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { base_url } from "../../types/ground";
import { Navigate, useNavigate, useParams } from "react-router-dom";

interface AcceptChallengeForm {
  name: string;
  email: string;
  phone: string;
}

const AcceptChallenge: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AcceptChallengeForm>();
  const params = useParams();
  const onSubmit = async (data: AcceptChallengeForm) => {
    let res = await axios.post(`${base_url}/users/acceptChallenge`, {
      data,
      id: params.id,
    });
    if (res.status == 200) {
      alert("subitted the request successfully");
      navigate("/");
    } else {
      alert("there was some error please try again");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-emerald-700 mb-6 text-center">
          Accept Challenge
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Your Name
            </label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              placeholder="Enter your name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email Address
            </label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address",
                },
              })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]{7,15}$/,
                  message: "Invalid phone number",
                },
              })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              placeholder="Enter your phone number"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting ? true : false}
            className="w-full disabled:bg-gray-400 disabled:cursor-crosshair bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition"
          >
            Send Request
          </button>
        </form>

        {/* Note */}
        <div className="mt-6 text-sm text-gray-600 text-center border-t pt-4">
          <p>
            <strong>Note:</strong> Once the request is sent, the challenge post
            will no longer be shown in the web app. The person who posted the
            challenge will contact you directly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AcceptChallenge;
