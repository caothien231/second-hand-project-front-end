import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HealthStatus from './components/HealthStatus';
import LoginPage from './components/Login';
import UserInfo from './components/UserInfo';
import HomePage from './components/HomePage';

function App() {
  return (
      <Router>
          <div className="App">
              <header className="App-header">
                  <h1>Welcome to My Application</h1>
              </header>
              <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/health-check" element={<HealthStatus />} />
                  <Route path="/user-info" element={<UserInfo />} />
                  <Route path="/home/*" element={<HomePage />} />
                  {/* Add other routes here */}
              </Routes>
          </div>
      </Router>
  );
}

export default App;
