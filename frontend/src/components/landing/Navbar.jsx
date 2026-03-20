import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0f1117]/80 backdrop-blur-md border-b border-[#1a1d27]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <span className="font-bold text-2xl tracking-tight text-white">
              MindArc.
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: 'smooth' })}
              className="text-[#9CA3AF] hover:text-[#F59E0B] font-medium transition-colors text-sm"
            >
              Features
            </button>
            <button
              onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: 'smooth' })}
              className="text-[#9CA3AF] hover:text-[#F59E0B] font-medium transition-colors text-sm"
            >
              About
            </button>
            <button
              onClick={() => navigate("/login")}
              className="text-[#9CA3AF] hover:text-white font-medium transition-colors text-sm"
            >
              Log In
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-5 py-2.5 bg-[#F59E0B] text-[#0f1117] text-sm font-bold hover:bg-amber-400 transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
