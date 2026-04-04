import React from "react";
import { Form, Input, Button, Typography, message } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import login from "../assets/login.json"; // ✅ Lottie animation

const { Title, Text } = Typography;

const Login = () => {
  const navigate = useNavigate();

  // ✅ Define onFinish function
  const onFinish = async (values) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`,
        values
      );

      // ✅ Check backend response
      if (res.data.success === true || res.data.success === "true") {
        message.success("Login Successful 🎉 Redirecting...");
        
        // ✅ Save token if provided
        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
        }

        // ✅ Redirect after short delay
        setTimeout(() => navigate("/dashboard"), 1200);
      } else {
        message.error(res.data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("❌ Login Error:", err);
      message.error("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="login-container container-fluid">
      <div className="row align-items-center justify-content-center login-wrapper">
        {/* ✅ Left: Login Card */}
        <motion.div
          className="col-lg-5 col-md-6 col-11 login-card"
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Title level={2} className="login-title">
            Welcome Back 👋
          </Title>
          <Text className="login-subtext">Log in to access your account</Text>

          <Form layout="vertical" onFinish={onFinish} className="login-form">
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Enter a valid email" },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="example@mail.com" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Please enter your password" }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="••••••••" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-button">
                Log In
              </Button>
            </Form.Item>

            <Text>
              Don’t have an account?{" "}
              <a onClick={() => navigate("/register")}>Register</a>
            </Text>
          </Form>
        </motion.div>

        {/* ✅ Right: Animation */}
        <motion.div
          className="col-lg-5 col-md-6 col-11 text-center login-animation"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <Lottie animationData={login} loop autoplay />
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
