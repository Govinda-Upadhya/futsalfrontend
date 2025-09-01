import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { base_url } from "../../types/ground";

type FormValues = {
  name: string;
  email: string;
  message: string;
};

const ContactUs: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      await axios.post(`${base_url}/users/contactus`, data);
      alert("Message sent successfully!");
      reset();
    } catch (error) {
      alert("Failed to send message.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Contact Us</h1>
      <p className="text-lg text-gray-700 mb-8">
        Have questions or feedback? We'd love to hear from you. Fill out the
        form below and we'll get back to you as soon as possible.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Name</label>
          <input
            {...register("name", { required: "Name is required" })}
            type="text"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-primary ${
              errors.name ? "border-red-500" : ""
            }`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Email</label>
          <input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                message: "Invalid email address",
              },
            })}
            type="email"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-primary ${
              errors.email ? "border-red-500" : ""
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Message */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Message
          </label>
          <textarea
            {...register("message", { required: "Message is required" })}
            rows={4}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-primary ${
              errors.message ? "border-red-500" : ""
            }`}
          ></textarea>
          {errors.message && (
            <p className="text-red-500 text-sm mt-1">
              {errors.message.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary text-black px-6 py-2 rounded-lg shadow hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
};

export default ContactUs;
