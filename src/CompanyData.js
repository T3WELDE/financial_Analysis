import React, { useState, useEffect } from 'react';
import axios from 'axios';
// CompanyData component that displays detailed financial data and calculated ratios for a selected company
function CompanyData() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch the list of companies when the component loads
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get(
          'http://localhost/financial_analysis/api/get_companies.php'
        );
        setCompanies(response.data.companies);
      } catch (err) {
        setError('Failed to load companies');
      }
    };
    fetchCompanies();
  }, []);

  // Fetch company data when a company is selected
  useEffect(() => {
    if (!selectedCompany) return;
    const fetchCompanyData = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(
          `http://localhost/financial_analysis/api/get_dashboard_data.php?company_id=${selectedCompany}`
        );
        setCompanyData(response.data);
      } catch (err) {
        setError('Failed to load company data');
      } finally {
        setLoading(false);
      }
    };
    fetchCompanyData();
  }, [selectedCompany]);

  // Format numbers to one currency
  // GBP chosen currency as the majority of companies in the sample data are UK-based
  const formatNumber = (num) => {
    if (!num) return 'N/A';
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      maximumFractionDigits: 0
    }).format(num);
  };

  // Format ratio values
  const formatRatio = (num) => {
    if (num === null || num === undefined) return 'N/A';
    return parseFloat(num).toFixed(4);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Company data</h2>
          <p style={styles.sub}>View raw financial figures and calculated ratios for a selected company</p>
        </div>
        <select
          style={styles.select}
          value={selectedCompany}
          onChange={(e) => setSelectedCompany(e.target.value)}
        >
          <option value="">-- Select a company --</option>
          {companies.map((c) => (
            <option key={c.company_id} value={c.company_id}>
              {c.company_name}
            </option>
          ))}
        </select>
      </div>

      {error && <p style={styles.error}>{error}</p>}
      {loading && <p style={styles.loading}>Loading company data...</p>}

      {!selectedCompany && !loading && (
        <div style={styles.emptyState}>
          <p style={styles.emptyText}>Please select a company to view its data</p>
          <p style={styles.emptySub}>Upload a CSV file first if no companies appear in the dropdown</p>
        </div>
      )}

      {companyData && !loading && (
        <>
          <h3 style={styles.companyName}>{companyData.company_name}</h3>

          {/* Financial figures table */}
          <div style={styles.tableCard}>
            <h4 style={styles.tableTitle}>Financial figures</h4>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Reporting period</th>
                  <th style={styles.th}>Revenue</th>
                  <th style={styles.th}>Net profit</th>
                  <th style={styles.th}>Current assets</th>
                  <th style={styles.th}>Current liabilities</th>
                  <th style={styles.th}>Total assets</th>
                  <th style={styles.th}>Total liabilities</th>
                  <th style={styles.th}>Shareholders equity</th>
                </tr>
              </thead>
              <tbody>
                {companyData.data.map((row, index) => (
                  <tr key={index} style={index % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                    <td style={styles.td}>{row.reporting_period}</td>
                    <td style={styles.td}>{formatNumber(row.revenue)}</td>
                    <td style={styles.td}>{formatNumber(row.net_profit)}</td>
                    <td style={styles.td}>{formatNumber(row.current_assets)}</td>
                    <td style={styles.td}>{formatNumber(row.current_liabilities)}</td>
                    <td style={styles.td}>{formatNumber(row.total_assets)}</td>
                    <td style={styles.td}>{formatNumber(row.total_liabilities)}</td>
                    <td style={styles.td}>{formatNumber(row.shareholders_equity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Ratios table */}
          <div style={styles.tableCard}>
            <h4 style={styles.tableTitle}>Calculated ratios</h4>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Reporting period</th>
                  <th style={styles.th}>Profit margin</th>
                  <th style={styles.th}>Return on assets</th>
                  <th style={styles.th}>Current ratio</th>
                  <th style={styles.th}>Quick ratio</th>
                  <th style={styles.th}>Debt to equity</th>
                  <th style={styles.th}>Debt ratio</th>
                </tr>
              </thead>
              <tbody>
                {companyData.data.map((row, index) => (
                  <tr key={index} style={index % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                    <td style={styles.td}>{row.reporting_period}</td>
                    <td style={styles.td}>{formatRatio(row.profit_margin)}</td>
                    <td style={styles.td}>{formatRatio(row.return_on_assets)}</td>
                    <td style={styles.td}>{formatRatio(row.current_ratio)}</td>
                    <td style={styles.td}>{formatRatio(row.quick_ratio)}</td>
                    <td style={styles.td}>{formatRatio(row.debt_to_equity)}</td>
                    <td style={styles.td}>{formatRatio(row.debt_ratio)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
//styling for the company data component 
const styles = {
  container: { padding: '40px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' },
  title: { color: '#0C447C', fontSize: '22px', fontWeight: '500', margin: '0 0 8px' },
  sub: { color: '#888780', fontSize: '14px', margin: 0 },
  select: { height: '38px', border: '0.5px solid #D3D1C7', borderRadius: '8px', padding: '0 12px', fontSize: '13px', background: '#F1EFE8', minWidth: '220px' },
  error: { color: '#A32D2D', fontSize: '13px', background: '#FCEBEB', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px' },
  loading: { color: '#888780', fontSize: '13px' },
  emptyState: { background: '#ffffff', border: '0.5px solid #D3D1C7', borderRadius: '12px', padding: '60px', textAlign: 'center' },
  emptyText: { color: '#0C447C', fontSize: '16px', fontWeight: '500', margin: '0 0 8px' },
  emptySub: { color: '#888780', fontSize: '13px', margin: 0 },
  companyName: { color: '#0C447C', fontSize: '18px', fontWeight: '500', margin: '0 0 20px' },
  tableCard: { background: '#ffffff', border: '0.5px solid #D3D1C7', borderRadius: '12px', padding: '24px', marginBottom: '24px', overflowX: 'auto' },
  tableTitle: { color: '#0C447C', fontSize: '15px', fontWeight: '500', margin: '0 0 16px' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px', tableLayout: 'fixed' },
  th: { background: '#E6F1FB', color: '#0C447C', fontWeight: '500', padding: '8px 10px', textAlign: 'left', borderBottom: '0.5px solid #D3D1C7', fontSize: '11px', whiteSpace: 'nowrap' },
  td: { padding: '8px 10px', borderBottom: '0.5px solid #F1EFE8', color: '#2C2C2A', fontSize: '12px', whiteSpace: 'nowrap' },
  rowEven: { background: '#ffffff' },
  rowOdd: { background: '#F4F6FB' },
};

export default CompanyData;