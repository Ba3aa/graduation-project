import { useState, useMemo } from "react";
import { useData } from "../../context/data-context";
import styles from "./sessions-page.module.css";
import DatePicker from "../../components/common/date-picker";
import CustomSelect from "../../components/common/custom-select";
import CustomTimePicker from "../../components/common/custom-time-picker";
import { Icon } from "../../components/common/icons";
import { AppIcons } from "../../components/common/icon-system-registry";
import ConfirmationModal from "../../components/common/confirmation-modal";

const SessionsPage = () => {
  const { sessions, courses, trainers, addSession, deleteSession } = useData();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const processedSessions = useMemo(() => {
    let data = [...sessions];

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      data = data.filter(
        (s) =>
          s.courseName.toLowerCase().includes(lower) ||
          s.trainerName.toLowerCase().includes(lower) ||
          s.id.toString().includes(lower)
      );
    }

    if (sortConfig.key) {
      data.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key])
          return sortConfig.direction === "asc" ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key])
          return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return data;
  }, [sessions, searchTerm, sortConfig]);

  const totalPages = Math.ceil(processedSessions.length / itemsPerPage);
  const currentData = processedSessions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc")
      direction = "desc";
    setSortConfig({ key, direction });
  };

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    courseId: "",
    trainerId: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
  });

  const [errors, setErrors] = useState({});

  const handleAddNew = () => {
    setFormData({
      courseId: "",
      trainerId: "",
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
    });
    setErrors({});
    setShowModal(true);
  };

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    sessionId: null,
  });

  const handleDelete = (id) => {
    setDeleteModal({ isOpen: true, sessionId: id });
  };

  const confirmDelete = () => {
    deleteSession(deleteModal.sessionId);
    setDeleteModal({ isOpen: false, sessionId: null });
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: null });
  };

  // --- التحقق من صحة بيانات الجلسة ---
  const validateForm = () => {
    const newErrors = {};

    if (!formData.courseId) newErrors.courseId = "Please select a course";
    if (!formData.trainerId) newErrors.trainerId = "Please select a trainer";
    if (!formData.startDate) newErrors.startDate = "Start date required";
    if (!formData.endDate) newErrors.endDate = "End date required";

    // Validate Date Range
    if (formData.startDate && formData.endDate) {
      if (new Date(formData.startDate) > new Date(formData.endDate)) {
        newErrors.endDate = "End date cannot be before start date";
      }
    }

    if (!formData.startTime) newErrors.startTime = "Start time required";
    if (!formData.endTime) newErrors.endTime = "End time required";

    /* Arabic Comment: التحقق من أن وقت النهاية يأتي بعد وقت البداية لضمان منطقية الجلسة */
    if (formData.startTime && formData.endTime) {
      if (formData.startTime >= formData.endTime) {
        newErrors.endTime = "End time must be after start time";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const selectedCourse = courses.find((c) => c.id == formData.courseId);
    const selectedTrainer = trainers.find((t) => t.id == formData.trainerId);

    if (!selectedCourse || !selectedTrainer) {
      setErrors({ ...errors, courseId: "Invalid selection" });
      return;
    }

    // Calculate duration automatically
    const start = new Date(`1970-01-01T${formData.startTime}`);
    const end = new Date(`1970-01-01T${formData.endTime}`);
    const durationHours = (end - start) / (1000 * 60 * 60);
    const formattedDuration =
      durationHours > 0 ? durationHours.toFixed(1) : "1.0";

    // تجهيز كائن الجلسة الجديد مع البيانات المدمجة
    const newSession = {
      courseId: selectedCourse.id,
      courseName: selectedCourse.name,
      trainerId: selectedTrainer.id,
      trainerName: `${selectedTrainer.firstName} ${selectedTrainer.lastName}`,
      startDate: formData.startDate,
      endDate: formData.endDate,
      startTime: formData.startTime,
      endTime: formData.endTime,
      duration: formattedDuration,
      status: "Scheduled",
    };

    addSession(newSession);
    setShowModal(false);
  };

  return (
    <>
      <div className={styles["sessions-header"]}>
        <h2>Sessions Management</h2>
      </div>

      <div className={styles["sessions-toolbar"]}>
        <div className="search-box-container">
          <div className="search-action-btn">
            <AppIcons.Search size={20} />
          </div>
          <input
            type="text"
            className="search-input-field"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <button className={styles["add-btn"]} onClick={handleAddNew}>
          + Add New Session
        </button>
      </div>

      <div className={styles["table-container"]}>
        <table className={styles["data-table"]}>
          <thead>
            <tr>
              <th
                onClick={() => requestSort("courseName")}
                className={styles["sortable"]}
              >
                Course Name{" "}
                {sortConfig.key === "courseName" ? (
                  sortConfig.direction === "asc" ? (
                    <Icon name="ArrowUp" />
                  ) : (
                    <Icon name="ArrowDown" />
                  )
                ) : (
                  ""
                )}
              </th>
              <th
                onClick={() => requestSort("trainerName")}
                className={styles["sortable"]}
              >
                Trainer{" "}
                {sortConfig.key === "trainerName" ? (
                  sortConfig.direction === "asc" ? (
                    <Icon name="ArrowUp" />
                  ) : (
                    <Icon name="ArrowDown" />
                  )
                ) : (
                  ""
                )}
              </th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Duration</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((session) => (
                <tr key={session.id}>
                  <td>{session.courseName}</td>
                  <td>{session.trainerName}</td>
                  <td>{session.startDate}</td>
                  <td>{session.endDate}</td>
                  <td>{session.duration} Hrs</td>
                  <td>
                    <button
                      className={styles["delete-button"]}
                      onClick={() => handleDelete(session.id)}
                    >
                      <svg
                        className={styles["delete-svgIcon"]}
                        viewBox="0 0 448 512"
                      >
                        <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className={styles["no-data"]}>
                  No sessions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {processedSessions.length > itemsPerPage && (
        <div className={styles["pagination"]}>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      )}

      {showModal && (
        <div
          className={styles["modal-overlay"]}
          style={{ backdropFilter: "blur(4px)" }}
        >
          <div className={styles["modal-content"]}>
            <h3>New Session</h3>
            <form
              className={styles["modal-form"]}
              onSubmit={handleSave}
              autoComplete="off"
            >
              <div className={styles["form-group"]}>
                <label>Course (Session Title)</label>
                <CustomSelect
                  value={formData.courseId}
                  onChange={(val) => handleChange("courseId", val)}
                  options={courses.map((c) => ({ value: c.id, label: c.name }))}
                  placeholder="Select Course..."
                  error={errors.courseId}
                />
                {errors.courseId && (
                  <span className={styles["error-text"]}>
                    {errors.courseId}
                  </span>
                )}
              </div>

              <div className={styles["form-group"]}>
                <label>Trainer</label>
                <CustomSelect
                  value={formData.trainerId}
                  onChange={(val) => handleChange("trainerId", val)}
                  options={trainers.map((t) => ({
                    value: t.id,
                    label: `${t.firstName} ${t.lastName}`,
                  }))}
                  placeholder="Select Trainer..."
                  error={errors.trainerId}
                />
                {errors.trainerId && (
                  <span className={styles["error-text"]}>
                    {errors.trainerId}
                  </span>
                )}
              </div>

              <div className={styles["time-inputs-grid-container"]}>
                <div className={styles["form-group"]}>
                  <label>Start Time</label>
                  <CustomTimePicker
                    value={formData.startTime}
                    onChange={(val) => handleChange("startTime", val)}
                    error={errors.startTime}
                  />
                  {errors.startTime && (
                    <span className={styles["error-text"]}>
                      {errors.startTime}
                    </span>
                  )}
                </div>
                <div className={styles["form-group"]}>
                  <label>End Time</label>
                  <CustomTimePicker
                    value={formData.endTime}
                    onChange={(val) => handleChange("endTime", val)}
                    error={errors.endTime}
                  />
                  {errors.endTime && (
                    <span className={styles["error-text"]}>
                      {errors.endTime}
                    </span>
                  )}
                </div>
              </div>

              <div className={styles["form-row"]}>
                <div className={styles["form-group"]}>
                  <label>Start Date</label>
                  <DatePicker
                    value={formData.startDate}
                    onChange={(val) => handleChange("startDate", val)}
                    error={errors.startDate}
                    placeholder="Start Date"
                  />
                  {errors.startDate && (
                    <span className={styles["error-text"]}>
                      {errors.startDate}
                    </span>
                  )}
                </div>
                <div className={styles["form-group"]}>
                  <label>End Date</label>
                  <DatePicker
                    value={formData.endDate}
                    onChange={(val) => handleChange("endDate", val)}
                    error={errors.endDate}
                    placeholder="End Date"
                  />
                  {errors.endDate && (
                    <span className={styles["error-text"]}>
                      {errors.endDate}
                    </span>
                  )}
                </div>
              </div>

              <div className={styles["modal-actions"]}>
                <button
                  type="button"
                  className={styles["cancel-btn"]}
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles["save-btn"]}>
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={confirmDelete}
        title="Delete Session"
        message="Are you sure you want to delete this session? This action cannot be undone."
      />
    </>
  );
};

export default SessionsPage;
