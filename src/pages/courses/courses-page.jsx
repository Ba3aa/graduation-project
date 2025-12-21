import { useState, useMemo } from "react";
import { useData } from "../../context/data-context.jsx";
import "./courses-page.css";
import { AppIcons } from "../../components/common/icon-system-registry";
import ConfirmationModal from "../../components/common/confirmation-modal";

const CoursesPage = () => {
  // 2. سحب بيانات الكورسات ودوال التعديل من الكونتكست (بدل الـ State المحلي)
  const { courses, addCourse, updateCourse, deleteCourse } = useData();

  // --- إعدادات التحكم (Search & Sort & Pagination) ---
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // --- معالجة البيانات (فلترة وترتيب) باستخدام useMemo لتحسين الأداء ---
  const processedCourses = useMemo(() => {
    let data = [...courses];

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      data = data.filter(
        (c) =>
          c.name.toLowerCase().includes(lower) ||
          c.level.toLowerCase().includes(lower) ||
          c.id.toString().includes(lower)
      );
    }

    // منطق الترتيب الديناميكي بناءً على العمود المختار
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
  }, [courses, searchTerm, sortConfig]);

  const totalPages = Math.ceil(processedCourses.length / itemsPerPage);
  const currentData = processedCourses.slice(
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
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: "", // تم تصحيح الاسم ليتطابق مع باقي الكود
    level: "Beginner",
    duration: "",
  });

  // State للأخطاء
  const [errors, setErrors] = useState({});

  const handleAddNew = () => {
    setIsEditing(false);
    setFormData({
      id: null,
      name: "",
      level: "Beginner",
      duration: "",
    });
    setErrors({});
    setShowModal(true);
  };

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    courseId: null,
  });

  const handleDelete = (id) => {
    setDeleteModal({ isOpen: true, courseId: id });
  };

  const confirmDelete = () => {
    deleteCourse(deleteModal.courseId);
    setDeleteModal({ isOpen: false, courseId: null });
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: null });
  };

  // --- Validation Logic ---
  // التحقق من صحة المدخلات قبل الحفظ
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Course Name is required";
    if (!formData.duration.toString().trim())
      newErrors.duration = "Duration is required";

    // التأكد من عدم تكرار اسم الكورس (مع استثناء الكورس الحالي في حالة التعديل)
    const otherCourses = courses.filter((c) =>
      isEditing ? c.id !== formData.id : true
    );
    if (
      otherCourses.some(
        (c) => c.name.toLowerCase() === formData.name.toLowerCase()
      )
    ) {
      newErrors.name = "Course Name already exists!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (isEditing) {
      updateCourse(formData.id, formData);
    } else {
      addCourse(formData);
    }
    setShowModal(false);
  };

  return (
    <>
      <div className="page-header">
        <h2>Courses Management</h2>
      </div>

      <div className="toolbar">
        <div className="search-box-container">
          <div className="search-action-btn">
            <AppIcons.Search size={20} />
          </div>
          <input
            type="text"
            className="search-input-field"
            placeholder="Search course..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <button className="add-btn" onClick={handleAddNew}>
          + Add New Course
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th onClick={() => requestSort("id")} className="sortable">
                ID{" "}
                {sortConfig.key === "id"
                  ? sortConfig.direction === "asc"
                    ? "🔼"
                    : "🔽"
                  : ""}
              </th>
              <th onClick={() => requestSort("name")} className="sortable">
                Course Name{" "}
                {sortConfig.key === "name"
                  ? sortConfig.direction === "asc"
                    ? "🔼"
                    : "🔽"
                  : ""}
              </th>
              <th onClick={() => requestSort("level")} className="sortable">
                Level{" "}
                {sortConfig.key === "level"
                  ? sortConfig.direction === "asc"
                    ? "🔼"
                    : "🔽"
                  : ""}
              </th>
              <th>Duration</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((course) => (
                <tr key={course.id}>
                  <td>#{course.id}</td>
                  <td>{course.name}</td>
                  <td>
                    <span
                      // يفضل نقل هذه التنسيقات إلى ملف CSS لاحقاً (e.g., .badge .badge-advanced)
                      style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        backgroundColor:
                          course.level === "Advanced"
                            ? "#f8d7da"
                            : course.level === "Intermediate"
                            ? "#fff3cd"
                            : "#d4edda",
                        color:
                          course.level === "Advanced"
                            ? "#721c24"
                            : course.level === "Intermediate"
                            ? "#856404"
                            : "#155724",
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                      }}
                    >
                      {course.level}
                    </span>
                  </td>
                  <td>{course.duration}</td>
                  <td>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(course.id)}
                    >
                      <svg viewBox="0 0 448 512">
                        <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-data">
                  No courses found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {processedCourses.length > itemsPerPage && (
        <div className="pagination">
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

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" style={{ backdropFilter: "blur(4px)" }}>
          <div
            className="modal-content"
            style={{
              width: "450px",
              borderRadius: "24px",
              padding: "32px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <h3
              style={{
                textAlign: "center",
                marginBottom: "24px",
                fontSize: "1.5rem",
              }}
            >
              {isEditing ? "Edit Course" : "Add New Course"}
            </h3>
            <form
              className="modal-form"
              onSubmit={handleSave}
              autoComplete="off"
            >
              <div className="form-group">
                <label>Course Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="e.g. React Development"
                  className={errors.name ? "input-error" : ""}
                />
                {errors.name && (
                  <span className="error-text">{errors.name}</span>
                )}
              </div>

              <div className="form-group">
                <label>Level</label>
                <select
                  value={formData.level}
                  onChange={(e) => handleChange("level", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid var(--color-border)",
                    borderRadius: "10px",
                    background: "var(--color-bg)",
                    color: "var(--color-text-primary)",
                  }}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div className="form-group">
                <label>Duration (Hours)</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => handleChange("duration", e.target.value)}
                  placeholder="e.g. 40 Hours"
                  className={errors.duration ? "input-error" : ""}
                />
                {errors.duration && (
                  <span className="error-text">{errors.duration}</span>
                )}
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  {isEditing ? "Save" : "Add"}
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
        title="Delete Course"
        message="Are you sure you want to delete this course? This action cannot be undone."
      />
    </>
  );
};

export default CoursesPage;
