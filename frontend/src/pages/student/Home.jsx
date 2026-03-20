import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  LogOut, 
  Zap, 
  Clock, 
  Trophy, 
  Target, 
  ChevronRight, 
  AlertCircle, 
  CheckCircle2,
  BookOpen,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";

function HomeS() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [attempts, setAttempts] = useState([]);
  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState({ type: "", message: "" });
  
  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const res = await api.get("/attempts/recent-quizzes/");
        setAttempts(res.data);
      } catch (err) {
        console.error("Failed to fetch attempts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttempts();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("userId");
    navigate("/");
  };

  const handleJoinQuiz = async (e) => {
    e.preventDefault();
    if (!code) return;

    setVerifying(true);
    setVerifyStatus({ type: "", message: "" });

    try {
      const res = await api.post("/attempts/verify-code/", { code: code.toUpperCase() });
      setVerifyStatus({ type: "success", message: "Code verified Redirecting..." });
      
      setTimeout(() => {
        navigate(`/quiz/${res.data.quiz.quiz_id}/start`);
      }, 1000);
    } catch (err) {
      setVerifyStatus({ 
        type: "error", 
        message: err.response?.data?.detail || "Invalid code. Please try again." 
      });
    } finally {
      if (!code) setVerifying(false); 
      if (verifyStatus.type !== 'success') setVerifying(false); 
    }
  };

  // Compute Stats
  const stats = useMemo(() => {
    if (!attempts.length) return { total: 0, avg: 0, best: 0 };
    
    const scores = attempts.map(a => a.score);
    const total = attempts.length;
    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / total);
    const best = Math.max(...scores);

    return { total, avg, best };
  }, [attempts]);

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-400 border border-green-500/20";
    if (score >= 50) return "text-[#F59E0B] border border-[#F59E0B]/20";
    return "text-red-400 border border-red-500/20";
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center font-space-grotesk">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-[#374151] border-t-[#F59E0B] rounded-full animate-spin" />
        <p className="text-[#9CA3AF] font-bold text-sm tracking-widest uppercase">Loading...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f1117] text-white font-space-grotesk selection:bg-[#F59E0B] selection:text-[#0f1117] p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* 1) Top Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#1a1d27] pb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
               Student <span className="text-[#F59E0B]">Dashboard</span>
            </h1>
            <p className="text-[#9CA3AF] font-medium">Enter a quiz code below to start your attempt.</p>
          </div>
          <button 
            onClick={handleLogout}
            className="self-start md:self-center px-4 py-2 rounded bg-[#1a1d27] border border-[#374151] text-[#9CA3AF] hover:text-white hover:border-[#F59E0B] transition-all font-bold text-sm flex items-center gap-2 group"
          >
            <LogOut size={16} className="group-hover:-translate-x-0.5 transition-transform text-[#F59E0B]" /> Logout
          </button>
        </div>

        {/* 2) Main Hero Card (Join Quiz) */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1a1d27] border border-[#374151] rounded p-8 md:p-10 relative overflow-hidden"
        >
          <div className="relative z-10 text-center max-w-lg mx-auto">
             <div className="w-16 h-16 bg-[#0f1117] rounded flex items-center justify-center mx-auto mb-6 border border-[#374151]">
                <Zap className="text-[#F59E0B] w-8 h-8" />
             </div>
             
             <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">Join a Quiz</h2>
             <p className="text-[#9CA3AF] mb-8 font-medium">Enter the unique code shared by your teacher to begin.</p>

             <form onSubmit={handleJoinQuiz} className="space-y-4">
                <div className="relative">
                   <input 
                     type="text" 
                     placeholder="ENTER CODE" 
                     value={code}
                     onChange={(e) => {
                       setCode(e.target.value.toUpperCase());
                       setVerifyStatus({ type: "", message: "" });
                     }}
                     maxLength={10}
                     className={`w-full bg-[#0f1117] border-2 rounded px-6 py-4 text-center text-2xl font-bold tracking-widest outline-none transition-colors placeholder:text-[#374151] placeholder:font-bold placeholder:tracking-widest ${
                        verifyStatus.type === 'error' 
                        ? 'border-red-500/50 text-red-500 focus:border-red-500' 
                        : verifyStatus.type === 'success'
                        ? 'border-green-500/50 text-green-500'
                        : 'border-[#374151] text-white focus:border-[#F59E0B]'
                     }`}
                   />
                </div>

                {verifyStatus.message && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-sm font-bold flex items-center justify-center gap-2 ${
                       verifyStatus.type === 'success' ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                     {verifyStatus.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                     {verifyStatus.message}
                  </motion.div>
                )}

                <button 
                  disabled={!code || verifying}
                  type="submit"
                  className="w-full py-4 rounded bg-[#F59E0B] hover:bg-amber-400 text-[#0f1117] font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 mt-4 uppercase tracking-wider"
                >
                   {verifying && verifyStatus.type !== 'success' ? 'Verifying...' : 'Start Quiz'}
                   {!verifying && <ChevronRight size={20} />}
                </button>
             </form>
          </div>
        </motion.div>

        {/* 3) Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <motion.div 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="bg-[#1a1d27] border border-[#374151] p-6 rounded flex flex-col justify-between"
           >
              <div className="flex items-center justify-between mb-4">
                 <p className="text-[#9CA3AF] text-xs font-bold uppercase tracking-widest">Total Attempts</p>
                 <BookOpen size={18} className="text-[#F59E0B]" />
              </div>
              <p className="text-4xl font-bold text-white">{stats.total}</p>
           </motion.div>

           <motion.div 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="bg-[#1a1d27] border border-[#374151] p-6 rounded flex flex-col justify-between"
           >
              <div className="flex items-center justify-between mb-4">
                 <p className="text-[#9CA3AF] text-xs font-bold uppercase tracking-widest">Average Score</p>
                 <Target size={18} className="text-[#F59E0B]" />
              </div>
              <p className="text-4xl font-bold text-white">{stats.avg}%</p>
           </motion.div>

           <motion.div 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.3 }}
             className="bg-[#1a1d27] border border-[#374151] p-6 rounded flex flex-col justify-between"
           >
              <div className="flex items-center justify-between mb-4">
                 <p className="text-[#9CA3AF] text-xs font-bold uppercase tracking-widest">Best Score</p>
                 <Trophy size={18} className="text-[#F59E0B]" />
              </div>
              <p className="text-4xl font-bold text-white">{stats.best}%</p>
           </motion.div>
        </div>

        {/* 4) Recent Attempts Section */}
        <div className="space-y-6">
           <div className="flex items-center justify-between border-b border-[#1a1d27] pb-4">
             <h2 className="text-xl font-bold text-white flex items-center gap-2">
               Recent Attempts
             </h2>
             <Link to="/recent-quizzes" className="text-sm font-bold text-[#F59E0B] hover:text-amber-400 flex items-center gap-1 group uppercase tracking-wider">
               View All <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
             </Link>
           </div>

           {attempts.length === 0 ? (
              <div className="bg-[#1a1d27] border border-[#374151] rounded p-12 text-center">
                 <div className="w-16 h-16 bg-[#0f1117] border border-[#374151] rounded flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="text-[#F59E0B] w-8 h-8" />
                 </div>
                 <h3 className="text-lg font-bold text-white mb-2">No attempts yet</h3>
                 <p className="text-[#9CA3AF] font-medium">Enter a code above to start your first quiz!</p>
              </div>
           ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {attempts.slice(0, 5).map((attempt, i) => (
                    <motion.div
                       key={attempt.id}
                       initial={{ opacity: 0, y: 5 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: 0.4 + (i * 0.1) }}
                       className="bg-[#1a1d27] border border-[#374151] rounded p-5 hover:border-[#F59E0B] transition-colors group flex flex-col justify-between"
                    >
                       <div className="flex justify-between items-start mb-6">
                          <div>
                             <h3 className="font-bold text-white mb-2 line-clamp-1">{attempt.quiz.title}</h3>
                             <p className="text-xs text-[#9CA3AF] font-medium flex items-center gap-1.5 uppercase tracking-wider">
                                <Clock size={12} className="text-[#F59E0B]" /> {new Date(attempt.attempted_at).toLocaleDateString()}
                             </p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-bold ${getScoreColor(attempt.score)}`}>
                             {attempt.score}%
                          </span>
                       </div>
                       
                       <button 
                         onClick={() => navigate(`/result/${attempt.id}`)}
                         className="w-full py-2.5 rounded bg-[#0f1117] border border-[#374151] text-[#9CA3AF] font-bold text-xs uppercase tracking-wider hover:bg-[#374151] hover:text-white transition-colors flex items-center justify-center gap-2"
                       >
                         View Result <ChevronRight size={14} />
                       </button>
                    </motion.div>
                 ))}
              </div>
           )}
        </div>

      </div>
    </div>
  );
}

export default HomeS;
