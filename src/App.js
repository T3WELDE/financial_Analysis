import React, { useState } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';
import axios from 'axios';
// Main App component that manages user authentication state and renders either the Login component or the Dashboard component
function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };
// Logout function that sends a request to the backend to end the user session and clears the user state in the frontend
  const handleLogout = async () => {
    try {
// Send logout request to the backend to end the session
      await axios.post('http://localhost/financial_analysis/api/logout.php');
    } catch (err) {
      console.error('Logout error:', err);
    }
    setUser(null);
  };
// If no user is logged in, load the Login component; otherwise, load the Dashboard component
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }
// load the Dashboard component and pass the logged-in user and logout function as successful
  return <Dashboard user={user} onLogout={handleLogout} />;
}

export default App;