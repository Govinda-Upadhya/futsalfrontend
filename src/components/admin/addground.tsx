import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm, useFieldArray } from "react-hook-form";
import { base_url, upload_base_url } from "../../types/ground";
import {
  MapPin,
  Users,
  Star,
  Clock,
  Image as ImageIcon,
  Plus,
  X,
  Trash2,
} from "lucide-react";

// NOTE: This file shows an alternative approach to showing availability errors
// without using react-hook-form's `setError`. It keeps errors in local state
// (availabilityErrors) and does live re-validation using watch + useEffect.

const Addground = () => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      type: "Football",
      location: "",
      capacity: 0,
      pricePerHour: 0,
      rating: 4,
      features: [""],
      availability: [{ start: "", end: "" }],
      description: "",
      admin: "",
    },
  });

  const {
    fields: timeFields,
    append: addTime,
    remove: removeTime,
  } = useFieldArray({
    control,
    name: "availability",
  });

  const {
    fields: featureFields,
    append: addFeature,
    remove: removeFeature,
  } = useFieldArray({
    control,
    name: "features",
  });

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [activeTimePicker, setActiveTimePicker] = useState({
    index: null,
    type: null,
  });
  const [availabilityErrors, setAvailabilityErrors] = useState([]);

  const currentRating = watch("rating", 4);
  const availabilityWatch = watch("availability");

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      setImages((prev) => {
        const newFiles = [...prev];
        newFiles[index] = file;
        return newFiles;
      });

      setPreviews((prev) => {
        const newPreviews = [...prev];
        newPreviews[index] = URL.createObjectURL(file);
        return newPreviews;
      });
    }
  };

  const addImageField = () => {
    setImages((prev) => [...prev, null]);
    setPreviews((prev) => [...prev, null]);
  };

  const removeImageField = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleStarClick = (ratingValue) => {
    setValue("rating", ratingValue, { shouldValidate: true });
  };

  // Convert 24h time to 12h format
  const to12HourFormat = (time24) => {
    if (!time24) return "";

    const [hours, minutes] = time24.split(":");
    const h = parseInt(hours);
    const period = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;

    return `${h12}:${minutes} ${period}`;
  };

  // Convert 12h time to 24h format
  const to24HourFormat = (time12) => {
    if (!time12) return "";

    const [time, period] = time12.split(" ");
    let [hours, minutes] = time.split(":");

    let h = parseInt(hours);
    if (period === "PM" && h !== 12) h += 12;
    if (period === "AM" && h === 12) h = 0;

    return `${h.toString().padStart(2, "0")}:${minutes}`;
  };

  // Helper: validate availability slots and return per-slot errors
  const validateAvailability = (availabilityList = []) => {
    const errorsArr = availabilityList.map(() => ({
      start: null,
      end: null,
      message: null,
    }));
    let hasError = false;

    // normalize: ensure string values
    const normalized = availabilityList.map((s, idx) => ({
      start: (s && s.start) || "",
      end: (s && s.end) || "",
      idx,
    }));

    // 1) Start must be < End for each filled slot
    normalized.forEach((slot) => {
      if (slot.start && slot.end) {
        if (slot.start >= slot.end) {
          errorsArr[slot.idx].start = {
            message: "Start time must be earlier than End time",
          };
          hasError = true;
        }
      }
    });

    // 2) Check overlaps using only fully-filled slots but keep original indices
    const filled = normalized.filter((s) => s.start && s.end);
    const sorted = [...filled].sort((a, b) => a.start.localeCompare(b.start));

    for (let i = 1; i < sorted.length; i++) {
      const prev = sorted[i - 1];
      const curr = sorted[i];
      if (curr.start < prev.end) {
        // mark both slots as overlapping
        errorsArr[prev.idx].message = "Overlaps with another slot";
        errorsArr[curr.idx].message = "Overlaps with another slot";
        hasError = true;
      }
    }

    return { errorsArr, hasError };
  };

  // Live validate availability as user edits and show inline messages
  useEffect(() => {
    const { errorsArr, hasError } = validateAvailability(
      availabilityWatch || []
    );
    if (hasError) setAvailabilityErrors(errorsArr);
    else setAvailabilityErrors([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(availabilityWatch || [])]);

  // Time Picker Component
  const TimePicker = ({ value, onChange, name, index, type, error }) => {
    const [time, setTime] = useState(value ? to12HourFormat(value) : "");

    const generateTimeOptions = () => {
      const options = [];

      for (let h = 0; h < 24; h++) {
        for (let m = 0; m < 60; m += 30) {
          const time24 = `${h.toString().padStart(2, "0")}:${m
            .toString()
            .padStart(2, "0")}`;
          const timeString = `${h % 12 || 12}:${m
            .toString()
            .padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;

          options.push(
            <div
              key={time24}
              className={`p-2 hover:bg-green-100 cursor-pointer rounded ${
                value === time24 ? "bg-green-500 text-white" : ""
              }`}
              onClick={() => {
                setTime(timeString);
                onChange(time24);
                setActiveTimePicker({ index: null, type: null });
              }}
            >
              {timeString}
            </div>
          );
        }
      }

      return options;
    };

    const isActive =
      activeTimePicker.index === index && activeTimePicker.type === type;

    return (
      <div className="relative">
        <div className="flex items-center border border-gray-300 rounded-lg p-2 focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500 transition">
          <input
            type="text"
            value={time}
            onChange={(e) => {
              const newValue = e.target.value;
              setTime(newValue);
              onChange(to24HourFormat(newValue));
            }}
            onFocus={() => setActiveTimePicker({ index, type })}
            placeholder="HH:MM AM/PM"
            className="flex-1 outline-none"
            name={name}
          />
          <button
            type="button"
            onClick={() =>
              setActiveTimePicker(
                isActive ? { index: null, type: null } : { index, type }
              )
            }
            className="text-gray-400 hover:text-gray-600"
          >
            <Clock className="h-4 w-4" />
          </button>
        </div>

        {isActive && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {generateTimeOptions()}
          </div>
        )}

        {/* support either { message: '...' } or plain string */}
        {error && (
          <p className="text-red-500 text-xs mt-1">{error.message || error}</p>
        )}
      </div>
    );
  };

  const onSubmit = async (data) => {
    const { errorsArr, hasError } = validateAvailability(
      data.availability || []
    );
    if (hasError) {
      setAvailabilityErrors(errorsArr);
      // throw to reject the submit promise so react-hook-form resets isSubmitting
      throw new Error("Validation failed");
    }

    const submitData = { ...data, images };

    try {
      const formData = new FormData();
      submitData.images.forEach((img) => {
        if (img) formData.append("files", img);
      });

      const urls = await axios.post(
        `${upload_base_url}/admin/uploads`,
        formData,
        { withCredentials: true }
      );

      const sendtobackend = await axios.post(
        `${base_url}/admin/createground`,
        {
          name: submitData.name,
          type: submitData.type,
          location: submitData.location,
          pricePerHour: submitData.pricePerHour,
          rating: submitData.rating,
          features: submitData.features.filter((f) => f !== ""),
          capacity: submitData.capacity,
          availability: submitData.availability.filter((a) => a.start && a.end),
          description: submitData.description,
          image: urls.data.urls,
          admin: submitData.admin,
        },
        { withCredentials: true }
      );

      if (sendtobackend.status === 200) {
        reset();
        setImages([]);
        setPreviews([]);
        alert("Ground created successfully!");
        window.location.reload();
      } else {
        alert("Failed to create ground. Please check your information.");
      }
    } catch (error) {
      console.error("Error creating ground:", error);
      alert("An error occurred while creating the ground.");
    }
  };

  const getSportIcon = (type) => {
    const icons = {
      Football: "⚽",
      Basketball: "🏀",
      Tennis: "🎾",
      Badminton: "🏸",
      Cricket: "🏏",
      TableTennis: "🏓",
      Volleyball: "🏐",
      Rugby: "🏉",
      Hockey: "🏑",
      Baseball: "⚾",
      Golf: "⛳",
      Swimming: "🏊",
    };
    return icons[type] || "🏟️";
  };

  // Render star rating component (unchanged)
  const renderStarRating = () => {
    return (
      <div className="flex flex-col">
        <label className="block font-medium text-gray-700 mb-2">Rating</label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => {
            const fullStar = star <= currentRating;
            const halfStar =
              currentRating >= star - 0.5 && currentRating < star;

            return (
              <div key={star} className="relative">
                <button
                  type="button"
                  className={`transform transition-all duration-200 ${
                    fullStar ? "scale-110 text-yellow-400" : "text-gray-300"
                  }`}
                  onClick={() => handleStarClick(star)}
                >
                  <Star
                    className={`h-6 w-6 ${fullStar ? "fill-current" : ""}`}
                  />
                </button>

                <button
                  type="button"
                  className="absolute left-0 top-0 w-1/2 h-full overflow-hidden opacity-0"
                  onClick={() => handleStarClick(star - 0.5)}
                >
                  <span className="sr-only">Half star</span>
                </button>

                {halfStar && (
                  <div className="absolute left-0 top-0 w-1/2 h-full overflow-hidden">
                    <Star className="h-6 w-6 text-yellow-400 fill-current" />
                  </div>
                )}
              </div>
            );
          })}
          <span className="ml-2 text-sm font-medium text-gray-700">
            {currentRating} {currentRating === 1 ? "Star" : "Stars"}
          </span>
          <input type="hidden" {...register("rating")} />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Click left side of star for half rating
        </p>
      </div>
    );
  };

  return (
    <div className="max-w-4xl w-full mx-auto bg-white shadow-lg rounded-2xl overflow-hidden border border-green-100">
      <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-6 text-white">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <span className="bg-white/20 p-2 rounded-lg">🏟️</span>
          Add New Sports Ground
        </h2>
        <p className="text-green-100 mt-1">
          Fill in the details to list a new sports facility
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        {/* -- many unchanged fields omitted for brevity in the UI layout -- */}

        {/* Availability (only changed part shown in the UI uses availabilityErrors) */}
        <div className="bg-green-50 p-4 rounded-xl border border-green-100">
          <label className="block font-medium text-gray-700 mb-2">
            Availability Schedule
          </label>
          <p className="text-sm text-gray-500 mb-3">
            Add time slots when the ground is available (6:00 AM to 10:00 PM)
          </p>

          <div className="space-y-4">
            {timeFields.map((field, index) => (
              <div
                key={field.id}
                className="flex flex-col sm:flex-row items-start gap-3 p-3 bg-white rounded-lg border border-green-100"
              >
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time
                  </label>
                  <TimePicker
                    value={watch(`availability.${index}.start`)}
                    onChange={(value) =>
                      setValue(`availability.${index}.start`, value)
                    }
                    index={index}
                    type="start"
                    error={
                      availabilityErrors?.[index]?.start ||
                      availabilityErrors?.[index]?.message
                    }
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time
                  </label>
                  <TimePicker
                    value={watch(`availability.${index}.end`)}
                    onChange={(value) =>
                      setValue(`availability.${index}.end`, value)
                    }
                    index={index}
                    type="end"
                    error={
                      availabilityErrors?.[index]?.end ||
                      availabilityErrors?.[index]?.message
                    }
                  />
                </div>

                <button
                  type="button"
                  onClick={() => removeTime(index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg self-end mt-5"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => addTime({ start: "", end: "" })}
            className="mt-3 flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
          >
            <Plus className="h-4 w-4" /> Add Time Slot
          </button>
        </div>

        {/* Submit button (unchanged) */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-500 text-white py-3 rounded-xl font-medium hover:from-green-700 hover:to-emerald-600 transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Creating Ground...
            </span>
          ) : (
            "Create Ground Listing"
          )}
        </button>
      </form>
    </div>
  );
};

export default Addground;
