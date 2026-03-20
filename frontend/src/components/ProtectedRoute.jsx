import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../services/api";
import { getAccessToken, getRefreshToken } from "../utils/token";
import { useState, useEffect } from "react";

function ProtectedRoute({ children, allowedRole }) {
  const [isAuthorised, setIsAuthorised] = useState(null);

  useEffect(() => {
    const authenticate = async () => {
      try {
        await auth();
      } catch (err) {
        setIsAuthorised(false);
      }
    };
    authenticate();
  }, []);

  const refreshToken = async () => {
    const refresh = getRefreshToken();
    if (!refresh) {
      setIsAuthorised(false);
      return;
    }
    try {
      const response = await api.post("/accounts/token/refresh/", { refresh });
      localStorage.setItem("access_token", response.data.access);
      setIsAuthorised(true);
    } catch (error) {
      setIsAuthorised(false);
    }
  };

  const auth = async () => {
    const access = getAccessToken();
    if (!access) {
      setIsAuthorised(false);
      return;
    }
    const decoded = jwtDecode(access);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      await refreshToken();
      return;
    }

    const storedRole = localStorage.getItem("role");
    if (allowedRole && storedRole?.toLowerCase() !== allowedRole.toLowerCase()) {
      setIsAuthorised(false);
      return;
    }

    setIsAuthorised(true);
  };

  if (isAuthorised === null) {
    return (
      <div className="min-h-screen bg-[#0f1117] flex items-center justify-center font-space-grotesk">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-[#374151] border-t-[#F59E0B] rounded-full animate-spin" />
          <p className="text-[#9CA3AF] font-bold tracking-widest uppercase text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthorised ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
