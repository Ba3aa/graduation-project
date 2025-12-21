import React from "react";
import ReportCard from "./report-card";
import styles from "./reports-page.module.css";

const ReportsPage = () => {
  // Mock Data for AI Reports
  const reports = [
    {
      id: 1,
      courseName: "Java Basics",
      trainerName: "Ahmad Ali",
      date: "Nov 7, 2025, 11:49 AM",
      summary:
        "The session covered OOP principles. Student engagement was high (85%), though time management on the 'Inheritance' topic could be improved.",
      performance: "Good",
      agendaAdherence: "90%",
    },
    {
      id: 2,
      courseName: "React Development",
      trainerName: "Sara Mousa",
      date: "Nov 8, 2025, 09:30 AM",
      summary:
        "Excellent explanation of Hooks. The trainer maintained a steady pace and addressed all student questions effectively.",
      performance: "Excellent",
      agendaAdherence: "100%",
    },
    {
      id: 3,
      courseName: "Database Design",
      trainerName: "Khaled Omar",
      date: "Nov 9, 2025, 02:15 PM",
      summary:
        "Normalization concepts were explained clearly. Some students struggled with 3NF, suggesting a need for more practical examples next time.",
      performance: "Average",
      agendaAdherence: "80%",
    },
    {
      id: 4,
      courseName: "Advanced Python",
      trainerName: "Noor Hassan",
      date: "Nov 10, 2025, 10:00 AM",
      summary:
        "Decorators and Generators were covered. The session ran 15 minutes over time due to deep technical discussions.",
      performance: "Good",
      agendaAdherence: "75%",
    },
  ];

  const handleViewReport = (report) => {
    console.log("--- Report Details ---");
    console.log(`Trainer: ${report.trainerName}`);
    console.log(`Performance: ${report.performance}`);
    console.log(`Agenda Adherence: ${report.agendaAdherence}`);
    alert(
      `Viewing report for ${report.courseName}\nCheck console for details.`
    );
  };

  return (
    <div className={styles["page-container"]}>
      <div className={styles["page-header"]}>
        <h2 className={styles["page-title"]}>AI Reports</h2>
      </div>

      <div className={styles["grid-container"]}>
        {reports.map((report) => (
          <ReportCard key={report.id} data={report} onView={handleViewReport} />
        ))}
      </div>
    </div>
  );
};

export default ReportsPage;
