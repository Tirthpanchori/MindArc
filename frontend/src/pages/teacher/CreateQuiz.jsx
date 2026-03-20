import { useState } from "react";
import api from "../../services/api";
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock,
  Copy,
  HelpCircle,
  Layout,
  Plus,
  Sparkles,
  Upload,
  X,
  ArrowLeft,
  Minus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function CreateQuiz() {
  const [title, setTitle] = useState("");
  const [timer, setTimer] = useState(600);
  const [numQuestions, setNumQuestions] = useState(10);
  const [questions, setQuestions] = useState([]);
  const [quizId, setQuizId] = useState(null);
  const [quizCode, setQuizCode] = useState("");
  const [message, setMessage] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [step, setStep] = useState(1);
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [expandedQuestion, setExpandedQuestion] = useState(0);

  const handleCreateQuiz = (e) => {
    if (e) e.preventDefault();
    setMessage("");
    setStep(2);
    const qArray = Array.from({ length: numQuestions }, () => ({
      text: "", options: ["", "", "", ""], correct: 0,
    }));
    setQuestions(qArray);
  };

  const handleQuestionChange = (i, value) => {
    const updated = [...questions];
    updated[i].text = value;
    setQuestions(updated);
    checkCompletion(updated);
  };

  const handleOptionChange = (qi, oi, value) => {
    const updated = [...questions];
    updated[qi].options[oi] = value;
    setQuestions(updated);
    checkCompletion(updated);
  };

  const handleCorrectChange = (qi, oi) => {
    const updated = [...questions];
    updated[qi].correct = oi;
    setQuestions(updated);
    checkCompletion(updated);
  };

  const checkCompletion = (updatedQuestions = questions) => {
    const complete = updatedQuestions.every(
      (q) => q.text.trim() !== "" && q.options.every((opt) => opt.trim() !== "")
    );
    setIsReady(complete);
  };

  const handleAddQuestions = async () => {
    setMessage("");
    let currentQuizId = quizId;
    let currentQuizCode = quizCode;
    try {
        if (!currentQuizId) {
            const createRes = await api.post("/quiz/create/", {
                title, timer, total_questions: questions.length,
            });
            currentQuizId = createRes.data.quiz_id;
            currentQuizCode = createRes.data.code;
            setQuizId(currentQuizId);
            setQuizCode(currentQuizCode);
        }
        const formattedQuestions = questions.map((q) => ({
            text: q.text, options: q.options, correct: q.correct,
        }));
        await api.post(`/quiz/${currentQuizId}/add-questions/`, {
            questions: formattedQuestions,
        });
        setMessage("Quiz created!");
        setStep(3);
    } catch (err) {
        setMessage("Failed to save quiz: " + (err.response?.data?.detail || "Unknown error"));
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(quizCode);
    setMessage("Quiz code copied!");
  };

  const handleAIPromptSubmit = async () => {
    if (!aiPrompt.trim() && !pdfFile && !youtubeUrl.trim()) {
      alert("Provide a Prompt, PDF, or YouTube URL!");
      return;
    }
    setShowAIModal(false);
    setIsLoading(true);
    try {
      let finalTopic = aiPrompt || "";
      if (youtubeUrl.trim()) {
        setMessage("Extracting text from YouTube...");
        try {
          const ytRes = await api.post("/ai/get-text-outofurl/", { url: youtubeUrl });
          if (ytRes.data.text) {
            if (ytRes.data.text.includes("Transcript not available")) {
              throw new Error(ytRes.data.text);
            }
            finalTopic += "\n\nTranscript:\n" + ytRes.data.text;
          }
        } catch (ytErr) {
           throw new Error(ytErr.message || "Failed extraction from YouTube. Check URL.");
        }
      }
      setMessage("Generating quiz...");
      const formData = new FormData();
      formData.append("title", title);
      formData.append("topic", finalTopic);
      formData.append("num_questions", numQuestions);
      formData.append("difficulty", "medium");
      if (pdfFile) formData.append("pdf", pdfFile);

      const aiRes = await api.post("/ai/generate-quiz/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const aiData = aiRes.data.result?.questions || [];
      const formatted = aiData.map((q) => ({
        text: q.question, options: q.options, correct: q.answer,
      }));
      setQuestions(formatted);
      setNumQuestions(formatted.length); 
      checkCompletion(formatted);
      setMessage("AI Quiz generated. Review below.");
      setStep(2);
    } catch (err) {
      setMessage("Error: " + (err.message || err.response?.data?.detail || "Unknown error"));
    } finally {
      setIsLoading(false);
      setPdfFile(null);
      setYoutubeUrl("");
    }
  };

  const toggleAccordion = (index) => setExpandedQuestion(expandedQuestion === index ? -1 : index);
  const steps = [{ id: 1, label: "Details" }, { id: 2, label: "Questions" }, { id: 3, label: "Share" }];

  return (
    <div className="min-h-screen bg-[#0f1117] py-10 px-4 md:px-6 font-space-grotesk text-white">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <button 
          onClick={() => window.location.href = '/teacher'}
          className="text-[#9CA3AF] hover:text-white text-sm font-bold flex items-center gap-2 transition-colors uppercase tracking-wider mb-2"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="bg-[#1a1d27] rounded shadow-sm border border-[#374151] p-6 flex justify-between items-center relative overflow-hidden">
          <div className="absolute inset-x-0 top-1/2 h-px bg-[#374151] -z-0" />
          {steps.map((s) => (
            <div key={s.id} className="relative z-10 flex flex-col items-center gap-2 bg-[#1a1d27] px-4">
              <div className={`w-10 h-10 rounded flex items-center justify-center font-bold text-sm transition-colors border ${step >= s.id ? "bg-[#F59E0B] text-[#0f1117] border-[#F59E0B]" : "bg-[#0f1117] text-[#9CA3AF] border-[#374151]"}`}>
                {step > s.id ? <CheckCircle2 size={18} /> : s.id}
              </div>
              <span className={`text-xs font-bold uppercase tracking-widest ${step >= s.id ? "text-[#F59E0B]" : "text-[#9CA3AF]"}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {step === 1 && (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#1a1d27] rounded shadow border border-[#374151] p-8 h-fit">
              <div className="flex items-center justify-between mb-8 border-b border-[#374151] pb-4">
                <h2 className="text-2xl font-bold text-white tracking-tight">Create <span className="text-[#F59E0B]">Quiz</span></h2>
              </div>
              <form onSubmit={handleCreateQuiz} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-[#9CA3AF] mb-2 uppercase tracking-wide">Quiz Title</label>
                  <input type="text" placeholder="Quiz Title..." value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-3 rounded bg-[#0f1117] border border-[#374151] focus:border-[#F59E0B] text-white outline-none font-medium" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#9CA3AF] mb-2 uppercase tracking-wide">Mins</label>
                    <div className="flex items-center border border-[#374151] rounded bg-[#0f1117] overflow-hidden h-12">
                      <button type="button" onClick={() => setTimer((prev) => Math.max(60, prev - 60))} className="w-12 h-full hover:bg-[#374151] border-r border-[#374151] text-[#9CA3AF] hover:text-white flex items-center justify-center"><Minus size={16} /></button>
                      <input type="number" min="1" value={timer / 60} onChange={(e) => setTimer(Math.max(1, Number(e.target.value || 1)) * 60)} className="w-full text-center h-full bg-transparent outline-none font-bold text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                      <button type="button" onClick={() => setTimer((prev) => Math.min(6000, prev + 60))} className="w-12 h-full hover:bg-[#374151] border-l border-[#374151] text-[#9CA3AF] hover:text-white flex items-center justify-center"><Plus size={16} /></button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#9CA3AF] mb-2 uppercase tracking-wide">Questions</label>
                    <div className="flex items-center border border-[#374151] rounded bg-[#0f1117] overflow-hidden h-12">
                      <button type="button" onClick={() => setNumQuestions(Math.max(1, numQuestions - 1))} className="w-12 h-full hover:bg-[#374151] border-r border-[#374151] text-[#9CA3AF] hover:text-white flex items-center justify-center"><Minus size={16} /></button>
                      <input type="number" min="1" max="100" value={numQuestions} onChange={(e) => setNumQuestions(parseInt(e.target.value))} className="w-full text-center h-full bg-transparent outline-none font-bold text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none m-0" />
                      <button type="button" onClick={() => setNumQuestions(Math.min(100, numQuestions + 1))} className="w-12 h-full hover:bg-[#374151] border-l border-[#374151] text-[#9CA3AF] hover:text-white flex items-center justify-center"><Plus size={16} /></button>
                    </div>
                  </div>
                </div>
                <div className="pt-6 flex flex-col gap-3">
                  <button type="submit" disabled={isLoading} className="w-full py-3.5 rounded bg-[#F59E0B] hover:bg-amber-400 text-[#0f1117] font-bold text-sm uppercase tracking-wider disabled:opacity-70 flex items-center justify-center gap-2">
                    {isLoading ? "Creating..." : <>Blank Quiz <ChevronRight size={18} /></>}
                  </button>
                  <p className="text-[#9CA3AF] text-xs font-bold uppercase tracking-wider text-center py-1">OR</p>
                  <button type="button" onClick={() => { if (!title.trim()) { alert("⚠️ Enter title!"); return; } setShowAIModal(true); }} className="w-full py-3.5 rounded bg-[#0f1117] hover:bg-[#374151] text-[#F59E0B] font-bold border border-[#374151] flex items-center justify-center gap-2 text-sm uppercase tracking-wider">
                    <Sparkles size={18} /> Generate AI Quiz
                  </button>
                </div>
              </form>
            </div>
            <div className="hidden md:flex flex-col gap-4">
              <div className="bg-[#1a1d27] rounded shadow border border-[#374151] p-8 text-white relative overflow-hidden flex-1 flex flex-col justify-center text-center">
                <div className="w-16 h-16 bg-[#0f1117] rounded flex items-center justify-center mx-auto mb-6 border border-[#374151]">
                  <Layout className="w-8 h-8 text-[#F59E0B]" />
                </div>
                <h3 className="text-3xl font-bold mb-2 break-words text-white tracking-tight">{title || "Your Quiz Title"}</h3>
                <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
                  <div className="bg-[#0f1117] rounded p-4 border border-[#374151]"><Clock className="w-5 h-5 mx-auto mb-2 text-[#F59E0B]" /><p className="font-bold text-lg text-white">{timer / 60}m</p></div>
                  <div className="bg-[#0f1117] rounded p-4 border border-[#374151]"><HelpCircle className="w-5 h-5 mx-auto mb-2 text-[#F59E0B]" /><p className="font-bold text-lg text-white">{numQuestions}</p></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
            <div className="bg-[#1a1d27] rounded shadow border border-[#374151] overflow-hidden">
              <div className="p-6 border-b border-[#374151] bg-[#0f1117] flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <button onClick={() => setStep(1)} className="text-[#9CA3AF] hover:text-white"><ArrowLeft size={20} /></button>
                  <h2 className="text-xl font-bold text-white tracking-tight">Questions</h2>
                </div>
                <span className="text-[#F59E0B] px-3 py-1 rounded text-xs font-bold border border-[#F59E0B]/20 uppercase">{questions.length} Items</span>
              </div>
              <div className="divide-y divide-[#374151]">
                {questions.map((q, qi) => (
                  <div key={qi} className={`transition-colors ${expandedQuestion === qi ? 'bg-[#374151]/20' : 'bg-transparent'}`}>
                    <button onClick={() => toggleAccordion(qi)} className="w-full flex items-center justify-between p-5 text-left hover:bg-[#374151]/20">
                      <span className="font-bold text-white flex items-center gap-4">
                        <span className={`w-8 h-8 flex items-center justify-center text-xs font-bold rounded ${q.text ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-[#0f1117] text-[#9CA3AF] border border-[#374151]'}`}>{qi + 1}</span>
                        {q.text || <span className="text-[#374151] italic">Type question...</span>}
                      </span>
                      {expandedQuestion === qi ? <ChevronUp className="text-[#9CA3AF]" /> : <ChevronDown className="text-[#9CA3AF]" />}
                    </button>
                    <AnimatePresence>
                      {expandedQuestion === qi && (
                        <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                          <div className="p-5 pt-0 ml-12 space-y-4">
                            <input type="text" placeholder="Question text..." value={q.text} onChange={(e) => handleQuestionChange(qi, e.target.value)} className="w-full px-4 py-3 bg-[#0f1117] border border-[#374151] rounded focus:border-[#F59E0B] text-white outline-none font-bold placeholder:text-[#374151]" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {q.options.map((opt, oi) => (
                                <div key={oi} className={`relative group rounded border transition-colors ${q.correct === oi ? "border-green-500 bg-green-500/5" : "border-[#374151] bg-[#0f1117]"}`}>
                                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                    <input type="radio" checked={q.correct === oi} onChange={() => handleCorrectChange(qi, oi)} className="w-4 h-4 text-green-500 bg-[#1a1d27] border-[#374151] cursor-pointer" />
                                  </div>
                                  <input type="text" placeholder={`Option ${oi + 1}`} value={opt} onChange={(e) => handleOptionChange(qi, oi, e.target.value)} className="w-full py-3 px-4 pl-10 bg-transparent outline-none text-white font-medium" />
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
              <div className="p-6 bg-[#0f1117] border-t border-[#374151]">
                <button onClick={handleAddQuestions} disabled={!isReady} className="w-full py-4 rounded bg-[#F59E0B] text-[#0f1117] font-bold text-sm uppercase flex items-center justify-center gap-2 disabled:opacity-50">Save Questions <CheckCircle2 size={18} /></button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-xl mx-auto">
            <div className="bg-[#1a1d27] rounded shadow border border-[#374151] text-center p-10">
              <div className="w-16 h-16 bg-[#0f1117] rounded flex items-center justify-center mx-auto mb-6 border border-green-500/30"><Sparkles className="w-8 h-8 text-green-500" /></div>
              <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Quiz Published!</h2>
              <div className="bg-[#0f1117] rounded p-6 mb-8 mt-6 border border-[#374151]"><p className="text-[#9CA3AF] text-xs font-bold uppercase mb-2">Quiz Code</p><div className="text-4xl font-mono font-bold text-[#F59E0B] flex items-center justify-center gap-4">{quizCode}<button onClick={handleCopy} className="p-2 rounded bg-[#1a1d27] text-[#9CA3AF] hover:text-[#F59E0B] border border-[#374151]"><Copy size={20} /></button></div></div>
              <div className="grid grid-cols-2 gap-4"><button onClick={() => setStep(2)} className="py-3 rounded bg-[#0f1117] border border-[#374151] font-bold text-[#9CA3AF] hover:text-white uppercase text-sm flex items-center justify-center gap-2"><ArrowLeft size={16} /> Edit</button><button onClick={() => window.location.replace("/teacher")} className="py-3 rounded bg-[#F59E0B] text-[#0f1117] font-bold text-sm uppercase tracking-wider">Dashboard</button></div>
            </div>
          </motion.div>
        )}

        {message && (
          <motion.div className="fixed bottom-6 right-6 bg-[#1a1d27] text-white px-6 py-4 rounded shadow border border-[#374151] flex items-center gap-3 z-50">
            {message.includes("❌") ? <X className="text-red-500" /> : <CheckCircle2 className="text-green-500" />}<p className="font-bold text-sm">{message}</p>
          </motion.div>
        )}

        <AnimatePresence>
          {showAIModal && (
            <div className="fixed inset-0 bg-[#0f1117]/90 backdrop-blur-md flex items-center justify-center z-50 px-4">
              <motion.div className="bg-[#1a1d27] rounded p-8 shadow max-w-lg w-full border border-[#374151]">
                <div className="flex justify-between items-center mb-6 border-b border-[#374151] pb-4"><h2 className="text-xl font-bold text-white flex items-center gap-2">AI Quiz</h2><button onClick={() => setShowAIModal(false)} className="text-[#9CA3AF] hover:text-white"><X size={20} /></button></div>
                <div className="space-y-6 mb-8">
                  <div className={youtubeUrl.trim() ? "opacity-30 pointer-events-none" : "opacity-100"}>
                    <textarea rows="3" placeholder="Topic..." value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} disabled={!!youtubeUrl.trim()} className="w-full bg-[#0f1117] border border-[#374151] rounded p-4 focus:border-[#F59E0B] text-white outline-none font-medium resize-none disabled:cursor-not-allowed mb-4" />
                    <label className={`flex flex-col items-center justify-center w-full h-24 border border-dashed border-[#374151] rounded group ${youtubeUrl.trim() ? "cursor-not-allowed" : "cursor-pointer bg-[#0f1117]"}`}><input type="file" className="hidden" accept="application/pdf" onChange={(e) => setPdfFile(e.target.files[0])} disabled={!!youtubeUrl.trim()} /><Upload className="w-5 h-5 text-[#374151] mb-2" /><p className="text-sm font-bold text-[#9CA3AF] group-hover:text-white">{pdfFile ? pdfFile.name : "Upload PDF"}</p></label>
                  </div>
                  <div className="text-center text-[#9CA3AF] text-xs font-bold uppercase py-2">OR</div>
                  <div className={(aiPrompt.trim() || pdfFile) ? "opacity-30 pointer-events-none" : "opacity-100"}>
                    <input type="text" placeholder="YouTube URL..." value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} disabled={!!(aiPrompt.trim() || pdfFile)} className="w-full bg-[#0f1117] border border-[#374151] rounded p-4 text-white outline-none focus:border-[#F59E0B]" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-6 border-t border-[#374151]">
                  <button onClick={() => setShowAIModal(false)} className="py-3.5 rounded bg-[#0f1117] border border-[#374151] text-[#9CA3AF] font-bold hover:text-white uppercase text-sm">Cancel</button>
                  <button onClick={handleAIPromptSubmit} className="py-3.5 rounded bg-[#F59E0B] text-[#0f1117] font-bold uppercase text-sm">Generate</button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default CreateQuiz;