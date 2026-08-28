import React, { useState } from 'react';
import axios from 'axios';

//Same username and password set by the admin
function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
//Error handling waiting for the username and password to be retrieved
    try {
      const response = await axios.post(
        'http://localhost/financial_analysis/api/login.php',
        { username, password }
      );
//Details not found and error repsonse comes; user prompted to try again
      onLogin(response.data.user);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

//HTML and CSS for the landing web page
  return (
    <div style={styles.container}>
      <div style={styles.left}>
        <div style={styles.branding}>
          <span style={styles.badge}>Financial analysis tool</span>
          <h1 style={styles.brandTitle}>Audit smarter,<br />not harder.</h1>
          <p style={styles.brandSub}>
            Upload financial data, calculate key ratios instantly,
            and identify trends across reporting periods.
          </p>
          <div style={styles.features}>
            {['Automated ratio calculations', 'Visual financial dashboards', 'Historical trend analysis'].map((f) => (
              <div key={f} style={styles.featureItem}>
                <div style={styles.tick}>✓</div>
                <span style={styles.featureText}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
//Login form with username and password inputs, error display, and submit button
      <div style={styles.right}>
        <div style={styles.formBox}>
          <h2 style={styles.formTitle}>Welcome back</h2>
          <p style={styles.formSub}>Sign in to your account to continue</p>
          <hr style={styles.divider} />

          {error && <div style={styles.errorBox}>{error}</div>}
//Form submission handling with loading state and error display
          <form onSubmit={handleSubmit}>
            <label style={styles.label}>Username</label>
            <input
              style={styles.input}
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
//Password input field with label and styling
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
//Submit button with loading state
            <button style={styles.button} type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p style={styles.helpText}>
            Having trouble signing in? Contact your administrator.
          </p>
        </div>
      </div>
    </div>
  );
}
//Styles for the login page, including layout, colors, and typography
const styles = {
  container: { display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' },
  left: { width: '45%', background: '#0C447C', display: 'flex', alignItems: 'center', padding: '48px 40px' },
  branding: { width: '100%' },
  badge: { display: 'inline-block', background: '#185FA5', color: '#B5D4F4', fontSize: '12px', padding: '4px 12px', borderRadius: '6px', marginBottom: '16px' },
  brandTitle: { color: '#ffffff', fontSize: '28px', fontWeight: '500', margin: '0 0 12px', lineHeight: '1.3' },
  brandSub: { color: '#85B7EB', fontSize: '13px', lineHeight: '1.7', margin: '0 0 32px' },
  features: { display: 'flex', flexDirection: 'column', gap: '14px' },
  featureItem: { display: 'flex', alignItems: 'center', gap: '10px' },
  tick: { width: '24px', height: '24px', borderRadius: '50%', background: '#185FA5', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', flexShrink: 0 },
  featureText: { color: '#B5D4F4', fontSize: '13px' },
  right: { flex: 1, background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 40px' },
  formBox: { width: '100%', maxWidth: '380px' },
  formTitle: { color: '#0C447C', fontSize: '22px', fontWeight: '500', margin: '0 0 6px' },
  formSub: { color: '#888780', fontSize: '13px', margin: '0 0 20px' },
  divider: { border: 'none', borderTop: '0.5px solid #D3D1C7', margin: '0 0 24px' },
  errorBox: { background: '#FCEBEB', color: '#A32D2D', fontSize: '13px', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', border: '0.5px solid #F09595' },
  label: { display: 'block', fontSize: '12px', color: '#5F5E5A', fontWeight: '500', marginBottom: '6px' },
  input: { width: '100%', height: '38px', border: '0.5px solid #D3D1C7', borderRadius: '8px', padding: '0 12px', fontSize: '13px', marginBottom: '16px', boxSizing: 'border-box', background: '#F1EFE8' },
  button: { width: '100%', height: '38px', background: '#185FA5', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' },
  helpText: { fontSize: '12px', color: '#888780', textAlign: 'center', marginTop: '20px' },
};

export default Login;