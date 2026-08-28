import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';

//Historical Trends component fetches and displays financial trends for a selected company across reporting periods
function HistoricalTrends() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [trendsData, setTrendsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profitability');

  // Fetch companies when component loads
  useEffect(() => {
    const fetchCompanies = async () => {
  // API call to fetch list of companies for the dropdown
  // used to identify which company's trends to display
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

  // Fetch trends data when a company is selected
  useEffect(() => {
    if (!selectedCompany) return;
    const fetchTrendsData = async () => {
      setLoading(true);
      setError('');
// API call to fetch trends data for the selected company, identified by company_id
      try {
        const response = await axios.get(
          `http://localhost/financial_analysis/api/get_dashboard_data.php?company_id=${selectedCompany}`
        );
        setTrendsData(response.data);
      } catch (err) {
        setError('Failed to load trends data');
      } finally {
        setLoading(false);
      }
    };
    fetchTrendsData();
  }, [selectedCompany]);

  // Prepare profitability data for charts - convert ratios to percentages and format to 2 decimal places
  const profitabilityData = trendsData?.data.map((row) => ({
    period: row.reporting_period,
    'Profit margin %': parseFloat((row.profit_margin * 100).toFixed(2)),
    'Return on assets %': parseFloat((row.return_on_assets * 100).toFixed(2)),
  }));

  // Prepare liquidity data for charts - format to 2 decimal places
  const liquidityData = trendsData?.data.map((row) => ({
    period: row.reporting_period,
    'Current ratio': parseFloat(parseFloat(row.current_ratio).toFixed(2)),
    'Quick ratio': parseFloat(parseFloat(row.quick_ratio).toFixed(2)),
  }));

  // Prepare leverage data for charts - format to 2 decimal places
  const leverageData = trendsData?.data.map((row) => ({
    period: row.reporting_period,
    'Debt to equity': parseFloat(parseFloat(row.debt_to_equity).toFixed(2)),
    'Debt ratio': parseFloat(parseFloat(row.debt_ratio).toFixed(2)),
  }));

  // Prepare revenue data for area chart - format to 2 decimal places
  const revenueData = trendsData?.data.map((row) => ({
    period: row.reporting_period,
    Revenue: parseFloat(row.revenue),
    'Net profit': parseFloat(row.net_profit),
  }));

  // Define the tabs for different ratio categories and revenue, allowing users to switch charts between them
  const tabs = [
    { key: 'profitability', label: 'Profitability' },
    { key: 'liquidity', label: 'Liquidity' },
    { key: 'leverage', label: 'Leverage' },
    { key: 'revenue', label: 'Revenue' },
  ];
// Function to render the appropriate chart based on the active tab selected by the user
  const renderChart = () => {
    switch (activeTab) {
      case 'profitability':
        return (
          <div style={styles.chartCard}>
            <h4 style={styles.chartTitle}>Profitability ratios over time</h4>
            <p style={styles.chartSub}>Profitability is the ability of a company or business to generate revenue over and above its expenses.Profit margin and return on assets expressed as percentages</p>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={profitabilityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1EFE8" />
                <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} unit="%" />
                <Tooltip formatter={(value) => value + '%'} />
                <Legend />
                // Line charts for profit margin and return on assets with different colors and styling
                <Line type="monotone" dataKey="Profit margin %" stroke="#185FA5" strokeWidth={2} dot={{ r: 5 }} activeDot={{ r: 7 }} />
                <Line type="monotone" dataKey="Return on assets %" stroke="#1D9E75" strokeWidth={2} dot={{ r: 5 }} activeDot={{ r: 7 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      case 'liquidity':
        return (
          <div style={styles.chartCard}>
            <h4 style={styles.chartTitle}>Liquidity ratios over time</h4>
            <p style={styles.chartSub}>Liquidity ratios measure a company's ability to convert its assets into cash quickly to cover its current liabilities. Consist of current ratio and quick ratio. Value greater than1 indicates the company can meet short term targets</p>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={liquidityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1EFE8" />
                <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                // Line charts for current ratio and quick ratio with different colors and styling
                <Line type="monotone" dataKey="Current ratio" stroke="#185FA5" strokeWidth={2} dot={{ r: 5 }} activeDot={{ r: 7 }} />
                <Line type="monotone" dataKey="Quick ratio" stroke="#D85A30" strokeWidth={2} dot={{ r: 5 }} activeDot={{ r: 7 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      case 'leverage':
        return (
          <div style={styles.chartCard}>
            <h4 style={styles.chartTitle}>Leverage ratios over time</h4>
            <p style={styles.chartSub}> The leverage ratios provide an indication of how the company’s assets and business operations are financed (using Debt to equity and debt ratio.) lower values indicate less financial risk</p>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={leverageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1EFE8" />
                <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                // Line charts for debt to equity and debt ratio with different colors and styling
                <Line type="monotone" dataKey="Debt to equity" stroke="#BA7517" strokeWidth={2} dot={{ r: 5 }} activeDot={{ r: 7 }} />
                <Line type="monotone" dataKey="Debt ratio" stroke="#A32D2D" strokeWidth={2} dot={{ r: 5 }} activeDot={{ r: 7 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      case 'revenue':
        return (
          <div style={styles.chartCard}>
            <h4 style={styles.chartTitle}>Revenue and net profit over time</h4>
            <p style={styles.chartSub}>Revenue is the total money a company earns and is recorded as sales on a company's income statement. Area chart showing revenue and net profit growth across reporting periods</p>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1EFE8" />
                <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                // Area charts for revenue and net profit with different colors and styling
                <Area type="monotone" dataKey="Revenue" stroke="#185FA5" fill="#E6F1FB" strokeWidth={2} />
                <Area type="monotone" dataKey="Net profit" stroke="#1D9E75" fill="#E1F5EE" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        );
      default:
        return null;
    }
  };
// Function to render the empty state when no company is selected 
// prompting the user to select a company and upload data if needed
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Historical trends</h2>
          <p style={styles.sub}>Analyse financial trends across reporting periods for a selected company</p>
        </div>
        // Dropdown to select a company and view its trends, populated with data fetched from the server
        <select
          style={styles.select}
          value={selectedCompany}
          onChange={(e) => setSelectedCompany(e.target.value)}
        >
        // Default option prompting user to select a company
        // followed by options generated from the companies state
          <option value="">-- Select a company --</option>
          {companies.map((c) => (
            <option key={c.company_id} value={c.company_id}>
              {c.company_name}
            </option>
          ))}
        </select>
      </div>

      {error && <p style={styles.error}>{error}</p>}
      {loading && <p style={styles.loading}>Loading trends data...</p>}

// Empty state when no company is selected
      {!selectedCompany && !loading && (
        <div style={styles.emptyState}>
          <p style={styles.emptyText}>Please select a company to view its historical trends</p>
          <p style={styles.emptySub}>Upload a CSV file with multiple reporting periods to see trends</p>
        </div>
      )}

      {trendsData && !loading && (
        <>
          <h3 style={styles.companyName}>{trendsData.company_name}</h3>

          /* Tab navigation */
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

          {/* Chart based on active tab */}
          {renderChart()}

          {/* Summary table */}
          <div style={styles.tableCard}>
            <h4 style={styles.tableTitle}>Full ratio summary</h4>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Period</th>
                  <th style={styles.th}>Profit margin</th>
                  <th style={styles.th}>ROA</th>
                  <th style={styles.th}>Current ratio</th>
                  <th style={styles.th}>Quick ratio</th>
                  <th style={styles.th}>Debt to equity</th>
                  <th style={styles.th}>Debt ratio</th>
                </tr>
              </thead>
              <tbody>
                {trendsData.data.map((row, index) => (
                  <tr key={index} style={index % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                    <td style={styles.td}>{row.reporting_period}</td>
                    <td style={styles.td}>{(row.profit_margin * 100).toFixed(2)}%</td>
                    <td style={styles.td}>{(row.return_on_assets * 100).toFixed(2)}%</td>
                    <td style={styles.td}>{parseFloat(row.current_ratio).toFixed(2)}</td>
                    <td style={styles.td}>{parseFloat(row.quick_ratio).toFixed(2)}</td>
                    <td style={styles.td}>{parseFloat(row.debt_to_equity).toFixed(2)}</td>
                    <td style={styles.td}>{parseFloat(row.debt_ratio).toFixed(2)}</td>
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
// Styles for Historical Trends component
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
  tabs: { display: 'flex', gap: '8px', marginBottom: '24px' },
  tab: { background: 'transparent', border: '0.5px solid #D3D1C7', borderRadius: '8px', padding: '8px 20px', fontSize: '13px', cursor: 'pointer', color: '#5F5E5A' },
  tabActive: { background: '#185FA5', color: '#ffffff', border: '0.5px solid #185FA5' },
  chartCard: { background: '#ffffff', border: '0.5px solid #D3D1C7', borderRadius: '12px', padding: '24px', marginBottom: '24px' },
  chartTitle: { color: '#0C447C', fontSize: '15px', fontWeight: '500', margin: '0 0 6px' },
  chartSub: { color: '#888780', fontSize: '12px', margin: '0 0 20px' },
  tableCard: { background: '#ffffff', border: '0.5px solid #D3D1C7', borderRadius: '12px', padding: '24px', marginBottom: '24px', overflowX: 'auto' },
  tableTitle: { color: '#0C447C', fontSize: '15px', fontWeight: '500', margin: '0 0 16px' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
  th: { background: '#E6F1FB', color: '#0C447C', fontWeight: '500', padding: '10px 12px', textAlign: 'left', borderBottom: '0.5px solid #D3D1C7' },
  td: { padding: '10px 12px', borderBottom: '0.5px solid #F1EFE8', color: '#2C2C2A' },
  rowEven: { background: '#ffffff' },
  rowOdd: { background: '#F4F6FB' },
};

export default HistoricalTrends;