import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, CheckCircle2 } from 'lucide-react';
import LoginForm from '../../components/LoginForm';
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0f1117] flex flex-col md:flex-row focus:outline-none selection:bg-[#F59E0B] selection:text-[#0f1117]">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
          .font-space-grotesk {
            font-family: 'Space Grotesk', sans-serif;
          }
        `}
      </style>
      
      {/* Left Side - Brand Panel */}
      <div className="w-full md:w-1/2 lg:w-[45%] bg-[#1a1d27] border-r border-[#374151] relative hidden md:flex flex-col justify-between p-12 overflow-hidden font-space-grotesk">
        
        {/* Brand Header */}
        <div className="relative z-10">
          <div 
             onClick={() => navigate('/')}
             className="flex items-center gap-3 cursor-pointer group w-fit"
          >
            <div className="bg-[#0f1117] border border-[#374151] p-2.5 rounded shadow-sm">
               <BrainCircuit className="h-6 w-6 text-[#F59E0B]" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              MindArc<span className="text-[#F59E0B]">.</span>
            </span>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 space-y-8">
           <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
             Join the Future <br />
             <span className="text-[#F59E0B]">
               Of Intelligence
             </span>
           </h1>
           <p className="text-[#9CA3AF] text-lg leading-relaxed max-w-md">
             Create your account today and unlock the power of AI-driven learning and assessment without distractive fluff.
           </p>

           <div className="space-y-4 pt-4">
              {[
                "Unlimited Quiz Generation",
                "Advanced Knowledge Graph",
                "Community Challenges"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-[#9CA3AF] font-medium">
                  <div className="text-[#F59E0B]">
                    <CheckCircle2 size={18} />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
           </div>
        </div>

        {/* Footer */}
        <div className="relative z-10">
          <p className="text-[#374151] text-sm">© {new Date().getFullYear()} MindArc Inc.</p>
        </div>
      </div>

      {/* Right Side - Auth Card */}
      <div className="w-full md:w-1/2 lg:w-[55%] flex items-center justify-center p-6 relative bg-[#0f1117] font-space-grotesk">
         {/* Mobile Header (Visible only on small screens) */}
         <div className="absolute top-6 left-6 md:hidden">
            <div onClick={() => navigate('/')} className="flex items-center gap-2">
               <BrainCircuit className="h-6 w-6 text-[#F59E0B]" />
               <span className="text-xl font-bold text-white">MindArc</span>
            </div>
         </div>

         <motion.div 
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.3 }}
           className="w-full max-w-[440px]"
         >
            {/* Tab Switcher */}
            <div className="bg-[#1a1d27] p-1.5 rounded flex items-center mb-8 border border-[#374151]">
               <button 
                 onClick={() => navigate('/login')}
                 className="flex-1 py-2 text-sm font-bold rounded text-[#9CA3AF] hover:text-white transition-all text-center"
               >
                 Login
               </button>
               <button 
                 className="flex-1 py-2 text-sm font-bold rounded text-white bg-[#374151] transition-all text-center"
               >
                 Register
               </button>
            </div>

            {/* Auth Card Content */}
            <div className="bg-[#0f1117] border border-[#374151] rounded p-8 sm:p-10 relative overflow-hidden">
               <div className="mb-8">
                 <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
                 <p className="text-[#9CA3AF] text-sm">Get started with your free account today.</p>
               </div>

               {/* The Form */}
               <LoginForm method="register" route="/accounts/" />
            </div>

            <p className="text-center text-[#374151] text-xs font-semibold mt-8 uppercase tracking-wider">
              By continuing, you agree to our <a href="#" className="text-[#9CA3AF] hover:text-white transition-colors">Terms</a> & <a href="#" className="text-[#9CA3AF] hover:text-white transition-colors">Privacy</a>.
            </p>
         </motion.div>
      </div>

    </div>
  );
}

export default Register;
