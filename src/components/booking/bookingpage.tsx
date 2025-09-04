import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { base_url } from "../../types/ground";
import {
  ArrowLeft,
  MapPin,
  Star,
  Clock,
  Calendar,
  User,
  Mail,
  Phone,
  CreditCard,
  Check,
} from "lucide-react";
import { Ground } from "../../types/ground";
import axios from "axios";
import { useForm } from "react-hook-form";

type TimeSlot = { start: string; end: string };

interface BookingFormData {
  date: string;
  name: string;
  email: string;
  phone: string;
  availability: TimeSlot[];
}

const BookingPage: React.FC = () => {
  const [groundloading, setGroundLoading] = useState(false);

  const [disable, setDisbale] = useState<boolean>(false);
  const [bookedTime, setBookedTime] = useState<TimeSlot[]>([]);
  const { groundId } = useParams<{ groundId: string }>();
  const navigate = useNavigate();
  const [ground, setGround] = useState<Ground>();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot[]>([]);
  const [isBooking, setIsBooking] = useState(false);

  const [bookingId, setBookingId] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BookingFormData>();

  async function fetchGroundView() {
    setGroundLoading(true);
    const foundGround = await axios.get(
      `${base_url}/users/seegrounds/${groundId}`
    );
    console.log();
    setGround(foundGround.data);
    setGroundLoading(false);
  }

  useEffect(() => {
    if (groundId) {
      fetchGroundView();
    }
  }, [groundId]);

  const onSubmit = async (data: BookingFormData) => {
    if (!ground || !selectedTimeSlot.length) return;
    data.availability = selectedTimeSlot;
    console.log(data);
    setIsBooking(true);
    const booking = await axios.post(
      `${base_url}/users/bookground/${groundId}`,
      {
        data,
      }
    );
    console.log(booking);

    setIsBooking(false);
    navigate(`/users/booking/${booking.data.booking_id}`);
  };

  const getTotalAmount = () => {
    const price = ground ? ground.pricePerHour : 0;
    const total = selectedTimeSlot.length * price;
    return total;
  };

  const selectedDate = watch("date");
  async function getTime() {
    const time = await axios.get(`${base_url}/users/bookedTime`, {
      params: {
        date: selectedDate,
        ground: groundId,
      },
    });

    if (time.data.bookedTime) {
      setBookedTime(time.data.bookedTime[0]);
    } else {
      setBookedTime([]);
    }
    console.log("booked tijme", bookedTime[0]);
  }
  useEffect(() => {
    getTime();
  }, [selectedDate]);

  if (groundloading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-gray-600 text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!ground) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ground not found
          </h2>
          <button
            onClick={() => navigate("/")}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {/* Header */}
      <div className="bg-white ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Back Button */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center text-[#1AA148] font-semibold hover:text-green-700 transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Grounds
          </button>

          {/* Ground Info */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {ground.name}
              </h1>
              <div className="flex items-center mt-2 text-gray-600 text-lg">
                <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                <span>{ground.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Ground Details */}
          <div>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
              <img
                src={ground.image[0]}
                alt={ground.name}
                className="w-full h-64 object-cover"
              />

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Ground Details
                </h3>

                <p className="text-gray-600 mb-4">{ground.description}</p>
                <div className="mt-4 md:mt-0">
                  <div className="text-l font-bold text-gray-500 mb-2">
                    Nu.{ground.pricePerHour}
                    <span className="text-lg text-gray-500">/hour</span>
                  </div>
                </div>
                <h4 className="font-semibold text-gray-900 mb-3">Facilities</h4>

                <div className="grid grid-cols-2 gap-2">
                  {ground.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center text-gray-600"
                    >
                      <Check className="h-4 w-4 text-emerald-600 mr-2" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Book This Ground
              </h3>

              {/* Date Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Select Date
                </label>
                <input
                  type="date"
                  {...register("date", { required: true })}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                {errors.date && (
                  <p className="text-red-500 text-sm mt-1">
                    Please select a date
                  </p>
                )}
              </div>

              {/* Time Slot Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="h-4 w-4 inline mr-1" />
                  Available Time Slots
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {ground.availability.map((hour, key) =>
                    typeof hour !== "string" ? (
                      <button
                        key={key}
                        type="button"
                        disabled={bookedTime.some(
                          (time) =>
                            time.start === hour.start && time.end === hour.end
                        )}
                        onClick={() => {
                          setSelectedTimeSlot((prev) => {
                            const exists = prev.some(
                              (time) =>
                                time.start === hour.start &&
                                time.end === hour.end
                            );

                            if (exists) {
                              // Remove if already selected
                              return prev.filter(
                                (time) =>
                                  !(
                                    time.start === hour.start &&
                                    time.end === hour.end
                                  )
                              );
                            } else {
                              // Add if not selected
                              return [...prev, hour];
                            }
                          });
                        }}
                        className={`p-3 rounded-lg border text-sm font-medium transition-all
            ${
              selectedTimeSlot.some(
                (time) => time.start === hour.start && time.end === hour.end
              )
                ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                : bookedTime.some(
                    (time) => time.start === hour.start && time.end === hour.end
                  )
                ? "border-gray-300 bg-gray-200 text-gray-400 cursor-not-allowed"
                : "border-gray-300 hover:border-emerald-300 hover:bg-emerald-50"
            }
          `}
                      >
                        {hour.start}-{hour.end}
                      </button>
                    ) : null
                  )}
                </div>
              </div>

              {/* Customer Information */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-4">
                  Customer Information
                </h4>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="h-4 w-4 inline mr-1" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      {...register("name", { required: true })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">
                        Please enter your name
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="h-4 w-4 inline mr-1" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      {...register("email", { required: true })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        Please enter your email
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      {...register("phone", {
                        required: "Phone number is required",
                        pattern: {
                          value: /^(77|17)[0-9]{6}$/,
                          message:
                            "Phone number must start with 77 or 17 and be 8 digits",
                        },
                      })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      placeholder="Enter your 8-digit phone number"
                      maxLength={8} // prevents typing more than 8 characters
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Booking Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Booking Summary
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ground:</span>
                    <span className="font-medium">{ground.name}</span>
                  </div>
                  {selectedDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">
                        {new Date(selectedDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {selectedTimeSlot.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span className="font-medium">
                        {selectedTimeSlot.map((hour, key) => (
                          <p key={key}>
                            {hour.start}-{hour.end}
                          </p>
                        ))}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold text-emerald-600 pt-2 border-t">
                    <span>Total Amount:</span>
                    <span>Nu.{getTotalAmount()}</span>
                  </div>
                </div>
              </div>

              {/* Book Button */}
              <button
                type="submit"
                disabled={isBooking || !selectedTimeSlot.length}
                className="w-full  bg-[#1AA148] text-white py-4 px-6 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-emerald-700 hover:to-emerald-600 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                {isBooking ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5 mr-2" />
                    Confirm Booking - Nu.{getTotalAmount()}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
