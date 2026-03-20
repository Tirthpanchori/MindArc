import React from "react";

const PDFMockup = () => {
  const [phase, setPhase] = React.useState("idle");
  const [bar, setBar] = React.useState(0);

  React.useEffect(() => {
    let timeout;
    if (phase === "idle") {
      setBar(0);
      timeout = setTimeout(() => setPhase("parsing"), 1500);
    }
    if (phase === "parsing") {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 2;
        setBar(progress);
        if (progress >= 100) { clearInterval(interval); timeout = setTimeout(() => setPhase("questions"), 400); }
      }, 30);
      return () => { clearInterval(interval); clearTimeout(timeout); };
    }
    if (phase === "questions") {
      timeout = setTimeout(() => setPhase("idle"), 6000);
    }
    return () => clearTimeout(timeout);
  }, [phase]);

  return (
    <div className="w-full h-full bg-[#0f1117] border border-[#1a1d27] rounded p-5 flex flex-col gap-4 overflow-hidden">
      <div className={`border-2 border-dashed rounded p-4 flex items-center gap-3 transition-colors shrink-0 ${phase === "idle" ? "border-[#374151]" : "border-[#F59E0B]"}`}>
        <div className="w-8 h-10 bg-[#1a1d27] border border-[#374151] rounded flex items-center justify-center text-[10px] font-bold text-[#F59E0B] shrink-0">PDF</div>
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-white text-xs font-medium truncate">
            {phase === "idle" ? "lecture_notes_module2.pdf" : phase === "parsing" ? "Reading document..." : "Quiz ready!"}
          </span>
          <span className="text-[#9CA3AF] text-[10px]">
            {phase === "idle" ? "2.4 MB · Drop to parse" : phase === "parsing" ? `Parsing... ${bar}%` : "12 questions generated"}
          </span>
        </div>
        {phase === "questions" && <span className="ml-auto text-green-400 text-xs font-bold shrink-0">✓</span>}
      </div>

      {phase === "parsing" && (
        <div className="h-1 bg-[#1a1d27] rounded overflow-hidden shrink-0">
          <div className="h-full bg-[#F59E0B] rounded transition-all duration-100" style={{ width: `${bar}%` }}></div>
        </div>
      )}

      {phase === "questions" && (
        <div className="flex flex-col gap-2 flex-1 overflow-hidden">
          {["Q1 — Define normalization in DBMS.", "Q2 — What is a deadlock? How is it prevented?", "Q3 — Explain ACID properties."].map((q, i) => (
            <div key={i} className="bg-[#1a1d27] border border-[#374151] rounded px-3 py-2 text-[11px] text-[#9CA3AF] shrink-0">{q}</div>
          ))}
          <div className="text-[10px] text-[#374151] mt-1">+ 9 more questions</div>
        </div>
      )}

      {phase === "idle" && (
        <div className="flex-1 flex items-center justify-center text-[#374151] text-xs">
          Scanning document structure...
        </div>
      )}
    </div>
  );
};

const AnalyticsMockup = () => {
  const topics = [
    { label: "Arrays", score: 91, weak: false },
    { label: "Trees", score: 43, weak: true },
    { label: "Graphs", score: 67, weak: false },
    { label: "DP", score: 29, weak: true },
    { label: "Sorting", score: 85, weak: false },
  ];

  const [animated, setAnimated] = React.useState(false);

  React.useEffect(() => {
    const timeout = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="w-full h-full bg-[#0f1117] border border-[#1a1d27] rounded p-5 flex flex-col gap-4 overflow-hidden">
      <div className="flex items-center justify-between shrink-0">
        <span className="text-white text-xs font-bold">Class Performance — Quiz #4</span>
        <span className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F59E0B] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F59E0B]"></span>
          </span>
          <span className="text-[#F59E0B] text-[10px] font-bold uppercase tracking-widest">Live</span>
        </span>
      </div>

      <div className="flex-1 flex items-end gap-3 min-h-0">
        {topics.map((t, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
            <span className={`text-[10px] font-bold ${t.weak ? "text-[#F59E0B]" : "text-[#9CA3AF]"}`}>{t.score}%</span>
            <div className="w-full rounded-t overflow-hidden flex flex-col justify-end" style={{ height: "80%" }}>
              <div
                className={`w-full rounded-t transition-all duration-700 ${t.weak ? "bg-[#F59E0B]" : "bg-[#374151]"}`}
                style={{ height: animated ? `${t.score}%` : "0%" }}
              ></div>
            </div>
            <span className="text-[#9CA3AF] text-[10px] shrink-0">{t.label}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-[#1a1d27] pt-3 flex items-center gap-2 shrink-0">
        <div className="w-2 h-2 rounded-full bg-[#F59E0B] shrink-0"></div>
        <span className="text-[10px] text-[#9CA3AF]">Amber bars indicate weak areas — students need intervention here.</span>
      </div>
    </div>
  );
};

const FeatureRow = ({ title, description, badge, reverse, visual }) => (
  <div className={`flex flex-col gap-12 lg:gap-24 items-center ${reverse ? "lg:flex-row-reverse" : "lg:flex-row"} py-20`}>
    <div className="lg:w-1/2 w-full">
      <span className="text-[#F59E0B] font-bold tracking-widest uppercase text-sm mb-4 block">{badge}</span>
      <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">{title}</h3>
      <p className="text-lg text-[#9CA3AF] leading-relaxed">{description}</p>
    </div>
    <div className="lg:w-1/2 w-full aspect-square md:aspect-video lg:aspect-square bg-[#1a1d27] border border-[#374151] p-4">
      {visual}
    </div>
  </div>
);

const Features = () => {
  return (
    <section id="features" className="py-24 bg-[#0f1117]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Built for scale.</h2>
          <p className="mt-4 text-xl text-[#9CA3AF] max-w-2xl">
            Everything you need to succeed, structured logically without unnecessary distractions.
          </p>
        </div>
        <div className="flex flex-col divide-y divide-[#1a1d27]">
          <FeatureRow
            badge="AI Generation"
            title="Upload a PDF. Get a Quiz in Seconds."
            description="MindArc parses your course materials, lecture notes, and documents using AI — instantly generating accurate, context-aware questions. No manual effort, no copy-pasting."
            reverse={false}
            visual={<PDFMockup />}
          />
          <FeatureRow
            badge="Analytics"
            title="See Exactly Where Students Are Struggling."
            description="Real-time quiz-level analytics show accuracy rates, completion times, and concept-level breakdowns. Identify knowledge gaps at a glance — for the whole class or a single student."
            reverse={true}
            visual={<AnalyticsMockup />}
          />
        </div>
      </div>
    </section>
  );
};

export default Features;