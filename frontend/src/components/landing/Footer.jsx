import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#0f1117] border-t border-[#1a1d27] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <span className="font-bold text-2xl tracking-tight text-white mb-2 block">
            MindArc.
          </span>
          <p className="text-sm text-[#9CA3AF]">
            AI-powered quiz generation from YouTube, PDFs, and text. Built for educators.
          </p>
        </div>
        
        <div className="flex gap-8">
          <a href="#" className="text-[#9CA3AF] hover:text-[#F59E0B] text-sm font-medium transition-colors">Twitter</a>
          <a href="#" className="text-[#9CA3AF] hover:text-[#F59E0B] text-sm font-medium transition-colors">LinkedIn</a>
          <a href="#" className="text-[#9CA3AF] hover:text-[#F59E0B] text-sm font-medium transition-colors">Terms</a>
          <a href="#" className="text-[#9CA3AF] hover:text-[#F59E0B] text-sm font-medium transition-colors">Privacy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
