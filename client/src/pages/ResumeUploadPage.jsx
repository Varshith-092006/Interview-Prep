import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../services/api";

const ResumeUploadPage = () => {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a resume file");
      return;
    }

    const toastId = toast.loading("Analyzing resume...");
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("resume", file);

      const response = await api.post("/resume/upload", formData);
      setAnalysis(response.data.analysis);
      toast.dismiss(toastId);
      toast.success("Resume analyzed successfully");
    } catch (error) {
      console.log("Upload Error:", error);
      toast.dismiss(toastId);
      toast.error(error.response?.data?.message || "Resume upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      setFile(e.dataTransfer.files[0]);
      toast.success("Resume selected");
    }
  };

  const ScoreBar = ({ score }) => {
    const pct = Math.min(score || 0, 100);
    const color = pct >= 80 ? "bg-green-400" : pct >= 60 ? "bg-yellow-400" : "bg-red-400";
    return (
      <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20 px-6">
      <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />
      <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-cyan-600/10 blur-[200px] pointer-events-none" />

      <div className="relative max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-400 mb-3">Resume</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Upload Resume</h1>
          <p className="text-gray-500 text-sm mb-10">Get AI-powered ATS analysis and interview personalization.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass rounded-2xl p-6 md:p-8"
        >
          {/* Drop Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-xl p-10 md:p-14 text-center transition-all duration-300 ${
              dragActive
                ? "border-violet-500/50 bg-violet-500/5"
                : "border-white/[0.08] hover:border-white/[0.15]"
            }`}
          >
            <div className="text-4xl mb-4 opacity-40">📄</div>
            <p className="text-sm text-gray-400 mb-2">
              Drag & drop your resume, or{" "}
              <label className="text-violet-400 cursor-pointer hover:underline">
                browse
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    const selectedFile = e.target.files[0];
                    setFile(selectedFile);
                    if (selectedFile) toast.success("Resume selected");
                  }}
                  className="hidden"
                />
              </label>
            </p>
            <p className="text-xs text-gray-600">PDF, DOC, DOCX supported</p>

            {file && (
              <div className="mt-6 px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] inline-flex items-center gap-2">
                <span className="text-violet-400">📎</span>
                <span className="text-sm text-gray-300 truncate max-w-[250px]">{file.name}</span>
              </div>
            )}
          </div>

          <button
            onClick={handleUpload}
            disabled={loading || !file}
            className="w-full mt-6 py-4 rounded-xl bg-white text-black font-semibold text-sm hover:bg-gray-100 transition-all duration-200 disabled:opacity-40 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-gray-400 border-t-black rounded-full"
                />
                Analyzing...
              </>
            ) : (
              "Upload & Analyze"
            )}
          </button>

          {/* Analysis Results */}
          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-10 space-y-6"
            >
              {/* ATS Score */}
              <div className="glass-strong rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold">ATS Score</h2>
                  <span className="text-3xl font-bold gradient-text">{analysis.atsScore}</span>
                </div>
                <ScoreBar score={analysis.atsScore} />
              </div>

              {/* Skills */}
              {analysis.skills?.length > 0 && (
                <div className="glass-strong rounded-xl p-6">
                  <h2 className="text-base font-semibold mb-4">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {analysis.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-violet-500/10 text-violet-300 border border-violet-500/15"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Technologies */}
              {analysis.technologies?.length > 0 && (
                <div className="glass-strong rounded-xl p-6">
                  <h2 className="text-base font-semibold mb-4">Technologies</h2>
                  <div className="flex flex-wrap gap-2">
                    {analysis.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/15"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience */}
              {analysis.experience?.length > 0 && (
                <div className="glass-strong rounded-xl p-6">
                  <h2 className="text-base font-semibold mb-4">Experience</h2>
                  <div className="space-y-4">
                    {analysis.experience.map((exp, i) => (
                      <div key={i} className="border-l-2 border-violet-500/30 pl-4 py-1">
                        <h3 className="text-sm font-semibold text-white">{exp.role}</h3>
                        <p className="text-xs text-gray-400 mb-2">{exp.company} • {exp.duration}</p>
                        <ul className="space-y-1">
                          {exp.description?.map((desc, j) => (
                            <li key={j} className="text-xs text-gray-300 list-disc ml-4 leading-relaxed">{desc}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {analysis.projects?.length > 0 && (
                <div className="glass-strong rounded-xl p-6">
                  <h2 className="text-base font-semibold mb-4">Projects</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {analysis.projects.map((project, i) => (
                      <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-4 hover:border-white/[0.1] transition-all">
                        <h3 className="text-sm font-semibold text-cyan-300 mb-1.5">{project.name}</h3>
                        <p className="text-xs text-gray-400 leading-relaxed">{project.summary}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Strengths & Weaknesses */}
              <div className="grid md:grid-cols-2 gap-4">
                {analysis.strengths?.length > 0 && (
                  <div className="glass-strong rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-2 h-2 rounded-full bg-green-400" />
                      <h2 className="text-sm font-semibold">Strengths</h2>
                    </div>
                    <ul className="space-y-2">
                      {analysis.strengths.map((s, i) => (
                        <li key={i} className="text-sm text-gray-300 flex gap-2">
                          <span className="text-green-400 shrink-0">✓</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {analysis.weaknesses?.length > 0 && (
                  <div className="glass-strong rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-2 h-2 rounded-full bg-red-400" />
                      <h2 className="text-sm font-semibold">Weaknesses</h2>
                    </div>
                    <ul className="space-y-2">
                      {analysis.weaknesses.map((w, i) => (
                        <li key={i} className="text-sm text-gray-300 flex gap-2">
                          <span className="text-red-400 shrink-0">✗</span> {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ResumeUploadPage;