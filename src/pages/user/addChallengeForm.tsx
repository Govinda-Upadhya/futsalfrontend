import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Calendar } from "lucide-react";
import { base_url } from "../../types/ground";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface ChallengeFormData {
  teamName: string;
  teamImage: FileList | null;
  email: string;
  members: string;
  contact: string;
  sport: string;
  availability: { date: string }[];
  description: string;
}

const AddChallengeForm: React.FC = () => {
  const navigate = useNavigate();
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChallengeFormData>({
    defaultValues: {
      teamName: "",
      teamImage: null,
      email: "",
      members: "6",
      contact: "",
      availability: [
        {
          date: new Date().toISOString().split("T")[0],
        },
      ],
      description: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "availability",
  });

  const submitHandler = async (data: ChallengeFormData) => {
    const photo = data.teamImage?.[0];
    console.log(data);
    if (!photo) return;

    const res = await axios.post(
      `${base_url}/admin/createground/uploadpic`,
      { fileType: photo.type, fileName: photo.name },
      { withCredentials: true }
    );

    await axios.put(res.data.url, photo, {
      headers: { "Content-Type": photo.type },
    });

    const addChallenge = await axios.post(`${base_url}/users/createChallenge`, {
      ...data,
      imageUrl: res.data.imageUrl,
    });

    if (addChallenge.status === 200) {
      alert("challenge made");
      navigate("/");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="bg-gray-200 p-6 rounded-3xl shadow-lg max-w-4xl mx-auto flex flex-col sm:flex-row gap-6 mt-10"
    >
      {/* Left side - Image Upload */}
      <div className="flex flex-col items-center w-full sm:w-1/3 relative ">
        <div className="w-40 h-40 rounded-full border-2 border-gray-400 flex items-center justify-center overflow-hidden bg-white relative">
          {preview ? (
            <img
              src={preview}
              alt="Team Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-400 text-sm">Upload</span>
          )}
          <input
            type="file"
            accept="image/*"
            {...register("teamImage", { required: "Team image is required" })}
            className="absolute top-0 left-0 w-40 h-40 opacity-0 cursor-pointer bg-white"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setPreview(URL.createObjectURL(e.target.files[0]));
              }
            }}
          />
        </div>
        <p className="mt-2 text-gray-600 text-sm ">Upload your team image</p>
        {errors.teamImage && (
          <p className="text-red-500 text-xs">{errors.teamImage.message}</p>
        )}
      </div>

      {/* Right side - Inputs */}
      <div className="flex-1 space-y-3">
        <input
          type="text"
          placeholder="Team Name"
          {...register("teamName", { required: "Team name is required" })}
          className="w-full border rounded p-2 bg-white"
        />
        {errors.teamName && (
          <p className="text-red-500 text-xs">{errors.teamName.message}</p>
        )}

        <input
          type="email"
          placeholder="Email Address"
          {...register("email", { required: "Email is required" })}
          className="w-full border rounded p-2 bg-white"
        />
        {errors.email && (
          <p className="text-red-500 text-xs">{errors.email.message}</p>
        )}

        <input
          type="text"
          placeholder="Number of Players"
          {...register("members", { required: "Members required", min: 1 })}
          className="w-full border rounded p-2 bg-white"
        />
        {errors.members && (
          <p className="text-red-500 text-xs">{errors.members.message}</p>
        )}

        <div className="mb-5">
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
            className="w-full px-4 bg-white py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Enter your 8-digit contact number"
          />
          {errors.contact && (
            <p className="text-red-500 text-sm mt-1">
              {errors.contact.message}
            </p>
          )}
        </div>
        {errors.contact && (
          <p className="text-red-500 text-xs">{errors.contact.message}</p>
        )}
        {/* sports */}
        <select
          {...register("sport", { required: "Sport is required" })}
          className="w-full border rounded p-2 bg-white"
        >
          <option value="">Select Sport</option>
          <option value="Football">Football</option>
          <option value="Cricket">Cricket</option>
          <option value="Basketball">Basketball</option>
          <option value="Badminton">Badminton</option>
          <option value="Volleyball">Volleyball</option>
        </select>
        {errors.sport && (
          <p className="text-red-500 text-xs">{errors.sport.message}</p>
        )}
        {/* Availability */}
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="border p-3 rounded space-y-2 bg-white flex items-center justify-between"
          >
            <div className="flex-1">
              <label className="text-sm font-medium flex items-center mb-1">
                <Calendar className="h-4 w-4 mr-1" /> Date Availability
              </label>
              <input
                type="date"
                {...register(`availability.${index}.date`, {
                  required: "Date is required",
                })}
                min={new Date().toISOString().split("T")[0]}
                className="w-full border rounded p-2 "
              />
            </div>

            {/* Remove button only if more than 1 field */}
            {fields.length > 1 && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="ml-3 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition"
              >
                ✕
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={() =>
            append({
              date: new Date().toISOString().split("T")[0],
            })
          }
          className="bg-gray-300 px-3 py-1 rounded text-sm"
        >
          + Add More Availability
        </button>

        {/* Description */}
        <textarea
          placeholder="Tell something about when you will be available"
          {...register("description", { required: "Description required" })}
          className="w-full border rounded p-2 h-20 bg-white"
        />
        {errors.description && (
          <p className="text-red-500 text-xs">{errors.description.message}</p>
        )}

        <button
          disabled={isSubmitting}
          type="submit"
          className="w-full bg-gray-800 text-white py-2 rounded-lg font-semibold hover:bg-black transition disabled:bg-gray-400"
        >
          Add Challenge
        </button>
      </div>
    </form>
  );
};

export default AddChallengeForm;
