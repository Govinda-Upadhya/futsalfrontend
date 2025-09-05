import axios from "axios";
import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { base_url, upload_base_url } from "../../types/ground";
// Base URL for API

const Groundetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [removedImage, setRemovedImage] = useState([]);
  const {
    register,
    control,
    handleSubmit,
    reset,
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
  const [existingImages, setExistingImages] = useState([]);

  useEffect(() => {
    const fetchGround = async () => {
      try {
        const res = await axios.get(`${base_url}/admin/seeGround/${id}`, {
          withCredentials: true,
        });
        const ground = res.data;
        console.log(ground);
        reset({
          name: ground.name,
          type: ground.type || "Football",
          location: ground.location || "",
          pricePerHour: ground.pricePerHour || 0,

          features: ground.features || [""],
          capacity: ground.capacity,
          availability: ground.availability || [{ start: "", end: "" }],
          description: ground.description,
          admin: ground.admin,
          images: ground.image,
        });
        setExistingImages(ground.image || []);
      } catch (err) {
        console.error("Error fetching ground:", err);
      }
    };
    fetchGround();
  }, [id, reset]);

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

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
    setRemovedImage((prev) => [...prev, existingImages[index]]);
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      const newImageUrls = [];
      console.log("images", images);
      if (images.length != 0) {
        images.forEach((img) => {
          formData.append("files", img);
        });

        const uploads = await axios.post(
          `${upload_base_url}/admin/uploads`,
          formData,
          { withCredentials: true }
        );
        newImageUrls = uploads.data.urls;
      }

      console.log(newImageUrls);
      const finalImages = [...existingImages, ...newImageUrls];
      data.images = finalImages;
      console.log("removed images", removedImage);
      await axios.put(
        `${base_url}/admin/updateground/${id}`,
        {
          ...data,

          newImageUrls,
          removedImages: removedImage,
        },
        { withCredentials: true }
      );
      alert("update done");
      reset();
      setExistingImages(finalImages);
      setImages([]);
      setPreviews([]);
      navigate("/admin/dashboard");
    } catch (err) {
      alert("please try again");
      console.error("Error updating ground:", err);
    }
  };

  return (
    <div className="max-w-2xl w-full mx-auto bg-white shadow-md rounded-xl p-4 sm:p-6">
      <h2 className="text-xl font-bold mb-4">Edit Ground</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Ground Name */}
        <div>
          <label className="block font-medium">Ground Name</label>
          <input
            type="text"
            {...register("name", { required: "Ground name is required" })}
            className="w-full border rounded p-2 text-sm"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        {/* Type */}
        <div>
          <label className="block font-medium">Type</label>
          <select
            {...register("type", { required: "Type is required" })}
            className="w-full border rounded p-2 text-sm"
          >
            <option value="Football">Football</option>
            <option value="Cricket">Cricket</option>
            <option value="Basketball">Basketball</option>
            <option value="Tennis">Tennis</option>
            <option value="Badminton">Badminton</option>
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="block font-medium">Location</label>
          <input
            type="text"
            {...register("location", { required: "Location is required" })}
            className="w-full border rounded p-2 text-sm"
          />
          {errors.location && (
            <p className="text-red-500 text-sm">{errors.location.message}</p>
          )}
        </div>

        {/*capacity */}
        <div>
          <label className="block font-medium">Capacity</label>
          <input
            type="text"
            {...register("capacity", { required: "Capacity is required" })}
            className="w-full border rounded p-2 text-sm"
          />
          {errors.capacity && (
            <p className="text-red-500 text-sm">{errors.capacity.message}</p>
          )}
        </div>
        {/* Price */}
        <div>
          <label className="block font-medium">Price Per Hour</label>
          <input
            type="number"
            {...register("pricePerHour", {
              required: "Price per hour is required",
              min: { value: 0, message: "Price cannot be negative" },
            })}
            className="w-full border rounded p-2 text-sm"
          />
          {errors.pricePerHour && (
            <p className="text-red-500 text-sm">
              {errors.pricePerHour.message}
            </p>
          )}
        </div>

        {/* Features */}
        <div>
          <label className="block font-medium">Facility</label>
          {featureFields.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-col sm:flex-row gap-2 mb-2"
            >
              <input
                type="text"
                {...register(`features.${index}`, {
                  required: "Feature is required",
                })}
                className="w-full border rounded p-2 text-sm"
              />
              <button
                type="button"
                onClick={() => removeFeature(index)}
                className="bg-red-500 text-white px-2 py-1 rounded text-xs"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addFeature("")}
            className="mt-2 bg-gray-200 px-3 py-1 rounded text-xs"
          >
            + Add Facility
          </button>
        </div>

        {/* Existing Images */}
        <div>
          <label className="block font-medium">Existing Images</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {existingImages.map((url, index) => (
              <div key={index} className="relative">
                <img
                  src={url}
                  alt="ground"
                  className="w-20 h-20 object-cover rounded border"
                />

                <button
                  type="button"
                  onClick={() => removeExistingImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* New Images */}
        <div>
          <label className="block font-medium">Upload New Images</label>
          {images.map((_, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row items-center gap-2 mb-2"
            >
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, index)}
                className="flex-1 border rounded p-2 text-sm"
              />
              {previews[index] && (
                <img
                  src={previews[index]}
                  alt="preview"
                  className="w-16 h-16 object-cover rounded border"
                />
              )}
              <button
                type="button"
                onClick={() => removeImageField(index)}
                className="bg-red-500 text-white px-2 py-1 rounded text-xs"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addImageField}
            className="mt-2 bg-gray-200 px-3 py-1 rounded text-xs"
          >
            + Add Image
          </button>
        </div>

        {/* Availability */}
        <div>
          <label className="block font-medium">Availability (24h HH:mm)</label>
          {timeFields.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-col sm:flex-row gap-2 mb-2"
            >
              <input
                type="text"
                placeholder="HH:mm"
                {...register(`availability.${index}.start`, {
                  required: "Start time is required",
                  pattern: {
                    value: /^([01]\d|2[0-3]):([0-5]\d)$/,
                    message: "Enter valid time in 24h format (HH:mm)",
                  },
                })}
                className="border rounded p-2 text-sm"
              />
              <input
                type="text"
                placeholder="HH:mm"
                {...register(`availability.${index}.end`, {
                  required: "End time is required",
                  pattern: {
                    value: /^([01]\d|2[0-3]):([0-5]\d)$/,
                    message: "Enter valid time in 24h format (HH:mm)",
                  },
                })}
                className="border rounded p-2 text-sm"
              />
              <button
                type="button"
                onClick={() => removeTime(index)}
                className="bg-red-500 text-white px-3 py-1 rounded text-xs"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addTime({ start: "", end: "" })}
            className="mt-2 bg-gray-200 px-3 py-1 rounded text-xs"
          >
            + Add Time Slot
          </button>
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium">Description</label>
          <textarea
            {...register("description")}
            className="w-full border rounded p-2 text-sm"
            rows={3}
          />
        </div>

        <input type="hidden" value={4} {...register("rating")} />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition text-base"
        >
          {isSubmitting ? "Updating..." : "Update Ground"}
        </button>
      </form>
    </div>
  );
};

export default Groundetails;
