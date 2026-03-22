import React, { useState } from "react";
import api from "../services/api";

function VitalSigns({ patient }) {
  const [vitals, setVitals] = useState({
    heart_rate: "",
    bp_systolic: "",
    bp_diastolic: "",
    sugar: "",
    oxygen: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field, value) => {
    setVitals({ ...vitals, [field]: value });
  };

  const submit = async () => {
    // Validate required fields
    const requiredFields = ['heart_rate', 'bp_systolic', 'bp_diastolic'];
    const missingFields = requiredFields.filter(field => !vitals[field]);
    
    if (missingFields.length > 0) {
      alert(`Please fill in: ${missingFields.join(', ')}`);
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        patient_id: patient.id,
        heart_rate: vitals.heart_rate || null,
        bp_systolic: vitals.bp_systolic || null,
        bp_diastolic: vitals.bp_diastolic || null,
        sugar: vitals.sugar || null,
        oxygen: vitals.oxygen || null
      };
      await api.addVital(payload);
      alert("Vital signs saved successfully!");
      setVitals({
        heart_rate: "",
        bp_systolic: "",
        bp_diastolic: "",
        sugar: "",
        oxygen: ""
      });
    } catch (e) {
      alert("Error: " + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getBPStatus = (systolic, diastolic) => {
    if (!systolic || !diastolic) return { status: "normal", color: "#28a745" };
    
    const sys = parseInt(systolic);
    const dia = parseInt(diastolic);
    
    if (sys < 120 && dia < 80) return { status: "Normal", color: "#28a745" };
    if (sys < 130 && dia < 80) return { status: "Elevated", color: "#ffc107" };
    if (sys < 140 || dia < 90) return { status: "High Stage 1", color: "#fd7e14" };
    if (sys < 180 || dia < 120) return { status: "High Stage 2", color: "#dc3545" };
    return { status: "Crisis", color: "#6f42c1" };
  };

  const getHeartRateStatus = (hr) => {
    if (!hr) return { status: "Normal", color: "#28a745" };
    
    const heartRate = parseInt(hr);
    if (heartRate < 60) return { status: "Low", color: "#17a2b8" };
    if (heartRate > 100) return { status: "High", color: "#dc3545" };
    return { status: "Normal", color: "#28a745" };
  };

  const bpStatus = getBPStatus(vitals.bp_systolic, vitals.bp_diastolic);
  const hrStatus = getHeartRateStatus(vitals.heart_rate);

  return (
    <div className="card fade-in">
      <h3 className="card-title">🩺 Vital Signs</h3>
      <p style={{ color: "#666", marginBottom: "1.5rem" }}>
        Record your daily vital signs to track your health progress
      </p>

      <div className="vitals-form">
        <div className="form-row">
          <div className="form-group">
            <label>Heart Rate (BPM) *</label>
            <input
              className="input-field"
              placeholder="e.g., 72"
              type="number"
              value={vitals.heart_rate}
              onChange={e => handleChange("heart_rate", e.target.value)}
            />
            {vitals.heart_rate && (
              <div className="status-indicator" style={{ color: hrStatus.color }}>
                {hrStatus.status}
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Blood Pressure</label>
            <div className="bp-inputs">
              <input
                className="input-field"
                placeholder="Systolic"
                type="number"
                value={vitals.bp_systolic}
                onChange={e => handleChange("bp_systolic", e.target.value)}
              />
              <span className="bp-separator">/</span>
              <input
                className="input-field"
                placeholder="Diastolic"
                type="number"
                value={vitals.bp_diastolic}
                onChange={e => handleChange("bp_diastolic", e.target.value)}
              />
            </div>
            {vitals.bp_systolic && vitals.bp_diastolic && (
              <div className="status-indicator" style={{ color: bpStatus.color }}>
                {bpStatus.status}
              </div>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Blood Sugar (mg/dL)</label>
            <input
              className="input-field"
              placeholder="e.g., 120"
              type="number"
              value={vitals.sugar}
              onChange={e => handleChange("sugar", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Oxygen Saturation (%)</label>
            <input
              className="input-field"
              placeholder="e.g., 98"
              type="number"
              min="0"
              max="100"
              value={vitals.oxygen}
              onChange={e => handleChange("oxygen", e.target.value)}
            />
          </div>
        </div>

        <button 
          className="btn" 
          onClick={submit} 
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "💾 Save Vitals"}
        </button>
      </div>

      <div className="vitals-info">
        <h4>📊 Health Guidelines</h4>
        <div className="guidelines">
          <div className="guideline-item">
            <strong>Heart Rate:</strong> Normal: 60-100 BPM
          </div>
          <div className="guideline-item">
            <strong>Blood Pressure:</strong> Normal: &lt;120/80 mmHg
          </div>
          <div className="guideline-item">
            <strong>Blood Sugar:</strong> Normal: 70-100 mg/dL (fasting)
          </div>
          <div className="guideline-item">
            <strong>Oxygen:</strong> Normal: 95-100%
          </div>
        </div>
      </div>
    </div>
  );
}

export default VitalSigns;