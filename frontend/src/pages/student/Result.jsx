import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft, Brain, CheckCircle2, XCircle, Clock, Calendar, Mail, Award,
  AlertTriangle, Lightbulb, Target, BookOpen, BarChart2, List, Sparkles,
  RefreshCw, ChevronDown, ChevronUp, HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";


function ResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: attemptId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);
  const [expandedTopics, setExpandedTopics] = useState({});

  const fmtPercent = (n) => typeof n === "number" ? `${n.toFixed(0)}%` : "-";

  useEffect(() => {
    async function load() {
      setLoading(true);
      if (location.state) {
        setResult(location.state);
        try { localStorage.setItem("lastAttempt", JSON.stringify(location.state)); } catch (e) {}
        setLoading(false); return;
      }
      if (attemptId) {
        try {
          const res = await api.get(`/attempts/result/${attemptId}/`);
          setResult(res.data);
          try { localStorage.setItem("lastAttempt", JSON.stringify(res.data)); } catch (e) {}
        } catch (err) { setResult(null); } 
        finally { setLoading(false); }
        return;
      }
      try {
        const saved = localStorage.getItem("lastAttempt");
        if (saved) setResult(JSON.parse(saved));
        else setResult(null);
      } catch (e) { setResult(null); } 
      finally { setLoading(false); }
    }
    load();
  }, [attemptId, location.state]);

  useEffect(() => {
    if (showAnalysis && !aiAnalysis && !loadingAnalysis) fetchAiAnalysis();
  }, [showAnalysis]);

  const fetchAiAnalysis = async () => {
    if (!result || !result.results) { setAnalysisError("No quiz data available."); return; }
    setLoadingAnalysis(true); setAnalysisError(null);
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/ai/analyze-weak-topics/`, 
        { quiz_results: result.results },
        { headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) } }
      );
      if (response.data && (response.data.success || Object.keys(response.data).length)) setAiAnalysis(response.data);
      else setAnalysisError(response.data?.error || "Analysis failed.");
    } catch (error) { setAnalysisError("Failed to analyze topics. Please try again."); } 
    finally { setLoadingAnalysis(false); }
  };

  const toggleTopic = (idx) => setExpandedTopics(prev => ({ ...prev, [idx]: !prev[idx] }));
  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case "critical": return "border-red-500 bg-red-500/5 text-red-500";
      case "high": return "border-orange-500 bg-orange-500/5 text-orange-500";
      case "moderate": return "border-yellow-500 bg-yellow-500/5 text-yellow-500";
      default: return "border-[#374151] bg-[#0f1117] text-[#9CA3AF]";
    }
  };
  const getQuestionStatus = (q) => {
    if (!q.selected_option) return "unattempted";
    return q.is_correct ? "correct" : "wrong";
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center font-space-grotesk">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-[#374151] border-t-[#F59E0B] rounded-full animate-spin" />
        <p className="text-[#9CA3AF] font-bold tracking-widest uppercase text-sm">Loading Result...</p>
      </div>
    </div>
  );

  if (!result) return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center font-space-grotesk p-6">
      <div className="text-center">
        <p className="text-red-500 mb-4 font-bold">No result data found.</p>
        <button onClick={() => navigate('/student')} className="px-5 py-2.5 rounded bg-[#1a1d27] border border-[#374151] text-[#9CA3AF] hover:text-white uppercase tracking-wider text-sm font-bold">Dashboard</button>
      </div>
    </div>
  );

  const { quiz_title, student_name, student_email, attempted_at, score, correct_answers, total_questions, results } = result;

  return (
    <div className="min-h-screen bg-[#0f1117] text-white font-space-grotesk selection:bg-[#F59E0B] selection:text-[#0f1117] p-6 md:p-8 lg:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <button onClick={() => navigate('/recent-quizzes')} className="text-[#9CA3AF] hover:text-white text-sm font-bold flex items-center gap-2 transition-colors uppercase tracking-wider mb-2">
          <ArrowLeft size={16} /> Back to Attempts
        </button>

        <div className="bg-[#1a1d27] border border-[#374151] rounded p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">{quiz_title || "Quiz Result"}</h1>
              <span className="px-3 py-1 rounded border border-[#F59E0B] text-[#F59E0B] bg-[#F59E0B]/5 text-xs font-bold uppercase tracking-widest">Completed</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-[#9CA3AF] text-sm font-bold uppercase tracking-wider mt-4">
              {student_name && (
                <span className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-[#0f1117] border border-[#374151] flex items-center justify-center text-xs">
                    {student_name.charAt(0).toUpperCase()}
                  </div>
                  {student_name}
                </span>
              )}
              {attempted_at && (
                <span className="flex items-center gap-1.5"><Calendar size={14} className="text-[#F59E0B]"/> {new Date(attempted_at).toLocaleString()}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-6 bg-[#0f1117] p-4 rounded border border-[#374151]">
            <div className="text-center">
              <p className="text-xs text-[#9CA3AF] font-bold uppercase tracking-widest mb-1">Score</p>
              <p className={`text-3xl font-bold ${score >= 60 ? "text-green-500" : "text-red-500"}`}>{typeof score === "number" ? fmtPercent(score) : score ?? "-"}</p>
            </div>
            <div className="w-px h-10 bg-[#374151]" />
            <div className="text-center">
              <p className="text-xs text-[#9CA3AF] font-bold uppercase tracking-widest mb-1">Correct</p>
              <p className="text-xl font-bold text-white">{correct_answers} <span className="text-[#374151] text-sm">/ {total_questions}</span></p>
            </div>
          </div>
        </div>

        <div className="flex p-1 bg-[#1a1d27] border border-[#374151] rounded w-full max-w-md mx-auto md:mx-0">
          <button onClick={() => setShowAnalysis(false)} className={`flex-1 py-2.5 px-4 rounded text-sm font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 ${!showAnalysis ? "bg-[#0f1117] text-white border border-[#374151]" : "text-[#9CA3AF] hover:text-white"}`}>
            <List size={16} /> Detailed Review
          </button>
          <button onClick={() => setShowAnalysis(true)} className={`flex-1 py-2.5 px-4 rounded text-sm font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 ${showAnalysis ? "bg-[#F59E0B] text-[#0f1117]" : "text-[#9CA3AF] hover:text-white"}`}>
            <Sparkles size={16} /> AI Insights
          </button>
        </div>

        <AnimatePresence mode="wait">
          {!showAnalysis ? (
            <motion.div key="detailed" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="space-y-4">
              {results && results.length > 0 ? results.map((q, i) => {
                const status = getQuestionStatus(q);
                return (
                  <div key={q.question_id ?? i} className="bg-[#1a1d27] border border-[#374151] rounded p-6 hover:border-[#F59E0B] transition-colors">
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <h4 className="text-lg font-bold text-white"><span className="text-[#374151] mr-2 text-sm">{i + 1}.</span> {q.question_text}</h4>
                      <span className={`flex-shrink-0 px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider border flex items-center gap-1.5 ${status === "correct" ? "bg-green-500/5 text-green-500 border-green-500/20" : status === "unattempted" ? "bg-[#0f1117] text-[#9CA3AF] border-[#374151]" : "bg-red-500/5 text-red-500 border-red-500/20"}`}>
                        {status === "correct" && <CheckCircle2 size={12} />}
                        {status === "wrong" && <XCircle size={12} />}
                        {status === "unattempted" && <HelpCircle size={12} />}
                        {status === "correct" && "Correct"}
                        {status === "wrong" && "Wrong"}
                        {status === "unattempted" && "Missed"}
                      </span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 text-sm font-medium">
                      <div className={`p-4 rounded border ${status === "correct" ? "bg-green-500/5 border-green-500/20" : status === "unattempted" ? "bg-[#0f1117] border-[#374151]" : "bg-red-500/5 border-red-500/20"}`}>
                        <p className="text-[#9CA3AF] text-xs font-bold uppercase tracking-widest mb-2">Your Answer</p>
                        <p className={`${status === "correct" ? "text-green-500" : status === "unattempted" ? "text-[#374151] italic" : "text-red-500"}`}>{status === "unattempted" ? "Not Attempted" : (q.selected_option_text ?? q.selected_option ?? "—")}</p>
                      </div>
                      <div className="p-4 rounded border border-[#374151] bg-[#0f1117]">
                        <p className="text-[#9CA3AF] text-xs font-bold uppercase tracking-widest mb-2">Correct Answer</p>
                        <p className="text-green-500">{q.correct_option_text ?? q.correct_option ?? "—"}</p>
                      </div>
                    </div>
                    {q.explanation && (
                      <div className="mt-4 flex items-start gap-3 text-sm text-[#9CA3AF] bg-[#0f1117] p-4 rounded border border-[#374151]">
                        <Lightbulb size={16} className="text-[#F59E0B] flex-shrink-0 mt-0.5" />
                        <p className="font-medium">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              }) : <div className="text-center py-12 text-[#9CA3AF] font-bold">No detailed question data available.</div>}
            </motion.div>
          ) : (
            <motion.div key="ai-analysis" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="space-y-8">
              {loadingAnalysis && (
                <div className="text-center py-20 flex flex-col items-center">
                  <div className="w-8 h-8 border-4 border-[#374151] border-t-[#F59E0B] rounded-full animate-spin mb-4" />
                  <p className="text-white font-bold tracking-wide uppercase">Analyzing Performance</p>
                </div>
              )}
              {analysisError && (
                <div className="bg-[#1a1d27] border border-red-500/30 rounded p-6 text-center">
                  <AlertTriangle className="mx-auto text-red-500 mb-2" size={32} />
                  <p className="text-red-500 font-bold mb-4">{analysisError}</p>
                  <button onClick={fetchAiAnalysis} className="px-4 py-2 bg-[#0f1117] border border-[#374151] text-white rounded text-sm font-bold uppercase tracking-wider">Try Again</button>
                </div>
              )}
              {aiAnalysis && !loadingAnalysis && (
                <>
                  <div className="bg-[#1a1d27] border border-[#374151] rounded p-6 md:p-8">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 tracking-tight"><Brain className="text-[#F59E0B]" /> Performance Summary</h3>
                    <p className="text-[#9CA3AF] font-medium leading-relaxed mb-6">{aiAnalysis.overall_analysis}</p>
                    {aiAnalysis.total_incorrect === 0 && (
                      <div className="bg-green-500/5 border border-green-500/20 rounded p-4 flex items-center gap-3">
                        <Award className="text-green-500" size={24} />
                        <div><h4 className="font-bold text-green-500">Perfect Score!</h4><p className="text-sm font-medium text-green-500/80">Excellent work! You mastered this quiz.</p></div>
                      </div>
                    )}
                  </div>
                  {aiAnalysis.weak_topics?.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-white flex items-center gap-2 tracking-tight"><Target className="text-[#F59E0B]" /> Improvement Areas</h3>
                      {aiAnalysis.weak_topics.map((topic, idx) => (
                        <div key={idx} className={`bg-[#1a1d27] border rounded transition-colors ${getSeverityColor(topic.severity)}`}>
                          <button onClick={() => toggleTopic(idx)} className="w-full flex items-center justify-between p-5 text-left hover:bg-[#374151]/10">
                            <div className="flex items-center gap-4">
                              <span className="text-2xl">{topic.severity === 'critical' ? '🔴' : topic.severity === 'high' ? '🟠' : '🟡'}</span>
                              <div><h4 className="font-bold text-white">{topic.topic}</h4><p className="text-xs font-bold uppercase tracking-widest opacity-80">{topic.severity}</p></div>
                            </div>
                            {expandedTopics[idx] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                          </button>
                          <AnimatePresence>
                            {expandedTopics[idx] && (
                              <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden border-t border-[#374151]">
                                <div className="p-5 bg-[#0f1117] space-y-4 text-sm text-[#9CA3AF] font-medium">
                                  <div><p className="font-bold text-white uppercase tracking-wider text-xs mb-2">Analysis</p><p>{topic.description}</p></div>
                                  {topic.common_misconception && (
                                    <div className="bg-red-500/5 p-4 rounded border border-red-500/20"><p className="font-bold text-red-500 uppercase tracking-wider text-xs mb-2 flex items-center gap-2"><AlertTriangle size={14} /> Misconception</p><p className="text-white">{topic.common_misconception}</p></div>
                                  )}
                                  {topic.study_recommendations && (
                                    <div><p className="font-bold text-white uppercase tracking-wider text-xs mb-2">Recommendations</p><ul className="space-y-2 list-disc list-inside">
                                      {topic.study_recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                                    </ul></div>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  )}
                  {aiAnalysis.priority_actions?.length > 0 && (
                    <div className="bg-[#1a1d27] border border-[#374151] rounded p-6">
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><List className="text-[#F59E0B]" /> Action Plan</h3>
                      <div className="grid gap-3">
                        {aiAnalysis.priority_actions.map((action, i) => (
                          <div key={i} className="flex items-start gap-4 p-4 rounded bg-[#0f1117] border border-[#374151]"><div className="flex-shrink-0 w-8 h-8 rounded bg-[#1a1d27] border border-[#374151] flex items-center justify-center font-bold text-[#F59E0B]">{i + 1}</div><p className="text-white font-medium mt-1">{action}</p></div>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* <div className="flex justify-center pt-4">
                    <button onClick={fetchAiAnalysis} className="flex items-center gap-2 px-6 py-3 rounded bg-[#0f1117] border border-[#374151] text-[#9CA3AF] hover:text-white font-bold uppercase tracking-wider text-sm"><RefreshCw size={14} /> Refresh Analysis</button>
                  </div> */}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-center pt-8 border-t border-[#1a1d27]">
          <button onClick={() => navigate('/student')} className="px-8 py-3 rounded bg-[#F59E0B] text-[#0f1117] font-bold uppercase tracking-wider text-sm hover:bg-amber-400">Dashboard</button>
        </div>
      </div>
    </div>
  );
}

export default ResultPage;
