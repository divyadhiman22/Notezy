
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";
import { auth, provider, signInWithPopup } from "../firebase";
import { FcGoogle } from "react-icons/fc";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { storeTokenInLS } = useAuth();

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:5000/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const res_data = await response.json();

      if (response.ok) {
        storeTokenInLS(res_data.token);
        setUser({ email: "", password: "" });
        setErrors({ email: "", password: "" });
        toast.success("Login Successful");
        navigate("/");
      } else {
        if (res_data.errors) {
          setErrors(res_data.errors);
        } else {
          toast.error(res_data.message || "Login failed");
        }
      }
    } catch (error) {
      console.error("Login error", error);
      toast.error("Something went wrong");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();

      const response = await fetch("http://localhost:5000/api/auth/google-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken: token }),
      });

      const data = await response.json();

      if (response.ok) {
        storeTokenInLS(data.token);
        toast.success("Google Login Successful");
        navigate("/");
      } else {
        toast.error(data.message || "Google Login failed");
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast.error("Google Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a23] px-4">
      <div className="max-w-4xl w-full bg-[#111132] text-white rounded-3xl shadow-xl flex overflow-hidden mt-20">
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <h2 className="text-3xl font-bold">Login Account</h2>
          <p className="text-gray-400 mt-2 mb-6">Join us and get started in seconds!</p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <input
                type="text"
                value={user.email}
                name="email"
                id="email"
                placeholder="Email"
                onChange={handleInput}
                className="w-full px-4 py-2 border border-gray-600 rounded-md bg-[#0a0a23] text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
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
                {showPassword ? <AiFillEye size={24} /> : <AiFillEyeInvisible size={24} />}
              </button>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <p className="text-sm text-gray-400 mt-2">
              <a href="/forgot-password" className="underline hover:text-blue-400">
                Forgot your password?
              </a>
            </p>

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md font-semibold transition"
            >
              Login
            </button>

            <h1 className="text-center">or</h1>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full mt-4 flex items-center justify-center gap-2 border-2 border-white text-white py-2 rounded-md font-semibold hover:border-purple-500 transition"
            >
              <FcGoogle size={20} />
              Sign in with Google
            </button>
          </form>

          <p className="text-sm text-gray-400 mt-4">
            Don't have an account?{" "}
            <a href="/signup" className="text-purple-400 hover:underline">
              Signup
            </a>
          </p>
        </div>

        <div className="hidden md:flex md:w-1/2 bg-gradient-to-tr from-indigo-700 to-purple-700 items-center justify-center">
          <img
            src="https://www.pngall.com/wp-content/uploads/15/Login-PNG-HD-Image.png"
            alt="Login Illustration"
            className="w-[90%] h-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
