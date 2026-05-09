import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import api from "../services/api";

const CreateInterviewPage = () => {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [formData, setFormData] = useState({
    role: "",
    seniority: "Junior",
    difficulty: "Medium",
    totalQuestions: 5,
    resumeId: "",
    mode: "Technical",
  });

  const fetchResumes = async () => {
    try {
      const response = await api.get("/resume/my-resumes");
      setResumes(response.data.resumes);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load resumes");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerate = async () => {
    if (!formData.role) {
      toast.error("Please enter a role");
      return;
    }

    const toastId = toast.loading("Preparing voice interview...");
    try {
      setLoading(true);
      const response = await api.post("/interviews/create", {
        ...formData,
        title: `${formData.role} Interview`,
        interviewType: "Voice",
      });

      toast.dismiss(toastId);
      toast.success("Voice interview ready");
      navigate(`/interview/${response.data.interview._id}`);
    } catch (error) {
      console.log(error);
      toast.dismiss(toastId);
      toast.error(error.response?.data?.message || "Interview creation failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3.5 text-sm text-white placeholder-gray-500 outline-none focus:border-violet-500/40 focus:bg-white/[0.04] transition-all duration-300";

  const labelClass = "block mb-2 text-sm font-medium text-gray-400";

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-black pt-24 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <Skeleton height={50} className="mb-4" baseColor="#111" highlightColor="#1a1a2e" />
          <Skeleton height={20} className="mb-10" baseColor="#111" highlightColor="#1a1a2e" />
          <div className="glass rounded-2xl p-8 space-y-6">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} height={50} baseColor="#111" highlightColor="#1a1a2e" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20 px-6">
      <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[200px] pointer-events-none" />

      <div className="relative max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs uppercase tracking-[0.2em] text-violet-400 mb-3">Voice Interview</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Create Interview</h1>
          <p className="text-gray-500 text-sm mb-10">
            Configure your AI voice interview session.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`glass rounded-2xl p-6 md:p-8 space-y-6 ${loading ? "pointer-events-none opacity-60" : ""}`}
        >
          {/* Resume Selection */}
          <div>
            <label className={labelClass}>Resume (optional)</label>
            <select
              name="resumeId"
              value={formData.resumeId}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Continue without resume</option>
              {resumes.map((resume) => (
                <option key={resume._id} value={resume._id}>
                  {resume.originalName} — ATS {resume.atsScore}
                </option>
              ))}
            </select>
          </div>

          {/* Role */}
          <div>
            <label className={labelClass}>Target Role</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="e.g., Full Stack Developer"
              className={inputClass}
            />
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className={labelClass}>Seniority</label>
              <select name="seniority" value={formData.seniority} onChange={handleChange} className={inputClass}>
                <option>Junior</option>
                <option>Mid</option>
                <option>Senior</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Difficulty</label>
              <select name="difficulty" value={formData.difficulty} onChange={handleChange} className={inputClass}>
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Mode</label>
              <select name="mode" value={formData.mode} onChange={handleChange} className={inputClass}>
                <option>Technical</option>
                <option>HR</option>
                <option>Behavioral</option>
                <option>System Design</option>
                <option>DSA</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Questions</label>
              <input
                type="number"
                min={1}
                max={20}
                name="totalQuestions"
                value={formData.totalQuestions}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          {/* Submit */}
          <button
            disabled={loading}
            onClick={handleGenerate}
            className="w-full py-4 rounded-xl bg-white text-black font-semibold text-sm hover:bg-gray-100 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-gray-400 border-t-black rounded-full"
                />
                Preparing...
              </>
            ) : (
              <>
                🎙️ Start Voice Interview
              </>
            )}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateInterviewPage;