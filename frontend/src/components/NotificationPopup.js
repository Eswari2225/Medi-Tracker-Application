import React, { useState, useEffect } from "react";
import api from "../services/api";
import "./NotificationPopup.css";

function NotificationPopup({ medication, onClose, patient }) {
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Time's up - send alert to caretaker
          sendCaretakerAlert();
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const sendCaretakerAlert = async () => {
    try {
      await api.sendCaretakerAlert({
        patient_id: patient.id,
        medication_id: medication.id,
        medication_name: medication.medicine,
        dosage: medication.dosage,
        timing: medication.timing
      });
    } catch (error) {
      console.error("Failed to send caretaker alert:", error);
    }
  };

  const handleConfirm = async () => {
    try {
      await api.confirmMedication({
        medication_id: medication.id,
        patient_id: patient.id,
        confirmed_at: new Date().toISOString()
      });
      setIsConfirmed(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Failed to confirm medication:", error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isConfirmed) {
    return (
      <div className="notification-overlay">
        <div className="notification-popup success">
          <div className="popup-icon">✅</div>
          <h3>Medication Confirmed!</h3>
          <p>Thank you for confirming your medication intake.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="notification-overlay">
      <div className="notification-popup">
        <div className="popup-header">
          <div className="popup-icon">💊</div>
          <h3>Medication Reminder</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="popup-content">
          <div className="medication-info">
            <h4>{medication.medicine}</h4>
            <p><strong>Dosage:</strong> {medication.dosage}</p>
            <p><strong>Time:</strong> {medication.timing}</p>
          </div>
          
          <div className="timer-section">
            <div className="timer-circle">
              <div className="timer-text">{formatTime(timeLeft)}</div>
              <div className="timer-label">Time Remaining</div>
            </div>
            <p className="timer-warning">
              If you don't confirm within {formatTime(timeLeft)}, your caretaker will be notified.
            </p>
          </div>
          
          <div className="popup-actions">
            <button className="btn btn-success" onClick={handleConfirm}>
              ✅ I've Taken It
            </button>
            <button className="btn btn-secondary" onClick={onClose}>
              Skip This Time
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationPopup;
