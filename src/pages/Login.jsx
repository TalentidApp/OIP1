import { useState, useEffect } from "react";
import { IoArrowForwardSharp } from "react-icons/io5";
import backgroundImage2 from "../assets/rb_24598.png";
import logo from "../assets/logo.png";
import InputField from "../components/InputField";
import ForgotPasswordCard from "../components/ForgotPasswordCard";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {toast} from "sonner";
import { useDispatch, useSelector } from "react-redux"; 
import { setData } from "../redux/UserSlice";
import { useUserStore } from "../redux/userStore";

const LoginForm = () => {
  const dispatch = useDispatch();
  const { setVerifiedDocuments } = useUserStore();
  const { loggedIn } = useSelector((state) => state.user); 
  const API_URL = import.meta.env.VITE_REACT_BACKEND_URL ?? '';
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState({});

  // Redirect to /dashboard if already logged in
  useEffect(() => {
    if (loggedIn) {
      console.log("User already logged in, redirecting to /dashboard");
      navigate("/dashboard", { replace: true });
    }
  }, [loggedIn, navigate]);

  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true);
  };

  const handleCloseForgotPassword = () => {
    setShowForgotPassword(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setErrorMessage("");
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format.";
    }
    if (!formData.password) {
      newErrors.password = "Password is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (validateForm()) {
      setIsLoading(true);
      try {
        const response = await axios.post(
          `${API_URL}/api/auth/login`,
          {
            email: formData.email,
            password: formData.password,
            captchaValue: '',
          },
          {
            withCredentials: true,
          }
        );
        console.log("Login response:", response.data);
        dispatch(setData(response.data));
        setVerifiedDocuments(response.data.verifiedDocuments || false);
        toast.success("Logged in successfully!",{
                  style: {
          backgroundColor: '#652d96',
          color: '#ffffff',
        },
        });
        console.log("Navigating to /dashboard");
        navigate("/dashboard", { replace: true });
      } catch (error) {
        console.error("Error logging in:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        let errorMsg = "Failed to log in. Please try again.";
        if (error.response?.status === 401) {
          errorMsg = "Invalid email or password.";
        } else if (error.response?.status === 403) {
          errorMsg = "Account not verified or access denied.";
        } else if (error.response?.data?.message) {
          errorMsg = error.response.data.message;
        }
        setErrorMessage(errorMsg);
        toast.error(errorMsg);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50">
      <div
        className={`w-full lg:w-[50%] bg-white flex items-center justify-center relative transition-transform duration-300 ${
          showForgotPassword ? "blur-sm" : ""
        }`}
      >
        <div className="w-full max-w-md px-6 py-12">
          <div className="mb-10">
            <img src={logo} alt="Logo" className="w-[50%] h-auto mx-auto" />
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-purple-700 text-3xl font-bold mb-2 text-center">Welcome Back</h2>
            <p className="text-gray-500 text-center mb-8">
              Sign in to continue your journey
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <InputField
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                className="focus:ring-purple-500 focus:border-purple-500"
              />
              <InputField
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                className="focus:ring-purple-500 focus:border-purple-500"
              />
              <div className="flex justify-end">
                <p
                  className="text-sm text-purple-600 font-medium cursor-pointer hover:text-purple-800"
                  onClick={handleForgotPasswordClick}
                >
                  Forgot Password?
                </p>
              </div>
              {errorMessage && (
                <p className="text-red-500 text-sm mt-2 text-center">{errorMessage}</p>
              )}
              <button
                type="submit"
                className={`w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition-all duration-300 font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg ${
                  isLoading ? "opacity-75 cursor-not-allowed" : ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
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
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <>
                    <span>Sign In</span>
                    <IoArrowForwardSharp />
                  </>
                )}
              </button>
              <div className="text-center mt-6">
                <p className="text-gray-600">
                  Don’t have an account?{" "}
                  <a
                    href="/signup"
                    className="text-purple-600 font-semibold hover:text-purple-800 transition-colors"
                  >
                    Sign Up
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <ForgotPasswordCard onClose={handleCloseForgotPassword} />
        </div>
      )}
      <div className="hidden lg:flex lg:w-[50%] bg-gradient-to-b from-purple-900 via-purple-700 to-purple-400 text-white rounded-l-3xl overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-700/30"></div>
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full p-12 text-center">
          <div className="max-w-lg">
            <h1 className="text-4xl font-bold mb-6">
              Unlock Your Potential
            </h1>
            <p className="text-lg mb-10">
              The best way to predict the future is to create it – starting with
              hiring exceptional talent.
            </p>
            <div className="flex justify-center">
              <img
                src={backgroundImage2}
                alt="Decorative"
                className="w-4/5 h-auto rounded-xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;