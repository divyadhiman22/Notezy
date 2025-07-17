/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleReset = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${backendUrl}/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        navigate("/login");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Something went wrong.");
    }
  };

  return (
    <section className="flex justify-center items-center h-screen bg-gray-900 text-white">
      <form
        onSubmit={handleReset}
        className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-xl font-semibold mb-4">Reset Your Password</h2>
        <input
          type="password"
          placeholder="New Password"
          className="w-full p-2 mb-4 rounded text-black"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
        >
          Reset Password
        </button>
      </form>
    </section>
  );
};

export default ResetPassword;
