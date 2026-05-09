import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from "recharts";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import api from "../services/api";

const StatCard = ({ label, value, color }) => (
  <div className="glass rounded-2xl p-6 border border-white/[0.04]">
    <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">{label}</p>
    <p className={`text-3xl md:text-4xl font-bold ${color}`}>{value}</p>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="glass-strong rounded-lg px-4 py-3 text-xs">
        <p className="text-gray-400 mb-1">{label}</p>
        <p className="font-semibold text-white">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    const toastId = toast.loading("Loading analytics...");
    try {
      const response = await api.get("/analytics/overview");
      setAnalytics(response.data.analytics);
      toast.dismiss(toastId);
      toast.success("Analytics loaded");
    } catch (error) {
      console.log(error);
      toast.dismiss(toastId);
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-24 px-6">
        <div className="max-w-7xl mx-auto">
          <Skeleton height={50} className="mb-4" baseColor="#111" highlightColor="#1a1a2e" />
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass rounded-2xl p-6">
                <Skeleton height={20} baseColor="#111" highlightColor="#1a1a2e" />
                <Skeleton height={40} className="mt-3" baseColor="#111" highlightColor="#1a1a2e" />
              </div>
            ))}
          </div>
          <div className="glass rounded-2xl p-8">
            <Skeleton height={350} baseColor="#111" highlightColor="#1a1a2e" />
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 opacity-30">📊</div>
          <h2 className="text-2xl font-bold mb-2">Analytics Unavailable</h2>
          <p className="text-gray-500 text-sm">Complete interviews to see your analytics.</p>
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
          className="mb-10"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-violet-400 mb-3">Insights</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-1">Analytics</h1>
          <p className="text-gray-500 text-sm">Track performance and identify improvement areas.</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-10"
        >
          <StatCard label="Total Interviews" value={analytics.totalInterviews || 0} color="text-violet-400" />
          <StatCard label="Average Score" value={analytics.averageScore || 0} color="text-cyan-400" />
          <StatCard label="Best Score" value={analytics.bestScore || 0} color="text-pink-400" />
          <StatCard label="Most Practiced" value={analytics.mostPracticedMode || "N/A"} color="text-green-400" />
        </motion.div>

        {/* Score Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass rounded-2xl p-6 md:p-8 border border-white/[0.04] mb-8"
        >
          <h2 className="text-lg font-semibold mb-2">Score Trends</h2>
          <p className="text-xs text-gray-500 mb-8">Performance over time</p>

          <div className="w-full h-[300px] md:h-[400px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <LineChart data={analytics.recentScores || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="date" tick={{ fill: "#666", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#666", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ fill: "#8b5cf6", r: 4 }}
                  activeDot={{ r: 6, fill: "#a78bfa" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Topic Performance & Improvement */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass rounded-2xl p-6 md:p-8 border border-white/[0.04]"
          >
            <h2 className="text-lg font-semibold mb-6">Topic Performance</h2>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <BarChart data={analytics.topicAnalytics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="mode" tick={{ fill: "#666", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#666", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="score" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="glass rounded-2xl p-6 md:p-8 border border-white/[0.04]"
          >
            <h2 className="text-lg font-semibold mb-6">Skill Radar</h2>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <RadarChart
                  data={[
                    { skill: "Communication", score: Math.max(Number(analytics.averageScore) * 0.9, 1) },
                    { skill: "Problem Solving", score: Math.max(Number(analytics.averageScore) * 1.1, 1) },
                    { skill: "Technical", score: Math.max(Number(analytics.averageScore) * 1.05, 1) },
                    { skill: "Confidence", score: Math.max(Number(analytics.averageScore) * 0.95, 1) },
                    { skill: "System Design", score: Math.max(Number(analytics.averageScore) * 0.85, 1) },
                    { skill: "DSA", score: Math.max(Number(analytics.averageScore) * 0.8, 1) },
                  ]}
                >
                  <PolarGrid stroke="rgba(255,255,255,0.06)" />
                  <PolarAngleAxis dataKey="skill" tick={{ fill: "#666", fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                  <Radar name="Skills" dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} />
                  <Tooltip content={<CustomTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Performance Growth */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid md:grid-cols-2 gap-4"
        >
          <div className="glass rounded-2xl p-6 border border-white/[0.04]">
            <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Improvement</p>
            <p className="text-4xl font-bold text-green-400">{analytics.improvement}%</p>
          </div>
          <div className="glass rounded-2xl p-6 border border-white/[0.04]">
            <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Sessions Completed</p>
            <p className="text-4xl font-bold text-violet-400">{analytics.totalInterviews}</p>
          </div>
        </motion.div>

        {/* Empty State */}
        {analytics.recentScores?.length === 0 && (
          <div className="glass rounded-2xl p-10 text-center mt-10">
            <div className="text-5xl mb-4 opacity-30">📊</div>
            <h2 className="text-2xl font-bold mb-3">No Analytics Yet</h2>
            <p className="text-gray-500 text-sm">Complete interviews to generate analytics insights.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;