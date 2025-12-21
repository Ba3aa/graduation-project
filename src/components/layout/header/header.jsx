import React from "react";
import "./header.css";
import { ThemeToggleIcon } from "../../common/icons.jsx";

const Header = ({ onToggleTheme }) => {
  return (
    <header className="app-header">
      <div className="header-left">
        <h2 className="page-title">Overview</h2>
        <p className="current-date">{new Date().toDateString()}</p>
      </div>

      <div className="header-right">
        <div className="actions">
          <button
            className="icon-btn theme-btn"
            onClick={onToggleTheme}
            title="Switch Theme"
          >
            <ThemeToggleIcon />
          </button>

          <div className="divider"></div>

          <div className="header-user-profile">
            <div className="user-info-text">
              <span className="user-name">Bahaa</span>
              <span className="user-role">Admin</span>
            </div>
            <div className="user-avatar-small">B</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
