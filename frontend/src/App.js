import React, { useState, useEffect } from "react";
import RegisterLogin from "./components/RegisterLogin";
import VitalSigns from "./components/VitalSigns";
import Medication from "./components/Medication";
import Dashboard from "./components/Dashboard";
import ReminderTest from "./components/ReminderTest";
import NotificationPopup from "./components/NotificationPopup";
import api from "./services/api";
import "./App.css";

function App() {
  const [patient, setPatient] = useState(null);
  const [currentPage, setCurrentPage] = useState("login");
  const [notification, setNotification] = useState(null);

  const handleLogin = (patientData) => {
    setPatient(patientData);
    setCurrentPage("todo");
  };

  // Poll for reminders every 30 seconds when patient is logged in
  useEffect(() => {
    if (!patient) return;

    const pollForReminders = async () => {
      try {
        const response = await api.getUpcomingReminders(patient.id);
        const reminders = response.data;
        
        // Check for overdue reminders that should trigger popups
        const overdueReminders = reminders.filter(reminder => reminder.is_overdue);
        if (overdueReminders.length > 0) {
          // Show popup for the first overdue reminder
          showNotification(overdueReminders[0]);
        }
      } catch (error) {
        console.error("Failed to poll for reminders:", error);
      }
    };

    // Poll immediately, then every 30 seconds
    pollForReminders();
    const interval = setInterval(pollForReminders, 30000);

    return () => clearInterval(interval);
  }, [patient]);

  const showNotification = (medicationData) => {
    setNotification(medicationData);
  };

  const hideNotification = () => {
    setNotification(null);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "login":
        return <RegisterLogin onLogin={handleLogin} />;
      case "todo":
        return (
          <div className="page-container">
            <div className="page-header">
              <h2>📋 Medication Todo</h2>
              <p>Manage your daily medication schedule</p>
            </div>
            <Medication patient={patient} onShowNotification={showNotification} />
            <ReminderTest />
          </div>
        );
      case "medical":
        return (
          <div className="page-container">
            <div className="page-header">
              <h2>🏥 Medical Details</h2>
              <p>Record and track your vital signs</p>
            </div>
            <VitalSigns patient={patient} />
          </div>
        );
      case "graph":
        return (
          <div className="page-container">
            <div className="page-header">
              <h2>📊 Health Analytics</h2>
              <p>Visualize your health data trends</p>
            </div>
            <Dashboard patient={patient} />
          </div>
        );
      default:
        return <RegisterLogin onLogin={handleLogin} />;
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">🩺 MediTracker</h1>
          {patient && (
            <div className="user-info">
              <span className="welcome-text">Welcome, {patient.name}</span>
              <button 
                className="logout-btn" 
                onClick={() => {
                  setPatient(null);
                  setCurrentPage("login");
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {patient && (
        <nav className="navigation">
          <button 
            className={`nav-btn ${currentPage === "todo" ? "active" : ""}`}
            onClick={() => setCurrentPage("todo")}
          >
            📋 Todo
          </button>
          <button 
            className={`nav-btn ${currentPage === "medical" ? "active" : ""}`}
            onClick={() => setCurrentPage("medical")}
          >
            🏥 Medical
          </button>
          <button 
            className={`nav-btn ${currentPage === "graph" ? "active" : ""}`}
            onClick={() => setCurrentPage("graph")}
          >
            📊 Graph
          </button>
        </nav>
      )}

      <main className="main-content">
        {renderPage()}
      </main>

      {notification && (
        <NotificationPopup 
          medication={notification} 
          onClose={hideNotification}
          patient={patient}
        />
      )}
    </div>
  );
}

export default App;