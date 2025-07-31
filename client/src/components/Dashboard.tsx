import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart3, Users, TrendingUp, Calendar, Settings, Home, MessageSquare, User } from 'lucide-react';

interface Metrics {
  sales: {
    value: string;
    trend: string;
    description: string;
  };
  users: {
    value: string;
    trend: string;
    description: string;
  };
  pageViews: {
    value: string;
    trend: string;
    description: string;
  };
}

interface ChartData {
  salesChart: Array<{ month: string; value: number }>;
  userChart: Array<{ week: string; users: number }>;
}

interface TableData {
  id: number;
  name: string;
  views: number;
  conversion: string;
  revenue: string;
}

interface DashboardData {
  metrics: Metrics;
  charts: ChartData;
  table: TableData[];
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/analytics/dashboard');
        setData(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          EvenRaw
        </div>
        <nav>
          <ul className="sidebar-nav">
            <li>
              <a href="#" className="active">
                <Home />
                Dashboard
              </a>
            </li>
            <li>
              <a href="#">
                <BarChart3 />
                Analytics
              </a>
            </li>
            <li>
              <a href="#">
                <Users />
                Users
              </a>
            </li>
            <li>
              <a href="#">
                <TrendingUp />
                Reports
              </a>
            </li>
            <li>
              <a href="#">
                <Calendar />
                Events
              </a>
            </li>
            <li>
              <a href="#">
                <MessageSquare />
                Messages
              </a>
            </li>
            <li>
              <a href="#">
                <Settings />
                Settings
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="dashboard-header">
          <h1 className="dashboard-title">Dashboard</h1>
          <div className="user-profile">
            <User size={20} />
            <span>John Doe</span>
          </div>
        </header>

        {/* Metrics Grid */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-value">{data?.metrics.sales.value}</div>
            <div className="metric-label">Sales</div>
          </div>
          <div className="metric-card">
            <div className="metric-value">{data?.metrics.users.value}</div>
            <div className="metric-label">Users</div>
          </div>
          <div className="metric-card">
            <div className="metric-value">{data?.metrics.pageViews.value}</div>
            <div className="metric-label">Page Views</div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="content-grid">
          {/* Chart Section */}
          <div className="chart-container">
            <h3 className="chart-title">Sales Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data?.charts.salesChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{
                    background: 'rgba(255,255,255,0.9)',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#66BB6A" 
                  strokeWidth={3}
                  dot={{ fill: '#66BB6A', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Small Chart */}
          <div className="chart-container">
            <h3 className="chart-title">User Growth</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data?.charts.userChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                <XAxis dataKey="week" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{
                    background: 'rgba(255,255,255,0.9)',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#FFA726" 
                  strokeWidth={3}
                  dot={{ fill: '#FFA726', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Data Table */}
        <div className="data-table">
          <h3 className="chart-title">Page Performance</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Page Name</th>
                <th>Views</th>
                <th>Conversion</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {data?.table.map((row) => (
                <tr key={row.id}>
                  <td>{row.name}</td>
                  <td>{row.views.toLocaleString()}</td>
                  <td>{row.conversion}</td>
                  <td>{row.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;