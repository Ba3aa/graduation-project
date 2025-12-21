import { useState, useRef, useEffect } from "react";
import styles from "./custom-select.module.css";

const CustomSelect = ({ value, onChange, options, placeholder, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value == value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles["custom-select-container"]} ref={containerRef}>
      <div
        className={`${styles["select-trigger"]} ${error ? styles["input-error"] : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <span style={{ opacity: 0.5 }}>▼</span>
      </div>
      {isOpen && (
        <div className={styles["options-list"]}>
          {options.map((option) => (
            <div
              key={option.value}
              className={`${styles["dropdown-item"]} ${
                option.value == value ? styles["selected"] : ""
              }`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
