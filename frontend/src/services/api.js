import axios from "axios";

// Use environment variable for API URL, fallback to localhost for development
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export default {
  // Authentication
  register: (payload) => axios.post(`${API_BASE}/auth/register`, payload),
  login: (payload) => axios.post(`${API_BASE}/auth/login`, payload),

  // Vital Signs
  addVital: (payload) => axios.post(`${API_BASE}/vitals/add`, payload),
  getVitals: (patient_id) => axios.get(`${API_BASE}/vitals/all/${patient_id}`),

  // Medication Management
  addMed: (payload) => axios.post(`${API_BASE}/medication/add`, payload),
  listMed: (patient_id) => axios.get(`${API_BASE}/medication/list/${patient_id}`),
  toggleMedication: (medication_id, active) => 
    axios.put(`${API_BASE}/medication/toggle/${medication_id}`, { active }),
  deleteMedication: (medication_id) => 
    axios.delete(`${API_BASE}/medication/delete/${medication_id}`),

  // Reminders and Notifications
  checkReminders: () => axios.get(`${API_BASE}/reminders/health-check`),
  confirmMedication: (payload) => axios.post(`${API_BASE}/reminders/confirm`, payload),
  sendCaretakerAlert: (payload) => axios.post(`${API_BASE}/reminders/caretaker-alert`, payload),
  
  // Medication Reminders
  getUpcomingReminders: (patient_id) => 
    axios.get(`${API_BASE}/reminders/upcoming/${patient_id}`),
  markReminderCompleted: (reminder_id) => 
    axios.post(`${API_BASE}/reminders/completed/${reminder_id}`),
  testReminder: (medication_id) => 
    axios.post(`${API_BASE}/reminders/test/${medication_id}`),
  triggerAllReminders: (patient_id) => 
    axios.post(`${API_BASE}/reminders/trigger-all/${patient_id}`)
};