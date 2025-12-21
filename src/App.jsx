import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/login-page/login-page.jsx";
import HomePage from "./pages/home/home-page.jsx";
import TrainersPage from "./pages/Trainers/trainers-page.jsx";
import SessionsPage from "./pages/sessions/sessions-page.jsx";
import ReportsPage from "./pages/reports/reports-page.jsx";
import CoursePage from "./pages/courses/courses-page.jsx";
import MainLayout from "./components/layout/main-layout.jsx";

function App() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage onToggleTheme={toggleTheme} />} />

        <Route element={<MainLayout onToggleTheme={toggleTheme} />}>
          {/* الصفحة الرئيسية */}
          <Route path="/home" element={<HomePage />} />
          <Route path="/trainers" element={<TrainersPage />} />
          <Route path="/sessions" element={<SessionsPage />} />
          <Route path="/courses" element={<CoursePage />} />
          <Route path="/reports" element={<ReportsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
