import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../services/api";
import toast from "react-hot-toast";
import useAuthStore from "../store/authStore";

import { Eye, EyeOff } from "lucide-react";

const LoginPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [devResetUrl, setDevResetUrl] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (isForgotPassword) {
        const { data } = await api.post("/auth/forgot-password", { email: formData.email });
        setResetSent(true);
        if (data?.devResetUrl) {
          setDevResetUrl(data.devResetUrl);
        }
        toast.success("Password reset link sent!");
      } else {
        const response = await api.post("/auth/login", formData);
        setAuth(response.data.user, response.data.token);
        toast.success("Login successful");
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Action failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3.5 text-sm text-white placeholder-gray-500 outline-none focus:border-violet-500/40 transition-all duration-300";

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-6 pt-20">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[200px]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md glass rounded-2xl p-8 md:p-10"
      >
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-xs font-bold">
            P
          </div>
          <span className="text-lg font-semibold">PrepWise</span>
        </div>

        <h1 className="text-2xl font-bold mb-1">
          {isForgotPassword ? "Reset Password" : "Welcome back"}
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          {isForgotPassword 
            ? "Enter your email to receive a password reset link." 
            : "Sign in to continue your preparation."}
        </p>

        {resetSent ? (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
              We've sent a password reset link to <strong>{formData.email}</strong>. Please check your inbox.
            </div>
            
            {devResetUrl && (
              <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20">
                <span className="block text-xs text-violet-400 font-bold uppercase tracking-wider mb-2">Developer Mode Bypass</span>
                <p className="text-sm text-gray-300 mb-3">Since you haven't configured an email server yet, click the link below to securely reset your password right now:</p>
                <a href={devResetUrl} className="block text-sm text-cyan-400 hover:text-cyan-300 break-all bg-black/40 p-3 rounded-lg border border-white/5 font-mono">
                  {devResetUrl}
                </a>
              </div>
            )}

            <button
              onClick={() => {
                setIsForgotPassword(false);
                setResetSent(false);
                setDevResetUrl("");
              }}
              className="w-full bg-white/5 text-white border border-white/10 py-3.5 rounded-xl font-semibold text-sm hover:bg-white/10 transition"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={inputClass}
              required
            />
            
            {!isForgotPassword && (
              <div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(true)}
                    className="text-xs text-violet-400 hover:text-violet-300 transition"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black py-3.5 rounded-xl font-semibold text-sm hover:bg-gray-100 transition disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-gray-400 border-t-black rounded-full"
                  />
                  {isForgotPassword ? "Sending..." : "Signing in..."}
                </>
              ) : (
                isForgotPassword ? "Send Reset Link" : "Sign In"
              )}
            </button>

            {isForgotPassword && (
              <button
                type="button"
                onClick={() => setIsForgotPassword(false)}
                className="w-full bg-transparent text-gray-400 py-2 rounded-xl text-sm hover:text-white transition"
              >
                Back to Login
              </button>
            )}
          </form>
        )}

        {!isForgotPassword && (
          <p className="text-gray-500 text-center mt-8 text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-violet-400 hover:text-violet-300 transition">
              Create one
            </Link>
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default LoginPage;