import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import api from "../services/api";

const ScoreRing = ({ score, label, color }) => {
  const pct = Math.min(score, 10) * 10;
  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-28 h-28">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.05)" strokeWidth="4" fill="none" />
          <motion.circle
            cx="50"
            cy="50"
            r="42"
            stroke={color}
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold">{score || 0}</span>
        </div>
      </div>
      <span className="text-xs font-medium text-gray-400">{label}</span>
    </div>
  );
};

const FeedbackPage = () => {
  const { id } = useParams();
  const [feedback, setFeedback] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchQuestions = async () => {
    try {
      const response = await api.get(`/questions/interview/${id}`);
      setQuestions(response.data.questions);
    } catch (error) {
      console.log(error);
      setQuestions([]);
    }
  };

  const fetchFeedback = async () => {
    const toastId = toast.loading("Loading AI feedback...");
    try {
      const response = await api.get(`/feedback/${id}`);
      setFeedback(response.data.feedback);
      toast.dismiss(toastId);
      toast.success("Feedback loaded");
    } catch (error) {
      console.log(error);
      toast.dismiss(toastId);
      toast.error("Failed to load feedback");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
    fetchQuestions();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-24 px-6">
        <div className="max-w-5xl mx-auto">
          <Skeleton height={50} className="mb-4" baseColor="#111" highlightColor="#1a1a2e" />
          <Skeleton height={20} className="mb-10" baseColor="#111" highlightColor="#1a1a2e" />
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="glass rounded-2xl p-8">
                <Skeleton height={100} baseColor="#111" highlightColor="#1a1a2e" />
              </div>
            ))}
          </div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass rounded-2xl p-8 mb-4">
              <Skeleton height={30} baseColor="#111" highlightColor="#1a1a2e" />
              <Skeleton count={4} className="mt-3" baseColor="#111" highlightColor="#1a1a2e" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!feedback) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 opacity-30">📋</div>
          <h2 className="text-2xl font-bold mb-2">Feedback Not Found</h2>
          <p className="text-gray-500 text-sm">This interview may not have been completed yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20 px-6">
      <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />

      <div className="relative max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs uppercase tracking-[0.2em] text-violet-400 mb-3">Report</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Interview Feedback</h1>
          <p className="text-gray-500 text-sm mb-10">AI-generated evaluation of your performance.</p>
        </motion.div>

        {/* Score Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass rounded-2xl p-8 mb-8"
        >
          <div className="flex flex-wrap justify-center gap-12">
            <ScoreRing score={feedback.technicalScore} label="Technical" color="#8b5cf6" />
            <ScoreRing score={feedback.communicationScore} label="Communication" color="#22d3ee" />
            <ScoreRing score={feedback.confidenceScore} label="Confidence" color="#ec4899" />
          </div>
        </motion.div>

        {/* Overall Feedback */}
        {feedback.overallFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass rounded-2xl p-6 md:p-8 mb-6"
          >
            <h2 className="text-lg font-semibold mb-4">Overall Feedback</h2>
            <p className="text-sm text-gray-300 leading-7">{feedback.overallFeedback}</p>
          </motion.div>
        )}

        {/* Strengths & Weaknesses side by side */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              <h2 className="text-base font-semibold">Strengths</h2>
            </div>
            <ul className="space-y-2.5">
              {feedback.strengths?.length > 0 ? (
                feedback.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-gray-300 leading-6 flex gap-2">
                    <span className="text-green-400 mt-0.5 shrink-0">✓</span>
                    {s}
                  </li>
                ))
              ) : (
                <li className="text-sm text-gray-500">No strengths available</li>
              )}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              <h2 className="text-base font-semibold">Weaknesses</h2>
            </div>
            <ul className="space-y-2.5">
              {feedback.weaknesses?.length > 0 ? (
                feedback.weaknesses.map((w, i) => (
                  <li key={i} className="text-sm text-gray-300 leading-6 flex gap-2">
                    <span className="text-red-400 mt-0.5 shrink-0">✗</span>
                    {w}
                  </li>
                ))
              ) : (
                <li className="text-sm text-gray-500">No weaknesses available</li>
              )}
            </ul>
          </motion.div>
        </div>

        {/* Recommendations */}
        {feedback.recommendations?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="glass rounded-2xl p-6 mb-10"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <h2 className="text-base font-semibold">Recommendations</h2>
            </div>
            <ul className="space-y-2.5">
              {feedback.recommendations.map((r, i) => (
                <li key={i} className="text-sm text-gray-300 leading-6 flex gap-2">
                  <span className="text-cyan-400 mt-0.5 shrink-0">→</span>
                  {r}
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Per Question Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-xl font-bold mb-6">Per Question Analysis</h2>

          <div className="space-y-4">
            {(feedback.perQuestionFeedback?.length ? feedback.perQuestionFeedback : questions).map(
              (question, index) => (
                <details
                  key={question._id || index}
                  className="glass rounded-2xl overflow-hidden group"
                >
                  <summary className="p-6 cursor-pointer flex items-center justify-between hover:bg-white/[0.02] transition">
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-mono text-gray-500 w-6">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-sm font-medium line-clamp-1">
                        {question.question}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-4">
                      <span className="px-3 py-1 rounded-lg text-[11px] font-medium bg-violet-500/10 text-violet-400 border border-violet-500/20">
                        {question.score || 0}/10
                      </span>
                      <span className="text-gray-500 group-open:rotate-180 transition-transform">▾</span>
                    </div>
                  </summary>

                  <div className="px-6 pb-6 space-y-5 border-t border-white/[0.04] pt-5">
                    {/* Answer */}
                    <div>
                      <p className="text-xs uppercase tracking-wider text-cyan-400 mb-2">Your Answer</p>
                      <p className="text-sm text-gray-300 leading-6">
                        {question.answerTranscript || question.answer || "No answer recorded."}
                      </p>
                    </div>

                    {/* AI Feedback */}
                    {question.feedback && (
                      <div>
                        <p className="text-xs uppercase tracking-wider text-violet-400 mb-2">AI Feedback</p>
                        <p className="text-sm text-gray-300 leading-6">{question.feedback}</p>
                      </div>
                    )}

                    {/* Strengths & Improvements */}
                    <div className="grid md:grid-cols-2 gap-4">
                      {question.strengths?.length > 0 && (
                        <div>
                          <p className="text-xs uppercase tracking-wider text-green-400 mb-2">Strengths</p>
                          <ul className="space-y-1.5">
                            {question.strengths.map((s, i) => (
                              <li key={i} className="text-sm text-gray-400 flex gap-1.5">
                                <span className="text-green-400">✓</span> {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {(question.improvements || question.weaknesses)?.length > 0 && (
                        <div>
                          <p className="text-xs uppercase tracking-wider text-red-400 mb-2">Improvements</p>
                          <ul className="space-y-1.5">
                            {(question.improvements || question.weaknesses).map((w, i) => (
                              <li key={i} className="text-sm text-gray-400 flex gap-1.5">
                                <span className="text-red-400">→</span> {w}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </details>
              )
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FeedbackPage;