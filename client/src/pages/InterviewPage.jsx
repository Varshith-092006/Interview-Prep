import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Vapi from "@vapi-ai/web";
import api from "../services/api";

const VapiConstructor = typeof Vapi === "function" ? Vapi : Vapi?.default;

const WAVE_COUNT = 48;

const InterviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const vapiRef = useRef(null);
  const endedReasonRef = useRef("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState("Ready to begin");
  const [elapsed, setElapsed] = useState(0);
  const [questionProgress, setQuestionProgress] = useState({ asked: 0, total: 0 });
  const timerRef = useRef(null);

  // Timer
  useEffect(() => {
    if (isLive) {
      timerRef.current = setInterval(() => setElapsed((p) => p + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isLive]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  // Cleanup VAPI on unmount
  useEffect(() => {
    return () => {
      if (vapiRef.current) {
        try {
          vapiRef.current.removeAllListeners();
          vapiRef.current.stop();
        } catch (error) {
          console.log("VAPI cleanup:", error);
        } finally {
          vapiRef.current = null;
        }
      }
    };
  }, []);

  // Persist transcript
  const persistTranscriptTurn = useCallback(async (message) => {
    const roleRaw = message?.role || message?.speaker || message?.from;
    const content = message?.transcript || message?.content || message?.text;
    const isFinal = message?.isFinal ?? true;
    const speaker = roleRaw === "assistant" || roleRaw === "AI" ? "AI" : "User";
    const isQuestion = speaker === "AI" && typeof content === "string" && content.trim().endsWith("?");

    if (!content || typeof content !== "string") return;

    const response = await api.post(`/realtime-interview/event/${id}`, {
      speaker,
      text: content.trim(),
      isFinal,
      isQuestion,
    });

    if (isQuestion) {
      setQuestionProgress((prev) => ({ ...prev, asked: prev.asked + 1 }));
    }

    if (response.data?.shouldEndInterview) {
      await stopInterview(true);
    }
  }, [id]);

  // Attach VAPI listeners
  const attachVapiListeners = useCallback(() => {
    const vapi = vapiRef.current;
    if (!vapi) return;

    vapi.on("call-start", () => {
      setIsLive(true);
      setIsConnecting(false);
      setCallStatus("Interview in progress");
    });

    vapi.on("call-end", () => {
      setIsLive(false);
      setIsAiSpeaking(false);
      setIsUserSpeaking(false);
      const reasonText = endedReasonRef.current
        ? `Session ended: ${endedReasonRef.current}`
        : "Session ended";
      setCallStatus(reasonText);
      
      // When the AI natively ends the call, trigger the feedback flow
      stopInterview(true);
    });

    vapi.on("speech-start", () => setIsAiSpeaking(true));
    vapi.on("speech-end", () => setIsAiSpeaking(false));

    vapi.on("message", async (message) => {
      const type = message?.type || "";

      if (type === "status-update" && message?.status === "ended") {
        endedReasonRef.current = message?.endedReason || "completed";
      }

      if (type.includes("transcript")) {
        await persistTranscriptTurn(message);
      }

      if (type.includes("user")) {
        setIsUserSpeaking(true);
      } else {
        setIsUserSpeaking(false);
      }
    });

    vapi.on("error", (error) => {
      // Safely extract error message — VAPI error can be object, string, or nested
      let msg = "Voice session error";
      try {
        if (typeof error === "string") {
          msg = error;
        } else if (error?.error?.message) {
          msg = typeof error.error.message === "string" ? error.error.message : JSON.stringify(error.error.message);
        } else if (error?.message) {
          msg = typeof error.message === "string" ? error.message : JSON.stringify(error.message);
        } else {
          msg = JSON.stringify(error);
        }
      } catch {
        msg = "Unknown VAPI error";
      }

      console.warn("VAPI error:", msg);
      setIsConnecting(false);

      // "Meeting has ended" is a normal end-of-call signal, not a real error
      const msgLower = String(msg).toLowerCase();
      if (msgLower.includes("meeting has ended") || msgLower.includes("meeting ended")) {
        setCallStatus("Session ended");
        return;
      }

      setCallStatus("Connection error");
      toast.error(String(msg).slice(0, 120) || "Voice session failed");
    });
  }, [persistTranscriptTurn]);

  // Start interview
  const startInterview = async () => {
    const toastId = toast.loading("Initializing voice interview...");
    try {
      setIsConnecting(true);
      setElapsed(0);
      endedReasonRef.current = "";

      if (vapiRef.current) {
        try {
          vapiRef.current.removeAllListeners();
          await vapiRef.current.stop();
        } catch (e) {
          console.log("Previous cleanup:", e);
        } finally {
          vapiRef.current = null;
        }
      }

      // Fetch session config from backend
      const { data } = await api.post(`/realtime-interview/session/${id}`);
      const publicKey = import.meta.env.VITE_VAPI_PUBLIC_KEY || data.vapiPublicKey;

      if (!publicKey) {
        throw new Error("Missing VAPI Public Key. Set VITE_VAPI_PUBLIC_KEY in your .env file.");
      }

      setQuestionProgress({
        asked: 0,
        total: data?.interviewMeta?.totalQuestions || 0,
      });

      if (typeof VapiConstructor !== "function") {
        throw new Error("Invalid VAPI SDK");
      }

      vapiRef.current = new VapiConstructor(publicKey, undefined, { avoidEval: true }, { startAudioOff: false });
      attachVapiListeners();
      setCallStatus("Connecting...");

      // Build a TRANSIENT (inline) assistant — no pre-created assistant or workflow needed.
      // This gives us full control over the system prompt, model, voice, and transcriber.
      const assistantConfig = {
        name: `${data.interviewMeta?.role || "AI"} Interviewer`,
        firstMessage: data.firstMessage,
        model: {
          provider: "openai",
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: data.systemPrompt,
            },
          ],
        },
        voice: {
          provider: "openai",
          voiceId: "alloy",
        },
        endCallFunctionEnabled: true,
      };

      // Allow env var overrides for model/voice
      if (import.meta.env.VITE_VAPI_MODEL_PROVIDER) {
        assistantConfig.model.provider = import.meta.env.VITE_VAPI_MODEL_PROVIDER;
      }
      if (import.meta.env.VITE_VAPI_MODEL) {
        assistantConfig.model.model = import.meta.env.VITE_VAPI_MODEL;
      }
      if (import.meta.env.VITE_VAPI_VOICE_PROVIDER) {
        assistantConfig.voice.provider = import.meta.env.VITE_VAPI_VOICE_PROVIDER;
      }
      if (import.meta.env.VITE_VAPI_VOICE_ID) {
        assistantConfig.voice.voiceId = import.meta.env.VITE_VAPI_VOICE_ID;
      }

      await vapiRef.current.start(assistantConfig);

      const daily = vapiRef.current.getDailyCallObject?.();
      if (daily?.updateInputSettings) {
        daily.updateInputSettings({ audio: { processor: { type: "none" } } });
      }

      toast.dismiss(toastId);
      toast.success("Voice interview started");
    } catch (error) {
      let errorMsg = "Could not start interview";
      try {
        errorMsg = error?.error?.message?.error?.message
          || error?.error?.message
          || error?.response?.data?.message
          || error?.message
          || "Could not start interview";
        if (typeof errorMsg !== "string") errorMsg = JSON.stringify(errorMsg);
      } catch {
        errorMsg = "Could not start interview";
      }
      console.warn("VAPI start error:", errorMsg);
      toast.dismiss(toastId);
      toast.error(String(errorMsg).slice(0, 120));
      setIsConnecting(false);
      setIsLive(false);
      setCallStatus("Failed to connect");
    }
  };

  // Stop interview
  const stopInterview = async (autoComplete = false) => {
    const toastId = toast.loading(autoComplete ? "Processing results..." : "Ending interview...");
    try {
      if (vapiRef.current) {
        await vapiRef.current.stop();
      }

      await api.post(`/realtime-interview/complete/${id}`);
      await api.post(`/feedback/generate/${id}`);

      toast.dismiss(toastId);
      toast.success("Interview completed");
      navigate(`/feedback/${id}`);
    } catch (error) {
      console.log(error);
      toast.dismiss(toastId);
      toast.error("Failed to process interview");
    }
  };

  // Visual state
  const activeEntity = useMemo(() => {
    if (isAiSpeaking) return "ai";
    if (isUserSpeaking) return "user";
    return "idle";
  }, [isAiSpeaking, isUserSpeaking]);

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]">
          <motion.div
            animate={{
              scale: activeEntity === "ai" ? 1.3 : activeEntity === "user" ? 1.1 : 1,
              opacity: activeEntity === "idle" ? 0.08 : 0.2,
            }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-600/30 to-cyan-600/20 blur-[120px]"
          />
        </div>
        <div className="absolute inset-0 grid-pattern opacity-30" />
      </div>

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-20">
        <div className="flex items-center justify-between px-6 md:px-10 py-5">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-[10px] font-bold">
              P
            </div>
            <span className="text-sm font-medium text-gray-400 hidden sm:block">PrepWise AI</span>
          </div>

          <div className="flex items-center gap-4">
            {isLive && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20"
              >
                <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                <span className="text-xs text-red-400 font-medium">{formatTime(elapsed)}</span>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Main Interview Visual */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6">
        {/* Status label */}
        <motion.p
          key={callStatus}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-10"
        >
          {callStatus}
        </motion.p>

        {/* Dual Orbs Container */}
        <div className="flex items-center justify-center gap-12 md:gap-24 mb-16">
          {/* AI Orb */}
          <div className="relative flex flex-col items-center">
            {/* AI Rings */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-20px] md:inset-[-30px] rounded-full border border-violet-500/20"
            />
            <AnimatePresence>
              {isAiSpeaking && (
                <>
                  {[0, 1].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0.8, opacity: 0.6 }}
                      animate={{ scale: 2, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.5, delay: i * 0.4, repeat: Infinity }}
                      className="absolute inset-0 rounded-full border border-violet-500/40"
                    />
                  ))}
                </>
              )}
            </AnimatePresence>

            {/* AI Orb Body */}
            <motion.div
              animate={{
                scale: isAiSpeaking ? [1, 1.05, 1] : 1,
                boxShadow: isAiSpeaking
                  ? "0 0 60px rgba(139,92,246,0.6)"
                  : "0 0 30px rgba(139,92,246,0.15)",
              }}
              transition={{
                scale: { duration: 1.2, repeat: isAiSpeaking ? Infinity : 0, ease: "easeInOut" },
              }}
              className={`relative w-28 h-28 md:w-40 md:h-40 rounded-full flex items-center justify-center transition-colors duration-500 ${
                isAiSpeaking
                  ? "bg-gradient-to-br from-violet-600 to-purple-900 border-violet-400"
                  : "bg-white/5 border-white/10"
              } border-2`}
            >
              <div className={`absolute inset-3 rounded-full transition-all duration-500 ${isAiSpeaking ? "bg-white/10" : "bg-transparent"}`} />
              <div className="relative z-10 text-3xl opacity-60">🤖</div>
            </motion.div>
            
            <div className="mt-8 flex flex-col items-center gap-1.5">
              <span className={`text-xs font-semibold tracking-wider uppercase transition-colors ${isAiSpeaking ? "text-violet-400" : "text-gray-500"}`}>
                AI Interviewer
              </span>
              <span className={`text-[10px] uppercase tracking-widest ${isAiSpeaking ? "text-violet-300" : "text-gray-600"}`}>
                {isAiSpeaking ? "Speaking" : "Waiting"}
              </span>
            </div>
          </div>

          {/* User Orb */}
          <div className="relative flex flex-col items-center">
            {/* User Rings */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-20px] md:inset-[-30px] rounded-full border border-cyan-500/20"
            />
            <AnimatePresence>
              {isUserSpeaking && (
                <>
                  {[0, 1].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0.8, opacity: 0.6 }}
                      animate={{ scale: 2, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.5, delay: i * 0.4, repeat: Infinity }}
                      className="absolute inset-0 rounded-full border border-cyan-500/40"
                    />
                  ))}
                </>
              )}
            </AnimatePresence>

            {/* User Orb Body */}
            <motion.div
              animate={{
                scale: isUserSpeaking ? [1, 1.05, 1] : 1,
                boxShadow: isUserSpeaking
                  ? "0 0 60px rgba(34,211,238,0.6)"
                  : "0 0 30px rgba(34,211,238,0.15)",
              }}
              transition={{
                scale: { duration: 1.2, repeat: isUserSpeaking ? Infinity : 0, ease: "easeInOut" },
              }}
              className={`relative w-28 h-28 md:w-40 md:h-40 rounded-full flex items-center justify-center transition-colors duration-500 ${
                isUserSpeaking
                  ? "bg-gradient-to-br from-cyan-600 to-blue-900 border-cyan-400"
                  : "bg-white/5 border-white/10"
              } border-2`}
            >
              <div className={`absolute inset-3 rounded-full transition-all duration-500 ${isUserSpeaking ? "bg-white/10" : "bg-transparent"}`} />
              <div className="relative z-10 text-3xl opacity-60">👤</div>
            </motion.div>

            <div className="mt-8 flex flex-col items-center gap-1.5">
              <span className={`text-xs font-semibold tracking-wider uppercase transition-colors ${isUserSpeaking ? "text-cyan-400" : "text-gray-500"}`}>
                You
              </span>
              <span className={`text-[10px] uppercase tracking-widest ${isUserSpeaking ? "text-cyan-300" : "text-gray-600"}`}>
                {isUserSpeaking ? "Speaking" : "Listening"}
              </span>
            </div>
          </div>
        </div>

        {/* Voice Waveform */}
        <div className="flex items-center justify-center gap-[3px] h-10 mb-12">
          {Array.from({ length: WAVE_COUNT }).map((_, i) => (
            <motion.div
              key={i}
              animate={{
                height: isLive
                  ? isAiSpeaking || isUserSpeaking
                    ? [4, 8 + Math.sin(i * 0.5) * 24 + Math.random() * 12, 4]
                    : [4, 6, 4]
                  : 4,
              }}
              transition={{
                duration: 0.4 + Math.random() * 0.3,
                repeat: Infinity,
                delay: i * 0.02,
                ease: "easeInOut",
              }}
              className={`w-[2px] rounded-full transition-colors duration-500 ${
                isAiSpeaking
                  ? "bg-violet-400/70"
                  : isUserSpeaking
                  ? "bg-cyan-400/70"
                  : "bg-white/10"
              }`}
              style={{ minHeight: "4px" }}
            />
          ))}
        </div>

        {/* Control Buttons */}
        <div className="flex items-center gap-4">
          {!isLive ? (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={startInterview}
              disabled={isConnecting}
              className="group px-10 py-4 rounded-2xl bg-white text-black font-semibold text-sm hover:bg-gray-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
            >
              {isConnecting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full"
                  />
                  Connecting...
                </>
              ) : (
                <>
                  <span className="text-base">🎙️</span>
                  Start Interview
                </>
              )}
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => stopInterview(false)}
              className="px-10 py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 font-semibold text-sm hover:bg-red-500/20 transition-all duration-200 flex items-center gap-3"
            >
              <span className="w-3 h-3 rounded-sm bg-red-400" />
              End Interview
            </motion.button>
          )}
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none z-10" />
    </div>
  );
};

export default InterviewPage;