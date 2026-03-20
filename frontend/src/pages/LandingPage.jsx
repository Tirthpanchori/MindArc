import React, { useEffect } from "react";
import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import About from "../components/landing/About";
import Testimonials from "../components/landing/Testimonials";
import CTA from "../components/landing/CTA";
import Footer from "../components/landing/Footer";

const LandingPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
          .font-space-grotesk {
            font-family: 'Space Grotesk', sans-serif;
          }
        `}
      </style>
      <div className="min-h-screen bg-[#0f1117] font-space-grotesk text-white overflow-x-hidden selection:bg-[#F59E0B] selection:text-white">
        <Navbar />
        <Hero />
        <Features />
        <About />
        {/* <Testimonials /> */}
        <CTA />
        <Footer />
      </div>
    </>
  );
};

export default LandingPage;
