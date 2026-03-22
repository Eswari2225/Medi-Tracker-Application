import React, { useState } from "react";
import api from "../services/api";

function RegisterLogin({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    password: "",
    age: "",
    contact: "",
    email: "",
    caretaker: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const register = async () => {
    if (!form.name || !form.password || !form.email) {
      alert("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        name: form.name,
        password: form.password,
        age: form.age,
        contact: form.contact,
        email: form.email,
        caretaker: form.caretaker
      };
      const res = await api.register(payload);
      alert("Registration successful! Your patient ID: " + res.data.patient_id);
      setForm({ name: "", password: "", age: "", contact: "", email: "", caretaker: "" });
    } catch (err) {
      alert("Error registering: " + (err?.response?.data?.error || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  const login = async () => {
    if (!form.name || !form.password) {
      alert("Please enter both name and password");
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.login({ name: form.name, password: form.password });
      onLogin(res.data.patient);
    } catch (err) {
      alert("Login failed: " + (err?.response?.data?.error || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome to MediTracker</h2>
          <p>Your personal health companion</p>
        </div>

        <div className="auth-tabs">
          <button 
            className={`tab-btn ${mode === "login" ? "active" : ""}`}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button 
            className={`tab-btn ${mode === "register" ? "active" : ""}`}
            onClick={() => setMode("register")}
          >
            Register
          </button>
        </div>

        <div className="auth-form">
          <div className="form-group">
            <label>Name *</label>
            <input
              className="input-field"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label>Password *</label>
            <input
              className="input-field"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              type="password"
            />
          </div>

          {mode === "register" && (
            <>
              <div className="form-group">
                <label>Age</label>
                <input
                  className="input-field"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  placeholder="Enter your age"
                  type="number"
                />
              </div>

              <div className="form-group">
                <label>Contact Number</label>
                <input
                  className="input-field"
                  name="contact"
                  value={form.contact}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="form-group">
                <label>Email Address *</label>
                <input
                  className="input-field"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  type="email"
                />
              </div>

              <div className="form-group">
                <label>Caretaker Information</label>
                <input
                  className="input-field"
                  name="caretaker"
                  value={form.caretaker}
                  onChange={handleChange}
                  placeholder="Caretaker name or contact info"
                />
                <small style={{ color: "#666", fontSize: "0.9rem" }}>
                  This person will receive alerts if you miss medication reminders
                </small>
              </div>
            </>
          )}

          <button 
            className="btn auth-btn" 
            onClick={mode === "login" ? login : register}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : (mode === "login" ? "🔑 Login" : "📝 Register")}
          </button>
        </div>

        <div className="auth-footer">
          <p>
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}
            <button 
              className="link-btn"
              onClick={() => setMode(mode === "login" ? "register" : "login")}
            >
              {mode === "login" ? "Register here" : "Login here"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterLogin;