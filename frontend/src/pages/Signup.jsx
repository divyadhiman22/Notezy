import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const Signup = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleInput = (e) => {
    const { name, value } = e.target;

    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      const response = await fetch(`${backendUrl}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const res_data = await response.json();

      if (response.ok) {
        toast.success("OTP sent to your email");
        navigate("/verify-otp", { state: { user } });

        setUser({
          username: "",
          email: "",
          phone: "",
          password: "",
        });
      } else {
        if (res_data.errors) {
          setErrors(res_data.errors);
        } else {
          toast.error(res_data.message || "Error sending OTP");
        }
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error("Registration error", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a23] px-4">
      <div className="max-w-4xl w-full bg-[#111132] text-white rounded-3xl shadow-xl flex overflow-hidden mt-20">
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <h2 className="text-3xl font-bold">Create Account</h2>
          <p className="text-gray-400 mt-2 mb-6">
            Join us and get started in seconds!
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <input
                type="text"
                value={user.username}
                name="username"
                placeholder="Username"
                onChange={handleInput}
                className={`w-full px-4 py-2 border rounded-md bg-[#0a0a23] text-white focus:outline-none focus:ring-2 ${
                  errors.username
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-600 focus:ring-purple-500"
                }`}
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
              )}
            </div>

            <div>
              <input
                type="text"
                value={user.email}
                name="email"
                placeholder="Email"
                onChange={handleInput}
                className={`w-full px-4 py-2 border rounded-md bg-[#0a0a23] text-white focus:outline-none focus:ring-2 ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-600 focus:ring-purple-500"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <input
                type="tel"
                value={user.phone}
                name="phone"
                placeholder="Phone"
                onChange={handleInput}
                className={`w-full px-4 py-2 border rounded-md bg-[#0a0a23] text-white focus:outline-none focus:ring-2 ${
                  errors.phone
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-600 focus:ring-purple-500"
                }`}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={user.password}
                name="password"
                id="password"
                placeholder="Password"
                onChange={handleInput}
                className="w-full px-4 py-2 border border-gray-600 rounded-md bg-[#0a0a23] text-white focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-500"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <AiFillEye size={24} />
                ) : (
                  <AiFillEyeInvisible size={24} />
                )}
              </button>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md font-semibold transition"
            >
              Sign Up
            </button>
          </form>

          <p className="text-sm text-gray-400 mt-4">
            Already have an account?{" "}
            <a href="/login" className="text-purple-400 hover:underline">
              Login
            </a>
          </p>
        </div>

        <div className="hidden md:flex md:w-1/2 bg-gradient-to-tr from-indigo-700 to-purple-700 items-center justify-center">
          <img
            src="https://cdni.iconscout.com/illustration/premium/thumb/sign-up-illustration-download-in-svg-png-gif-file-formats--log-register-form-user-interface-pack-design-development-illustrations-6430773.png?f=webp"
            alt="Signup Illustration"
            className="w-[90%] h-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Signup;
