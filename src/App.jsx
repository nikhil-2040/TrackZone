// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx"; 
import Login from "./pages/Login";
import Register from "./pages/Register";
;

import "./styles/home.css";  
import "./styles/login.css";
import "./styles/register.css"; 

function App() {
  console.log("✅ App loaded");
  return (
      <BrowserRouter> {/* ✅ Router must wrap Routes */}
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
    </BrowserRouter>
   
  );
}
export default App;
