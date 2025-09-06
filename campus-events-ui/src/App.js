import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [studentId, setStudentId] = useState('');
  const [eventId, setEventId] = useState('');
  const [report, setReport] = useState(null);

  const handleRegistration = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/registrations', {
        student_id: studentId,
        event_id: eventId,
      });
      alert(response.data.message);
    } catch (error) {
      alert(`Error: ${error.response.data.message}`);
    }
  };

  const fetchReport = async () => {
    try {
      const response = await axios.get('/api/reports/popularity');
      setReport(response.data);
    } catch (error) {
      alert('Error fetching report.');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <h1>🎓 Campus Event Management</h1>
          <p className="header-subtitle">Register for events and view popularity reports</p>
        </div>
      </header>
      
      <div className="main-content">
        <div className="section registration-section">
          <div className="section-header">
            <h2>📝 Register for an Event</h2>
          </div>
          <form onSubmit={handleRegistration} className="registration-form">
            <div className="form-group">
              <label>Student ID</label>
              <input
                type="number"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="Enter your student ID (e.g., 1)"
                required
              />
            </div>
            <div className="form-group">
              <label>Event ID</label>
              <input
                type="number"
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
                placeholder="Enter event ID (e.g., 1)"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Register Now
            </button>
          </form>
        </div>
        
        <div className="section report-section">
          <div className="section-header">
            <h2>📊 Event Popularity Report</h2>
          </div>
          <button onClick={fetchReport} className="btn btn-secondary">
            Generate Report
          </button>
          {report && (
            <div className="report-container">
              <h3>📈 Registration Analytics Overview</h3>
              <div className="table-wrapper">
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>Event Title</th>
                      <th>Total Registrations</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.map((item, index) => (
                      <tr key={index}>
                        <td className="event-title">{item.title}</td>
                        <td className="registration-count">
                          <span className="count-badge">{item.registration_count}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;