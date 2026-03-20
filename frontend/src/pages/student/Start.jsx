import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowRight, Clock, Target, CheckCircle2, AlertTriangle, Play, Pause, ChevronRight, ChevronLeft, ArrowLeft } from "lucide-react";
import api from "../../services/api";

function Start() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [showPanel, setShowPanel] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await api.get(`/attempts/${id}/questions/`);
        setQuiz(res.data);

        const storedEnd = localStorage.getItem(`quiz_end_${id}`);
        if (storedEnd) {
          setEndTime(Number(storedEnd));
        } else {
          const newEnd = Date.now() + res.data.timer * 1000;
          localStorage.setItem(`quiz_end_${id}`, newEnd);
          setEndTime(newEnd);
        }
      } catch (err) {
        setError(err.response?.data?.detail || "Failed to fetch quiz questions.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  useEffect(() => {
    if (!endTime) return;
    const interval = setInterval(() => {
      const remaining = Math.floor((endTime - Date.now()) / 1000);
      if (remaining <= 0) {
        setTimeLeft(0);
        clearInterval(interval);
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  useEffect(() => {
    if (timeLeft === 0 && !timeUp) {
      setTimeUp(true);
      setTimeout(() => submitQuizApi(), 3000);
    }
  }, [timeLeft, timeUp]);

  function handleOptionChange(questionId, selectedOption) {
    setAnswers((prev) => ({ ...prev, [questionId]: selectedOption }));
  }

  function toggleMarkForReview(questionId) {
    setMarkedForReview(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) newSet.delete(questionId);
      else newSet.add(questionId);
      return newSet;
    });
  }

  async function submitQuizApi() {
    if (!quiz || isSubmitting) return;
    setIsSubmitting(true);
    localStorage.removeItem(`quiz_end_${id}`);

    const formattedAnswers = quiz.questions.map((q) => ({
      question_id: q.id,
      selected_option: answers[q.id] || null,
    }));

    const payload = { quiz_id: quiz.quiz_id, answers: formattedAnswers };

    try {
      const res = await api.post(`/attempts/save/`, payload);
      navigate(`/result/${quiz.quiz_id}`, { state: res.data });
      localStorage.setItem("lastAttempt", JSON.stringify(res.data));
    } catch (err) {
      if (timeUp) alert("Submission failed. Please contact support.");
      alert(err.response?.data?.detail || "Failed to submit quiz.");
      setIsSubmitting(false);
    }
  }

  const handleNext = () => { if (currentQuestionIndex < quiz.questions.length - 1) setCurrentQuestionIndex(curr => curr + 1); };
  const handlePrev = () => { if (currentQuestionIndex > 0) setCurrentQuestionIndex(curr => curr - 1); };
  const jumpToQuestion = (index) => { setCurrentQuestionIndex(index); };
  const attemptSubmit = () => { setShowSubmitModal(true); };

  const getTimerColor = () => {
    if (timeLeft === null) return "text-[#9CA3AF]";
    if (timeLeft < 30) return "text-red-500 animate-pulse";
    if (timeLeft < 120) return "text-yellow-500";
    return "text-[#F59E0B]";
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f1117] font-space-grotesk">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-[#374151] border-t-[#F59E0B] rounded-full animate-spin" />
        <p className="text-[#9CA3AF] font-bold tracking-widest uppercase text-sm">Preparing Quiz...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f1117] font-space-grotesk p-6">
      <div className="text-center">
        <p className="text-red-500 mb-4 font-bold">{error}</p>
        <button onClick={() => navigate('/student')} className="px-5 py-2.5 rounded bg-[#1a1d27] border border-[#374151] text-[#9CA3AF] hover:text-white uppercase tracking-wider text-sm font-bold">Dashboard</button>
      </div>
    </div>
  );

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;
  const answeredCount = Object.keys(answers).length;
  const markedCount = markedForReview.size;

  return (
    <div className="h-screen flex flex-col bg-[#0f1117] font-space-grotesk text-white selection:bg-[#F59E0B] selection:text-[#0f1117] overflow-hidden">

      {/* HEADER */}
      <header className="flex-none h-16 bg-[#1a1d27] border-b border-[#374151] flex items-center justify-between px-6 z-30">
        <div className="flex items-center gap-4 overflow-hidden">
          <div className="w-8 h-8 rounded bg-[#F59E0B] flex items-center justify-center text-[#0f1117] font-black text-lg">
            Q
          </div>
          <h1 className="text-sm font-bold text-white tracking-widest uppercase truncate max-w-[150px] md:max-w-md" title={quiz.title}>{quiz.title}</h1>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <div className="hidden md:flex text-[#9CA3AF] font-bold text-xs uppercase tracking-widest">
            Q <span className="text-white mx-1">{currentQuestionIndex + 1}</span> / {totalQuestions}
          </div>

          <div className={`flex items-center gap-2 px-4 py-1.5 rounded border border-[#374151] bg-[#0f1117] ${getTimerColor()}`}>
            <Clock size={14} />
            <span className="font-mono font-bold tracking-[0.2em] text-sm">
              {timeLeft !== null ? `${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, "0")}` : "--:--"}
            </span>
          </div>

          <button
            onClick={() => setShowPanel(!showPanel)}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded bg-[#0f1117] border border-[#374151] text-[#9CA3AF] hover:text-white hover:border-[#F59E0B] transition-colors"
            title={showPanel ? "Hide Panel" : "Show Panel"}
          >
            {showPanel ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
      </header>

      {/* BODY */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* LEFT: QUESTION */}
        <main className={`flex-1 flex flex-col relative overflow-y-auto custom-scrollbar transition-all duration-300 ease-in-out`}>
          <div className={`w-full h-full flex flex-col p-6 md:p-10 ${!showPanel ? 'items-center' : ''}`}>
            <div className={`w-full pb-24 space-y-6 ${!showPanel ? 'max-w-4xl' : 'max-w-3xl'} mx-auto transition-all`}>
              
              <div className="bg-[#1a1d27] border border-[#374151] rounded p-6 md:p-8">
                <div className="flex items-start gap-4 mb-8">
                  <span className="flex-shrink-0 px-3 py-1 rounded bg-[#0f1117] border border-[#374151] text-[#9CA3AF] text-xs font-bold tracking-widest uppercase">
                    Q.{currentQuestionIndex + 1}
                  </span>
                  <h2 className="text-lg md:text-xl font-medium text-white leading-relaxed mt-0.5">
                    {currentQuestion.text}
                  </h2>
                </div>

                <div className="h-px w-full bg-[#374151] mb-6" />

                <div className="grid gap-3">
                  {["A", "B", "C", "D"].map((opt) => {
                    const isSelected = answers[currentQuestion.id] === opt;
                    return (
                      <div
                        key={opt}
                        onClick={() => handleOptionChange(currentQuestion.id, opt)}
                        className={`group flex items-center p-4 rounded border transition-all cursor-pointer ${isSelected ? "border-[#F59E0B] bg-[#F59E0B]/5" : "border-[#374151] bg-[#0f1117] hover:border-[#F59E0B]/50"}`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 flex-shrink-0 transition-colors ${isSelected ? "border-[#F59E0B] bg-[#0f1117]" : "border-[#374151] group-hover:border-[#F59E0B]/50"}`}>
                          {isSelected && <div className="w-2 h-2 bg-[#F59E0B] rounded-full" />}
                        </div>
                        <span className={`text-sm md:text-base font-medium transition-colors ${isSelected ? "text-white" : "text-[#9CA3AF] group-hover:text-white"}`}>
                          {currentQuestion[`option_${opt.toLowerCase()}`]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                <button
                  onClick={handlePrev}
                  disabled={currentQuestionIndex === 0}
                  className={`w-full sm:w-auto px-6 py-3 rounded text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 border ${currentQuestionIndex === 0 ? "border-[#374151] text-[#374151] bg-[#0f1117] cursor-not-allowed" : "border-[#374151] text-[#9CA3AF] hover:text-white hover:border-[#F59E0B] bg-[#1a1d27]"}`}
                >
                  <ArrowLeft size={14} /> Prev
                </button>

                <button
                  onClick={() => toggleMarkForReview(currentQuestion.id)}
                  className={`w-full sm:w-auto px-6 py-3 rounded text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 border ${markedForReview.has(currentQuestion.id) ? "border-yellow-500 text-yellow-500 bg-yellow-500/10" : "border-[#374151] text-[#9CA3AF] hover:text-white hover:border-[#374151] bg-[#0f1117]"}`}
                >
                  {markedForReview.has(currentQuestion.id) ? "Unmark" : "Mark Review"}
                </button>

                <button
                  onClick={handleNext}
                  disabled={currentQuestionIndex === totalQuestions - 1}
                  className={`w-full sm:w-auto px-6 py-3 rounded text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 border ${currentQuestionIndex === totalQuestions - 1 ? "border-[#374151] text-[#374151] bg-[#0f1117] cursor-not-allowed" : "bg-[#F59E0B] border-[#F59E0B] text-[#0f1117] hover:bg-amber-400"}`}
                >
                  Next <ArrowRight size={14} />
                </button>
              </div>

            </div>
          </div>
        </main>

        {/* RIGHT: PALETTE */}
        <aside className={`hidden lg:flex bg-[#1a1d27] border-l border-[#374151] flex-col z-20 transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden ${showPanel ? 'w-80 opacity-100 translate-x-0' : 'w-0 opacity-0 translate-x-10'}`}>
          <div className="p-6 border-b border-[#374151]">
            <h3 className="text-white font-bold text-sm tracking-widest uppercase flex items-center gap-2">
              <Target size={16} className="text-[#F59E0B]" /> Questions
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
            <div className="grid grid-cols-4 gap-3">
              {quiz.questions.map((q, idx) => {
                const isAnswered = !!answers[q.id];
                const isMarked = markedForReview.has(q.id);
                const isCurrent = idx === currentQuestionIndex;

                let colorClasses = "bg-[#0f1117] border-[#374151] text-[#9CA3AF] hover:border-[#F59E0B] hover:text-white";
                if (isAnswered && isMarked) colorClasses = "bg-purple-500/10 border-purple-500 text-purple-500";
                else if (isMarked) colorClasses = "bg-yellow-500/10 border-yellow-500 text-yellow-500";
                else if (isAnswered) colorClasses = "bg-green-500/10 border-green-500 text-green-500";

                let baseClasses = `h-10 w-10 rounded flex items-center justify-center text-xs font-bold transition-all border ${colorClasses}`;
                if (isCurrent) baseClasses += ` ring-2 ring-[#F59E0B] ring-offset-2 ring-offset-[#1a1d27] font-black z-10`;

                return (
                  <button key={q.id} onClick={() => jumpToQuestion(idx)} className={baseClasses}>
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 space-y-4 px-2">
              <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-[#9CA3AF]">
                <div className="w-3 h-3 rounded bg-green-500/10 border border-green-500"></div> Attempted
              </div>
              <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-[#9CA3AF]">
                <div className="w-3 h-3 rounded bg-yellow-500/10 border border-yellow-500"></div> Marked Review
              </div>
              <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-[#9CA3AF]">
                <div className="w-3 h-3 rounded bg-purple-500/10 border border-purple-500"></div> Attempted + Marked
              </div>
              <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-[#9CA3AF]">
                <div className="w-3 h-3 rounded bg-[#0f1117] border border-[#374151]"></div> Unattempted
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-[#374151] bg-[#0f1117]">
            <button onClick={attemptSubmit} className="w-full py-3 bg-[#1a1d27] border border-[#F59E0B] text-[#F59E0B] rounded font-bold uppercase tracking-widest hover:bg-[#F59E0B] hover:text-[#0f1117] transition-all flex items-center justify-center gap-2">
              <CheckCircle2 size={16} /> Submit Quiz
            </button>
          </div>
        </aside>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <div className={`${showPanel ? 'lg:hidden' : 'lg:flex'} fixed bottom-0 left-0 w-full p-4 bg-[#1a1d27] border-t border-[#374151] flex items-center justify-between z-40`}>
        <div className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF]">
          <span className="text-green-500">{answeredCount}</span> / {totalQuestions} Ans
        </div>

        <div className="flex gap-2">
          <button onClick={() => setShowPanel(true)} className="lg:hidden px-4 py-2 bg-[#0f1117] text-[#9CA3AF] text-xs font-bold uppercase tracking-wider border border-[#374151] rounded">
            Questions
          </button>
          <button onClick={attemptSubmit} className="px-6 py-2 bg-[#F59E0B] text-[#0f1117] text-xs font-bold uppercase tracking-wider rounded">
            Finish
          </button>
        </div>
      </div>

      {/* CONFIRM MODAL */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f1117]/80 backdrop-blur-sm">
          <div className="bg-[#1a1d27] rounded border border-[#374151] max-w-sm w-full p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-white tracking-tight mb-2">Submit Quiz?</h3>
            <div className="space-y-4 mb-8 text-[#9CA3AF] text-sm font-medium">
              <p>You are about to submit your quiz and cannot edit your answers later.</p>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-[#0f1117] p-4 rounded border border-[#374151] text-center">
                  <div className="text-2xl font-black text-white">{answeredCount}</div>
                  <div className="text-[10px] text-[#9CA3AF] font-bold uppercase tracking-widest mt-1">Answered</div>
                </div>
                <div className="bg-[#0f1117] p-4 rounded border border-[#374151] text-center">
                  <div className="text-2xl font-black text-white">{totalQuestions}</div>
                  <div className="text-[10px] text-[#9CA3AF] font-bold uppercase tracking-widest mt-1">Total</div>
                </div>
              </div>

              {(totalQuestions - answeredCount > 0 || markedCount > 0) && (
                <div className="bg-yellow-500/5 border border-yellow-500/20 p-4 rounded text-yellow-500 text-xs font-bold uppercase tracking-wider mt-4 space-y-2">
                  {totalQuestions - answeredCount > 0 && <p className="flex items-center gap-2"><AlertTriangle size={12}/> {totalQuestions - answeredCount} Unanswered</p>}
                  {markedCount > 0 && <p className="flex items-center gap-2"><Target size={12}/> {markedCount} Marked for review</p>}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={() => setShowSubmitModal(false)} className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded border border-[#374151] text-[#9CA3AF] hover:text-white hover:border-[#9CA3AF]">
                Cancel
              </button>
              <button onClick={submitQuizApi} disabled={isSubmitting} className="px-6 py-2 text-xs font-bold uppercase tracking-wider rounded bg-[#F59E0B] text-[#0f1117] hover:bg-amber-400 disabled:opacity-50 flex justify-center items-center min-w-[120px]">
                {isSubmitting ? <div className="w-4 h-4 border-2 border-[#0f1117]/30 border-t-[#0f1117] rounded-full animate-spin" /> : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TIME'S UP */}
      {timeUp && (
        <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-[#0f1117] font-space-grotesk">
          <Clock size={48} className="text-[#F59E0B] mb-6 animate-pulse" />
          <h2 className="text-4xl font-black tracking-tight text-white mb-4">Time's Up!</h2>
          <p className="text-sm font-bold uppercase tracking-widest text-[#9CA3AF] mb-8">Submitting your answers...</p>
          <div className="w-8 h-8 border-4 border-[#374151] border-t-[#F59E0B] rounded-full animate-spin"></div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #0f1117; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #374151; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #4b5563; }
      `}</style>
    </div>
  );
}

export default Start;
