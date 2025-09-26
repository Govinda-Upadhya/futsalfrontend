import axios from "axios";
import React, { useState, useRef, FormEvent, ChangeEvent } from "react";
import { base_url } from "../../types/ground";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useNavigate } from "react-router-dom";
import { Bounce, ToastContainer, toast } from "react-toastify";
export default function OtpPage(): JSX.Element {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [message, setMessage] = useState<string>("");
  const email = useSelector((state: RootState) => state.auth.email);
  const bookingId = useSelector((state: RootState) => state.auth.booking_id);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const handleChange = (e: ChangeEvent<HTMLInputElement>, idx: number) => {
    const value = e.target.value.replace(/\D/g, ""); // only digits
    if (!value) return;
    const newOtp = [...otp];
    newOtp[idx] = value[0]; // take only first digit
    setOtp(newOtp);

    // Move focus to next input
    if (idx < 5) inputRefs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    idx: number
  ) => {
    if (e.key === "Backspace") {
      e.preventDefault();

      const newOtp = [...otp];
      if (newOtp[idx]) {
        newOtp[idx] = "";
        setOtp(newOtp);
      } else if (idx > 0) {
        inputRefs.current[idx - 1]?.focus();
        newOtp[idx - 1] = "";
        setOtp(newOtp);
      }
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (otp.some((digit) => digit === "")) {
      setMessage("Please fill all 6 digits");
      return;
    }
    const otpCode = otp.join("");
    const res = await axios.post(
      `${base_url}/users/verifyotp`,
      { otp, email },
      { withCredentials: true }
    );
    if (res.status == 200) {
      console.log("booking Id", bookingId);
      setTimeout(() => {
        navigate(`/users/booking/${bookingId}`);
      }, 2000);
    } else {
      toast.error(res.data.message);
    }
    // TODO: Send OTP to backend for verification
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-80 sm:w-96">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Enter OTP
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex justify-between gap-2">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                ref={(el) => (inputRefs.current[idx] = el)}
                className="w-12 h-12 text-center text-xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ))}
          </div>
          <button
            type="submit"
            className="bg-emerald-600 text-white py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            Verify OTP
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center text-green-600 font-medium">
            {message}
          </p>
        )}
        <p className="mt-6 text-center text-gray-500 text-sm">
          Didn't receive OTP?{" "}
          <button className="text-indigo-600 hover:underline">Resend</button>
        </p>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </div>
  );
}
