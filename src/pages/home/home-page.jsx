import React, { useState, useMemo } from "react";
import "./home-page.css";
import "./animated-text.css";
import { useData } from "../../context/data-context";
import { useNavigate } from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const HomePage = () => {
  const { trainers, sessions, courses, chartData } = useData();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState("7d");

  const filteredData = useMemo(() => {
    return chartData.filter((item) => {
      const date = new Date(item.date);
      const referenceDate = new Date("2024-06-30");
      let daysToSubtract = 90;
      if (timeRange === "30d") {
        daysToSubtract = 30;
      } else if (timeRange === "7d") {
        daysToSubtract = 7;
      }
      const startDate = new Date(referenceDate);
      startDate.setDate(startDate.getDate() - daysToSubtract);
      return date >= startDate;
    });
  }, [timeRange]);

  return (
    <div className="home-page">
      <div className="dashboard-content">
        <h2 className="animated-header">Dashboard</h2>

        {/* 1. Cards Section */}
        <div className="stats-cards">
          <div className="card" onClick={() => navigate("/trainers")}>
            <div className="card-content">
              <h3>Trainers</h3>
              <p className="stat-number">{trainers?.length || 0}</p>
            </div>
          </div>
          <div className="card" onClick={() => navigate("/sessions")}>
            <div className="card-content">
              <h3>Sessions</h3>
              <p className="stat-number">{sessions?.length || 0}</p>
            </div>
          </div>
          <div className="card" onClick={() => navigate("/courses")}>
            <div className="card-content">
              <h3>Courses</h3>
              <p className="stat-number">{courses?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="dashboard-horizontal-layout">
          <div className="chart-section">
            <div className="chart-card">
              <div className="chart-header">
                <div>
                  <h3>Area Chart - Interactive</h3>
                  <p>
                    Showing Score and Active Trainers for the last{" "}
                    {timeRange === "90d"
                      ? "3 months"
                      : timeRange === "30d"
                      ? "30 days"
                      : "7 days"}
                  </p>
                </div>
                <div className="chart-controls">
                  {[
                    { label: "7 Days", value: "7d" },
                    { label: "30 Days", value: "30d" },
                    { label: "3 Months", value: "90d" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setTimeRange(option.value)}
                      className={`chart-filter-btn ${
                        timeRange === option.value ? "active" : ""
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="chart-wrapper">
                <ResponsiveContainer>
                  <AreaChart
                    data={filteredData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="fillScore"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="var(--color-primary-accent)"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--color-primary-accent)"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                      <linearGradient
                        id="fillTrainers"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#10b981"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#10b981"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      vertical={false}
                      stroke="var(--color-border)"
                      strokeDasharray="3 3"
                    />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      minTickGap={32}
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        });
                      }}
                      stroke="var(--color-text-secondary)"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--color-surface)",
                        borderColor: "var(--color-border)",
                        borderRadius: "8px",
                        color: "var(--color-text-primary)",
                      }}
                      itemStyle={{ color: "var(--color-text-primary)" }}
                      labelStyle={{
                        color: "var(--color-text-secondary)",
                        marginBottom: "5px",
                      }}
                    />
                    <Area
                      dataKey="score"
                      type="natural"
                      fill="url(#fillScore)"
                      stroke="var(--color-primary-accent)"
                    />
                    <Area
                      dataKey="trainers"
                      type="natural"
                      fill="url(#fillTrainers)"
                      stroke="#10b981"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-vertical-layout">
          {/* 3. Table Section (Session Requests) */}
          <div className="table-container">
            <h3>Session Requests</h3>
            <table className="recent-sessions-table">
              <thead>
                <tr>
                  <th>Trainer</th>
                  <th>Course</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Duration</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {sessions?.slice(0, 5).map((session, idx) => (
                  <tr key={idx}>
                    <td>{session.trainerName}</td>
                    <td>{session.courseName}</td>
                    <td>{session.startDate}</td>
                    <td>{session.endDate}</td>
                    <td>{session.duration} Hrs</td>
                    <td>
                      <span style={{ color: "#10b981", fontWeight: "bold" }}>
                        {session.score ? `${session.score}%` : "N/A"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
