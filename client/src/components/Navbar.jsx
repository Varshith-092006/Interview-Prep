import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    setMobileOpen(false);
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${
      isActive(path) ? "text-white" : "text-gray-400 hover:text-white"
    }`;

  // Hide navbar on interview page for immersive experience
  if (location.pathname.startsWith("/interview/")) return null;

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-2xl border-b border-white/[0.06]" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group"
            onClick={() => setMobileOpen(false)}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-xs font-bold">
              P
            </div>
            <span className="text-lg font-semibold tracking-tight">
              Prep<span className="text-violet-400">Wise</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {!token ? (
              <>
                <Link to="/login" className={navLinkClass("/login")}>
                  Login
                </Link>
                <Link
                  to="/register"
                  className="ml-2 px-5 py-2 rounded-xl bg-white text-black text-sm font-medium hover:bg-gray-100 transition-colors duration-200"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <Link to="/dashboard" className={navLinkClass("/dashboard")}>
                  Dashboard
                </Link>
                <Link to="/create-interview" className={navLinkClass("/create-interview")}>
                  Interview
                </Link>
                <Link to="/resume-upload" className={navLinkClass("/resume-upload")}>
                  Resume
                </Link>
                <Link to="/analytics" className={navLinkClass("/analytics")}>
                  Analytics
                </Link>
                <Link to="/profile" className={navLinkClass("/profile")}>
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className="ml-3 px-4 py-2 rounded-xl border border-white/10 text-sm text-gray-400 hover:text-white hover:border-white/20 transition-all duration-200"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-label="Toggle menu"
          >
            <motion.span
              animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className="block w-5 h-[2px] bg-white"
            />
            <motion.span
              animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
              className="block w-5 h-[2px] bg-white"
            />
            <motion.span
              animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              className="block w-5 h-[2px] bg-white"
            />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
              onClick={() => setMobileOpen(false)}
            />
            <div className="relative pt-20 px-6 pb-8 flex flex-col gap-2">
              {!token ? (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 text-lg text-gray-300 hover:text-white transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 text-lg text-white bg-violet-600 rounded-xl text-center mt-2"
                  >
                    Get Started
                  </Link>
                </>
              ) : (
                <>
                  {[
                    { to: "/dashboard", label: "Dashboard" },
                    { to: "/create-interview", label: "Create Interview" },
                    { to: "/resume-upload", label: "Resume Upload" },
                    { to: "/analytics", label: "Analytics" },
                    { to: "/profile", label: "Profile" },
                  ].map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setMobileOpen(false)}
                      className={`block px-4 py-3 text-lg rounded-xl transition ${
                        isActive(link.to)
                          ? "text-white bg-white/5"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <button
                    onClick={logout}
                    className="mt-4 px-4 py-3 text-lg text-red-400 hover:text-red-300 text-left transition"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;