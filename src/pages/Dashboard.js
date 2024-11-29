import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Modal } from "bootstrap";

const Dashboard = () => {
  const [records, setRecords] = useState([]);
  const [recordToEdit, setRecordToEdit] = useState(null);
  const [newRecord, setNewRecord] = useState({ name: "", email: "", phone: "", gender: "Male" });

  // Fetch all records
  useEffect(() => {
    const loadRecords = async () => {
      try {
        const response = await fetch("http://localhost/api/index.php", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error("Failed to fetch records");
        const data = await response.json();
        setRecords(data.data);
      } catch (error) {
        console.error("Error fetching records:", error);
      }
    };
    loadRecords();
  }, []);

  // Create a new record
  const createRecord = async (record) => {
    try {
      const response = await fetch("http://localhost/api/create.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      });
      if (!response.ok) throw new Error("Failed to create record");
      return await response.json();
    } catch (error) {
      console.error("Error creating record:", error);
      return null;
    }
  };

  // Update an existing record
  const updateRecord = async (id, record) => {
    try {
      const response = await fetch(`http://localhost/api/update.php/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      });
      if (!response.ok) throw new Error("Failed to update record");
      return await response.json();
    } catch (error) {
      console.error("Error updating record:", error);
      return null;
    }
  };

  // Delete a record
  const deleteRecord = async (id) => {
    try {
      const response = await fetch(`http://localhost/api/delete.php/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete record");
      }
      return await response.json();
    } catch (error) {
      console.error("Error deleting record:", error.message);
      return null;
    }
  };

  // Handle form submissions
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const result = await createRecord(newRecord);
    if (result) {
      setRecords([...records, result]);
      setNewRecord({ name: "", email: "", phone: "", gender: "Male" });
      const modal = Modal.getInstance(document.getElementById("createModal"));
      modal.hide();
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const result = await updateRecord(recordToEdit.id, recordToEdit);
    if (result) {
      setRecords(records.map((record) => (record.id === recordToEdit.id ? result : record)));
      const modal = Modal.getInstance(document.getElementById("updateModal"));
      modal.hide();
    }
  };

  const handleDelete = async (id) => {
    const result = await deleteRecord(id);
    if (result) {
      setRecords(records.filter((record) => record.id !== id));
    }
  };

  const handleEdit = (record) => {
    setRecordToEdit(record);
    const modal = new Modal(document.getElementById("updateModal"));
    modal.show();
  };

  // Logout functionality
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost/api/logout.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        window.location.href = "/"; // Redirect to login page
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="container">
      <h2 className="my-4">Records Dashboard</h2>

      <div className="d-flex justify-content-between mb-3">
        <button
          className="btn btn-primary"
          onClick={() => {
            const modal = new Modal(document.getElementById("createModal"));
            modal.show();
          }}
        >
          Create New Record
        </button>

        {/* Logout Button (Right Aligned) */}
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Gender</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id}>
              <td>{record.name}</td>
              <td>{record.email}</td>
              <td>{record.phone}</td>
              <td>{record.gender}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEdit(record)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(record.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Create Modal */}
      <div
        id="createModal"
        className="modal fade"
        tabIndex="-1"
        aria-hidden="true"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        aria-labelledby="createModalLabel"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="createModalLabel">Create Record</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form onSubmit={handleCreateSubmit} autoComplete="on">
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control mb-3"
                  id="createName"
                  name="name"
                  placeholder="Name"
                  value={newRecord.name}
                  onChange={(e) => setNewRecord({ ...newRecord, name: e.target.value })}
                  required
                  autoComplete="name"
                />
                <input
                  type="email"
                  className="form-control mb-3"
                  id="createEmail"
                  name="email"
                  placeholder="Email"
                  value={newRecord.email}
                  onChange={(e) => setNewRecord({ ...newRecord, email: e.target.value })}
                  required
                  autoComplete="email"
                />
                <input
                  type="tel"
                  className="form-control mb-3"
                  id="createPhone"
                  name="phone"
                  placeholder="Phone"
                  value={newRecord.phone}
                  onChange={(e) => setNewRecord({ ...newRecord, phone: e.target.value })}
                  required
                  pattern="^\d{10}$"
                  title="Please enter a 10-digit mobile number"
                  autoComplete="tel"
                />
                <select
                  className="form-control"
                  id="createGender"
                  name="gender"
                  value={newRecord.gender}
                  onChange={(e) => setNewRecord({ ...newRecord, gender: e.target.value })}
                  autoComplete="off"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                  Close
                </button>
                <button type="submit" className="btn btn-primary">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Update Modal */}
      <div
        id="updateModal"
        className="modal fade"
        tabIndex="-1"
        aria-hidden="true"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        aria-labelledby="updateModalLabel"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="updateModalLabel">Update Record</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form onSubmit={handleUpdateSubmit} autoComplete="on">
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control mb-3"
                  id="updateName"
                  name="name"
                  value={recordToEdit?.name || ""}
                  onChange={(e) => setRecordToEdit({ ...recordToEdit, name: e.target.value })}
                  required
                  autoComplete="name"
                />
                <input
                  type="email"
                  className="form-control mb-3"
                  id="updateEmail"
                  name="email"
                  value={recordToEdit?.email || ""}
                  onChange={(e) => setRecordToEdit({ ...recordToEdit, email: e.target.value })}
                  required
                  autoComplete="email"
                />
                <input
                  type="tel"
                  className="form-control mb-3"
                  id="updatePhone"
                  name="phone"
                  value={recordToEdit?.phone || ""}
                  onChange={(e) => setRecordToEdit({ ...recordToEdit, phone: e.target.value })}
                  required
                  pattern="^\d{10}$"
                  title="Please enter a 10-digit mobile number"
                  autoComplete="tel"
                />
                <select
                  className="form-control"
                  id="updateGender"
                  name="gender"
                  value={recordToEdit?.gender || "Male"}
                  onChange={(e) => setRecordToEdit({ ...recordToEdit, gender: e.target.value })}
                  autoComplete="off"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                  Close
                </button>
                <button type="submit" className="btn btn-primary">
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
