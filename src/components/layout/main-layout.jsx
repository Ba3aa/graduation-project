import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar/sidebar.jsx";
import { ThemeToggleIcon } from "../common/icons.jsx";

const MainLayout = ({ onToggleTheme }) => {
  return (
    <div className="dashboard-container">
      {/* السايد بار الثابت */}
      <Sidebar />

      <div className="content-wrapper">
        {/* الهيدر الثابت */}
        <header
          className="main-header"
          style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "20px 40px",
            position: "sticky",
            top: 0,
            zIndex: 90,
            backgroundColor: "var(--color-bg)",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <div
            className="header-actions"
            style={{ display: "flex", alignItems: "center", gap: "20px" }}
          >
            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className="theme-toggle-button"
              style={{ position: "relative", top: "auto", right: "auto" }}
            >
              <ThemeToggleIcon />
            </button>

            {/* User Profile Placeholder */}
            <div
              className="user-profile"
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              <div
                className="avatar"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "#ccc",
                }}
              ></div>
              <span className="user-name" style={{ fontWeight: "bold" }}>
                Admin
              </span>
            </div>
          </div>
        </header>

        {/* المحتوى المتغير (الصفحات) */}
        <div className="main-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
