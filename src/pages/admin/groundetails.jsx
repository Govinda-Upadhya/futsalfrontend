import axios from "axios";
import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";

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
      address: "",
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

  const [images, setImages] = useState([]); // new files
  const [previews, setPreviews] = useState([]); // local previews
  const [existingImages, setExistingImages] = useState([]); // already uploaded image URLs

  // fetch ground details
  useEffect(() => {
    const fetchGround = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/admin/seeGround/${id}`,
          { withCredentials: true }
        );
        const ground = res.data;

        reset({
          name: ground.name,
          address: ground.address,
          availability: ground.availability || [{ start: "", end: "" }],
          description: ground.description,
          admin: ground.admin,
          images: ground.images,
        });
        setExistingImages(ground.images || []);
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
  };

  const onSubmit = async (data) => {
    try {
      // Step 1: Upload new images if any
      const uploadUrl = [];
      for (const photo of images.filter(Boolean)) {
        const res = await axios.post(
          "http://localhost:3001/admin/createground/uploadpic",
          { fileType: photo.type, fileName: photo.name },
          { withCredentials: true }
        );
        uploadUrl.push(res.data);
      }

      const newImageUrls = [];
      for (let i = 0; i < uploadUrl.length; i++) {
        await axios.put(uploadUrl[i].url, images[i], {
          headers: { "Content-Type": images[i].type },
        });
        newImageUrls.push(uploadUrl[i].imageUrl);
      }

      // Step 2: Merge with existing images
      const finalImages = [...existingImages, ...newImageUrls];

      // Step 3: Send update to backend
      await axios.put(
        `http://localhost:3001/admin/updateground/${id}`,
        {
          ...data,
          images: finalImages,
          newImageUrls,
          removedImages: removedImage,
        },
        { withCredentials: true }
      );

      // Step 4: Update state so UI shows new images
      reset();
      setExistingImages(finalImages);
      setImages([]);
      setPreviews([]);
    } catch (err) {
      console.error("Error updating ground:", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-xl p-6">
      <h2 className="text-xl font-bold mb-4">Edit Ground</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block font-medium">Ground Name</label>
          <input
            type="text"
            {...register("name", { required: "Ground name is required" })}
            className="w-full border rounded p-2"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        {/* Address */}
        <div>
          <label className="block font-medium">Address</label>
          <input
            type="text"
            {...register("address", { required: "Address is required" })}
            className="w-full border rounded p-2"
          />
          {errors.address && (
            <p className="text-red-500 text-sm">{errors.address.message}</p>
          )}
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
                  onClick={() => {
                    removeExistingImage(index);
                    setRemovedImage([...removedImage, url]);
                  }}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Upload New Images */}
        <div>
          <label className="block font-medium">Upload New Images</label>
          {images.map((_, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, index)}
                className="flex-1 border rounded p-2"
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
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addImageField}
            className="mt-2 bg-gray-200 px-3 py-1 rounded"
          >
            + Add Image
          </button>
        </div>

        {/* Availability */}
        <div>
          <label className="block font-medium">Availability (24h HH:mm)</label>
          {timeFields.map((field, index) => (
            <div key={field.id} className="flex gap-2 mb-2">
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
                className="border rounded p-2"
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
                className="border rounded p-2"
              />
              <button
                type="button"
                onClick={() => removeTime(index)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addTime({ start: "", end: "" })}
            className="mt-2 bg-gray-200 px-3 py-1 rounded"
          >
            + Add Time Slot
          </button>
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium">Description</label>
          <textarea
            {...register("description")}
            className="w-full border rounded p-2"
            rows={3}
          />
        </div>

        {/* Admin ID */}
        <div>
          <label className="block font-medium">Admin ID</label>
          <input
            type="text"
            {...register("admin", { required: "Admin ID is required" })}
            className="w-full border rounded p-2"
          />
          {errors.admin && (
            <p className="text-red-500 text-sm">{errors.admin.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          {isSubmitting ? "Updating..." : "Update Ground"}
        </button>
      </form>
    </div>
  );
};

export default Groundetails;
