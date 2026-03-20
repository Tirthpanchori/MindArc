import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  Layout,
  Users,
  Target,
  Trophy,
  Clock,
  Copy,
  BarChart2,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  LogOut
} from "lucide-react";
import { motion } from "framer-motion";
import api from "../../services/api";

const HomeT = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    stats: {
      totalQuizzes: 0,
      activeQuizzes: 0,
      totalAttempts: 0,
      avgScore: 0,
    },
    recentQuizzes: [],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get("/quiz/teacher/dashboard/");
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    // You could add a toast notification here
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("userId");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f1117] flex items-center justify-center font-space-grotesk">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-[#374151] border-t-[#F59E0B] rounded-full animate-spin" />
          <p className="text-[#9CA3AF] font-bold text-sm tracking-widest uppercase">Loading...</p>
        </div>
      </div>
    );
  }

  const statsCards = [
    {
      label: "Total Quizzes",
      value: data.stats.totalQuizzes,
      icon: BookOpen,
    },
    {
      label: "Active Quizzes",
      value: data.stats.activeQuizzes,
      icon: Target,
    },
    {
      label: "Total Attempts",
      value: data.stats.totalAttempts,
      icon: Users,
    },
    {
      label: "Avg. Score",
      value: `${data.stats.avgScore}%`,
      icon: Trophy,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0f1117] text-white font-space-grotesk selection:bg-[#F59E0B] selection:text-[#0f1117] p-6 md:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto space-y-12">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#1a1d27] pb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
              Welcome back, <span className="text-[#F59E0B]">Teacher</span>
            </h1>
            <p className="text-[#9CA3AF] font-medium">Here's what's happening with your quizzes today.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded bg-[#1a1d27] border border-[#374151] text-[#9CA3AF] hover:text-white hover:border-[#F59E0B] transition-all font-bold text-sm flex items-center gap-2 group uppercase tracking-wider"
            >
              <LogOut size={16} className="group-hover:-translate-x-0.5 transition-transform text-[#F59E0B]" />
              Logout
            </button>
            <button
              onClick={() => navigate('/recent-teacher-quizzes')}
              className="px-4 py-2 rounded bg-[#1a1d27] border border-[#374151] text-[#9CA3AF] hover:text-white hover:border-[#F59E0B] transition-all font-bold text-sm flex items-center gap-2 uppercase tracking-wider"
            >
              <Layout size={16} className="text-[#F59E0B]" />
              Library
            </button>
            <Link
              to="/create-quiz"
              className="px-4 py-2 rounded bg-[#F59E0B] text-[#0f1117] font-bold hover:bg-amber-400 transition-all flex items-center gap-2 uppercase tracking-wider shadow"
            >
              <Plus size={18} strokeWidth={2.5} />
              Create Quiz
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group bg-[#1a1d27] border border-[#374151] p-6 rounded flex flex-col justify-between transition-colors hover:border-[#F59E0B]"
            >
              <div className="flex items-start justify-between mb-4">
                <p className="text-[#9CA3AF] text-xs font-bold uppercase tracking-widest">{stat.label}</p>
                <stat.icon size={18} className="text-[#F59E0B]" />
              </div>

              <div className="flex items-center gap-3">
                <h3 className="text-4xl font-bold text-white group-hover:scale-105 transition-transform origin-left">{stat.value}</h3>
                {index === 1 && data.stats.activeQuizzes > 0 && ( // Active Quizzes label
                  <span className="flex items-center gap-1 text-xs font-bold text-green-500 border border-green-500/20 px-2 py-1 rounded bg-green-500/5 uppercase tracking-wider">
                    <CheckCircle2 size={12} /> Live
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent Quizzes Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#1a1d27] pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Recent Quizzes
            </h2>
            <Link to="/recent-teacher-quizzes" className="text-sm font-bold text-[#F59E0B] hover:text-amber-400 flex items-center gap-1 group uppercase tracking-wider">
              View All <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {data.recentQuizzes.length === 0 ? (
            <div className="bg-[#1a1d27] border border-[#374151] rounded p-12 text-center">
              <div className="w-16 h-16 bg-[#0f1117] border border-[#374151] rounded flex items-center justify-center mx-auto mb-4">
                <BookOpen className="text-[#F59E0B] w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">No quizzes yet</h3>
              <p className="text-[#9CA3AF] font-medium mb-6">Create your first quiz to start tracking student progress and gathering insights.</p>
              <Link
                to="/create-quiz"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-[#F59E0B] text-[#0f1117] font-bold hover:bg-amber-400 transition-colors uppercase tracking-wider text-sm"
              >
                <Plus size={18} />
                Create Quiz
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.recentQuizzes.map((quiz, index) => (
                <motion.div
                  key={quiz.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + (index * 0.05) }}
                  className="bg-[#1a1d27] border border-[#374151] rounded p-6 hover:border-[#F59E0B] transition-colors group flex flex-col justify-between"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-2.5 bg-[#0f1117] border border-[#374151] rounded">
                      <BookOpen className="text-[#F59E0B] w-5 h-5" />
                    </div>

                    <button
                      onClick={() => copyToClipboard(quiz.code)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#0f1117] border border-[#374151] text-xs font-bold text-[#9CA3AF] tracking-widest uppercase hover:text-white hover:border-[#F59E0B] transition-colors active:scale-95"
                      title="Copy Code"
                    >
                      {quiz.code}
                      <Copy size={12} className="text-[#F59E0B]" />
                    </button>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-4 line-clamp-2" title={quiz.title}>
                    {quiz.title}
                  </h3>

                  <div className="flex items-center gap-4 text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-8 mt-auto">
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} className="text-[#F59E0B]" /> {quiz.timer / 60}m
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Layout size={14} className="text-[#F59E0B]" /> {quiz.total_questions}
                    </span>
                    <span className="flex items-center gap-1.5 text-white">
                      <Users size={14} className="text-[#F59E0B]" /> {quiz.attempts_count}
                    </span>
                  </div>

                  <button
                    onClick={() => navigate(`/teacher/quiz/${quiz.id}/analysis`)}
                    className="w-full py-3 rounded bg-[#0f1117] border border-[#374151] text-[#9CA3AF] font-bold text-sm uppercase tracking-wider hover:bg-[#374151] hover:text-white transition-colors flex items-center justify-between px-4 group/btn"
                  >
                    <div className="flex items-center gap-2">
                      <BarChart2 size={16} />
                      Analytics
                    </div>
                    <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform text-[#F59E0B]" />
                  </button>

                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeT;