import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Calendar } from "lucide-react";
import { base_url } from "../../types/ground";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface ChallengeFormData {
  teamName: string;
  teamImage: FileList | null; // File upload
  email: string;
  members: number;
  sport: string;
  availability: { date: string; start: string; end: string }[];
}

interface AddChallengeFormProps {
  onSubmit: (formData: FormData) => void; // send FormData
}

const AddChallengeForm: React.FC<AddChallengeFormProps> = ({ onSubmit }) => {
  const navigate = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChallengeFormData>({
    defaultValues: {
      teamName: "",
      teamImage: null,
      email: "",
      members: 6,
      sport: "",
      availability: [
        {
          date: new Date().toISOString().split("T")[0],
          start: "14:00",
          end: "16:00",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "availability",
  });

  const submitHandler = async (data: ChallengeFormData) => {
    const photo = data.teamImage[0];
    const newData = {
      availability: JSON.stringify(data.availability),
      teamName: data.teamName,
      email: data.email,
      memebers: data.members,
      sport: data.sport,
    };

    const res = await axios.post(
      `${base_url}/admin/createground/uploadpic`,
      { fileType: photo.type, fileName: photo.name },
      { withCredentials: true }
    );

    await axios.put(res.data.url, photo, {
      headers: {
        "Content-Type": photo.type,
      },
    });
    const addChallenge = await axios.post(`${base_url}/users/createChallenge`, {
      newData,
      imageUrl: res.data.imageUrl,
    });
    if (addChallenge.status == 200) {
      alert("challenge made");
      navigate("/");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="bg-white p-6 rounded-xl shadow-md max-w-lg mx-auto space-y-4"
      encType="multipart/form-data"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Add Challenge</h2>

      {/* Team Name */}
      <div>
        <label className="block font-medium mb-1">Team Name</label>
        <input
          type="text"
          {...register("teamName", { required: "Team name is required" })}
          className="w-full border rounded p-2"
        />
        {errors.teamName && (
          <p className="text-red-500 text-sm">{errors.teamName.message}</p>
        )}
      </div>

      {/* Team Image */}
      <div>
        <label className="block font-medium mb-1">Team Image</label>
        <input
          type="file"
          accept="image/*"
          {...register("teamImage", { required: "Team image is required" })}
          className="w-full border rounded p-2"
        />
        {errors.teamImage && (
          <p className="text-red-500 text-sm">{errors.teamImage.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block font-medium mb-1">Email</label>
        <input
          type="email"
          {...register("email", { required: "Email is required" })}
          className="w-full border rounded p-2"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      {/* Members */}
      <div>
        <label className="block font-medium mb-1">Members</label>
        <input
          type="number"
          {...register("members", {
            required: "Members count is required",
            min: 1,
          })}
          className="w-full border rounded p-2"
        />
        {errors.members && (
          <p className="text-red-500 text-sm">{errors.members.message}</p>
        )}
      </div>

      {/* Sport */}
      <div>
        <label className="block font-medium mb-1">Sport</label>
        <select
          {...register("sport", { required: "Sport is required" })}
          className="w-full border rounded p-2"
        >
          <option value="Football">Football</option>
          <option value="Basketball">Basketball</option>
          <option value="Cricket">Cricket</option>
          <option value="Tennis">Tennis</option>
          <option value="Badminton">Badminton</option>
        </select>
        {errors.sport && (
          <p className="text-red-500 text-sm">{errors.sport.message}</p>
        )}
      </div>

      {/* Availability */}
      <div>
        <label className="block font-medium mb-2">Availability</label>
        {fields.map((field, index) => (
          <div key={field.id} className="mb-4 border p-3 rounded-lg space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="h-4 w-4 inline mr-1" />
                Select Date
              </label>
              <input
                type="date"
                {...register(`availability.${index}.date`, {
                  required: "Date is required",
                })}
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 items-end w-full">
              <input
                type="text"
                placeholder="Start HH:mm"
                {...register(`availability.${index}.start`, {
                  required: "Start time required",
                  pattern: {
                    value: /^([01]\d|2[0-3]):([0-5]\d)$/,
                    message: "Invalid time (HH:mm)",
                  },
                })}
                className="border rounded p-2 flex-1 w-[50%]"
              />
              <input
                type="text"
                placeholder="End HH:mm"
                {...register(`availability.${index}.end`, {
                  required: "End time required",
                  pattern: {
                    value: /^([01]\d|2[0-3]):([0-5]\d)$/,
                    message: "Invalid time (HH:mm)",
                  },
                })}
                className="border rounded p-2 flex-1 w-[50%]"
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="bg-red-500 text-white px-3 py-2 rounded mt-2 sm:mt-0"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            append({
              date: new Date().toISOString().split("T")[0],
              start: "",
              end: "",
            })
          }
          className="mt-2 bg-gray-200 px-3 py-1 rounded"
        >
          + Add more Availability
        </button>
      </div>

      <button
        disabled={isSubmitting ? true : false}
        type="submit"
        className="w-full bg-emerald-600 text-white py-2 rounded-lg font-semibold hover:bg-emerald-700 transition disabled:bg-gray-300 disabled:cursor-none"
      >
        Add Challenge
      </button>
    </form>
  );
};

export default AddChallengeForm;
