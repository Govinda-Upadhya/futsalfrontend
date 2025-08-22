import React, { useEffect, useState } from "react";
import axios from "axios";
import { base_url } from "../../types/ground";
interface TimeRange {
  start: string;
  end: string;
}

interface Booking {
  _id: string;
  email: string;
  name?: string;
  contact: string;
  amount?: number;
  date: string;
  time: TimeRange[];
  bookingId: string;
  ground: {
    _id: string;
    name: string;
    type: string;
  };
  status: "CONFIRMED" | "PENDING" | "REJECTED";
  createdAt: string;
}

const Booking: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null
  );
  const [rejecting, setRejecting] = useState(false);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await axios.get(`${base_url}/admin/bookings`, {
          withCredentials: true,
        });
        setBookings(res.data.bookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this booking?"
    );
    if (!confirmed) return;

    try {
      const res = await axios.delete(
        `${base_url}/admin/bookings/delete/${id}`,
        { withCredentials: true }
      );
      if (res.status === 200) {
        setBookings((prev) => prev.filter((b) => b._id !== id));
        alert("Deleted successfully");
      } else {
        alert("Couldn't delete the booking");
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert("Failed to delete booking");
    }
  };

  const handleAction = async (id: string, status: "CONFIRMED" | "REJECTED") => {
    try {
      if (status === "CONFIRMED") {
        const accept = await axios.post(
          `${base_url}/admin/bookings/acceptbooking`,
          { bookingId: id },
          { withCredentials: true }
        );
        if (accept.data.status === 404) {
          return alert("Cannot find the id");
        }
        alert("Booking confirmed");
      } else if (status === "REJECTED") {
        // Open modal instead of direct rejection
        setSelectedBookingId(id);
        setShowRejectModal(true);
        return;
      }

      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status } : b))
      );
    } catch (error) {
      console.error(`Error updating booking ${id}:`, error);
    }
  };

  const confirmReject = async () => {
    if (!selectedBookingId) return;
    setRejecting(true);
    try {
      const reject = await axios.post(
        `${base_url}/admin/bookings/rejectbooking`,
        {
          bookingId: selectedBookingId,
          reason: rejectReason,
        },
        { withCredentials: true }
      );
      if (reject.data.status === 404) {
        return alert("Cannot find the id");
      }

      alert("Booking rejected");
      setBookings((prev) =>
        prev.map((b) =>
          b._id === selectedBookingId ? { ...b, status: "REJECTED" } : b
        )
      );
    } catch (error) {
      console.error("Error rejecting booking:", error);
    } finally {
      setRejecting(false);
      setShowRejectModal(false);
      setRejectReason("");
      setSelectedBookingId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">Loading bookings...</div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">All Bookings</h1>

      {bookings.length === 0 ? (
        <div className="text-gray-500 text-center">No bookings found</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-md">
          <table className="min-w-full border-collapse">
            <thead className="bg-emerald-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Booking ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Ground
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {bookings
                .sort(
                  (a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime()
                )
                .map((booking) => (
                  <tr key={booking._id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm">{booking._id}</td>
                    <td className="px-6 py-3 text-sm">{booking.name || "-"}</td>
                    <td className="px-6 py-3 text-sm">{booking.email}</td>
                    <td className="px-6 py-3 text-sm">{booking.contact}</td>
                    <td className="px-6 py-3 text-sm">
                      {booking.ground?.name}
                    </td>
                    <td className="px-6 py-3 text-sm">
                      ₹{booking.amount || 0}
                    </td>
                    <td className="px-6 py-3 text-sm">
                      {new Date(booking.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-3 text-sm">
                      {booking.time.map((t, idx) => (
                        <span
                          key={idx}
                          className="inline-block bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md mr-1 text-xs"
                        >
                          {t.start} - {t.end}
                        </span>
                      ))}
                    </td>
                    <td className="px-6 py-3 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          booking.status === "CONFIRMED"
                            ? "bg-green-100 text-green-700"
                            : booking.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm">
                      {booking.status === "PENDING" && (
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            onClick={() =>
                              handleAction(booking._id, "CONFIRMED")
                            }
                            className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-md text-xs"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() =>
                              handleAction(booking._id, "REJECTED")
                            }
                            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-xs"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      {booking.status === "CONFIRMED" && (
                        <button
                          onClick={() => handleDelete(booking._id)}
                          className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded-md text-xs"
                        >
                          Remove
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Transparent Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md relative">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Reject Booking
            </h2>
            <p className="text-gray-600 text-sm mb-3">
              Please provide a reason for rejecting this booking:
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter reason..."
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-400 focus:outline-none"
              rows={4}
            />
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                  setSelectedBookingId(null);
                }}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
                disabled={!rejectReason.trim() || rejecting}
                className={`px-4 py-2 rounded-lg text-white flex items-center justify-center gap-2 ${
                  !rejectReason.trim() || rejecting
                    ? "bg-red-300 cursor-not-allowed"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {rejecting && (
                  <svg
                    className="animate-spin h-4 w-4 text-white"
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
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                )}
                {rejecting ? "Rejecting..." : "Confirm Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;
