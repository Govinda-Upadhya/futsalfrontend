import React, { useState, ChangeEvent, FormEvent } from "react";

export default function OtpPage(): JSX.Element {
  const [otp, setOtp] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and max 6 digits
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 6) setOtp(value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setMessage("OTP must be 6 digits");
      return;
    }
    setMessage(`OTP submitted: ${otp}`);
    // TODO: Send OTP to backend for verification
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-80 sm:w-96">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Enter OTP
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            value={otp}
            onChange={handleChange}
            placeholder="6-digit OTP"
            className="border border-gray-300 rounded-lg px-4 py-2 text-center text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
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
    </div>
  );
}
