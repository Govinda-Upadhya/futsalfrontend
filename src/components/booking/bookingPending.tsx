import axios from "axios";
import { Check } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { base_url } from "../../types/ground";
type TimeSlot = { start: string; end: string };

interface bookinginfotype {
  name: string;
  email: string;
  contact: string;
  amount: string;
  time: TimeSlot[];
  ground: { name: string; _id: string }; // fix typing to show ground name
  date: string;
}

const BookingPending = () => {
  const navigate = useNavigate();
  const { booking_id } = useParams();
  const [bookingInfo, setBookingInfo] = useState<bookinginfotype>();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  async function fetchBookingInfo() {
    const info = await axios.get(`${base_url}/users/bookinginfo/${booking_id}`);
    console.log(info.data);
    setBookingInfo(info.data.info);
  }

  useEffect(() => {
    fetchBookingInfo();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSend = async () => {
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("screenshot", file);
    formData.append("name", bookingInfo?.name || "");
    formData.append("groundId", bookingInfo?.ground._id || "");
    formData.append("contactInfo", bookingInfo?.contact || "");
    formData.append("email", bookingInfo?.email || "");

    try {
      await axios.post(
        `${base_url}/users/bookinginfo/send_screentshot`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert("Screenshot sent successfully!");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to send screenshot.");
    } finally {
      setUploading(false);
    }
  };

  if (!bookingInfo) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Booking Info!
          </h2>
          <p className="text-gray-600 mb-6">
            Your booking has been processed. Booking ID:{" "}
            <span className="font-bold">#{booking_id}</span>
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-2">
              Booking Details:
            </h3>
            <p className="text-sm text-gray-600">
              Ground: {bookingInfo.ground.name}
            </p>
            <p className="text-sm text-gray-600">
              Date: {new Date(bookingInfo.date).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600">
              Time:{" "}
              {bookingInfo.time.map((slot, i) => (
                <span key={i}>
                  {slot.start}-{slot.end}{" "}
                </span>
              ))}
            </p>
            <p className="text-sm text-gray-600">
              Amount: ₹{bookingInfo.amount}
            </p>
            <h3 className="font-semibold text-gray-900 mb-2">Down payment:</h3>
            <p className="text-sm text-gray-600">
              {Number(bookingInfo.amount) * 0.1}
            </p>
          </div>

          <div className="space-y-3">
            <p>
              To confirm your booking, upload the payment screenshot and send it
              to us:
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border border-gray-300 rounded-lg p-2"
            />
            <button
              onClick={handleSend}
              disabled={uploading || !file}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-[#1AA148] hover:text-white transition-colors disabled:opacity-50"
            >
              {uploading ? "Sending..." : "Send Screenshot"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPending;
