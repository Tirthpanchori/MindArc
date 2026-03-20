import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  BarChart2,
  Copy,
  Clock,
  Map,
  Users,
  ArrowRight,
  Layout,
  BookOpen,
  ArrowLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";
import Loader from "../../components/Loader";

function RecentTeacherQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortUser, setSortUser] = useState("newest"); // "newest", "oldest", "attempts"
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await api.get("/quiz/recent-quizzes/");
        setQuizzes(res.data);
      } catch (err) {
        console.error("Error fetching teacher quizzes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    // Optional: Add toast notification Logic here
  };

  // Filter & Sort Logic
  const filteredQuizzes = useMemo(() => {
    let filtered = quizzes.filter(
      (q) =>
        q.title.toLowerCase().includes(search.toLowerCase()) ||
        q.code.toLowerCase().includes(search.toLowerCase()),
    );

    if (sortUser === "newest") {
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortUser === "oldest") {
      filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else if (sortUser === "attempts") {
      filtered.sort((a, b) => b.attempts_count - a.attempts_count);
    }

    return filtered;
  }, [quizzes, search, sortUser]);

  // Summary Stats
  const totalAttempts = useMemo(
    () => quizzes.reduce((acc, curr) => acc + curr.attempts_count, 0),
    [quizzes],
  );
  const activeQuizzesCount = useMemo(
    () => quizzes.filter((q) => q.attempts_count > 0).length,
    [quizzes],
  );

  return (
    <div className="min-h-screen bg-[#0f1117] text-white font-space-grotesk selection:bg-[#F59E0B] selection:text-[#0f1117] p-6 md:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <button
          onClick={() => navigate("/teacher")}
          className="text-[#9CA3AF] hover:text-white text-sm font-bold flex items-center gap-2 transition-colors mb-2 uppercase tracking-wider"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#1a1d27] pb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <BookOpen className="text-[#F59E0B]" size={32} />
              My <span className="text-[#F59E0B]">Library</span>
            </h1>
            <p className="text-[#9CA3AF] font-medium">
              Manage your quizzes, track attempts, and analyze performance.
            </p>
          </div>

          <button
            onClick={() => navigate("/create-quiz")}
            className="px-5 py-2.5 rounded bg-[#F59E0B] text-[#0f1117] font-bold hover:bg-amber-400 transition-colors uppercase tracking-wider text-sm flex items-center gap-2"
          >
            + New Quiz
          </button>
        </div>

        {/* Summary Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#1a1d27] border border-[#374151] p-6 rounded flex items-center justify-between">
            <div>
              <p className="text-[#9CA3AF] text-xs font-bold uppercase tracking-widest mb-1">
                Total Quizzes
              </p>
              <p className="text-3xl font-bold text-white">{quizzes.length}</p>
            </div>
            <Layout className="text-[#F59E0B] w-6 h-6" />
          </div>
          <div className="bg-[#1a1d27] border border-[#374151] p-6 rounded flex items-center justify-between">
            <div>
              <p className="text-[#9CA3AF] text-xs font-bold uppercase tracking-widest mb-1">
                Total Attempts
              </p>
              <p className="text-3xl font-bold text-white">{totalAttempts}</p>
            </div>
            <Users className="text-[#F59E0B] w-6 h-6" />
          </div>
          <div className="bg-[#1a1d27] border border-[#374151] p-6 rounded flex items-center justify-between">
            <div>
              <p className="text-[#9CA3AF] text-xs font-bold uppercase tracking-widest mb-1">
                Active
              </p>
              <p className="text-3xl font-bold text-white">
                {activeQuizzesCount}
              </p>
            </div>
            <BarChart2 className="text-[#F59E0B] w-6 h-6" />
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 bg-[#1a1d27] p-2 rounded border border-[#374151]">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] w-5 h-5" />
            <input
              type="text"
              placeholder="Search by title or code..."
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
              <option value="attempts">Most Attempts</option>
            </select>
          </div>
        </div>

        {/* Quiz Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {loading ? (
              <div className="col-span-full">
                <Loader loading={loading} />
              </div>
            ) : filteredQuizzes.length > 0 ? (
              filteredQuizzes.map((quiz, i) => (
                <motion.div
                  key={quiz.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  className="group bg-[#1a1d27] border border-[#374151] hover:border-[#F59E0B] rounded p-6 relative flex flex-col justify-between transition-colors"
                >
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-6">
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                          quiz.attempts_count > 0
                            ? "bg-green-500/10 text-green-500 border border-green-500/20"
                            : "bg-[#0f1117] text-[#9CA3AF] border border-[#374151]"
                        }`}
                      >
                        {quiz.attempts_count > 0
                          ? `${quiz.attempts_count} Attempts`
                          : "No Attempts"}
                      </span>
                      <button
                        onClick={() => copyToClipboard(quiz.code)}
                        className="flex items-center gap-1.5 px-2 py-1 bg-[#0f1117] border border-[#374151] hover:border-[#F59E0B] rounded text-xs font-bold text-[#9CA3AF] hover:text-white transition-colors uppercase tracking-widest active:scale-95"
                        title="Copy Code"
                      >
                        {quiz.code}{" "}
                        <Copy size={12} className="text-[#F59E0B]" />
                      </button>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-4 line-clamp-2">
                      {quiz.title}
                    </h3>
                    <div className="flex items-center gap-4 text-xs font-bold text-[#9CA3AF] mb-8 uppercase tracking-wider mt-auto">
                      <span className="flex items-center gap-1.5">
                        <Clock size={14} className="text-[#F59E0B]" />{" "}
                        {new Date(quiz.created_at).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Layout size={14} className="text-[#F59E0B]" />{" "}
                        {quiz.total_questions} Questions
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        navigate(`/teacher/quiz/${quiz.id}/analysis`)
                      }
                      className="w-full py-3 rounded bg-[#0f1117] border border-[#374151] text-[#9CA3AF] font-bold text-sm uppercase tracking-wider hover:bg-[#374151] hover:text-white transition-colors flex items-center justify-between px-4 group/btn"
                    >
                      View Analysis
                      <ArrowRight
                        size={16}
                        className="group-hover/btn:translate-x-1 transition-transform text-[#F59E0B]"
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
                  No quizzes found
                </h3>
                <p className="text-[#9CA3AF] font-medium">
                  Try adjusting your search or filters.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default RecentTeacherQuizzes;
