import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Target, Play } from "lucide-react";
import api from "../../services/api";

function AttemptQuiz() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleStartQuiz = async () => {
    if (!code.trim()) {
      setError("Please enter a quiz code.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await api.post("/attempts/verify-code/", { code });
      const quiz = res.data.quiz;
      navigate(`/quiz/${quiz.quiz_id}/start`, { state: { quiz } });
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to verify quiz code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#0f1117] font-space-grotesk selection:bg-[#F59E0B] selection:text-[#0f1117] p-6">
      <div className="bg-[#1a1d27] border border-[#374151] p-10 rounded max-w-sm w-full text-center shadow-2xl relative overflow-hidden">
        
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#F59E0B]/5 rounded-full blur-[50px] pointer-events-none" />

        <div className="flex justify-center mb-6 relative z-10">
          <div className="p-4 bg-[#0f1117] border border-[#374151] rounded text-[#F59E0B]">
            <Target size={32} strokeWidth={2.5} />
          </div>
        </div>

        <h2 className="text-white mb-2 text-2xl font-bold tracking-tight relative z-10">
          Enter Quiz Code
        </h2>
        <p className="text-[#9CA3AF] text-sm font-medium mb-8 relative z-10">
          Paste the unique code provided by your teacher
        </p>

        <div className="relative z-10">
          <input
            type="text"
            placeholder="e.g. X7AB9Q"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="w-full p-4 border border-[#374151] bg-[#0f1117] rounded text-white outline-none text-center tracking-[0.2em] font-bold uppercase transition-colors focus:border-[#F59E0B] placeholder:text-[#374151] mb-6"
          />

          <button
            onClick={handleStartQuiz}
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 font-bold uppercase tracking-wider text-sm px-6 py-4 rounded transition-colors ${
              loading
                ? "bg-[#374151] text-[#9CA3AF] cursor-not-allowed"
                : "bg-[#F59E0B] text-[#0f1117] hover:bg-amber-400"
            }`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-[#9CA3AF] border-t-transparent rounded-full animate-spin" /> Checking
              </span>
            ) : (
              <>
                <Play size={16} fill="currentColor" /> Start Quiz
              </>
            )}
          </button>

          {error && (
            <p className="text-red-500 mt-4 font-bold text-sm bg-red-500/5 py-2 rounded border border-red-500/20">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AttemptQuiz;
