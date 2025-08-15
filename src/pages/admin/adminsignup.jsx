import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";

const Adminsignup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    console.log(data);
    const file = data.profile[0];
    if (!file) return alert("Please select a file");

    // 1. Get presigned URL from backend
    const res = await axios.post(
      "http://localhost:3001/admin/getpresignedurl/signup",
      {
        fileName: file.name,
        fileType: file.type,
      }
    );
    console.log(res.data);
    const { url, imageUrl } = await res.data;

    // 2. Upload file directly to S3
    let Upload = await axios.put(url, file, {
      headers: {
        "Content-Type": file.type,
      },
    });
    console.log(Upload.response);

    const signupData = {
      name: data.name,
      email: data.email,
      contact: data.contact,
      password: data.password,
      profile: imageUrl,
    };

    // send to your backend API that stores in MongoDB
    const saveRes = await axios.post("http://localhost:3001/admin/signup", {
      signupData,
    });

    const result = await saveRes.data;
    console.log("Signup result:", result);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg border border-gray-200"
      >
        <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-800">
          Admin Signup
        </h2>

        {/* Name */}
        <div className="mb-5">
          <label className="block text-gray-700 font-medium mb-1">Name</label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Enter your full name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Profile Upload */}
        <div className="mb-5">
          <label className="block text-gray-700 font-medium mb-1">
            Profile Picture
          </label>
          <input
            type="file"
            accept="image/*"
            {...register("profile", {
              required: "Profile picture is required",
            })}
            className="w-full px-3 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          {errors.profile && (
            <p className="text-red-500 text-sm mt-1">
              {errors.profile.message}
            </p>
          )}
        </div>

        {/* Contact */}
        <div className="mb-5">
          <label className="block text-gray-700 font-medium mb-1">
            Contact
          </label>
          <input
            type="text"
            {...register("contact", { required: "Contact is required" })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Enter your contact number"
          />
          {errors.contact && (
            <p className="text-red-500 text-sm mt-1">
              {errors.contact.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Minimum 6 characters" },
            })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Enter a strong password"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-purple-600 transition duration-300"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Adminsignup;
