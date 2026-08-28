import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
//Dashboard view component that displays financial performance of a selected company, including key ratios and charts
function DashboardView() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
// Fetch list of companies from the server when the component mounts, with error handling and polling every 60 seconds to update the list
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
    const interval = setInterval(fetchCompanies, 60000);
    return () => clearInterval(interval);
  }, []);
// Fetch dashboard data for the selected company when the selection changes
  useEffect(() => {
    if (!selectedCompany) return;
    const fetchDashboardData = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(
          `http://localhost/financial_analysis/api/get_dashboard_data.php?company_id=${selectedCompany}`
        );
        setDashboardData(response.data);
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
// Fetch dashboard data when a company is selected, with error handling and loading state
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 60000);
    return () => clearInterval(interval);
  }, [selectedCompany]);

  const latestData = dashboardData?.data[dashboardData.data.length - 1];
// Helper functions to format numbers and ratios for display in the dashboard
  const formatNumber = (num) => {
    if (!num) return 'N/A';
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      maximumFractionDigits: 0
    }).format(num);
  };
// Format ratios as percentages with 2 decimal places, or display 'N/A' if value is null or undefined
  const formatRatio = (num) => {
    if (num === null || num === undefined) return 'N/A';
    return (parseFloat(num) * 100).toFixed(2) + '%';
  };
// Format plain numbers with 2 decimal places, or display 'N/A' if value is null or undefined
  const formatPlain = (num) => {
    if (num === null || num === undefined) return 'N/A';
    return parseFloat(num).toFixed(2);
  };
// Prepare data for the bar chart showing revenue and net profit over time, mapping each row of dashboard data to an object with period, Revenue, and Net profit properties
  const barChartData = dashboardData?.data.map((row) => ({
    period: row.reporting_period,
    Revenue: parseFloat(row.revenue),
    'Net profit': parseFloat(row.net_profit),
  }));
// Prepare data for the line chart showing trends of financial ratios over time, mapping each row of dashboard data to an object with period and ratio values formatted as percentages or plain numbers
  const lineChartData = dashboardData?.data.map((row) => ({
    period: row.reporting_period,
    'Profit margin': parseFloat((row.profit_margin * 100).toFixed(2)),
    'Current ratio': parseFloat(parseFloat(row.current_ratio).toFixed(2)),
    'Debt to equity': parseFloat(parseFloat(row.debt_to_equity).toFixed(2)),
    'Return on assets': parseFloat((row.return_on_assets * 100).toFixed(2)),
  }));
// Main dashboard view with company selection
//  financial ratio cards, and charts showing revenue, net profit, and ratio trends over time
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Financial dashboard</h2>
          <p style={styles.sub}>Select a company to view its financial performance</p>
        </div>
//Company selection dropdown populated with companies from the server, with error handling and loading state
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
      {loading && <p style={styles.loading}>Loading dashboard data...</p>}
// Empty state message prompting user to select a company or upload data, displayed when no company is selected and not loading
      {!selectedCompany && !loading && (
        <div style={styles.emptyState}>
          <p style={styles.emptyText}>Please select a company to view its dashboard</p>
          <p style={styles.emptySub}>Upload a CSV file first if no companies appear in the dropdown</p>
        </div>
      )}

// Dashboard content with financial ratios and charts, displayed when data is available and not loading
      {dashboardData && !loading && (
        <>
          <h3 style={styles.companyName}>{dashboardData.company_name}</h3>
          <div style={styles.cardGrid}>
            <div style={styles.card}>
// Financial ratio cards showing latest values with descriptions, displayed in a grid layout
              <p style={styles.cardLabel}>Profit margin</p>
              <p style={styles.cardValue}>{formatRatio(latestData?.profit_margin)}</p>
              <p style={styles.cardPeriod}>Latest: {latestData?.reporting_period}</p>
              <p style={styles.cardInfo}> Measures the company's ability to generate profit from its revenue</p>
            </div>

            <div style={styles.card}>
              <p style={styles.cardLabel}>Current ratio</p>
              <p style={styles.cardValue}>{formatPlain(latestData?.current_ratio)}</p>
              <p style={styles.cardPeriod}>Latest: {latestData?.reporting_period}</p>
              <p style={styles.cardInfo}> Measures the company's ability to meet its short-term obligations</p>
            </div>
            <div style={styles.card}>
              <p style={styles.cardLabel}>Debt to equity</p>
              <p style={styles.cardValue}>{formatPlain(latestData?.debt_to_equity)}</p>
              <p style={styles.cardPeriod}>Latest: {latestData?.reporting_period}</p>
              <p style={styles.cardInfo}> Measures the company's financial leverage and risk</p>
            </div>
            <div style={styles.card}>
              <p style={styles.cardLabel}>Return on assets</p>
              <p style={styles.cardValue}>{formatRatio(latestData?.return_on_assets)}</p>
              <p style={styles.cardPeriod}>Latest: {latestData?.reporting_period}</p>
              <p style={styles.cardInfo}> Measures the company's ability to generate returns on its assets</p>
            </div>
          </div>

//Bar chart showing revenue and net profit for each reporting period with tooltips and legend
          <div style={styles.chartCard}>
            <h4 style={styles.chartTitle}>Revenue vs net profit</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1EFE8" />
                <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => formatNumber(value)} />
                <Legend />
                <Bar dataKey="Revenue" fill="#185FA5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Net profit" fill="#1D9E75" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
//Line chart showing trends of multiple financial ratios over time with tooltips and legend
          <div style={styles.chartCard}>
            <h4 style={styles.chartTitle}>Financial ratio trends</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1EFE8" />
                <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
// Multiple lines for different financial ratios with distinct colors and styling
                <Line type="monotone" dataKey="Profit margin" stroke="#185FA5" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Current ratio" stroke="#1D9E75" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Debt to equity" stroke="#D85A30" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Return on assets" stroke="#BA7517" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}
//styles for the dashboard view
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
  cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' },
  cardInfo: { color: '#888780', fontSize: '11px', margin: '6px 0 0', fontStyle: 'italic' },
  card: { background: '#ffffff', border: '0.5px solid #D3D1C7', borderRadius: '12px', padding: '20px' },
  cardLabel: { color: '#888780', fontSize: '12px', fontWeight: '500', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.04em' },
  cardValue: { color: '#0C447C', fontSize: '24px', fontWeight: '500', margin: '0 0 4px' },
  cardPeriod: { color: '#888780', fontSize: '12px', margin: 0 },
  chartCard: { background: '#ffffff', border: '0.5px solid #D3D1C7', borderRadius: '12px', padding: '24px', marginBottom: '24px' },
  chartTitle: { color: '#0C447C', fontSize: '15px', fontWeight: '500', margin: '0 0 20px' },
};

export default DashboardView;