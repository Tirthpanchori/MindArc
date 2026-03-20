import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Search, Filter, Copy, Users, Trophy, Target, ArrowRight, Clock, User, Layout, ChevronDown, ArrowLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";

function StudentsAttempts() {
  const { id: quizId } = useParams();
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [sortUser, setSortUser] = useState("latest");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const res = await api.get(`/quiz/${quizId}/attempts/`);
        setQuizData(res.data);
      } catch (err) { setError("Could not load student attempts."); } 
      finally { setLoading(false); }
    };
    fetchAttempts();
  }, [quizId]);

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
  };

  const stats = useMemo(() => {
    if (!quizData?.attempts || quizData.attempts.length === 0) return { avg: 0, highest: 0 };
    const scores = quizData.attempts.map(a => a.score);
    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const highest = Math.max(...scores);
    return { avg, highest };
  }, [quizData]);

  const filteredAttempts = useMemo(() => {
    if (!quizData?.attempts) return [];
    let filtered = quizData.attempts.filter(a => a.student_name.toLowerCase().includes(search.toLowerCase()));
    if (sortUser === "latest") filtered.sort((a, b) => new Date(b.attempted_at) - new Date(a.attempted_at));
    else if (sortUser === "highest") filtered.sort((a, b) => b.score - a.score);
    else if (sortUser === "lowest") filtered.sort((a, b) => a.score - b.score);
    return filtered;
  }, [quizData, search, sortUser]);

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-500 bg-green-500/10 border-green-500/20";
    if (score >= 60) return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
    return "text-red-500 bg-red-500/10 border-red-500/20";
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center font-space-grotesk">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-[#374151] border-t-[#F59E0B] rounded-full animate-spin" />
        <p className="text-[#9CA3AF] font-bold tracking-widest uppercase text-sm">Loading Attempts...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center font-space-grotesk p-6">
       <div className="text-center">
          <p className="text-red-500 mb-4 font-bold">{error}</p>
          <button onClick={() => navigate("/recent-teacher-quizzes")} className="px-5 py-2.5 rounded bg-[#1a1d27] border border-[#374151] text-[#9CA3AF] hover:text-white uppercase tracking-wider text-sm font-bold">Go Back</button>
       </div>
    </div>
  );

  const { quiz_title, quiz_code } = quizData || {};

  return (
    <div className="min-h-screen bg-[#0f1117] text-white font-space-grotesk selection:bg-[#F59E0B] selection:text-[#0f1117] p-6 md:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="space-y-6 border-b border-[#1a1d27] pb-6">
           <button onClick={() => navigate('/recent-teacher-quizzes')} className="text-[#9CA3AF] hover:text-white text-sm font-bold flex items-center gap-2 transition-colors uppercase tracking-wider">
             <ArrowLeft size={16} /> Back to Library
           </button>
           <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div>
                 <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-white tracking-tight">{quiz_title}</h1>
                    <button onClick={() => copyToClipboard(quiz_code)} className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#1a1d27] text-[#9CA3AF] border border-[#374151] hover:border-[#F59E0B] hover:text-white text-xs font-mono font-bold transition-colors uppercase tracking-widest">
                       {quiz_code} <Copy size={12} className="text-[#F59E0B]" />
                    </button>
                 </div>
                 <p className="text-[#9CA3AF] font-medium">View performance metrics and individual student results.</p>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
           <div className="bg-[#1a1d27] border border-[#374151] p-6 rounded flex items-center gap-4">
              <Users className="text-[#F59E0B] w-8 h-8" />
              <div>
                 <p className="text-[#9CA3AF] text-xs font-bold uppercase tracking-widest mb-1">Total Attempts</p>
                 <p className="text-3xl font-bold text-white">{quizData.total_attempts}</p>
              </div>
           </div>
           
           <div className="bg-[#1a1d27] border border-[#374151] p-6 rounded flex items-center gap-4">
              <Target className="text-[#F59E0B] w-8 h-8" />
              <div>
                 <p className="text-[#9CA3AF] text-xs font-bold uppercase tracking-widest mb-1">Avg Score</p>
                 <p className="text-3xl font-bold text-white">{stats.avg}%</p>
              </div>
           </div>

           <div className="bg-[#1a1d27] border border-[#374151] p-6 rounded flex items-center gap-4">
              <Trophy className="text-[#F59E0B] w-8 h-8" />
              <div>
                 <p className="text-[#9CA3AF] text-xs font-bold uppercase tracking-widest mb-1">Highest Score</p>
                 <p className="text-3xl font-bold text-white">{stats.highest}%</p>
              </div>
           </div>
        </div>

        <div className="bg-[#1a1d27] p-2 rounded border border-[#374151] flex flex-col md:flex-row gap-4">
           <div className="relative flex-1">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] w-5 h-5" />
             <input type="text" placeholder="Search student name..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-[#0f1117] border border-[#374151] rounded pl-10 pr-4 py-3 text-white outline-none focus:border-[#F59E0B] transition-colors placeholder:text-[#374151] font-medium" />
           </div>
           <div className="relative min-w-[200px]">
             <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] w-4 h-4" />
             <select value={sortUser} onChange={(e) => setSortUser(e.target.value)} className="w-full bg-[#0f1117] border border-[#374151] rounded pl-10 pr-10 py-3 text-white outline-none focus:border-[#F59E0B] appearance-none cursor-pointer font-medium transition-colors">
               <option value="latest">Latest First</option><option value="highest">Highest Score</option><option value="lowest">Lowest Score</option>
             </select>
             <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] w-4 h-4 pointer-events-none" />
           </div>
        </div>

        <div className="hidden md:block overflow-hidden rounded border border-[#374151] bg-[#1a1d27]">
           <table className="w-full text-left border-collapse">
              <thead className="bg-[#0f1117] text-[#9CA3AF] font-bold text-xs uppercase tracking-wider border-b border-[#374151]">
                 <tr><th className="px-6 py-4">Student Name</th><th className="px-6 py-4">Attempted At</th><th className="px-6 py-4">Score</th><th className="px-6 py-4 text-right">Action</th></tr>
              </thead>
              <tbody className="divide-y divide-[#374151]">
                 {filteredAttempts.length > 0 ? filteredAttempts.map((attempt) => (
                       <motion.tr key={attempt.attempt_id} layoutId={`row-${attempt.attempt_id}`} className="group hover:bg-[#374151]/20 transition-colors cursor-pointer" onClick={() => navigate(`/teacher/results/${attempt.attempt_id}`)}>
                          <td className="px-6 py-4">
                             <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded bg-[#0f1117] border border-[#374151] flex items-center justify-center text-white font-bold text-xs">
                                   {attempt.student_name.charAt(0).toUpperCase()}
                                </div>
                                <span className="font-bold text-white group-hover:text-[#F59E0B] transition-colors">{attempt.student_name}</span>
                             </div>
                          </td>
                          <td className="px-6 py-4 text-[#9CA3AF] text-sm font-medium">{new Date(attempt.attempted_at).toLocaleString()}</td>
                          <td className="px-6 py-4"><span className={`px-2.5 py-1 rounded text-xs font-bold border ${getScoreColor(attempt.score)}`}>{attempt.score}%</span></td>
                          <td className="px-6 py-4 text-right"><span className="text-xs font-bold text-[#F59E0B] opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider inline-flex items-center gap-1">Analysis <ArrowRight size={14} /></span></td>
                       </motion.tr>
                    )) : <tr><td colSpan="4" className="py-12 text-center text-[#9CA3AF] font-bold">{search ? "No students matching search." : "No attempts recorded."}</td></tr>
                 }
              </tbody>
           </table>
        </div>

        <div className="md:hidden space-y-4">
           {filteredAttempts.length > 0 ? filteredAttempts.map((attempt) => (
                 <div key={attempt.attempt_id} onClick={() => navigate(`/teacher/results/${attempt.attempt_id}`)} className="bg-[#1a1d27] border border-[#374151] rounded p-6 hover:border-[#F59E0B] transition-colors active:scale-95">
                    <div className="flex justify-between items-start mb-4">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded bg-[#0f1117] border border-[#374151] flex items-center justify-center text-white font-bold text-sm">
                             {attempt.student_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                             <h4 className="font-bold text-white">{attempt.student_name}</h4>
                             <p className="text-xs text-[#9CA3AF] font-bold tracking-wider uppercase mt-1 flex items-center gap-1"><Clock size={10} className="text-[#F59E0B]"/>{new Date(attempt.attempted_at).toLocaleDateString()}</p>
                          </div>
                       </div>
                       <span className={`px-2 py-1 rounded text-xs font-bold border ${getScoreColor(attempt.score)}`}>{attempt.score}%</span>
                    </div>
                    <button className="w-full py-3 rounded bg-[#0f1117] border border-[#374151] text-sm text-[#9CA3AF] font-bold uppercase tracking-wider hover:text-white flex items-center justify-center gap-2">Analysis <ArrowRight size={14} className="text-[#F59E0B]"/></button>
                 </div>
              )) : <div className="py-12 text-center text-[#9CA3AF] font-bold bg-[#1a1d27] border border-[#374151] rounded">{search ? "No students found." : "No attempts yet."}</div>
           }
        </div>

      </div>
    </div>
  );
}

export default StudentsAttempts;
