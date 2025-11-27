// src/pages/Home.jsx
import React, { useState } from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";
import Lottie from "lottie-react";
import loading from "../assets/loading.json"; // ✅ your animation file
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="modern-home-container container-fluid p-0">
      {/* ✅ Navbar */}
      <header className="navbar d-flex justify-content-between align-items-center px-4 py-3">
        <motion.div
          className="logo"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Track<span>Zone</span>
        </motion.div>

        <div className="d-none d-md-flex gap-3">
          <Button className="glow-button" onClick={() => navigate("/login")}>
            Login
          </Button>
          <Button className="glow-button" onClick={() => navigate("/register")}>
            Register
          </Button>
        </div>

        <div className="hamburger d-md-none" onClick={() => setMenuOpen(true)}>
          <MenuOutlined />
        </div>
      </header>

      {/* ✅ Animated Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="menu-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMenuOpen(false)}
            />

            <motion.div
              className="menu-drawer glass-drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 70, damping: 20 }}
            >
              <div className="drawer-header d-flex justify-content-end px-3 pt-3">
                <CloseOutlined
                  className="close-icon"
                  onClick={() => setMenuOpen(false)}
                />
              </div>

              <div className="drawer-content d-flex flex-column align-items-center text-center gap-3 p-4">
                <Button
                  className="glow-button w-75"
                  onClick={() => {
                    navigate("/login");
                    setMenuOpen(false);
                  }}
                >
                  Login
                </Button>
                <Button
                  className="glow-button w-75"
                  onClick={() => {
                    navigate("/register");
                    setMenuOpen(false);
                  }}
                >
                  Register
                </Button>

                <div className="drawer-footer mt-4">
                  <h4>About TrackZone</h4>
                  <p>
                    TrackZone helps you find or report lost items in your campus
                    in a fast, secure, and minimal way.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ✅ Hero Section */}
      <main className="hero-section container d-flex flex-column flex-md-row align-items-center justify-content-between mt-4">
        {/* Left Text Section */}
        <motion.div
          className="hero-text text-center text-md-start mb-4 mb-md-0"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="display-5 fw-bold mb-3">
            Reconnect with what you’ve lost.
          </h1>
          <p className="lead mb-4">
            A minimal way to report, find, and recover lost items in your campus — fast and secure.
          </p>

          <div className="cta-buttons d-flex flex-column flex-md-row justify-content-center justify-content-md-start gap-3">
            <Button
              className="glow-button"
              size="large"
              onClick={() => navigate("/register")}
            >
              Get Started
            </Button>
            <Button
              className="glow-button"
              size="large"
              onClick={() => navigate("/login")}
            >
              Already Registered?
            </Button>
          </div>
        </motion.div>

        {/* ✅ Right Animation Section */}
        <motion.div
          className="hero-animation d-flex justify-content-center"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <Lottie
            animationData={loading}
            loop
            autoplay
            className="hero-lottie"
          />
        </motion.div>
      </main>

      {/* ✅ Footer */}
      <footer className="footer text-center mt-5 py-3">
        <p>
          © {new Date().getFullYear()} TrackZone. Built for Campus Community 💙
        </p>
      </footer>
    </div>
  );
};

export default Home;
