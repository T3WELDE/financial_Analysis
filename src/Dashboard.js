import React, { useState, useEffect } from 'react';
import Upload from './Upload';
import DashboardView from './DashboardView';
import CompanyData from './CompanyData';
import HistoricalTrends from './HistoricalTrends';
import AdminPanel from './AdminPanel';

// Main dashboard component that manages navigation between different tabd and handles user interactions
function Dashboard({ user, onLogout }) {
  const [activePage, setActivePage] = useState('dashboard');
  const renderPage = () => {
    switch (activePage) {
      case 'upload':
        return <Upload user={user} />;
      case 'dashboard':
        return <DashboardView />;
      case 'company':
        return <CompanyData />;
      case 'trends':
        return <HistoricalTrends />;
      case 'admin':
        return <AdminPanel user={user} />;
      default:
        return (
          <div>
// Default welcome page when no specific tab is selected, showing a greeting and prompt to select an option from the sidebar
            <h1 style={styles.welcome}>Welcome, {user.username}</h1>
            <p style={styles.sub}>Select an option from the sidebar to get started.</p>
          </div>
        );
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <div style={styles.logo}>Financial Analysis</div>
        <nav style={styles.nav}>
          <button
// Navigation buttons for different sections of the dashboard, with active state styling and conditional rendering of the admin panel link based on user role
            style={{ ...styles.navItem, ...(activePage === 'dashboard' ? styles.navActive : {}) }}
            onClick={() => setActivePage('dashboard')}
          >
           
            Dashboard
          </button>
          <button
            style={{ ...styles.navItem, ...(activePage === 'upload' ? styles.navActive : {}) }}
            onClick={() => setActivePage('upload')}
          >

            Upload CSV
          </button>
          <button
            style={{ ...styles.navItem, ...(activePage === 'company' ? styles.navActive : {}) }}
            onClick={() => setActivePage('company')}
          >

            Company data
          </button>
          <button
            style={{ ...styles.navItem, ...(activePage === 'trends' ? styles.navActive : {}) }}
            onClick={() => setActivePage('trends')}
          >

            Historical trends
          </button>
          {user.role === 'admin' && (
            <button
              style={{ ...styles.navItem, ...(activePage === 'admin' ? styles.navActive : {}) }}
              onClick={() => setActivePage('admin')}
            >

              Admin panel
            </button>
          )}
        </nav>
        <button style={styles.logoutBtn} onClick={onLogout}>Log out</button>
      </div>
      <div style={styles.main}>
        {renderPage()}
      </div>
    </div>
  );
}
// styles for the dashboard component
const styles = {
  container: { display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' },
  sidebar: { width: '220px', background: '#0C447C', display: 'flex', flexDirection: 'column', padding: '24px 16px' },
  logo: { color: '#ffffff', fontSize: '16px', fontWeight: '500', marginBottom: '32px', padding: '0 8px' },
  nav: { display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 },
  navItem: { background: 'transparent', border: 'none', color: '#B5D4F4', fontSize: '13px', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', textAlign: 'left' },
  navActive: { background: '#185FA5', color: '#ffffff' },
  logoutBtn: { background: 'transparent', border: '0.5px solid #185FA5', color: '#B5D4F4', fontSize: '13px', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', textAlign: 'left' },
  main: { flex: 1, background: '#F4F6FB', padding: '40px' },
  welcome: { color: '#0C447C', fontSize: '22px', fontWeight: '500', margin: '0 0 8px' },
  sub: { color: '#888780', fontSize: '14px', margin: 0 },
};

export default Dashboard;