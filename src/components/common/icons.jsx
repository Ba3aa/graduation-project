import React from "react";
import { AppIcons } from "./icon-system-registry.js";

export const Icon = ({ name, ...props }) => {
  const LucideIcon = AppIcons[name];

  if (!LucideIcon) {
    return null;
  }

  return <LucideIcon {...props} />;
};

export const EyeOpenIcon = (props) => <Icon name="Eye" size={20} {...props} />;

export const EyeClosedIcon = (props) => (
  <Icon name="EyeOff" size={20} {...props} />
);

export const ThemeToggleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="theme-icon"
  >
    <path
      className="sun"
      d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
    />
    <path
      className="moon"
      d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
    />
    <circle className="sun" cx="12" cy="12" r="5" />
  </svg>
);

export const PasswordVisibilityIcon = ({
  showPassword,
  isBlinking,
  toggleVisibility,
}) => (
  <span
    onClick={toggleVisibility}
    className={`password-toggle-icon ${isBlinking ? "blinking" : ""}`}
    style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
  >
    {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
  </span>
);

export const EditIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="edit-icon-svg"
    {...props}
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

export const TrashIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="trash-icon-svg"
    {...props}
  >
    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);
