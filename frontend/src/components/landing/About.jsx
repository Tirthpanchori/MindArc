import React from "react";

const STATS = [
  { value: "3s", label: "Avg. Quiz Generation Time" },
  { value: "3", label: "Input Methods Supported" },
  { value: "2", label: "User Roles: Teacher & Student" },
  { value: "AI", label: "Powered by Llama 3.1 via Groq" },
];

const About = () => {
  return (
    <section id="about" className="py-32 bg-[#1a1d27]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-16">
        <div className="lg:w-1/2">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Built by Engineers. Designed for Educators.
          </h2>
          <p className="text-lg text-[#9CA3AF] mb-8 leading-relaxed">
            MindArc started as a final-year engineering project with one goal: eliminate the gap between great content and great assessment. We built AI-powered quiz generation from scratch — YouTube transcripts, PDF parsing, adaptive delivery — so educators can focus on teaching, not tooling.
          </p>
        </div>
        <div className="lg:w-1/2 grid grid-cols-2 gap-x-8 gap-y-12">
          {STATS.map((stat, idx) => (
             <div key={idx} className="border-l-2 border-[#F59E0B] pl-6">
               <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
               <div className="text-sm font-medium text-[#9CA3AF] uppercase tracking-wider">{stat.label}</div>
             </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
