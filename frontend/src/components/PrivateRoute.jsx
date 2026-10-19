import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-600 gap-4">
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-3 border-indigo-100 border-t-indigo-600 animate-spin" />
          <div className="absolute w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
          </div>
        </div>
        <p className="text-sm font-medium text-slate-500 animate-pulse tracking-wide">
          Verifying session...
        </p>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
