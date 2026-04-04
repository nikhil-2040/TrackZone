// src/pages/Register.jsx
import React from "react";
import { Form, Input, Button, Typography, message } from "antd";
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import register from "../assets/register.json"; // ✅ Lottie animation
import "../styles/register.css";

const { Title, Text } = Typography;

const Register = () => {
  const navigate = useNavigate();

  // ✅ onFinish - API Integration
  const onFinish = async (values) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/register`,
        values
      );

      if (res.data.success === true || res.data.success === "true") {
        message.success("Registration Successful 🎉 Redirecting to login...");
        setTimeout(() => navigate("/login"), 1200);
      } else {
        message.error(res.data.message || "Registration failed");
      }
    } catch (err) {
      console.error("❌ Registration Error:", err);
      message.error("Something went wrong. Try again later.");
    }
  };

  return (
    <div className="register-container">
      <div className="container">
        <div className="row align-items-center justify-content-center">
          {/* ✅ Left Side - Form */}
          <motion.div
            className="col-lg-5 col-md-7 col-12"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="register-card glass-card">
              <Title level={2} className="register-title">
                Create your account
              </Title>
              <Text className="register-subtext">
                Join TrackZone — it’s quick and easy.
              </Text>

              <Form
                layout="vertical"
                onFinish={onFinish}
                className="register-form"
              >
                <Form.Item
                  label="Full Name"
                  name="name"
                  rules={[{ required: true, message: "Please enter your name" }]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="John Doe"
                    autoComplete="name"
                  />
                </Form.Item>

                <Form.Item
                  label="Email Address"
                  name="email"
                  rules={[
                    { required: true, message: "Please enter your email" },
                    { type: "email", message: "Enter a valid email" },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined />}
                    placeholder="example@mail.com"
                    autoComplete="email"
                  />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    { required: true, message: "Please enter your password" },
                    { min: 6, message: "Password must be at least 6 characters" },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="register-button"
                  >
                    Register
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </motion.div>

          {/* ✅ Right Side - Animation */}
          <motion.div
            className="col-lg-5 col-md-5 d-none d-md-block"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <Lottie
              animationData={register}
              loop={true}
              className="register-animation"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register;
