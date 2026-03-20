import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, BrainCircuit, ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "About", href: "#about" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all font-space-grotesk ${
          isScrolled
            ? "bg-[#0f1117]/80 backdrop-blur-md border-b border-[#1a1d27] py-3 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
            : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-6">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="bg-[#1a1d27] border border-[#374151] p-2 rounded text-[#F59E0B] transition-colors group-hover:border-[#F59E0B]">
                <BrainCircuit size={24} />
              </div>
              <span className="text-xl font-black text-white tracking-widest uppercase">
                QuizGen<span className="text-[#F59E0B]">AI</span>
              </span>
            </Link>

            {/* Nav Links (Desktop) */}
            <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm font-bold uppercase tracking-widest text-[#9CA3AF] hover:text-white transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <Link to="/login" className="px-5 py-2.5 rounded text-sm font-bold uppercase tracking-wider text-[#9CA3AF] hover:text-white transition-colors">
                Log in
              </Link>
              <Link to="/register" className="group px-6 py-2.5 rounded bg-[#F59E0B] text-[#0f1117] font-bold text-sm uppercase tracking-wider hover:bg-amber-400 transition-colors flex items-center gap-2">
                Get Started
                <ChevronRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-[#9CA3AF] hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </nav>
        </div>
      </header>
      
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-[#0f1117] pt-24 px-6 md:hidden font-space-grotesk"
          >
            <div className="flex flex-col space-y-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-lg font-bold uppercase tracking-widest text-white border-b border-[#1a1d27] pb-4"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="flex flex-col gap-4 mt-8 w-full">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full py-4 text-center rounded border border-[#374151] text-white font-bold uppercase tracking-widest">
                  Log in
                </Link>

                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="w-full py-4 text-center rounded bg-[#F59E0B] text-[#0f1117] font-bold uppercase tracking-widest">
                  Get Started Free
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
