import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { base_url } from "../../types/ground";
import { Navigate, useNavigate } from "react-router-dom";

type FormData = {
  email: string;
};

const ForgotPassword = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      const res = await axios.post(`${base_url}/admin/changePassword`, data);
      if (res.status == 200) {
        alert("email to reset password has been.");
        navigate("/");
      } else if (res.status == 404) {
        alert("please enter a valid email");
      }
    } catch (error) {}
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-2xl shadow-md w-80"
      >
        <h2 className="text-xl font-semibold mb-4 text-center">
          Forgot Password
        </h2>

        {/* Email Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <p className="text-sm text-gray-600 mb-2">
            Please enter your registered email address. We will send you a link
            to reset your password.
          </p>

          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-400"
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting ? true : false}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition disabled:bg-gray-400 disabled:cursor-none"
        >
          Send Reset Link
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
