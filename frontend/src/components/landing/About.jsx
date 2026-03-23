import React from "react";

const About = () => {
  return (
    <section id="about" className="py-20 bg-[#1a1d27]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-16 justify-center">
        <div className="lg:w-1/2">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 text-center">
            Built by Engineers. Designed for Educators.
          </h2>
          <p className="text-lg text-[#9CA3AF] leading-relaxed text-center">
            MindArc started as a final-year engineering project with one goal:
            eliminate the gap between great content and great assessment. We
            built AI-powered quiz generation from scratch — YouTube transcripts,
            PDF parsing, adaptive delivery — so educators can focus on teaching,
            not tooling.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
