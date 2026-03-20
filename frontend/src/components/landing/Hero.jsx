import React from "react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();


  const [phase, setPhase] = React.useState("typing");
  const [typedUrl, setTypedUrl] = React.useState("");
  const [selectedOption, setSelectedOption] = React.useState(null);
  const URL_TEXT = "youtube.com/watch?v=9bZkp7q19f0";

  React.useEffect(() => {
    let timeout;
    if (phase === "typing") {
      setTypedUrl(""); setSelectedOption(null);
      let i = 0;
      const interval = setInterval(() => {
        setTypedUrl(URL_TEXT.slice(0, i + 1)); i++;
        if (i === URL_TEXT.length) { clearInterval(interval); timeout = setTimeout(() => setPhase("loading"), 500); }
      }, 55);
      return () => { clearInterval(interval); clearTimeout(timeout); };
    }
    if (phase === "loading") { timeout = setTimeout(() => setPhase("questions"), 2000); return () => clearTimeout(timeout); }
    if (phase === "questions") { timeout = setTimeout(() => setPhase("typing"), 7000); return () => clearTimeout(timeout); }
  }, [phase]);

  return (
    <div className="bg-[#0f1117] pt-32 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">

          <div className="lg:w-1/2 text-left">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-tight">
              Turn Any Video or PDF Into a Quiz. Instantly.
            </h1>
            <p className="text-xl text-[#9CA3AF] mb-10 leading-relaxed max-w-lg">
              MindArc uses AI to generate context-aware quizzes from YouTube videos, PDFs, and text prompts — in seconds. Built for educators who move fast and students who mean it.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate("/register")}
                className="px-8 py-4 bg-[#F59E0B] text-[#0f1117] font-bold text-lg hover:bg-amber-400 transition-colors"
              >
                Start for Free
              </button>
              <button
                onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 border border-[#1a1d27] bg-[#1a1d27] text-white font-medium text-lg hover:bg-transparent transition-colors"
              >
                See How It Works
              </button>
            </div>
          </div>

          {/* Replace your entire mockup div with this */}
          <div className="lg:w-1/2 w-full">
            <div className="bg-[#1a1d27] rounded-xl border border-[#374151] p-2 sm:p-4 shadow-2xl relative overflow-hidden aspect-video flex items-center justify-center">
              <div className="w-full h-full bg-[#0f1117] rounded-lg border border-[#374151] p-5 flex flex-col gap-3">

                {/* URL Input Bar */}
                <div className="flex items-center gap-2 bg-[#1a1d27] border border-[#374151] rounded px-3 py-2">
                  <div className="w-2 h-2 rounded-full bg-[#F59E0B]"></div>
                  <span className="text-[#9CA3AF] text-xs font-mono flex-1 truncate">
                    {typedUrl}<span className="animate-pulse">|</span>
                  </span>
                  <div className={`text-xs px-2 py-1 font-bold transition-colors ${phase === "loading" ? "bg-[#374151] text-[#9CA3AF]" : "bg-[#F59E0B] text-[#0f1117]"}`}>
                    {phase === "loading" ? "..." : "Generate"}
                  </div>
                </div>

                {/* Loading State */}
                {phase === "loading" && (
                  <div className="flex-1 flex flex-col gap-3 justify-center px-2">
                    <div className="text-xs text-[#9CA3AF] mb-1">Parsing transcript...</div>
                    <div className="h-1.5 bg-[#1a1d27] rounded overflow-hidden">
                      <div className="h-full bg-[#F59E0B] rounded animate-[loading_2s_ease-in-out_forwards]" style={{ animation: "width 2s ease-in-out forwards", width: "100%" }}></div>
                    </div>
                    <div className="flex flex-col gap-2 mt-2 opacity-40">
                      <div className="h-3 w-3/4 bg-[#1a1d27] rounded"></div>
                      <div className="h-3 w-1/2 bg-[#1a1d27] rounded"></div>
                      <div className="h-3 w-2/3 bg-[#1a1d27] rounded"></div>
                    </div>
                  </div>
                )}

                {/* Questions State */}
                {phase === "questions" && (
                  <div className="flex-1 flex flex-col gap-3 overflow-hidden">
                    <div className="text-[#F59E0B] text-xs font-bold tracking-widest uppercase">Q1 — Generated</div>
                    <div className="text-white text-sm font-medium leading-snug">
                      Which sorting algorithm does Python's built-in sort use?
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      {["Merge Sort", "Timsort", "Quicksort", "Heapsort"].map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedOption(i)}
                          className={`text-left text-xs px-3 py-2 border rounded transition-colors ${selectedOption === null
                              ? "border-[#374151] text-[#9CA3AF] hover:border-[#F59E0B] hover:text-white"
                              : i === 1
                                ? "border-green-500 text-green-400 bg-green-500/10"
                                : selectedOption === i
                                  ? "border-red-500 text-red-400 bg-red-500/10"
                                  : "border-[#374151] text-[#374151]"
                            }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                    {selectedOption !== null && (
                      <div className={`text-xs mt-1 font-medium ${selectedOption === 1 ? "text-green-400" : "text-red-400"}`}>
                        {selectedOption === 1 ? "✓ Correct! Timsort is a hybrid of Merge Sort and Insertion Sort." : "✗ Not quite — Python uses Timsort."}
                      </div>
                    )}
                  </div>
                )}

                {/* Typing state idle */}
                {phase === "typing" && (
                  <div className="flex-1 flex items-center justify-center">
                    <span className="text-[#374151] text-xs">Paste a YouTube URL above to generate a quiz</span>
                  </div>
                )}

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Hero;
