import React, { useState, useEffect } from "react";
import api from "../services/api";

function ReminderTest({ patient, onShowNotification }) {
  const [upcomingReminders, setUpcomingReminders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadUpcomingReminders = async () => {
    if (!patient) return;
    
    setIsLoading(true);
    try {
      const res = await api.getUpcomingReminders(patient.id);
      setUpcomingReminders(res.data);
    } catch (error) {
      console.error("Failed to load upcoming reminders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUpcomingReminders();
    // Refresh every 30 seconds
    const interval = setInterval(loadUpcomingReminders, 30000);
    return () => clearInterval(interval);
  }, [patient]);

  const testNotification = async (reminder) => {
    try {
      await api.testReminder(reminder.medication_id);
      onShowNotification(reminder);
    } catch (error) {
      console.error("Failed to test reminder:", error);
      alert("Failed to test reminder. Please try again.");
    }
  };

  const triggerAllReminders = async () => {
    try {
      await api.triggerAllReminders(patient.id);
      alert("All reminders triggered! Check the console for details.");
    } catch (error) {
      console.error("Failed to trigger all reminders:", error);
      alert("Failed to trigger all reminders. Please try again.");
    }
  };

  if (!patient) return null;

  return (
    <div className="card fade-in">
      <h3 className="card-title">🔔 Reminder Test</h3>
      <p style={{ color: "#666", marginBottom: "1rem" }}>
        Test your medication reminders and see upcoming notifications
      </p>

      <div className="reminder-controls">
        <button 
          className="btn btn-secondary" 
          onClick={loadUpcomingReminders}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "🔄 Refresh Reminders"}
        </button>
        <button 
          className="btn btn-success" 
          onClick={triggerAllReminders}
          disabled={isLoading}
        >
          🚀 Trigger All Reminders
        </button>
      </div>

      {upcomingReminders.length === 0 ? (
        <div className="empty-state">
          <p>No upcoming reminders found. Add medications to see reminders here!</p>
        </div>
      ) : (
        <div className="reminders-list">
          <h4>Upcoming Reminders</h4>
          {upcomingReminders.map((reminder, index) => (
            <div key={index} className="reminder-item">
              <div className="reminder-info">
                <div className="reminder-medication">{reminder.medicine}</div>
                <div className="reminder-details">
                  <span><strong>Dosage:</strong> {reminder.dosage}</span>
                  <span><strong>Time:</strong> {reminder.timing}</span>
                  <span><strong>Next:</strong> {new Date(reminder.reminder_time).toLocaleString()}</span>
                </div>
                {reminder.is_overdue && (
                  <div className="overdue-badge">⚠️ Overdue</div>
                )}
              </div>
              <button 
                className="btn btn-success"
                onClick={() => testNotification(reminder)}
                style={{ fontSize: "0.8rem", padding: "0.5rem 1rem" }}
              >
                Test Notification
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="reminder-info-section">
        <h4>📋 How It Works</h4>
        <div className="info-grid">
          <div className="info-item">
            <strong>1. Schedule:</strong> Add medications with specific times
          </div>
          <div className="info-item">
            <strong>2. Remind:</strong> Get popup notifications at scheduled times
          </div>
          <div className="info-item">
            <strong>3. Confirm:</strong> Click "I've Taken It" to confirm
          </div>
          <div className="info-item">
            <strong>4. Alert:</strong> Caretaker gets notified after 10 minutes
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReminderTest;