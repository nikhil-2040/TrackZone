import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "antd";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";
import { AnimatePresence, motion } from "framer-motion";
import "../styles/navbar.css";
import { useAuth } from "../context/AuthContext";

const baseLinks = [
  { label: "Home", to: "/" },
  { label: "Feed", to: "/feed" },
  { label: "Report", to: "/report", requiresAuth: true },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  const navLinks = useMemo(
    () => baseLinks.filter((link) => (link.requiresAuth ? Boolean(user) : true)),
    [user]
  );

  const handleNavigate = (path) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <header className="tz-navbar">
      <div className="tz-brand" onClick={() => handleNavigate("/")}>
        Track<span>Zone</span>
      </div>

      <nav className="tz-links">
        {navLinks.map((link) => {
          const isHomeOrFeed = link.label === "Home" || link.label === "Feed";
          return isHomeOrFeed ? (
            <Button
              key={link.to}
              type={isActive(link.to) ? "primary" : "default"}
              onClick={() => handleNavigate(link.to)}
              className="tz-nav-btn"
            >
              {link.label}
            </Button>
          ) : (
            <Link key={link.to} to={link.to} className={isActive(link.to) ? "active" : ""}>
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="tz-cta">
        {user ? (
          <>
            <Button type="text" onClick={() => navigate("/profile")}>Profile</Button>
            <Button onClick={logout}>Logout</Button>
          </>
        ) : (
          <>
            <Button type="text" onClick={() => navigate("/login")}>Login</Button>
            <Button type="primary" onClick={() => navigate("/register")}>
              Register
            </Button>
          </>
        )}
      </div>

      {/* Simple Hamburger Button */}
      <button className="tz-mobile-btn" onClick={() => setOpen(true)} aria-label="Open menu">
        <MenuOutlined />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="tz-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="tz-drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 80, damping: 20 }}
            >
              <div className="drawer-top">
                <button className="close-btn" onClick={() => setOpen(false)} aria-label="Close menu">
                  <CloseOutlined />
                </button>
              </div>
              <div className="drawer-links">
                {navLinks.map((link) => (
                  <Button
                    key={link.to}
                    type="text"
                    className={isActive(link.to) ? "active" : ""}
                    onClick={() => handleNavigate(link.to)}
                  >
                    {link.label}
                  </Button>
                ))}
                {user ? (
                  <>
                    <Button block type="primary" onClick={() => handleNavigate("/report")}>
                      Report Item
                    </Button>
                    <Button block onClick={() => handleNavigate("/profile")}>
                      Profile
                    </Button>
                    <Button
                      block
                      onClick={() => {
                        logout();
                        setOpen(false);
                      }}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button block type="primary" onClick={() => handleNavigate("/register")}>
                      Register
                    </Button>
                    <Button block onClick={() => handleNavigate("/login")}>
                      Login
                    </Button>
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
