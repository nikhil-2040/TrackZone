// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // ✅ after App import
import App from "./App";
import 'bootstrap/dist/css/bootstrap.min.css';


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
