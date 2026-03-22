import React, { useState, useEffect } from "react";
import api from "../services/api";

function Medication({ patient, onShowNotification }) {
  const [form, setForm] = useState({
    medicine: "",
    dosage: "",
    timing: "",
    duration_days: 30
  });
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const load = async () => {
    try {
      const res = await api.listMed(patient.id);
      setList(res.data);
    } catch (error) {
      console.error("Failed to load medications:", error);
    }
  };

  useEffect(() => {
    if (patient) load();
  }, [patient]);

  const add = async () => {
    if (!form.medicine || !form.dosage || !form.timing) {
      alert("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      const payload = { ...form, patient_id: patient.id };
      await api.addMed(payload);
      alert("Medication added successfully!");
      setForm({ medicine: "", dosage: "", timing: "", duration_days: 30 });
      load();
    } catch (e) {
      alert("Error: " + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMedication = async (medicationId, currentStatus) => {
    try {
      await api.toggleMedication(medicationId, !currentStatus);
      load();
    } catch (error) {
      alert("Failed to update medication status");
    }
  };

  const deleteMedication = async (medicationId) => {
    if (window.confirm("Are you sure you want to delete this medication?")) {
      try {
        await api.deleteMedication(medicationId);
        load();
      } catch (error) {
        alert("Failed to delete medication");
      }
    }
  };

  const testReminder = async (medication) => {
    try {
      await api.testReminder(medication.id);
      onShowNotification(medication);
    } catch (error) {
      console.error("Failed to test reminder:", error);
      alert("Failed to test reminder. Please try again.");
    }
  };

  return (
    <div className="card fade-in">
      <h3 className="card-title">💊 Medication Management</h3>
      
      <div className="form-section">
        <h4>Add New Medication</h4>
        <div className="form-group">
          <label>Medicine Name *</label>
          <input
            className="input-field"
            placeholder="e.g., Metformin, Aspirin"
            value={form.medicine}
            onChange={e => setForm({ ...form, medicine: e.target.value })}
          />
        </div>
        
        <div className="form-group">
          <label>Dosage *</label>
          <input
            className="input-field"
            placeholder="e.g., 1 tablet, 500mg"
            value={form.dosage}
            onChange={e => setForm({ ...form, dosage: e.target.value })}
          />
        </div>
        
        <div className="form-group">
          <label>Timing *</label>
          <input
            className="input-field"
            placeholder='e.g., "09:00,21:00" or "08:00"'
            value={form.timing}
            onChange={e => setForm({ ...form, timing: e.target.value })}
          />
          <small style={{ color: "#666", fontSize: "0.9rem" }}>
            Use 24-hour format, separate multiple times with commas
          </small>
        </div>
        
        <div className="form-group">
          <label>Duration (days)</label>
          <input
            className="input-field"
            type="number"
            min="1"
            value={form.duration_days}
            onChange={e => setForm({ ...form, duration_days: e.target.value })}
          />
        </div>
        
        <button 
          className="btn" 
          onClick={add} 
          disabled={isLoading}
        >
          {isLoading ? "Adding..." : "➕ Add Medication"}
        </button>
      </div>

      <div className="medications-section">
        <h4>Your Medications</h4>
        {list.length === 0 ? (
          <div className="empty-state">
            <p>No medications added yet. Add your first medication above!</p>
          </div>
        ) : (
          <ul className="medication-list">
            {list.map(m => (
              <li key={m.id} className="medication-item slide-in">
                <div className="medication-info">
                  <div className="medication-name">{m.medicine}</div>
                  <div className="medication-details">
                    <span><strong>Dosage:</strong> {m.dosage}</span>
                    <span><strong>Time:</strong> {m.timing}</span>
                    <span><strong>Duration:</strong> {m.duration_days} days</span>
                  </div>
                </div>
                <div className="medication-actions">
                  <span className={`medication-status ${m.active ? 'status-active' : 'status-inactive'}`}>
                    {m.active ? 'Active' : 'Inactive'}
                  </span>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => toggleMedication(m.id, m.active)}
                    style={{ fontSize: "0.8rem", padding: "0.25rem 0.5rem" }}
                  >
                    {m.active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button 
                    className="btn btn-success"
                    onClick={() => testReminder(m)}
                    style={{ fontSize: "0.8rem", padding: "0.25rem 0.5rem" }}
                  >
                    Test Reminder
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => deleteMedication(m.id)}
                    style={{ fontSize: "0.8rem", padding: "0.25rem 0.5rem" }}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Medication;