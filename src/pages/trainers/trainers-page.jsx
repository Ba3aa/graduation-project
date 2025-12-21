import { useState, useMemo } from "react";
import "./trainers-page.css";
import { useData } from "../../context/data-context";
import { AppIcons } from "../../components/common/icon-system-registry";
import { EditIcon } from "../../components/common/icons";
import ConfirmationModal from "../../components/common/confirmation-modal";

const TrainersPage = () => {
  // استخدام البيانات من الـ Context بدلاً من State محلي
  const { trainers, setTrainers } = useData();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const processedTrainers = useMemo(() => {
    let data = [...trainers];
    if (searchTerm) {
      data = data.filter(
        (t) =>
          t.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.universityId.includes(searchTerm)
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
  }, [trainers, searchTerm, sortConfig]);

  const totalPages = Math.ceil(processedTrainers.length / itemsPerPage);
  const currentData = processedTrainers.slice(
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
    universityId: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});

  const handleAddNew = () => {
    setIsEditing(false);
    setFormData({
      id: null,
      universityId: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    });
    setErrors({});
    setShowModal(true);
  };

  const handleEdit = (trainer) => {
    setIsEditing(true);
    setFormData(trainer);
    setErrors({});
    setShowModal(true);
  };

  const validateForm = () => {
    const newErrors = {};
    const nameRegex = /^[a-zA-Z]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    else if (!nameRegex.test(formData.firstName))
      newErrors.firstName = "English letters only, no spaces";

    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    else if (!nameRegex.test(formData.lastName))
      newErrors.lastName = "English letters only, no spaces";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!formData.email.includes("@"))
      newErrors.email = "Invalid email format (@ missing)";

    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    else if (!phoneRegex.test(formData.phone))
      newErrors.phone = "Must be exactly 10 digits";

    if (!isEditing && !formData.universityId.trim())
      newErrors.universityId = "ID is required";

    const otherTrainers = trainers.filter((t) =>
      isEditing ? t.id !== formData.id : true
    );

    if (
      !newErrors.universityId &&
      otherTrainers.some((t) => t.universityId === formData.universityId)
    ) {
      newErrors.universityId = "This ID already exists!";
    }
    if (
      !newErrors.email &&
      otherTrainers.some(
        (t) => t.email.toLowerCase() === formData.email.toLowerCase()
      )
    ) {
      newErrors.email = "Email already used!";
    }
    if (
      !newErrors.phone &&
      otherTrainers.some((t) => t.phone === formData.phone)
    ) {
      newErrors.phone = "Phone number already used!";
    }
    if (
      !newErrors.lastName &&
      otherTrainers.some(
        (t) => t.lastName.toLowerCase() === formData.lastName.toLowerCase()
      )
    ) {
      newErrors.lastName = "Last name already taken!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (isEditing) {
      setTrainers((prev) =>
        prev.map((t) => (t.id === formData.id ? { ...t, ...formData } : t))
      );
    } else {
      const newTrainer = { ...formData, id: Date.now() };
      setTrainers([...trainers, newTrainer]);
    }
    setShowModal(false);
  };

  // --- Delete Modal State ---
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    trainerId: null,
  });

  const handleDelete = (id) => {
    setDeleteModal({ isOpen: true, trainerId: id });
  };

  const confirmDelete = () => {
    setTrainers(trainers.filter((t) => t.id !== deleteModal.trainerId));
    setDeleteModal({ isOpen: false, trainerId: null });
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: null });
  };

  return (
    <>
      <div className="page-header">
        <h2>Trainers Management</h2>
      </div>

      <div className="toolbar">
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
        <button className="add-btn" onClick={handleAddNew}>
          + Add New Trainer
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th
                onClick={() => requestSort("universityId")}
                className="sortable"
              >
                ID{" "}
                {sortConfig.key === "universityId"
                  ? sortConfig.direction === "asc"
                    ? "🔼"
                    : "🔽"
                  : ""}
              </th>
              <th onClick={() => requestSort("firstName")} className="sortable">
                Full Name{" "}
                {sortConfig.key === "firstName"
                  ? sortConfig.direction === "asc"
                    ? "🔼"
                    : "🔽"
                  : ""}
              </th>
              <th onClick={() => requestSort("email")} className="sortable">
                Email{" "}
                {sortConfig.key === "email"
                  ? sortConfig.direction === "asc"
                    ? "🔼"
                    : "🔽"
                  : ""}
              </th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((t) => (
                <tr key={t.id}>
                  <td>#{t.universityId}</td>
                  <td>
                    {t.firstName} {t.lastName}
                  </td>
                  <td>{t.email}</td>
                  <td>{t.phone}</td>
                  <td>
                    <button
                      className="action-btn edit-btn"
                      onClick={() => handleEdit(t)}
                    >
                      <EditIcon />
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(t.id)}
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
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {processedTrainers.length > itemsPerPage && (
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

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">
              {isEditing ? "Edit Contact Info" : "Add New Trainer"}
            </h3>
            <form
              className="modal-form"
              onSubmit={handleSave}
              autoComplete="off"
            >
              {!isEditing && (
                <>
                  <div className="form-group">
                    <label>ID</label>
                    <input
                      type="text"
                      value={formData.universityId}
                      onChange={(e) =>
                        handleChange("universityId", e.target.value)
                      }
                      placeholder="Ex: 2024001"
                      className={errors.universityId ? "input-error" : ""}
                    />
                    {errors.universityId && (
                      <span className="error-text">{errors.universityId}</span>
                    )}
                  </div>
                  <div className="form-group form-row">
                    <div className="form-col">
                      <label>First Name</label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) =>
                          handleChange("firstName", e.target.value)
                        }
                        placeholder="First"
                        className={errors.firstName ? "input-error" : ""}
                      />
                      {errors.firstName && (
                        <span className="error-text">{errors.firstName}</span>
                      )}
                    </div>
                    <div className="form-col">
                      <label>Last Name</label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) =>
                          handleChange("lastName", e.target.value)
                        }
                        placeholder="Last"
                        className={errors.lastName ? "input-error" : ""}
                      />
                      {errors.lastName && (
                        <span className="error-text">{errors.lastName}</span>
                      )}
                    </div>
                  </div>
                </>
              )}

              {isEditing && (
                <div className="editing-info">
                  <strong>Editing:</strong> {formData.firstName}{" "}
                  {formData.lastName} (#{formData.universityId})
                </div>
              )}

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="text"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="example@school.edu"
                  autoComplete="new-password"
                  className={errors.email ? "input-error" : ""}
                />
                {errors.email && (
                  <span className="error-text">{errors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="079xxxxxxx"
                  className={errors.phone ? "input-error" : ""}
                />
                {errors.phone && (
                  <span className="error-text">{errors.phone}</span>
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

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={confirmDelete}
        title="Delete Trainer"
        message="Are you sure you want to delete this trainer? This action cannot be undone."
      />
    </>
  );
};

export default TrainersPage;
