import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminPanel({ user }) {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '', role: 'user' });

  // Fetch users when component loads
  useEffect(() => {
    fetchUsers();
    fetchLogs();
  }, []);
// Fetch users from the backend API and handle loading and error states
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        'http://localhost/financial_analysis/api/get_users.php'
      );
      setUsers(response.data.users);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };
// Fetch system logs from the backend API and handle error state
  const fetchLogs = async () => {
    try {
      const response = await axios.get(
        'http://localhost/financial_analysis/api/get_logs.php'
      );
      setLogs(response.data.logs);
    } catch (err) {
      setError('Failed to load logs');
    }
  };
// Handle creating a new user by sending the new user data to the backend API and updating the user list on success
  const handleCreateUser = async () => {
    setError('');
    setSuccess('');
    if (!newUser.username || !newUser.email || !newUser.password) {
      setError('Please fill in all fields');
      return;
    }
// Send new user data to the backend API to create the user
    try {
      const response = await axios.post(
        'http://localhost/financial_analysis/api/create_user.php',
        newUser
      );
// On success, display a success message, reset the new user form, and refresh the user list
      setSuccess(response.data.message);
      setNewUser({ username: '', email: '', password: '', role: 'user' });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create user');
    }
  };
// Handle deactivating a user by sending the user ID to the backend API and updating the user list on success
  const handleDeactivateUser = async (userId) => {
    setError('');
    setSuccess('');
    if (userId === user.user_id) {
      setError('You cannot deactivate your own account');
      return;
    }
// Send user ID to the backend API to deactivate the user
    try {
      const response = await axios.post(
        'http://localhost/financial_analysis/api/deactivate_user.php',
        { user_id: userId }
      );
      setSuccess(response.data.message);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to deactivate user');
    }
  };
// Define the tabs for the admin panel
  const tabs = [
    { key: 'users', label: 'User management' },
    { key: 'logs', label: 'System logs' },
  ];
// Render the admin panel with tab navigation, user management form and table, and system logs table
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Admin panel</h2>
      <p style={styles.sub}>Manage user accounts and view system activity</p>
