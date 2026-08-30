import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const LandingPage = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleStart = () => {
    if (token) {
      navigate("/create-interview");
    } else {
      navigate("/register");
    }
  };

  const features = [
    {
      icon: "🎙️",
      title: "Voice AI Interview",
      desc: "Real-time conversational interviews powered by VAPI and Gemini 2.5 Flash.",
    },
    {
      icon: "📄",
      title: "Resume ATS Analysis",
      desc: "Upload your resume and get instant ATS scoring, skill extraction, and improvement tips.",
    },
    {
      icon: "📊",
      title: "Analytics Dashboard",
      desc: "Track performance trends, skill radar analysis, and improvement over time.",
    },
    {
      icon: "🧠",
      title: "AI Feedback Engine",
      desc: "Per-question evaluation with scores, strengths, weaknesses, and action items.",
    },
    {
      icon: "🎯",
      title: "Personalized Questions",
      desc: "Interview questions tailored to your resume, role, and seniority level.",
    },
    {
      icon: "⚡",
      title: "Instant Reports",
      desc: "Detailed interview reports generated immediately after each session ends.",
    },
  ];

  const steps = [
    { num: "01", title: "Upload Resume", desc: "Parse skills, projects, and experience for personalized interviews." },
    { num: "02", title: "Configure Interview", desc: "Set role, seniority, difficulty, and interview type." },
    { num: "03", title: "Voice Interview", desc: "Speak naturally with an AI interviewer in real-time." },
    { num: "04", title: "Get AI Feedback", desc: "Receive detailed scoring and improvement recommendations." },
  ];

  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      {/* Grid Pattern Background */}
      <div className="fixed inset-0 grid-pattern opacity-50" />
      
      {/* Gradient Orbs */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-violet-600/20 blur-[200px]" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-cyan-600/15 blur-[180px]" />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-sm mb-8 text-sm text-gray-400">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Powered by Gemini 2.5 Flash & VAPI
            </div>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] mb-8"
          >
            Ace Every
            <br />
            <span className="gradient-text">AI Interview</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Practice real-time voice interviews with an intelligent AI interviewer.
            Get instant feedback, ATS resume analysis, and track your progress.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={handleStart}
              className="group px-8 py-4 rounded-2xl bg-white text-black font-semibold text-base hover:bg-gray-100 transition-all duration-300 flex items-center gap-2 justify-center"
            >
              Start Interview
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
            {!localStorage.getItem("token") && (
              <button
                onClick={() => navigate("/login")}
                className="px-8 py-4 rounded-2xl border border-white/10 text-white font-medium text-base hover:bg-white/5 transition-all duration-300"
              >
                Sign In
              </button>
            )}
          </motion.div>
        </div>

        {/* Hero Visual */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={4}
          className="max-w-4xl mx-auto mt-20"
        >
          <div className="relative rounded-3xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm p-8 md:p-12 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
            
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Mock Interview UI */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-sm">
                    AI
                  </div>
                  <div>
                    <p className="text-sm font-medium">AI Interviewer</p>
                    <p className="text-xs text-green-400">Speaking...</p>
                  </div>
                </div>

                <div className="glass rounded-2xl p-4">
                  <p className="text-sm text-gray-300 leading-relaxed">
                    "Explain how JWT authentication works in a MERN stack application. What are the security considerations?"
                  </p>
                </div>

                <div className="glass-strong rounded-2xl p-4 border border-cyan-500/20">
                  <p className="text-xs text-cyan-400 mb-1">Your Response</p>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    "JWT works by generating a signed token on login that contains user claims..."
                  </p>
                </div>
              </div>

              {/* Score Preview */}
              <div className="flex flex-col items-center gap-6">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full animate-spin-slow" viewBox="0 0 128 128">
                    <circle cx="64" cy="64" r="56" stroke="rgba(139,92,246,0.15)" strokeWidth="2" fill="none" />
                    <circle cx="64" cy="64" r="56" stroke="url(#gradient)" strokeWidth="2" fill="none" strokeDasharray="280 72" strokeLinecap="round" />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#22d3ee" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="text-3xl font-bold">8.5</span>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-300">Overall Score</p>
                  <p className="text-xs text-gray-500 mt-1">AI-powered evaluation</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 md:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-sm uppercase tracking-[0.2em] text-violet-400 mb-4">Features</p>
            <h2 className="text-3xl md:text-5xl font-bold">Everything you need to prepare</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group glass rounded-2xl p-6 hover:bg-white/[0.04] transition-all duration-500 cursor-default"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-24 md:py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-400 mb-4">Process</p>
            <h2 className="text-3xl md:text-5xl font-bold">How it works</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative"
              >
                <span className="text-6xl font-black text-white/[0.04] block mb-4">{step.num}</span>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 md:py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to level up your interviews?
            </h2>
            <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
              Join thousands of candidates using AI to prepare for their dream roles.
            </p>
            <button
              onClick={handleStart}
              className="px-10 py-5 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-600 font-semibold text-lg hover:opacity-90 transition-opacity duration-300"
            >
              Start Your First Interview
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">© 2026 PrepWise AI. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="text-sm text-gray-500 hover:text-gray-300 cursor-pointer transition">Privacy</span>
            <span className="text-sm text-gray-500 hover:text-gray-300 cursor-pointer transition">Terms</span>
            <span className="text-sm text-gray-500 hover:text-gray-300 cursor-pointer transition">Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;