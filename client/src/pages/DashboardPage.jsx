import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import api from "../services/api";

const DashboardPage = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]  = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterDifficulty, setFilterDifficulty] = useState("All");
  const [filterMode, setFilterMode] = useState("All");
  const [sortBy, setSortBy] = useState("latest");
  const navigate = useNavigate();

  const fetchInterviews = async () => {
    try {
      const response = await api.get("/interviews/my-interviews");
      setInterviews(response.data.interviews);
      toast.success("Dashboard loaded");
    } catch (error) {
      console.log(error);
      toast.error("Failed to load interviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  const toggleBookmark = async (e, interviewId) => {
    e.stopPropagation();
    try {
      await api.put(`/interviews/${interviewId}/bookmark`);
      toast.success("Bookmark updated");
      fetchInterviews();
    } catch (error) {
      console.log(error);
      toast.error("Bookmark failed");
    }
  };

  const filteredInterviews = interviews
    .filter((interview) => {
      const matchesSearch = interview.role?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = filterStatus === "All" ? true : interview.status?.toLowerCase() === filterStatus.toLowerCase();
      const matchesDifficulty = filterDifficulty === "All" ? true : interview.difficulty?.toLowerCase() === filterDifficulty.toLowerCase();
      const matchesMode = filterMode === "All" ? true : interview.mode?.toLowerCase() === filterMode.toLowerCase();
      return matchesSearch && matchesStatus && matchesDifficulty && matchesMode;
    })
    .sort((a, b) => {
      if (sortBy === "latest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "highestScore") return (b.score || 0) - (a.score || 0);
      return 0;
    });

  const filterClass =
    "bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-violet-500/40 transition-all duration-300";

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-24 px-6">
        <div className="max-w-7xl mx-auto">
          <Skeleton height={50} className="mb-4" baseColor="#111" highlightColor="#1a1a2e" />
          <Skeleton height={20} className="mb-10" baseColor="#111" highlightColor="#1a1a2e" />
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass rounded-2xl p-6">
                <Skeleton height={30} baseColor="#111" highlightColor="#1a1a2e" />
                <Skeleton count={3} className="mt-3" baseColor="#111" highlightColor="#1a1a2e" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20 px-6">
      <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between gap-6 md:items-end mb-10"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-violet-400 mb-3">Overview</p>
            <h1 className="text-3xl md:text-4xl font-bold mb-1">Dashboard</h1>
            <p className="text-gray-500 text-sm">Track your AI interview progress.</p>
          </div>
          <button
            onClick={() => navigate("/create-interview")}
            className="px-6 py-3 rounded-xl bg-white text-black text-sm font-semibold hover:bg-gray-100 transition-all duration-200 self-start md:self-auto"
          >
            + New Interview
          </button>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-8"
        >
          <input
            type="text"
            placeholder="Search role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={filterClass}
          />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className={filterClass}>
            <option value="All">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
          </select>
          <select value={filterDifficulty} onChange={(e) => setFilterDifficulty(e.target.value)} className={filterClass}>
            <option value="All">All Difficulty</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          <select value={filterMode} onChange={(e) => setFilterMode(e.target.value)} className={filterClass}>
            <option value="All">All Modes</option>
            <option value="Technical">Technical</option>
            <option value="HR">HR</option>
            <option value="Behavioral">Behavioral</option>
            <option value="System Design">System Design</option>
            <option value="DSA">DSA</option>
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={filterClass}>
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="highestScore">Highest Score</option>
          </select>
        </motion.div>

        {/* Empty State */}
        {filteredInterviews.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass rounded-2xl p-16 text-center"
          >
            <div className="text-5xl mb-4 opacity-30">🎙️</div>
            <h2 className="text-2xl font-bold mb-3">No Interviews Found</h2>
            <p className="text-gray-500 text-sm mb-6">Start your first AI voice interview.</p>
            <button
              onClick={() => navigate("/create-interview")}
              className="px-6 py-3 rounded-xl bg-white text-black text-sm font-semibold hover:bg-gray-100 transition"
            >
              Create Interview
            </button>
          </motion.div>
        )}

        {/* Interview Grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredInterviews.map((interview, i) => (
            <motion.div
              key={interview._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              onClick={() => navigate(`/feedback/${interview._id}`)}
              className="group glass rounded-2xl p-6 cursor-pointer hover:bg-white/[0.04] transition-all duration-300 border border-white/[0.04] hover:border-white/[0.08]"
            >
              {/* Top */}
              <div className="flex justify-between items-start mb-5">
                <div>
                  <div className="flex gap-2 mb-3">
                    <span
                      className={`px-3 py-1 rounded-lg text-[11px] font-medium ${
                        interview.interviewType === "Voice"
                          ? "bg-violet-500/10 text-violet-400 border border-violet-500/20"
                          : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                      }`}
                    >
                      {interview.interviewType === "Voice" ? "🎙️ Voice" : "📄 Resume"}
                    </span>
                    <span className="px-3 py-1 rounded-lg text-[11px] font-medium bg-white/5 text-gray-400 border border-white/[0.06]">
                      {interview.mode}
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold mb-1 group-hover:text-white transition">
                    {interview.role}
                  </h2>
                  <p className="text-xs text-gray-500">{interview.difficulty} · {interview.seniority || "Junior"}</p>
                </div>

                <button
                  onClick={(e) => toggleBookmark(e, interview._id)}
                  className="text-xl opacity-50 hover:opacity-100 transition"
                >
                  {interview.bookmarked ? "⭐" : "☆"}
                </button>
              </div>

              {/* Bottom */}
              <div className="flex items-center justify-between pt-4 border-t border-white/[0.04]">
                <span
                  className={`px-3 py-1 rounded-lg text-[11px] font-medium ${
                    interview.status === "Completed"
                      ? "bg-green-500/10 text-green-400 border border-green-500/20"
                      : interview.status === "Active"
                      ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                      : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                  }`}
                >
                  {interview.status}
                </span>

                {interview.score > 0 && (
                  <span className="text-sm font-semibold text-violet-400">
                    {interview.score}/10
                  </span>
                )}

                <span className="text-[11px] text-gray-600">
                  {new Date(interview.createdAt).toLocaleDateString()}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;