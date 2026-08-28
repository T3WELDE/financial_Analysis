import React, { useState } from 'react';
import axios from 'axios';

//upload componenet receives the logged in user as a prop to identify the uploaded data with the user
function Upload({ user }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
// Handle file selection and reset messages
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
    setMessage('');
  };
// Handle file upload and processing
  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }
    setLoading(true);
    setError('');
    // Prepare form data with the selected file and user ID
    const formData = new FormData();
    formData.append('csv', file);
    formData.append('user_id', user.user_id);
    try {
      const response = await axios.post(
        'http://localhost/financial_analysis/api/upload.php',
        formData
      );
      // Display success message and any validation errors returned by the server
      setMessage(response.data.message);
      if (response.data.errors && response.data.errors.length > 0) {
        setError(response.data.errors.join('\n'));
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

// Render the upload page with file input and messages
  //Upload card with file input and upload button
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Upload CSV file</h2>
      <p style={styles.sub}>Upload a financial dataset in CSV format to process and store the data</p>
      {/* Required columns info */}
      <div style={styles.columnsCard}>
        <p style={styles.columnsTitle}>Required columns</p>
        <div style={styles.columnsGrid}>
          {[
            'company_name',
            'reporting_period',
            'revenue',
            'net_profit',
            'current_assets',
            'current_liabilities',
            'total_assets',
            'total_liabilities',
            'shareholders_equity'
          ].map((col) => (
            <span key={col} style={styles.columnBadge}>{col}</span>
          ))}
        </div>
      </div>

        
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Select your file</h3>
// Custom file input styled as a drop zone with instructions and accepted format
        <label style={styles.dropZone}>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <div style={styles.dropContent}>
            <p style={styles.dropIcon}>+</p>
            <p style={styles.dropText}>Click to browse or drag and drop</p>
            <p style={styles.dropSub}>Accepted format: .csv only</p>
          </div>
        </label>
        
// Display selected file name, error messages, success messages, and upload button
        {file && (
          <p style={styles.fileName}>Selected: {file.name}</p>
        )}
        {error && (
          <div style={styles.errorBox}>
            {error.split('\n').map((e, i) => (
              <p key={i} style={{ margin: '2px 0' }}>{e}</p>
            ))}
          </div>
        )}
        {message && (
          <div style={styles.successBox}>
            <p style={{ margin: 0 }}>{message}</p>
          </div>
        )}

        <button
          style={styles.button}
          onClick={handleUpload}
          disabled={loading || !file}
        >
          {loading ? 'Uploading...' : 'Upload and process'}
        </button>
      </div>
    </div>
  );
}

// Styles for the upload page 
const styles = {
  container: { padding: '40px' },
  title: { color: '#0C447C', fontSize: '22px', fontWeight: '500', margin: '0 0 8px' },
  sub: { color: '#888780', fontSize: '14px', margin: '0 0 24px' },
  columnsCard: { background: '#ffffff', border: '0.5px solid #D3D1C7', borderRadius: '12px', padding: '16px 20px', marginBottom: '24px' },
  columnsTitle: { color: '#0C447C', fontSize: '13px', fontWeight: '500', margin: '0 0 12px' },
  columnsGrid: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  columnBadge: { background: '#F4F6FB', border: '0.5px solid #D3D1C7', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', color: '#5F5E5A', fontFamily: 'monospace' },
  card: { background: '#ffffff', border: '0.5px solid #D3D1C7', borderRadius: '12px', padding: '28px', maxWidth: '560px' },
  cardTitle: { color: '#0C447C', fontSize: '16px', fontWeight: '500', margin: '0 0 20px' },
  dropZone: { display: 'block', border: '1.5px dashed #D3D1C7', borderRadius: '10px', padding: '32px', cursor: 'pointer', marginBottom: '12px', background: '#F4F6FB', textAlign: 'center' },
  dropContent: { pointerEvents: 'none' },
  dropIcon: { fontSize: '28px', color: '#888780', margin: '0 0 8px' },
  dropText: { color: '#5F5E5A', fontSize: '14px', margin: '0 0 4px', fontWeight: '500' },
  dropSub: { color: '#888780', fontSize: '12px', margin: 0 },
  fileName: { fontSize: '13px', color: '#5F5E5A', margin: '0 0 16px' },
  errorBox: { background: '#FCEBEB', color: '#A32D2D', fontSize: '13px', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', border: '0.5px solid #F09595' },
  successBox: { background: '#EAF3DE', color: '#27500A', fontSize: '13px', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', border: '0.5px solid #C0DD97' },
  button: { background: '#185FA5', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', marginTop: '8px' },
};

export default Upload;