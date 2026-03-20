import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Clock,
  ArrowRight,
  BookOpen,
  ArrowLeft,
  Trophy,
  Calendar,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";
import Loader from "../../components/Loader";

function RecentQuizzes() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortUser, setSortUser] = useState("newest"); // "newest", "oldest", "score_high", "score_low"
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        setLoading(true);
        const res = await api.get("/attempts/recent-quizzes/");
        setAttempts(res.data);
      } catch (error) {
        console.error("Error fetching recent quizzes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAttempts();
  }, []);

  // Filter & Sort Logic
  const filteredAttempts = useMemo(() => {
    let filtered = attempts.filter((a) =>
      a.quiz.title.toLowerCase().includes(search.toLowerCase()),
    );

    if (sortUser === "newest") {
      filtered.sort(
        (a, b) => new Date(b.attempted_at) - new Date(a.attempted_at),
      );
    } else if (sortUser === "oldest") {
      filtered.sort(
        (a, b) => new Date(a.attempted_at) - new Date(b.attempted_at),
      );
    } else if (sortUser === "score_high") {
      filtered.sort((a, b) => b.score - a.score);
    } else if (sortUser === "score_low") {
      filtered.sort((a, b) => a.score - b.score);
    }

    return filtered;
  }, [attempts, search, sortUser]);

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-500 border border-green-500/20";
    if (score >= 50) return "text-[#F59E0B] border border-[#F59E0B]/20";
    return "text-red-500 border border-red-500/20";
  };

  return (
    <div className="min-h-screen bg-[#0f1117] text-white font-space-grotesk selection:bg-[#F59E0B] selection:text-[#0f1117] p-6 md:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <button
          onClick={() => navigate("/student")}
          className="text-[#9CA3AF] hover:text-white text-sm font-bold flex items-center gap-2 transition-colors mb-2 uppercase tracking-wider"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#1a1d27] pb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <BookOpen className="text-[#F59E0B]" size={32} />
              My <span className="text-[#F59E0B]">Attempts</span>
            </h1>
            <p className="text-[#9CA3AF] font-medium">
              Review your past performance and analyze your results.
            </p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 bg-[#1a1d27] p-2 rounded border border-[#374151]">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] w-5 h-5" />
            <input
              type="text"
              placeholder="Search by quiz title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0f1117] border border-[#374151] rounded pl-10 pr-4 py-2.5 text-white outline-none focus:border-[#F59E0B] transition-colors placeholder:text-[#374151] font-medium"
            />
          </div>

          <div className="relative min-w-[200px]">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] w-4 h-4" />
            <select
              value={sortUser}
              onChange={(e) => setSortUser(e.target.value)}
              className="w-full bg-[#0f1117] border border-[#374151] rounded pl-10 pr-4 py-2.5 text-white outline-none focus:border-[#F59E0B] appearance-none cursor-pointer font-medium transition-colors"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="score_high">Highest Score</option>
              <option value="score_low">Lowest Score</option>
            </select>
          </div>
        </div>

        {/* Attempts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {loading ? (
              <Loader loading={loading} />
            ) : filteredAttempts.length > 0 ? (
              filteredAttempts.map((attempt, i) => (
                <motion.div
                  key={attempt.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  className="group bg-[#1a1d27] border border-[#374151] hover:border-[#F59E0B] rounded p-6 relative flex flex-col justify-between transition-colors"
                >
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-6">
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${getScoreColor(attempt.score)}`}
                      >
                        Score: {attempt.score}%
                      </span>
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-[#0f1117] border border-[#374151] rounded text-xs font-bold text-[#9CA3AF] uppercase tracking-widest">
                        <Clock size={10} className="text-[#F59E0B]" />
                        {new Date(attempt.attempted_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-4 line-clamp-2">
                      {attempt.quiz.title}
                    </h3>
                    <div className="flex items-center gap-4 text-xs font-bold text-[#9CA3AF] mb-8 uppercase tracking-wider mt-auto">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-[#F59E0B]" />{" "}
                        {new Date(attempt.attempted_at).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Trophy size={14} className="text-[#F59E0B]" /> Analyzed
                      </span>
                    </div>
                    <button
                      onClick={() => navigate(`/result/${attempt.id}`)}
                      className="w-full py-3 rounded bg-[#0f1117] border border-[#374151] text-[#9CA3AF] font-bold text-sm uppercase tracking-wider hover:bg-[#374151] hover:text-white transition-colors flex items-center justify-center gap-2 group/btn"
                    >
                      View Analysis
                      <ArrowRight
                        size={16}
                        className="group-hover/btn:translate-x-1 transition-transform"
                      />
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-[#0f1117] rounded flex items-center justify-center mb-4 border border-[#374151]">
                  <Search className="text-[#F59E0B] w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  No attempts found
                </h3>
                <p className="text-[#9CA3AF] font-medium">
                  Try adjusting your filters or attempt a new quiz from the
                  dashboard.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default RecentQuizzes;
