import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function Dashboard({ patient }) {
  const [vitals, setVitals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!patient) return;
    
    const loadVitals = async () => {
      try {
        const res = await api.getVitals(patient.id);
        setVitals(res.data);
      } catch (error) {
        console.error("Failed to load vitals:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadVitals();
  }, [patient]);

  if (isLoading) {
    return (
      <div className="card">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading your health data...</p>
        </div>
      </div>
    );
  }

  if (vitals.length === 0) {
    return (
      <div className="card">
        <div className="empty-state">
          <h3>📊 No Data Available</h3>
          <p>Start recording your vital signs to see beautiful charts here!</p>
        </div>
      </div>
    );
  }

  // Process data for charts
  const labels = vitals.map(v => {
    const date = new Date(v.timestamp);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  });

  const hrData = vitals.map(v => v.heart_rate || 0);
  const sugarData = vitals.map(v => v.sugar || 0);
  const systolicData = vitals.map(v => v.bp_systolic || 0);
  const diastolicData = vitals.map(v => v.bp_diastolic || 0);
  const oxygenData = vitals.map(v => v.oxygen || 0);

  // Chart configurations
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: '#667eea',
        borderWidth: 1,
        cornerRadius: 8
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          maxTicksLimit: 6,
          font: {
            size: 10
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          font: {
            size: 10
          }
        }
      }
    }
  };

  const heartRateConfig = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        display: true,
        text: 'Heart Rate Trends',
        font: {
          size: 14,
          weight: 'bold'
        }
      }
    }
  };

  const bloodPressureConfig = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        display: true,
        text: 'Blood Pressure Trends',
        font: {
          size: 14,
          weight: 'bold'
        }
      }
    }
  };

  const sugarConfig = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        display: true,
        text: 'Blood Sugar Levels',
        font: {
          size: 14,
          weight: 'bold'
        }
      }
    }
  };

  const oxygenConfig = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 11
          }
        }
      },
      title: {
        display: true,
        text: 'Oxygen Saturation',
        font: {
          size: 14,
          weight: 'bold'
        }
      }
    }
  };

  // Calculate averages for summary cards
  const avgHeartRate = hrData.length > 0 ? Math.round(hrData.reduce((a, b) => a + b, 0) / hrData.length) : 0;
  const avgSystolic = systolicData.length > 0 ? Math.round(systolicData.reduce((a, b) => a + b, 0) / systolicData.length) : 0;
  const avgDiastolic = diastolicData.length > 0 ? Math.round(diastolicData.reduce((a, b) => a + b, 0) / diastolicData.length) : 0;
  const avgSugar = sugarData.length > 0 ? Math.round(sugarData.reduce((a, b) => a + b, 0) / sugarData.length) : 0;
  const avgOxygen = oxygenData.length > 0 ? Math.round(oxygenData.reduce((a, b) => a + b, 0) / oxygenData.length) : 0;

  return (
    <div className="dashboard-container">
      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-icon">❤️</div>
          <div className="card-content">
            <h4>Heart Rate</h4>
            <p className="card-value">{avgHeartRate} BPM</p>
            <p className="card-status">Average</p>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="card-icon">🩸</div>
          <div className="card-content">
            <h4>Blood Pressure</h4>
            <p className="card-value">{avgSystolic}/{avgDiastolic}</p>
            <p className="card-status">mmHg</p>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="card-icon">🍯</div>
          <div className="card-content">
            <h4>Blood Sugar</h4>
            <p className="card-value">{avgSugar} mg/dL</p>
            <p className="card-status">Average</p>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="card-icon">🫁</div>
          <div className="card-content">
            <h4>Oxygen</h4>
            <p className="card-value">{avgOxygen}%</p>
            <p className="card-status">Saturation</p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        <div className="chart-container">
          <div className="chart-wrapper">
            <Line
              data={{
                labels,
                datasets: [{
                  label: "Heart Rate (BPM)",
                  data: hrData,
                  borderColor: "#667eea",
                  backgroundColor: "rgba(102, 126, 234, 0.1)",
                  borderWidth: 3,
                  fill: true,
                  tension: 0.4,
                  pointBackgroundColor: "#667eea",
                  pointBorderColor: "#fff",
                  pointBorderWidth: 2,
                  pointRadius: 4
                }]
              }}
              options={heartRateConfig}
            />
          </div>
        </div>

        <div className="chart-container">
          <div className="chart-wrapper">
            <Line
              data={{
                labels,
                datasets: [
                  {
                    label: "Systolic",
                    data: systolicData,
                    borderColor: "#ff6b6b",
                    backgroundColor: "rgba(255, 107, 107, 0.1)",
                    borderWidth: 3,
                    fill: false,
                    tension: 0.4,
                    pointBackgroundColor: "#ff6b6b",
                    pointBorderColor: "#fff",
                    pointBorderWidth: 2,
                    pointRadius: 4
                  },
                  {
                    label: "Diastolic",
                    data: diastolicData,
                    borderColor: "#4ecdc4",
                    backgroundColor: "rgba(78, 205, 196, 0.1)",
                    borderWidth: 3,
                    fill: false,
                    tension: 0.4,
                    pointBackgroundColor: "#4ecdc4",
                    pointBorderColor: "#fff",
                    pointBorderWidth: 2,
                    pointRadius: 4
                  }
                ]
              }}
              options={bloodPressureConfig}
            />
          </div>
        </div>

        <div className="chart-container">
          <div className="chart-wrapper">
            <Bar
              data={{
                labels,
                datasets: [{
                  label: "Blood Sugar (mg/dL)",
                  data: sugarData,
                  backgroundColor: "rgba(255, 193, 7, 0.8)",
                  borderColor: "#ffc107",
                  borderWidth: 2,
                  borderRadius: 8,
                  borderSkipped: false
                }]
              }}
              options={sugarConfig}
            />
          </div>
        </div>

        <div className="chart-container">
          <div className="chart-wrapper">
            <Doughnut
              data={{
                labels: ['Normal (95-100%)', 'Below Normal (<95%)'],
                datasets: [{
                  data: [
                    oxygenData.filter(o => o >= 95).length,
                    oxygenData.filter(o => o < 95).length
                  ],
                  backgroundColor: ['#28a745', '#dc3545'],
                  borderColor: ['#28a745', '#dc3545'],
                  borderWidth: 2
                }]
              }}
              options={oxygenConfig}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;