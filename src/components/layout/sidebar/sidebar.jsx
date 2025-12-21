import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { title: "Dashboard", icon: "📊", path: "/home" },
    { title: "Trainers", icon: "👨‍🏫", path: "/trainers" },
    { title: "Sessions", icon: "📅", path: "/sessions" },
    { title: "Courses", icon: "📚", path: "/courses" },
    { title: "AI Reports", icon: "🤖", path: "/reports" },
  ];

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="logo-section">
        {!isOpen ? (
          <div
            className="burger-icon"
            onClick={toggleSidebar}
            title="Open Menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        ) : (
          <>
            <div className="logo-icon">🎓</div>
            <span className="logo-text">Grad Project</span>
            <button
              className="close-btn"
              onClick={toggleSidebar}
              title="Close Sidebar"
            >
              ✕
            </button>
          </>
        )}
      </div>

      <ul className="menu-list">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;

          return (
            <li
              key={index}
              className={`menu-item ${isActive ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              <span className="icon">{item.icon}</span>

              {isOpen && (
                <div className="text-container">
                  <span className="title">{item.title}</span>
                  {isActive && <span className="active-dot"></span>}
                </div>
              )}

              {!isOpen && <span className="tooltip">{item.title}</span>}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;
