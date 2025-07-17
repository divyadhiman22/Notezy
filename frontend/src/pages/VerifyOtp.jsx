import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user;

  if (!user) {
    navigate("/signup");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...user, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Registration successful");
        navigate("/login"); 
      } else {
        toast.error(data.message || "Invalid OTP");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.log("OTP verification error", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a23] px-4">
      <div className="max-w-md w-full bg-[#111132] text-white rounded-3xl shadow-xl p-8">
        <h2 className="text-3xl font-bold mb-6">Verify OTP</h2>
        <p className="mb-4">
          Enter the OTP sent to <strong>{user.email}</strong>
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            required
            className="w-full px-4 py-2 border border-gray-600 rounded-md bg-[#0a0a23] text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md font-semibold transition"
          >
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOTP;
