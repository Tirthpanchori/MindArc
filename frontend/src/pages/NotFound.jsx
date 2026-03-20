import React from 'react';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0f1117] font-space-grotesk selection:bg-[#F59E0B] selection:text-[#0f1117] p-6">
      <div className="text-center bg-[#1a1d27] border border-[#374151] rounded p-12 max-w-md w-full shadow-lg">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-[#0f1117] border border-[#374151] rounded text-[#F59E0B]">
            <AlertTriangle size={48} />
          </div>
        </div>
        <h1 className="text-8xl font-black text-white tracking-tighter mb-4">404</h1>
        <p className="text-lg font-bold text-white uppercase tracking-widest mb-2">
          Page Not Found
        </p>
        <p className="text-[#9CA3AF] font-medium mb-8 text-sm">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-[#F59E0B] text-[#0f1117] font-bold text-sm uppercase tracking-wider rounded hover:bg-amber-400 transition-colors"
        >
          <ArrowLeft size={16} /> Go Back Home
        </button>
      </div>
    </div>
  );
}

export default NotFound;