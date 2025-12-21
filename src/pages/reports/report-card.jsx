import React from "react";
import styles from "./report-card.module.css";

const ReportCard = ({ data, onView }) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles["course-name"]}>{data.courseName}</h3>
      </div>

      <div className={styles["meta-info"]}>
        <span className={styles["date-time"]}>{data.date}</span>
        <span className={styles["trainer-name"]}>
          Trainer: {data.trainerName}
        </span>
      </div>

      <div className={styles.body}>
        <p>{data.summary}</p>
      </div>

      <div className={styles.footer}>
        <button className={styles["btn-view"]} onClick={() => onView(data)}>
          View Report
        </button>
      </div>
    </div>
  );
};

export default ReportCard;
