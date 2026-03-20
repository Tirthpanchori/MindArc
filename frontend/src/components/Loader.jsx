import React from "react";
function Loader({ loading }) {
  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-[#0f1117] flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-[#374151] border-t-[#F59E0B] rounded-full animate-spin" />
            <p className="text-[#9CA3AF] font-bold text-sm tracking-widest uppercase">
              Loading...
            </p>
          </div>
        </div>
      )}
    </>
  );
}
export default Loader;