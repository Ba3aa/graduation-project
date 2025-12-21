import React from "react";

const AnalyticsChart = () => {
  // Mock data for visualization
  const data = [35, 60, 45, 80, 50, 70, 40];

  return (
    <div
      className="analytics-chart-container"
      style={{
        background: "var(--color-surface)",
        padding: "24px",
        borderRadius: "var(--radius-card)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 10px 30px -5px var(--color-shadow)",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <h3
        style={{
          color: "var(--color-text-primary)",
          marginBottom: "24px",
          fontSize: "1.2rem",
          fontWeight: "700",
        }}
      >
        Weekly Activity
      </h3>

      {/* منطق رسم الأعمدة (Mock UI) */}
      <div
        className="chart-bars-wrapper"
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          height: "200px",
          gap: "12px",
        }}
      >
        {data.map((height, index) => (
          <div
            key={index}
            className="chart-bar"
            style={{
              height: `${height}%`,
              width: "100%",
              backgroundColor: "var(--color-primary-accent)",
              borderRadius: "6px 6px 0 0",
              opacity: 0.85,
              transition: "height 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)",
            }}
          ></div>
        ))}
      </div>

      <div
        className="chart-labels"
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "12px",
          color: "var(--color-text-secondary)",
          fontSize: "0.85rem",
        }}
      >
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
        <span>Sun</span>
      </div>
    </div>
  );
};

export default AnalyticsChart;
