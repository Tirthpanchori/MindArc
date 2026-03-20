import React from "react";
import { useNavigate } from "react-router-dom";

const CTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-32 bg-[#F59E0B]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        <h2 className="text-5xl md:text-6xl font-bold text-[#0f1117] tracking-tight mb-8">
          Ready to Build Smarter Assessments?
        </h2>
        <p className="text-xl text-[#1a1d27] mb-12 max-w-2xl font-medium">
          MindArc handles the heavy lifting — you focus on teaching. Free to try. No credit card required.
        </p>
        <button
          onClick={() => navigate("/register")}
          className="px-10 py-5 bg-[#0f1117] text-white text-lg font-bold hover:bg-[#1a1d27] transition-colors"
        >
          Get Started Free
        </button>
      </div>
    </section>
  );
};

export default CTA;