// Display error or success messages if present
      {error && <p style={styles.error}>{error}</p>}
      {success && <p style={styles.success}>{success}</p>}

      {/* Tab navigation */}
      <div style={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            style={{ ...styles.tab, ...(activeTab === tab.key ? styles.tabActive : {}) }}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* User management tab */}
      {activeTab === 'users' && (
        <>
          {/* Create new user form */}
          <div style={styles.card}>
            <h4 style={styles.cardTitle}>Create new user</h4>
            <div style={styles.formGrid}>
              <div>
// Input fields for creating a new user, including username, email, password, and role selection
                <label style={styles.label}>Username</label>
                <input
                  style={styles.input}
                  type="text"
                  placeholder="Enter username"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                />
              </div>
              <div>

                <label style={styles.label}>Email</label>
                <input
                  style={styles.input}
                  type="email"
                  placeholder="Enter email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>
              <div>

                <label style={styles.label}>Password</label>
                <input
                  style={styles.input}
                  type="password"
                  placeholder="Enter password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                />
              </div>
              <div>
                <label style={styles.label}>Role</label>
                <select
                  style={styles.input}
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                >
                  <option value="user">Standard user</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <button style={styles.button} onClick={handleCreateUser}>
              Create user
            </button>
          </div>

          {/* Users table */}
          <div style={styles.tableCard}>
            <h4 style={styles.tableTitle}>All users</h4>
            {loading ? (
              <p style={styles.loading}>Loading users...</p>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr>
                    // Table headers for the users table, including ID, username, email, role, created at timestamp, and action column for deactivation
                    <th style={styles.th}>ID</th>
                    <th style={styles.th}>Username</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Role</th>
                    <th style={styles.th}>Created at</th>
                    <th style={styles.th}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  // Map through the users and display each user's information in a table row, with a badge for the role 
                  //deactivate button for non-admin users
                  {users.map((u, index) => (
                    <tr key={u.user_id} style={index % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                      <td style={styles.td}>{u.user_id}</td>
                      <td style={styles.td}>{u.username}</td>
                      <td style={styles.td}>{u.email}</td>
                      <td style={styles.td}>
                        <span style={{ ...styles.badge, ...(u.role === 'admin' ? styles.badgeAdmin : styles.badgeUser) }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={styles.td}>{u.created_at}</td>
                      <td style={styles.td}>
                            {user && u.user_id !== user.user_id && (
                          <button
                            style={styles.deactivateBtn}
                            onClick={() => handleDeactivateUser(u.user_id)}
                          >
                            Deactivate
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      // System logs tab
      {activeTab === 'logs' && (
        <div style={styles.tableCard}>
          <h4 style={styles.tableTitle}>System activity logs</h4>
          <table style={styles.table}>
            <thead>
              <tr>
                // Table headers for the system logs table, including log ID, user ID, action performed, status of the action, and timestamp
                <th style={styles.th}>Log ID</th>
                <th style={styles.th}>User ID</th>
                <th style={styles.th}>Action</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Logged at</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr key={log.log_id} style={index % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                  <td style={styles.td}>{log.log_id}</td>
                  <td style={styles.td}>{log.user_id}</td>
                  <td style={styles.td}>{log.action}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge, ...(log.status === 'success' ? styles.badgeSuccess : styles.badgeError) }}>
                      {log.status}
                    </span>
                  </td>
                  <td style={styles.td}>{log.logged_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
// styles for the admin panel 
const styles = {
  container: { padding: '40px' },
  title: { color: '#0C447C', fontSize: '22px', fontWeight: '500', margin: '0 0 8px' },
  sub: { color: '#888780', fontSize: '14px', margin: '0 0 24px' },
  tabs: { display: 'flex', gap: '8px', marginBottom: '24px' },
  tab: { background: 'transparent', border: '0.5px solid #D3D1C7', borderRadius: '8px', padding: '8px 20px', fontSize: '13px', cursor: 'pointer', color: '#5F5E5A' },
  tabActive: { background: '#185FA5', color: '#ffffff', border: '0.5px solid #185FA5' },
  card: { background: '#ffffff', border: '0.5px solid #D3D1C7', borderRadius: '12px', padding: '24px', marginBottom: '24px' },
  cardTitle: { color: '#0C447C', fontSize: '15px', fontWeight: '500', margin: '0 0 20px' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' },
  label: { display: 'block', fontSize: '12px', color: '#5F5E5A', fontWeight: '500', marginBottom: '6px' },
  input: { width: '100%', height: '38px', border: '0.5px solid #D3D1C7', borderRadius: '8px', padding: '0 12px', fontSize: '13px', background: '#F1EFE8', boxSizing: 'border-box' },
  button: { background: '#185FA5', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' },
  deactivateBtn: { background: 'transparent', color: '#A32D2D', border: '0.5px solid #A32D2D', borderRadius: '6px', padding: '4px 12px', fontSize: '12px', cursor: 'pointer' },
  error: { color: '#A32D2D', fontSize: '13px', background: '#FCEBEB', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px' },
  success: { color: '#27500A', fontSize: '13px', background: '#EAF3DE', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px' },
  loading: { color: '#888780', fontSize: '13px' },
  tableCard: { background: '#ffffff', border: '0.5px solid #D3D1C7', borderRadius: '12px', padding: '24px', marginBottom: '24px', overflowX: 'auto' },
  tableTitle: { color: '#0C447C', fontSize: '15px', fontWeight: '500', margin: '0 0 16px' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
  th: { background: '#E6F1FB', color: '#0C447C', fontWeight: '500', padding: '10px 12px', textAlign: 'left', borderBottom: '0.5px solid #D3D1C7' },
  td: { padding: '10px 12px', borderBottom: '0.5px solid #F1EFE8', color: '#2C2C2A' },
  rowEven: { background: '#ffffff' },
  rowOdd: { background: '#F4F6FB' },
  badge: { display: 'inline-block', fontSize: '11px', padding: '3px 10px', borderRadius: '6px', fontWeight: '500' },
  badgeAdmin: { background: '#E6F1FB', color: '#185FA5' },
  badgeUser: { background: '#F1EFE8', color: '#5F5E5A' },
  badgeSuccess: { background: '#EAF3DE', color: '#27500A' },
  badgeError: { background: '#FCEBEB', color: '#A32D2D' },
};

export default AdminPanel;