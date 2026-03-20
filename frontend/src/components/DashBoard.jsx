import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { LogOut, PlusSquare, FileText } from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "", role: "", id: "" });

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const storedName = localStorage.getItem("name");
    const storedId = localStorage.getItem("userId");

    setUser({
      name: storedName || "User",
      role: storedRole || "student",
      id: storedId || "",
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const handleQuizAction = () => {
    if (user.role === "teacher") {
      navigate("/create-quiz");
    } else {
      navigate("/attempt-quiz");
    }
  };

  const handleRecentQuizzes = () => {
    if (user.role === "teacher") {
      navigate("/recent-teacher-quizzes");
    } else {
      navigate("/recent-quizzes");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1117] font-space-grotesk text-white selection:bg-[#F59E0B] selection:text-[#0f1117] p-6 lg:p-12">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-[#1a1d27] pb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white mb-2">
              Welcome, <span className="text-[#F59E0B]">{user.name}</span>
            </h1>
            <p className="text-[#9CA3AF] font-medium text-sm tracking-widest uppercase">
              {user.role} Dashboard
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 rounded bg-[#1a1d27] border border-[#374151] text-[#9CA3AF] hover:text-white hover:border-red-500 hover:bg-red-500/10 transition-colors uppercase tracking-wider text-xs font-bold"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div
            onClick={handleQuizAction}
            className="group bg-[#1a1d27] border border-[#374151] rounded p-8 cursor-pointer hover:border-[#F59E0B] transition-colors relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F59E0B]/5 rounded-full blur-[40px] pointer-events-none transition-opacity group-hover:opacity-100 opacity-0" />
            <div className="w-12 h-12 rounded bg-[#0f1117] border border-[#374151] flex items-center justify-center text-[#F59E0B] mb-6 mb-4 group-hover:bg-[#F59E0B] group-hover:text-[#0f1117] transition-colors">
              <PlusSquare size={24} />
            </div>
            <h2 className="text-xl font-bold text-white mb-3">
              {user.role === "teacher" ? "Create a New Quiz" : "Join a Quiz"}
            </h2>
            <p className="text-[#9CA3AF] font-medium leading-relaxed max-w-sm">
              {user.role === "teacher"
                ? "Generate a unique code for your students to attempt, using our AI tools or manually."
                : "Enter a quiz code shared by your teacher to start your attempt."}
            </p>
          </div>

          <div 
            onClick={handleRecentQuizzes}
            className="group bg-[#1a1d27] border border-[#374151] rounded p-8 cursor-pointer hover:border-[#F59E0B] transition-colors relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F59E0B]/5 rounded-full blur-[40px] pointer-events-none transition-opacity group-hover:opacity-100 opacity-0" />
            <div className="w-12 h-12 rounded bg-[#0f1117] border border-[#374151] flex items-center justify-center text-[#F59E0B] mb-6 group-hover:bg-[#F59E0B] group-hover:text-[#0f1117] transition-colors">
              <FileText size={24} />
            </div>
            <h2 className="text-xl font-bold text-white mb-3">Recent Quizzes</h2>
            <p className="text-[#9CA3AF] font-medium leading-relaxed max-w-sm">
              View your {user.role === "teacher" ? "created" : "attempted"} quizzes history and performance metrics here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
