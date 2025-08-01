import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Eye, DollarSign } from 'lucide-react';
import StatsCard from './StatsCard';
import CalendarWidget from './CalendarWidget';
import { dashboardAPI } from '../../services/api';

const DashboardContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const DashboardHeader = styled.div`
  margin-bottom: 30px;
`;

const Title = styled.h1`
  color: #333;
  font-size: 28px;
  font-weight: 600;
  margin: 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const ChartSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
`;

const ChartTitle = styled.h3`
  color: #333;
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 20px 0;
`;

const BottomSection = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ActivitySection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const ActivityTitle = styled.h3`
  color: #333;
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 20px 0;
`;

const ActivityList = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ActivityIcon = styled.div<{ type: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  background: ${props => 
    props.type === 'item' ? '#e3f2fd' : 
    props.type === 'user' ? '#f3e5f5' : '#e8f5e8'};
  color: ${props => 
    props.type === 'item' ? '#1976d2' : 
    props.type === 'user' ? '#7b1fa2' : '#388e3c'};
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityText = styled.div`
  color: #333;
  font-weight: 500;
  margin-bottom: 4px;
`;

const ActivityTime = styled.div`
  color: #666;
  font-size: 12px;
`;

interface DashboardStats {
  overview: {
    totalItems: number;
    totalUsers: number;
    activeItems: number;
    activeUsers: number;
  };
  growth: {
    sales: number;
    users: number;
    pageVisits: number;
  };
  chartData: Array<{
    date: string;
    items: number;
    users: number;
    revenue: number;
    pageViews: number;
  }>;
}

interface Activity {
  type: string;
  action: string;
  title: string;
  user: string;
  timestamp: string;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsResponse, activitiesResponse] = await Promise.all([
          dashboardAPI.getStats(),
          dashboardAPI.getRecentActivity()
        ]);
        
        setStats(statsResponse.data);
        setActivities(activitiesResponse.data.activities);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (loading) {
    return (
      <DashboardContainer>
        <div>Loading dashboard...</div>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <DashboardHeader>
        <Title>Dashboard</Title>
      </DashboardHeader>

      <StatsGrid>
        <StatsCard
          title="Sales"
          value={`+${stats?.growth.sales || 95}%`}
          icon={<TrendingUp size={24} />}
          trend="up"
          color="#4caf50"
        />
        <StatsCard
          title="Users"
          value={`+${stats?.growth.users || 70}%`}
          icon={<Users size={24} />}
          trend="up"
          color="#2196f3"
        />
        <StatsCard
          title="Page visits"
          value={`+${stats?.growth.pageVisits || 10}%`}
          icon={<Eye size={24} />}
          trend="up"
          color="#ff9800"
        />
      </StatsGrid>

      <ChartSection>
        <ChartTitle>Performance Overview</ChartTitle>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={stats?.chartData || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#4caf50" 
              strokeWidth={2}
              dot={{ fill: '#4caf50', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="users" 
              stroke="#2196f3" 
              strokeWidth={2}
              dot={{ fill: '#2196f3', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartSection>

      <BottomSection>
        <ActivitySection>
          <ActivityTitle>Recent Activity</ActivityTitle>
          <ActivityList>
            {activities.map((activity, index) => (
              <ActivityItem key={index}>
                <ActivityIcon type={activity.type}>
                  {activity.type === 'item' ? '📊' : '👤'}
                </ActivityIcon>
                <ActivityContent>
                  <ActivityText>
                    {activity.title} - {activity.action}
                  </ActivityText>
                  <ActivityTime>
                    by {activity.user} • {formatTime(activity.timestamp)}
                  </ActivityTime>
                </ActivityContent>
              </ActivityItem>
            ))}
          </ActivityList>
        </ActivitySection>

        <CalendarWidget />
      </BottomSection>
    </DashboardContainer>
  );
};

export default Dashboard;