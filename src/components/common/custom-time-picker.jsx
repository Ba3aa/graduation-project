import { useState, useRef, useEffect } from "react";
import styles from "./custom-time-picker.module.css";

const CustomTimePicker = ({ value, onChange, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Parse value (HH:mm 24h) to 12h format
  const parseTime = (timeStr) => {
    if (!timeStr) return { hour: "12", minute: "00", period: "AM" };
    const [h, m] = timeStr.split(":");
    let hour = parseInt(h, 10);
    const period = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return {
      hour: hour.toString().padStart(2, "0"),
      minute: m,
      period,
    };
  };

  const { hour, minute, period } = parseTime(value);

  const updateTime = (newH, newM, newP) => {
    let h = parseInt(newH, 10);
    if (newP === "PM" && h !== 12) h += 12;
    if (newP === "AM" && h === 12) h = 0;
    const timeString = `${h.toString().padStart(2, "0")}:${newM}`;
    onChange(timeString);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hours = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
  );
  const minutes = Array.from({ length: 12 }, (_, i) =>
    (i * 5).toString().padStart(2, "0")
  ); // 5 min steps
  const periods = ["AM", "PM"];

  return (
    <div className={styles["time-picker-container"]} ref={containerRef}>
      <div
        className={`${styles["select-trigger"]} ${
          error ? styles["input-error"] : ""
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{value ? `${hour}:${minute} ${period}` : "--:-- --"}</span>
        <span style={{ opacity: 0.5 }}>🕒</span>
      </div>
      {isOpen && (
        <div className={styles["time-picker-popup"]}>
          <div className={styles["time-picker-column"]}>
            {hours.map((h) => (
              <div
                key={h}
                className={`${styles["time-slot"]} ${
                  h === hour ? styles["active-time-slot"] : ""
                }`}
                onClick={() => updateTime(h, minute, period)}
              >
                {h}
              </div>
            ))}
          </div>
          <div className={styles["time-picker-column"]}>
            {minutes.map((m) => (
              <div
                key={m}
                className={`${styles["time-slot"]} ${
                  m === minute ? styles["active-time-slot"] : ""
                }`}
                onClick={() => updateTime(hour, m, period)}
              >
                {m}
              </div>
            ))}
          </div>
          <div className={styles["time-picker-column"]}>
            {periods.map((p) => (
              <div
                key={p}
                className={`${styles["time-slot"]} ${
                  p === period ? styles["active-time-slot"] : ""
                }`}
                onClick={() => updateTime(hour, minute, p)}
              >
                {p}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomTimePicker;
