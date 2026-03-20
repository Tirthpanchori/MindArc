import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { setTokens } from "../utils/token";

function LoginForm({ method, route }) {
  const dummyData = {
    email: `demo3@example.com`,
    password: "password123",
    role: "student",
    username: "DemoUser",
  };

  const [email, setEmail] = useState(dummyData.email);
  const [username, setUsername] = useState(dummyData.username);
  const [password, setPassword] = useState(dummyData.password);
  const [role, setRole] = useState(dummyData.role);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (method === "login") {
        const response = await api.post(route, {
          email,       
          password,
        });

        // Save tokens
        setTokens(response.data.access, response.data.refresh);

        // Redirect based on role
        const userRole = response.data.role.toLowerCase();
        localStorage.setItem("role", response.data.role);
        navigate(userRole === "teacher" ? "/teacher" : "/student");

      } else if (method === "register") {
        const response = await api.post(route, {
          email,
          username: username , 
          password,
          role: role.toLowerCase(),
        });

        navigate("/login");
      }
    } catch (err) {
      console.error("Error during authentication:", err);
      if (err.response?.data) {
        setError(JSON.stringify(err.response.data));
      } else {
        setError("Something went wrong. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const inputStyles = "w-full bg-[#1a1d27] border border-[#374151] text-white text-sm rounded px-4 py-3 outline-none transition-colors focus:border-[#F59E0B] placeholder:text-[#374151]";

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-5">
      <div className="space-y-4">
        {method === "register" && (
          <>
            <div>
              <label className="block text-sm font-bold text-[#9CA3AF] mb-1.5 uppercase tracking-wide">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={inputStyles}
                placeholder="name@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#9CA3AF] mb-1.5 uppercase tracking-wide">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className={inputStyles}
                placeholder="Choose a username"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#9CA3AF] mb-1.5 uppercase tracking-wide">I am a</label>
              <div className="relative">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className={`${inputStyles} appearance-none cursor-pointer`}
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#9CA3AF]">
                  <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
          </>
        )}

        {method === "login" && (
          <div>
            <label className="block text-sm font-bold text-[#9CA3AF] mb-1.5 uppercase tracking-wide">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputStyles}
              placeholder="name@example.com"
            />
          </div>
        )}

        <div>
           <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-bold text-[#9CA3AF] uppercase tracking-wide">Password</label>
            {method === "login" && (
              <a href="#" className="text-xs font-bold text-[#F59E0B] hover:text-amber-400 transition-colors">
                Forgot password?
              </a>
            )}
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`${inputStyles} pr-10`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-[#9CA3AF] hover:text-white transition-colors"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.5 12c2.248 4.667 6.329 7.5 10.5 7.5 1.828 0 3.59-.45 5.18-1.26M21 12a10.477 10.477 0 00-2.48-3.777M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-2 font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 mt-4 rounded bg-[#F59E0B] text-[#0f1117] font-bold text-sm shadow hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2 text-[#0f1117]">
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            Processing...
          </span>
        ) : (
          method === "login" ? "Sign In" : "Create Account"
        )}
      </button>
    </form>
  );
}

export default LoginForm;