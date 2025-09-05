import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { base_url, upload_base_url } from "../../types/ground";

const Adminsignup = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    console.log(data);
    const file = data.profile[0];
    if (!file) return alert("Please select a file");
    const usermail = data.email.split("@")[0];
    try {
      // 1. Get presigned URL from backend
      const res = await axios.post(`${base_url}/admin/getpresignedurl/signup`, {
        fileName: file.name,
        fileType: file.type,
      });
      const { url, imageUrl } = res.data;
      console.log("Presigned URL:", url, "Image URL:", imageUrl);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("usermail", usermail);

      const imagepath: { url: string; message: string } = await axios.post(
        `${upload_base_url}/admin/signup/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // 3. Save signup data
      const signupData = {
        name: data.name,
        email: data.email,
        contact: data.contact,
        password: data.password,
        profile: imagepath.url,
      };

      const saveRes = await axios.post(`${base_url}/admin/signup`, signupData, {
        withCredentials: true,
      });

      if (saveRes.status === 200) {
        navigate("/admin/signin");
      } else {
        alert("Signup failed");
      }
    } catch (err) {
      console.error("Error during signup:", err);
      alert(err.response.data.msg);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-2 sm:p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-4 sm:p-8 rounded-2xl shadow-lg w-full max-w-lg border border-gray-200"
      >
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center mb-6 text-gray-800">
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
            {...register("contact", {
              required: "Contact is required",
              pattern: {
                value: /^(77|17)[0-9]{6}$/, // starts with 77 or 17, followed by 6 digits, no letters allowed
                message:
                  "Contact must start with 77 or 17, contain 8 digits, and no letters",
              },
            })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Enter your 8-digit contact number"
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
          className={`w-full py-3 text-white font-semibold rounded-lg shadow-md transition duration-300 ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default Adminsignup;
