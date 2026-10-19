import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { 
  Compass, 
  PlusCircle, 
  User as UserIcon, 
  LogOut, 
  LogIn, 
  Menu, 
  X, 
  Sparkles,
  ArrowRight
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const baseLinks = [
  { label: "Home", to: "/", icon: Compass },
  { label: "Feed", to: "/feed", icon: Sparkles },
  { label: "Report Item", to: "/report", requiresAuth: true, icon: PlusCircle },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const navLinks = useMemo(
    () => baseLinks.filter((link) => (link.requiresAuth ? Boolean(user) : true)),
    [user]
  );

  const handleNavigate = (path) => {
    navigate(path);
    setOpen(false);
  };

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-nav transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Brand Logo */}
          <div 
            onClick={() => handleNavigate("/")}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/25 group-hover:scale-105 group-hover:shadow-md group-hover:shadow-indigo-500/35 transition-all duration-200">
              <Compass className="w-5 h-5 sm:w-5.5 sm:h-5.5 transition-transform duration-300 group-hover:rotate-45" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1 font-bold tracking-tight text-lg sm:text-xl text-slate-900 leading-none">
                <span>Track</span>
                <span className="text-indigo-600">Zone</span>
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mt-0.5">
                Lost & Found
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-full border border-slate-200/60">
            {navLinks.map((link) => {
              const active = isActive(link.to);
              const Icon = link.icon;
              return (
                <button
                  key={link.to}
                  onClick={() => handleNavigate(link.to)}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150 cursor-pointer ${
                    active
                      ? "bg-white text-indigo-600 shadow-xs font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-indigo-600" : "text-slate-400"}`} />
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Desktop Right CTA / User controls */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate("/report")}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100/80 text-xs font-semibold border border-indigo-200/60 transition-all cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Post Item
                </button>

                <button
                  onClick={() => navigate("/profile")}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    isActive("/profile")
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200 shadow-2xs"
                  }`}
                >
                  <div className="w-5 h-5 rounded-full bg-indigo-600/10 text-indigo-600 flex items-center justify-center font-bold text-[11px]">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className="max-w-[120px] truncate">{user.name || "Profile"}</span>
                </button>

                <button
                  onClick={handleLogout}
                  title="Log out"
                  className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => navigate("/login")}
                  className="px-3.5 py-1.5 rounded-xl text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 transition-all cursor-pointer"
                >
                  Log in
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 shadow-xs hover:shadow transition-all active:scale-[0.98] cursor-pointer"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 md:hidden">
            {user && (
              <button
                onClick={() => handleNavigate("/profile")}
                className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 flex items-center justify-center font-bold text-xs"
              >
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </button>
            )}
            <button
              onClick={() => setOpen(!open)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200/80 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer / Sheet */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-xs md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setOpen(false)}
            />

            {/* Slide-down / Slide-in Panel */}
            <motion.div
              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-xs bg-white shadow-2xl flex flex-col md:hidden border-l border-slate-200"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              {/* Header inside drawer */}
              <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                    <Compass className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-slate-900 text-base">TrackZone</span>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-lg text-slate-500 hover:bg-slate-100"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User overview if logged in */}
              {user && (
                <div className="p-4 mx-4 mt-4 bg-slate-50 rounded-2xl border border-slate-200/60">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                      {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <div className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
                <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Navigation
                </p>
                {navLinks.map((link) => {
                  const active = isActive(link.to);
                  const Icon = link.icon;
                  return (
                    <button
                      key={link.to}
                      onClick={() => handleNavigate(link.to)}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        active
                          ? "bg-indigo-50 text-indigo-700 font-semibold"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${active ? "text-indigo-600" : "text-slate-400"}`} />
                      {link.label}
                    </button>
                  );
                })}

                {user && (
                  <button
                    onClick={() => handleNavigate("/profile")}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive("/profile")
                        ? "bg-indigo-50 text-indigo-700 font-semibold"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <UserIcon className="w-4 h-4 text-slate-400" />
                    My Profile
                  </button>
                )}
              </div>

              {/* Drawer Bottom Actions */}
              <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-2">
                {user ? (
                  <>
                    <button
                      onClick={() => handleNavigate("/report")}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm transition-all"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Report an Item
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition-all border border-rose-200/50"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleNavigate("/register")}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 shadow-sm transition-all"
                    >
                      <span>Create Free Account</span>
                      <ArrowRight className="w-4 h-4 text-slate-300" />
                    </button>
                    <button
                      onClick={() => handleNavigate("/login")}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-all"
                    >
                      <LogIn className="w-4 h-4" />
                      Sign In
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
